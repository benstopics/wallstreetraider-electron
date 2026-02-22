import { html, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import Button from './Button.js';
import { bracketLabel } from '../hotkeys.js';
import { insertCurrencySymbols } from './helpers.js';


function NavigationPanel() {
    // Navigation state - read from store for reactivity, but NavigationManager is source of truth
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies);
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);
    const playerId = api.useGameStore(s => s.gameState.playerId);
    const playerName = api.useGameStore(s => s.gameState.playerName);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);

    // Nav state from separate store key (NOT from gameState — no polling interference)
    const navState = api.useGameStore(s => s.navState);
    const navHistory = navState?.entries || [];
    const navPointerIdx = navState?.pointerIndex ?? 0;

    // Acting As state
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);

    const selectRef = useRef(null);

    // Initialize NavigationManager from CustomData on first load (once)
    const savedNavData = api.useGameStore(s => s.gameState.customData?.navHistory);
    useEffect(() => {
        if (savedNavData && !api.navManager.initialized) {
            api.navManager.init(savedNavData);
        }
    }, [savedNavData]);

    // BUG-030/BUG-115/BUG-096/BUG-049: Auto-track the current viewed entity/industry
    // in navigation history. This ensures navigation is populated after game load,
    // after startup creates a new company, when ETFs are viewed, etc.
    const prevEntityRef = useRef(null);
    const prevIndustryRef = useRef(null);
    useEffect(() => {
        if (!activeEntityNum && activeIndustryNum === undefined) return;
        if (activeIndustryNum >= 0 || activeIndustryNum === -2) {
            // Viewing an industry or DB Search
            if (prevIndustryRef.current !== activeIndustryNum) {
                prevIndustryRef.current = activeIndustryNum;
                prevEntityRef.current = null;
                // Push to nav if not already the current entry
                const current = navHistory[navPointerIdx];
                if (!current || current.type !== 'industry' || current.id !== activeIndustryNum) {
                    api.navManager.push({ id: activeIndustryNum, type: 'industry' });
                }
            }
        } else if (activeEntityNum && activeEntityNum > 0) {
            // Viewing an asset (company or player)
            if (prevEntityRef.current !== activeEntityNum) {
                prevEntityRef.current = activeEntityNum;
                prevIndustryRef.current = null;
                // Push to nav if not already the current entry
                const current = navHistory[navPointerIdx];
                if (!current || current.type !== 'asset' || current.id !== activeEntityNum) {
                    api.navManager.push({ id: activeEntityNum, type: 'asset' });
                }
            }
        }
    }, [activeEntityNum, activeIndustryNum]);

    // Get the advisorId for the active entity (for ETFs with industry 71)
    const activeEntity = (allCompanies || []).find(c => c.id === activeEntityNum);
    const advisorId = activeEntity?.advisorId || 0;
    const controlledAdvisorId = controlledCompanies.some(c => c.id === advisorId) ? advisorId : 0;

    // Hotkey: act as active entity
    useEffect(() => {
        const handler = () => {
            if (activeEntityNum && activeEntityNum !== actingAsId) {
                api.changeActingAs(activeEntityNum);
            }
        };
        document.addEventListener('hotkey-act-as', handler);
        return () => document.removeEventListener('hotkey-act-as', handler);
    }, [activeEntityNum, actingAsId]);

    // Hotkey: view last entity
    useEffect(() => {
        const handler = () => {
            if (lastEntity) api.setViewAsset(lastEntity.id);
        };
        document.addEventListener('hotkey-view-last-entity', handler);
        return () => document.removeEventListener('hotkey-view-last-entity', handler);
    }, [lastEntity]);

    // Hotkey: view industry
    useEffect(() => {
        const handler = () => {
            if (currentIndustry && activeIndustryId > 0) api.viewIndustry(activeIndustryId);
        };
        document.addEventListener('hotkey-view-industry', handler);
        return () => document.removeEventListener('hotkey-view-industry', handler);
    }, [currentIndustry, activeIndustryId]);

    // Hotkey: view player
    useEffect(() => {
        const handler = () => {
            if (activeEntityNum !== api.HUMAN1_ID) {
                api.setViewAsset(api.HUMAN1_ID);
            }
        };
        document.addEventListener('hotkey-view-player', handler);
        return () => document.removeEventListener('hotkey-view-player', handler);
    }, [activeEntityNum]);

    // Navigation dropdown data
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

    const navOptions = navHistory
        .map(page => {
            if (page.type === 'industry') {
                const info = industryMap.get(page.id);
                return { id: page.id, type: 'industry', name: info?.name || `Industry #${page.id}` };
            }
            const info = companyMap.get(page.id);
            return { id: page.id, type: 'asset', name: info?.name || `Entity #${page.id}`, symbol: info?.symbol || '' };
        });

    const onNavChange = (e) => {
        const [type, idStr, idStr2] = e.target.value.split('-');
        const id = parseInt(idStr, 10);
        const id2 = idStr2 ? -parseInt(idStr2, 10) : null;
        api.gotoPage({ id: id2 !== null ? id2 : id, type });
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
    const hasNavHistory = navHistory.length > 0;

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
        <div class="flex flex-col gap-1" data-tutorial="navigation-panel" style="min-width: 360px; flex-shrink: 0;">
            <!-- Row 1: Acting As -->
            <div class="flex flex-row items-center gap-2" data-tutorial="acting-as-dropdown">
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
                    ${actingAsOptions.map(opt => html`<option value=${opt.id}>${opt.name}${opt.symbol ? ` (${opt.symbol})` : ''}</option>`)}
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
                            onclick=${() => api.setViewAsset(actingAsId)}>${bracketLabel('← View', 'V')}</button>`
                        : ''}
                    ${/* Act As X button - when viewing a controlled company but not acting as it */
                      actingAsId !== activeEntityNum && actingAsOptions.find(opt => opt.id === activeEntityNum)
                        ? html`<${Button} class="btn px-2 py-1 text-xs whitespace-nowrap" onclick=${() => api.changeActingAs(activeEntityNum)}>${bracketLabel(`Act As ${activeEntitySymbol}`, 'A')}</button>`
                        : ''}
                    ${/* ETF Advisor badge/button */
                      (activeIndustryId == 71 && controlledAdvisorId > 0)
                        ? (actingAsId === controlledAdvisorId
                            ? html`<span class="badge badge-primary px-2 py-1 text-xs whitespace-nowrap">${insertCurrencySymbols('Advisor')}</span>`
                            : html`<${Button} class="btn px-2 py-1 text-xs whitespace-nowrap" onclick=${() => api.changeActingAs(controlledAdvisorId)}>${bracketLabel(insertCurrencySymbols('Advisor'), 'D')}</button>`)
                        : ''}
                </div>
            </div>

            <!-- Row 2: Viewing / Navigation -->
            <div class="flex flex-row items-center gap-2">
                <small class="whitespace-nowrap" style="width: 70px;">Viewing:</small>
                <${Button}
                    class="btn px-2 py-1 ${!hasNavHistory || !canGoBack ? 'invisible' : ''}"
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
                        : html`<option>-</option>`
                    }
                </select>
                <${Button}
                    class="btn px-2 py-1 ${!hasNavHistory || !canGoForward ? 'invisible' : ''}"
                    onClick=${() => api.goForward()}>
                    <b>→</b>
                </button>
                <div class="flex items-center gap-1">
                    ${lastEntity
                        ? html`<${Button} class="btn px-2 py-1 text-xs whitespace-nowrap" data-testid="btn-last-entity" onclick=${() => api.setViewAsset(lastEntity.id)}>${bracketLabel(lastEntity.symbol || lastEntity.name, 'L')}</button>`
                        : ''}
                    ${currentIndustry
                        ? html`<${Button} class="btn px-2 py-1 text-xs whitespace-nowrap" data-testid="btn-industry" onclick=${() => api.viewIndustry(activeIndustryId)}>${bracketLabel(currentIndustry.name, 'I')}</button>`
                        : ''}
                    ${activeEntityNum !== api.HUMAN1_ID
                        ? html`<${Button} class="btn px-2 py-1 text-xs whitespace-nowrap" data-tutorial="view-player" data-testid="btn-view-player" onclick=${() => api.setViewAsset(api.HUMAN1_ID)}>${bracketLabel(insertCurrencySymbols('Player'), 'P')}</button>`
                        : ''}
                </div>
            </div>
        </div>
    `;
}

export default NavigationPanel;
