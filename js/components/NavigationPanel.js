import { html, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import Button from './Button.js';
import { insertCurrencySymbols } from './helpers.js';


function NavigationPanel() {
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies);
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);
    const playerId = api.useGameStore(s => s.gameState.playerId);
    const playerName = api.useGameStore(s => s.gameState.playerName);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);

    // Nav history from C++ gameState (managed in GameState.h, not JS)
    const navHistory = api.useGameStore(s => s.gameState.navHistory) || [];
    const navPointerIdx = api.useGameStore(s => s.gameState.navPointerIndex) ?? 0;

    // Acting As state
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);

    const selectRef = useRef(null);

    // Get the advisorId for the active entity (for ETFs with industry 71)
    const activeEntity = (allCompanies || []).find(c => c.id === activeEntityNum);
    const advisorId = activeEntity?.advisorId || 0;
    const controlledAdvisorId = controlledCompanies.some(c => c.id === advisorId) ? advisorId : 0;


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

    // Build display options from navHistory.
    // If history is empty (e.g. game just loaded, navSetHistory not yet resolved),
    // synthesize a single entry for the current active entity so the dropdown
    // is never blank during gameplay.
    const effectiveHistory = navHistory.length > 0 ? navHistory
        : (activeEntityNum > 0 ? [{ id: activeEntityNum, type: 'asset' }] : []);

    const navOptions = effectiveHistory
        .map(page => {
            if (page.type === 'industry') {
                const info = industryMap.get(page.id);
                return { id: page.id, type: 'industry', name: info?.name || `Industry #${page.id}` };
            }
            const info = companyMap.get(page.id);
            return { id: page.id, type: 'asset', name: info?.name || `Entity #${page.id}`, symbol: info?.symbol || '' };
        });

    // Derive the selected value from navHistory[navPointerIdx] so it always
    // matches an existing option even when activeEntityNum lags by a poll cycle.
    const currentEntry = effectiveHistory[navPointerIdx] || effectiveHistory[0];
    const activePage = currentEntry
        ? `${currentEntry.type}-${currentEntry.id}`
        : (activeIndustryNum != -1 ? `industry-${activeIndustryNum}` : `asset-${activeEntityNum}`);

    const onNavChange = (e) => {
        const [type, idStr, idStr2] = e.target.value.split('-');
        const id = parseInt(idStr, 10);
        const id2 = idStr2 ? -parseInt(idStr2, 10) : null;
        const navId = id2 !== null ? id2 : id;
        // Find the index in navHistory and goto it via C++ endpoint
        const idx = navHistory.findIndex(h => h.id === navId && h.type === type);
        if (idx >= 0) {
            api.navGotoIndex(idx);
        } else {
            api.gotoPage({ id: navId, type });
        }
    };

    // Acting As dropdown data
    const actingAsOptions = [
        { id: playerId, name: playerName }
    ].concat(controlledCompanies || []);

    const onActingAsChange = (e) => {
        const id = parseInt(e.target.value, 10);
        api.changeActingAs(id);
    };

    const canGoBack = navPointerIdx < navHistory.length - 1;
    const canGoForward = navPointerIdx > 0;
    const hasNavHistory = effectiveHistory.length > 0;

    // FEAT-001: Last Entity — find the most recent asset entry that isn't the current one
    const lastEntity = (() => {
        for (let i = 0; i < navHistory.length; i++) {
            if (i === navPointerIdx) continue;
            const entry = navHistory[i];
            if (entry.type === 'asset' && entry.id !== activeEntityNum && entry.id > 0) {
                const info = companyMap.get(entry.id);
                if (info) return { id: entry.id, symbol: info.symbol, name: info.name };
            }
        }
        return null;
    })();

    // FEAT-024: Industry button — get industry name for current entity
    const currentIndustry = (activeIndustryId > 0 && activeIndustryNum < 0)
        ? industryMap.get(activeIndustryId) || null
        : null;


    // Acting As navigation (cycle through controlled companies)
    const actingAsIndex = actingAsOptions.findIndex(opt => opt.id === actingAsId);
    const canActingAsPrev = actingAsOptions.length > 1 && actingAsIndex > 0;
    const canActingAsNext = actingAsOptions.length > 1 && actingAsIndex < actingAsOptions.length - 1;

    const goActingAsPrev = () => {
        if (canActingAsPrev) {
            api.changeActingAs(actingAsOptions[actingAsIndex - 1].id);
        }
    };
    const goActingAsNext = () => {
        if (canActingAsNext) {
            api.changeActingAs(actingAsOptions[actingAsIndex + 1].id);
        }
    };

    return html`
        <div class="flex flex-col gap-1" data-tutorial="navigation-panel" style="min-width: 280px;">
            <!-- Row 1: Acting As -->
            <!--<div class="flex flex-row items-center gap-2" data-tutorial="acting-as-dropdown">
                <small class="whitespace-nowrap" style="width: 70px;">${insertCurrencySymbols('Acting As')}:</small>
                <${Button}
                    class="btn px-2 py-1 ${!canActingAsPrev ? 'invisible' : ''}"
                    onClick=${goActingAsPrev}>
                    <b>←</b>
                </button>
                <select
                    ref=${selectRef}
                    class="basic text-center"
                    style="width: 180px;"
                    value=${actingAsId}
                    onChange=${onActingAsChange}
                >
                    ${actingAsOptions.map(opt => html`<option value=${opt.id}>${opt.name}${opt.symbol ? ` (${opt.symbol})` : ''}${opt.industryId === 71 ? ' [ETF]' : ''}</option>`)}
                </select>
                <${Button}
                    class="btn px-2 py-1 ${!canActingAsNext ? 'invisible' : ''}"
                    onClick=${goActingAsNext}>
                    <b>→</b>
                </button>
                <div class="flex items-center gap-1">
                    ${/* View button - when acting as something other than what you're viewing */
                      actingAsId !== playerId && actingAsId !== activeEntityNum
                        ? html`<${Button}
                            class="btn px-2 py-1 text-xs whitespace-nowrap"
                            data-tutorial="view-acting-as"
                            onclick=${() => api.setViewAsset(actingAsId)}>← View</button>`
                        : ''}
                    ${/* Act As X button - when viewing a controlled company but not acting as it */
                      actingAsId !== activeEntityNum && actingAsOptions.find(opt => opt.id === activeEntityNum)
                        ? html`<${Button} class="btn px-2 py-1 text-xs whitespace-nowrap" onclick=${() => api.changeActingAs(activeEntityNum)}>Act As ${activeEntitySymbol}</button>`
                        : ''}
                    ${/* ETF Advisor badge/button */
                      (activeIndustryId == 71 && controlledAdvisorId > 0)
                        ? (actingAsId === controlledAdvisorId
                            ? html`<span class="badge badge-primary px-2 py-1 text-xs whitespace-nowrap">${insertCurrencySymbols('Advisor')}</span>`
                            : html`<${Button} class="btn px-2 py-1 text-xs whitespace-nowrap" onclick=${() => api.changeActingAs(controlledAdvisorId)}>${insertCurrencySymbols('Advisor')}</button>`)
                        : ''}
                </div>
            </div>-->

            <!-- Row 2: Viewing / Navigation -->
            <div class="flex flex-row items-center gap-2">
                <small class="whitespace-nowrap" style="width: 70px;">Viewing:</small>
                <div class="flex items-center gap-1">
                    ${currentIndustry
                        ? html`<${Button} class="btn px-2 py-1 text-xs whitespace-nowrap" data-testid="btn-industry" onclick=${() => api.viewIndustry(activeIndustryId)}>${currentIndustry.name}</button>`
                        : ''}
                    ${activeEntityNum !== api.HUMAN1_ID
                        ? html`<${Button} class="btn px-2 py-1 text-xs whitespace-nowrap" data-tutorial="view-player" data-testid="btn-view-player" onclick=${() => api.setViewAsset(api.HUMAN1_ID)}>${insertCurrencySymbols('Player')}</button>`
                        : ''}
                </div>
                <${Button}
                    class="btn px-3 py-1 ${!hasNavHistory || !canGoBack ? 'invisible' : ''}"
                    style="font-size:16px; line-height:1;"
                    onClick=${() => api.goBack()}>
                    <b>←</b>
                </button>
                <select
                    class="basic text-left"
                    style="width: 180px;"
                    value=${activePage}
                    onChange=${onNavChange}
                    disabled=${!hasNavHistory}
                >
                    ${hasNavHistory
                        ? navOptions.map(opt => html`<option value="${opt.type}-${opt.id}">${opt.name}${opt.symbol ? ` (${opt.symbol})` : ''}</option>`)
                        : html`<option value="">—</option>`
                    }
                </select>
                <${Button}
                    class="btn px-3 py-1 ${!hasNavHistory || !canGoForward ? 'invisible' : ''}"
                    style="font-size:16px; line-height:1;"
                    onClick=${() => api.goForward()}>
                    <b>→</b>
                </button>
            </div>
        </div>
    `;
}

export default NavigationPanel;
