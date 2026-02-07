import { html, useEffect, useRef, useState, useCallback } from '../lib/preact.standalone.module.js';
import Tooltip from './Tooltip.js';
import Button from './Button.js';
import { tabNumberLabel, bracketLabel } from '../hotkeys.js';



export default function DisabledTooltipButton({ disabledMessage, onClick, onDisabledClick, label, color, containerClass = 'btn-container', buttonClass = 'mx-1', dataTutorial = null, extrasIndex = null, scopeActive = false, hotkeyLetter = null, isLineSelected = false, lineNumber = null }) {
    const onClickRef = useRef(onClick);
    const onDisabledClickRef = useRef(onDisabledClick);
    onClickRef.current = onClick;
    onDisabledClickRef.current = onDisabledClick;

    const [forceShowTooltip, setForceShowTooltip] = useState(false);

    // Dismiss force-shown tooltip on any click or keypress
    useEffect(() => {
        if (!forceShowTooltip) return;
        const dismiss = () => setForceShowTooltip(false);
        document.addEventListener('click', dismiss, { once: true });
        document.addEventListener('keydown', dismiss, { once: true });
        return () => {
            document.removeEventListener('click', dismiss);
            document.removeEventListener('keydown', dismiss);
        };
    }, [forceShowTooltip]);

    // Listen for letter hotkey events when line is selected
    useEffect(() => {
        if (!hotkeyLetter || !isLineSelected) return;

        const handler = (e) => {
            if (e.detail?.lineNumber !== lineNumber) return;
            if (e.detail?.letter !== hotkeyLetter.toLowerCase()) return;

            // Trigger the appropriate click handler
            if (!disabledMessage && onClickRef.current) {
                onClickRef.current();
            } else if (onDisabledClickRef.current) {
                onDisabledClickRef.current();
            } else if (disabledMessage) {
                // Disabled with no click handler - show tooltip via hotkey
                setForceShowTooltip(true);
            }
        };
        document.addEventListener('hotkey-extras-letter', handler);
        return () => document.removeEventListener('hotkey-extras-letter', handler);
    }, [hotkeyLetter, isLineSelected, lineNumber, disabledMessage]);

    // Format label with hotkey letter or extras number
    let displayLabel = label;
    if (isLineSelected && hotkeyLetter && typeof label === 'string') {
        // Show bracketed letter when line is selected: [S]ell, [B]uy
        displayLabel = bracketLabel(label, hotkeyLetter);
    } else if (extrasIndex !== null && scopeActive) {
        // Prepend extras number label when active (old behavior for non-letter mode)
        displayLabel = html`${tabNumberLabel(extrasIndex)}${label}`;
    } else if (typeof label === 'string') {
        const buttonLines = label.split('\n');
        if (buttonLines.length > 1) {
            displayLabel = html`<div class="flex flex-col items-center">${buttonLines.map(line => html`<div style="white-space: nowrap;">${line}</div>`)}</div>`;
        }
    }

    // When disabled with a click handler: show as clickable with dashed colored border
    // When disabled without a click handler: show as truly disabled (both visually and functionally)
    const hasClickHandler = !!onDisabledClick;
    const disabledClass = hasClickHandler ? `disabled ${color || ''}` : 'disabled';

    return !disabledMessage
        ? html`
            <div class="${containerClass}" style="" data-tutorial=${dataTutorial || undefined}>
                <${Button} class="btn ${color} ${buttonClass}" onclick=${onClick} data-extras-idx=${extrasIndex != null ? extrasIndex : undefined}>${displayLabel}</button>
            </div>`
        : html`
            <${Tooltip} text=${disabledMessage} containerClass=${containerClass} forceShow=${forceShowTooltip} style="" data-tutorial=${dataTutorial || undefined}>
                <${Button} class="btn ${disabledClass} ${buttonClass}" onclick=${onDisabledClick} disabled=${!hasClickHandler} data-extras-idx=${extrasIndex != null ? extrasIndex : undefined}>${displayLabel}</button>
            <//>
        `;
}
