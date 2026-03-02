import { html, useState, useEffect, useMemo } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import Modal from './Modal.js';
import Button from './Button.js';

/**
 * Price Alert Modal — create, view, and delete price/rate alerts.
 * Alerts are stored in customData.priceAlerts and checked every poll cycle.
 */
export default function PriceAlertModal({ show, onClose }) {
    const [view, setView] = useState('list'); // 'list' | 'create'

    // Create form state
    const [entityType, setEntityType] = useState('stock');
    const [entityId, setEntityId] = useState('');
    const [condition, setCondition] = useState('above');
    const [targetPrice, setTargetPrice] = useState('');

    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];
    const allSecurities = api.useGameStore(s => s.gameState.allSecurities) || [];
    const alerts = api.useGameStore(s => s.gameState.customData?.priceAlerts) || [];

    const securityOptions = useMemo(() => [
        { id: api.STOCK_INDEX_ID, name: 'Stock Market Index' },
        { id: api.OIL_ID, name: 'Oil' },
        { id: api.GOLD_ID, name: 'Gold' },
        { id: api.SILVER_ID, name: 'Silver' },
        { id: api.WHEAT_ID, name: 'Wheat' },
        { id: api.CORN_ID, name: 'Corn' },
        { id: api.PRIME_RATE_ID, name: 'Prime Rate' },
        { id: api.TBOND_RATE_ID, name: 'T-Bond Rate' },
        { id: api.SBOND_RATE_ID, name: 'S-Bond Rate' },
        { id: api.GNP_RATE_ID, name: 'GDP Growth Rate' },
        { id: api.BITCOIN_ID, name: 'Bitcoin' },
        { id: api.ETHEREUM_ID, name: 'Ethereum' },
    ], []);

    // Get current price for display
    const getCurrentPrice = (type, id) => {
        const numId = Number(id);
        if (type === 'stock') {
            const co = allCompanies.find(c => c.id === numId);
            return co?.price ?? null;
        }
        const sec = allSecurities.find(s => s.id === numId);
        return sec?.price ?? null;
    };

    const activeCompanies = useMemo(() =>
        allCompanies.filter(c => c.status === 1).sort((a, b) => a.name.localeCompare(b.name)),
        [allCompanies]
    );

    const handleCreate = () => {
        const numId = Number(entityId);
        if (!entityId || isNaN(numId) || !targetPrice || isNaN(Number(targetPrice))) return;

        let entityName;
        if (entityType === 'stock') {
            const co = allCompanies.find(c => c.id === numId);
            entityName = co ? `${co.symbol} (${co.name})` : `Entity #${numId}`;
        } else {
            const sec = securityOptions.find(s => s.id === numId);
            entityName = sec?.name || `Security #${numId}`;
        }

        const currentPrice = getCurrentPrice(entityType, numId);

        const newAlert = {
            id: Date.now() + Math.random(),
            entityId: numId,
            entityType,
            entityName,
            condition,
            targetPrice: Number(targetPrice),
            priceAtCreation: currentPrice,
            createdAt: Date.now(),
            triggered: false,
        };

        const updated = [...alerts, newAlert];
        api.setCustomData({ priceAlerts: updated });
        setView('list');
        setEntityId('');
        setTargetPrice('');
    };

    const handleDelete = (alertId) => {
        const updated = alerts.filter(a => a.id !== alertId);
        api.setCustomData({ priceAlerts: updated });
    };

    const handleClearTriggered = () => {
        const updated = alerts.filter(a => !a.triggered);
        api.setCustomData({ priceAlerts: updated });
    };

    if (!show) return null;

    const triggeredCount = alerts.filter(a => a.triggered).length;
    const activeCount = alerts.filter(a => !a.triggered).length;

    return html`<${Modal} show=${true} onClose=${onClose} style="--modal-w: 560px; --modal-h: auto;">
        <div style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 16px;">Price Alerts</h3>
                <div style="display: flex; gap: 8px; align-items: center;">
                    ${view === 'list' ? html`
                        <${Button} class="btn btn-sm text-xs px-3 py-1" data-testid="btn-create-alert" onClick=${() => setView('create')}>New Alert<//>
                        ${triggeredCount > 0 ? html`
                            <${Button} class="btn btn-sm text-xs px-3 py-1" onClick=${handleClearTriggered}>Clear Triggered (${triggeredCount})<//>
                        ` : ''}
                    ` : html`
                        <${Button} class="btn btn-sm text-xs px-3 py-1" onClick=${() => setView('list')}>Back to List<//>
                    `}
                    <button onClick=${onClose} style="background: none; border: none; color: #888; cursor: pointer; font-size: 18px; padding: 0 4px; line-height: 1;" title="Close">x</button>
                </div>
            </div>

            ${view === 'create' ? html`
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <label style="width: 80px;">Type:</label>
                        <select data-testid="alert-entity-type" value=${entityType} onChange=${e => { setEntityType(e.target.value); setEntityId(''); }}
                            style="flex: 1; background: #1a1a2e; color: #e0e0e0; border: 1px solid #333; padding: 4px 8px; border-radius: 4px;">
                            <option value="stock">Stock</option>
                            <option value="security">Commodity / Rate / Crypto</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <label style="width: 80px;">Asset:</label>
                        ${entityType === 'stock' ? html`
                            <select data-testid="alert-entity-id" value=${entityId} onChange=${e => setEntityId(e.target.value)}
                                style="flex: 1; background: #1a1a2e; color: #e0e0e0; border: 1px solid #333; padding: 4px 8px; border-radius: 4px;">
                                <option value="">-- Select Company --</option>
                                ${activeCompanies.map(c => html`<option value=${c.id}>${c.symbol} - ${c.name}</option>`)}
                            </select>
                        ` : html`
                            <select data-testid="alert-entity-id" value=${entityId} onChange=${e => setEntityId(e.target.value)}
                                style="flex: 1; background: #1a1a2e; color: #e0e0e0; border: 1px solid #333; padding: 4px 8px; border-radius: 4px;">
                                <option value="">-- Select Asset --</option>
                                ${securityOptions.map(s => html`<option value=${s.id}>${s.name}</option>`)}
                            </select>
                        `}
                    </div>
                    ${entityId ? html`
                        <div style="display: flex; gap: 8px; align-items: center; color: #888; font-size: 12px;">
                            <span style="width: 80px;"></span>
                            <span>Current: ${getCurrentPrice(entityType, entityId)?.toFixed(2) ?? 'N/A'}</span>
                        </div>
                    ` : ''}
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <label style="width: 80px;">When:</label>
                        <select data-testid="alert-condition" value=${condition} onChange=${e => setCondition(e.target.value)}
                            style="flex: 1; background: #1a1a2e; color: #e0e0e0; border: 1px solid #333; padding: 4px 8px; border-radius: 4px;">
                            <option value="above">Price goes ABOVE</option>
                            <option value="below">Price goes BELOW</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <label style="width: 80px;">Target:</label>
                        <input data-testid="alert-target-price" type="number" step="any" value=${targetPrice}
                            onInput=${e => setTargetPrice(e.target.value)} placeholder="Enter target price/rate"
                            style="flex: 1; background: #1a1a2e; color: #e0e0e0; border: 1px solid #333; padding: 4px 8px; border-radius: 4px;" />
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
                        <${Button} class="btn btn-sm text-xs px-4 py-1" onClick=${() => setView('list')}>Cancel<//>
                        <${Button} class="btn btn-sm text-xs px-4 py-1" data-testid="btn-submit-alert"
                            onClick=${handleCreate}
                            disabled=${!entityId || !targetPrice}>Create Alert<//>
                    </div>
                </div>
            ` : html`
                ${alerts.length === 0 ? html`
                    <div style="text-align: center; color: #888; padding: 20px;">
                        No alerts set. Click "New Alert" to create one.
                    </div>
                ` : html`
                    <div style="display: flex; flex-direction: column; gap: 4px; max-height: 400px; overflow-y: auto;">
                        <div style="display: flex; gap: 8px; font-size: 11px; color: #888; padding: 4px 8px; border-bottom: 1px solid #333;">
                            <span style="flex: 2;">Asset</span>
                            <span style="flex: 1;">Condition</span>
                            <span style="flex: 1; text-align: right;">Target</span>
                            <span style="flex: 1; text-align: right;">Current</span>
                            <span style="width: 28px;"></span>
                        </div>
                        ${alerts.map(a => {
                            const current = getCurrentPrice(a.entityType, a.entityId);
                            const triggered = a.triggered;
                            return html`
                                <div key=${a.id} style="display: flex; gap: 8px; align-items: center; padding: 6px 8px; border-radius: 4px;
                                    background: ${triggered ? 'rgba(245, 158, 11, 0.15)' : 'transparent'}; font-size: 12px;"
                                    data-testid="alert-row">
                                    <span style="flex: 2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                                        ${triggered ? 'color: #f59e0b; font-weight: bold;' : ''}">${a.entityName}</span>
                                    <span style="flex: 1; color: ${a.condition === 'above' ? '#22c55e' : '#ef4444'};">
                                        ${a.condition === 'above' ? 'Above' : 'Below'}
                                    </span>
                                    <span style="flex: 1; text-align: right;">${a.targetPrice.toFixed(2)}</span>
                                    <span style="flex: 1; text-align: right; color: ${current != null && (
                                        (a.condition === 'above' && current >= a.targetPrice) ||
                                        (a.condition === 'below' && current <= a.targetPrice)
                                    ) ? '#f59e0b' : '#e0e0e0'};">${current?.toFixed(2) ?? 'N/A'}</span>
                                    <button style="width: 28px; background: none; border: none; color: #ef4444; cursor: pointer; font-size: 14px;"
                                        onClick=${() => handleDelete(a.id)} data-testid="btn-delete-alert" title="Delete alert">x</button>
                                </div>
                            `;
                        })}
                    </div>
                `}
            `}
        </div>
    <//>`;
}
