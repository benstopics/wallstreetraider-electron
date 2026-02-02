import { html } from '../lib/preact.standalone.module.js';
import Tooltip from './Tooltip.js';
import Button from './Button.js';



export default function DisabledTooltipButton({ disabledMessage, onClick, onDisabledClick, label, color, containerClass = 'btn-container', buttonClass = 'mx-1', dataTutorial = null }) {
    const buttonLines = label.split('\n');
    if (buttonLines.length > 1) {
        label = html`<div class="flex flex-col items-center">${buttonLines.map(line => html`<div style="white-space: nowrap;">${line}</div>`)}</div>`;
    }

    // When disabled with a click handler: show as clickable (use the color, not 'disabled' class)
    // When disabled without a click handler: show as truly disabled (both visually and functionally)
    const hasClickHandler = !!onDisabledClick;
    const disabledClass = hasClickHandler ? (color || 'disabled') : 'disabled';

    return !disabledMessage
        ? html`
            <div class="${containerClass}" style="" data-tutorial=${dataTutorial || undefined}>
                <${Button} class="btn ${color} ${buttonClass}" onclick=${onClick}>${label}</button>
            </div>`
        : html`
            <${Tooltip} text=${disabledMessage} containerClass=${containerClass} style="" data-tutorial=${dataTutorial || undefined}>
                <${Button} class="btn ${disabledClass} ${buttonClass}" onclick=${onDisabledClick} disabled=${!hasClickHandler}>${label}</button>
            <//>
        `;
}
