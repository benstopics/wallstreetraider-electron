import { html, useState, useCallback } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import Button from './Button.js';
import * as api from '../api.js';

/**
 * ActingAsPicker - Shown when a trade action is triggered on a non-controlled company view.
 * Asks "Who is buying/selling?" with options for the player and each controlled company.
 *
 * @param {boolean} show - Whether the picker is visible
 * @param {string} actionLabel - The label of the action being performed (e.g., "Buy Stock")
 * @param {Function} onSelect - Callback with selected entity ID, or null if cancelled
 * @param {Function} onCancel - Callback when cancelled
 */
export default function ActingAsPicker({ show, actionLabel, onSelect, onCancel }) {
    const playerName = api.useGameStore(s => s.gameState.playerName) || 'Player';
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];

    const handleSelect = useCallback((id) => {
        onSelect(id);
    }, [onSelect]);

    if (!show) return null;

    return html`<${Modal} show=${show} onClose=${onCancel} style="max-width: 400px;">
        <div class="p-4">
            <div class="text-lg font-bold text-center mb-4">${actionLabel}</div>
            <div class="text-center mb-4" style="color: #aaa;">Who is performing this action?</div>
            <div class="flex flex-col gap-2">
                <${Button}
                    class="btn green w-full"
                    onClick=${() => handleSelect(api.HUMAN1_ID)}
                >${playerName} (You)<//>
                ${controlledCompanies.map(c => html`
                    <${Button}
                        key=${c.id}
                        class="btn blue w-full"
                        onClick=${() => handleSelect(c.id)}
                    >${c.symbol || c.name} - ${c.name}<//>
                `)}
            </div>
            <div class="flex justify-center mt-4">
                <${Button} class="btn modal" onClick=${onCancel}>Cancel<//>
            </div>
        </div>
    <//>`;
}
