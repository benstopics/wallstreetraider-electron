import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';


function CashflowTab() {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const cashflowProjection = api.useGameStore(s => s.gameState.cashflowProjection);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    const isActiveEntityETF = activeIndustryId === api.ETF_IND;
    const hasCorporateAssets = financialProfile.some(asset => asset.includes('Business Assets/Equipment'));

    return html`
            <div class="flex flex-col w-full items-center">
                ${!isActiveEntityETF ? html`<div class="flex flex-row items-center gap-5">
                    ${activeIndustryId !== api.BANK_IND ? html`
                        <${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.buyCorporateAssets}
                            label="Buy Corporate Assets"
                            color="green"
                        />
                        ${hasCorporateAssets ? html`<${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.sellCorporateAssets}
                            label="Sell Corporate Assets"
                            color="red"
                        />` : ''}
                        ${hasCorporateAssets ? html`<${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.offerCorporateAssetsForSale}
                            label="Offer Corporate Assets for Sale"
                            color="blue"
                        />` : ''}
                    ` : ''}
                        <${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.viewForSaleItems}
                            label="Browse For Sale Items"
                            color="green"
                        />
                        <${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.setDividend}
                            label="Set Dividend"
                            color="green"
                        />
                        <${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.setProductivity}
                            label="Set Productivity"
                            color="brown"
                        />
                        <${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.setGrowthRate}
                            label="Set Growth Rate"
                            color="orange"
                        />
                        <${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.changeManagers}
                            label="Fire Managers"
                            color="red"
                        />
                </div>` : ''}
                <br />
                <div class="flex flex-col flex-[3] justify-center items-center">
                    <div class="flex flex-col items-center w-full">
                        ${renderLines(cashflowProjection ?? [], ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                    </div>
                </div>
            </div>
    `;
}

export default CashflowTab;