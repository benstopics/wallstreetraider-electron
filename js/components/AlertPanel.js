/**
 * AlertPanel — Persistent alert log (Req 2.8)
 *
 * Severity categories (Phase 2):
 *   Red (critical):  margin call territory, hostile takeover, insolvency, short spike
 *   Yellow (basic):  stock price hit player-set price target
 *
 * Behavior:
 *   • Persistent scrollable log (not toast)
 *   • Click to navigate to relevant entity
 *   • Critical alerts stay pinned at top until dismissed
 *   • Integrates with existing PriceAlertModal (price alerts surfaced here too)
 */
import { html, useMemo } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import Button from './Button.js';
import * as api from '../api.js';

const SEVERITY_COLOR = {
    red:    '#ef4444',
    yellow: '#eab308',
    blue:   '#3b82f6',
};

const SEVERITY_LABEL = {
    red:    'CRITICAL',
    yellow: 'NOTICE',
    blue:   'INFO',
};

function AlertRow({ alert }) {
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];
    const company = alert.entityId ? allCompanies.find(c => c.id === alert.entityId) : null;
    const color = SEVERITY_COLOR[alert.severity] || SEVERITY_COLOR.blue;
    const label = SEVERITY_LABEL[alert.severity] || 'INFO';
    const d = alert.gameDate;
    const ts = d?.year != null
        ? `Y${d.year} Q${d.quarter ?? '?'}${d.month != null ? ` M${d.month}` : ''}${d.day != null ? ` D${d.day}` : ''}`
        : '—';

    const handleClick = () => {
        if (alert.entityId) api.setViewAsset(alert.entityId);
    };

    return html`
        <div
            style="display:flex;flex-direction:column;gap:2px;padding:6px 8px;border-radius:4px;border-left:3px solid ${color};background:rgba(255,255,255,0.04);cursor:${alert.entityId ? 'pointer' : 'default'};"
            onClick=${alert.entityId ? handleClick : undefined}
        >
            <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-size:10px;font-weight:700;color:${color};white-space:nowrap;">${label}</span>
                ${company ? html`<span style="font-size:11px;opacity:0.7;white-space:nowrap;">${company.symbol || company.name}</span>` : ''}
                <span style="flex:1;"></span>
                <span style="font-size:10px;opacity:0.5;">${ts}</span>
                <${Button} class="btn text-xs" style="padding:0 4px;font-size:10px;min-width:0;" onClick=${(e) => { e.stopPropagation(); api.dismissAlert(alert.id); }}>✕<//>
            </div>
            <div style="font-size:12px;">${alert.message}</div>
            ${alert.entityId ? html`<div style="font-size:10px;opacity:0.5;">Click to navigate →</div>` : ''}
        </div>
    `;
}

export default function AlertPanel({ open, onClose }) {
    const alerts = api.useGameStore(s => s.alerts) || [];

    // Pinned critical alerts first, then by timestamp desc
    const sorted = useMemo(() => {
        const pinned = alerts.filter(a => a.pinned);
        const rest = alerts.filter(a => !a.pinned).sort((a, b) => b.ts - a.ts);
        return [...pinned, ...rest];
    }, [alerts]);

    if (!open) return null;

    return html`
        <${Modal} show=${open} onClose=${onClose}>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div style="font-weight:700;font-size:14px;">Alerts</div>
                    <div style="display:flex;gap:6px;align-items:center;">
                        ${sorted.length > 0 ? html`
                            <${Button} class="btn text-xs" style="font-size:10px;" onClick=${() => {
                                for (const a of [...alerts]) api.dismissAlert(a.id);
                            }}>Clear All<//>
                        ` : ''}
                        <${Button} class="btn modal" onClick=${onClose}>Close<//>
                    </div>
                </div>
                <div style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;">
                    ${sorted.length === 0 ? html`
                        <div style="text-align:center;opacity:0.5;padding:24px 0;">No alerts.</div>
                    ` : sorted.map(a => html`<${AlertRow} key=${a.id} alert=${a} />`)}
                </div>
                <div style="font-size:10px;opacity:0.4;text-align:center;">
                    Price alerts are also managed via Price Alert Manager in the toolbar.
                </div>
            </div>
        <//>
    `;
}
