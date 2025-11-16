import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';


function CashflowTab() {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const cashflowProjection = api.useGameStore(s => s.gameState.cashflowProjection);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    const hasCorporateAssets = financialProfile.some(asset => asset.includes('Business Assets/Equipment'));

    return html`
            <div class="flex flex-col w-full items-center">
                <div class="flex flex-row items-center gap-5">
                    ${activeIndustryId !== api.BANK_IND ? html`
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.buyCorporateAssets} 
                            label="Buy Corporate Assets"
                            color="green"
                        />
                        ${hasCorporateAssets ? html`<${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.sellCorporateAssets} 
                            label="Sell Corporate Assets"
                            color="red"
                        />` : ''}
                        ${hasCorporateAssets ? html`<${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.offerCorporateAssetsForSale} 
                            label="Offer Corporate Assets for Sale"
                            color="blue"
                        />` : ''}
                    ` : ''}
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.viewForSaleItems} 
                            label="Browse For Sale Items"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.setDividend} 
                            label="Set Dividend"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.setProductivity} 
                            label="Set Productivity"
                            color="brown"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.setGrowthRate} 
                            label="Set Growth Rate"
                            color="orange"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.changeManagers} 
                            label="Fire Managers"
                            color="red"
                        />
                </div>
                <br />
                <div class="flex flex-col flex-[3] justify-center items-center">
                    <div class="flex flex-col items-center w-full">
                        ${activeIndustryId !== api.BANK_IND
                            ? renderLines(cashflowProjection ?? [], ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)
                            : 'Cashflow projection unavailable for banks.'}
                    </div>
                </div>
            </div>
    `;
}

export default CashflowTab;