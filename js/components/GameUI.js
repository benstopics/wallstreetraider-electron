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


const GameUI = ({ gameState }) => {

    const [showNews, setShowNews] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return html`
    <div class="flex flex-col h-full">
        <!-- Toolbar -->
        <${Toolbar} gameState=${gameState} />
        <div class="game-view flex flex-column gap-2 p-2">
            <!-- Left Column -->
            <div class="flex flex-col w-1/5 gap-2">
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
                <div class="flex-[3] min-h-0">
                    ${html`<${CapitalizationChart} assetId=${api.PLAYER1_ID} chartTitle="Net Worth" />`}
                </div>

                <!-- Streaming Quotes -->
                <div class="flex-[7] min-h-0">
                ${html`<${StreamingQuotes} gameState=${gameState} />`}
                </div>
            </div>
            
            <!-- Right Column -->
            <div class="flex flex-col w-4/5 gap-2 h-full">
                <!-- Main View -->
                <div class="flex-[7] min-h-0">
                    ${html`<${View} gameState=${gameState} />`}
                </div>

                <!-- News and Alerts 
                <div class="flex-[3] min-h-0 gap-2">
                    <${NewsHeadlines} headlines=${gameState.newsHeadlines} />
                </div>-->
            </div>
        </div>
        <div class="flex flex-row items-center justify-between gap-2 px-2 mx-2" style="height: 30px; border: 1px solid #333333;background-color: black; color: #ffc380;">
            <div class="flex flex-[1] items-center gap-2 cursor-pointer" onClick=${() => setShowNews(true)}>
                ${gameState.newsHeadlines.length > 0 ? html`<div class="notification flex mx-1 flex-row items-center justify-between" style="width: 20px; height: 100%;"
                    onClick=${() => setShowNews(true)}>
                    <${NewspaperIcon} />
                </div>` : html`<div></div>`}
                <div>${gameState.newsHeadlines[0]?.headline ?? ''}</div>
            </div>
            <div class="flex flex-[1] items-center gap-2 cursor-pointer" onClick=${() => setShowNotifications(true)}>
                <div>${gameState.trendingNews[0]?.headline ?? ''}</div>
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
                    <div class="p-2" style="border: 1px solid #333333">
                        ${api.renderHyperlinks(i.headline, gameState, ({ id, type }) => {
                            if (type === 'C')  api.setViewAsset(id);
                            else if (type === 'I') api.viewIndustry(id);
                            setShowNotifications(false);
                        })}
                    </div>
                `)}
            </div>
        <//>
        <${Modal} show=${showNews} onClose=${() => setShowNews(false)}>
            <div class="flex justify-between items-center mb-4">
                <div class="text-lg font-bold h-full">News</div>
                <button class="btn red" onClick=${() => setShowNews(false)}>Close</button>
            </div>
            <div class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                ${gameState.newsHeadlines.map(i => html`
                    <div style="border-bottom: 1px solid #333333">
                        ${api.renderHyperlinks(i.headline, gameState, ({ id, type }) => {
                            if (type === 'C')  api.setViewAsset(id);
                            else if (type === 'I') api.viewIndustry(id);
                            setShowNews(false);
                        })}
                    </div>
                `)}
            </div>
        <//>
    </div>
    `;
};

export default GameUI;