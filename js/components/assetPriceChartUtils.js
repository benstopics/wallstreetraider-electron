/**
 * Pure utility functions for AssetPriceChart
 * All functions are side-effect free and can be unit tested independently
 */

// Month names for date labels
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Default layout configuration for AssetPriceChart
 * All distances in pixels (applied to canvas dimensions)
 */
export const DEFAULT_LAYOUT_CONFIG = {
    padding: {
        left: 20,
        right: 60,           // Base right padding (room for Y-axis labels)
        rightWithTitle: 80,  // When yAxisTitle is present
        top: 20,
        topWithTitle: 40,    // When chartTitle is present
        bottom: 20,
    },
    grid: {
        divisions: 4,        // Number of grid divisions (both axes)
        dashPattern: [2, 2], // Dotted line pattern
    },
    labels: {
        font: '11px Helvetica, Arial, sans-serif',
        titleFont: '14px Helvetica, Arial, sans-serif',
        yAxisOffset: 5,      // Horizontal offset from chart edge
        xAxisOffset: 17,     // Vertical offset from chart bottom
        tickLength: 3,       // Tick mark length
        titleY: 25,          // Y position for chart title
    },
    axisTitle: {
        yAxisRightMargin: 10, // Distance from right edge
    },
    responsive: {
        skipOddLabelsWidth: 200, // Width threshold for skipping odd labels
    },
};

/**
 * Compute actual layout dimensions from canvas size and config
 * @param {number} canvasWidth - Canvas width in pixels
 * @param {number} canvasHeight - Canvas height in pixels
 * @param {Object} config - Layout configuration object
 * @param {Object} options - { hasChartTitle, hasYAxisTitle }
 * @returns {Object} Layout object with all computed dimensions
 */
export function computeLayout(canvasWidth, canvasHeight, config, options = {}) {
    const { hasChartTitle = false, hasYAxisTitle = false } = options;

    const padL = config.padding.left;
    const padR = hasYAxisTitle ? config.padding.rightWithTitle : config.padding.right;
    const padT = hasChartTitle ? config.padding.topWithTitle : config.padding.top;
    const padB = config.padding.bottom;

    const chartW = canvasWidth - padL - padR;
    const chartH = canvasHeight - padT - padB;

    return {
        canvasWidth,
        canvasHeight,
        padL,
        padR,
        padT,
        padB,
        chartW,
        chartH,
        chartLeft: padL,
        chartTop: padT,
        chartRight: padL + chartW,
        chartBottom: padT + chartH,
    };
}

/**
 * Calculate price range from data array
 * @param {number[]} prices - Array of price values
 * @returns {{ minVal: number, maxVal: number, range: number }}
 */
export function calculatePriceRange(prices) {
    if (!prices || prices.length === 0) {
        return { minVal: 0, maxVal: 1, range: 1 };
    }
    const minVal = Math.floor(Math.min(...prices));
    const maxVal = Math.ceil(Math.max(...prices));
    const range = maxVal - minVal || 1;
    return { minVal, maxVal, range };
}

/**
 * Calculate X step size for data points
 * @param {number} dataLength - Number of data points
 * @param {Object} layout - Layout object from computeLayout()
 * @returns {number} X step size in pixels
 */
export function calculateStepX(dataLength, layout) {
    return dataLength > 1 ? layout.chartW / (dataLength - 1) : layout.chartW;
}

/**
 * Map data index to X coordinate on canvas
 * @param {number} index - Data point index
 * @param {number} dataLength - Total number of data points
 * @param {Object} layout - Layout object from computeLayout()
 * @returns {number} X coordinate in pixels
 */
export function dataIndexToX(index, dataLength, layout) {
    const stepX = calculateStepX(dataLength, layout);
    return layout.padL + stepX * index;
}

/**
 * Map price value to Y coordinate on canvas
 * @param {number} price - Price value
 * @param {Object} priceRange - { minVal, maxVal, range } from calculatePriceRange()
 * @param {Object} layout - Layout object from computeLayout()
 * @returns {number} Y coordinate in pixels
 */
export function priceToY(price, priceRange, layout) {
    const { minVal, range } = priceRange;
    return layout.padT + layout.chartH - Math.round((price - minVal) / range * layout.chartH);
}

/**
 * Map X coordinate back to data index (for mouse interaction)
 * @param {number} x - X coordinate in pixels
 * @param {number} dataLength - Total number of data points
 * @param {Object} layout - Layout object from computeLayout()
 * @returns {number} Nearest data index (clamped to valid range)
 */
