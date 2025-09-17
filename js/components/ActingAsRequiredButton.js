import { html } from '../lib/preact.standalone.module.js';
import Tooltip from './Tooltip.js';



export default function ActingAsRequiredButton({ gameState, getDisabledMessage, onClick, label, color, containerClass = 'btn-container', buttonClass = 'mx-1' }) {
    const disabledMessage = getDisabledMessage(gameState);

    const buttonLines = label.split('\n');
    if (buttonLines.length > 1) {
        label = html`<div class="flex flex-col items-center">${buttonLines.map(line => html`<div style="white-space: nowrap;">${line}</div>`)}</div>`;
    }

    return !disabledMessage
        ? html`
            <div class="${containerClass}" style="">
                <button class="btn ${color} ${buttonClass}" onclick=${onClick}>${label}</button>
            </div>`
        : html`
            <${Tooltip} text=${disabledMessage} containerClass=${containerClass} style="">
                <button class="btn disabled ${buttonClass}">${label}</button>
            <//>
        `;
}
