import { html, useEffect, useRef, useState, useCallback } from '../lib/preact.standalone.module.js';
import Tooltip from './Tooltip.js';
import Button from './Button.js';



export default function DisabledTooltipButton({ disabledMessage, onClick, onDisabledClick, label, color, containerClass = 'btn-container', buttonClass = 'mx-1', dataTutorial = null, extrasIndex = null, scopeActive = false }) {
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

    // Format label
    let displayLabel = label;
    if (extrasIndex !== null && scopeActive) {
        displayLabel = html`${extrasIndex}) ${label}`;
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
