import { html, useState } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import { MiniSpark } from './StockTicker.js';
import { formatCurrency } from './helpers.js';
import AdvancedChartModal from './AdvancedChartModal.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';

const RATE_IDS = new Set([api.PRIME_RATE_ID, api.TBOND_RATE_ID, api.SBOND_RATE_ID, api.GNP_RATE_ID]);

function formatTilePrice(assetId, price, dlrSign, euro) {
    if (price == null || !Number.isFinite(price)) return '—';
    const id = Number(assetId);
    if (RATE_IDS.has(id)) return price.toFixed(2) + '%';
    if (id === api.STOCK_INDEX_ID) return Math.round(price).toLocaleString();
    return (dlrSign || '$') + formatCurrency(price) + (euro || '');
}

function SparkTile({ assetId, label, onClick }) {
    const security = api.useGameStore(s => s.gameState.allSecurities?.find(sec => sec.id == assetId));
    const dlrSign = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro = api.useGameStore(s => s.gameState.euro) || '';

    const price = security?.price ?? null;
    const oldPrice = security?.oldPrice ?? null;
    const haveChange = price != null && oldPrice != null && Number.isFinite(oldPrice) && oldPrice !== 0;
    const change = haveChange ? (price - oldPrice) : 0;
    const pctChange = haveChange ? ((price - oldPrice) / Math.abs(oldPrice) * 100) : 0;
    const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '';
    const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';

    return html`
        <div class="spark-tile" onClick=${onClick} data-testid="spark-tile-${assetId}">
            <div class="spark-tile-label">${label}</div>
            <div class="spark-tile-right">
                <div class="spark-tile-price">${formatTilePrice(assetId, price, dlrSign, euro)}</div>
                <div class=${'spark-tile-change ' + changeClass}>
                    ${arrow}${Math.abs(pctChange).toFixed(1)}%
                </div>
                <${MiniSpark}
                    assetId=${assetId}
                    isUp=${change >= 0}
                    width=${56}
                    height=${18}
                    strokeWidth=${1.25}
                    className="spark-tile-spark"
                />
            </div>
        </div>
    `;
}

const GROUPS = [
    {
        title: 'Commodities & Indexes',
        tiles: [
            { id: api.STOCK_INDEX_ID, label: 'Stock Index' },
            { id: api.OIL_ID, label: 'Oil' },
            { id: api.GOLD_ID, label: 'Gold' },
            { id: api.SILVER_ID, label: 'Silver' },
            { id: api.CORN_ID, label: 'Corn' },
            { id: api.WHEAT_ID, label: 'Wheat' },
        ],
    },
    {
        title: 'Crypto',
        tiles: [
            { id: api.BITCOIN_ID, label: 'Bitcoin' },
            { id: api.ETHEREUM_ID, label: 'Ethereum' },
        ],
    },
    {
        title: 'Macroeconomic',
        tiles: [
            { id: api.GNP_RATE_ID, label: 'GDP' },
            { id: api.TBOND_RATE_ID, label: 'Long Bond' },
            { id: api.PRIME_RATE_ID, label: 'Prime Rate' },
            { id: api.SBOND_RATE_ID, label: 'Short Bond' },
        ],
    },
];

function actionButtonsForAsset(hook, assetId) {
    if (assetId === api.GNP_RATE_ID) return [];
    if (assetId === api.PRIME_RATE_ID) return [hook.createSwapForRate(api.PRIME_RATE_ID)];
    if (assetId === api.TBOND_RATE_ID) return [
        { ...hook.buyLongGovtBonds, label: 'Buy' },
        hook.createSwapForRate(api.TBOND_RATE_ID),
    ];
    if (assetId === api.SBOND_RATE_ID) return [
        { ...hook.buyShortGovtBonds, label: 'Buy' },
        { ...hook.tradeTbills, label: 'T-Bills' },
        hook.createSwapForRate(api.SBOND_RATE_ID),
    ];
    const btns = [];
    if (assetId !== api.STOCK_INDEX_ID) btns.push(hook.buyPhysical(assetId));
    btns.push(hook.buyFutures(assetId));
    if (assetId !== api.BITCOIN_ID && assetId !== api.ETHEREUM_ID) btns.push(hook.shortFutures(assetId));
    return btns;
}

export default function MarketSparklineGrid() {
    const [expanded, setExpanded] = useState(null);
    const hook = useActionButtonProps();

    return html`
        <div class="panel market-indicators-panel" data-testid="market-sparkline-grid">
            <div class="panel-header">Market Indicators</div>
            <div class="panel-body market-indicators-panel-body">
                <div class="market-sparkline-grid">
                    ${GROUPS.map(group => html`
                        <div class="spark-group-header">${group.title}</div>
                        <div class="spark-group-grid">
                            ${group.tiles.map(t => html`
                                <${SparkTile}
                                    key=${t.id}
                                    assetId=${t.id}
                                    label=${t.label}
                                    onClick=${() => setExpanded({ assetId: t.id, title: t.label })}
                                />
                            `)}
                        </div>
                    `)}
                </div>
            </div>
            ${expanded && html`
                <${AdvancedChartModal}
                    assetId=${expanded.assetId}
                    chartTitle=${expanded.title}
                    actionButtons=${actionButtonsForAsset(hook, expanded.assetId)}
                    onClose=${() => setExpanded(null)}
                />
            `}
        </div>
    `;
}
