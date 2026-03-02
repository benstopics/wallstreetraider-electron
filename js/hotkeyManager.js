/**
 * Centralized Hotkey Manager
 *
 * Single capture-phase keydown listener on document. All components register
 * handlers with priorities; the manager dispatches to the highest-priority
 * active handler that matches the key event.
 *
 * Also owns:
 *  - SHIFT key tracking (shared across ActionBar, HotkeyButtonBar, Toolbar)
 *  - Digit buffer (line-select immediate, bar-button immediate, debounced extras)
 *  - `isKeyClaimed()` queries so lower-priority components can show visual state
 */

// No imports needed — digit routing dispatches DOM events consumed by legacy listeners.

// ---------------------------------------------------------------------------
// Priority levels – higher number = earlier dispatch
// ---------------------------------------------------------------------------
export const PRIORITY = {
    MODAL: 100,
    DROPDOWN: 80,
    LINE_SELECTION: 60,
    BUTTON_BAR: 40,
    TABS: 30,
    GLOBAL: 10,
};

// ---------------------------------------------------------------------------
// Digit buffer constants
// ---------------------------------------------------------------------------
const DIGIT_TIMEOUT_MS = 800;

// ---------------------------------------------------------------------------
// HotkeyManager
// ---------------------------------------------------------------------------
class HotkeyManager {
    constructor() {
        /** @type {Array<{id: any, priority: number, keyTest: function, handler: function, active: boolean, meta: object|null}>} */
        this.handlers = [];

        // SHIFT tracking
        this.shiftHeld = false;
        /** @type {Set<function>} */
        this._shiftListeners = new Set();

        // Digit buffer
        this.digitBuffer = '';
        this._digitTimeout = null;
        /** @type {Set<function>} */
        this._digitListeners = new Set();

        // Registration change listeners (for isKeyClaimed re-evaluation)
        /** @type {Set<function>} */
        this._changeListeners = new Set();

        this._initialized = false;
        this.disabled = false;
    }

    // ------------------------------------------------------------------
    // Lifecycle
    // ------------------------------------------------------------------

    /** Enable/disable all hotkey dispatch (except modal-priority handlers). */
    setDisabled(disabled) {
        this.disabled = disabled;
        if (disabled) {
            this._setShift(false);
            this.clearDigitBuffer();
        }
    }

    /** Call once at app startup to attach the global listener. */
    init() {
        if (this._initialized) return;
        this._initialized = true;
        document.addEventListener('keydown', this._onKeyDown, true); // capture phase
        document.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('blur', this._onBlur);
    }

    // ------------------------------------------------------------------
    // Handler registration
    // ------------------------------------------------------------------

    /**
     * Register a hotkey handler.
     *
     * @param {object}   opts
     * @param {any}      opts.id       – Unique identifier (Symbol recommended)
     * @param {number}   opts.priority – From PRIORITY enum
     * @param {function} opts.keyTest  – (e: KeyboardEvent) => boolean
     * @param {function} opts.handler  – (e: KeyboardEvent) => boolean|void
     *                                    Return true (or undefined) to consume, false to pass through.
     * @param {boolean}  [opts.active=true]
     * @param {object}   [opts.meta]   – Arbitrary metadata (e.g. lineSelectMode, validLines, immediateCount)
     * @returns {function} Unregister function.
     */
    register({ id, priority, keyTest, handler, active = true, meta = null }) {
        // Remove any existing registration with same id
        this.handlers = this.handlers.filter(h => h.id !== id);

        const entry = { id, priority, keyTest, handler, active, meta };
        this.handlers.push(entry);
        this.handlers.sort((a, b) => b.priority - a.priority);
        this._notifyChange();

        return () => {
            this.handlers = this.handlers.filter(h => h !== entry);
            this._notifyChange();
        };
    }

