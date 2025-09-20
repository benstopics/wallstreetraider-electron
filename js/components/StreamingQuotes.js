import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { formatCurrency } from './helpers.js';
import * as api from '../api.js';


const parseStockPrice = (gameState) => {
    const stockPriceLine = gameState.researchReport.find(line => line.includes('STOCK PRICE:'));
    if (stockPriceLine) {
        const price = parseFloat(stockPriceLine.split('STOCK PRICE:')[1]);
        return isNaN(price) ? 0 : price;
    }

    return 0;
}

const StreamingQuotes = ({ gameState }) => {

    const { streamingQuotesList: quotes, activeEntityNum, activeEntityName, activeEntitySymbol } = gameState;

    return html`
        <div class="panel">
            <div class="panel-header">Streaming Quotes</div>
            <div class="p-1 panel-body">
                ${activeEntityNum > 10 && !quotes.find(q => q.id === activeEntityNum) ? html`<div 
                    class="quote-line py-1 mb-2"
                    style="border-bottom: 1px dashed gray; background-color: #333;"
                >
                    <span class="quote-symbol text-gray-400">${activeEntitySymbol}</span>
                    <span class="quote-name">${activeEntityName}</span>
                    <span class=${`fixed-width quote-price neutral`}>
                        $${formatCurrency(parseStockPrice(gameState))}
                    </span>
                    <span class="mx-2">
                        <button class="btn blue" onClick=${(e) => {
                            e.stopPropagation();
                            api.toggleStreamingQuote(activeEntityNum);
                        }}>+</button>
                    </span>
                </div>` : ''}
            ${[...quotes].sort((a, b) => a.symbol.localeCompare(b.symbol)).map(quote => html`
                <div 
                    class="quote-line py-1"
                    onClick=${() => api.setViewAsset(quote.id)}
                    style=${quote.id === activeEntityNum ? 'background-color: #333;' : ''}
                >
                    <span class="quote-symbol text-gray-400">${quote.symbol}</span>
                    <span class="quote-name">${quote.name}</span>
                    <span class=${`fixed-width quote-price ${quote.priceChange > 0 ? 'positive' : quote.priceChange < 0 ? 'negative' : 'neutral'}`}>
                        $${formatCurrency(quote.price)}
                    </span>
                    <span class="px-2">
                        <button class="btn red w-full" onClick=${(e) => {
                            e.stopPropagation();
                            api.toggleStreamingQuote(quote.id);
                        }}>-</button>
                    </span>
                </div>
            `)}
            </div>
        </div>
    `;
};

export default StreamingQuotes;