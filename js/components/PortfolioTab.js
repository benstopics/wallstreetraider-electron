import { html } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import Tooltip from './Tooltip.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';


const Tab = Tabs.Tab;

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

function PortfolioTab() {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const portfolio = api.useGameStore(s => s.gameState.portfolio);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    return html`
            <div class="flex flex-col w-full">
                <div class="flex flex-row items-center justify-start gap-5">
                    <div class="items-center flex flex-row justify-center">
                        <${ActingAsRequiredButton} 
                            disabledMessage=${actingAs ? "Cannot merge with yourself"
                                : actingAsIndustryId === api.PLAYER_IND ? "Must be acting as this company a company"
                                : false} 
                            onClick=${api.merger} 
                            label="Merge With"
                            color="green"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.sellSubsidiaryStock} 
                            label="Offer Stock for Sale"
                            color="red"
                        />
                    </div>
                </div>
                <div class="flex flex-row flex-[1]">
                    <${IndexPanel} title="Long Bond" bondId=${api.TBOND_RATE_ID} />
                    <${IndexPanel} title="Short Bond" bondId=${api.SBOND_RATE_ID} />
                </div>
                <div class="flex flex-col items-center flex-[3]">
                    ${renderLines(portfolio,
                        ({ id }) => id && api.setViewAsset(id),
                        ({ type, id, text }) => html`<div class="flex flex-row">
                        <${ActingAsRequiredButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${() => (type === "S" ? api.coverShortStock
                                : type === "J" ? api.sellCorporateBond
                                : type === "GS" ? api.sellShortGovtBonds
                                : type === "GL" ? api.sellLongGovtBonds
                                : api.sellStock
                            )(id)}
                            label="${type === "S" ? "Cover" : "Sell"}"
                            color="red"
                        />
                        ${!text.includes('GOVERNMENT') ?html`<${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${() => api.spinOff(id)} 
                            label="Spin-Off"
                            color="blue"
                        />` : ''}
                    </div>`, hyperlinkRegex)}
                </div>
            </div>
    `;
}

export default PortfolioTab;