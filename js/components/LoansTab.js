import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';
import Tooltip from './Tooltip.js';

const renderExtras = (gameState) => ({ type, id, text }) => {
    const { actingAs } = gameState;

    const nodes = [];


    if (['CONSUMER', 'MORTGAGE', 'SUBPRIME'].includes(type)) {
        const sellable = !text?.includes('   0.0   ');

        const sell = type === 'CONSUMER' ? api.sellConsumerLoans
            : type === 'MORTGAGE' ? api.sellPrimeMortgages
                : type === 'SUBPRIME' ? api.sellSubprimeMortgages
                    : () => { };

        const buy = type === 'CONSUMER' ? api.buyConsumerLoans
            : type === 'MORTGAGE' ? api.buyPrimeMortgages
                : type === 'SUBPRIME' ? api.buySubprimeMortgages
                    : () => { };
        
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
                    onClick=${() => sell(id)}>
                    Sell
                </button>`);
            }

            nodes.push(html`<button
                class="btn green flex-1 mx-1 w-12"
                onClick=${() => buy(id)}>
                Buy
            </button>`);
        }

        return html`<div class="flex justify-center items-center">
            ${nodes}
        </div>`;
    }

    if (!actingAs) {
        return html`<${Tooltip} text="Must be acting as this company">
            <div class="flex justify-center items-center">
                <button class="btn disabled mx-1 w-12">Sell</button>
                <button class="btn disabled mx-1 w-12">Freeze</button>
                <button class="btn disabled mx-1 w-12 whitespace-nowrap">Call In</button>
            </div>
        <//>`;
    }

    // SELL
    const hasLoans = !text?.includes('   0.0   ');
    const playerControlled = api.isPlayerControlled(gameState, id);

    if (!hasLoans || playerControlled) {
        const tooltipText = playerControlled
            ? 'Cannot sell loans of companies you control'
            : 'Depositor has no loans to sell';
        nodes.push(html`<${Tooltip} containerClass="w-12 mx-1" text=${tooltipText}>
            <button class="btn disabled w-full">Sell</button>
        <//>`);
    } else {
        nodes.push(html`<button
            class="btn red flex-1 mx-1 w-12"
            onClick=${() => api.sellBusinessLoan(id)}>
            Sell
        </button>`);
    }

    // FREEZE / UNFREEZE
    const isFrozen = text?.includes('FROZ');
    nodes.push(html`<button
        class="btn ${isFrozen ? 'orange' : 'blue'} flex-1 mx-1 w-12"
        onClick=${() => api.freezeLoan(id)}>
        ${isFrozen ? 'Unfreeze' : 'Freeze'}
    </button>`);

    // CALL IN (BBB or better)
    const isBBBOrBetter = ['   AAA   ', '   AA   ', '   A   ', '   BBB   '].some(s => text?.includes(s));
    if (isBBBOrBetter) {
        nodes.push(html`<button
            class="btn brown flex-1 mx-1 whitespace-nowrap w-12"
            onClick=${() => api.callInLoan(id)}>
            Call In
        </button>`);
    } else {
        nodes.push(html`<${Tooltip} text="Requires BBB credit rating or better">
            <button class="btn disabled mx-1 whitespace-nowrap">Call In</button>
        <//>`);
    }

    return html`<div class="flex justify-center items-center">${nodes}</div>`;
};

function LoansTab({ gameState }) {

    const { frozenAllLoans } = gameState;

    return html`
        <div class="flex flex-col w-full items-center">
            <${ActingAsRequiredButton} 
                gameState=${gameState} 
                getDisabledMessage=${gs => !gs.actingAs ? "Must be acting as this company" : false} 
                onClick=${api.buyBusinessLoans} 
                label="Buy Business Loans"
                color="green"
                containerClass="flex flex-row justify-between mt-2 w-full"
                buttonClass="btn flex-1 mx-1"
            />
            <${ActingAsRequiredButton} 
                gameState=${gameState} 
                getDisabledMessage=${gs => !gs.actingAs ? "Must be acting as this company" : false} 
                onClick=${api.freezeAllLoans} 
                label="${frozenAllLoans ? "Unfreeze" : "Freeze"} All Loans"
                color="blue"
                containerClass="flex flex-row justify-between mt-2 w-full"
                buttonClass="btn flex-1 mx-1"
            />
            <${ActingAsRequiredButton} 
                gameState=${gameState} 
                getDisabledMessage=${gs => !gs.actingAs ? "Must be acting as this company" : false} 
                onClick=${api.setBankAllocation} 
                label="Set Allocation"
                color="brown"
                containerClass="flex flex-row justify-between mt-2 w-full"
                buttonClass="btn flex-1 mx-1"
            />

            <br />

            <div class="flex flex-col flex-[3] justify-center items-center">
                <div class="flex flex-col items-center w-full">
                    ${renderLines(gameState, gameState.loansReport, ({ id }) => id && api.setViewAsset(id), renderExtras(gameState))}
                </div>
            </div>
        </div>
    `;
}

export default LoansTab;
