import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';
import Tooltip from './Tooltip.js';

function LoansTab({ gameState }) {

    const { frozenAllLoans, actingAs } = gameState;

    return html`
        <div class="flex flex-col w-full items-center">
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gs => !gs.actingAs ? "Must be acting as" : false} 
                        onClick=${api.buyBusinessLoans} 
                        label="Buy Business Loans"
                        color="green"
                        containerClass="flex flex-row justify-between mt-2 w-full"
                        buttonClass="btn flex-1 mx-1"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gs => !gs.actingAs ? "Must be acting as" : false} 
                        onClick=${api.freezeAllLoans} 
                        label="${frozenAllLoans ? "Unfreeze" : "Freeze"} All Loans"
                        color="blue"
                        containerClass="flex flex-row justify-between mt-2 w-full"
                        buttonClass="btn flex-1 mx-1"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gs => !gs.actingAs ? "Must be acting as" : false} 
                        onClick=${api.setBankAllocation} 
                        label="Set Allocation"
                        color="brown"
                        containerClass="flex flex-row justify-between mt-2 w-full"
                        buttonClass="btn flex-1 mx-1"
                    />

            <br />

            <div class="flex flex-col flex-[3] justify-center items-center">
                <div class="flex justify-center items-center w-full">
                    ${renderLines(gameState.loansReport,
                       ({ id }) => id && api.setViewAsset(id),
        ({ type, id, text }) => actingAs ? html`
            ${!text.includes('   0.0   ') && !api.isPlayerControlled(gameState, id) ? html`<button
            class="btn red flex-1 mx-1"
            onClick=${() => api.sellBusinessLoan(id)}>
                Sell
            </button>` : html`<${Tooltip} text="${api.isPlayerControlled(gameState, id) ? 'Cannot sell loans of companies you control'
                : text.includes('   0.0   ') ? 'Depositor has no loans to sell'
                    : ''}">
                <button class="btn disabled mx-1">Sell</button>
            <//>`}
            <button
            class="btn blue flex-1 mx-1"
            onClick=${() => api.freezeLoan(id)}>
                ${(text?.includes('FROZ') ? 'Unfreeze' : 'Freeze')}
            </button>
            ${['   AAA   ', '   AA   ', '   A   ', '   BBB   '].every(substring => !text.includes(substring)) ? html`<button
            class="btn brown flex-1 mx-1 whitespace-nowrap"
            onClick=${() => api.callInLoan(id)}>
                Call In
            </button>` : html`<${Tooltip} text="Company is maintaining a BBB credit rating or better">
                <button class="btn disabled mx-1 whitespace-nowrap">Call In</button>
            <//>`}`
            : html`<${Tooltip} text="Must be acting as">
                <div class="flex justify-center items-center">
                    <button class="btn disabled mx-1">Sell</button>
                    <button class="btn disabled mx-1">Freeze</button>
                    <button class="btn disabled mx-1 whitespace-nowrap">Call In</button>
                </div>
            <//>`
    )}
                </div>
            </div>
        </div>
    `;
}

export default LoansTab;
