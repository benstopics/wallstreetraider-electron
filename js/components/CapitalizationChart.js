import { DEFAULT_CAPITALIZATION_CHART_THEME } from '../../css/chart-styles.js';
import { html } from '../lib/preact.standalone.module.js';
import AssetPriceChart from './AssetPriceChart.js';

// Data from API is in millions, so baseMultiplier = 1e6
const BASE_MULTIPLIER = 1e6;

function CapitalizationChart({ assetId, chartTitle }) {
    return html`<${AssetPriceChart}
        assetId=${assetId}
        chartTitle=${chartTitle}
        theme=${DEFAULT_CAPITALIZATION_CHART_THEME}
        baseMultiplier=${BASE_MULTIPLIER}
    />`;
}

export default CapitalizationChart;
