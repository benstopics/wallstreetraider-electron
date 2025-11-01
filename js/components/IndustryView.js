import { html, useEffect, useState } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AdvisorySummary from './AdvisorySummary.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import AssetPriceChart from './AssetPriceChart.js';

const Tab = Tabs.Tab;

const IndustryView = () => {

    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);
    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);
    const industrySummaryReport = api.useGameStore(s => s.gameState.industrySummaryReport);
    const industryProjectionReport = api.useGameStore(s => s.gameState.industryProjectionReport);
    const industryGrowthRatesReport = api.useGameStore(s => s.gameState.industryGrowthRatesReport);
    const economicDataReport = api.useGameStore(s => s.gameState.economicDataReport);
    const interestRatesReport = api.useGameStore(s => s.gameState.interestRatesReport);
    const mostMarketShareReport = api.useGameStore(s => s.gameState.mostMarketShareReport);
    const mostTaxLossReport = api.useGameStore(s => s.gameState.mostTaxLossReport);
    const mostMarketCapReport = api.useGameStore(s => s.gameState.mostMarketCapReport);
    const mostCashReport = api.useGameStore(s => s.gameState.mostCashReport);
    const whoOwnsFuturesReport = api.useGameStore(s => s.gameState.whoOwnsFuturesReport);
    const whoOwnsPhysicalCommoditiesReport = api.useGameStore(s => s.gameState.whoOwnsPhysicalCommoditiesReport);
    const whoOwnsSwapsReport = api.useGameStore(s => s.gameState.whoOwnsSwapsReport);
    const whoOwnsOptionsReport = api.useGameStore(s => s.gameState.whoOwnsOptionsReport);
    const whoOwnsStocksReport = api.useGameStore(s => s.gameState.whoOwnsStocksReport);
    const whoOwnsInvestmentContractsReport = api.useGameStore(s => s.gameState.whoOwnsInvestmentContractsReport);
    const whosAheadReport = api.useGameStore(s => s.gameState.whosAheadReport);

    const [activeTab, setActiveTab] = useState('Industry Growth Rates');

    const activeIndustryName = api.getIndustry(allIndustries, activeIndustryNum)?.name

    const { setGameState } = api.useWSRContext();

    useEffect(() => {
        if (activeIndustryName && activeIndustryName !== activeTab) {
            setActiveTab(activeIndustryName);
        }
    }, [activeIndustryName]);

    return html`
    <div class="flex flex-col h-full">
        <div class="flex flex-row gap-2 flex-1 min-h-0">
            <div class="flex flex-col w-1/4 gap-2">
                <div class="">
                    ${html`<${AssetPriceChart} assetId=${api.STOCK_INDEX_ID} chartTitle="Stock Market Index" />`}
                </div>
                <div class="flex flex-[4] min-h-0">
                    ${html`<${AdvisorySummary} />`}
                </div>
            </div>
            <div class="flex flex-col w-3/4 gap-2 h-full">
                <div class="flex gap-2 items-center" style="height: 35px;">
                    <!--<div class="btn-container">
                        <button class="btn green mx-1" onclick=${api.prepayTaxes}>Prepay Taxes</button>
                    </div>
                    <div class="btn-container">
                        <button class="btn green mx-1" onclick=${api.startup}>Startup</button>
                    </div>-->
                </div>
                <${Tabs} activeTab=${activeTab} onTabChange=${setActiveTab}>
                    ${activeIndustryName ? html`<${Tab} label="${activeIndustryName}">
                        <div class="flex justify-center items-center w-full h-full">
                            <${Tabs}>
                                <${Tab} label="Summary" id=${api.UI_INDUSTRY_SUMMARY_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(industrySummaryReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                                ${![1, 2, 70, 71].includes(activeIndustryNum) ? html`<${Tab} label="Projection" id=${api.UI_INDUSTRY_PROJECTIONS_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${industryProjectionReport.some(l => l.trim() !== '')
                                            ? renderLines(industryProjectionReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)
                                            : html`No projections available for the currently selected industry group:<br/><br/>${activeIndustryName}`
                                        }
                                    </div>
                                <//>` : ''}
                            <//>
                        </div>
                    <//>` : ''}
                    <${Tab} label="Industry Growth Rates" id=${api.UI_MARKET_REPORTS_INDUSTRY_GROWTH_RATES_REPORT}>
                        <div class="flex justify-center items-center">
                            ${renderLines(industryGrowthRatesReport, ({ id }) => {
                                api.viewIndustry(id)
                            }, null, hyperlinkRegex)}
                        </div>
                    <//>
                    <${Tab} label="Economic Data" id=${api.UI_MARKET_REPORTS_ECON_STATS_REPORT}>
                        <div class="flex justify-center items-center">
                            ${renderLines(economicDataReport, ({ id }) => {
                                api.viewIndustry(id)
                            }, null, hyperlinkRegex)}
                        </div>
                    <//>
                    <${Tab} label="Interest Rates" id=${api.UI_MARKET_REPORTS_INTEREST_RATES_REPORT}>
                        <div class="flex justify-center items-center">
                            ${renderLines(interestRatesReport, ({ id }) => {
                                api.viewIndustry(id)
                            }, null, hyperlinkRegex)}
                        </div>
                    <//>
                    <${Tab} label="Companies With Most...">
                        <div class="flex justify-center items-center w-full h-full">
                            <${Tabs}>
                                <${Tab} label="Market Share" id=${api.UI_MARKET_REPORTS_LARGEST_MARKET_SHARE_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(mostMarketShareReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                                <${Tab} label="Tax Losses" id=${api.UI_MARKET_REPORTS_LARGEST_TAX_LOSSES_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(mostTaxLossReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                                <${Tab} label="Market Cap" id=${api.UI_MARKET_REPORTS_MOST_MARKET_CAP_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(mostMarketCapReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                                <${Tab} label="Cash" id=${api.UI_MARKET_REPORTS_MOST_CASH_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(mostCashReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                            <//>
                        </div>
                    <//>
                    <${Tab} label="Who Owns What?">
                        <div class="flex justify-center items-center w-full h-full">
                            <${Tabs}>
                                <${Tab} label="Futures" id=${api.UI_MARKET_REPORTS_COMMOD_FUTURES_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(whoOwnsFuturesReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                                <${Tab} label="Commodities" id=${api.UI_MARKET_REPORTS_COMMOD_PHYSICAL_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(whoOwnsPhysicalCommoditiesReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                                <${Tab} label="Swaps" id=${api.UI_MARKET_REPORTS_INTEREST_RATE_SWAPS_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(whoOwnsSwapsReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                                <${Tab} label="Options" id=${api.UI_MARKET_REPORTS_OPTIONS_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(whoOwnsOptionsReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                                <${Tab} label="Stocks" id=${api.UI_MARKET_REPORTS_STOCKS_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(whoOwnsStocksReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                                <${Tab} label="Management Contracts" id=${api.UI_MARKET_REPORTS_INVESTMENT_CONTRACTS_REPORT}>
                                    <div class="flex justify-center items-center">
                                        ${renderLines(whoOwnsInvestmentContractsReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                                    </div>
                                <//>
                            <//>
                        </div>
                    <//>
                    <${Tab} label="Who's Ahead?" id=${api.UI_MARKET_REPORTS_WHO_AHEAD_REPORT}>
                        <div class="flex justify-center items-center">
                            ${renderLines(whosAheadReport, ({ id }) => {
                                api.viewIndustry(id)
                            }, null, hyperlinkRegex)}
                        </div>
                    <//>
                <//>
            </div>
        </div>
    </div>`
};

export default IndustryView;
