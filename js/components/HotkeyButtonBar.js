import { html, useEffect, useRef, useState } from '../lib/preact.standalone.module.js';
import { useShiftHeld } from '../hooks/useHotkey.js';
import { PRIORITY, hotkeyManager } from '../hotkeyManager.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';

/**
 * A button bar with numbered hotkey buttons.
 *
 * Each button is numbered (1, 2, 3, ...) and number keys trigger the corresponding
 * button's click via hotkey-tab events. SHIFT shows visual number prefixes.
 *
 * @param {Object} props
 * @param {Array} props.buttons - Array of button prop objects (same shape as DisabledTooltipButton props).
 *   Pass `false`/`null`/`undefined` entries to conditionally exclude buttons (they are filtered out).
 * @param {Object} [props.extrasContainerRef] - Ref to DOM container with extras buttons (data-extras-idx attributes).
 * @param {Object} [props.scopeActiveRef] - Ref object that will be set to true (for sibling components like renderExtras).
 * @param {string} [props.class] - Optional CSS class for the container div.
 * @param {string} [props.style] - Optional inline style for the container div.
 */
export default function HotkeyButtonBar({ buttons, extrasContainerRef, scopeActiveRef, onScopeActiveChange, panelCount = 0, class: className = 'flex flex-row items-center gap-2 mb-2', style = 'height: 35px;' }) {
    const shiftHeld = useShiftHeld();
    const [flashMessage, setFlashMessage] = useState(null);
    const flashTimeoutRef = useRef(null);

    // Filter out falsy entries (from conditional rendering)
    const activeButtons = (buttons || []).filter(Boolean);

    // Show a brief flash message (auto-hides after 2s)
    const showFlash = (message) => {
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        setFlashMessage(message);
        flashTimeoutRef.current = setTimeout(() => setFlashMessage(null), 2000);
    };

    // Always active when mounted — expose via ref for sibling components (renderExtras)
    if (scopeActiveRef) scopeActiveRef.current = true;

    // Register immediateCount in the centralized HotkeyManager (for digit buffer routing)
    const barHotkeyIdRef = useRef(Symbol('button-bar-meta'));
    useEffect(() => {
        const unregister = hotkeyManager.register({
            id: barHotkeyIdRef.current,
            priority: PRIORITY.BUTTON_BAR,
            keyTest: () => false,
            handler: () => false,
            active: true,
            meta: { immediateCount: activeButtons.length + panelCount },
        });
        return unregister;
    }, [activeButtons.length, panelCount]);

    // Notify parent on mount
    useEffect(() => {
        onScopeActiveChange?.(true);
    }, []);

    // Listen for hotkey-tab events (number keys)
    useEffect(() => {
        const handler = (e) => {
            const idx = e.detail?.index;
            if (typeof idx !== 'number' || idx < 0) return;

            // Bar buttons (direct activation)
            if (idx < activeButtons.length) {
                const btn = activeButtons[idx];
                if (!btn) return;
                if (!btn.disabledMessage && btn.onClick) {
                    btn.onClick();
                } else if (btn.onDisabledClick) {
                    btn.onDisabledClick();
                } else if (btn.disabledMessage) {
                    // Button is disabled with no click handler - show the message
                    showFlash(btn.disabledMessage);
                }
                return;
            }

            // Panel selection (SHIFT+N for panel-range numbers)
            if (panelCount > 0 && idx < activeButtons.length + panelCount) {
                document.dispatchEvent(new CustomEvent('hotkey-panel-select', {
                    detail: { panelNumber: idx + 1 }
                }));
                return;
            }

            // Extras buttons (via DOM query)
            if (extrasContainerRef?.current) {
                const extrasNum = idx + 1; // Convert 0-based index to 1-based display number
                const el = extrasContainerRef.current.querySelector(`[data-extras-idx="${extrasNum}"]`);
                if (el) el.click();
            }
        };
        document.addEventListener('hotkey-tab', handler);
        return () => document.removeEventListener('hotkey-tab', handler);
    }, [activeButtons, extrasContainerRef, panelCount]);

    return html`
        <div class="${className}" style="${style}">
            ${activeButtons.map((btn, i) => {
                const num = i < 9 ? `${i + 1}` : i === 9 ? '0' : null;
                // Show Shift+N prefix when SHIFT is held
                const prefix = shiftHeld && num !== null
                    ? html`<span style="opacity:0.45;margin-right:2px;">${num})</span>`
                    : '';
                return html`<${DisabledTooltipButton}
                    ...${btn}
                    label=${html`${prefix}${btn.label}`}
                />`;
            })}
            ${flashMessage ? html`<span class="text-red-300 text-sm ml-2"
                style="animation: fadeIn 0.15s ease-out;">${flashMessage}</span>` : ''}
        </div>
    `;
}
