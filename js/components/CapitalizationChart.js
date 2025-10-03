import { DEFAULT_CAPITALIZATION_CHART_THEME } from '../../css/chart-styles.js';
import { html } from '../lib/preact.standalone.module.js';
import AssetPriceChart from './AssetPriceChart.js';


function CapitalizationChart({ assetId, chartTitle }) {

    const generateChartTitle = chartData => {
        const { prices } = chartData;
        const maxPrice = Math.max(...prices);
        if (maxPrice > 1e9) {
            return `${chartTitle} (Quadrillions)`;
        } else if (maxPrice > 1e6) {
            return `${chartTitle} (Trillions)`;
        } else if (maxPrice > 1e3) {
            return `${chartTitle} (Billions)`;
        } else {
            return `${chartTitle} (Millions)`;
        }
    }

    const transformValue = value => {
        if (value > 1e3) {
            return value / 1e3; // Convert to billions
        } else {
            return value; // Keep in millions
        }
    }

    return html`<${AssetPriceChart}
        assetId=${assetId}
        chartTitle=${generateChartTitle}
        transformValue=${transformValue}
        theme=${DEFAULT_CAPITALIZATION_CHART_THEME}
    />`;
}

export default CapitalizationChart;