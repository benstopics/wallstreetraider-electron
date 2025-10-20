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

const PlayerView = ({ gameState }) => html`
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
                    <${Tab} label="Financials">
                        <${FinancialsTab} gameState=${gameState} />
                    <//>
                    <${Tab} label="Cashflow">
                        <div class="flex flex-col items-center">
                            <${ActingAsRequiredButton} 
                                gameState=${gameState} 
                                getDisabledMessage=${gameState => !gameState.actingAs ? "Must be acting as yourself" : false} 
                                onClick=${api.viewForSaleItems} 
                                label="Browse For Sale Items"
                                color="green"
                            />
                            ${renderLines(gameState, gameState.cashflowProjection, ({ id }) => api.setViewAsset(id))}
                        </div>
                    <//>
                    <${Tab} label="Stocks & Bonds">
                        <${PortfolioTab} gameState=${gameState} />
                    <//>
                    <${Tab} label="Options">
                        ${html`<${OptionsTab} gameState=${gameState} />`}
                    <//>
                    <${Tab} label="Commodities & Crypto">
                        ${html`<${CommoditiesTab} gameState=${gameState} />`}
                    <//>
                    <${Tab} label="Advances">
                        <div class="flex flex-col items-center">
                            ${gameState.actingAs ? html`
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
                            ${renderLines(gameState, gameState.advances,
    ({ id }) => api.setViewAsset(id),
    ({ id }) => gameState.actingAs ? html`<button
                                        class="btn flex-1 mx-1"
                                        onClick=${() => api.callInAdvance(id)}>
                                            Recall
                                    </button>`
        : html`
                                        <${Tooltip} text="Must be acting as this company">
                                            <button class="btn disabled w-full">Recall</button>
                                        <//>`
)}
                        </div>
                    <//>
                    <${Tab} label="My Corporations">
                        <div class="flex flex-col items-center">
                            ${renderLines(gameState, gameState.myCorporationsReport,
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
                                </div>` : '')}
                        </div>
                    <//>
                <//>
            </div>
        </div>
    </div>
`;

export default PlayerView;
