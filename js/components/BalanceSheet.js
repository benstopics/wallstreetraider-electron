import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { formatCurrency, insertCurrencySymbols } from './helpers.js';
import { gameStore } from '../api.js';

const BalanceSheet = ({ cash, otherAssets, totalAssets, totalDebt, netWorth }) => {
    const gameState = gameStore.getState()?.gameState || {};
    const dlrSign = gameState.dlrSign || '$';
    const euro = gameState.euro || '';

    return html`
    <div class="panel" data-tutorial="balance-sheet">
        <div class="panel-header">${insertCurrencySymbols("My Balance Sheet (@DLRSIGN Millions@EURO)")}</div>

        <div class="p-1 panel-body font-text-sm">
            <div class="flex justify-between">
                <div class="text-gray-400">${insertCurrencySymbols("Cash [DD]")}</div>
                <div class="fixed-width whitespace-nowrap">${dlrSign}${formatCurrency(cash)}${euro}</div>
            </div>

            <div class="flex justify-between">
                <div class="text-gray-400">${insertCurrencySymbols("Other Assets")}</div>
                <div class="fixed-width whitespace-nowrap">${dlrSign}${formatCurrency(otherAssets)}${euro}</div>
            </div>

            <div class="flex justify-between">
                <div class="text-gray-400">${insertCurrencySymbols("Total Assets")}</div>
                <div class="fixed-width whitespace-nowrap">${dlrSign}${formatCurrency(totalAssets)}${euro}</div>
            </div>

            <div class="flex justify-between">
                <div class="negative">${insertCurrencySymbols("Total Debt")}</div>
                <div class="negative fixed-width whitespace-nowrap">${dlrSign}${formatCurrency(totalDebt)}${euro}</div>
            </div>

            <div class="flex justify-between">
                <div class="text-gray-400">${insertCurrencySymbols("Net Worth")}</div>
                <div class="fixed-width positive whitespace-nowrap">${dlrSign}${formatCurrency(netWorth)}${euro}</div>
            </div>
        </div>
    </div>
  `;
}

export default BalanceSheet;