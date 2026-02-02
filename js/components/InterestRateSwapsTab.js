import { html } from '../lib/preact.standalone.module.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import Tooltip from './Tooltip.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import Button from './Button.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';


function IndexPanel({ title, bondId }) {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies);
    const playerName = api.useGameStore(s => s.gameState.playerName) || 'Player';

    const buy = bondId === api.TBOND_RATE_ID ? api.buyLongGovtBonds : api.buyShortGovtBonds;

    const controlsActiveEntity = (controlledCompanies || []).some(c => c.id === activeEntityNum);

    const getDisabledInfo = () => {
        if (!actingAs) {
            return {
                message: controlsActiveEntity
                    ? `Must be acting as this company. Click to act as ${activeEntitySymbol}`
                    : "Must be acting as this company",
                onClick: controlsActiveEntity ? () => api.changeActingAs(activeEntityNum) : null
            };
        }
        if (![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)) {
            return {
                message: `Only players, banks, and insurance companies can trade government bonds. Click to act as ${playerName}`,
                onClick: () => api.changeActingAs(api.HUMAN1_ID)
            };
        }
        return { message: false, onClick: null };
    };

    const disabledInfo = getDisabledInfo();

    return html`
        <div class="flex flex-col w-full">
            <div class="flex flex-col" style="height: 100px">
                ${html`<${AssetPriceChart} chartTitle=${title} assetId=${bondId} />`}
            </div>
            ${!disabledInfo.message
                ? html`
                <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                    <${Button} class="btn green flex-1 mx-1" onclick=${() => buy(bondId)}>Buy</button>
                </div>`
                : html`
                <${Tooltip} text=${disabledInfo.message}>
                    <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                        <${Button} class="btn disabled flex-1 mx-1" onclick=${disabledInfo.onClick}>Buy</button>
                    </div>
                <//>`
            }
        </div>
    `;
}

function InterestRateSwapsTab() {

    const swapsPortfolio = api.useGameStore(s => s.gameState.swapsPortfolio);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    // Get disabled message and click handler from hook for dynamic buttons
    const actingAsDisabledMessage = buttonProps.mustActAsCompanyMessage;
    const handleActAsClick = buttonProps.onMustActAsCompanyClick;

    return html`
            <div class="flex flex-col w-full h-full min-h-0">
                <div class="flex flex-row items-center justify-start gap-5">
                    <div class="items-center flex flex-row justify-center">
                        ${!buttonProps.isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.interestRateSwaps} label="Create New Swap" />` : ''}
                    </div>
                </div>
                <div class="flex flex-row flex-[1]">
                    <${IndexPanel} title="Long Bond Rate" bondId=${api.TBOND_RATE_ID} />
                    <${IndexPanel} title="Short Bond Rate" bondId=${api.SBOND_RATE_ID} />
                    <${IndexPanel} title="Prime Rate" bondId=${api.PRIME_RATE_ID} />
                </div>
                <div class="flex flex-col items-center flex-[3] overflow-y-auto min-h-0">
                    ${renderLines(swapsPortfolio,
                        ({ id }) => id && api.setViewAsset(id),
                        ({ id }) => html`<div class="flex flex-row">
                        <${DisabledTooltipButton}
                            disabledMessage=${false}
                            onClick=${() => api.viewSwapDetails(id)}
                            label="Details"
                            color="blue"
                        />
                        <${DisabledTooltipButton}
                            disabledMessage=${actingAsDisabledMessage}
                            onClick=${() => api.terminateSwap(id)}
                            onDisabledClick=${handleActAsClick}
                            label="Terminate"
                            color="red"
                        />
                    </div>`, hyperlinkRegex)}
                </div>
            </div>
    `;
}

export default InterestRateSwapsTab;
