export const DEFAULT_CAPITALIZATION_CHART_THEME = {
    // Bloomberg-ish: white line/text on black with subtle cyan shading
    lineColor: '#ffffff',
    shadedAreaTopColor: 'rgba(0,255,0,1)',
    shadedAreaBottomColor: '#006400',
    bullColor: '#22c55e',
    bearColor: '#ef5350',
    wickColor: '#cccccc',
}

export const DEFAULT_ASSET_PRICE_CHART_THEME = {
    background: 'rgba(0,0,0,0.95)',
    lineColor: '#ffffff',
    shadedAreaTopColor: 'rgba(0,200,255,0.22)',
    shadedAreaBottomColor: 'rgba(0,0,0,0.90)',
    bullColor: '#22c55e',
    bearColor: '#ef5350',
    wickColor: '#cccccc',
}

export const DEFAULT_ADVANCED_CHART_THEME = {
    background: 'rgba(0,0,0,0.95)',
    lineColor: '#ffffff',
    gridColor: 'rgba(255,255,255,0.10)',
    paneDividerColor: 'rgba(255,255,255,0.18)',
    // Candlestick / OHLC
    bullColor: '#22c55e',
    bearColor: '#ef5350',
    wickColor: '#cccccc',
    // Price overlays
    smaColor: '#ffeb3b',
    emaColor: '#ff9800',
    bollingerBandColor: 'rgba(160,160,160,0.70)',
    bollingerFillColor: 'rgba(160,160,160,0.07)',
    // Lower panels
    rsiLineColor: '#4fc3f7',
    rsiOverboughtColor: 'rgba(239,83,80,0.50)',
    rsiOversoldColor: 'rgba(102,187,106,0.50)',
    macdLineColor: '#29b6f6',
    macdSignalColor: '#ffa726',
    macdHistBullColor: 'rgba(34,197,94,0.75)',
    macdHistBearColor: 'rgba(239,83,80,0.75)',
    volumeUpColor: 'rgba(34,197,94,0.55)',
    volumeDownColor: 'rgba(239,83,80,0.55)',
    // Line-mode gradient fill (matches AssetPriceChart thumbnail look)
    shadedAreaTopColor: 'rgba(0,200,255,0.22)',
    shadedAreaBottomColor: 'rgba(0,0,0,0.90)',
    // Crosshair & labels
    crosshairColor: 'rgba(255,255,255,0.75)',
    warmupStripeColor: 'rgba(255,255,255,0.09)',
    warmupTextColor: 'rgba(255,255,255,0.45)',
    zeroLineColor: 'rgba(255,255,255,0.30)',
}