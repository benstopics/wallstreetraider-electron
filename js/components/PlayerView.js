import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import CommoditiesTab from './CommoditiesTab.js';
import OptionsTab from './OptionsTab.js';
import Tooltip from './Tooltip.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import PortfolioTab from './PortfolioTab.js';
import FinancialsTab from './FinancialsTab.js';
import InterestRateSwapsTab from './InterestRateSwapsTab.js';
import Button from './Button.js';
import OwnershipGraph from './OwnershipGraph.js';
import ActionBar from './ActionBar.js';
import OwnershipViewToggle from './OwnershipViewToggle.js';

const Tab = Tabs.Tab;

const PlayerView = () => {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const cashflowProjection = api.useGameStore(s => s.gameState.cashflowProjection);
    const advances = api.useGameStore(s => s.gameState.advances);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const preferredTab = api.useGameStore(s => s.gameState.uiPreferredPlayerTab);
    const shareholderGraphSetting = api.useGameStore(s => s.gameState.shareholderGraphSetting);
    const myCorporationsReport = api.useGameStore(s => s.gameState.myCorporationsReport);

    // Local state for corporations view mode (initialized from global setting)
    const [showCorporationsGraph, setShowCorporationsGraph] = useState(shareholderGraphSetting);

    const [activeTab, setActiveTabInternal] = useState("Financials");

    // Wrapper to also update navigation history when tab changes
    const setActiveTab = (tab) => {
        setActiveTabInternal(tab);
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
                        <${Tab} label="Financials" id=${api.UI_PLAYER_FINANCIAL_PROFILE}>
                            <${FinancialsTab} />
                        <//>
                        <${Tab} label="Cashflow" id=${api.UI_PLAYER_CASH_FLOW_PROJECTION}>
                            <div class="flex flex-col items-center">
                                ${renderLines(cashflowProjection, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                            </div>
                        <//>
                        <${Tab} label="Stocks & Bonds" id=${api.UI_PLAYER_STOCKS_BONDS_PORTFOLIO}>
                            <${PortfolioTab} />
                        <//>
                        <${Tab} label="Swaps" id=${api.UI_PLAYER_SWAPS_PORTFOLIO}>
                            <${InterestRateSwapsTab} />
                        <//>
                        <${Tab} label="Options" id=${api.UI_PLAYER_OPTIONS_PORTFOLIO}>
                            ${html`<${OptionsTab} />`}
                        <//>
                        <${Tab} label="Commodities & Crypto" id=${api.UI_PLAYER_COMMODITY_CONTRACTS_LIST}>
                            ${html`<${CommoditiesTab} />`}
                        <//>
                        <${Tab} label="Advances" id=${api.UI_PLAYER_ADVANCES_LIST}>
                            <div class="flex flex-col items-center">
                                ${actingAs ? html`
                                    <${Button}
                                        class="btn flex-1 mx-1 green"
                                        onClick=${api.advanceFunds}>
                                            Advance Funds
                                    </button>
                                ` : html`
                                    <${Tooltip} text="Must be acting as this company">
                                        <${Button} class="btn disabled flex-1 mx-1">Advance Funds</button>
                                    <//>
                                `}
                                ${renderLines(advances,
        ({ id }) => api.setViewAsset(id),
        ({ id }) => actingAs ? html`<${Button}
                                            class="btn flex-1 mx-1"
                                            onClick=${() => api.callInAdvance(id)}>
                                                Recall
                                        </button>`
            : html`
                                            <${Tooltip} text="Must be acting as this company">
                                                <${Button} class="btn disabled w-full">Recall</button>
                                            <//>`
    , hyperlinkRegex)}
                            </div>
                        <//>
                        <${Tab} label="My Corporations" id=${api.UI_PLAYER_CORPORATIONS_LIST}>
                            <div class="flex flex-col h-full">
                                <${OwnershipViewToggle}
                                    showGraph=${showCorporationsGraph}
                                    onToggle=${() => setShowCorporationsGraph(!showCorporationsGraph)}
                                />
                                ${showCorporationsGraph ? html`
                                    <div class="flex-1 min-h-0 overflow-auto">
                                        <${OwnershipGraph} showOwners=${false} showSubsidiaries=${true} />
                                    </div>
                                ` : html`
                                    <div class="flex flex-col items-center">
                                        ${renderLines(myCorporationsReport,
                                            ({ id }) => api.setViewAsset(id),
                                            ({ type, id }) => type === 'C' ? html`<div class="flex flex-row">
                                                <${Button}
                                                    class="btn red flex-1 mx-1"
                                                    onClick=${() => api.toggleCompanyAutopilot(id)}>
                                                        AutoPilot
                                                </button>
                                                <${Button}
                                                    class="btn brown flex-1 mx-1"
                                                    onClick=${() => api.changeActingAs(id)}>
                                                        Act As
                                                </button>
                                            </div>` : '', hyperlinkRegex)}
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
