import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import Tooltip from './Tooltip.js';
import Button from './Button.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';

const renderExtras = (actingAs, controlledCompanies, actingAsDisabledMessage, handleActAsClick) => ({ type, id, text }) => {

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
            nodes.push(html`<${Tooltip} text=${actingAsDisabledMessage} containerClass="w-12 mx-1">
                <${Button} class="btn disabled w-full" onclick=${handleActAsClick}>Sell</button>
            <//>`);

            nodes.push(html`<${Tooltip} text=${actingAsDisabledMessage} containerClass="w-12 mx-1">
                <${Button} class="btn disabled w-full" onclick=${handleActAsClick}>Buy</button>
            <//>`);
        } else {
            if (!sellable) {
                nodes.push(html`<${Tooltip} text="No securities to sell" containerClass="w-12 mx-1">
                    <${Button} class="btn disabled w-full">Sell</button>
                <//>`);
            } else {
                nodes.push(html`<${Button}
                    class="btn red flex-1 mx-1 w-12"
                    onClick=${() => sell(id)}>
                    Sell
                </button>`);
            }

            nodes.push(html`<${Button}
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
        return html`<${Tooltip} text=${actingAsDisabledMessage}>
            <div class="flex justify-center items-center">
                <${Button} class="btn disabled mx-1 w-12" onclick=${handleActAsClick}>Sell</button>
                <${Button} class="btn disabled mx-1 w-12" onclick=${handleActAsClick}>Freeze</button>
                <${Button} class="btn disabled mx-1 w-12 whitespace-nowrap" onclick=${handleActAsClick}>Call In</button>
            </div>
        <//>`;
    }

    // SELL
    const hasLoans = !text?.includes('   0.0   ');
    const playerControlled = api.isPlayerControlled(controlledCompanies, id);

    if (!hasLoans || playerControlled) {
        const tooltipText = playerControlled
            ? 'Cannot sell loans of companies you control'
            : 'Depositor has no loans to sell';
        nodes.push(html`<${Tooltip} containerClass="w-12 mx-1" text=${tooltipText}>
            <${Button} class="btn disabled w-full">Sell</button>
        <//>`);
    } else {
        nodes.push(html`<${Button}
            class="btn red flex-1 mx-1 w-12"
            onClick=${() => api.sellBusinessLoan(id)}>
            Sell
        </button>`);
    }

    // FREEZE / UNFREEZE
    const isFrozen = text?.includes('FROZ');
    nodes.push(html`<${Button}
        class="btn ${isFrozen ? 'orange' : 'blue'} flex-1 mx-1 w-12"
        onClick=${() => api.freezeLoan(id)}>
        ${isFrozen ? 'Unfreeze' : 'Freeze'}
    </button>`);

    // CALL IN (below investment grade only - BB or worse)
    const isBBBOrBetter = ['   AAA   ', '   AA   ', '   A   ', '   BBB   '].some(s => text?.includes(s));
    if (!isBBBOrBetter) {
        nodes.push(html`<${Button}
            class="btn brown flex-1 mx-1 whitespace-nowrap w-12"
            onClick=${() => api.callInLoan(id)}>
            Call In
        </button>`);
    } else {
        nodes.push(html`<${Tooltip} text="Can only call in loans below investment grade (BB or worse)">
            <${Button} class="btn disabled mx-1 whitespace-nowrap">Call In</button>
        <//>`);
    }

    return html`<div class="flex justify-center items-center">${nodes}</div>`;
};

function LoansTab() {

    const gameState = api.useGameStore(s => s.gameState);
    const frozenAllLoans = gameState.frozenAllLoans;
    const loansReport = gameState.loansReport;
    const hyperlinkRegex = gameState.hyperlinkRegex;

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    // Get disabled message and click handler for dynamic buttons
    const actingAsDisabledMessage = buttonProps.mustActAsCompanyMessage;
    const handleActAsClick = buttonProps.onMustActAsCompanyClick;

    return html`
        <div class="flex flex-col w-full items-center h-full min-h-0">
            <${DisabledTooltipButton} ...${buttonProps.buyBusinessLoans}
                containerClass="flex flex-row justify-between mt-2 w-full"
                buttonClass="btn flex-1 mx-1"
            />
            <${DisabledTooltipButton} ...${buttonProps.freezeAllLoans}
                label="${frozenAllLoans ? "Unfreeze" : "Freeze"} All Loans"
                containerClass="flex flex-row justify-between mt-2 w-full"
                buttonClass="btn flex-1 mx-1"
            />
            <${DisabledTooltipButton} ...${buttonProps.setBankAllocation}
                containerClass="flex flex-row justify-between mt-2 w-full"
                buttonClass="btn flex-1 mx-1"
            />

            <br />

            <div class="flex flex-col flex-[3] justify-center items-center overflow-y-auto min-h-0">
                <div class="flex flex-col items-center w-full">
                    ${renderLines(loansReport, ({ id }) => id && api.setViewAsset(id), renderExtras(buttonProps.actingAs, buttonProps.controlledCompanies, actingAsDisabledMessage, handleActAsClick), hyperlinkRegex)}
                </div>
            </div>
        </div>
    `;
}

export default LoansTab;
