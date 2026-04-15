import { html, useEffect, useState, useRef } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AdvisorySummary from './AdvisorySummary.js';
import SubScreen from './SubScreen.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import AssetPriceChart from './AssetPriceChart.js';
import MarketHeatMapTab from './MarketHeatMapTab.js';
import SectorHeatMapTab from './SectorHeatMapTab.js';
import { useCookie } from '../hooks/useCookie.js';

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

    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const preferredTab = api.useGameStore(s => s.gameState.uiPreferredIndustryTab);
    const [savedTab, setSavedTab] = useCookie('industryViewTab', 'Heat Maps');
    const [activeTab, setActiveTabInternal] = useState(preferredTab || savedTab);
    const [industryDrilldown, setIndustryDrilldown] = useState(false);
    const [industrySubTab, setIndustrySubTab] = useState('Summary');

    const activeIndustryName = api.getIndustry(allIndustries, activeIndustryNum)?.name;

    const setActiveTab = (tab) => {
        setActiveTabInternal(tab);
        setSavedTab(tab);
    };

    useEffect(() => {
        if (preferredTab && preferredTab !== activeTab) {
            setActiveTabInternal(preferredTab);
            const gs = api.gameStore.getState().gameState || {};
            api.gameStore.getState().setGameState({ ...gs, uiPreferredIndustryTab: null });
            return;
        }
        if (activeIndustryName) {
            setIndustryDrilldown(true);
            setIndustrySubTab('Summary');
        }
    }, [activeIndustryName, preferredTab]);

    const scopeActiveRef = useRef(false);

    const handleBack = () => api.setViewAsset(activeEntityNum || api.HUMAN1_ID);

    const industryDrilldownContent = activeIndustryName && html`
        <${SubScreen} title=${activeIndustryName} onBack=${() => setIndustryDrilldown(false)}>
            <${Tabs} activeTab=${industrySubTab} onTabChange=${setIndustrySubTab}>
                <${Tab} label="Summary" id=${api.UI_INDUSTRY_SUMMARY_REPORT}>
                    <div class="flex justify-center items-center">
                        ${renderLines(industrySummaryReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                    </div>
                <//>
                ${![1, 2, 70].includes(activeIndustryNum) ? html`<${Tab} label=${activeIndustryNum === 71 ? 'Fund Strategies' : 'Projection'} id=${api.UI_INDUSTRY_PROJECTIONS_REPORT}>
                    <div class="flex justify-center items-center overflow-x-auto w-full">
                        ${industryProjectionReport.some(l => l.trim() !== '')
                            ? renderLines(industryProjectionReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)
                            : html`No projections available for the currently selected industry group:<br/><br/>${activeIndustryName}`
                        }
                    </div>
                <//>` : ''}
                <${Tab} label="Heat Map" id=${api.UI_INDUSTRY_HEATMAP}>
                    <${SectorHeatMapTab} />
                <//>
            <//>
        <//>
    `;

    return html`
    <div class="flex flex-col h-full">
        <div class="flex flex-row gap-2 flex-1 min-h-0">
            <div class="flex flex-col w-1/4 gap-2">
                <button class="btn" style="padding:1px 8px; font-size:var(--font-size-sm); width:fit-content; height:auto;" onClick=${handleBack}>← Back</button>
                <div class="">
                    ${html`<${AssetPriceChart} assetId=${api.STOCK_INDEX_ID} chartTitle="Stock Market Index" />`}
                </div>
                <div class="flex flex-[4] min-h-0">
                    ${html`<${AdvisorySummary} />`}
                </div>
            </div>
            <div class="flex flex-col w-3/4 gap-2 h-full">
                ${industryDrilldown
                    ? industryDrilldownContent
                    : html`<${Tabs} activeTab=${activeTab} onTabChange=${setActiveTab}>
                        <${Tab} label="Heat Map" hotkey="h" id=${api.UI_MARKET_HEATMAP}>
                            <${MarketHeatMapTab} />
                        <//>
                        <${Tab} label="Industry Growth Rates" hotkey="g" id=${api.UI_MARKET_REPORTS_INDUSTRY_GROWTH_RATES_REPORT}>
                            <div class="flex justify-center items-center">
                                ${renderLines(industryGrowthRatesReport, ({ id }) => {
                                    api.viewIndustry(id)
                                }, null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                            </div>
                        <//>
                        <${Tab} label="Economic Data" hotkey="e" id=${api.UI_MARKET_REPORTS_ECON_STATS_REPORT}>
                            <div class="flex justify-center items-center">
                                ${renderLines(economicDataReport, ({ id }) => {
                                    api.viewIndustry(id)
                                }, null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                            </div>
                        <//>
                        <${Tab} label="Interest Rates" hotkey="r" id=${api.UI_MARKET_REPORTS_INTEREST_RATES_REPORT}>
                            <div class="flex justify-center items-center">
                                ${renderLines(interestRatesReport, ({ id }) => {
                                    api.viewIndustry(id)
                                }, null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                            </div>
                        <//>
                        <${Tab} label="Companies With Most..." hotkey="m">
                            <div class="flex justify-center items-center w-full h-full">
                                <${Tabs}>
                                    <${Tab} label="Market Share" id=${api.UI_MARKET_REPORTS_LARGEST_MARKET_SHARE_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(mostMarketShareReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                    <${Tab} label="Tax Losses" id=${api.UI_MARKET_REPORTS_LARGEST_TAX_LOSSES_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(mostTaxLossReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                    <${Tab} label="Market Cap" id=${api.UI_MARKET_REPORTS_MOST_MARKET_CAP_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(mostMarketCapReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                    <${Tab} label="Cash" id=${api.UI_MARKET_REPORTS_MOST_CASH_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(mostCashReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                <//>
                            </div>
                        <//>
                        <${Tab} label="Who Owns What?" hotkey="o">
                            <div class="flex flex-col w-full h-full">
                                <div class="flex justify-center items-center flex-1 min-h-0">
                                <${Tabs}>
                                    <${Tab} label="Futures" id=${api.UI_MARKET_REPORTS_COMMOD_FUTURES_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(whoOwnsFuturesReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                    <${Tab} label="Commodities" id=${api.UI_MARKET_REPORTS_COMMOD_PHYSICAL_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(whoOwnsPhysicalCommoditiesReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                    <${Tab} label="Swaps" id=${api.UI_MARKET_REPORTS_INTEREST_RATE_SWAPS_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(whoOwnsSwapsReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                    <${Tab} label="Options" id=${api.UI_MARKET_REPORTS_OPTIONS_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(whoOwnsOptionsReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                    <${Tab} label="Stocks" id=${api.UI_MARKET_REPORTS_STOCKS_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(whoOwnsStocksReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                    <${Tab} label="Management Contracts" id=${api.UI_MARKET_REPORTS_INVESTMENT_CONTRACTS_REPORT}>
                                        <div class="flex justify-center items-center">
                                            ${renderLines(whoOwnsInvestmentContractsReport, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                                        </div>
                                    <//>
                                <//>
                                </div>
                            </div>
                        <//>
                        <${Tab} label="Who's Ahead?" hotkey="w" id=${api.UI_MARKET_REPORTS_WHO_AHEAD_REPORT}>
                            <div class="flex justify-center items-center">
                                ${renderLines(whosAheadReport, ({ id }) => {
                                    api.setViewAsset(id)
                                }, null, hyperlinkRegex, undefined, 1, scopeActiveRef)}
                            </div>
                        <//>
                    <//>
                `}
            </div>
        </div>
    </div>`;
};

export default IndustryView;
