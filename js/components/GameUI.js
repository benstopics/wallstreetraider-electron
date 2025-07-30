import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import BalanceSheet from './BalanceSheet.js';
import CapitalizationChart from './CapitalizationChart.js';
import StreamingQuotes from './StreamingQuotes.js';
import NewsHeadlines from './NewsHeadlines.js';
import View from './View.js';
import Toolbar from './Toolbar.js';


const GameUI = ({ gameState }) => {
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
                ${html`<${StreamingQuotes} quotes=${gameState.streamingQuotesList} />`}
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
    </div>
  `;
};

export default GameUI;