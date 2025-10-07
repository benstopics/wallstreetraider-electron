import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';


function ActingAsDropdown({ gameState }) {

    const options = [
        { id: gameState.playerId, name: gameState.playerName }
    ].concat(gameState.controlledCompanies || []);

    const onChange = (e) => {
        const id = parseInt(e.target.value, 10);
        api.changeActingAs(id);
    };

    return html`
        <div class="w-full">
            <div class="label flex flex-row justify-between" style="height: 20px">
                <small>Acting As</small>
                <div class="flex flex-row">
                    ${gameState.actingAsId !== gameState.activeEntityNum && options.find(opt => opt.id === gameState.activeEntityNum) ? html`
                        <button class="btn mx-1" onclick=${() => api.changeActingAs(gameState.activeEntityNum)}>Act As ${gameState.activeEntitySymbol}</button>
                    ` : ''}
                    ${gameState.activeEntityNum !== api.PLAYER1_ID
                        ? html`<button class="btn mx-1" onclick=${() => api.setViewAsset(gameState.playerId)}>View Player</button>`
                        : ''}
                </div>
            </div>
            <div class="flex flex-row items-center gap-2">
                <select class="basic flex-grow text-center w-full" value=${gameState.actingAsId} onChange=${onChange}>
                    ${options.map(opt => html`<option value=${opt.id}>${opt.name}</option>`)}
                </select>
                <div class="" style="height:25px">
                    ${gameState.actingAsId !== gameState.activeEntityNum || gameState.activeIndustryNum >= 0
                        ? html`<button class="btn mx-1" onclick=${() => api.setViewAsset(gameState.actingAsId)}>View ${gameState.actingAsSymbol}</button>`
                        : ''}
                </div>
            </div>
        </div>
    `;
}

export default ActingAsDropdown;