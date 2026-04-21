/**
 * Persisted chart preferences.
 *
 * Chart TYPE (line / candle / ohlc) is shared between the small thumbnail and
 * the advanced subscreen — when the user picks one in the subscreen, every
 * thumbnail on the page updates to match, and the choice survives restarts.
 *
 * Advanced-only settings (overlays, panels) are NOT persisted here — they
 * reset per session because they don't apply to thumbnails.
 */

import { useEffect, useState } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';

/**
 * Assets where open/high/low/close collapse to boilerplate (scalar or derived
 * quantities). These always render as a line chart regardless of the user's
 * persisted chartType preference — their "candlestick" would just be a bar
 * filling the entire monthly range, which is noise. The advanced modal also
 * hides indicator/panel tools for these IDs (see AdvancedChart isSimpleAsset).
 */
const SIMPLE_ASSET_ID_SET = new Set([
    api.HUMAN1_ID,        // player net worth
    api.PRIME_RATE_ID,
    api.TBOND_RATE_ID,
    api.SBOND_RATE_ID,
    api.GNP_RATE_ID,
]);

export function isSimpleAsset(id) {
    return SIMPLE_ASSET_ID_SET.has(Number(id));
}

const CHART_TYPE_KEY = 'wsr.chartType';
const VALID_TYPES = ['line', 'candle', 'ohlc'];
const DEFAULT_TYPE = 'candle';
const CHANGE_EVENT = 'wsr-chart-type-changed';

export function getChartType() {
    try {
        const v = localStorage.getItem(CHART_TYPE_KEY);
        if (VALID_TYPES.includes(v)) return v;
    } catch (_) { /* localStorage may be unavailable in sandboxed contexts */ }
    return DEFAULT_TYPE;
}

export function setChartType(type) {
    if (!VALID_TYPES.includes(type)) return;
    try { localStorage.setItem(CHART_TYPE_KEY, type); } catch (_) { /* ignore */ }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: type }));
}

/** Subscribe to chart-type changes. Returns [type, setType]. */
export function useChartType() {
    const [type, setType] = useState(getChartType);
    useEffect(() => {
        const handler = (e) => setType(e.detail || getChartType());
        window.addEventListener(CHANGE_EVENT, handler);
        return () => window.removeEventListener(CHANGE_EVENT, handler);
    }, []);
    return [type, setChartType];
}
