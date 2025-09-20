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

const Tab = Tabs.Tab;

const PlayerView = ({ gameState }) => html`
    <div class="flex flex-col h-full">
        <div class="flex flex-row gap-2 flex-1 min-h-0">
            <div class="flex flex-col w-1/4 gap-2">
                <div style="height: 30px; display: flex; align-items: center;">
                    <${ActingAsDropdown} gameState=${gameState} />
                </div>
                <div class="">
                    ${html`<${CapitalizationChart} assetId=${gameState.activeEntityNum} chartTitle="Net Worth" />`}
                </div>
                <div class="flex flex-1 min-h-0">
                    ${html`<${AdvisorySummary} text=${gameState.advisorySummary} />`}
                </div>
            </div>
            <div class="flex flex-col w-3/4 gap-2 h-full">
                <div class="flex gap-2 items-center" style="height: 35px;">
                    <${CommandPrompt} gameState=${gameState} />
                    <div class="btn-container">
                        <button class="btn green mx-1" onclick=${api.prepayTaxes}>Prepay Taxes</button>
                    </div>
                    <div class="btn-container">
                        <button class="btn green mx-1" onclick=${api.startup}>Startup</button>
                    </div>
                </div>
                <${Tabs}>
                    <${Tab} label="Financials">
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState.financialProfile, ({ id }) => api.setViewAsset(id))}
                        </div>
                    <//>
                    <${Tab} label="Cashflow">
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState.cashflowProjection, ({ id }) => api.setViewAsset(id))}
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
                        <div class="flex flex-col justify-center items-center">
                            ${gameState.actingAs ? html`
                                <button
                                    class="btn flex-1 mx-1 green"
                                    onClick=${api.advanceFunds}>
                                        Advance Funds
                                </button>
                            ` : html`
                                <${Tooltip} text="Must be acting as">
                                    <button class="btn disabled flex-1 mx-1">Advance Funds</button>
                                <//>
                            `}
                            ${renderLines(gameState.advances,
    ({ id }) => api.setViewAsset(id),
    ({ id }) => gameState.actingAs ? html`<button
                                        class="btn flex-1 mx-1"
                                        onClick=${() => api.callInAdvance(id)}>
                                            Recall
                                    </button>`
        : html`
                                        <${Tooltip} text="Must be acting as">
                                            <button class="btn disabled w-full">Recall</button>
                                        <//>`
)}
                        </div>
                    <//>
                    <${Tab} label="My Corporations">
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState.myCorporationsReport,
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
