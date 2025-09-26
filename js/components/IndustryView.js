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
import { getMultilineTextLines } from './helpers.js';
import AssetPriceChart from './AssetPriceChart.js';

const Tab = Tabs.Tab;

const IndustryView = ({ gameState }) => {

    const activeIndustryName = api.getIndustry(gameState, gameState.activeIndustryNum)?.name

    return html`
    <div class="flex flex-col h-full">
        <div class="flex flex-row gap-2 flex-1 min-h-0">
            <div class="flex flex-col w-1/4 gap-2">
                <!--<div style="height: 30px; display: flex; align-items: center;">
                    <${ActingAsDropdown} gameState=${gameState} />
                </div>-->
                <div class="">
                    ${html`<${AssetPriceChart} assetId=${api.STOCK_INDEX_ID} chartTitle="Stock Market Index" />`}
                </div>
                <div class="flex flex-[4] min-h-0">
                    ${html`<${AdvisorySummary} gameState=${gameState} />`}
                </div>
            </div>
            <div class="flex flex-col w-3/4 gap-2 h-full">
                <div class="flex gap-2 items-center" style="height: 35px;">
                    <${CommandPrompt} gameState=${gameState} />
                    <!--<div class="btn-container">
                        <button class="btn green mx-1" onclick=${api.prepayTaxes}>Prepay Taxes</button>
                    </div>
                    <div class="btn-container">
                        <button class="btn green mx-1" onclick=${api.startup}>Startup</button>
                    </div>-->
                </div>
                <${Tabs}>
                    ${activeIndustryName ? html`<${Tab} label="${activeIndustryName}">
                        <div class="flex justify-center items-center w-full h-full">
                            <${Tabs}>
                                <${Tab} label="Summary">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.industrySummaryReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                                <${Tab} label="Projection">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.industryProjectionReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                            <//>
                        </div>
                    <//>` : ''}
                    <${Tab} label="Industry Growth Rates">
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState, gameState.industryGrowthRatesReport, ({ id }) => api.viewIndustry(id))}
                        </div>
                    <//>
                    <${Tab} label="Economic Data">
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState, gameState.economicDataReport, ({ id }) => api.viewIndustry(id))}
                        </div>
                    <//>
                    <${Tab} label="Interest Rates">
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState, gameState.interestRatesReport, ({ id }) => api.viewIndustry(id))}
                        </div>
                    <//>
                    <${Tab} label="Companies With Most...">
                        <div class="flex justify-center items-center w-full h-full">
                            <${Tabs}>
                                <${Tab} label="Market Share">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.mostMarketShareReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                                <${Tab} label="Tax Losses">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.mostTaxLossReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                                <${Tab} label="Market Cap">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.mostMarketCapReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                                <${Tab} label="Cash">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.mostCashReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                            <//>
                        </div>
                    <//>
                    <${Tab} label="Who Owns What?">
                        <div class="flex justify-center items-center w-full h-full">
                            <${Tabs}>
                                <${Tab} label="Futures">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.whoOwnsFuturesReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                                <${Tab} label="Commodities">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.whoOwnsPhysicalCommoditiesReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                                <${Tab} label="Swaps">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.whoOwnsSwapsReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                                <${Tab} label="Options">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.whoOwnsOptionsReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                                <${Tab} label="Stocks">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.whoOwnsStocksReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                                <${Tab} label="Management Contracts">
                                    <div class="flex justify-center items-center">
                                        ${renderLines(gameState, gameState.whoOwnsInvestmentContractsReport, ({ id }) => api.setViewAsset(id))}
                                    </div>
                                <//>
                            <//>
                        </div>
                    <//>
                    <${Tab} label="Who's Ahead?">
                        <div class="flex justify-center items-center">
                            ${renderLines(gameState, gameState.whosAheadReport, ({ id }) => api.viewIndustry(id))}
                        </div>
                    <//>
                <//>
            </div>
        </div>
    </div>`
};

export default IndustryView;
