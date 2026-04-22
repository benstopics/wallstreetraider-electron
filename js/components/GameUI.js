import { html, render, useState, useMemo } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import BalanceSheet from './BalanceSheet.js';
import CapitalizationChart from './CapitalizationChart.js';
import StreamingQuotes from './StreamingQuotes.js';
import View from './View.js';
import Toolbar from './Toolbar.js';
import { NewspaperIcon, NotificationIcon } from '../icons.js';
import Modal from './Modal.js';
import MarketSparklineGrid from './MarketSparklineGrid.js';
import Button from './Button.js';
import StockTicker from './StockTicker.js';
import Tabs from './Tabs.js';
import { insertCurrencySymbols } from './helpers.js';

const Tab = Tabs.Tab;

const GameUI = () => {

    const [showNotifications, setShowNotifications] = useState(false);
    const [showMyNews, setShowMyNews] = useState(false);

    const newsHeadlines = api.useGameStore(s => s.gameState.newsHeadlines);
    const cash = api.useGameStore(s => s.gameState.cash);
    const otherAssets = api.useGameStore(s => s.gameState.otherAssets);
    const totalAssets = api.useGameStore(s => s.gameState.totalAssets);
    const totalDebt = api.useGameStore(s => s.gameState.totalDebt);
    const netWorth = api.useGameStore(s => s.gameState.netWorth);
    const trendingNews = api.useGameStore(s => s.gameState.trendingNews);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);
    const holdingsTabActive = api.useGameStore(s => s.uiHoldingsTabActive ?? false);

    const streamingQuotes = api.useGameStore(s => s.gameState.streamingQuotesList) || [];
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];

    const isFullscreen = activeIndustryNum === -2 || activeIndustryNum >= 0;

    // Build set of "my" entity names for MyNews filtering
    const myEntityNames = useMemo(() => {
        const names = new Set();
        for (const q of streamingQuotes) {
            if (q.name) names.add(q.name);
            if (q.symbol) names.add(q.symbol);
        }
        return names;
    }, [streamingQuotes]);

    const filteredHeadlines = useMemo(() => {
        if (!showMyNews || myEntityNames.size === 0) return newsHeadlines;
        return newsHeadlines.filter(h => {
            for (const name of myEntityNames) {
                if (h.includes(name)) return true;
            }
            return false;
        });
    }, [newsHeadlines, showMyNews, myEntityNames]);

    return html`
    <div class="flex flex-col h-full" data-testid="game-ui">
        <!-- Toolbar -->
        <${Toolbar} />
        <${StockTicker} />
        <div class="game-view flex flex-row gap-2 p-2">
            <!-- News + View wrapper: Quick Look/News sidebar sits on the LEFT, View on the RIGHT -->
            <div class="flex flex-row gap-2 min-h-0" style="flex: 1 1 100%; min-width: 0;">
                ${!isFullscreen ? html`
                <div class="game-col-news flex flex-col gap-2 min-h-0" style=${`flex: ${holdingsTabActive ? '0 0 0px' : '2 1 0%'}; overflow: hidden; min-width: 0;`}>
                    <${Tabs}>
                        <${Tab} label="Quick Look">
                            <div class="flex flex-col h-full min-h-0 gap-2">
                                <div class="flex flex-row gap-2" style="min-height: 110px;">
                                    <div class="flex-1 min-w-0">
                                        <${CapitalizationChart} assetId=${api.HUMAN1_ID} chartTitle="Net Worth" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        ${html`<${BalanceSheet}
                                            cash=${cash}
                                            otherAssets=${otherAssets}
                                            totalAssets=${totalAssets}
                                            totalDebt=${totalDebt}
                                            netWorth=${netWorth}
                                        />`}
                                    </div>
                                </div>
                                <div class="min-h-0 overflow-y-auto">
                                    <${MarketSparklineGrid} />
                                </div>
                                <div class="flex-[7] min-h-0">
                                    <${StreamingQuotes} />
                                </div>
                            </div>
                        </${Tab}>
                        <${Tab} label="News">
                            <div class="flex flex-col h-full min-h-0">
                                <div class="flex flex-row justify-end mb-1">
                                    <${Button} class="btn text-xs px-2 py-0 ${showMyNews ? 'yellow' : ''}" data-testid="btn-my-news" onClick=${() => setShowMyNews(!showMyNews)} title="Filter to show only news about your stocks and companies">My News</button>
                                </div>
                                <div class="flex flex-col flex-1 overflow-y-auto min-h-0">
                                    ${filteredHeadlines.map(h => html`
                                        <div class="news-headline">
                                            ${api.renderHyperlinks(h, ({ id, type }) => {
                                                if (type === 'C')  api.setViewAsset(id);
                                                else if (type === 'I') api.viewIndustry(id);
                                            }, hyperlinkRegex)}
                                        </div>
                                    `)}
                                </div>
                            </div>
                        </${Tab}>
                    </${Tabs}>
                </div>
                ` : ''}

                <div class="game-col-view flex flex-col gap-2 h-full" style="flex: 5 1 0%; min-width: 0;">
                    ${html`<${View} />`}
                </div>
            </div>
        </div>
        <div class="panel-footer flex flex-row border items-center justify-between gap-2 mx-2" style="min-height: 25px; flex-shrink: 0;">
            <div></div>
            <div class="flex flex-[1] items-center gap-2 cursor-pointer justify-between" onClick=${() => setShowNotifications(true)}>
                <div>${(trendingNews.length > 0 ? insertCurrencySymbols(trendingNews[0]) : "")}</div>
                ${trendingNews.length > 0 ? html`<div class="notification flex mx-1 flex-row items-center justify-between" style="height: 100%;"
                    onClick=${() => setShowNotifications(true)}>
                    <div class="flex flex-row">
                        <div class="mr-1" style="width: 15px"><${NotificationIcon} /></div>
                        ${insertCurrencySymbols("Notifications")}
                    </div>
                    <!--<div class="badge">${trendingNews.length}</div>-->
                </div>` : html`<div></div>`}
            </div>
        </div>
        <${Modal} show=${showNotifications} onClose=${() => setShowNotifications(false)}>
            <div class="flex justify-between items-center mb-4">
                <div class="text-lg font-bold">Notifications</div>
                <${Button} class="btn red" onClick=${() => setShowNotifications(false)}>Close</button>
            </div>
            <div class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                ${trendingNews.map(h => html`
                    <div class="p-2 border">
                        ${api.renderHyperlinks(h, ({ id, type }) => {
                            if (type === 'C')  api.setViewAsset(id);
                            else if (type === 'I') api.viewIndustry(id);
                            setShowNotifications(false);
                        }, hyperlinkRegex)}
                    </div>
                `)}
            </div>
        <//>
    </div>
    `;
};

export default GameUI;