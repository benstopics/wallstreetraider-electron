import { html, useEffect, useState } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import AdvisorySummary from './AdvisorySummary.js';
import CommoditiesTab from './CommoditiesTab.js';
import PortfolioTab from './PortfolioTab.js';
import OptionsTab from './OptionsTab.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import EPSChart from './EPSChart.js';
import FinancialsTab from './FinancialsTab.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import LoansTab from './LoansTab.js';
import CashflowTab from './CashflowTab.js';
import InterestRateSwapsTab from './InterestRateSwapsTab.js';
import OwnershipGraph from './OwnershipGraph.js';
import ActionBar from './ActionBar.js';
import OwnershipViewToggle from './OwnershipViewToggle.js';

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


const IndustrialView = () => {
    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const actingAsSymbol = api.useGameStore(s => s.gameState.actingAsSymbol);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const researchReport = api.useGameStore(s => s.gameState.researchReport);
    const earningsReport = api.useGameStore(s => s.gameState.earningsReport);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const eventString = api.useGameStore(s => s.gameState.eventString);
    const nextEarningsDate = api.useGameStore(s => s.gameState.nextEarningsDate);
    const preferredTab = api.useGameStore(s => s.gameState.uiPreferredCompanyTab);
    const shareholderGraphSetting = api.useGameStore(s => s.gameState.shareholderGraphSetting);
    const shareholdersList = api.useGameStore(s => s.gameState.shareholdersList);

    // Local state for shareholders view mode (initialized from global setting)
    const [showShareholdersGraph, setShowShareholdersGraph] = useState(shareholderGraphSetting);

    // ETF detection for conditional UI
    const isActiveEntityETF = activeIndustryId === api.ETF_IND;

    const [activeTab, setActiveTabInternal] = useState("General");

    // Wrapper to also update navigation history when tab changes
    const setActiveTab = (tab) => {
        setActiveTabInternal(tab);
        api.updateCurrentNavTab(tab);
    };

    useEffect(() => {
        // Check for preferred tab from navigation
        if (preferredTab) {
            setActiveTabInternal(preferredTab);
            // Clear one-shot preference
            const gs = api.gameStore.getState().gameState || {};
            api.gameStore.getState().setGameState({ ...gs, uiPreferredCompanyTab: null });
        } else {
            setActiveTabInternal("General");
        }
    }, [activeEntityNum, preferredTab]);

    useEffect(() => {
        if (eventString) {
            const eventData = JSON.parse(eventString);
            if (eventData.eventType === "setIndustrialViewActiveTab") {
                setActiveTabInternal(eventData.tab);
                api.clearEventString();
            }
        }
    }, [eventString]);

    // Quick trading button logic (simplified - full logic is in ActionBar)
    const canShortStock = actingAsId === api.HUMAN1_ID;

    const buyBondDisabledMessage = isActiveEntityETF
        ? false
        : ![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
            ? "Only players, banks, and insurance companies can buy bonds."
            : false;

    return html`
    <div class="flex flex-col h-full">
        <div class="flex flex-row gap-2 flex-1 min-h-0">
            <div class="flex flex-col w-full gap-2 h-full">
                <${ActionBar} />
                <${Tabs} activeTab=${activeTab} onTabChange=${setActiveTab}>
                    <${Tab} label="General" id=${api.UI_CORP_RESEARCH_REPORT}>
                        <div class="flex flex-row w-full h-full gap-2 min-h-0">
                            <div class="flex w-1/4 flex-col gap-2 h-full min-h-0">
                                <div class="flex flex-col min-h-0">
                                    <div class="flex flex-col" style="height: 200px;">
                                        <div class="earnings-date-badge mb-1">Earnings Date: ${nextEarningsDate}</div>
                                        ${html`<${AssetPriceChart} assetId=${activeEntityNum} chartTitle="${activeEntitySymbol} Stock Price" />`}
                                    </div>
                                    <div class="flex flex- flex-row items-center justify-center mt-2 w-full">
                                        <label class="h-full flex items-center justify-center">
                                            ${actingAs ? `Buy on behalf of ${activeEntitySymbol}:` : `${actingAsSymbol} buys ${activeEntitySymbol} positions:`}
                                        </label>
                                    </div>
                                    <div class="flex flex-row justify-between mt-2 w-full" style="height:30px">
                                        <${DisabledTooltipButton}
                                            onClick=${() => api.buyStock(actingAs ? 0 : activeEntityNum)}
                                            label="Buy Stock"
                                            color="green"
                                        />
                                        ${canShortStock && html`<${DisabledTooltipButton}
                                            onClick=${() => api.shortStock(actingAs ? 0 : activeEntityNum)}
                                            label="Short Stock"
                                            color="green"
                                        />`}
                                        ${!isActiveEntityETF ? html`<${DisabledTooltipButton}
                                            disabledMessage=${buyBondDisabledMessage}
                                            onClick=${() => api.buyCorporateBond(actingAs ? 0 : activeEntityNum)}
                                            label="Buy Bonds"
                                            color="green"
                                        />` : ''}
                                    </div>
                                    <div class="flex flex-row justify-between mt-2 w-full" style="height:30px">
                                        <${DisabledTooltipButton}
                                            onClick=${() => api.buyCalls(0)} 
                                            label="Buy Calls"
                                            color="green"
                                        />
                                        <${DisabledTooltipButton}
                                            onClick=${() => api.sellCalls(0)} 
                                            label="Sell Calls"
                                            color="red"
                                        />
                                        <${DisabledTooltipButton} 
                                            onClick=${() => api.buyPuts(0)} 
                                            label="Buy Puts"
                                            color="green"
                                        />
                                        <${DisabledTooltipButton} 
                                            onClick=${() => api.sellPuts(0)} 
                                            label="Sell Puts"
                                            color="red"
                                        />
                                    </div>
                                     ${!isActiveEntityETF ? html`<div class="flex flex-row justify-between mt-2 w-full" style="height:20px">
                                       <${DisabledTooltipButton}
                                            onClick=${api.advancedOptionsTrading}
                                            label="Advanced Options"
                                            color="green"
                                            containerClass="w-full"
                                            buttonClass="w-full"
                                        />
                                    </div>` : ''}
                                </div>
                                ${!isActiveEntityETF && html`<div class="flex flex-[1.75] min-h-0">
                                    ${html`<${EPSChart} epsData=${extractEPSData(financialProfile)} />`}
                                </div>`}
                                <div class="flex flex-[4] min-h-0">
                                    ${html`<${AdvisorySummary} />`}
                                </div>
                            </div>
                            <div class="flex w-3/4 flex-col items-center">
                                ${renderLines(researchReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                            </div>
                        </div>
                    <//>
                    <${Tab} label="Earnings" id=${api.UI_CORP_EARNINGS_REPORT}>
                        <div class="flex flex-col justify-center items-center">
                            ${renderLines(earningsReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                        </div>
                    <//>
                    <${Tab} label="Financials" id=${api.UI_CORP_FINANCIAL_PROFILE}>
                        <${FinancialsTab} />
                    <//>
                    <${Tab} label="Cashflow" id=${api.UI_CORP_CASH_FLOW_PROJECTION}>
                        ${html`<${CashflowTab} />`}
                    <//>
                    ${activeIndustryId === api.BANK_IND ? html`<${Tab} label="Loans" id=${api.UI_BANK_LOANS_LIST}>
                        ${html`<${LoansTab} />`}
                    <//>` : ''}
                    <${Tab} label="Stocks & Bonds" id=${api.UI_CORP_STOCKS_BONDS_PORTFOLIO}>
                        <${PortfolioTab} />
                    <//>
                    <${Tab} label="Swaps" id=${api.UI_CORP_SWAPS_PORTFOLIO}>
                        <${InterestRateSwapsTab} />
                    <//>
                    ${![api.BANK_IND, api.INSURANCE_IND].includes(activeIndustryId) && html`<${Tab} label="Options" id=${api.UI_CORP_OPTIONS_PORTFOLIO}>
                        <${OptionsTab} />
                    <//>`}
                    ${activeIndustryId != api.BANK_IND && html`<${Tab} label="Commodities & Crypto" id=${api.UI_CORP_COMMODITY_CONTRACTS_LIST}>
                        ${html`<${CommoditiesTab} />`}
                    <//>`}
                    <${Tab} label="Shareholders" id=${api.UI_CORP_SHAREHOLDERS_LIST}>
                        <div class="flex flex-col h-full">
                            <${OwnershipViewToggle}
                                showGraph=${showShareholdersGraph}
                                onToggle=${() => setShowShareholdersGraph(!showShareholdersGraph)}
                            />
                            ${showShareholdersGraph ? html`
                                <div class="flex-1 min-h-0 overflow-auto" style="min-height: 280px;">
                                    <${OwnershipGraph} showOwners=${true} showSubsidiaries=${true} />
                                </div>
                            ` : html`
                                <div class="flex justify-center items-center">
                                    ${renderLines(shareholdersList, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                </div>
                            `}
                        </div>
                    <//>
                <//>
            </div>
        </div>
    </div>
`;

}

export default IndustrialView;
