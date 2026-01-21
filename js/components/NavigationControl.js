import { html } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';


function NavigationControl() {

    const allCompanies = api.useGameStore(s => s.gameState.allCompanies);
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);
    const playerId = api.useGameStore(s => s.gameState.playerId);
    const playerName = api.useGameStore(s => s.gameState.playerName);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);

    const activePage = activeIndustryNum >= 0 ? `industry-${activeIndustryNum}` : `asset-${activeEntityNum}`;

    const companyMap = new Map(
        (allCompanies ?? [])
            .concat([{ id: playerId, name: playerName, symbol: '' }])
            .map(c => [c.id, { name: c.name, symbol: c.symbol }])
    );

    const industryMap = new Map(
        (allIndustries ?? [])
            .concat([{ id: 0, name: 'Market Reports' }])
            .map(ind => [ind.id, { name: ind.name }])
    );

    const options = api.navHistory
        .map(page => page.type === 'industry' ? ({ id: page.id, type: 'industry', ...industryMap.get(page.id) }) : ({ id: page.id, type: 'asset', ...companyMap.get(page.id) }))
        .filter(c => c.name);

    const onChange = (e) => {
        const [type, idStr] = e.target.value.split('-');
        const id = parseInt(idStr, 10);
        api.gotoPage({ id, type });
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
                        <select class="basic flex-grow w-full text-center" value=${activePage} onChange=${onChange}>
                            ${options.map(opt => html`<option value="${opt.type}-${opt.id}">${opt.name}${opt.symbol ? ` (${opt.symbol})` : ''}</option>`)}
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