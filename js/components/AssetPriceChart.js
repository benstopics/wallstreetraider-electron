import { html, useEffect, useRef, useState, useCallback, useMemo } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { DEFAULT_ASSET_PRICE_CHART_THEME } from '../../css/chart-styles.js';
import { insertCurrencySymbols } from './helpers.js';
import {
    DEFAULT_LAYOUT_CONFIG,
    computeLayout,
    calculatePriceRange,
    dataIndexToX,
    priceToY,
    xToDataIndex,
    isPointInChartArea,
    dateLabel,
    determineSuffixForRange,
    formatWithSuffix,
    formatPriceWithSuffix,
    generateLinePoints,
    generateGridLines,
    calculateYAxisValues,
    calculateXAxisIndices,
} from './assetPriceChartUtils.js';

// Special security IDs (commodities, rates, crypto) that are in allSecurities
const SECURITY_IDS = [
    api.STOCK_INDEX_ID,
    api.OIL_ID,        // 6
    api.GOLD_ID,       // 7
    api.SILVER_ID,     // 8
    api.WHEAT_ID,      // 9
    api.CORN_ID,       // 10
    api.PRIME_RATE_ID, // 1601
    api.TBOND_RATE_ID, // 1602
    api.SBOND_RATE_ID, // 1603
    api.GNP_RATE_ID,   // 1604
    api.BITCOIN_ID,    // 1605
    api.ETHEREUM_ID,   // 1606
];

// ============================================================================
// Drawing Functions - Pure rendering to canvas context
// ============================================================================

/**
 * Draw chart background
 */
function drawBackground(ctx, w, h, theme) {
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, w, h);
}

/**
 * Draw grid lines
 */
function drawGrid(ctx, layout, theme, config) {
    if (!theme.gridColor) return;

    const { horizontal, vertical } = generateGridLines(layout, config.grid.divisions);

    ctx.setLineDash(config.grid.dashPattern);
    ctx.strokeStyle = theme.gridColor;
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (const y of horizontal) {
        ctx.beginPath();
        ctx.moveTo(layout.padL, y);
        ctx.lineTo(layout.chartRight, y);
        ctx.stroke();
    }

    // Vertical grid lines
    for (const x of vertical) {
        ctx.beginPath();
        ctx.moveTo(x, layout.padT);
        ctx.lineTo(x, layout.chartBottom);
        ctx.stroke();
    }

    ctx.setLineDash([]);
}

/**
 * Draw the price line and shaded area beneath it
 */
function drawLineAndArea(ctx, prices, layout, priceRange, theme) {
    const points = generateLinePoints(prices, priceRange, layout);
    if (points.length === 0) return;

    ctx.beginPath();

    if (points.length === 1) {
        // Single data point - draw horizontal line across chart
        ctx.moveTo(layout.padL, points[0].y);
        ctx.lineTo(layout.chartRight, points[0].y);
    } else {
        // Multiple points - draw connected line
        for (let i = 0; i < points.length; i++) {
            if (i === 0) ctx.moveTo(points[i].x, points[i].y);
            else ctx.lineTo(points[i].x, points[i].y);
        }
    }

    // Close path to create filled area
    ctx.lineTo(layout.chartRight, layout.chartBottom);
    ctx.lineTo(layout.padL, layout.chartBottom);
    ctx.closePath();

    // Fill shaded area with gradient
    if (theme.shadedAreaTopColor && theme.shadedAreaBottomColor) {
        const gradient = ctx.createLinearGradient(0, layout.padT, 0, layout.chartBottom);
        gradient.addColorStop(0, theme.shadedAreaTopColor);
        gradient.addColorStop(1, theme.shadedAreaBottomColor);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // Stroke the line
    ctx.strokeStyle = theme.lineColor;
    ctx.lineWidth = 1;
    ctx.stroke();
}

/**
 * Draw Y-axis labels (price values)
 */
function drawYAxisLabels(ctx, layout, priceRange, suffixInfo, theme, config, baseMultiplier = 1) {
    const values = calculateYAxisValues(priceRange, config.grid.divisions);

    ctx.fillStyle = theme.lineColor;
    ctx.font = config.labels.font;
    ctx.textAlign = 'left';

    for (let i = 0; i < values.length; i++) {
        const y = layout.padT + layout.chartH * i / config.grid.divisions;
        const label = formatWithSuffix(values[i], suffixInfo.suffix, suffixInfo.divisor, baseMultiplier);
        ctx.fillText(label, layout.chartRight + config.labels.yAxisOffset, y + 3);
    }
}

/**
 * Draw X-axis labels (date labels) and tick marks
 * Shows full year under January, just month abbreviation otherwise
 */
function drawXAxisLabels(ctx, layout, chartData, prices, config) {
    const indices = calculateXAxisIndices(prices.length, config.grid.divisions);
    const skipOddLabels = layout.canvasWidth < config.responsive.skipOddLabelsWidth;

    ctx.font = config.labels.font;
    ctx.textAlign = 'center';

    for (let i = 0; i < indices.length; i++) {
        if (skipOddLabels && i % 2 !== 0) continue;

        const x = layout.padL + layout.chartW * i / config.grid.divisions;
        const idx = indices[i];
        const label = dateLabel(idx, chartData.baseMonth, chartData.baseYear, prices.length);

        // Draw label - year for January, month abbreviation otherwise
        ctx.fillText(label.axisLabel, x, layout.chartBottom + config.labels.xAxisOffset);

        // Draw tick mark
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x, layout.chartBottom);
        ctx.lineTo(x, layout.chartBottom + config.labels.tickLength);
        ctx.stroke();
    }
}

