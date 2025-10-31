import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';


function ActingAsDropdown() {

    const playerId = api.useGameStore(s => s.gameState.playerId);
    const playerName = api.useGameStore(s => s.gameState.playerName);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);

    const options = [
        { id: playerId, name: playerName }
    ].concat(controlledCompanies || []);

    const onChange = (e) => {
        const id = parseInt(e.target.value, 10);
        api.changeActingAs(id);
    };

    return html`
        <div class="w-full">
            <div class="label flex flex-row justify-between" style="height: 20px">
                <small>Acting As</small>
                <div class="flex flex-row">
                    ${actingAsId !== activeEntityNum && options.find(opt => opt.id === activeEntityNum) ? html`
                        <button class="btn mx-1 p-2" onclick=${() => api.changeActingAs(activeEntityNum)}>Act As ${activeEntitySymbol}</button>
                    ` : ''}
                    ${activeEntityNum !== api.HUMAN1_ID
            ? html`<button class="btn mx-1 p-2" onclick=${() => api.setViewAsset(api.HUMAN1_ID)}>View Player</button>`
            : ''}
                </div>
            </div>
            <div class="flex flex-row items-center gap-2">
                <select class="basic flex-grow text-center w-full" value=${actingAsId} onChange=${onChange}>
                    ${options.map(opt => html`<option value=${opt.id}>${opt.name}${opt.symbol ? ` (${opt.symbol})` : ''}</option>`)}
                </select>
                <div class="" style="height:25px">
                    ${actingAsId !== activeEntityNum || activeIndustryNum >= 0
            ? html`<button class="btn mx-1 p-2 whitespace-nowrap" onclick=${() => api.setViewAsset(actingAsId)}>← View</button>`
            : ''}
                </div>
            </div>
        </div>
    `;
}

export default ActingAsDropdown;