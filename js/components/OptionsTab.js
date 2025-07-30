import { html } from '../lib/preact.standalone.module.js';
import Tooltip from './Tooltip.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';


function OptionsTab({ gameState }) {

    const { actingAs } = gameState;

    const disabledMessage = actingAs ? "CANNOT be acting as" : false;

    return html`
            <div class="flex flex-col w-full">
                <div class="">
                    ${!disabledMessage
                        ? html`
                        <div class="mt-2" style="height:25px">
                            <button class="btn red mx-1" onclick=${api.advancedOptionsTrading}>Advanced Trading Station</button>
                        </div>`
                        : html`
                        <${Tooltip} text=${disabledMessage}>
                            <div class="mt-2" style="height:25px">
                                <button class="btn disabled mx-1">Advanced Trading Station</button>
                            </div>
                        <//>
                    `}
                </div>
                <br />
                <div class="flex flex-row flex-[3] justify-center items-center">
                    <div class="flex">
                        ${renderLines(gameState.optionsList, ({ id }) => api.setViewAsset(id))}
                    </div>
                </div>
            </div>
    `;
}

export default OptionsTab;