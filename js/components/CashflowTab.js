import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';


function CashflowTab({ gameState }) {

    const hasCorporateAssets = gameState.financialProfile.some(asset => asset.includes('Business Assets/Equipment'));

    return html`
            <div class="flex flex-col w-full items-center">
                <div class="flex flex-row items-center justify-start gap-5">
                    <div class="items-center flex flex-col justify-center">
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.buyCorporateAssets} 
                            label="Buy Corporate Assets"
                            color="green"
                        />
                        ${hasCorporateAssets ? html`<${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.sellCorporateAssets} 
                            label="Sell Corporate Assets"
                            color="red"
                        />` : ''}
                    </div>
                    <div class="items-center flex flex-col justify-center">
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.setDividend} 
                            label="Set Dividend"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.setProductivity} 
                            label="Set Productivity"
                            color="brown"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.setGrowthRate} 
                            label="Set Growth Rate"
                            color="orange"
                        />
                    </div>
                    <div class="items-center flex flex-col justify-center">
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.changeManagers} 
                            label="Change Managers"
                            color="blue"
                        />
                    </div>
                </div>
                <br />
                <div class="flex flex-col flex-[3] justify-center items-center">
                    <div class="flex justify-center items-center w-full">
                        ${renderLines(gameState.cashflowProjection, ({ id }) => api.setViewAsset(id))}
                    </div>
                </div>
            </div>
    `;
}

export default CashflowTab;