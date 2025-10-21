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
import CashflowTab from './CashflowTab.js';
import CommandPrompt from './CommandPrompt.js';

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
    const { actingAs, actingAsId, actingAsIndustryId, activeEntityNum, activeIndustryId } = gameState;

    const buyStockDisabledMessage = !actingAsId
        ? "Must be acting as this company"
        : false;

    const shortStockDisabledMessage = actingAsId !== api.HUMAN1_ID
        ? "Only players can short stocks."
        : false;

    const buyBondDisabledMessage = ![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
        ? "Only players, banks, and insurance companies can buy bonds."
        : false;

    return html`
    <div class="flex flex-col h-full">
        <div class="flex flex-row gap-2 flex-1 min-h-0">
            <div class="flex flex-col w-full gap-2 h-full">
                <div class="flex gap-2 items-center" style="height: 35px;">
                    ${api.isPlayerControlled(gameState, activeEntityNum)
                        ? api.isPlayerCEO(gameState, activeEntityNum) ? html`<${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.resignAsCeo} 
                            label="Resign as CEO"
                            color="red"
                        />` : html`<${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.electCeo} 
                            label="Elect as CEO"
                            color="red"
                        />` : ''}
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                        onClick=${api.rebrand} 
                        label="Rebrand"
                        color="red"
                    />
                    ${gameState.actingAsId !== activeEntityNum // Cannot sue itself
                        && gameState.actingAsId !== api.HUMAN1_ID // Players cannot file antitrust lawsuits
                        && gameState.actingAsIndustryId === gameState.activeIndustryId // Must be same industry
                        && !api.isPlayerControlled(gameState, activeEntityNum) // Cannot be controlled by you
                        ? html`<${ActingAsRequiredButton}
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => false}
                        onClick=${() => api.antitrustLawsuit(activeEntityNum)} 
                        label="Antitrust Lawsuit\n${gameState.actingAsSymbol} vs ${gameState.activeEntitySymbol}"
                        color="red"
                    />` : ''}
                    ${!api.isPlayerControlled(gameState, activeEntityNum) // Cannot be controlled by you
                        && gameState.actingAsId !== activeEntityNum // Company cannot sue itself
                        ? html`<${ActingAsRequiredButton}
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => false}
                        onClick=${() => api.harrassingLawsuit(activeEntityNum)} 
                        label="Harrassing Lawsuit\n${gameState.actingAsSymbol} vs ${gameState.activeEntitySymbol}"
                        color="red"
                    />` : ''}
                    ${activeIndustryId === api.INSURANCE_IND || activeIndustryId === api.SECURITIES_BROKER_IND ? html`<${ActingAsRequiredButton}
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false}
                        onClick=${api.setAdvisoryFee} 
                        label="Set Advisory Fee"
                        color="blue"
                    />` : ''}
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                        onClick=${api.startup} 
                        label="Startup"
                        color="green"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => gameState.actingAs ? "You cannot capital contribute to yourself!" : false} 
                        onClick=${api.capitalContribution} 
                        label="Contribute Capital"
                        color="green"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                        onClick=${api.issueNewCorpBonds} 
                        label="Issue Corp Bonds"
                        color="brown"
                    />
                    <${ActingAsRequiredButton} 
                        gameState=${gameState} 
                        getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                        onClick=${api.redeemCorpBonds} 
                        label="Redeem Corp Bonds"
                        color="brown"
                    />
                </div>
                <${Tabs}>
                    <${Tab} label="General">
                        <div class="flex flex-row w-full h-full gap-2 min-h-0">
                            <div class="flex w-1/4 flex-col gap-2 h-full min-h-0">
                                <div class="flex flex-col flex-[4] min-h-0">
                                    <div class="flex-[4] min-h-0">
                                        ${html`<${AssetPriceChart} assetId=${activeEntityNum} chartTitle="${gameState.activeEntitySymbol} Stock Price" />`}
                                    </div>
                                    <div class="flex flex-row justify-between mt-2 w-full" style="height:30px">
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
                                    <div class="flex flex-row justify-between mt-2 w-full" style="height:30px">
                                        <${ActingAsRequiredButton} 
                                            gameState=${gameState} 
                                            getDisabledMessage=${_ => actingAs ? "Entity cannot buy options on itself" : false} 
                                            onClick=${() => api.buyCalls(0)} 
                                            label="Buy Calls"
                                            color="green"
                                        />
                                        <${ActingAsRequiredButton} 
                                            gameState=${gameState} 
                                            getDisabledMessage=${_ => actingAs ? "Entity cannot sell options on itself" : false} 
                                            onClick=${() => api.sellCalls(0)} 
                                            label="Sell Calls"
                                            color="red"
                                        />
                                        <${ActingAsRequiredButton} 
                                            gameState=${gameState} 
                                            getDisabledMessage=${_ => actingAs ? "Entity cannot buy options on itself" : false} 
                                            onClick=${() => api.buyPuts(0)} 
                                            label="Buy Puts"
                                            color="green"
                                        />
                                        <${ActingAsRequiredButton} 
                                            gameState=${gameState} 
                                            getDisabledMessage=${_ => actingAs ? "Entity cannot sell options on itself" : false} 
                                            onClick=${() => api.sellPuts(0)} 
                                            label="Sell Puts"
                                            color="red"
                                        />
                                    </div>
                                    <div class="flex flex-row justify-between mt-2 w-full" style="height:20px">
                                        <${ActingAsRequiredButton} 
                                            gameState=${gameState}
                                            getDisabledMessage=${_ => actingAs ? "Entity cannot buy options on itself" : false} 
                                            onClick=${api.advancedOptionsTrading} 
                                            label="Advanced Options"
                                            color="green"
                                            containerClass="w-full"
                                            buttonClass="w-full"
                                        />
                                    </div>
                                </div>
                                <div class="flex flex-[1.75] min-h-0">
                                    ${html`<${EPSChart} epsData=${extractEPSData(gameState.financialProfile)} />`}
                                </div>
                                <div class="flex flex-[4] min-h-0">
                                    ${html`<${AdvisorySummary} gameState=${gameState} />`}
                                </div>
                            </div>
                            <div class="flex w-3/4 flex-col items-center">
                                ${renderLines(gameState, gameState.researchReport, ({ id }) => api.setViewAsset(id))}
                            </div>
                        </div>
                    <//>
                    <${Tab} label="Earnings">

                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.decreaseEarnings} 
                            label="Decrease Earnings"
                            color="red"
                            containerClass="flex flex-row justify-between mt-2 w-full"
                            buttonClass="btn flex-1 mx-1"
                        />
                        <${ActingAsRequiredButton} 
                            gameState=${gameState} 
                            getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.increaseEarnings} 
                            label="Increase Earnings"
                            color="green"
                            containerClass="flex flex-row justify-between mt-2 w-full"
                            buttonClass="btn flex-1 mx-1"
                        />

                        <div class="flex flex-col justify-center items-center">
                            ${renderLines(gameState, gameState.earningsReport, ({ id }) => api.setViewAsset(id))}
                        </div>
                    <//>
                    <${Tab} label="Financials">
                        <${FinancialsTab} gameState=${gameState} />
                    <//>
                    <${Tab} label="Cashflow">
                        ${html`<${CashflowTab} gameState=${gameState} />`}
                    <//>
                    ${gameState.activeIndustryId === api.BANK_IND ? html`<${Tab} label="Loans">
                        ${html`<${LoansTab} gameState=${gameState} />`}
                    <//>` : ''}
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
                        <div class="flex flex-col w-full items-center">
                            <div class="flex flex-row items-center gap-5">
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.publicStockOffering} 
                                    label="Public Offering"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.privateStockOffering} 
                                    label="Private Offering"
                                    color="brown"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.greenmail} 
                                    label="Greenmail"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.lbo} 
                                    label="Leveraged Buyout"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.splitStock} 
                                    label="Split Stock"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    gameState=${gameState} 
                                    getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.reverseSplitStock} 
                                    label="Reverse Split"
                                    color="red"
                                />
                            </div>
                        </div>
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState, gameState.shareholdersList, ({ id }) => api.setViewAsset(id))}
                        </div>
                    <//>
                <//>
            </div>
        </div>
    </div>
`;

}

export default IndustrialView;
