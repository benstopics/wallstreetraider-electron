import {
    html, useEffect, useRef, useState, useCallback, useMemo,
} from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { DEFAULT_ADVANCED_CHART_THEME } from '../../css/chart-styles.js';
import { insertCurrencySymbols } from './helpers.js';
import {
    dateLabel,
    determineSuffixForRange,
    formatWithSuffix,
    formatPriceWithSuffix,
} from './assetPriceChartUtils.js';
import {
    buildCandles,
    hasRealOHLC,
    calcSMA,
    calcEMA,
    calcBollinger,
    calcRSI,
    calcMACD,
    synthVolume,
    calcPricePaneRange,
    rsiRange,
    macdRange,
    volumeRange,
} from './advancedChartUtils.js';
import {
    SLOT_COUNT,
    padToSlots,
    priceToY,
    indexToX,
    xToIndex,
    drawLineAndArea,
    drawLineSeries,
    drawCandles,
    drawOHLCBars,
} from './chartDrawing.js';
import { useChartType, isSimpleAsset } from './chartPrefs.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';

const SECURITY_IDS = [
    api.STOCK_INDEX_ID, api.OIL_ID, api.GOLD_ID, api.SILVER_ID,
    api.WHEAT_ID, api.CORN_ID, api.PRIME_RATE_ID, api.TBOND_RATE_ID,
    api.SBOND_RATE_ID, api.GNP_RATE_ID, api.BITCOIN_ID, api.ETHEREUM_ID,
];

const TOOLBAR_H = 44;
const VOLUME_PANE_H = 80;
const RSI_PANE_H = 80;
const MACD_PANE_H = 100;
const PAD = { L: 52, R: 70, T: 14, B: 28, PANE_GAP: 6 };

const SMA_PERIOD = 6;
const EMA_PERIOD = 12;
const BB_PERIOD = 20;
const RSI_PERIOD = 14;
const MACD_FAST = 12;
const MACD_SLOW = 26;
const MACD_SIGNAL = 9;

// ---------------------------------------------------------------------------
// Pane drawing helpers (specific to this component's layout)
// ---------------------------------------------------------------------------

function drawGrid(ctx, theme, paneTop, paneH, chartLeft, chartW, divisions = 4) {
    ctx.strokeStyle = theme.gridColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    for (let i = 0; i <= divisions; i++) {
        const y = paneTop + (paneH / divisions) * i;
        ctx.beginPath();
        ctx.moveTo(chartLeft, y);
        ctx.lineTo(chartLeft + chartW, y);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

function drawPaneBorder(ctx, theme, paneTop, paneH, chartLeft, chartW) {
    ctx.strokeStyle = theme.paneDividerColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartLeft, paneTop + paneH);
    ctx.lineTo(chartLeft + chartW, paneTop + paneH);
    ctx.stroke();
}

function drawYAxisLabels(ctx, theme, paneTop, paneH, chartLeft, chartW, range, baseMultiplier, divisions = 4, fixed = false) {
    ctx.fillStyle = theme.lineColor;
    ctx.font = '11px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'left';
    const suffix = fixed ? { suffix: '', divisor: 1 } : determineSuffixForRange(range.maxVal, baseMultiplier);
    for (let i = 0; i <= divisions; i++) {
        const y = paneTop + (paneH / divisions) * i;
        const v = range.maxVal - (range.range / divisions) * i;
        const label = fixed ? v.toFixed(0) : formatWithSuffix(v, suffix.suffix, suffix.divisor, baseMultiplier);
        ctx.fillText(label, chartLeft + chartW + 5, y + 3);
    }
    return suffix;
}

function drawXAxisLabels(ctx, theme, n, baseMonth, baseYear, chartLeft, chartW, canvasH, divisions = 6) {
    ctx.fillStyle = theme.lineColor;
    ctx.font = '11px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= divisions; i++) {
        const idx = Math.round(((n - 1) * i) / divisions);
        const x = indexToX(idx, n, chartLeft, chartW);
        const label = dateLabel(idx, baseMonth, baseYear, n);
        ctx.fillText(label.axisLabel, x, canvasH - 8);
    }
}

