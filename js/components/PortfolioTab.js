import { html } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import Tooltip from './Tooltip.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';


const Tab = Tabs.Tab;

function IndexPanel({ title, bondId, gameState }) {

    const { actingAs, actingAsIndustryId } = gameState;

    const buy = bondId === api.TBOND_RATE_ID ? api.buyLongGovtBonds : api.buyShortGovtBonds;

    const disabledMessage = !actingAs
        ? "Must be acting as"
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
                    <button class="btn green flex-1 mx-1" onclick=${() => buy(bondId)}>Buy</button>
                </div>`
                : html`
                <${Tooltip} text=${disabledMessage}>
                    <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                        <button class="btn disabled flex-1 mx-1">Buy</button>
                    </div>
                <//>
            `}
        </div>
    `;
}

function PortfolioTab({ gameState }) {

    const { portfolio, actingAs } = gameState;

    return html`
            <div class="flex flex-col w-full">
                <div class="flex flex-row items-center justify-start gap-5">
                    <div class="items-center flex flex-row justify-center">
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => gameState.actingAs ? "Cannot merge with yourself"
                                : gameState.actingAsIndustryId === api.PLAYER_IND ? "Must be acting as a company"
                                : false} 
                            onClick=${api.merger} 
                            label="Merge With"
                            color="green"
                        />
                    </div>
                </div>
                <div class="flex flex-row flex-[1]">
                    <${IndexPanel} title="Long Bond" bondId=${api.TBOND_RATE_ID} gameState=${gameState} />
                    <${IndexPanel} title="Short Bond" bondId=${api.SBOND_RATE_ID} gameState=${gameState} />
                </div>
                <div class="flex flex-row flex-[3]">
                    <div class="flex justify-center items-center">
                                    ${renderLines(portfolio,
        ({ id }) => api.setViewAsset(id),
        ({ type, id }) => actingAs ? html`
            <button
            class="btn red flex-1 mx-1"
            onClick=${() => (type === "S" ? api.coverShortStock : api.sellStock)(id)}>
                ${type === "S" ? "Cover" : "Sell"}
            </button>
            <button
            class="btn blue flex-1 mx-1"
            onClick=${() => api.spinOff(id)}>
                Spin-Off
            </button>`
: html`
            <${Tooltip} text="Must be acting as">
                <button class="btn disabled w-full">${type === "S" ? "Cover" : "Sell"}</button>
                <button class="btn disabled w-full">Spin-Off</button>
            <//>`
    )}
                    </div>
                </div>
            </div>
    `;
}

export default PortfolioTab;