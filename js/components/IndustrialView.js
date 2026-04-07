import { html, useEffect, useState, useRef, useCallback } from '../lib/preact.standalone.module.js';
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
import HotkeyButtonBar from './HotkeyButtonBar.js';
import LoansTab from './LoansTab.js';
import InterestRateSwapsTab from './InterestRateSwapsTab.js';
import OwnershipGraph from './OwnershipGraph.js';
import ActionBar from './ActionBar.js';

import OverviewPanel from './OverviewPanel.js';
import ActingAsPicker from './ActingAsPicker.js';

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
    const activeEntityName = api.useGameStore(s => s.gameState.activeEntityName);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const researchReport = api.useGameStore(s => s.gameState.researchReport);
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
    const reportScopeRef = useRef(false);
    const [, setShareholdersScopeTick] = useState(0);
    const shareholdersBarButtons = [
        { label: showShareholdersGraph ? 'Show Text Report' : 'Show Graph', onClick: () => setShowShareholdersGraph(!showShareholdersGraph), color: '' },
    ];
    const shareholdersExtrasStart = shareholdersBarButtons.filter(Boolean).length + 1;

    // ETF detection for conditional UI
    const isActiveEntityETF = activeIndustryId === api.ETF_IND;

    // ActingAsPicker state for trade buttons on non-controlled views
    const [pickerAction, setPickerAction] = useState(null);
    const [showPicker, setShowPicker] = useState(false);

    // Wrap a trade button's onClick to show picker on non-controlled views
    const wrapTradeButton = useCallback((btn, actionFn) => {
        if (!btn || buttonProps.controlsActiveEntity) return btn;
        return { ...btn, onClick: () => { setPickerAction(() => actionFn); setShowPicker(true); } };
    }, [buttonProps.controlsActiveEntity]);

    const handlePickerSelect = useCallback((entityId) => {
        setShowPicker(false);
        if (pickerAction) {
            api.changeActingAs(entityId);
            // Small delay to let actingAs propagate before firing the action
            setTimeout(() => pickerAction(), 100);
        }
        setPickerAction(null);
    }, [pickerAction]);

    const handlePickerCancel = useCallback(() => {
        setShowPicker(false);
        setPickerAction(null);
    }, []);

    const [savedTab, setSavedTab] = useCookie('industrialViewTab', 'General');
    const [activeTab, setActiveTabInternal] = useState(savedTab);

    // Wrapper to also update navigation history when tab changes
    const setActiveTab = (tab) => {
        setActiveTabInternal(tab);
        setSavedTab(tab);
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

    // Auto-set actingAs when navigating to a controlled company
    useEffect(() => {
        if (buttonProps.controlsActiveEntity && activeEntityNum > 10) {
            api.changeActingAs(activeEntityNum);
        }
    }, [activeEntityNum, buttonProps.controlsActiveEntity]);

    return html`
    <div class="flex flex-col h-full">
        <div class="flex flex-row gap-2 flex-1 min-h-0">
            <div class="flex flex-col w-full gap-2 h-full">
                ${buttonProps.controlsActiveEntity ? html`<${ActionBar} entityLabel="${activeEntitySymbol} - ${activeEntityName}" />` : ''}
                <${Tabs} activeTab=${activeTab} onTabChange=${setActiveTab}>
                    <${Tab} label="Overview" hotkey="v">
                        <${OverviewPanel} />
                    <//>
                    <${Tab} label="General" hotkey="g" id=${api.UI_CORP_RESEARCH_REPORT}>
                        <div class="flex flex-row w-full h-full gap-2 min-h-0">
                            <div class="flex w-1/4 flex-col gap-2 h-full min-h-0 overflow-hidden">
                                <div class="earnings-date-badge mb-1 font-text-sm text-center" style="display: flex; justify-content: space-between; align-items: center;">
                                    <span><span class="whitespace-nowrap">Earnings Date:</span> <span class="whitespace-nowrap">${nextEarningsDate}</span></span>
                                    <button class="text-xs" style="opacity: 0.6; cursor: pointer; background: none; border: none; padding: 0 2px;" data-testid="btn-clear-chart" onClick=${() => api.clearChart()} title="Clear chart history for this entity">Clear Chart</button>
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
                                    wrapTradeButton(buttonProps.buyStock, () => api.buyStock(activeEntityNum)),
                                    wrapTradeButton(buttonProps.shortStock, () => api.shortStock(activeEntityNum)),
                                    !isActiveEntityETF && wrapTradeButton({ ...buttonProps.buyCorpBond, label: "Buy Bonds" }, () => api.buyCorporateBond(activeEntityNum)),
                                    wrapTradeButton(buttonProps.buyCalls, () => api.buyCalls(0)),
                                    wrapTradeButton(buttonProps.sellCalls, () => api.sellCalls(0)),
                                    wrapTradeButton(buttonProps.buyPuts, () => api.buyPuts(0)),
                                    wrapTradeButton(buttonProps.sellPuts, () => api.sellPuts(0)),
                                    !isActiveEntityETF && wrapTradeButton(buttonProps.advancedOptions, api.advancedOptionsTrading),
                                    buttonProps.controlsActiveEntity && !isActiveEntityETF && { divider: true },
                                    buttonProps.controlsActiveEntity && !isActiveEntityETF && buttonProps.rebrand,
                                    buttonProps.controlsActiveEntity && !isActiveEntityETF && buttonProps.restructure,
                                    isActiveEntityETF && buttonProps.controlsActiveEntity && buttonProps.becomeEtfAdvisor,
                                    isActiveEntityETF && buttonProps.controlsActiveEntity && buttonProps.setAdvisoryFee,
                                ]} />
                                <div class="flex flex-col items-center overflow-y-auto flex-1 min-h-0">
                                    ${renderLines(researchReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, reportScopeRef)}
                                </div>
                            </div>
                        </div>
                    <//>
                    <${Tab} label="Financials" hotkey="f" id=${api.UI_CORP_FINANCIAL_PROFILE}>
                        <${FinancialsTab} />
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
                                    <${OwnershipGraph} showOwners=${true} showSubsidiaries=${true} startNumber=${shareholdersExtrasStart} />
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
    <${ActingAsPicker}
        show=${showPicker}
        actionLabel=${pickerAction ? 'Select who is acting' : ''}
        onSelect=${handlePickerSelect}
        onCancel=${handlePickerCancel}
    />
`;

}

export default IndustrialView;
