import { DEFAULT_CAPITALIZATION_CHART_THEME } from '../../css/chart-styles.js';
import { html } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import AssetPriceChart from './AssetPriceChart.js';

function CapitalizationChart({ assetId, chartTitle }) {
    // mil is "M" (millions) for most currencies, "B" (billions) for JPY, KRW, INR, ISK
    const mil = api.useGameStore(s => s.gameState.mil) || 'M';
    const baseMultiplier = mil === 'B' ? 1e9 : 1e6;

    return html`<${AssetPriceChart}
        assetId=${assetId}
        chartTitle=${chartTitle}
        theme=${DEFAULT_CAPITALIZATION_CHART_THEME}
        baseMultiplier=${baseMultiplier}
        forceLineOnly=${true}
    />`;
}

export default CapitalizationChart;
