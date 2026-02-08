import { html, useRef, useEffect, useState } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import { formatCurrency } from './helpers.js';
import { PlayIcon, StopIcon, GaugeIcon, ForwardIcon } from '../icons.js';
import InputStringModal from './InputStringModal.js';

const CARD_WIDTH = 180; // px, matches CSS .stock-ticker-item width
const SCROLL_INTERVAL = 20; // ms between scroll steps

// --- Inline SVG spark chart ---

// Cache for self-fetched spark data (keyed by company id)
const sparkCache = new Map();

function MiniSpark({ prices, assetId, isUp }) {
    const [fetched, setFetched] = useState(null);

    // Self-fetch when prices aren't provided by backend
    useEffect(() => {
        if (prices && prices.length >= 2) return;
        if (!assetId) return;
        if (sparkCache.has(assetId)) {
            setFetched(sparkCache.get(assetId));
            return;
        }
        let active = true;
        api.getAssetChart(assetId).then(data => {
            if (!active) return;
            const p = data && data.prices;
            if (p && p.length >= 2) {
                sparkCache.set(assetId, p);
                setFetched(p);
            }
        }).catch(() => {});
        return () => { active = false; };
    }, [assetId, prices]);

    const data = (prices && prices.length >= 2) ? prices : fetched;
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 40, h = 16;
    const points = data.map((p, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((p - min) / range) * h;
        return `${x},${y}`;
    }).join(' ');
    const color = isUp ? 'var(--color-positive)' : 'var(--color-negative)';
    return html`<svg class="stock-ticker-spark" width=${w} height=${h} viewBox="0 0 ${w} ${h}">
        <polyline points=${points} fill="none" stroke=${color} stroke-width="1.5" />
    </svg>`;
}

// --- Ticker item ---

function TickerItem({ item }) {
    const pct = item.pctChange || 0;
    const arrow = pct > 0 ? '\u25B2' : pct < 0 ? '\u25BC' : '';
    const changeClass = pct > 0 ? 'positive' : pct < 0 ? 'negative' : 'neutral';
    const itemClass = 'stock-ticker-item' + (item.isOwned ? ' owned' : '');

    return html`
        <div class=${itemClass} onClick=${() => api.setViewAsset(item.id)}>
            <span class="stock-ticker-symbol">${item.symbol}</span>
            <span class="stock-ticker-price">${formatCurrency(item.price)}</span>
            <span class=${'stock-ticker-change ' + changeClass}>
                ${arrow}${Math.abs(pct).toFixed(1)}%
            </span>
            <${MiniSpark} prices=${item.sparkPrices} assetId=${item.id} isUp=${pct >= 0} />
        </div>
    `;
}

// --- Main ticker ---