export function xToDataIndex(x, dataLength, layout) {
    if (dataLength <= 1) return 0;
    const stepX = layout.chartW / (dataLength - 1);
    const relativeX = x - layout.padL;
    const index = Math.round(relativeX / stepX);
    return Math.max(0, Math.min(dataLength - 1, index));
}

/**
 * Map Y coordinate back to price value (for mouse interaction)
 * @param {number} y - Y coordinate in pixels
 * @param {Object} priceRange - { minVal, maxVal, range } from calculatePriceRange()
 * @param {Object} layout - Layout object from computeLayout()
 * @returns {number} Price value at Y coordinate
 */
export function yToPrice(y, priceRange, layout) {
    const { minVal, range } = priceRange;
    const relativeY = layout.chartH - (y - layout.padT);
    return minVal + (relativeY / layout.chartH) * range;
}

/**
 * Check if point is within chart area
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Object} layout - Layout object from computeLayout()
 * @returns {boolean}
 */
export function isPointInChartArea(x, y, layout) {
    return x >= layout.chartLeft &&
           x <= layout.chartRight &&
           y >= layout.chartTop &&
           y <= layout.chartBottom;
}

/**
 * Generate date label for chart
 * @param {number} index - Data point index
 * @param {number} baseMonth - Base month (0-11)
 * @param {number} baseYear - Base year (full year)
 * @param {number} count - Total number of data points
 * @returns {{ monthName: string, year: number, monthIndex: number, isJanuary: boolean, axisLabel: string, tooltipLabel: string }}
 */
export function dateLabel(index, baseMonth, baseYear, count) {
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
    const monthIndex = month % 12;
    const monthName = MONTHS[monthIndex];
    const isJanuary = monthIndex === 0;

    return {
        monthName,
        year,
        monthIndex,
        isJanuary,
        // For X-axis: show year under January, just month otherwise
        axisLabel: isJanuary ? year.toString() : monthName,
        // For tooltip: always show full "Mon 'YY" format
        tooltipLabel: `${monthName} '${year.toString().slice(-2)}`,
        // Legacy field for backwards compatibility
        shortLabel: `${monthName} '${year.toString().slice(-2)}`
    };
}

/**
 * Suffix definitions for price formatting
 * Order matters: check from largest to smallest
 * Thresholds use 1.5x to avoid switching too early (e.g., stay in "B" until 1500B = 1.5T)
 */
const PRICE_SUFFIXES = [
    { threshold: 1.5e15, suffix: 'Q', divisor: 1e15 },  // Quadrillion (at 1500T+)
    { threshold: 1.5e12, suffix: 'T', divisor: 1e12 },  // Trillion (at 1500B+)
    { threshold: 1.5e9,  suffix: 'B', divisor: 1e9 },   // Billion (at 1500M+)
    { threshold: 1.5e6,  suffix: 'M', divisor: 1e6 },   // Million (at 1500k+)
    { threshold: 1.5e3,  suffix: 'k', divisor: 1e3 },   // Thousand (at 1500+)
    { threshold: 0,      suffix: '',  divisor: 1 },      // No suffix
];

/**
 * Format price with smart suffix (always 2 decimal places before suffix)
 * Outputs: 1.00, 100.00, 1.00k, 10.00k, 100.00k, 1.00M, 1.00B, 1.00T, 1.00Q
 *
 * @param {number} value - Price value to format
 * @param {number} baseMultiplier - Multiplier for the base unit (e.g., 1e6 if data is in millions)
 * @returns {string} Formatted string
 */
export function formatPriceWithSuffix(value, baseMultiplier = 1) {
    const actualValue = value * baseMultiplier;
    const absValue = Math.abs(actualValue);
    const sign = actualValue < 0 ? '-' : '';

    for (const { threshold, suffix, divisor } of PRICE_SUFFIXES) {
        if (absValue >= threshold) {
            const scaled = absValue / divisor;
            return `${sign}${scaled.toFixed(2)}${suffix}`;
        }
    }

    return `${sign}${absValue.toFixed(2)}`;
}

/**
 * Determine the best suffix for a range of values (for Y-axis consistency)
 * All labels on the Y-axis should use the same suffix for readability
 *
 * @param {number} maxValue - Maximum value in the range
 * @param {number} baseMultiplier - Multiplier for the base unit (e.g., 1e6 if data is in millions)
 * @returns {{ suffix: string, divisor: number }}
 */
