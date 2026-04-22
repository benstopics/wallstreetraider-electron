/**
 * Pure utility functions for AdvancedChart.
 * All functions are side-effect free — canvas rendering lives in AdvancedChart.js.
 *
 * Indicator periods are chosen for monthly bars (60-bar max):
 *   SMA / EMA:   configurable (defaults: 6, 12 months)
 *   Bollinger:   period=20, k=2
 *   RSI:         period=14 (Wilder smoothing)
 *   MACD:        fast=12, slow=26, signal=9
 *
 * Any series returned may contain `null` for the warmup window (bars before the
 * indicator has enough data). The renderer must skip null segments.
 */

// ---------------------------------------------------------------------------
// Candlestick bar assembly
// ---------------------------------------------------------------------------

/**
 * Build OHLC bars from parallel close / high / low arrays.
 * "Open" is synthesized as the previous bar's close (standard for monthly bars).
 * The first bar uses its own close as open (a doji, which is honest for the first bar).
 *
 * @param {number[]} closes
 * @param {number[]} highs
 * @param {number[]} lows
 * @returns {Array<{open:number, high:number, low:number, close:number}>}
 */
export function buildCandles(closes, highs, lows) {
    if (!Array.isArray(closes) || closes.length === 0) return [];
    const n = closes.length;
    const haveOHLC = Array.isArray(highs) && Array.isArray(lows)
        && highs.length === n && lows.length === n;
    const out = [];
    for (let i = 0; i < n; i++) {
        const close = closes[i];
        const open = i === 0 ? close : closes[i - 1];
        let high = haveOHLC ? highs[i] : Math.max(open, close);
        let low = haveOHLC ? lows[i] : Math.min(open, close);
        // Engine may record 0 for unreported months; fall back to open/close envelope.
        if (!Number.isFinite(high) || high <= 0) high = Math.max(open, close);
        if (!Number.isFinite(low) || low <= 0) low = Math.min(open, close);
        // Final safety: wick must encompass body.
        if (high < Math.max(open, close)) high = Math.max(open, close);
        if (low > Math.min(open, close)) low = Math.min(open, close);
        out.push({ open, high, low, close });
    }
    return out;
}

/** @returns {boolean} True when highs/lows contain real non-zero data. */
export function hasRealOHLC(highs, lows) {
    if (!Array.isArray(highs) || !Array.isArray(lows)) return false;
    if (highs.length === 0 || lows.length === 0) return false;
    for (let i = 0; i < highs.length; i++) {
        if (highs[i] > 0 || lows[i] > 0) return true;
    }
    return false;
}

// ---------------------------------------------------------------------------
// Moving averages
// ---------------------------------------------------------------------------

/**
 * Simple Moving Average. Returns an array the same length as the input, with
 * null for the first (period-1) positions (warmup).
 */
export function calcSMA(series, period) {
    const n = series.length;
    const out = new Array(n).fill(null);
    if (period <= 0 || period > n) return out;
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += series[i];
        if (i >= period) sum -= series[i - period];
        if (i >= period - 1) out[i] = sum / period;
    }
    return out;
}

/**
 * Exponential Moving Average (SMA-seeded). Returns same-length array; first
 * (period-1) positions are null.
 */
export function calcEMA(series, period) {
    const n = series.length;
    const out = new Array(n).fill(null);
    if (period <= 0 || period > n) return out;
    const k = 2 / (period + 1);
    // Seed with SMA of first `period` values.
    let seed = 0;
    for (let i = 0; i < period; i++) seed += series[i];
    seed /= period;
    out[period - 1] = seed;
    let prev = seed;
    for (let i = period; i < n; i++) {
        prev = series[i] * k + prev * (1 - k);
        out[i] = prev;
    }
    return out;
}

// ---------------------------------------------------------------------------
// Bollinger Bands (20, 2)
// ---------------------------------------------------------------------------

