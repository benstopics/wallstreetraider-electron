import { html, useEffect, useState } from '../lib/preact.standalone.module.js';
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


const IndustrialView = () => {
    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies);
    const chairedCompanyId = api.useGameStore(s => s.gameState.chairedCompanyId);
    const actingAsSymbol = api.useGameStore(s => s.gameState.actingAsSymbol);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const researchReport = api.useGameStore(s => s.gameState.researchReport);
    const earningsReport = api.useGameStore(s => s.gameState.earningsReport);
    const shareholdersList = api.useGameStore(s => s.gameState.shareholdersList);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const eventString = api.useGameStore(s => s.gameState.eventString);

    const [activeTab, setActiveTab] = useState("General");

    useEffect(() => {
        setActiveTab("General");
    }, [activeEntityNum]);

    useEffect(() => {
        if (eventString) {
            const eventData = JSON.parse(eventString);
            if (eventData.eventType === "setIndustrialViewActiveTab") {
                setActiveTab(eventData.tab);
                api.clearEventString();
            }
        }
    }, [eventString]);

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
                    ${api.isPlayerControlled(controlledCompanies, activeEntityNum)
                        ? api.isPlayerCEO(chairedCompanyId, activeEntityNum) ? html`<${ActingAsRequiredButton}
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                            onClick=${api.resignAsCeo} 
                            label="Resign as CEO"
                            color="red"
                        />` : html`<${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.electCeo} 
                            label="Elect as CEO"
                            color="red"
                        />` : ''}
                    <${ActingAsRequiredButton} 
                        disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                        onClick=${api.rebrand} 
                        label="Rebrand"
                        color="red"
                    />
                    ${actingAsId !== activeEntityNum // Cannot sue itself
                        && actingAsId !== api.HUMAN1_ID // Players cannot file antitrust lawsuits
                        && actingAsIndustryId === activeIndustryId // Must be same industry
                        && !api.isPlayerControlled(controlledCompanies, activeEntityNum) // Cannot be controlled by you
                        ? html`<${ActingAsRequiredButton}
                        onClick=${() => api.antitrustLawsuit(activeEntityNum)} 
                        label="Antitrust Lawsuit\n${actingAsSymbol} vs ${activeEntitySymbol}"
                        color="red"
                    />` : ''}
                    ${!api.isPlayerControlled(controlledCompanies, activeEntityNum) // Cannot be controlled by you
                        && actingAsId !== activeEntityNum // Company cannot sue itself
                        ? html`<${ActingAsRequiredButton}
                        onClick=${() => api.harrassingLawsuit(activeEntityNum)} 
                        label="Harrassing Lawsuit\n${actingAsSymbol} vs ${activeEntitySymbol}"
                        color="red"
                    />` : ''}
                    ${activeIndustryId === api.INSURANCE_IND || activeIndustryId === api.SECURITIES_BROKER_IND ? html`<${ActingAsRequiredButton}
                        disabledMessage=${!actingAs ? "Must be acting as this company" : false}
                        onClick=${api.setAdvisoryFee} 
                        label="Set Advisory Fee"
                        color="blue"
                    />` : ''}
                    <${ActingAsRequiredButton}
                        disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                        onClick=${api.startup} 
                        label="Startup"
                        color="green"
                    />
                    <${ActingAsRequiredButton}
                        disabledMessage=${actingAs ? "You cannot capital contribute to yourself!" : false} 
                        onClick=${api.capitalContribution} 
                        label="Contribute Capital"
                        color="green"
                    />
                    <${ActingAsRequiredButton} 
                        disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                        onClick=${api.issueNewCorpBonds} 
                        label="Issue Corp Bonds"
                        color="brown"
                    />
                    <${ActingAsRequiredButton} 
                        disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                        onClick=${api.redeemCorpBonds} 
                        label="Redeem Corp Bonds"
                        color="brown"
                    />
                </div>
                <${Tabs} activeTab=${activeTab} onTabChange=${setActiveTab}>
                    <${Tab} label="General" id=${api.UI_CORP_RESEARCH_REPORT}>
                        <div class="flex flex-row w-full h-full gap-2 min-h-0">
                            <div class="flex w-1/4 flex-col gap-2 h-full min-h-0">
                                <div class="flex flex-col flex-[4] min-h-0">
                                    <div class="flex-[4] min-h-0">
                                        ${html`<${AssetPriceChart} assetId=${activeEntityNum} chartTitle="${activeEntitySymbol} Stock Price" />`}
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
                                            disabledMessage=${actingAs ? "Entity cannot buy options on itself" : false} 
                                            onClick=${() => api.buyCalls(0)} 
                                            label="Buy Calls"
                                            color="green"
                                        />
                                        <${ActingAsRequiredButton} 
                                            disabledMessage=${actingAs ? "Entity cannot sell options on itself" : false} 
                                            onClick=${() => api.sellCalls(0)} 
                                            label="Sell Calls"
                                            color="red"
                                        />
                                        <${ActingAsRequiredButton} 
                                            disabledMessage=${actingAs ? "Entity cannot buy options on itself" : false} 
                                            onClick=${() => api.buyPuts(0)} 
                                            label="Buy Puts"
                                            color="green"
                                        />
                                        <${ActingAsRequiredButton} 
                                            disabledMessage=${actingAs ? "Entity cannot sell options on itself" : false} 
                                            onClick=${() => api.sellPuts(0)} 
                                            label="Sell Puts"
                                            color="red"
                                        />
                                    </div>
                                    <div class="flex flex-row justify-between mt-2 w-full" style="height:20px">
                                        <${ActingAsRequiredButton} 
                                            disabledMessage=${actingAs ? "Entity cannot buy options on itself" : false} 
                                            onClick=${api.advancedOptionsTrading} 
                                            label="Advanced Options"
                                            color="green"
                                            containerClass="w-full"
                                            buttonClass="w-full"
                                        />
                                    </div>
                                </div>
                                <div class="flex flex-[1.75] min-h-0">
                                    ${html`<${EPSChart} epsData=${extractEPSData(financialProfile)} />`}
                                </div>
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

                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.decreaseEarnings} 
                            label="Decrease Earnings"
                            color="red"
                            containerClass="flex flex-row justify-between mt-2 w-full"
                            buttonClass="btn flex-1 mx-1"
                        />
                        <${ActingAsRequiredButton} 
                            disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                            onClick=${api.increaseEarnings} 
                            label="Increase Earnings"
                            color="green"
                            containerClass="flex flex-row justify-between mt-2 w-full"
                            buttonClass="btn flex-1 mx-1"
                        />

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
                    <${Tab} label="Options" id=${api.UI_CORP_OPTIONS_PORTFOLIO}>
                        <${OptionsTab} />
                    <//>
                    <${Tab} label="Commodities & Crypto" id=${api.UI_CORP_COMMODITY_CONTRACTS_LIST}>
                        ${html`<${CommoditiesTab} />`}
                    <//>
                    <${Tab} label="Shareholders" id=${api.UI_CORP_SHAREHOLDERS_LIST}>
                        <div class="flex flex-col w-full items-center">
                            <div class="flex flex-row items-center gap-5">
                                <${ActingAsRequiredButton} 
                                    disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.publicStockOffering} 
                                    label="Public Offering"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.privateStockOffering} 
                                    label="Private Offering"
                                    color="brown"
                                />
                                <${ActingAsRequiredButton} 
                                    disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.greenmail} 
                                    label="Greenmail"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.lbo} 
                                    label="Leveraged Buyout"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.splitStock} 
                                    label="Split Stock"
                                    color="green"
                                />
                                <${ActingAsRequiredButton} 
                                    disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
                                    onClick=${api.reverseSplitStock} 
                                    label="Reverse Split"
                                    color="red"
                                />
                            </div>
                        </div>
                        <div class="flex justify-center items-center">
                            ${renderLines(shareholdersList, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                        </div>
                    <//>
                <//>
            </div>
        </div>
    </div>
`;

}

export default IndustrialView;
