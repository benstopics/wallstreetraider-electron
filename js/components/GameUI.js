import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import BalanceSheet from './BalanceSheet.js';
import CapitalizationChart from './CapitalizationChart.js';
import StreamingQuotes from './StreamingQuotes.js';
import NewsHeadlines from './NewsHeadlines.js';
import View from './View.js';
import Toolbar from './Toolbar.js';
import { NotificationIcon } from '../icons.js';
import Modal from './Modal.js';


const GameUI = ({ gameState }) => {

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
            <div></div>
            <div class="notification flex mx-1 flex-row items-center justify-between" style="width: 20px; height: 100%;"
                onClick=${() => setShowNotifications(true)}>
                <${NotificationIcon} />
                <div class="badge">30</div>
            </div>
        </div>
        <${Modal} show=${showNotifications} onClose=${() => setShowNotifications(false)}>
            <div class="text-lg font-bold mb-4">Notifications</div>
            <div class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                ${[...Array(20).keys()].map(i => html`
                    <div class="p-2 border border-gray-300 rounded bg-gray-100">
                        Notification ${i + 1}: This is a sample notification message.
                    </div>
                `)}
            </div>
        <//>
    </div>
    `;
};

export default GameUI;