export function calcBollinger(series, period = 20, k = 2) {
    const n = series.length;
    const middle = calcSMA(series, period);
    const upper = new Array(n).fill(null);
    const lower = new Array(n).fill(null);
    if (period <= 0 || period > n) return { upper, middle, lower };
    for (let i = period - 1; i < n; i++) {
        let sqSum = 0;
        const mean = middle[i];
        for (let j = i - period + 1; j <= i; j++) {
            const d = series[j] - mean;
            sqSum += d * d;
        }
        const stdev = Math.sqrt(sqSum / period);
        upper[i] = mean + k * stdev;
        lower[i] = mean - k * stdev;
    }
    return { upper, middle, lower };
}

// ---------------------------------------------------------------------------
// RSI (Wilder)
// ---------------------------------------------------------------------------

export function calcRSI(series, period = 14) {
    const n = series.length;
    const out = new Array(n).fill(null);
    if (n < period + 1) return out;
    let gain = 0;
    let loss = 0;
    for (let i = 1; i <= period; i++) {
        const diff = series[i] - series[i - 1];
        if (diff >= 0) gain += diff;
        else loss -= diff;
    }
    gain /= period;
    loss /= period;
    out[period] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
    for (let i = period + 1; i < n; i++) {
        const diff = series[i] - series[i - 1];
        const g = diff > 0 ? diff : 0;
        const l = diff < 0 ? -diff : 0;
        gain = (gain * (period - 1) + g) / period;
        loss = (loss * (period - 1) + l) / period;
        out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
    }
    return out;
}

// ---------------------------------------------------------------------------
// MACD (12, 26, 9)
// ---------------------------------------------------------------------------

export function calcMACD(series, fast = 12, slow = 26, signal = 9) {
    const n = series.length;
    const emaFast = calcEMA(series, fast);
    const emaSlow = calcEMA(series, slow);
    const line = new Array(n).fill(null);
    for (let i = 0; i < n; i++) {
        if (emaFast[i] != null && emaSlow[i] != null) {
            line[i] = emaFast[i] - emaSlow[i];
        }
    }
    // Signal line = EMA of MACD line, starting from the first non-null MACD.
    const signalArr = new Array(n).fill(null);
    const firstValid = line.findIndex(v => v != null);
    if (firstValid >= 0 && n - firstValid >= signal) {
        const k = 2 / (signal + 1);
        let seed = 0;
        for (let i = firstValid; i < firstValid + signal; i++) seed += line[i];
        seed /= signal;
        signalArr[firstValid + signal - 1] = seed;
        let prev = seed;
        for (let i = firstValid + signal; i < n; i++) {
            prev = line[i] * k + prev * (1 - k);
            signalArr[i] = prev;
        }
    }
    const histogram = new Array(n).fill(null);
    for (let i = 0; i < n; i++) {
        if (line[i] != null && signalArr[i] != null) {
            histogram[i] = line[i] - signalArr[i];
        }
    }
    return { line, signal: signalArr, histogram };
}

// ---------------------------------------------------------------------------
// Synthetic "Est. Volume"
// ---------------------------------------------------------------------------

/**
 * Proxy for trading volume: monthly true-range magnitude × a baseline.
 * When highs/lows are real, we use (high - low) * marketCap-proxy — analogous
 * to dollar-volume of the move. Otherwise we fall back to |monthlyReturn| × close².
 *
 * The absolute values are not meaningful — only relative magnitude is. The UI
 * labels the panel "Est. Volume" so users understand.
 *
 * @param {Array<{open,high,low,close}>} candles
 * @param {number} [k=1] scale factor (visual only)
 * @returns {number[]} volume-proxy per bar (>= 0)
 */
export function synthVolume(candles, k = 1) {
    if (!Array.isArray(candles) || candles.length === 0) return [];
    return candles.map((c, i) => {
        const range = Math.max(0, c.high - c.low);
        if (range > 0) return range * c.close * k;
        // Flat bar → small blip proportional to the return (or zero).
        if (i === 0) return 0;
        const prev = candles[i - 1].close;
        if (prev <= 0) return 0;
        const ret = Math.abs((c.close - prev) / prev);
        return ret * c.close * c.close * k;
    });
}

