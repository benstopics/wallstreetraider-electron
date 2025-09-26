import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';


function FinancialsTab({ gameState }) {

    return html`
            <div class="flex flex-col w-full items-center">
                <div class="flex flex-row items-center gap-5">
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.borrowMoney} 
                            label="Borrow Money"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.repayLoan} 
                            label="Repay Loan"
                            color=""
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.extraordinaryDividend} 
                            label="Extraordinary Dividend"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.taxFreeLiquidation} 
                            label="Tax-Free Liquidation"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.taxableLiquidation} 
                            label="Taxable Liquidation"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.changeBank} 
                            label="Change Bank"
                            color="blue"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.tradeTbills} 
                            label="Trade T-Bills"
                            color="brown"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.interestRateSwaps} 
                            label="Interest Rate Swaps"
                            color=""
                        />
                </div>
                <br />
                <div class="flex flex-col flex-[3] justify-center items-center">
                    <div class="flex justify-center items-center w-full">
                        ${renderLines(gameState, gameState.financialProfile, ({ id }) => api.setViewAsset(id))}
                    </div>
                </div>
            </div>
    `;
}

export default FinancialsTab;