function drawWarmupStripe(ctx, theme, warmupCount, n, chartLeft, chartW, paneTop, paneH) {
    if (warmupCount <= 0) return;
    const x0 = indexToX(0, n, chartLeft, chartW);
    const x1 = indexToX(Math.min(warmupCount - 1, n - 1), n, chartLeft, chartW);
    ctx.fillStyle = theme.warmupStripeColor;
    ctx.fillRect(x0, paneTop, x1 - x0, paneH);
}

function drawBollingerFill(ctx, theme, upper, lower, n, chartLeft, chartW, range, paneTop, paneH) {
    ctx.fillStyle = theme.bollingerFillColor;
    ctx.beginPath();
    let moved = false;
    for (let i = 0; i < upper.length; i++) {
        const v = upper[i];
        if (v == null) continue;
        const x = indexToX(i, n, chartLeft, chartW);
        const y = priceToY(v, range, paneTop, paneH);
        if (!moved) { ctx.moveTo(x, y); moved = true; }
        else ctx.lineTo(x, y);
    }
    for (let i = lower.length - 1; i >= 0; i--) {
        const v = lower[i];
        if (v == null) continue;
        const x = indexToX(i, n, chartLeft, chartW);
        const y = priceToY(v, range, paneTop, paneH);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

function drawRSIBands(ctx, theme, paneTop, paneH, chartLeft, chartW) {
    const yTop = priceToY(70, { minVal: 0, maxVal: 100, range: 100 }, paneTop, paneH);
    const yBot = priceToY(30, { minVal: 0, maxVal: 100, range: 100 }, paneTop, paneH);
    ctx.fillStyle = theme.rsiOverboughtColor;
    ctx.fillRect(chartLeft, paneTop, chartW, yTop - paneTop);
    ctx.fillStyle = theme.rsiOversoldColor;
    ctx.fillRect(chartLeft, yBot, chartW, paneTop + paneH - yBot);
}

function drawVolumeBars(ctx, theme, candles, volumes, n, chartLeft, chartW, range, paneTop, paneH) {
    const step = n > 1 ? chartW / (n - 1) : chartW;
    const w = Math.max(1, Math.min(step * 0.7, 30));
    for (let i = 0; i < n; i++) {
        const c = candles[i];
        const v = volumes[i];
        if (!c || !v) continue;
        const x = indexToX(i, n, chartLeft, chartW);
        const y = priceToY(v, range, paneTop, paneH);
        const bull = c.close >= c.open;
        ctx.fillStyle = bull ? theme.volumeUpColor : theme.volumeDownColor;
        ctx.fillRect(x - w / 2, y, w, paneTop + paneH - y);
    }
}

function drawMACDHistogram(ctx, theme, hist, n, chartLeft, chartW, range, paneTop, paneH) {
    const step = n > 1 ? chartW / (n - 1) : chartW;
    const w = Math.max(1, Math.min(step * 0.7, 30));
    const yZero = priceToY(0, range, paneTop, paneH);
    for (let i = 0; i < hist.length; i++) {
        const v = hist[i];
        if (v == null) continue;
        const x = indexToX(i, n, chartLeft, chartW);
        const y = priceToY(v, range, paneTop, paneH);
        ctx.fillStyle = v >= 0 ? theme.macdHistBullColor : theme.macdHistBearColor;
        ctx.fillRect(x - w / 2, Math.min(y, yZero), w, Math.abs(y - yZero));
    }
}

function drawZeroLine(ctx, theme, paneTop, paneH, chartLeft, chartW, range) {
    const yZero = priceToY(0, range, paneTop, paneH);
    ctx.strokeStyle = theme.zeroLineColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(chartLeft, yZero);
    ctx.lineTo(chartLeft + chartW, yZero);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawCrosshair(ctx, theme, x, paneTop, paneH) {
    ctx.strokeStyle = theme.crosshairColor;
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, paneTop);
    ctx.lineTo(x, paneTop + paneH);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawPaneLabel(ctx, theme, label, chartLeft, paneTop, valueText = null, valueColor = null) {
    ctx.textAlign = 'left';
    ctx.font = 'bold 11px Helvetica, Arial, sans-serif';
    ctx.fillStyle = theme.lineColor;
    ctx.fillText(label, chartLeft + 4, paneTop + 12);
    if (valueText != null) {
        const labelWidth = ctx.measureText(label).width;
        ctx.font = '11px Helvetica, Arial, sans-serif';
        ctx.fillStyle = valueColor || theme.lineColor;
        ctx.fillText(valueText, chartLeft + 4 + labelWidth + 6, paneTop + 12);
    }
}

/** Returns the last non-null value in `arr` (the current indicator reading). */
function lastValid(arr) {
    if (!Array.isArray(arr)) return null;
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] != null && Number.isFinite(arr[i])) return arr[i];
    }
    return null;
}

