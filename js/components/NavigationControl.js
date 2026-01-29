import { html, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import Button from './Button.js';


function NavigationControl() {

    const allCompanies = api.useGameStore(s => s.gameState.allCompanies);
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);
    const playerId = api.useGameStore(s => s.gameState.playerId);
    const playerName = api.useGameStore(s => s.gameState.playerName);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);
    const navHistory = api.useGameStore(s => s.gameState.customData?.navHistory?.entries || []);
    const navPointerIdx = api.useGameStore(s => s.gameState.customData?.navHistory?.pointerIndex ?? -1);

    useEffect(() => {
        api.navHistory.length = 0;
        api.navHistory.push(...navHistory);
        api.navPointerIdx.current = navPointerIdx;
    }, [navHistory, navPointerIdx]);

    const activePage = activeIndustryNum != -1 ? `industry-${activeIndustryNum}` : `asset-${activeEntityNum}`;

    const companyMap = new Map(
        (allCompanies ?? [])
            .concat([{ id: playerId, name: playerName, symbol: '' }])
            .map(c => [c.id, { name: c.name, symbol: c.symbol }])
    );

    const industryMap = new Map(
        (allIndustries ?? [])
            .concat([
                { id: 0, name: 'Market Reports' },
                { id: -2, name: 'Database Search' }
            ])
            .map(ind => [ind.id, { name: ind.name }])
    );

    const options = navHistory
        .map(page => page.type === 'industry' ? ({ id: page.id, type: 'industry', ...industryMap.get(page.id) })
            : ({ id: page.id, type: 'asset', ...companyMap.get(page.id) }))
        .filter(c => c.name);

    const onChange = (e) => {
        const [type, idStr, idStr2] = e.target.value.split('-');
        const id = parseInt(idStr, 10);
        const id2 = idStr2 ? -parseInt(idStr2, 10) : null;
        api.gotoPage({ id: id2 !== null ? id2 : id, type });
    };

    return navHistory.length === 0 ? '' : html`
        <div class="w-full">
            <div class="label flex flex-row justify-center items-center" style="height: 20px">
                <small>Navigation History:</small>
            </div>
            <div class="flex flex-row items-center gap-2">
                <div class="">
                    <div class="flex flex-row items-center gap-2">
                        <div class="flex items-center gap-2" style="height:25px">
                            <${Button} class="btn ${api.navPointerIdx.current >= navHistory.length - 1 ? 'invisible' : ''}" onClick=${() => api.goBack()}><b>←</b></button>
                        </div>
                        <select class="basic flex-grow w-full text-center" value=${activePage} onChange=${onChange}>
                            ${options.map(opt => html`<option value="${opt.type}-${opt.id}">${opt.name}${opt.symbol ? ` (${opt.symbol})` : ''}</option>`)}
                        </select>
                        <div class="flex items-center gap-2" style="height:25px">
                            <${Button} class="btn ${api.navPointerIdx.current <= 0 ? 'invisible' : ''}" onClick=${() => api.goForward()}><b>→</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export default NavigationControl;