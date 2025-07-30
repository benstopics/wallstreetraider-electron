import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { formatCurrency } from './helpers.js';

const BalanceSheet = ({ cash, otherAssets, totalAssets, totalDebt, netWorth }) => {
    return html`
    <div class="panel">
        <div class="panel-header">My Balance Sheet ($ Millions)</div>

        <div class="p-1 panel-body">
            <div class="flex justify-between">
                <div class="text-gray-400">Cash [DD]</div>
                <div class="fixed-width">$${formatCurrency(cash)}</div>
            </div>

            <div class="flex justify-between">
                <div class="text-gray-400">Other Assets</div>
                <div class="fixed-width">$${formatCurrency(otherAssets)}</div>
            </div>

            <div class="flex justify-between">
                <div class="text-gray-400">Total Assets</div>
                <div class="fixed-width">$${formatCurrency(totalAssets)}</div>
            </div>

            <div class="flex justify-between">
                <div class="negative">Total Debt</div>
                <div class="negative fixed-width">$${formatCurrency(totalDebt)}</div>
            </div>

            <div class="flex justify-between">
                <div class="text-gray-400">Net Worth</div>
                <div class="fixed-width positive">$${formatCurrency(netWorth)}</div>
            </div>
        </div>
    </div>
  `;
}

export default BalanceSheet;