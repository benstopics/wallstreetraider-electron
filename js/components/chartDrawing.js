/**
 * Shared canvas drawing primitives for chart components.
 *
 * Conventions:
 *   - `n` is the number of X-axis slots (not necessarily the data length).
 *   - Data arrays passed to renderers may contain `null` for empty slots;
 *     renderers skip them.
 *   - `range` objects are `{ minVal, maxVal, range }` from calculatePriceRange.
 *   - `paneTop` / `paneH` allow stacking multiple panes on one canvas.
 */

/** Fixed number of X-axis slots — charts always reserve this many positions,
 *  with the latest sample on the right and empty slots on the left when
 *  history is short. */
export const SLOT_COUNT = 60;

/** Left-pad or right-clip `arr` to exactly SLOT_COUNT entries.
 *  Empty positions are `null`. Latest value always lives at index SLOT_COUNT-1. */
export function padToSlots(arr) {
    if (!Array.isArray(arr)) return new Array(SLOT_COUNT).fill(null);
    if (arr.length >= SLOT_COUNT) return arr.slice(arr.length - SLOT_COUNT);
    const pad = new Array(SLOT_COUNT - arr.length).fill(null);
    return [...pad, ...arr];
}

export function priceToY(price, range, paneTop, paneH) {
    return paneTop + paneH - ((price - range.minVal) / range.range) * paneH;
}

export function indexToX(index, n, chartLeft, chartW) {
    if (n <= 1) return chartLeft + chartW / 2;
    return chartLeft + (chartW / (n - 1)) * index;
}

export function xToIndex(x, n, chartLeft, chartW) {
    if (n <= 1) return 0;
    const step = chartW / (n - 1);
    const i = Math.round((x - chartLeft) / step);
    return Math.max(0, Math.min(n - 1, i));
}

/** Line + gradient-filled area beneath (thumbnail-style line chart). */
export function drawLineAndArea(ctx, theme, series, n, chartLeft, chartW, range, paneTop, paneH) {
    // Build the stroke path and a filled polygon down to the bottom.
    const points = [];
    for (let i = 0; i < series.length; i++) {
        const v = series[i];
        if (v == null || !Number.isFinite(v)) continue;
        const x = indexToX(i, n, chartLeft, chartW);
        const y = priceToY(v, range, paneTop, paneH);
        points.push({ x, y });
    }
    if (points.length === 0) return;

    // Filled area
    if (theme.shadedAreaTopColor && theme.shadedAreaBottomColor) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.lineTo(points[points.length - 1].x, paneTop + paneH);
        ctx.lineTo(points[0].x, paneTop + paneH);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, paneTop, 0, paneTop + paneH);
        gradient.addColorStop(0, theme.shadedAreaTopColor);
        gradient.addColorStop(1, theme.shadedAreaBottomColor);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // Stroke on top
    ctx.beginPath();
    ctx.strokeStyle = theme.lineColor;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(points[i].x, points[i].y);
        else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

/** Plain line stroke (for indicator overlays). */
export function drawLineSeries(ctx, color, lineWidth, series, n, chartLeft, chartW, range, paneTop, paneH) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    let drawing = false;
    for (let i = 0; i < series.length; i++) {
        const v = series[i];
        if (v == null || !Number.isFinite(v)) { drawing = false; continue; }
        const x = indexToX(i, n, chartLeft, chartW);
        const y = priceToY(v, range, paneTop, paneH);
        if (!drawing) { ctx.moveTo(x, y); drawing = true; }
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

/** Japanese candlesticks. Skips null entries. */
export function drawCandles(ctx, theme, candles, chartLeft, chartW, range, paneTop, paneH, opts = {}) {
    const n = candles.length;
    const step = n > 1 ? chartW / (n - 1) : chartW;
    const maxBody = opts.maxBodyW ?? 30;
    const bodyW = Math.max(1, Math.min(step * 0.7, maxBody));
    for (let i = 0; i < n; i++) {
        const c = candles[i];
        if (c == null) continue;
        const x = indexToX(i, n, chartLeft, chartW);
        const yHigh = priceToY(c.high, range, paneTop, paneH);
        const yLow = priceToY(c.low, range, paneTop, paneH);
        const yOpen = priceToY(c.open, range, paneTop, paneH);
        const yClose = priceToY(c.close, range, paneTop, paneH);
        const bull = c.close >= c.open;
        const color = bull ? theme.bullColor : theme.bearColor;
        // Wick
        ctx.strokeStyle = theme.wickColor || color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();
        // Body
        ctx.fillStyle = color;
        const top = Math.min(yOpen, yClose);
        const h = Math.max(1, Math.abs(yClose - yOpen));
        ctx.fillRect(x - bodyW / 2, top, bodyW, h);
    }
}

/** OHLC bars (vertical line with open tick left, close tick right). Skips null entries. */
export function drawOHLCBars(ctx, theme, candles, chartLeft, chartW, range, paneTop, paneH, opts = {}) {
    const n = candles.length;
    const step = n > 1 ? chartW / (n - 1) : chartW;
    const maxTick = opts.maxTickW ?? 14;
    const tickW = Math.max(1, Math.min(step * 0.35, maxTick));
    ctx.lineWidth = 1;
    for (let i = 0; i < n; i++) {
        const c = candles[i];
        if (c == null) continue;
        const x = indexToX(i, n, chartLeft, chartW);
        const yHigh = priceToY(c.high, range, paneTop, paneH);
        const yLow = priceToY(c.low, range, paneTop, paneH);
        const yOpen = priceToY(c.open, range, paneTop, paneH);
        const yClose = priceToY(c.close, range, paneTop, paneH);
        const color = c.close >= c.open ? theme.bullColor : theme.bearColor;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.moveTo(x - tickW, yOpen);
        ctx.lineTo(x, yOpen);
        ctx.moveTo(x, yClose);
        ctx.lineTo(x + tickW, yClose);
        ctx.stroke();
    }
}
