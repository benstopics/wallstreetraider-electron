import { html } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import AdvisorySummary from './AdvisorySummary.js';
import ActingAsDropdown from './ActingAsDropdown.js';
import CommoditiesTab from './CommoditiesTab.js';
import PortfolioTab from './PortfolioTab.js';
import OptionsTab from './OptionsTab.js';
import Tooltip from './Tooltip.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import EPSChart from './EPSChart.js';
import FinancialsTab from './FinancialsTab.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';
import LoansTab from './LoansTab.js';

const Tab = Tabs.Tab;

const extractEPSData = lines => {
    const epsData = [];

    const regex = /^\s*(\d{4})\s+Earnings Per Share\s+(-?\d+(?:\.\d+)?)/;

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            const year = parseInt(match[1], 10);
            const eps = parseFloat(match[2]);
            epsData.push({ year, eps });
        }
    }

    return epsData;
};


const IndustrialView = ({ gameState }) => {
    const { actingAsId, actingAsIndustryId, activeEntityNum, activeIndustryId } = gameState;

    const buyStockDisabledMessage = !actingAsId
        ? "Must be acting as"
        : false;

    const shortStockDisabledMessage = actingAsId !== api.PLAYER1_ID
        ? "Only players can short stocks."
        : false;

    const buyBondDisabledMessage = ![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
        ? "Only players, banks, and insurance companies can buy bonds."
        : false;

    return html`
    <div class="flex flex-col h-full">
        <div class="flex flex-row gap-2 flex-1 min-h-0">
            <div class="flex flex-col w-1/4 gap-2">
                <div style="height: 30px; display: flex; align-items: center;">
                    <${ActingAsDropdown} gameState=${gameState} />
                </div>
                <div class="flex flex-col flex-[2] min-h-0">
                    ${html`<${AssetPriceChart} assetId=${activeEntityNum} chartTitle="${gameState.activeEntitySymbol} Stock Price" />`}
                    <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                        ${!buyStockDisabledMessage
            ? html`
                                <button class="btn flex-1 mx-1 green" onClick=${() => api.buyStock(activeEntityNum)}>
                                    Buy Stock
                                </button>`
            : html`
                                <${Tooltip} text=${buyStockDisabledMessage}>
                                    <button class="btn disabled w-full">Buy Stock</button>
                                <//>`}

                        ${!shortStockDisabledMessage
            ? html`
                                <button class="btn flex-1 mx-1 green" onClick=${() => api.shortStock(activeEntityNum)}>
                                    Short Stock
                                </button>`
            : html`
                                <${Tooltip} text=${shortStockDisabledMessage}>
                                    <button class="btn disabled w-full">Short Stock</button>
                                <//>`}

                        ${!buyBondDisabledMessage
            ? html`
                                <button class="btn flex-1 mx-1 green" onClick=${() => api.buyCorporateBond(activeEntityNum)}>
                                    Buy Bonds
                                </button>`
            : html`
                                <${Tooltip} text=${buyBondDisabledMessage}>
                                    <button class="btn disabled w-full">Buy Bonds</button>
                                <//>`}
                    </div>
                </div>
                <div class="flex flex-[2] min-h-0">
                    ${html`<${EPSChart} epsData=${extractEPSData(gameState.financialProfile)} />`}
                </div>
                <div class="flex flex-[4] min-h-0">
                    ${html`<${AdvisorySummary} text=${gameState.advisorySummary} />`}
                </div>
            </div>
            <div class="flex flex-col w-3/4 gap-2 h-full">
                <div class="flex gap-2 justify-start" style="height: 30px;">
                    <input class="command-line" type="text" placeholder="Enter command..." />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                        onClick=${api.rebrand} 
                        label="Rebrand"
                        color="red"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                        onClick=${api.antitrustLawsuit} 
                        label="Antitrust Lawsuit"
                        color="red"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                        onClick=${api.startup} 
                        label="Startup"
                        color="green"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                        onClick=${api.capitalContribution} 
                        label="Contribute Capital"
                        color="green"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                        onClick=${api.issueNewCorpBonds} 
                        label="Issue Corp Bonds"
                        color="brown"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                        onClick=${api.redeemCorpBonds} 
                        label="Redeem Corp Bonds"
                        color="brown"
                    />
                </div>
                <${Tabs}>
                    <${Tab} label="Analysis">
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState.researchReport, ({ id }) => api.setViewAsset(id))}
                        </div>
                    <//>
                    <${Tab} label="Earnings">

                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.decreaseEarnings} 
                            label="Decrease Earnings"
                            color="red"
                            containerClass="flex flex-row justify-between mt-2 w-full"
                            buttonClass="btn flex-1 mx-1"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                            onClick=${api.increaseEarnings} 
                            label="Increase Earnings"
                            color="green"
                            containerClass="flex flex-row justify-between mt-2 w-full"
                            buttonClass="btn flex-1 mx-1"
                        />

                        <div class="flex justify-center items-center">
                            ${renderLines(gameState.earningsReport, ({ id }) => api.setViewAsset(id))}
                        </div>
                    <//>
                    <${Tab} label="Financials">
                        <${FinancialsTab} gameState=${gameState} />
                    <//>
                    ${(activeIndustryId != null && activeIndustryId !== api.BANK_IND) 
                    ? html`<${Tab} label="Cashflow">
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState.cashflowProjection, ({ id }) => api.setViewAsset(id))}
                        </div>
                    <//>` 
                    : html`<${Tab} label="Loans">
                        ${html`<${LoansTab} gameState=${gameState} />`}
                    <//>`}
                    <${Tab} label="Stocks & Bonds">
                        <${PortfolioTab} gameState=${gameState} />
                    <//>
                    <${Tab} label="Options">
                        <${OptionsTab} gameState=${gameState} />
                    <//>
                    <${Tab} label="Commodities & Crypto">
                        ${html`<${CommoditiesTab} gameState=${gameState} />`}
                    <//>
                    <${Tab} label="Shareholders">
                        <div class="flex flex-row items-center justify-start gap-5">
                            <div class="items-center flex flex-row justify-center">
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                                    onClick=${api.publicStockOffering} 
                                    label="Public Offering"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                                    onClick=${api.privateStockOffering} 
                                    label="Private Offering"
                                    color="brown"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                                    onClick=${api.greenmail} 
                                    label="Greenmail"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                                    onClick=${api.lbo} 
                                    label="Leveraged Buyout"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                                    onClick=${api.splitStock} 
                                    label="Split Stock"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as" : false} 
                                    onClick=${api.reverseSplitStock} 
                                    label="Reverse Split"
                                    color="red"
                                />
                            </div>
                        </div>
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState.shareholdersList, ({ id }) => api.setViewAsset(id))}
                        </div>
                    <//>
                <//>
            </div>
        </div>
    </div>
`;

}

export default IndustrialView;
