import { html, useEffect, useRef, useState } from '../lib/preact.standalone.module.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';

/**
 * A button bar with numbered hotkey buttons.
 *
 * Each button is numbered (1, 2, 3, ...) and number keys trigger the corresponding
 * button's click via hotkey-tab events. Number prefixes are always visible.
 *
 * @param {Object} props
 * @param {Array} props.buttons - Array of button prop objects (same shape as DisabledTooltipButton props).
 *   Pass `false`/`null`/`undefined` entries to conditionally exclude buttons (they are filtered out).
 * @param {Object} [props.extrasContainerRef] - Ref to DOM container with extras buttons (data-extras-idx attributes).
 * @param {Object} [props.scopeActiveRef] - Ref object that will be set to true (for sibling components like renderExtras).
 * @param {string} [props.class] - Optional CSS class for the container div.
 * @param {string} [props.style] - Optional inline style for the container div.
 */
export default function HotkeyButtonBar({ buttons, extrasContainerRef, scopeActiveRef, onScopeActiveChange, class: className = 'flex flex-row items-center gap-2 mb-2 flex-wrap flex-shrink-0', style = 'min-height: 35px;' }) {
    const [flashMessage, setFlashMessage] = useState(null);
    const flashTimeoutRef = useRef(null);

    // Filter out falsy entries (from conditional rendering), but keep divider objects
    const rawButtons = (buttons || []).filter(Boolean);

    // Show a brief flash message (auto-hides after 2s)
    const showFlash = (message) => {
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        setFlashMessage(message);
        flashTimeoutRef.current = setTimeout(() => setFlashMessage(null), 2000);
    };

    // Always active when mounted — expose via ref for sibling components (renderExtras)
    if (scopeActiveRef) scopeActiveRef.current = true;

    // Notify parent on mount
    useEffect(() => {
        onScopeActiveChange?.(true);
    }, []);

    return html`
        <div class="${className}" style="${style}">
            ${rawButtons.map((btn, i) => {
                if (btn.divider) {
                    return html`<div key=${'d' + i} style="width:1px;height:20px;background:rgba(255,255,255,0.15);margin:0 4px;align-self:center;" />`;
                }
                return html`<${DisabledTooltipButton}
                    ...${btn}
                />`;
            })}
            ${flashMessage ? html`<span class="text-red-300 text-sm ml-2"
                style="animation: fadeIn 0.15s ease-out;">${flashMessage}</span>` : ''}
        </div>
    `;
}
