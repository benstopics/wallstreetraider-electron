/**
 * EntityPicker — Replaces the Acting As dropdown for multi-entity trade actions.
 *
 * Shows the player and eligible controlled companies. For each entity, displays
 * name/symbol and available cash where the game state provides it.
 *
 * Props:
 *   show        — boolean, whether picker is visible
 *   actionLabel — string, displayed as the action title ("Buy Stock", "Short Stock", etc.)
 *   eligibility — optional function (entity) => boolean, filters which entities appear.
 *                 If omitted, shows player + all controlled companies.
 *   onSelect    — function(entityId), called when entity is confirmed
 *   onCancel    — function(), called on cancel/close
 */
import { html } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import Button from './Button.js';
import * as api from '../api.js';
import { formatCurrency, insertCurrencySymbols } from './helpers.js';

export default function EntityPicker({ show, actionLabel, eligibility, onSelect, onCancel }) {
    const playerName = api.useGameStore(s => s.gameState.playerName) || 'Player';
    const playerId = api.useGameStore(s => s.gameState.playerId) || api.HUMAN1_ID;
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];

    // Player cash is available directly from top-level game state
    const playerCash = api.useGameStore(s => s.gameState.cash);
    const dlrSign = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro = api.useGameStore(s => s.gameState.euro) || '';

    if (!show) return null;

    // Build entity list: player first, then controlled companies
    const playerEntity = { id: playerId, name: playerName, symbol: null, isPlayer: true };
    const allEntities = [playerEntity, ...controlledCompanies.map(c => ({ ...c, isPlayer: false }))];
    const eligible = eligibility ? allEntities.filter(eligibility) : allEntities;

    const renderFinancials = (entity) => {
        const cashStr = (entity.isPlayer && playerCash != null)
            ? insertCurrencySymbols(`${dlrSign}${formatCurrency(playerCash)}${euro}`)
            : '—'; // TODO: per-entity cash requires per-entity financials in game state
        // TODO: T-bills and line of credit require per-entity financials in game state
        return html`
            <div style="opacity:0.7; font-size:11px; display:flex; gap:8px;">
                <span>${insertCurrencySymbols('Cash:')} ${cashStr}</span>
                <span style="opacity:0.6;">${insertCurrencySymbols('T-Bills:')} —</span>
                <span style="opacity:0.6;">Credit: —</span>
            </div>
        `;
    };

    return html`
        <${Modal} show=${show} onClose=${onCancel} style=${{ '--modal-w': '360px', '--modal-h': 'auto' }}>
            <div class="p-4">
                <div class="text-lg font-bold text-center mb-2">${actionLabel || 'Select Acting Entity'}</div>
                <div class="text-center mb-4" style="color: #aaa; font-size: 13px;">Who is performing this action?</div>
                <div class="flex flex-col gap-2">
                    ${eligible.map(entity => html`
                        <${Button}
                            key=${entity.id}
                            class="btn ${entity.isPlayer ? 'green' : 'blue'} w-full"
                            style="display:flex; flex-direction:column; align-items:center; gap:2px; padding: 8px 12px;"
                            onClick=${() => onSelect(entity.id)}
                        >
                            <span style="font-weight:600;">${entity.isPlayer ? `${entity.name} (You)` : `${entity.symbol ? entity.symbol + ' — ' : ''}${entity.name}`}</span>
                            ${renderFinancials(entity)}
                        <//>
                    `)}
                    ${eligible.length === 0 ? html`
                        <div style="text-align:center; opacity:0.6; padding: 12px 0;">No eligible entities for this action.</div>
                    ` : ''}
                </div>
                <div class="flex justify-center mt-4">
                    <${Button} class="btn modal" onClick=${onCancel}>Cancel<//>
                </div>
            </div>
        <//>
    `;
}
