import { html } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import Tooltip from './Tooltip.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import Button from './Button.js';


function IndexPanel({ title, bondId }) {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);

    const buy = bondId === api.TBOND_RATE_ID ? api.buyLongGovtBonds : api.buyShortGovtBonds;

    const disabledMessage = !actingAs
        ? "Must be acting as this company"
        : ![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId) ? "Only players, banks, and insurance companies can trade government bonds."
        : false;

    return html`
        <div class="flex flex-col w-full">
            <div class="flex flex-col" style="height: 100px">
                ${html`<${AssetPriceChart} chartTitle=${title} assetId=${bondId} />`}
            </div>
            ${!disabledMessage
                ? html`
                <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                    <${Button} class="btn green flex-1 mx-1" onclick=${() => buy(bondId)}>Buy</button>
                </div>`
                : html`
                <${Tooltip} text=${disabledMessage}>
                    <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                        <${Button} class="btn disabled flex-1 mx-1">Buy</button>
                    </div>
                <//>
            `}
        </div>
    `;
}

function InterestRateSwapsTab() {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const swapsPortfolio = api.useGameStore(s => s.gameState.swapsPortfolio);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    const isActiveEntityETF = activeIndustryId === api.ETF_IND;

    return html`
            <div class="flex flex-col w-full">
                <div class="flex flex-row items-center justify-start gap-5">
                    <div class="items-center flex flex-row justify-center">
                        ${!isActiveEntityETF ? html`<${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.interestRateSwaps}
                            label="Create New Swap"
                            color="green"
                        />` : ''}
                    </div>
                </div>
                <div class="flex flex-row flex-[1]">
                    <${IndexPanel} title="Long Bond Rate" bondId=${api.TBOND_RATE_ID} />
                    <${IndexPanel} title="Short Bond Rate" bondId=${api.SBOND_RATE_ID} />
                    <${IndexPanel} title="Prime Rate" bondId=${api.PRIME_RATE_ID} />
                </div>
                <div class="flex flex-col items-center flex-[3]">
                    ${renderLines(swapsPortfolio,
                        ({ id }) => id && api.setViewAsset(id),
                        ({ type, id, text }) => html`<div class="flex flex-row">
                        <${DisabledTooltipButton}
                            disabledMessage=${false}
                            onClick=${() => api.viewSwapDetails(id)}
                            label="Details"
                            color="blue"
                        />
                        <${DisabledTooltipButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${() => api.terminateSwap(id)}
                            label="Terminate"
                            color="red"
                        />
                    </div>`, hyperlinkRegex)}
                </div>
            </div>
    `;
}

export default InterestRateSwapsTab;