    /**
     * Update a handler's properties by id.
     * Useful for toggling active state or updating meta without re-registering.
     */
    update(id, patch) {
        const entry = this.handlers.find(h => h.id === id);
        if (!entry) return;
        let changed = false;
        if ('active' in patch && entry.active !== patch.active) {
            entry.active = patch.active;
            changed = true;
        }
        if ('meta' in patch) {
            entry.meta = { ...entry.meta, ...patch.meta };
        }
        if ('keyTest' in patch) {
            entry.keyTest = patch.keyTest;
            changed = true;
        }
        if ('handler' in patch) {
            entry.handler = patch.handler;
        }
        if (changed) this._notifyChange();
    }

    // ------------------------------------------------------------------
    // Queries
    // ------------------------------------------------------------------

    /**
     * Check if any active handler with priority > `belowPriority` would
     * match the given key test function. Used by lower-priority components
     * to show visual "suppressed" state.
     *
     * @param {function} keyTestFn – (handler) => boolean – return true if the handler's key space overlaps yours
     * @param {number}   belowPriority – Only check handlers above this priority
     * @returns {boolean}
     */
    isKeyClaimed(keyTestFn, belowPriority) {
        return this.handlers.some(h =>
            h.active && h.priority > belowPriority && keyTestFn(h)
        );
    }

    /** Subscribe to registration/activation changes. Returns unsubscribe fn. */
    onChange(fn) {
        this._changeListeners.add(fn);
        return () => this._changeListeners.delete(fn);
    }

    // ------------------------------------------------------------------
    // SHIFT tracking
    // ------------------------------------------------------------------

    /** Subscribe to SHIFT key state changes. Returns unsubscribe fn. */
    onShiftChange(fn) {
        this._shiftListeners.add(fn);
        return () => this._shiftListeners.delete(fn);
    }

    _setShift(held) {
        if (this.shiftHeld === held) return;
        this.shiftHeld = held;
        this._shiftListeners.forEach(fn => fn(held));
    }

    // ------------------------------------------------------------------
    // Digit buffer
    // ------------------------------------------------------------------

    /** Subscribe to digit buffer changes. Returns unsubscribe fn. */
    onDigitChange(fn) {
        this._digitListeners.add(fn);
        return () => this._digitListeners.delete(fn);
    }

    clearDigitBuffer() {
        this.digitBuffer = '';
        if (this._digitTimeout) { clearTimeout(this._digitTimeout); this._digitTimeout = null; }
        this._notifyDigitListeners('', false);
    }

    confirmDigitBuffer() {
        if (!this.digitBuffer) return;
        const num = parseInt(this.digitBuffer, 10);
        if (this._digitTimeout) { clearTimeout(this._digitTimeout); this._digitTimeout = null; }
        this.digitBuffer = '';
        this._dispatchDigitConfirm(num);
        this._notifyDigitListeners('', true);
    }

    /**
     * Handle a digit keypress. Routes through registered handlers' metadata
     * to decide between immediate dispatch and buffered debounce.
     * Called by the GLOBAL handler in app.js for TAB_N hotkey matches.
     */
    handleDigit(digit) {
        // Find the highest-priority active handler that has digit-related meta
        for (const h of this.handlers) {
            if (!h.active || !h.meta) continue;

            // Line-select mode: immediate selection
            if (h.meta.lineSelectMode && h.meta.validLines) {
                this._handleLineSelectDigit(digit, h.meta.validLines);
                return;
            }
        }

        // Standard tab/bar handling
        const immediateCount = this._getImmediateCount();
        const prospective = this.digitBuffer + digit;
        const prospectiveNum = parseInt(prospective, 10);

        // Treat bare "0" as 10 (10th button, displayed as "0)")
        const effectiveNum = (!this.digitBuffer && prospective === '0') ? 10 : prospectiveNum;

        // If no buffer and within immediate range, fire immediately
        if (!this.digitBuffer && effectiveNum <= immediateCount) {
            this._dispatchDigitConfirm(effectiveNum);
            return;
        }

        // Accumulate in buffer (debounce)
        this.digitBuffer = prospective;
        this._notifyDigitListeners(this.digitBuffer, false);

        if (this._digitTimeout) clearTimeout(this._digitTimeout);
        this._digitTimeout = setTimeout(() => this.confirmDigitBuffer(), DIGIT_TIMEOUT_MS);
    }

