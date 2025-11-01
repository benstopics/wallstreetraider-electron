import { html } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import CapitalizationChart from './CapitalizationChart.js';
import AdvisorySummary from './AdvisorySummary.js';
import ActingAsDropdown from './ActingAsDropdown.js';
import CommoditiesTab from './CommoditiesTab.js';
import OptionsTab from './OptionsTab.js';
import Tooltip from './Tooltip.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import PortfolioTab from './PortfolioTab.js';
import CommandPrompt from './CommandPrompt.js';
import FinancialsTab from './FinancialsTab.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';

const Tab = Tabs.Tab;

const PlayerView = () => {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const cashflowProjection = api.useGameStore(s => s.gameState.cashflowProjection);
    const advances = api.useGameStore(s => s.gameState.advances);
    const myCorporationsReport = api.useGameStore(s => s.gameState.myCorporationsReport);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    
    return html`
        <div class="flex flex-col h-full">
            <div class="flex flex-row gap-2 flex-1 min-h-0">
                <div class="flex flex-col w-full gap-2 h-full">
                    <div class="flex gap-2 items-center" style="height: 35px;">
                        <div class="btn-container">
                            <button class="btn green mx-1" onclick=${api.prepayTaxes}>Prepay Taxes</button>
                        </div>
                        <div class="btn-container">
                            <button class="btn green mx-1" onclick=${api.startup}>Startup</button>
                        </div>
                    </div>
                    <${Tabs}>
                        <${Tab} label="Financials" id=${api.UI_PLAYER_FINANCIAL_PROFILE}>
                            <${FinancialsTab} />
                        <//>
                        <${Tab} label="Cashflow">
                            <div class="flex flex-col items-center">
                                <${ActingAsRequiredButton} 
                                    disabledMessage=${!actingAs ? "Must be acting as yourself" : false}
                                    onClick=${api.viewForSaleItems}
                                    label="Browse For Sale Items"
                                    color="green"
                                />
                                ${renderLines(cashflowProjection, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                            </div>
                        <//>
                        <${Tab} label="Stocks & Bonds" id=${api.UI_PLAYER_STOCKS_BONDS_PORTFOLIO}>
                            <${PortfolioTab} />
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
                                    <button
                                        class="btn flex-1 mx-1 green"
                                        onClick=${api.advanceFunds}>
                                            Advance Funds
                                    </button>
                                ` : html`
                                    <${Tooltip} text="Must be acting as this company">
                                        <button class="btn disabled flex-1 mx-1">Advance Funds</button>
                                    <//>
                                `}
                                ${renderLines(advances,
        ({ id }) => api.setViewAsset(id),
        ({ id }) => actingAs ? html`<button
                                            class="btn flex-1 mx-1"
                                            onClick=${() => api.callInAdvance(id)}>
                                                Recall
                                        </button>`
            : html`
                                            <${Tooltip} text="Must be acting as this company">
                                                <button class="btn disabled w-full">Recall</button>
                                            <//>`
    , hyperlinkRegex)}
                            </div>
                        <//>
                        <${Tab} label="My Corporations" id=${api.UI_PLAYER_CORPORATIONS_LIST}>
                            <div class="flex flex-col items-center">
                                ${renderLines(myCorporationsReport,
                                    ({ id }) => api.setViewAsset(id),
                                    ({ type, id }) => type === 'C' ? html`<div class="flex flex-row">
                                        <button
                                            class="btn red flex-1 mx-1"
                                            onClick=${() => api.toggleCompanyAutopilot(id)}>
                                                AutoPilot
                                        </button>
                                        <button
                                            class="btn brown flex-1 mx-1"
                                            onClick=${() => api.changeActingAs(id)}>
                                                Act As
                                        </button>
                                    </div>` : '', hyperlinkRegex)}
                            </div>
                        <//>
                    <//>
                </div>
            </div>
        </div>
    `;
}

export default PlayerView;
