import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import Button from './Button.js';


function ActingAsDropdown() {

    const playerId = api.useGameStore(s => s.gameState.playerId);
    const playerName = api.useGameStore(s => s.gameState.playerName);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];

    // Get the advisorId for the active entity (for ETFs with industry 71) only if player controls the advisor
    const activeEntity = allCompanies.find(c => c.id === activeEntityNum);
    const advisorId = activeEntity?.advisorId || 0;
    const controlledAdvisorId = controlledCompanies.some(c => c.id === advisorId) ? advisorId : 0;

    const options = [
        { id: playerId, name: playerName }
    ].concat(controlledCompanies || []);

    const onChange = (e) => {
        const id = parseInt(e.target.value, 10);
        api.changeActingAs(id);
    };

    return html`
        <div style="width: 350px;" class="flex flex-col gap-1" data-tutorial="acting-as-dropdown">
            <div class="label flex flex-row justify-between h-full items-center" style="height: 20px">
                ${(activeIndustryId == 71 && controlledAdvisorId > 0)
                    ? (
                        actingAsId === controlledAdvisorId
                            ? html`<span class="badge badge-primary mx-1 px-2 py-1 text-xs">Acting As Investment Advisor</span>`
                            : html`<${Button} class="btn mx-1 p-2" onclick=${() => api.changeActingAs(controlledAdvisorId)}>Act As Investment Advisor</button>`
                    )
                    : (actingAsId !== activeEntityNum && options.find(opt => opt.id === activeEntityNum)) ? html`
                        <${Button} class="btn mx-1 p-2" onclick=${() => api.changeActingAs(activeEntityNum)}>Act As ${activeEntitySymbol}</button>
                    `: ''}
                ${activeEntityNum !== api.HUMAN1_ID
                    ? html`<${Button} class="btn mx-1 p-2" data-tutorial="view-player" onclick=${() => api.setViewAsset(api.HUMAN1_ID)}>View Player</button>`
                    : ''}
            </div>
            <div class="flex flex-row items-center gap-2">
                <small class="whitespace-nowrap">Acting As</small>
                <select class="basic flex-grow text-center w-full" value=${actingAsId} onChange=${onChange}>
                    ${options.map(opt => html`<option value=${opt.id}>${opt.name}${opt.symbol ? ` (${opt.symbol})` : ''}</option>`)}
                </select>
                <div class="" style="height:25px">
                    ${actingAsId !== activeEntityNum || activeIndustryId >= 0 || activeIndustryId === -2
            ? html`<${Button} class="btn mx-1 p-2 whitespace-nowrap" data-tutorial="view-acting-as" onclick=${() => api.setViewAsset(actingAsId)}>← View</button>`
            : ''}
                </div>
            </div>
        </div>
    `;
}

export default ActingAsDropdown;