    /**
     * Line-select mode digit handling: immediate selection with prefix matching.
     * Dispatches hotkey-line-select DOM events for SelectableLines listeners.
     */
    _handleLineSelectDigit(digit, validLines) {
        const prospective = this.digitBuffer + digit;
        const prospectiveNum = parseInt(prospective, 10);

        if (validLines.has(prospectiveNum)) {
            this.digitBuffer = prospective;
            document.dispatchEvent(new CustomEvent('hotkey-line-select', { detail: { lineNumber: prospectiveNum } }));
        } else if (prospective.length < 3) {
            const hasPrefix = Array.from(validLines).some(n => String(n).startsWith(prospective));
            if (hasPrefix) {
                this.digitBuffer = prospective;
            } else {
                this.digitBuffer = digit;
                const singleNum = parseInt(digit, 10);
                if (validLines.has(singleNum)) {
                    document.dispatchEvent(new CustomEvent('hotkey-line-select', { detail: { lineNumber: singleNum } }));
                }
            }
        } else {
            this.digitBuffer = digit;
            const singleNum = parseInt(digit, 10);
            if (validLines.has(singleNum)) {
                document.dispatchEvent(new CustomEvent('hotkey-line-select', { detail: { lineNumber: singleNum } }));
            }
        }
    }

    /** Get the immediate count from the highest-priority handler that defines it. */
    _getImmediateCount() {
        for (const h of this.handlers) {
            if (!h.active || !h.meta) continue;
            if (typeof h.meta.immediateCount === 'number') return h.meta.immediateCount;
        }
        return Infinity;
    }

    /** Dispatch a confirmed digit (as 1-based index) via hotkey-tab DOM event. */
    _dispatchDigitConfirm(num) {
        const idx = num - 1; // Convert to 0-based
        document.dispatchEvent(new CustomEvent('hotkey-tab', { detail: { index: idx } }));
    }

    _notifyDigitListeners(buffer, confirmed) {
        this._digitListeners.forEach(fn => fn({ buffer, confirmed }));
    }

    // ------------------------------------------------------------------
    // Core keydown dispatch
    // ------------------------------------------------------------------

    _onKeyDown = (e) => {
        // When hotkeys are disabled, only allow MODAL-priority handlers (dialog Y/N/C/Esc)
        // and spacebar (ticker toggle)
        if (this.disabled) {
            for (const h of this.handlers) {
                if (!h.active) continue;
                if (h.priority < PRIORITY.MODAL) break; // sorted desc, stop at non-modal
                if (!h.keyTest(e)) continue;
                const result = h.handler(e);
                if (result !== false) return;
            }
            if (e.key !== ' ' && e.key !== '/') return; // allow spacebar and / to fall through
        }

        // SHIFT tracking — suppress when user is typing in an input/textarea/select
        // (prevents bracket labels from appearing behind modals when typing capitals)
        if (e.key === 'Shift') {
            const tag = (e.target?.tagName || '').toLowerCase();
            const inEditable = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target?.isContentEditable;
            if (!inEditable) {
                this._setShift(true);
            }
        }

        // Walk handlers in priority order
        for (const h of this.handlers) {
            if (!h.active) continue;
            if (!h.keyTest(e)) continue;
            const result = h.handler(e);
            if (result !== false) return; // consumed
        }
    };

    _onKeyUp = (e) => {
        if (e.key === 'Shift') this._setShift(false);
    };

    _onBlur = () => {
        this._setShift(false);
    };

    // ------------------------------------------------------------------
    // Internal notifications
    // ------------------------------------------------------------------

    _notifyChange() {
        this._changeListeners.forEach(fn => fn());
    }
}

// Singleton
export const hotkeyManager = new HotkeyManager();
