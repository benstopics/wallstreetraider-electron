import { html, render, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { formatCurrency } from './helpers.js';
import * as api from '../api.js';
import { StarIcon, TrashIcon } from '../icons.js';
import Button from './Button.js';


const StreamingQuotes = () => {

    const quotes = api.useGameStore(s => s.gameState.streamingQuotesList) || [];
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeEntityName = api.useGameStore(s => s.gameState.activeEntityName);
    const dlrSign = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro = api.useGameStore(s => s.gameState.euro) || '';

    // Debounce toggle to prevent double-click and event queue issues (BUG-117)
    const pendingRef = useRef(false);
    const toggleQuote = (id) => {
        if (pendingRef.current) return;
        pendingRef.current = true;
        api.toggleStreamingQuote(id);
        setTimeout(() => { pendingRef.current = false; }, 500);
    };

    // Persist direction (up/down) per quote so the UI stays green until price drops,
    // and stays red until price rises. This avoids "flicker" when backend only
    // sends one-tick deltas.
    const lastPriceRef = useRef(new Map()); // id -> last price
    const lastDirRef = useRef(new Map());   // id -> -1|0|1

    const getDirClass = (q) => {
        const id = q.id;
        const lastPrice = lastPriceRef.current.get(id);
        const lastDir = lastDirRef.current.get(id) ?? 0;
        const price = Number(q.price);

        let dir = lastDir;
        if (Number.isFinite(price)) {
            if (Number.isFinite(lastPrice)) {
                if (price > lastPrice) dir = 1;
                else if (price < lastPrice) dir = -1;
                // else keep prior dir
            } else if (Number.isFinite(q.priceChange)) {
                // First observation: fallback to provided priceChange if available.
                if (q.priceChange > 0) dir = 1;
                else if (q.priceChange < 0) dir = -1;
            }
            lastPriceRef.current.set(id, price);
            lastDirRef.current.set(id, dir);
        }

        return dir > 0 ? 'positive' : dir < 0 ? 'negative' : 'neutral';
    };

    return html`
        <div class="panel">
            <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span>Streaming Quotes</span>
                <span style="display: flex; gap: 4px;">
                    <${Button} class="btn text-xs px-2 py-0" data-testid="btn-fill-stream" onClick=${() => api.fillStreamList()} title="Auto-fill with owned stocks, controlled companies, and positions">Fill</button>
                    <${Button} class="btn text-xs px-2 py-0" data-testid="btn-clear-stream" onClick=${() => api.clearStreamList()} title="Clear all streaming quotes">Clear</button>
                    <${Button} class="btn text-xs px-2 py-0" onClick=${() => window.__showPriceAlerts?.()} title="Price Alerts">Alerts</button>
                </span>
            </div>
            <div class="p-1 panel-body">
                ${activeEntityNum > 10 && !quotes.find(q => q.id === activeEntityNum) ? html`
                <div 
                    class="flex items-center py-1 mb-2 candidate"
                    onClick=${(e) => {
                            e.stopPropagation();
                            toggleQuote(activeEntityNum);
                        }}
                >
                    <span class="mx-2">
                        <${Button} class="btn yellow" style="width: 30px"><${StarIcon} /></button>
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
                    <span class=${`fixed-width quote-price ${getDirClass(quote)}`}>
                        ${dlrSign}${formatCurrency(quote.price)}${euro}
                    </span>
                    <span class="ml-2">
                        <${Button} class="btn red w-full" style="width: 30px" onClick=${(e) => {
                            e.stopPropagation();
                            toggleQuote(quote.id);
                        }}><${TrashIcon} /></button>
                    </span>
                </div>
            `)}
            </div>
        </div>
    `;
};

export default StreamingQuotes;