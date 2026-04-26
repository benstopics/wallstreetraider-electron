/**
 * Chart preferences.
 *
 * Chart TYPE (line / candle / ohlc) is shared between the small thumbnail and
 * the advanced subscreen — when the user picks one in the subscreen, every
 * thumbnail on the page updates to match.
 *
 * Persistence lives in PB (ChartType global, persisted to CFIG.WSR via
 * WriteConfig). Frontend reads gameState.chartType and writes via /set_chart_type.
 *
 * Advanced-only settings (overlays, panels) are NOT persisted here — they
 * reset per session because they don't apply to thumbnails.
 */

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

const VALID_TYPES = ['line', 'candle', 'ohlc'];
const DEFAULT_TYPE = 'candle';

// PB stores ChartType as 0=line, 1=candle, 2=ohlc — keep this map in sync with
// the CASE 4200 handler in src/main/wsr/ui.inc.
const INT_TO_TYPE = ['line', 'candle', 'ohlc'];
const TYPE_TO_INT = { line: 0, candle: 1, ohlc: 2 };

function intToType(n) {
    if (typeof n !== 'number' || n < 0 || n > 2) return DEFAULT_TYPE;
    return INT_TO_TYPE[n];
}

export function getChartType() {
    const n = api.gameStore.getState().gameState?.chartType;
    return intToType(n);
}

export function setChartType(type) {
    if (!VALID_TYPES.includes(type)) return;
    api.setChartType(TYPE_TO_INT[type]).catch(() => {});
}

/** Subscribe to chart-type changes. Returns [type, setType]. */
export function useChartType() {
    const type = api.useGameStore(s => intToType(s.gameState?.chartType));
    return [type, setChartType];
}
