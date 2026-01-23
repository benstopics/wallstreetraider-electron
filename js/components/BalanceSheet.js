import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { formatCurrency, insertCurrencySymbols } from './helpers.js';

const BalanceSheet = ({ cash, otherAssets, totalAssets, totalDebt, netWorth }) => {
    return html`
    <div class="panel">
        <div class="panel-header">${insertCurrencySymbols("My Balance Sheet ($ Millions)")}</div>

        <div class="p-1 panel-body">
            <div class="flex justify-between">
                <div class="text-gray-400">${insertCurrencySymbols("Cash [DD]")}</div>
                <div class="fixed-width">$${formatCurrency(cash)}</div>
            </div>

            <div class="flex justify-between">
                <div class="text-gray-400">${insertCurrencySymbols("Other Assets")}</div>
                <div class="fixed-width">$${formatCurrency(otherAssets)}</div>
            </div>

            <div class="flex justify-between">
                <div class="text-gray-400">${insertCurrencySymbols("Total Assets")}</div>
                <div class="fixed-width">$${formatCurrency(totalAssets)}</div>
            </div>

            <div class="flex justify-between">
                <div class="negative">${insertCurrencySymbols("Total Debt")}</div>
                <div class="negative fixed-width">$${formatCurrency(totalDebt)}</div>
            </div>

            <div class="flex justify-between">
                <div class="text-gray-400">${insertCurrencySymbols("Net Worth")}</div>
                <div class="fixed-width positive">$${formatCurrency(netWorth)}</div>
            </div>
        </div>
    </div>
  `;
}

export default BalanceSheet;