import { html, useRef, useEffect, useState } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import { formatCurrency } from './helpers.js';
import { PlayIcon, StopIcon, GaugeIcon, ForwardIcon } from '../icons.js';
import InputStringModal from './InputStringModal.js';

const CARD_WIDTH = 180; // px, matches CSS .stock-ticker-item width
const SCROLL_INTERVAL = 20; // ms between scroll steps

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// --- Inline SVG spark chart ---

// Cache for self-fetched spark data (keyed by company id), bounded to prevent unbounded growth
const SPARK_CACHE_MAX = 200;
const sparkCache = new Map();

export function MiniSpark({ prices, assetId, isUp, width = 40, height = 16, strokeWidth = 1.5, className = 'stock-ticker-spark' }) {
    const [fetched, setFetched] = useState(null);

    // Self-fetch when prices aren't provided by backend
    useEffect(() => {
        if (prices && prices.length >= 2) return;
        if (assetId == null) return;
        if (sparkCache.has(assetId)) {
            setFetched(sparkCache.get(assetId));
            return;
        }
        let active = true;
        api.getAssetChart(assetId).then(data => {
            if (!active) return;
            const p = data && data.prices;
            if (p && p.length >= 2) {
                if (sparkCache.size >= SPARK_CACHE_MAX) {
                    const oldest = sparkCache.keys().next().value;
                    sparkCache.delete(oldest);
                }
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
    const points = data.map((p, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((p - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');
    const color = isUp ? 'var(--color-positive)' : 'var(--color-negative)';
    return html`<svg class=${className} width=${width} height=${height} viewBox="0 0 ${width} ${height}">
        <polyline points=${points} fill="none" stroke=${color} stroke-width=${strokeWidth} />
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
    const currentYear = api.useGameStore(s => s.gameState.currentYear);
    const currentMonth = api.useGameStore(s => s.gameState.currentMonth);
    const currentDay = api.useGameStore(s => s.gameState.currentDay);
    const currentTime = api.useGameStore(s => s.gameState.currentTime);
    const currentQuarter = api.useGameStore(s => s.gameState.currentQuarter);

    const gameDate = `${MONTHS[currentMonth - 1]} ${currentDay}, ${currentYear} (Q${currentQuarter})`;
    const timeOfDayPct = currentTime / 17;

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

    const [showSpeedModal, setShowSpeedModal] = useState(false);
    const scrollRef = useRef(0);
    const trackRef = useRef(null);
    const runningRef = useRef(isTickerRunning);
    const modalRef = useRef(modalType);
    const hoveredRef = useRef(false);
    const advancingRef = useRef(false);
    const hasBackendRef = useRef(hasBackend);

    // Keep refs in sync
    runningRef.current = isTickerRunning;
    modalRef.current = modalType;
    hasBackendRef.current = hasBackend;

    // Smooth pixel scrolling — manipulate DOM directly to avoid 50fps re-renders
    useEffect(() => {
        // Pixels per step: tickSpeed 1 -> 0.5px, tickSpeed 100 -> 3px
        const pxPerStep = 0.5 + (tickSpeed - 1) * (2.5 / 99);

        const id = setInterval(() => {
            if (!runningRef.current || modalRef.current !== 0 || hoveredRef.current) return;

            scrollRef.current += pxPerStep;

            // When a full card has scrolled off, advance
            if (scrollRef.current >= CARD_WIDTH && !advancingRef.current) {
                scrollRef.current -= CARD_WIDTH;
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
            }

            // Update DOM directly — no setState, no re-render
            if (trackRef.current) {
                trackRef.current.style.transform = `translateX(-${scrollRef.current}px)`;
            }
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
                <div class="stock-ticker-date date-display flex flex-col justify-center items-center"
                     style="line-height: 1; font-size: 11px; min-width: 110px;">
                    <div>${gameDate}</div>
                    <div class="bg-gray-200 rounded-full dark:bg-gray-700 mt-0.5"
                         style="width: 100%; height: 4px;">
                        <div class="bg-blue-600 rounded-full"
                             style=${`width: ${timeOfDayPct * 100}%; height: 100%;`}></div>
                    </div>
                </div>
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
                     ref=${trackRef}>
                    ${tickerQueue.map(item => html`
                        <${TickerItem} key=${item.id} item=${item} />
                    `)}
                </div>
            </div>
        </div>
    `;
}