export function determineSuffixForRange(maxValue, baseMultiplier = 1) {
    const absMax = Math.abs(maxValue * baseMultiplier);

    if (absMax >= 1.5e15) return { suffix: 'Q', divisor: 1e15 };
    if (absMax >= 1.5e12) return { suffix: 'T', divisor: 1e12 };
    if (absMax >= 1.5e9)  return { suffix: 'B', divisor: 1e9 };
    if (absMax >= 1.5e6)  return { suffix: 'M', divisor: 1e6 };
    if (absMax >= 1.5e3)  return { suffix: 'k', divisor: 1e3 };
    return { suffix: '', divisor: 1 };
}

/**
 * Format a value using a pre-determined suffix (for axis label consistency)
 *
 * @param {number} value - Value to format
 * @param {string} suffix - Suffix to use (e.g., 'M', 'B')
 * @param {number} divisor - Divisor for the suffix
 * @param {number} baseMultiplier - Multiplier for the base unit (e.g., 1e6 if data is in millions)
 * @returns {string}
 */
export function formatWithSuffix(value, suffix, divisor, baseMultiplier = 1) {
    const actualValue = value * baseMultiplier;
    const sign = actualValue < 0 ? '-' : '';
    const scaled = Math.abs(actualValue) / divisor;
    return `${sign}${scaled.toFixed(2)}${suffix}`;
}

/**
 * Calculate tooltip position to keep it within viewport
 * @param {number} x - Target X coordinate
 * @param {number} y - Target Y coordinate
 * @param {number} tooltipWidth - Estimated tooltip width
 * @param {number} tooltipHeight - Estimated tooltip height
 * @param {Object} bounds - { width, height } of container
 * @returns {{ x: number, y: number }}
 */
export function calculateTooltipPosition(x, y, tooltipWidth, tooltipHeight, bounds) {
    let posX = x;
    let posY = y - tooltipHeight - 10; // Default: above cursor

    // Keep within horizontal bounds
    if (posX - tooltipWidth / 2 < 10) {
        posX = tooltipWidth / 2 + 10;
    }
    if (posX + tooltipWidth / 2 > bounds.width - 10) {
        posX = bounds.width - tooltipWidth / 2 - 10;
    }

    // If tooltip would go above canvas, show below cursor
    if (posY < 10) {
        posY = y + 20;
    }

    return { x: posX, y: posY };
}

/**
 * Generate chart line path points
 * @param {number[]} prices - Array of price values
 * @param {Object} priceRange - { minVal, maxVal, range }
 * @param {Object} layout - Layout object from computeLayout()
 * @returns {Array<{x: number, y: number}>} Array of coordinate points
 */
export function generateLinePoints(prices, priceRange, layout) {
    if (!prices || prices.length === 0) return [];

    const points = [];
    const stepX = calculateStepX(prices.length, layout);

    for (let i = 0; i < prices.length; i++) {
        const x = layout.padL + stepX * i;
        const y = priceToY(prices[i], priceRange, layout);
        points.push({ x, y });
    }

    return points;
}

/**
 * Generate grid line positions
 * @param {Object} layout - Layout object from computeLayout()
 * @param {number} divisions - Number of divisions
 * @returns {{ horizontal: number[], vertical: number[] }}
 */
export function generateGridLines(layout, divisions) {
    const horizontal = [];
    const vertical = [];

    for (let i = 0; i <= divisions; i++) {
        horizontal.push(layout.padT + layout.chartH * i / divisions);
        vertical.push(layout.padL + layout.chartW * i / divisions);
    }

    return { horizontal, vertical };
}

/**
 * Calculate Y-axis label values
 * @param {Object} priceRange - { minVal, maxVal, range }
 * @param {number} divisions - Number of divisions
 * @returns {number[]} Array of label values from top to bottom
 */
export function calculateYAxisValues(priceRange, divisions) {
    const values = [];
    for (let i = 0; i <= divisions; i++) {
        values.push(Math.round(priceRange.maxVal - priceRange.range * i / divisions));
    }
    return values;
}

/**
 * Calculate X-axis label indices
 * @param {number} dataLength - Number of data points
 * @param {number} divisions - Number of divisions
 * @returns {number[]} Array of data indices for labels
 */
export function calculateXAxisIndices(dataLength, divisions) {
    const indices = [];
    for (let i = 0; i <= divisions; i++) {
        indices.push(Math.round((dataLength - 1) * i / divisions));
    }
    return indices;
}
