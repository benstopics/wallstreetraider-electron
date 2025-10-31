import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
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

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const GameUI = () => {

    const [showNotifications, setShowNotifications] = useState(false);

    const newsHeadlines = api.useGameStore(s => s.gameState.newsHeadlines);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies);
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);
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

    const gameDate = `${months[currentMonth - 1]} ${currentDay}, ${currentYear} (Q${currentQuarter}) ${formattedTimeOfDay}`;

    return html`
    <div class="flex flex-col h-full">
        <!-- Toolbar -->
        <${Toolbar} />
        <div class="game-view flex flex-column gap-2 p-2">
            <!-- Left Column -->
            <div class="flex flex-col w-1/6 gap-2">
                <!-- Date and Time -->
                <div class="flex fixed-width date-display justify-center items-center w-full" style="height: 35px;">
                    ${gameDate}
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

            <div class="flex flex-col w-2/6 gap-2 min-h-0">
                <div class="flex items-center" style="height: 35px;">
                    <${CommandPrompt} />
                </div>
                <div class="panel flex-[4] flex min-h-0 flex-col">
                    <div class="panel-header">Financial News Headlines</div>
                    <div class="p-1 panel-body">
                        <div class="flex flex-col h-full gap-2 overflow-y-auto">
                            ${newsHeadlines.map(i => html`
                                <div class="news-headline">
                                    ${api.renderHyperlinks(i.headline, allCompanies, allIndustries, ({ id, type }) => {
                                        if (type === 'C')  api.setViewAsset(id);
                                        else if (type === 'I') api.viewIndustry(id);
                                    })}
                                </div>
                            `)}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Column -->
            <div class="flex flex-col w-4/6 gap-2 h-full">
                ${html`<${View} />`}
            </div>
        </div>
        <div class="flex flex-row border items-center justify-between gap-2 px-2 mx-2" style="height: 30px;">
            <div></div>
            <div class="flex flex-[1] items-center gap-2 cursor-pointer justify-between" onClick=${() => setShowNotifications(true)}>
                <div></div>
                ${trendingNews.length > 0 ? html`<div class="notification flex mx-1 flex-row items-center justify-between" style="width: 20px; height: 100%;"
                    onClick=${() => setShowNotifications(true)}>
                    <${NotificationIcon} />
                    <!--<div class="badge">${trendingNews.length}</div>-->
                </div>` : html`<div></div>`}
            </div>
        </div>
        <${Modal} show=${showNotifications} onClose=${() => setShowNotifications(false)}>
            <div class="flex justify-between items-center mb-4">
                <div class="text-lg font-bold h-full">Notifications</div>
                <button class="btn red" onClick=${() => setShowNotifications(false)}>Close</button>
            </div>
            <div class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                ${trendingNews.map(i => html`
                    <div class="p-2 border">
                        ${api.renderHyperlinks(i.headline, allCompanies, allIndustries, ({ id, type }) => {
                            if (type === 'C')  api.setViewAsset(id);
                            else if (type === 'I') api.viewIndustry(id);
                            setShowNotifications(false);
                        })}
                    </div>
                `)}
            </div>
        <//>
    </div>
    `;
};

export default GameUI;