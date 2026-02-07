import { useState, useEffect, useRef, useMemo } from '../lib/preact.standalone.module.js';
import { useHotkey, useShiftHeld } from './useHotkey.js';
import { PRIORITY } from '../hotkeyManager.js';
import { isEditableTarget } from '../keybinds.js';

/**
 * Hook for chart-panel selection with letter hotkeys.
 *
 * Panels are numbered sequentially starting at `startNumber`.
 * When a panel is selected, letter keys dispatch `hotkey-extras-letter`
 * events so DisabledTooltipButton's existing listener handles them.
 *
 * @param {{ panelCount: number, startNumber: number }} opts
 * @returns {{ selectedPanelNumber: number|null, shiftHeld: boolean, panelNumbers: Set<number> }}
 */
export function usePanelSelection({ panelCount, startNumber }) {
    const [selectedPanelNumber, setSelectedPanelNumber] = useState(null);
    const selectedRef = useRef(null);
    selectedRef.current = selectedPanelNumber;

    const shiftHeld = useShiftHeld();

    // Build set of valid panel numbers
    const panelNumbers = useMemo(() => {
        const s = new Set();
        for (let i = 0; i < panelCount; i++) s.add(startNumber + i);
        return s;
    }, [panelCount, startNumber]);

    // Clear selection when panel range shifts and selected is no longer valid
    useEffect(() => {
        if (selectedPanelNumber !== null && !panelNumbers.has(selectedPanelNumber)) {
            setSelectedPanelNumber(null);
        }
    }, [panelNumbers]);

    // Listen for hotkey-line-select (plain digit routing via hotkeyManager)
    useEffect(() => {
        const handler = (e) => {
            const num = e.detail?.lineNumber;
            if (typeof num !== 'number') return;
            if (panelNumbers.has(num)) {
                setSelectedPanelNumber(num);
            } else {
                setSelectedPanelNumber(null);
            }
        };
        document.addEventListener('hotkey-line-select', handler);
        return () => document.removeEventListener('hotkey-line-select', handler);
    }, [panelNumbers]);

    // Listen for hotkey-panel-select (SHIFT+N routing via HotkeyButtonBar)
    useEffect(() => {
        const handler = (e) => {
            const num = e.detail?.panelNumber;
            if (typeof num === 'number' && panelNumbers.has(num)) {
                setSelectedPanelNumber(num);
            }
        };
        document.addEventListener('hotkey-panel-select', handler);
        return () => document.removeEventListener('hotkey-panel-select', handler);
    }, [panelNumbers]);

    // Hotkey handler: when panel selected, claim ESC + letter keys
    const hotkeyIdRef = useRef(Symbol('panel-selection'));
    const isActive = selectedPanelNumber !== null;

    useHotkey(
        hotkeyIdRef.current,
        PRIORITY.LINE_SELECTION + 1, // 61 — just above SelectableLines (60)
        (e) => {
            if (selectedRef.current === null) return false;
            if (isEditableTarget(e.target)) return false;
            if (e.key === 'Escape') return true;
            if (!e.altKey && !e.ctrlKey && !e.metaKey && /^[a-z]$/i.test(e.key)) return true;
            return false;
        },
        (e) => {
            if (e.key === 'Escape') {
                e.stopImmediatePropagation();
                e.preventDefault();
                setSelectedPanelNumber(null);
                return true;
            }
            const key = e.key.toLowerCase();
            if (/^[a-z]$/.test(key)) {
                e.stopImmediatePropagation();
                e.preventDefault();
                document.dispatchEvent(new CustomEvent('hotkey-extras-letter', {
                    detail: { letter: key, lineNumber: selectedRef.current }
                }));
                return true;
            }
            return false;
        },
        { active: isActive, meta: { claimsLetters: isActive } },
        [isActive]
    );

    return { selectedPanelNumber, setSelectedPanelNumber, shiftHeld, panelNumbers };
}