/** Returns # of valid (non-null, finite) entries in `arr`. */
function countValid(arr) {
    if (!Array.isArray(arr)) return 0;
    let c = 0;
    for (const v of arr) if (v != null && Number.isFinite(v)) c++;
    return c;
}

function drawWarmupMessage(ctx, theme, text, chartLeft, chartW, paneTop, paneH) {
    ctx.textAlign = 'center';
    ctx.font = 'italic 11px Helvetica, Arial, sans-serif';
    ctx.fillStyle = theme.warmupTextColor || 'rgba(255,255,255,0.45)';
    ctx.fillText(text, chartLeft + chartW / 2, paneTop + paneH / 2 + 4);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AdvancedChart = ({
    assetId,
    chartTitle,
    baseMultiplier = 1,
    theme = DEFAULT_ADVANCED_CHART_THEME,
    forceLineOnly = false,
    actionButtons = [],
}) => {
    const canvasRef = useRef(null);
    const [cachedChartData, setCachedChartData] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [chartType, setChartType] = useChartType();
    const simpleAsset = isSimpleAsset(assetId) || forceLineOnly;
    const [overlays, setOverlays] = useState(
        simpleAsset
            ? { sma: false, ema: false, bollinger: false }
            : { sma: true, ema: false, bollinger: false }
    );
    const [panels, setPanels] = useState(
        simpleAsset
            ? { volume: false, rsi: false, macd: false }
            : { volume: true, rsi: true, macd: true }
    );
    const [resizeTick, setResizeTick] = useState(0);

    const gameLoaded = api.useGameStore(s => s.gameState.gameLoaded);
    const currentMonth = api.useGameStore(s => s.gameState.currentMonth);
    const currentYear = api.useGameStore(s => s.gameState.currentYear);

    const currentPrice = api.useGameStore(s => {
        const id = Number(assetId);
        if (SECURITY_IDS.includes(id)) {
            const security = s.gameState.allSecurities?.find(sec => sec.id == id);
            return security?.price ?? null;
        } else if (id == api.HUMAN1_ID) {
            return s.gameState.netWorth;
        } else {
            const company = s.gameState.allCompanies?.find(comp => comp.id == id);
            return company?.price ?? null;
        }
    });

    useEffect(() => {
        let active = true;
        if (!gameLoaded) return;
        api.getAssetChart(assetId).then(data => {
            if (active) setCachedChartData(data);
        }).catch(console.error);
        return () => { active = false; };
    }, [assetId, currentMonth, currentYear, gameLoaded]);

    // Live-splice current price into last close.
    const chartData = useMemo(() => {
        if (!cachedChartData?.prices?.length) return cachedChartData;
        if (currentPrice == null) return cachedChartData;
        const prices = [...cachedChartData.prices];
        prices[prices.length - 1] = currentPrice;
        return { ...cachedChartData, prices };
    }, [cachedChartData, currentPrice]);

    const ohlcAvailable = useMemo(() => {
        if (!chartData) return false;
        return hasRealOHLC(chartData.highs, chartData.lows);
    }, [chartData]);

    const effectiveChartType = (simpleAsset || !ohlcAvailable) ? 'line' : chartType;

    // Candles and indicators are computed on the real data, then each resulting
    // series is padded to SLOT_COUNT so everything shares the same X-axis.
    const rawCandles = useMemo(() => {
        if (!chartData) return [];
        return buildCandles(chartData.prices, chartData.highs, chartData.lows);
    }, [chartData]);
    const rawCloses = useMemo(() => chartData?.prices || [], [chartData]);

    const candles = useMemo(() => padToSlots(rawCandles), [rawCandles]);
    const closes = useMemo(() => padToSlots(rawCloses), [rawCloses]);
    const sma = useMemo(() => padToSlots(calcSMA(rawCloses, SMA_PERIOD)), [rawCloses]);
    const ema = useMemo(() => padToSlots(calcEMA(rawCloses, EMA_PERIOD)), [rawCloses]);
    const bb = useMemo(() => {
        const b = calcBollinger(rawCloses, BB_PERIOD, 2);
        return { upper: padToSlots(b.upper), middle: padToSlots(b.middle), lower: padToSlots(b.lower) };
    }, [rawCloses]);
    const rsi = useMemo(() => padToSlots(calcRSI(rawCloses, RSI_PERIOD)), [rawCloses]);
    const macd = useMemo(() => {
        const m = calcMACD(rawCloses, MACD_FAST, MACD_SLOW, MACD_SIGNAL);
        return { line: padToSlots(m.line), signal: padToSlots(m.signal), histogram: padToSlots(m.histogram) };
    }, [rawCloses]);
    const volumes = useMemo(() => padToSlots(synthVolume(rawCandles, 1)), [rawCandles]);

    // First data slot (index into the padded SLOT_COUNT array where real data begins).
    const firstDataSlot = useMemo(() => {
        return Math.max(0, SLOT_COUNT - rawCloses.length);
    }, [rawCloses]);

    // baseMonth/baseYear represent the latest (rightmost) bar; date labels use
    // n=SLOT_COUNT so the leftmost slot is 59 months before current.
    const baseMonth = chartData?.baseMonth ?? 0;
    const baseYear = chartData?.baseYear ?? 0;

    const handleMouseMove = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (e.clientX - rect.left) * scaleX;
        const chartLeft = PAD.L;
        const chartW = canvas.width - PAD.L - PAD.R;
        if (x < chartLeft || x > chartLeft + chartW) { setHoverIndex(null); return; }
        const idx = xToIndex(x, SLOT_COUNT, chartLeft, chartW);
        setHoverIndex(idx);
    }, []);

    const handleMouseLeave = useCallback(() => setHoverIndex(null), []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !chartData || closes.length === 0) return;
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        if (canvas.width <= 0 || canvas.height <= 0) return;

        const W = canvas.width;
        const H = canvas.height;
        const chartLeft = PAD.L;
        const chartW = W - PAD.L - PAD.R;

        const xAxisH = PAD.B;
        const pricePaneBottom = H - xAxisH - PAD.PANE_GAP;
        const lowerPaneOrder = [];
        if (panels.volume) lowerPaneOrder.push({ key: 'volume', h: VOLUME_PANE_H });
        if (panels.rsi) lowerPaneOrder.push({ key: 'rsi', h: RSI_PANE_H });
        if (panels.macd) lowerPaneOrder.push({ key: 'macd', h: MACD_PANE_H });
        const lowerTotalH = lowerPaneOrder.reduce((s, p) => s + p.h + PAD.PANE_GAP, 0);
        const pricePaneTop = PAD.T;
        const pricePaneH = pricePaneBottom - lowerTotalH - pricePaneTop;

        ctx.fillStyle = theme.background;
        ctx.fillRect(0, 0, W, H);

        if (pricePaneH < 40) {
            ctx.fillStyle = theme.lineColor;
            ctx.font = '13px Helvetica, Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Window too short — close a lower panel.', W / 2, H / 2);
            return;
        }

        const n = SLOT_COUNT;
        const dataCount = n - firstDataSlot;  // how many real (non-padded) bars

        // ---- Price pane ----
        const overlaySeriesForRange = [];
        if (overlays.sma) overlaySeriesForRange.push(sma);
        if (overlays.ema) overlaySeriesForRange.push(ema);
        if (overlays.bollinger) {
            overlaySeriesForRange.push(bb.upper);
            overlaySeriesForRange.push(bb.lower);
        }
        const priceRange = calcPricePaneRange(candles, overlaySeriesForRange);

        drawGrid(ctx, theme, pricePaneTop, pricePaneH, chartLeft, chartW, 4);
        drawYAxisLabels(ctx, theme, pricePaneTop, pricePaneH, chartLeft, chartW, priceRange, baseMultiplier, 4, false);

        if (overlays.bollinger) {
            drawBollingerFill(ctx, theme, bb.upper, bb.lower, n, chartLeft, chartW, priceRange, pricePaneTop, pricePaneH);
        }

        if (effectiveChartType === 'line') {
            drawLineAndArea(ctx, theme, closes, n, chartLeft, chartW, priceRange, pricePaneTop, pricePaneH);
        } else if (effectiveChartType === 'candle') {
            drawCandles(ctx, theme, candles, chartLeft, chartW, priceRange, pricePaneTop, pricePaneH);
        } else {
            drawOHLCBars(ctx, theme, candles, chartLeft, chartW, priceRange, pricePaneTop, pricePaneH);
        }

        if (overlays.sma) drawLineSeries(ctx, theme.smaColor, 1.5, sma, n, chartLeft, chartW, priceRange, pricePaneTop, pricePaneH);
        if (overlays.ema) drawLineSeries(ctx, theme.emaColor, 1.5, ema, n, chartLeft, chartW, priceRange, pricePaneTop, pricePaneH);
        if (overlays.bollinger) {
            drawLineSeries(ctx, theme.bollingerBandColor, 1, bb.upper, n, chartLeft, chartW, priceRange, pricePaneTop, pricePaneH);
            drawLineSeries(ctx, theme.bollingerBandColor, 1, bb.middle, n, chartLeft, chartW, priceRange, pricePaneTop, pricePaneH);
            drawLineSeries(ctx, theme.bollingerBandColor, 1, bb.lower, n, chartLeft, chartW, priceRange, pricePaneTop, pricePaneH);
        }

        // Legend strip — shows current overlay values (or warmup state) at top-left
        // of the price pane so the user can tell at a glance whether an indicator
        // is producing values without needing to hover.
        {
            ctx.textAlign = 'left';
            ctx.font = '11px Helvetica, Arial, sans-serif';
            let lx = chartLeft + 6;
            const ly = pricePaneTop + 14;
            const entry = (label, value, color) => {
                ctx.fillStyle = color;
                const text = `${label} ${value}`;
                ctx.fillText(text, lx, ly);
                lx += ctx.measureText(text).width + 12;
            };
            if (overlays.sma) {
                const v = lastValid(sma);
                const valText = v != null ? formatPriceWithSuffix(v, baseMultiplier)
                    : `warmup (need ${Math.max(0, SMA_PERIOD - dataCount)})`;
                entry(`SMA(${SMA_PERIOD})`, valText, theme.smaColor);
            }
            if (overlays.ema) {
                const v = lastValid(ema);
                const valText = v != null ? formatPriceWithSuffix(v, baseMultiplier)
                    : `warmup (need ${Math.max(0, EMA_PERIOD - dataCount)})`;
                entry(`EMA(${EMA_PERIOD})`, valText, theme.emaColor);
            }
            if (overlays.bollinger) {
                const vu = lastValid(bb.upper);
                const vl = lastValid(bb.lower);
                const valText = (vu != null && vl != null)
                    ? `${formatPriceWithSuffix(vl, baseMultiplier)}…${formatPriceWithSuffix(vu, baseMultiplier)}`
                    : `warmup (need ${Math.max(0, BB_PERIOD - dataCount)})`;
                entry(`BB(${BB_PERIOD},2)`, valText, theme.bollingerBandColor);
            }
        }

        drawPaneBorder(ctx, theme, pricePaneTop, pricePaneH, chartLeft, chartW);

        // ---- Lower panes ----
        let paneTop = pricePaneTop + pricePaneH + PAD.PANE_GAP;
        for (const pane of lowerPaneOrder) {
            const paneH = pane.h;
            if (pane.key === 'volume') {
                const vRange = volumeRange(volumes.filter(v => v != null));
                drawVolumeBars(ctx, theme, candles, volumes, n, chartLeft, chartW, vRange, paneTop, paneH);
                const cur = lastValid(volumes);
                drawPaneLabel(ctx, theme, 'Est. Volume', chartLeft, paneTop,
                    cur != null ? formatPriceWithSuffix(cur, baseMultiplier) : null);
            } else if (pane.key === 'rsi') {
                const rRange = rsiRange();
                drawRSIBands(ctx, theme, paneTop, paneH, chartLeft, chartW);
                drawWarmupStripe(ctx, theme, firstDataSlot + RSI_PERIOD, n, chartLeft, chartW, paneTop, paneH);
                drawLineSeries(ctx, theme.rsiLineColor, 1.5, rsi, n, chartLeft, chartW, rRange, paneTop, paneH);
                drawYAxisLabels(ctx, theme, paneTop, paneH, chartLeft, chartW, rRange, 1, 2, true);
                const cur = lastValid(rsi);
                drawPaneLabel(ctx, theme, `RSI(${RSI_PERIOD})`, chartLeft, paneTop,
                    cur != null ? cur.toFixed(1) : null, theme.rsiLineColor);
                if (countValid(rsi) === 0) {
                    const need = Math.max(0, (RSI_PERIOD + 1) - dataCount);
                    drawWarmupMessage(ctx, theme,
                        `Warmup — needs ${need} more month${need === 1 ? '' : 's'} of history`,
                        chartLeft, chartW, paneTop, paneH);
                }
            } else if (pane.key === 'macd') {
                const mRange = macdRange(macd.line, macd.signal, macd.histogram);
                drawWarmupStripe(ctx, theme, firstDataSlot + MACD_SLOW, n, chartLeft, chartW, paneTop, paneH);
                drawMACDHistogram(ctx, theme, macd.histogram, n, chartLeft, chartW, mRange, paneTop, paneH);
                drawZeroLine(ctx, theme, paneTop, paneH, chartLeft, chartW, mRange);
                drawLineSeries(ctx, theme.macdLineColor, 1.5, macd.line, n, chartLeft, chartW, mRange, paneTop, paneH);
                drawLineSeries(ctx, theme.macdSignalColor, 1.5, macd.signal, n, chartLeft, chartW, mRange, paneTop, paneH);
                const curLine = lastValid(macd.line);
                const curSig = lastValid(macd.signal);
                const valText = (curLine != null && curSig != null)
                    ? `${curLine >= 0 ? '+' : ''}${curLine.toFixed(2)} / ${curSig.toFixed(2)}` : null;
                drawPaneLabel(ctx, theme, `MACD(${MACD_FAST},${MACD_SLOW},${MACD_SIGNAL})`, chartLeft, paneTop,
                    valText, theme.macdLineColor);
                if (countValid(macd.signal) === 0) {
                    const need = Math.max(0, (MACD_SLOW + MACD_SIGNAL) - dataCount);
                    drawWarmupMessage(ctx, theme,
                        `Warmup — needs ${need} more month${need === 1 ? '' : 's'} of history`,
                        chartLeft, chartW, paneTop, paneH);
                }
            }
            drawPaneBorder(ctx, theme, paneTop, paneH, chartLeft, chartW);
            paneTop += paneH + PAD.PANE_GAP;
        }

        drawXAxisLabels(ctx, theme, n, baseMonth, baseYear, chartLeft, chartW, H, 6);

        if (hoverIndex != null && hoverIndex >= 0 && hoverIndex < n) {
            const x = indexToX(hoverIndex, n, chartLeft, chartW);
            drawCrosshair(ctx, theme, x, pricePaneTop, pricePaneH);
            let pt = pricePaneTop + pricePaneH + PAD.PANE_GAP;
            for (const pane of lowerPaneOrder) {
                drawCrosshair(ctx, theme, x, pt, pane.h);
                pt += pane.h + PAD.PANE_GAP;
            }
        }
    }, [chartData, candles, closes, sma, ema, bb, rsi, macd, volumes, firstDataSlot,
        hoverIndex, chartType, effectiveChartType, overlays, panels, theme, baseMultiplier,
        baseMonth, baseYear, resizeTick]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ro = new ResizeObserver(() => setResizeTick(t => t + 1));
        ro.observe(canvasRef.current);
        return () => ro.disconnect();
    }, []);

    const displayTitle = insertCurrencySymbols(
        typeof chartTitle === 'function' ? chartTitle(chartData) : (chartTitle || 'Advanced Chart')
    );

    const readout = useMemo(() => {
        if (hoverIndex == null) return null;
        const c = candles[hoverIndex];
        const label = dateLabel(hoverIndex, baseMonth, baseYear, SLOT_COUNT).tooltipLabel;
        if (!c) {
            return { label, empty: true };
        }
        const prev = hoverIndex > 0 ? candles[hoverIndex - 1] : null;
        const deltaPct = prev && prev.close ? ((c.close - prev.close) / prev.close) * 100 : 0;
        return {
            label, empty: false,
            o: c.open, h: c.high, l: c.low, c: c.close, deltaPct,
            sma: sma[hoverIndex], ema: ema[hoverIndex],
            bbUpper: bb.upper[hoverIndex], bbLower: bb.lower[hoverIndex],
            rsi: rsi[hoverIndex],
            macdLine: macd.line[hoverIndex], macdSignal: macd.signal[hoverIndex],
            volume: volumes[hoverIndex],
        };
    }, [hoverIndex, candles, sma, ema, bb, rsi, macd, volumes, baseMonth, baseYear]);

    const fmt = (v) => v == null || !Number.isFinite(v) ? '—' : formatPriceWithSuffix(v, baseMultiplier);
    const fmtFixed = (v, d = 2) => v == null || !Number.isFinite(v) ? '—' : v.toFixed(d);

    const toggleOverlay = (k) => setOverlays(o => ({ ...o, [k]: !o[k] }));
    const togglePanel = (k) => setPanels(p => ({ ...p, [k]: !p[k] }));

    const btnBase = 'px-2 py-1 text-xs border border-white/20 rounded';
    const btnOn = 'bg-white/15 text-white';
    const btnOff = 'bg-transparent text-white/60 hover:bg-white/5';
    const btnCls = (active) => `${btnBase} ${active ? btnOn : btnOff}`;

    return html`
        <div class="flex flex-col w-full h-full" style="background: ${theme.background};">
            <div class="flex items-center gap-3 px-3 py-2 border-b border-white/10 text-white" style="height: ${TOOLBAR_H}px; flex-shrink: 0;">
                <div class="font-bold text-sm truncate">${displayTitle}</div>
                ${!simpleAsset && html`
                    <div class="flex items-center gap-1">
                        <button class=${btnCls(effectiveChartType === 'line')} onClick=${() => setChartType('line')}>Line</button>
                        <button class=${btnCls(effectiveChartType === 'candle')} disabled=${!ohlcAvailable} onClick=${() => setChartType('candle')} title=${ohlcAvailable ? '' : 'High/low not tracked for this asset'}>Candle</button>
                        <button class=${btnCls(effectiveChartType === 'ohlc')} disabled=${!ohlcAvailable} onClick=${() => setChartType('ohlc')} title=${ohlcAvailable ? '' : 'High/low not tracked for this asset'}>OHLC</button>
                    </div>
                    <div class="flex items-center gap-1">
                        <button class=${btnCls(overlays.sma)} onClick=${() => toggleOverlay('sma')}>SMA(${SMA_PERIOD})</button>
                        <button class=${btnCls(overlays.ema)} onClick=${() => toggleOverlay('ema')}>EMA(${EMA_PERIOD})</button>
                        <button class=${btnCls(overlays.bollinger)} onClick=${() => toggleOverlay('bollinger')}>BB(${BB_PERIOD},2)</button>
                    </div>
                    <div class="flex items-center gap-1">
                        <button class=${btnCls(panels.volume)} onClick=${() => togglePanel('volume')}>Vol</button>
                        <button class=${btnCls(panels.rsi)} onClick=${() => togglePanel('rsi')}>RSI</button>
                        <button class=${btnCls(panels.macd)} onClick=${() => togglePanel('macd')}>MACD</button>
                    </div>
                `}
                ${actionButtons.length > 0 && html`
                    <div class="flex items-center gap-2 ml-auto advanced-chart-actions">
                        ${actionButtons.map(btn => html`<${DisabledTooltipButton} ...${btn} />`)}
                    </div>
                `}
            </div>
            <div class="relative flex-1" style="min-height: 200px;">
                <canvas
                    ref=${canvasRef}
                    class="w-full h-full block"
                    onMouseMove=${handleMouseMove}
                    onMouseLeave=${handleMouseLeave}
                />
                ${readout && html`
                    <div class="absolute top-2 left-14 pointer-events-none bg-black/80 border border-white/25 rounded px-2 py-1 text-white text-xs" style="z-index: 5;">
                        <div class="flex gap-3 flex-wrap">
                            <span class="font-bold">${readout.label}</span>
                            ${readout.empty ? html`<span class="text-white/50">(no data)</span>` : html`
                                <span>O ${fmt(readout.o)}</span>
                                <span>H ${fmt(readout.h)}</span>
                                <span>L ${fmt(readout.l)}</span>
                                <span>C ${fmt(readout.c)}</span>
                                <span style="color: ${readout.deltaPct >= 0 ? theme.bullColor : theme.bearColor};">${readout.deltaPct >= 0 ? '+' : ''}${fmtFixed(readout.deltaPct, 2)}%</span>
                                ${overlays.sma && html`<span style="color: ${theme.smaColor};">SMA ${fmt(readout.sma)}</span>`}
                                ${overlays.ema && html`<span style="color: ${theme.emaColor};">EMA ${fmt(readout.ema)}</span>`}
                                ${overlays.bollinger && html`<span style="color: ${theme.bollingerBandColor};">BB ${fmt(readout.bbLower)}…${fmt(readout.bbUpper)}</span>`}
                                ${panels.rsi && html`<span style="color: ${theme.rsiLineColor};">RSI ${fmtFixed(readout.rsi, 1)}</span>`}
                                ${panels.macd && html`<span style="color: ${theme.macdLineColor};">MACD ${fmtFixed(readout.macdLine, 2)}/${fmtFixed(readout.macdSignal, 2)}</span>`}
                                ${panels.volume && html`<span class="text-white/70">Est.Vol ${fmt(readout.volume)}</span>`}
                            `}
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
};

export default AdvancedChart;
