import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';


function NavigationControl({ gameState }) {

    const companyMap = new Map(
        gameState.allCompanies
            .concat([{ id: gameState.playerId, name: gameState.playerName, symbol: '' }])
            .map(c => [c.id, { name: c.name, symbol: c.symbol }])
    );

    const options = api.navHistory
        .map(id => ({ id, ...companyMap.get(id) }))
        .filter(c => c.name);

    const onChange = (e) => {
        const id = parseInt(e.target.value, 10);
        api.setViewAsset(id);
    };

    return api.navHistory.length === 0 ? '' : html`
        <div class="w-full">
            <div class="label flex flex-row justify-center items-center" style="height: 20px">
                <small>Navigation History:</small>
            </div>
            <div class="flex flex-row items-center gap-2">
                <div class="">
                    <div class="flex flex-row items-center gap-2">
                        <div class="flex items-center gap-2" style="height:25px">
                            <button class="btn ${api.navPointerIdx >= api.navHistory.length - 1 ? 'invisible' : ''}" onclick=${() => api.goBack()}><b>←</b></button>
                        </div>
                        <select class="basic flex-grow w-full text-center" value=${gameState.activeEntityNum} onChange=${onChange}>
                            ${options.map(opt => html`<option value=${opt.id}>${opt.name}${opt.symbol ? ` (${opt.symbol})` : ''}</option>`)}
                        </select>
                        <div class="flex items-center gap-2" style="height:25px">
                            <button class="btn ${api.navPointerIdx <= 0 ? 'invisible' : ''}" onclick=${() => api.goForward()}><b>→</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export default NavigationControl;