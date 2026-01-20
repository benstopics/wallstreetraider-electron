import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { formatCurrency } from './helpers.js';
import * as api from '../api.js';
import { StarIcon, TrashIcon } from '../icons.js';


const StreamingQuotes = () => {

    const quotes = api.useGameStore(s => s.gameState.streamingQuotesList) || [];
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeEntityName = api.useGameStore(s => s.gameState.activeEntityName);

    return html`
        <div class="panel">
            <div class="panel-header">Streaming Quotes</div>
            <div class="p-1 panel-body">
                ${activeEntityNum > 10 && !quotes.find(q => q.id === activeEntityNum) ? html`
                <div 
                    class="flex items-center py-1 mb-2 candidate"
                    onClick=${(e) => {
                            e.stopPropagation();
                            api.toggleStreamingQuote(activeEntityNum);
                        }}
                >
                    <span class="mx-2">
                        <button class="btn yellow" style="width: 30px"><${StarIcon} /></button>
                    </span>
                    <span class="align-left">Add ${activeEntityName}</span>
                </div>` : ''}
            ${[...quotes].sort((a, b) => a.symbol.localeCompare(b.symbol)).map(quote => html`
                <div 
                    class="quote-line py-1 ${quote.id === activeEntityNum ? 'selected' : ''}"
                    onClick=${() => api.setViewAsset(quote.id)}
                >
                    <span class="quote-symbol text-gray-400">${quote.symbol}</span>
                    <span class="quote-name">${quote.name}</span>
                    <span class=${`fixed-width quote-price ${quote.priceChange > 0 ? 'positive' : quote.priceChange < 0 ? 'negative' : 'neutral'}`}>
                        $${formatCurrency(quote.price)}
                    </span>
                    <span class="ml-2">
                        <button class="btn red w-full" style="width: 30px" onClick=${(e) => {
                            e.stopPropagation();
                            api.toggleStreamingQuote(quote.id);
                        }}><${TrashIcon} /></button>
                    </span>
                </div>
            `)}
            </div>
        </div>
    `;
};

export default StreamingQuotes;