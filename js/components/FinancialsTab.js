import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import CapitalizationChart from './CapitalizationChart.js';
import AdvisorySummary from './AdvisorySummary.js';
import Tooltip from './Tooltip.js';
import Button from './Button.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';


// For insurance companies
const renderExtras = (actingAs, controlsActiveEntity, activeEntityNum, activeEntitySymbol) => ({ type, id, text }) => {

    const nodes = [];

    if (type === 'SUBPRIME') {
        const sellable = !text?.includes('   0.0');
        const disabledTooltip = controlsActiveEntity
            ? `Must be acting as this company. Click to act as ${activeEntitySymbol}`
            : "Must be acting as this company";
        const handleActAsClick = controlsActiveEntity ? () => api.changeActingAs(activeEntityNum) : null;

        if (!actingAs) {
            nodes.push(html`<${Tooltip} text=${disabledTooltip} containerClass="w-12 mx-1">
                <${Button} class="btn disabled w-full" onclick=${handleActAsClick}>Sell</button>
            <//>`);

            nodes.push(html`<${Tooltip} text=${disabledTooltip} containerClass="w-12 mx-1">
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
                    onClick=${() => api.sellSubprimeMortgages(id)}>
                    Sell
                </button>`);
            }

            nodes.push(html`<${Button}
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

    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    // Check if user controls the active entity (for renderExtras)
    const controlsActiveEntity = (controlledCompanies || []).some(c => c.id === activeEntityNum);

    // Show extra buttons only for companies (not player)
    const showCorpButtons = buttonProps.actingAsId >= 10 || buttonProps.isActiveEntityETF;

    return html`
            <div class="flex flex-col w-full h-full min-h-0 items-center">
                <div class="flex flex-row items-center gap-5 mb-2" style="height: 35px;">
                        <${DisabledTooltipButton} ...${buttonProps.borrowMoney} />
                        <${DisabledTooltipButton} ...${buttonProps.repayLoan} />
                        ${showCorpButtons ? html`<${DisabledTooltipButton} ...${buttonProps.extraordinaryDividend} />
                        ${!buttonProps.isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.taxFreeLiquidation} />
                        <${DisabledTooltipButton} ...${buttonProps.taxableLiquidation} />` : ''}` : ''}
                        <${DisabledTooltipButton} ...${buttonProps.changeBank} />
                        ${!buttonProps.isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.tradeTbills} />` : ''}
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
                            ${renderLines(financialProfile, ({ id }) => api.setViewAsset(id), renderExtras(buttonProps.actingAs, controlsActiveEntity, activeEntityNum, activeEntitySymbol), hyperlinkRegex)}
                        </div>
                    </div>
                </div>
            </div>
    `;
}

export default FinancialsTab;