export default function StockTicker() {
    const backendQueue = api.useGameStore(s => s.gameState.tickerQueue);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];
    const tickSpeed = api.useGameStore(s => s.gameState.tickSpeed) || 50;
    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);
    const modalType = api.useGameStore(s => s.gameState.modalType) || 0;

    const hasBackend = !!(backendQueue && backendQueue.length > 0);

    // Stable fallback queue stored in ref - built once, rotated on advance
    const fallbackRef = useRef(null);
    const [fallbackVer, setFallbackVer] = useState(0);

    // Initialize fallback queue once when allCompanies first has data
    if (!hasBackend && fallbackRef.current === null && allCompanies.length > 0) {
        fallbackRef.current = [...allCompanies]
            .filter(c => c.symbol && c.price > 0)
            .sort((a, b) => Math.abs(b.priceChange || 0) - Math.abs(a.priceChange || 0))
            .slice(0, 40)
            .map(c => {
                const oldPrice = c.price - (c.priceChange || 0);
                const pctChange = oldPrice > 0 ? ((c.priceChange || 0) / oldPrice * 100) : 0;
                return { id: c.id, symbol: c.symbol, price: c.price, pctChange, isOwned: false, sparkPrices: null };
            });
    }

    // Update prices in-place for fallback items without resorting
    if (!hasBackend && fallbackRef.current) {
        const byId = new Map(allCompanies.map(c => [c.id, c]));
        for (const item of fallbackRef.current) {
            const c = byId.get(item.id);
            if (c) {
                item.price = c.price;
                const oldPrice = c.price - (c.priceChange || 0);
                item.pctChange = oldPrice > 0 ? ((c.priceChange || 0) / oldPrice * 100) : 0;
            }
        }
    }

    const tickerQueue = hasBackend ? backendQueue : (fallbackRef.current || []);

    const [scrollPx, setScrollPx] = useState(0);
    const [showSpeedModal, setShowSpeedModal] = useState(false);
    const scrollRef = useRef(0);
    const runningRef = useRef(isTickerRunning);
    const modalRef = useRef(modalType);
    const hoveredRef = useRef(false);
    const advancingRef = useRef(false);
    const hasBackendRef = useRef(hasBackend);

    // Keep refs in sync
    runningRef.current = isTickerRunning;
    modalRef.current = modalType;
    hasBackendRef.current = hasBackend;

    // Smooth pixel scrolling
    useEffect(() => {
        // Pixels per step: tickSpeed 1 -> 0.5px, tickSpeed 100 -> 3px
        const pxPerStep = 0.5 + (tickSpeed - 1) * (2.5 / 99);

        const id = setInterval(() => {
            if (!runningRef.current || modalRef.current !== 0 || hoveredRef.current) return;

            scrollRef.current += pxPerStep;

            // When a full card has scrolled off, advance
            if (scrollRef.current >= CARD_WIDTH && !advancingRef.current) {
                scrollRef.current -= CARD_WIDTH;
                setScrollPx(scrollRef.current);
                if (hasBackendRef.current) {
                    // Backend mode: pop front, push new to back via API
                    advancingRef.current = true;
                    api.advanceTicker().catch(() => {}).finally(() => {
                        advancingRef.current = false;
                    });
                } else if (fallbackRef.current && fallbackRef.current.length > 1) {
                    // Fallback mode: rotate - move front to back
                    fallbackRef.current.push(fallbackRef.current.shift());
                    setFallbackVer(v => v + 1);
                }
                return;
            }

            setScrollPx(scrollRef.current);
        }, SCROLL_INTERVAL);

        return () => clearInterval(id);
    }, [tickSpeed]);

    const toggleTicker = () => {
        if (isTickerRunning) api.stopTicker();
        else api.startTicker();
    };

    if (tickerQueue.length === 0) return null;

    return html`
        <${InputStringModal}
            show=${showSpeedModal}
            title="Set Ticker Speed"
            text="Enter the desired ticker speed (1-100):"
            defaultValue=${tickSpeed.toString()}
            onSubmit=${(value) => {
                api.setTickSpeed(Math.min(100, Math.max(1, parseInt(value))));
                setShowSpeedModal(false);
            }}
            onCancel=${() => setShowSpeedModal(false)}
        />
        <div class="stock-ticker">
            <div class="stock-ticker-controls">
                <div class="btn ${isTickerRunning ? 'stop' : 'play'}"
                     style="width: 25px; height: 20px"
                     onClick=${toggleTicker}>
                    <div style="width: 20px">
                        <${isTickerRunning ? StopIcon : PlayIcon} />
                    </div>
                </div>
                <div class="btn blue" style="height: 20px" onClick=${() => setShowSpeedModal(true)}>
                    <div class="flex items-center gap-1">
                        <div style="width: 20px"><${GaugeIcon} /></div>
                        <div>${tickSpeed}</div>
                    </div>
                </div>
                <div class="btn" style="height: 20px" onClick=${() => api.runTicker()}>
                    <div style="width: 20px"><${ForwardIcon} /></div>
                </div>
            </div>
            <div class="stock-ticker-marquee"
                 onMouseEnter=${() => { hoveredRef.current = true; }}
                 onMouseLeave=${() => { hoveredRef.current = false; }}>
                <div class="stock-ticker-track"
                     style=${`transform: translateX(-${scrollPx}px)`}>
                    ${tickerQueue.map(item => html`
                        <${TickerItem} key=${item.id} item=${item} />
                    `)}
                </div>
            </div>
        </div>
    `;
}