// ---------------------------------------------------------------------------
// Axis helpers (indicator-specific ranges)
// ---------------------------------------------------------------------------

/** Round a number to a "nice" value (1, 2, 5, 10) × 10^n — the standard
 *  algorithm (Heckbert 1990) for producing human-readable axis ticks.
 *  `round=true` snaps to the nearest nice value; `round=false` rounds up. */
function niceNum(range, round) {
    if (!(range > 0) || !Number.isFinite(range)) return 1;
    const exp = Math.floor(Math.log10(range));
    const fraction = range / Math.pow(10, exp);
    let niceFraction;
    if (round) {
        if (fraction < 1.5) niceFraction = 1;
        else if (fraction < 3) niceFraction = 2;
        else if (fraction < 7) niceFraction = 5;
        else niceFraction = 10;
    } else {
        if (fraction <= 1) niceFraction = 1;
        else if (fraction <= 2) niceFraction = 2;
        else if (fraction <= 5) niceFraction = 5;
        else niceFraction = 10;
    }
    return niceFraction * Math.pow(10, exp);
}

/** Union of price + candle high/low + overlay lines for y-axis autoscaling.
 *  Skips null candle slots (empty positions in a left-padded array).
 *
 *  `targetTicks` is the desired number of tick labels (default 5). The returned
 *  `step` is a nice round value (1/2/5 × 10^n) and `minVal`/`maxVal` are snapped
 *  to multiples of `step`, so iterating `minVal, minVal+step, …, maxVal` yields
 *  human-readable axis labels (e.g. 100, 110, 120, 130 instead of 97.4, 107.1, …). */
export function calcPricePaneRange(candles, overlaySeries = [], targetTicks = 5) {
    let lo = Infinity;
    let hi = -Infinity;
    for (const c of candles) {
        if (c == null) continue;
        if (c.high > hi) hi = c.high;
        if (c.low < lo) lo = c.low;
    }
    for (const s of overlaySeries) {
        if (!Array.isArray(s)) continue;
        for (const v of s) {
            if (v == null) continue;
            if (v > hi) hi = v;
            if (v < lo) lo = v;
        }
    }
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return { minVal: 0, maxVal: 1, range: 1, step: 1 };
    if (lo === hi) { lo -= 1; hi += 1; }

    // Nice-number snap naturally contributes its own headroom/footroom (the
    // `ceil`/`floor` step-alignment), so no extra pre-padding is needed —
    // adding it pushes the min/max across an extra step boundary and wastes
    // vertical space (e.g. a $100–$247 range would land on 50..300 instead of
    // the tighter 100..250).
    const step = niceNum((hi - lo) / Math.max(1, targetTicks - 1), true);
    const niceMin = Math.floor(lo / step) * step;
    const niceMax = Math.ceil(hi / step) * step;
    return { minVal: niceMin, maxVal: niceMax, range: niceMax - niceMin, step };
}

/** For RSI: fixed 0..100 range. */
export function rsiRange() {
    return { minVal: 0, maxVal: 100, range: 100 };
}

/** For MACD / histogram: symmetric around zero. */
export function macdRange(lineArr, signalArr, hist) {
    let m = 0;
    const scan = (arr) => {
        if (!Array.isArray(arr)) return;
        for (const v of arr) {
            if (v == null) continue;
            const a = Math.abs(v);
            if (a > m) m = a;
        }
    };
    scan(lineArr); scan(signalArr); scan(hist);
    if (m === 0) m = 1;
    m *= 1.1;  // headroom
    return { minVal: -m, maxVal: m, range: 2 * m };
}

/** For volume: 0..max. */
export function volumeRange(volumes) {
    let m = 0;
    for (const v of volumes) if (v > m) m = v;
    if (m === 0) m = 1;
    return { minVal: 0, maxVal: m * 1.05, range: m * 1.05 };
}