/**
 * Draw chart title
 */
function drawTitle(ctx, w, title, theme, config) {
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.lineColor;
    ctx.font = config.labels.titleFont;
    ctx.fillText(title, w / 2, config.labels.titleY);
}

/**
 * Draw Y-axis title (rotated)
 */
function drawYAxisTitle(ctx, layout, title, theme) {
    ctx.save();
    ctx.translate(layout.canvasWidth - 10, layout.padT + layout.chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.lineColor;
    ctx.fillText(title, 0, 0);
    ctx.restore();
}

/**
 * Draw crosshair at hover position
 */
function drawCrosshair(ctx, hoverX, hoverY, layout, theme) {
    ctx.strokeStyle = theme.lineColor;
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(hoverX, layout.padT);
    ctx.lineTo(hoverX, layout.chartBottom);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(layout.padL, hoverY);
    ctx.lineTo(layout.chartRight, hoverY);
    ctx.stroke();

    ctx.setLineDash([]);

    // Data point marker
    ctx.fillStyle = theme.lineColor;
    ctx.beginPath();
    ctx.arc(hoverX, hoverY, 4, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================================================
// Main Component
// ============================================================================

const AssetPriceChart = ({
    assetId,
    yAxisTitle,
    chartTitle = undefined,
    transformValue = undefined,
    theme = DEFAULT_ASSET_PRICE_CHART_THEME,
    layoutConfig = DEFAULT_LAYOUT_CONFIG,
    baseMultiplier = 1,  // Multiplier for base unit (e.g., 1e6 if data is in millions)
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [chartData, setChartData] = useState(null);
    const [mouseState, setMouseState] = useState({
        isHovering: false,
        canvasX: 0,
        canvasY: 0,
        dataIndex: null,
        price: null,
        dateInfo: null,
    });

    // Get current price from allSecurities (for special IDs) or allCompanies (for regular companies)
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

    // Function to refresh chart data
    const refreshData = useCallback(() => {
        let active = true;
        api.getAssetChart(assetId).then(data => {
            if (active) setChartData(data);
        }).catch(console.error);
        return () => { active = false; };
    }, [assetId]);

    // Refresh chart data when price changes
    useEffect(() => {
        if (currentPrice !== null) {
            refreshData();
        }
    }, [assetId, currentPrice]);

    // Memoize transformed prices
    const prices = useMemo(() => {
        if (!chartData?.prices) return [];
        let p = [...chartData.prices];
        if (transformValue) p = p.map(transformValue);
        return p;
    }, [chartData, transformValue]);

    // Mouse move handler
    const handleMouseMove = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas || !chartData || prices.length === 0) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;

        const layout = computeLayout(canvas.width, canvas.height, layoutConfig, {
            hasChartTitle: !!chartTitle,
            hasYAxisTitle: !!yAxisTitle,
        });

        if (!isPointInChartArea(canvasX, canvasY, layout)) {
            setMouseState(prev => ({ ...prev, isHovering: false }));
            return;
        }

        const dataIndex = xToDataIndex(canvasX, prices.length, layout);
        const price = prices[dataIndex];
        const dateInfo = dateLabel(dataIndex, chartData.baseMonth, chartData.baseYear, prices.length);

        setMouseState({
            isHovering: true,
            canvasX,
            canvasY,
            dataIndex,
            price,
            dateInfo,
        });
    }, [chartData, prices, chartTitle, yAxisTitle, layoutConfig]);

    // Mouse leave handler
    const handleMouseLeave = useCallback(() => {
        setMouseState(prev => ({ ...prev, isHovering: false }));
    }, []);

    // Draw chart whenever data or mouse state changes
    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas || !chartData) return;

            const ctx = canvas.getContext('2d');
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            // Skip drawing if canvas has no size
            if (canvas.width <= 0 || canvas.height <= 0) return;

            // Skip if no price data
            if (prices.length === 0) return;

            const w = canvas.width;
            const h = canvas.height;

            // Compute layout and price metrics
            const layout = computeLayout(w, h, layoutConfig, {
                hasChartTitle: !!chartTitle,
                hasYAxisTitle: !!yAxisTitle,
            });
            const priceRange = calculatePriceRange(prices);
            const suffixInfo = determineSuffixForRange(priceRange.maxVal, baseMultiplier);

            // Prepare titles
            const finalYAxisTitle = insertCurrencySymbols(
                typeof yAxisTitle === 'function' ? yAxisTitle(chartData) : yAxisTitle
            );
            let finalChartTitle = insertCurrencySymbols(
                typeof chartTitle === 'function' ? chartTitle(chartData) : chartTitle
            );
            // Append current price to title using the same suffix as Y-axis labels
            if (chartTitle && !chartTitle.toString().includes('$')) {
                finalChartTitle += ` (${formatWithSuffix(prices[prices.length - 1], suffixInfo.suffix, suffixInfo.divisor, baseMultiplier)})`;
            }

            // Clear and draw
            ctx.clearRect(0, 0, w, h);
            drawBackground(ctx, w, h, theme);
            drawGrid(ctx, layout, theme, layoutConfig);
            drawLineAndArea(ctx, prices, layout, priceRange, theme);

            // Draw axes
            ctx.fillStyle = theme.lineColor;
            ctx.font = layoutConfig.labels.font;
            drawYAxisLabels(ctx, layout, priceRange, suffixInfo, theme, layoutConfig, baseMultiplier);
            drawXAxisLabels(ctx, layout, chartData, prices, layoutConfig);

            // Draw titles
            if (finalChartTitle) {
                drawTitle(ctx, w, finalChartTitle, theme, layoutConfig);
            }
            if (finalYAxisTitle) {
                drawYAxisTitle(ctx, layout, finalYAxisTitle, theme);
            }

            // Draw crosshair when hovering
            if (mouseState.isHovering && mouseState.dataIndex !== null) {
                const hoverX = dataIndexToX(mouseState.dataIndex, prices.length, layout);
                const hoverY = priceToY(mouseState.price, priceRange, layout);
                drawCrosshair(ctx, hoverX, hoverY, layout, theme);
            }
        };

        draw();
        const ro = new ResizeObserver(draw);
        if (canvasRef.current) ro.observe(canvasRef.current);
        return () => ro.disconnect();
    }, [chartData, prices, mouseState, theme, layoutConfig, chartTitle, yAxisTitle]);

    // Calculate tooltip position relative to container
    const tooltipStyle = useMemo(() => {
        if (!mouseState.isHovering || mouseState.dataIndex === null || !canvasRef.current) {
            return { display: 'none' };
        }

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Convert canvas coordinates back to DOM coordinates
        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;

        const layout = computeLayout(canvas.width, canvas.height, layoutConfig, {
            hasChartTitle: !!chartTitle,
            hasYAxisTitle: !!yAxisTitle,
        });
        const priceRange = calculatePriceRange(prices);

        const hoverX = dataIndexToX(mouseState.dataIndex, prices.length, layout);
        const hoverY = priceToY(mouseState.price, priceRange, layout);

        // Convert to DOM coordinates
        const domX = hoverX * scaleX;
        const domY = hoverY * scaleY;

        // Position tooltip above the point, centered horizontally
        const tooltipWidth = 80;
        const tooltipHeight = 40;
        let left = domX;
        let top = domY - tooltipHeight - 10;

        // Keep within bounds
        if (left - tooltipWidth / 2 < 5) left = tooltipWidth / 2 + 5;
        if (left + tooltipWidth / 2 > rect.width - 5) left = rect.width - tooltipWidth / 2 - 5;
        if (top < 5) top = domY + 15;

        return {
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            transform: 'translate(-50%, 0)',
            pointerEvents: 'none',
            zIndex: 10,
        };
    }, [mouseState, prices, layoutConfig, chartTitle, yAxisTitle]);

    return html`
        <div ref=${containerRef} class="relative w-full h-full">
            <canvas
                ref=${canvasRef}
                class="price-chart w-full h-full"
                onMouseMove=${handleMouseMove}
                onMouseLeave=${handleMouseLeave}
            />
            ${mouseState.isHovering && mouseState.dataIndex !== null && html`
                <div
                    class="bg-black/90 border border-white/30 rounded px-2 py-1 text-white text-xs"
                    style=${tooltipStyle}
                >
                    <div class="font-bold text-center">${mouseState.dateInfo?.tooltipLabel}</div>
                    <div class="text-center">${formatPriceWithSuffix(mouseState.price, baseMultiplier)}</div>
                </div>
            `}
        </div>
    `;
};

export default AssetPriceChart;
