import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import BalanceSheet from './BalanceSheet.js';
import CapitalizationChart from './CapitalizationChart.js';
import StreamingQuotes from './StreamingQuotes.js';
import NewsHeadlines from './NewsHeadlines.js';
import View from './View.js';
import Toolbar from './Toolbar.js';
import { NewspaperIcon, NotificationIcon } from '../icons.js';
import Modal from './Modal.js';
import AssetPriceChart from './AssetPriceChart.js';
import CommandPrompt from './CommandPrompt.js';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const GameUI = ({ gameState }) => {

    const [showNotifications, setShowNotifications] = useState(false);

    const newsHeadlines = gameState.newsHeadlines;

    const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
    useEffect(() => {
        const id = setInterval(() => {
            setLocalTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const gameDate = `${months[gameState.currentMonth - 1]} ${gameState.currentDay}, ${gameState.currentYear} (Q${gameState.currentQuarter})`;

    return html`
    <div class="flex flex-col h-full">
        <!-- Toolbar -->
        <${Toolbar} gameState=${gameState} />
        <div class="game-view flex flex-column gap-2 p-2">
            <!-- Left Column -->
            <div class="flex flex-col w-1/6 gap-2">
                <!-- Date and Time -->
                <div class="flex fixed-width date-display justify-center items-center w-full" style="height: 35px;">
                    ${gameDate} ${localTime}
                </div>
                
                <!-- Balance Sheet -->
                <div>
                    ${html`<${BalanceSheet} 
                        cash=${gameState.cash} 
                        otherAssets=${gameState.otherAssets} 
                        totalAssets=${gameState.totalAssets} 
                        totalDebt=${gameState.totalDebt} 
                        netWorth=${gameState.netWorth} 
                    />`}
                </div>

                <!-- Asset Price Chart -->
                <div class="flex-[2.75] min-h-0">
                    ${html`<${CapitalizationChart} assetId=${api.PLAYER1_ID} chartTitle="Net Worth" />`}
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
                ${html`<${StreamingQuotes} gameState=${gameState} />`}
                </div>
            </div>

            <div class="flex flex-col w-2/6 gap-2 min-h-0">
                <div class="flex items-center" style="height: 35px;">
                    <${CommandPrompt} gameState=${gameState} />
                </div>
                <div class="panel flex-[4] flex min-h-0 flex-col">
                    <div class="panel-header">Financial News Headlines</div>
                    <div class="p-1 panel-body">
                        <div class="flex flex-col h-full gap-2 overflow-y-auto">
                            ${newsHeadlines.map(i => html`
                                <div class="news-headline">
                                    ${api.renderHyperlinks(i.headline, gameState, ({ id, type }) => {
                                        if (type === 'C')  api.setViewAsset(id);
                                        else if (type === 'I') api.viewIndustry(id);
                                        setShowNews(false);
                                    })}
                                </div>
                            `)}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Column -->
            <div class="flex flex-col w-4/6 gap-2 h-full">
                ${html`<${View} gameState=${gameState} />`}
            </div>
        </div>
        <div class="flex flex-row border items-center justify-between gap-2 px-2 mx-2" style="height: 30px;">
            <div></div>
            <div class="flex flex-[1] items-center gap-2 cursor-pointer justify-between" onClick=${() => setShowNotifications(true)}>
                <div class="overflow-hidden whitespace-nowrap text-ellipsis" style="max-width: 45vw;">${gameState.trendingNews[0]?.headline ?? ''}</div>
                ${gameState.trendingNews.length > 0 ? html`<div class="notification flex mx-1 flex-row items-center justify-between" style="width: 20px; height: 100%;"
                    onClick=${() => setShowNotifications(true)}>
                    <${NotificationIcon} />
                    <!--<div class="badge">${gameState.trendingNews.length}</div>-->
                </div>` : html`<div></div>`}
            </div>
        </div>
        <${Modal} show=${showNotifications} onClose=${() => setShowNotifications(false)}>
            <div class="flex justify-between items-center mb-4">
                <div class="text-lg font-bold h-full">Notifications</div>
                <button class="btn red" onClick=${() => setShowNotifications(false)}>Close</button>
            </div>
            <div class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                ${gameState.trendingNews.map(i => html`
                    <div class="p-2 border">
                        ${api.renderHyperlinks(i.headline, gameState, ({ id, type }) => {
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