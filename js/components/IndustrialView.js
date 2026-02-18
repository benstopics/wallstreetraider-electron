import { html, useEffect, useState, useRef } from '../lib/preact.standalone.module.js';
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
import HotkeyButtonBar from './HotkeyButtonBar.js';
import LoansTab from './LoansTab.js';
import CashflowTab from './CashflowTab.js';
import InterestRateSwapsTab from './InterestRateSwapsTab.js';
import OwnershipGraph from './OwnershipGraph.js';
import ActionBar from './ActionBar.js';

import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import { useCookie } from '../hooks/useCookie.js';

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
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
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

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    // Local state for shareholders view mode (initialized from global setting)
    const [showShareholdersGraph, setShowShareholdersGraph] = useState(shareholderGraphSetting);

    // Shareholders tab hotkey refs
    const shareholdersExtrasRef = useRef(null);
    const shareholdersScopeRef = useRef(false);
    const [, setShareholdersScopeTick] = useState(0);
    const shareholdersBarButtons = [
        { label: showShareholdersGraph ? 'Show Text Report' : 'Show Graph', onClick: () => setShowShareholdersGraph(!showShareholdersGraph), color: '' },
    ];
    const shareholdersExtrasStart = shareholdersBarButtons.filter(Boolean).length + 1;

    // ETF detection for conditional UI
    const isActiveEntityETF = activeIndustryId === api.ETF_IND;

    const [savedTab, setSavedTab] = useCookie('industrialViewTab', 'General');
    const [activeTab, setActiveTabInternal] = useState(savedTab);

    // Wrapper to also update navigation history when tab changes
    const setActiveTab = (tab) => {
        setActiveTabInternal(tab);
        setSavedTab(tab);
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
            setActiveTabInternal(savedTab);
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

    return html`
    <div class="flex flex-col h-full">
        <div class="flex flex-row gap-2 flex-1 min-h-0">
            <div class="flex flex-col w-full gap-2 h-full">
                <${ActionBar} />
                <${Tabs} activeTab=${activeTab} onTabChange=${setActiveTab}>
                    <${Tab} label="General" hotkey="g" id=${api.UI_CORP_RESEARCH_REPORT}>
                        <div class="flex flex-row w-full h-full gap-2 min-h-0">
                            <div class="flex w-1/4 flex-col gap-2 h-full min-h-0 overflow-hidden">
                                <div class="earnings-date-badge mb-1 font-text-sm text-center">
                                    <span class="whitespace-nowrap">Earnings Date:</span> <span class="whitespace-nowrap">${nextEarningsDate}</span>
                                </div>
                                <div class="flex flex-2 flex-col w-full">
                                    ${html`<${AssetPriceChart} assetId=${activeEntityNum} chartTitle="${activeEntitySymbol} Stock Price" />`}
                                </div>
                                ${!isActiveEntityETF ? html`<div class="flex flex-[1.5] min-h-0">
                                    ${html`<${EPSChart} epsData=${extractEPSData(financialProfile)} />`}
                                </div>` : ''}
                                <div class="flex flex-[4] min-h-0">
                                    ${html`<${AdvisorySummary} />`}
                                </div>
                            </div>
                            <div class="flex w-3/4 flex-col h-full min-h-0">
                                <${HotkeyButtonBar} buttons=${[
                                    buttonProps.buyStock,
                                    buttonProps.shortStock,
                                    !isActiveEntityETF && { ...buttonProps.buyCorpBond, label: "Buy Bonds" },
                                    buttonProps.buyCalls,
                                    buttonProps.sellCalls,
                                    buttonProps.buyPuts,
                                    buttonProps.sellPuts,
                                    !isActiveEntityETF && buttonProps.advancedOptions,
                                ]} />
                                <div class="flex flex-col items-center overflow-y-auto flex-1 min-h-0">
                                    ${renderLines(researchReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                </div>
                            </div>
                        </div>
                    <//>
                    <${Tab} label="Earnings" hotkey="e" id=${api.UI_CORP_EARNINGS_REPORT}>
                        <div class="flex flex-col justify-center items-center">
                            ${renderLines(earningsReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                        </div>
                    <//>
                    <${Tab} label="Financials" hotkey="f" id=${api.UI_CORP_FINANCIAL_PROFILE}>
                        <${FinancialsTab} />
                    <//>
                    <${Tab} label="Cashflow" hotkey="c" id=${api.UI_CORP_CASH_FLOW_PROJECTION}>
                        ${html`<${CashflowTab} />`}
                    <//>
                    ${activeIndustryId === api.BANK_IND ? html`<${Tab} label="Loans" hotkey="l" id=${api.UI_BANK_LOANS_LIST}>
                        ${html`<${LoansTab} />`}
                    <//>` : ''}
                    <${Tab} label="Stocks & Bonds" hotkey="s" id=${api.UI_CORP_STOCKS_BONDS_PORTFOLIO}>
                        <${PortfolioTab} />
                    <//>
                    <${Tab} label="Swaps" hotkey="w" id=${api.UI_CORP_SWAPS_PORTFOLIO}>
                        <${InterestRateSwapsTab} />
                    <//>
                    <${Tab} label="Options" hotkey="o" id=${api.UI_CORP_OPTIONS_PORTFOLIO}>
                        <${OptionsTab} />
                    <//>
                    ${activeIndustryId != api.BANK_IND ? html`<${Tab} label="Commodities & Crypto" hotkey="m" id=${api.UI_CORP_COMMODITY_CONTRACTS_LIST}>
                        ${html`<${CommoditiesTab} />`}
                    <//>` : ''}
                    <${Tab} label="Shareholders" hotkey="r" id=${api.UI_CORP_SHAREHOLDERS_LIST}>
                        <div class="flex flex-col h-full">
                            <${HotkeyButtonBar} buttons=${shareholdersBarButtons}
                                extrasContainerRef=${shareholdersExtrasRef}
                                scopeActiveRef=${shareholdersScopeRef}
                                onScopeActiveChange=${() => setShareholdersScopeTick(n => n + 1)}
                                class="flex flex-row items-center gap-2 mb-2" />
                            ${showShareholdersGraph ? html`
                                <div class="flex-1 min-h-0 overflow-auto" style="min-height: 280px;">
                                    <${OwnershipGraph} showOwners=${true} showSubsidiaries=${true} />
                                </div>
                            ` : html`
                                <div ref=${shareholdersExtrasRef} class="flex flex-col items-center overflow-y-auto min-h-0">
                                    ${renderLines(shareholdersList, ({ id }) => api.setViewAsset(id), () => '', hyperlinkRegex, undefined, shareholdersExtrasStart, shareholdersScopeRef)}
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
