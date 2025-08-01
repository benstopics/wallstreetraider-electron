import { html } from '../lib/preact.standalone.module.js';
import Tooltip from './Tooltip.js';



export default function ActingAsRequiredButton({ gameState, getDisabledMessage, onClick, label, color, containerClass = 'mt-2', buttonClass = 'mx-1' }) {
    const disabledMessage = getDisabledMessage(gameState);

    return !disabledMessage
        ? html`
            <div class="${containerClass}" style="height:25px">
                <button class="btn ${color} ${buttonClass}" onclick=${onClick}>${label}</button>
            </div>`
        : html`
            <${Tooltip} text=${disabledMessage} containerClass=${containerClass} style="height:25px">
                <button class="btn disabled ${buttonClass}">${label}</button>
            <//>
        `;
}
