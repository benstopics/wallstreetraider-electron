/**
 * Preact hooks for the centralized HotkeyManager.
 */

import { useEffect, useRef, useState } from '../lib/preact.standalone.module.js';
import { hotkeyManager } from '../hotkeyManager.js';

/**
 * Register a hotkey handler that auto-unregisters on unmount.
 *
 * @param {any}      id       – Stable identifier (use useRef(Symbol()) or a constant)
 * @param {number}   priority – From PRIORITY enum
 * @param {function} keyTest  – (e: KeyboardEvent) => boolean
 * @param {function} handler  – (e: KeyboardEvent) => boolean|void (true/undefined=consume, false=pass)
 * @param {object}   [opts]
 * @param {boolean}  [opts.active=true]
 * @param {object}   [opts.meta]
 * @param {Array}    [deps]   – Dependency array for updating the handler
 */
export function useHotkey(id, priority, keyTest, handler, opts = {}, deps = []) {
    const { active = true, meta = null } = opts;
    const handlerRef = useRef(handler);
    const keyTestRef = useRef(keyTest);
    handlerRef.current = handler;
    keyTestRef.current = keyTest;

    // Register on mount, unregister on unmount
    useEffect(() => {
        const unregister = hotkeyManager.register({
            id,
            priority,
            keyTest: (e) => keyTestRef.current(e),
            handler: (e) => handlerRef.current(e),
            active,
            meta,
        });
        return unregister;
    }, [id, priority]); // Only re-register if id or priority changes

    // Update active/meta when they change
    useEffect(() => {
        hotkeyManager.update(id, { active, meta });
    }, [id, active, meta && JSON.stringify(meta)]);

    // Update keyTest/handler refs are already current via ref pattern,
    // but allow explicit updates for deps that change keyTest behavior
    useEffect(() => {
        hotkeyManager.update(id, {
            keyTest: (e) => keyTestRef.current(e),
            handler: (e) => handlerRef.current(e),
        });
    }, deps);
}

/**
 * Subscribe to the centralized SHIFT key state.
 * @returns {boolean} Whether SHIFT is currently held.
 */
export function useShiftHeld() {
    const [held, setHeld] = useState(hotkeyManager.shiftHeld);

    useEffect(() => {
        // Sync initial state
        setHeld(hotkeyManager.shiftHeld);
        return hotkeyManager.onShiftChange(setHeld);
    }, []);

    return held;
}

/**
 * Subscribe to the digit buffer for preview display.
 * @returns {{ buffer: string, confirmed: boolean }}
 */
export function useDigitPreview() {
    const [state, setState] = useState({ buffer: '', confirmed: false });

    useEffect(() => {
        return hotkeyManager.onDigitChange(setState);
    }, []);

    return state;
}

/**
 * Query whether any active handler above `belowPriority` would claim keys
 * matching `keyTestFn`. Re-evaluates when registrations change.
 *
 * @param {function} keyTestFn     – (handler) => boolean
 * @param {number}   belowPriority – Only check handlers above this
 * @param {Array}    [deps]        – Additional dependencies
 * @returns {boolean}
 */
export function useIsKeyClaimed(keyTestFn, belowPriority, deps = []) {
    const fnRef = useRef(keyTestFn);
    fnRef.current = keyTestFn;

    const [claimed, setClaimed] = useState(() =>
        hotkeyManager.isKeyClaimed(fnRef.current, belowPriority)
    );

    useEffect(() => {
        const check = () => setClaimed(hotkeyManager.isKeyClaimed(fnRef.current, belowPriority));
        check();
        return hotkeyManager.onChange(check);
    }, [belowPriority, ...deps]);

    return claimed;
}
