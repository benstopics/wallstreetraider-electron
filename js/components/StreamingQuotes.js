import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { formatCurrency } from './helpers.js';
import * as api from '../api.js';

const StreamingQuotes = ({ quotes }) => {
    return html`
        <div class="panel">
            <div class="panel-header">Streaming Quotes</div>
            <div class="p-1 panel-body">
            ${quotes.map(quote => html`
                <div 
                    class="quote-line"
                    onClick=${() => api.setViewAsset(quote.id)}
                >
                    <span class="quote-symbol text-gray-400">${quote.symbol}</span>
                    <span class="quote-name">${quote.name}</span>
                    <span class=${`fixed-width quote-price ${quote.priceChange > 0 ? 'positive' : quote.priceChange < 0 ? 'negative' : 'neutral'}`}>
                        $${formatCurrency(quote.price)}
                    </span>
                </div>
            `)}
            </div>
        </div>
    `;
};

export default StreamingQuotes;