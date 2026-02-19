import { html, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import CommoditiesTab from './CommoditiesTab.js';
import OptionsTab from './OptionsTab.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import PortfolioTab from './PortfolioTab.js';
import FinancialsTab from './FinancialsTab.js';
import InterestRateSwapsTab from './InterestRateSwapsTab.js';
import Button from './Button.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import OwnershipGraph from './OwnershipGraph.js';
import ActionBar from './ActionBar.js';

import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import { useCookie } from '../hooks/useCookie.js';

const Tab = Tabs.Tab;

const PlayerView = () => {

    const cashflowProjection = api.useGameStore(s => s.gameState.cashflowProjection);
    const advances = api.useGameStore(s => s.gameState.advances);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const preferredTab = api.useGameStore(s => s.gameState.uiPreferredPlayerTab);
    const shareholderGraphSetting = api.useGameStore(s => s.gameState.shareholderGraphSetting);
    const myCorporationsReport = api.useGameStore(s => s.gameState.myCorporationsReport);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    // Local state for corporations view mode (initialized from global setting)
    const [showCorporationsGraph, setShowCorporationsGraph] = useState(shareholderGraphSetting);

    // My Corporations tab hotkey refs
    const corpsExtrasRef = useRef(null);
    const corpsScopeRef = useRef(false);
    const [, setCorpsScopeTick] = useState(0);
    const corpsBarButtons = [
        { label: showCorporationsGraph ? 'Show Text Report' : 'Show Graph', onClick: () => setShowCorporationsGraph(!showCorporationsGraph), color: '' },
    ];
    const corpsExtrasStart = corpsBarButtons.filter(Boolean).length + 1;

    // Advances tab hotkey refs
    const advancesExtrasRef = useRef(null);
    const advancesScopeRef = useRef(false);
    const [, setAdvancesScopeTick] = useState(0);
    const advancesBarButtons = [
        { ...buttonProps.advanceFunds, buttonClass: "flex-1 mx-1" },
    ];
    const advancesExtrasStart = advancesBarButtons.filter(Boolean).length + 1;

    const [savedTab, setSavedTab] = useCookie('playerViewTab', 'Financials');
    const [activeTab, setActiveTabInternal] = useState(savedTab);

    // Wrapper to also update navigation history when tab changes
    const setActiveTab = (tab) => {
        setActiveTabInternal(tab);
        setSavedTab(tab);
        api.updateCurrentNavTab(tab);
    };

    // Handle preferred tab from navigation
    useEffect(() => {
        if (preferredTab) {
            setActiveTabInternal(preferredTab);
            // Clear one-shot preference
            const gs = api.gameStore.getState().gameState || {};
            api.gameStore.getState().setGameState({ ...gs, uiPreferredPlayerTab: null });
        }
    }, [preferredTab]);

    return html`
        <div class="flex flex-col h-full">
            <div class="flex flex-row gap-2 flex-1 min-h-0">
                <div class="flex flex-col w-full gap-2 h-full">
                    <${ActionBar} />
                    <${Tabs} activeTab=${activeTab} onTabChange=${setActiveTab}>
                        <${Tab} label="Financials" hotkey="f" id=${api.UI_PLAYER_FINANCIAL_PROFILE}>
                            <${FinancialsTab} />
                        <//>
                        <${Tab} label="Cashflow" hotkey="c" id=${api.UI_PLAYER_CASH_FLOW_PROJECTION}>
                            <div class="flex flex-col items-center overflow-x-auto w-full">
                                <${HotkeyButtonBar} buttons=${[
                                    buttonProps.browseForSaleItems,
                                ]} class="flex flex-row items-center gap-2 mb-2" />
                                ${renderLines(cashflowProjection, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                            </div>
                        <//>
                        <${Tab} label="Stocks & Bonds" hotkey="s" id=${api.UI_PLAYER_STOCKS_BONDS_PORTFOLIO}>
                            <${PortfolioTab} />
                        <//>
                        <${Tab} label="Swaps" hotkey="w" id=${api.UI_PLAYER_SWAPS_PORTFOLIO}>
                            <${InterestRateSwapsTab} />
                        <//>
                        <${Tab} label="Options" hotkey="o" id=${api.UI_PLAYER_OPTIONS_PORTFOLIO}>
                            ${html`<${OptionsTab} />`}
                        <//>
                        <${Tab} label="Commodities & Crypto" hotkey="m" id=${api.UI_PLAYER_COMMODITY_CONTRACTS_LIST}>
                            ${html`<${CommoditiesTab} />`}
                        <//>
                        <${Tab} label="Advances" hotkey="d" id=${api.UI_PLAYER_ADVANCES_LIST}>
                            <div class="flex flex-col items-center">
                                <${HotkeyButtonBar} buttons=${advancesBarButtons}
                                    extrasContainerRef=${advancesExtrasRef}
                                    scopeActiveRef=${advancesScopeRef}
                                    onScopeActiveChange=${() => setAdvancesScopeTick(n => n + 1)}
                                    class="flex flex-row items-center gap-2 mb-2" style="" />
                                <div ref=${advancesExtrasRef} class="flex flex-col items-center overflow-y-auto min-h-0 w-full">
                                    ${renderLines(advances,
                                        ({ id }) => api.setViewAsset(id),
                                        ({ id, extrasCounter, isLineSelected, lineNumber }) => html`<${DisabledTooltipButton}
                                            disabledMessage=${buttonProps.advanceFunds.disabledMessage}
                                            onClick=${() => api.callInAdvance(id)}
                                            onDisabledClick=${buttonProps.advanceFunds.onDisabledClick}
                                            label="Recall"
                                            color="blue"
                                            buttonClass="flex-1 mx-1"
                                            extrasIndex=${extrasCounter ? extrasCounter.current++ : null}
                                            scopeActive=${advancesScopeRef.current}
                                            hotkeyLetter="r"
                                            isLineSelected=${isLineSelected}
                                            lineNumber=${lineNumber}
                                        />`
                                    , hyperlinkRegex, undefined, advancesExtrasStart, advancesScopeRef)}
                                </div>
                            </div>
                        <//>
                        <${Tab} label="My Corporations" hotkey="p" id=${api.UI_PLAYER_CORPORATIONS_LIST}>
                            <div class="flex flex-col h-full">
                                <${HotkeyButtonBar} buttons=${corpsBarButtons}
                                    extrasContainerRef=${corpsExtrasRef}
                                    scopeActiveRef=${corpsScopeRef}
                                    onScopeActiveChange=${() => setCorpsScopeTick(n => n + 1)}
                                    class="flex flex-row items-center gap-2 mb-2" />
                                ${showCorporationsGraph ? html`
                                    <div class="flex-1 min-h-0 overflow-auto">
                                        <${OwnershipGraph} showOwners=${false} showSubsidiaries=${true} />
                                    </div>
                                ` : html`
                                    <div ref=${corpsExtrasRef} class="flex flex-col items-center overflow-y-auto min-h-0">
                                        ${renderLines(myCorporationsReport,
                                            ({ id }) => api.setViewAsset(id),
                                            ({ type, id, extrasCounter, isLineSelected, lineNumber }) => type === 'C' ? html`<div class="flex flex-row">
                                                <${DisabledTooltipButton}
                                                    disabledMessage=${false}
                                                    onClick=${() => api.toggleCompanyAutopilot(id)}
                                                    label="AutoPilot"
                                                    color="red"
                                                    extrasIndex=${extrasCounter ? extrasCounter.current++ : null}
                                                    scopeActive=${corpsScopeRef.current}
                                                    hotkeyLetter="a"
                                                    isLineSelected=${isLineSelected}
                                                    lineNumber=${lineNumber}
                                                />
                                                <${DisabledTooltipButton}
                                                    disabledMessage=${false}
                                                    onClick=${() => api.changeActingAs(id)}
                                                    label="Act As"
                                                    color="brown"
                                                    extrasIndex=${extrasCounter ? extrasCounter.current++ : null}
                                                    scopeActive=${corpsScopeRef.current}
                                                    hotkeyLetter="t"
                                                    isLineSelected=${isLineSelected}
                                                    lineNumber=${lineNumber}
                                                />
                                            </div>` : '', hyperlinkRegex, undefined, corpsExtrasStart, corpsScopeRef)}
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

export default PlayerView;
