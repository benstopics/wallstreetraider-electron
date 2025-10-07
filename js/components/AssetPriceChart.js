import { html, useEffect, useRef, useState } from '../lib/preact.standalone.module.js';
import useInterval from '../hooks/useInterval.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { DEFAULT_ASSET_PRICE_CHART_THEME } from '../../css/chart-styles.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dateLabel(index, baseMonth, baseYear, count) {
    let monthOffset = index - (count - 1);
    let month = baseMonth + monthOffset;
    let year = baseYear;
    if (month < 0) {
        year += Math.floor((month + 1) / 12) - 1;
        month = 12 + (month % 12);
    } else if (month >= 12) {
        year += Math.floor(month / 12);
        month = month % 12;
    }
    return `${MONTHS[month % 12]} '${year.toString().slice(-2)}`;
}

const AssetPriceChart = ({
    assetId,
    yAxisTitle,
    chartTitle = undefined,
    transformValue = undefined,
    theme = DEFAULT_ASSET_PRICE_CHART_THEME
}) => {
    const canvasRef = useRef(null);
    const [chartData, setChartData] = useState(null);

    // Function to refresh chart data
    const refreshData = () => {
        let active = true;
        api.getAssetChart(assetId).then(data => {
            if (active) setChartData(data);
        }).catch(console.error);
        return () => { active = false; };
    };

    // Initial data fetch when assetId changes
    useEffect(() => {
        refreshData();
    }, [assetId]);

    // Fetch data every 5 seconds
    useInterval(refreshData, 5000);

    // Draw chart whenever data changes or on resize
    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas || !chartData) return;
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            const { prices: originalPrices, baseMonth, baseYear } = chartData;
            const { background, lineColor, gridColor, shadedAreaTopColor, shadedAreaBottomColor } = theme;

            let prices = [...originalPrices];
            if (transformValue !== undefined) {
                prices = prices.map(value => transformValue(value));
            }

            const finalYAxisTitle = typeof yAxisTitle === 'function' ? yAxisTitle(chartData) : yAxisTitle;
            const finalChartTitle = (typeof chartTitle === 'function' ? chartTitle(chartData) : chartTitle)
                // Append current price to title if not already present
                + (chartTitle && !chartTitle.toString().includes('$') ? ` (${prices[prices.length - 1].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})` : '');
            const w = canvas.width;
            const h = canvas.height;
            const padL = 20;
            const padT = chartTitle ? 40 : 20;
            const padR = yAxisTitle ? 70 : 50; // right padding for y-axis title
            const padB = 20;
            const chartW = w - padL - padR;
            const chartH = h - padT - padB;

            const minVal = Math.floor(Math.min(...prices));
            const maxVal = Math.ceil(Math.max(...prices));
            const range = maxVal - minVal || 1;
            const stepX = chartW / (prices.length - 1);

            ctx.clearRect(0, 0, w, h);

            // Background
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, w, h);

            // line and shaded area
            ctx.beginPath();
            for (let i = 0; i < prices.length; i++) {
                const x = padL + stepX * i;
                const y = padT + chartH - Math.round((prices[i] - minVal) / range * chartH);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.lineTo(padL + chartW, padT + chartH);
            ctx.lineTo(padL, padT + chartH);
            ctx.closePath();

            // Create gradient for shaded area
            if (shadedAreaTopColor && shadedAreaBottomColor) {
                const gradient = ctx.createLinearGradient(0, padT, 0, padT + chartH);
                gradient.addColorStop(0, shadedAreaTopColor); // Top color
                gradient.addColorStop(1, shadedAreaBottomColor); // Bottom color
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            if (gridColor) {
                ctx.setLineDash([2, 2]); // Set dotted line pattern
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                // horizontal grid
                for (let i = 0; i <= 4; i++) {
                    const y = padT + chartH * i / 4;
                    ctx.beginPath();
                    ctx.moveTo(padL, y);
                    ctx.lineTo(padL + chartW, y);
                    ctx.stroke();
                }
                // vertical grid
                for (let i = 0; i <= 4; i++) {
                    const x = padL + chartW * i / 4;
                    ctx.beginPath();
                    ctx.moveTo(x, padT);
                    ctx.lineTo(x, padT + chartH);
                    ctx.stroke();
                }
            }

            ctx.fillStyle = lineColor;
            ctx.font = '11px Helvetica, Arial, sans-serif';
            ctx.textAlign = 'center';
            const labelSteps = 4;
            
            // Whether to skip odd labels depending on canvas width
            const skipOddLabels = w < 200;

            for (let i = 0; i <= labelSteps; i++) {
                if (skipOddLabels && i % 2 !== 0) continue; // Skip odd labels if necessary

                const x = padL + chartW * i / labelSteps; // Align tick positions with grid logic
                const idx = Math.round((prices.length - 1) * i / labelSteps);
                const label = dateLabel(idx, baseMonth, baseYear, prices.length);
                ctx.fillText(label, x, padT + chartH + 17); // Move labels down by 5 pixels
                ctx.setLineDash([]); // Reset line dash to solid
                ctx.beginPath();
                ctx.moveTo(x, padT + chartH); // Start tick at bottom border
                ctx.lineTo(x, padT + chartH + 3); // Extend tick below
                ctx.stroke();
            }

            ctx.textAlign = 'left';
            for (let i = 0; i <= 4; i++) {
                const val = Math.round(maxVal - range * i / 4);
                const y = padT + chartH * i / 4;
                ctx.fillText(val.toFixed(2), padL + chartW + 5, y + 3);
            }
            
            // Render chart title if defined
            if (finalChartTitle) {
                ctx.textAlign = 'center';
                ctx.fillStyle = lineColor;
                ctx.font = '14px Helvetica, Arial, sans-serif';
                ctx.fillText(finalChartTitle, w / 2, 25);
            }

            // axis titles
            ctx.textAlign = 'center';
            // ctx.fillText(xAxisTitle, padL + chartW / 2, h - 5);
            if (finalYAxisTitle) {
                ctx.save();
                ctx.translate(w - 10, padT + chartH / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.fillText(finalYAxisTitle, 0, 0);
                ctx.restore();
            }
        };

        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [chartData]);

    return html`<canvas ref=${canvasRef} class="price-chart"></canvas>`;
};

export default AssetPriceChart;
