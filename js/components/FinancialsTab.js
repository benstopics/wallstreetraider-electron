import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';
import CapitalizationChart from './CapitalizationChart.js';
import AdvisorySummary from './AdvisorySummary.js';
import Tooltip from './Tooltip.js';


// For insurance companies
const renderExtras = (actingAs) => ({ type, id, text }) => {

    const nodes = [];

    if (type === 'SUBPRIME') {
        const sellable = !text?.includes('   0.0');

        if (!actingAs) {
            nodes.push(html`<${Tooltip} text="Must be acting as this company" containerClass="w-12 mx-1">
                <button class="btn disabled w-full">Sell</button>
            <//>`);

            nodes.push(html`<${Tooltip} text="Must be acting as this company" containerClass="w-12 mx-1">
                <button class="btn disabled w-full">Buy</button>
            <//>`);
        } else {
            if (!sellable) {
                nodes.push(html`<${Tooltip} text="No securities to sell" containerClass="w-12 mx-1">
                    <button class="btn disabled w-full">Sell</button>
                <//>`);
            } else {
                nodes.push(html`<button
                    class="btn red flex-1 mx-1 w-12"
                    onClick=${() => api.sellSubprimeMortgages(id)}>
                    Sell
                </button>`);
            }

            nodes.push(html`<button
                class="btn green flex-1 mx-1 w-12"
                onClick=${() => api.buySubprimeMortgages(id)}>
                Buy
            </button>`);
        }

        return html`<div class="flex justify-center items-center">
            ${nodes}
        </div>`;
    }

    return html`<div class="flex justify-center items-center">${nodes}</div>`;
};

function FinancialsTab() {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    return html`
            <div class="flex flex-col w-full h-full min-h-0 items-center">
                <div class="flex flex-row items-center gap-5 mb-2" style="height: 35px;">
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.borrowMoney} 
                            label="Borrow Money"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.repayLoan} 
                            label="Repay Loan"
                            color=""
                        />
                        ${actingAsId >= 10 ? html`<${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.extraordinaryDividend} 
                            label="Extraordinary Dividend"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.taxFreeLiquidation} 
                            label="Tax-Free Liquidation"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.taxableLiquidation} 
                            label="Taxable Liquidation"
                            color="green"
                        />` : ''}
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.changeBank} 
                            label="Change Bank"
                            color="blue"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.tradeTbills} 
                            label="Trade T-Bills"
                            color="brown"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.interestRateSwaps} 
                            label="Interest Rate Swaps"
                            color=""
                        />
                </div>
                <div class="flex flex-row w-full h-full gap-2 min-h-0">
                    ${activeEntityNum < 10 ? html`
                        <div class="flex flex-col w-1/4 gap-2 h-full min-h-0">
                            <div class="">
                                ${html`<${CapitalizationChart} assetId=${activeEntityNum} chartTitle="Net Worth" />`}
                            </div>
                            <div class="flex flex-1 min-h-0">
                                ${html`<${AdvisorySummary} />`}
                            </div>
                        </div>` : ''}
                    <div class="flex ${activeEntityNum < 10 ? 'w-3/4' : 'w-full'}">
                        <div class="flex flex-col items-center overflow-y-auto w-full max-h-full">
                            ${renderLines(financialProfile, ({ id }) => api.setViewAsset(id), renderExtras(actingAs), hyperlinkRegex)}
                        </div>
                    </div>
                </div>
            </div>
    `;
}

export default FinancialsTab;