import { html } from '../lib/preact.standalone.module.js';
import Tooltip from './Tooltip.js';



export default function ActingAsRequiredButton({ gameState, getDisabledMessage, onClick, label, color}) {
    const disabledMessage = getDisabledMessage(gameState);

    return !disabledMessage
        ? html`
            <div class="mt-2" style="height:25px">
                <button class="btn ${color} mx-1" onclick=${onClick}>${label}</button>
            </div>`
        : html`
            <${Tooltip} text=${disabledMessage}>
                <div class="mt-2" style="height:25px">
                    <button class="btn disabled mx-1">${label}</button>
                </div>
            <//>
        `;
}
