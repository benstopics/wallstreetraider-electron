import { html, render, useState, useEffect, useMemo } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import BalanceSheet from './BalanceSheet.js';
import CapitalizationChart from './CapitalizationChart.js';
import StreamingQuotes from './StreamingQuotes.js';
import View from './View.js';
import Toolbar from './Toolbar.js';
import { NewspaperIcon, NotificationIcon } from '../icons.js';
import Modal from './Modal.js';
import AssetPriceChart from './AssetPriceChart.js';
import CommandPrompt from './CommandPrompt.js';
import Button from './Button.js';
import StockTicker from './StockTicker.js';
import { insertCurrencySymbols } from './helpers.js';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const GameUI = () => {

    const [showNotifications, setShowNotifications] = useState(false);
    const [showMyNews, setShowMyNews] = useState(false);

    const newsHeadlines = api.useGameStore(s => s.gameState.newsHeadlines);
    const currentYear = api.useGameStore(s => s.gameState.currentYear);
    const currentMonth = api.useGameStore(s => s.gameState.currentMonth);
    const currentDay = api.useGameStore(s => s.gameState.currentDay);
    const currentTime = api.useGameStore(s => s.gameState.currentTime);
    const currentQuarter = api.useGameStore(s => s.gameState.currentQuarter);
    const cash = api.useGameStore(s => s.gameState.cash);
    const otherAssets = api.useGameStore(s => s.gameState.otherAssets);
    const totalAssets = api.useGameStore(s => s.gameState.totalAssets);
    const totalDebt = api.useGameStore(s => s.gameState.totalDebt);
    const netWorth = api.useGameStore(s => s.gameState.netWorth);
    const trendingNews = api.useGameStore(s => s.gameState.trendingNews);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);

    const streamingQuotes = api.useGameStore(s => s.gameState.streamingQuotesList) || [];
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];

    const isDbSearch = activeIndustryNum === -2;

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

    const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
    useEffect(() => {
        const id = setInterval(() => {
            setLocalTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(id);
    }, []);

    // Market hours are open 9:30am to 4:00pm. I want to divide that by currentTime (which is 0-16 or 17) and map that to the time of day.
    const marketOpen = 9.5; // 9:30am
    const marketClose = 16; // 4:00pm
    const totalMarketHours = marketClose - marketOpen;
    const timeFrac = totalMarketHours / 17;
    const timeOfDayHoursFloat = marketOpen + (currentTime * timeFrac);
    const timeOfDayHours = Math.floor(timeOfDayHoursFloat) % 12 || 12; // Convert to 12-hour format
    const timeOfDayMinutes = Math.floor((timeOfDayHoursFloat - Math.floor(timeOfDayHoursFloat)) * 60);
    const formattedTimeOfDay = `${timeOfDayHours}:${timeOfDayMinutes.toString().padStart(2, '0')} ${timeOfDayHours >= 12 ? 'PM' : 'AM'}`;
    const timeOfDayPct = currentTime / 17;

    const gameDate = `${months[currentMonth - 1]} ${currentDay}, ${currentYear} (Q${currentQuarter})`;

    return html`
    <div class="flex flex-col h-full" data-testid="game-ui">
        <!-- Toolbar -->
        <${Toolbar} />
        <${StockTicker} />
        <div class="game-view flex flex-row gap-2 p-2">
            ${!isDbSearch ? html`
            <!-- Left Column -->
            <div class="flex flex-col gap-2" style="flex: 1 1 0%; min-width: 0;">
                <!-- Date and Time -->
                <div class="flex flex-col fixed-width date-display justify-center items-center w-full" style="height: 35px;">
                    ${gameDate}
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                        <div class="bg-blue-600 h-2.5 rounded-full" style=${`width: ${timeOfDayPct * 100}%;`}></div>
                    </div>
                </div>

                <!-- Balance Sheet -->
                <div>
                    ${html`<${BalanceSheet}
                        cash=${cash}
                        otherAssets=${otherAssets}
                        totalAssets=${totalAssets}
                        totalDebt=${totalDebt}
                        netWorth=${netWorth}
                    />`}
                </div>

                <!-- Asset Price Chart -->
                <div class="flex-[2.75] min-h-0">
                    ${html`<${CapitalizationChart} assetId=${api.HUMAN1_ID} chartTitle="Net Worth" />`}
                </div>

                <div class="flex flex-row flex-[2] min-h-0 gap-2">
                    <div class="flex-1">
                        <${AssetPriceChart} assetId=${api.GNP_RATE_ID} chartTitle="GDP" />
                    </div>
                    <div class="flex-1">
                        <${AssetPriceChart} assetId=${api.PRIME_RATE_ID} chartTitle="Prime Rate" />
                    </div>
                </div>

                <!-- Streaming Quotes -->
                <div class="flex-[7] min-h-0">
                    <${StreamingQuotes} />
                </div>
            </div>

            <div class="flex flex-col gap-2 min-h-0" style="flex: 2 1 0%; min-width: 0;">
                <div class="flex items-center" style="height: 35px;">
                    <${CommandPrompt} />
                </div>
                <div class="panel flex-[4] flex min-h-0 flex-col">
                    <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Financial News Headlines</span>
                        <${Button} class="btn text-xs px-2 py-0 ${showMyNews ? 'yellow' : ''}" data-testid="btn-my-news" onClick=${() => setShowMyNews(!showMyNews)} title="Filter to show only news about your stocks and companies">My News</button>
                    </div>
                    <div class="p-1 panel-body">
                        <div class="flex flex-col h-full overflow-y-auto">
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
                </div>
            </div>
            ` : ''}

            <!-- Right Column -->
            <div class="flex flex-col gap-2 h-full" style=${`flex: ${isDbSearch ? '1 1 100%' : '4 1 0%'}; min-width: 0;`}>
                ${html`<${View} />`}
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