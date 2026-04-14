import { html, useState, useRef, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import Modal from './Modal.js';
import Button from './Button.js';

/**
 * Frontend entity ID → PB commodity code mapping.
 * Stocks (11-1600) pass through unchanged. Only non-stock securities need mapping.
 */
const FRONTEND_TO_PB = {
    [api.STOCK_INDEX_ID]: 3009,   // 0 → 3009
    [api.OIL_ID]:         3002,   // 6 → 3002
    [api.GOLD_ID]:        3003,   // 7 → 3003
    [api.SILVER_ID]:      3004,   // 8 → 3004
    [api.WHEAT_ID]:       3005,   // 9 → 3005
    [api.CORN_ID]:        3006,   // 10 → 3006
    [api.PRIME_RATE_ID]:  3010,   // 1601 → 3010
    [api.TBOND_RATE_ID]:  3011,   // 1602 → 3011
    [api.SBOND_RATE_ID]:  3012,   // 1603 → 3012
    [api.GNP_RATE_ID]:    3013,   // 1604 → 3013
    [api.BITCOIN_ID]:     3007,   // 1605 → 3007
    [api.ETHEREUM_ID]:    3008,   // 1606 → 3008
};

const PB_TO_FRONTEND = {};
for (const [fe, pb] of Object.entries(FRONTEND_TO_PB)) PB_TO_FRONTEND[pb] = Number(fe);

// Non-stock entities with symbols for search
const NON_STOCK_ENTITIES = [
    { pbCode: 3009, symbol: 'INDEX', name: 'Stock Market Index', tag: 'Index' },
    { pbCode: 3002, symbol: 'OIL',   name: 'Crude Oil',         tag: 'Commodity' },
    { pbCode: 3003, symbol: 'GOLD',  name: 'Gold',              tag: 'Commodity' },
    { pbCode: 3004, symbol: 'SILVER',name: 'Silver',            tag: 'Commodity' },
    { pbCode: 3005, symbol: 'WHEAT', name: 'Wheat',             tag: 'Commodity' },
    { pbCode: 3006, symbol: 'CORN',  name: 'Corn',              tag: 'Commodity' },
    { pbCode: 3007, symbol: 'BTC',   name: 'Bitcoin',           tag: 'Crypto' },
    { pbCode: 3008, symbol: 'ETH',   name: 'Ethereum',          tag: 'Crypto' },
    { pbCode: 3010, symbol: 'PRIME', name: 'Prime Rate',        tag: 'Rate' },
    { pbCode: 3011, symbol: 'TBOND', name: 'Long Bond Rate',    tag: 'Rate' },
    { pbCode: 3012, symbol: 'SBOND', name: 'Short Bond Rate',   tag: 'Rate' },
    { pbCode: 3013, symbol: 'GDP',   name: 'GDP Growth Rate',   tag: 'Rate' },
];

/** Resolve a PB entityId to a display name. */
function resolveEntityName(entityId, allCompanies) {
    if (entityId >= 11 && entityId <= 1600) {
        const co = allCompanies.find(c => c.id === entityId);
        return co ? `${co.symbol} - ${co.name}` : `Company #${entityId}`;
    }
    const ns = NON_STOCK_ENTITIES.find(e => e.pbCode === entityId);
    return ns ? ns.name : `Entity #${entityId}`;
}

/** Get current price for display given a PB entityId. */
function getCurrentPrice(entityId, allCompanies, allSecurities) {
    if (entityId >= 11 && entityId <= 1600) {
        const co = allCompanies.find(c => c.id === entityId);
        return co?.price ?? null;
    }
    const frontendId = PB_TO_FRONTEND[entityId];
    if (frontendId !== undefined) {
        const sec = allSecurities.find(s => s.id === frontendId);
        return sec?.price ?? null;
    }
    return null;
}

/**
 * Price Alert Modal — create, view, and delete price/rate alerts.
 * Alerts are stored in the PB engine (Alerts$() array) and exposed via gameState.alerts.
 * Creating/deleting alerts sends events to the PB engine which handles storage,
 * checking, expiration, corporate-event adjustments, and triggering (InfoBox popups).
 *
 * Layout follows InputStringModal pattern: centered title, content area, bottom action bar.
 * Hotkeys: [S]ubmit (create view), [N]ew Alert (list view), [C]lose / ESC (always).
 */
export default function PriceAlertModal({ show, onClose }) {
    const [view, setView] = useState('list'); // 'list' | 'create'

    // Create form — search-based entity picker (like CompanySelectModal)
    const [query, setQuery] = useState('');
    const [activeIdx, setActiveIdx] = useState(0);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [condition, setCondition] = useState('above');
    const [targetPrice, setTargetPrice] = useState('');
    const searchInputRef = useRef(null);
    const priceInputRef = useRef(null);

    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];
    const allSecurities = api.useGameStore(s => s.gameState.allSecurities) || [];
    const alerts = api.useGameStore(s => s.gameState.alerts) || [];
    const playerId = api.useGameStore(s => s.gameState.playerId) || 0;

    // Build unified entity list: active companies + non-stock assets
    const allEntities = useMemo(() => {
        const stocks = allCompanies
            .filter(c => c.status === 1)
            .map(c => ({
                pbCode: c.id,
                symbol: c.symbol || '',
                name: c.name || '',
                tag: 'Stock',
                price: c.price,
            }));
        const nonStocks = NON_STOCK_ENTITIES.map(ns => {
            const frontendId = PB_TO_FRONTEND[ns.pbCode];
            const sec = frontendId !== undefined
                ? allSecurities.find(s => s.id === frontendId)
                : null;
            return { ...ns, price: sec?.price ?? null };
        });
        return [...nonStocks, ...stocks];
    }, [allCompanies, allSecurities]);

    // Ranked search (matches CompanySelectModal pattern)
    const suggestions = useMemo(() => {
        const q = (query || '').toUpperCase().trim();
        if (!q) return [];
        return allEntities
            .filter(e =>
                e.symbol.toUpperCase().includes(q) ||
                e.name.toUpperCase().includes(q) ||
                e.tag.toUpperCase().includes(q)
            )
            .map(e => {
                const symU = e.symbol.toUpperCase();
                const nameU = e.name.toUpperCase();
                let matchType = 'none';
                if (symU === q) matchType = 'fullSymbol';
                else if (symU.startsWith(q)) matchType = 'prefixSymbol';
                else if (nameU.includes(q)) matchType = 'nameMatch';
                return { ...e, matchType };
            })
            .sort((a, b) => {
                const rank = t => (
                    t === 'fullSymbol' ? 0 :
                    t === 'prefixSymbol' ? 1 :
                    t === 'nameMatch' ? 2 : 3
                );
                const ra = rank(a.matchType), rb = rank(b.matchType);
                if (ra !== rb) return ra - rb;
                // Non-stocks first for ties (more discoverable)
                if (a.tag !== 'Stock' && b.tag === 'Stock') return -1;
                if (a.tag === 'Stock' && b.tag !== 'Stock') return 1;
                return a.symbol.length - b.symbol.length || a.symbol.localeCompare(b.symbol);
            })
            .slice(0, 12);
    }, [allEntities, query]);

    // Reset form when switching to create view
    useEffect(() => {
        if (view === 'create') {
            setQuery('');
            setActiveIdx(0);
            setSelectedEntity(null);
            setCondition('above');
            setTargetPrice('');
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [view]);

    // Reset to list view when modal opens
    useEffect(() => {
        if (show) setView('list');
    }, [show]);

    // Auto-focus price input when entity is selected
    useEffect(() => {
        if (selectedEntity && view === 'create') {
            setTimeout(() => priceInputRef.current?.focus(), 50);
        }
    }, [selectedEntity, view]);

    // Guard: ignore letter shortcuts briefly after modal opens (prevents key repeat from prior modal)
    const letterReadyRef = useRef(false);
    useEffect(() => {
        if (!show) { letterReadyRef.current = false; return; }
        const t = setTimeout(() => { letterReadyRef.current = true; }, 200);
        return () => clearTimeout(t);
    }, [show]);

    // Keep refs current for the keydown handler (avoids stale closure)
    const viewRef = useRef(view);
    viewRef.current = view;
    const selectedEntityRef = useRef(selectedEntity);
    selectedEntityRef.current = selectedEntity;
    const targetPriceRef = useRef(targetPrice);
    targetPriceRef.current = targetPrice;
    const conditionRef = useRef(condition);
    conditionRef.current = condition;

    // Keyboard shortcuts: S = Submit (create), N = New Alert (list)
    // C = Close and ESC = Close are handled by app.js MODAL handler and Modal.js respectively
    useEffect(() => {
        if (!show) return;
        const handleKey = (e) => {
            if (!letterReadyRef.current) return;
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

            const key = e.key.toLowerCase();
            const tag = (e.target?.tagName || '').toLowerCase();
            const inEditable = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target?.isContentEditable;

            if (key === 's' && viewRef.current === 'create' && !inEditable) {
                e.preventDefault();
                doSubmit();
            } else if (key === 'n' && viewRef.current === 'list' && !inEditable) {
                e.preventDefault();
                setView('create');
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [show]);

    const selectEntity = (entity) => {
        if (entity) {
            setSelectedEntity(entity);
            setQuery(entity.symbol.toUpperCase());
        }
    };

    // Overlay hint (like CompanySelectModal)
    function getOverlayHint() {
        if (selectedEntity) return { tail: '', hint: '' };
        const active = suggestions[activeIdx] ?? suggestions[0];
        if (!active || !query.trim()) return { tail: '', hint: '' };
        const q = query.toUpperCase().trim();
        const symU = active.symbol.toUpperCase();
        let tail = '';
        let hints = [];
        if (symU === q) {
            hints.push('\u21B5 select');
        }
        if (suggestions.length > 1) {
            hints.push('\u2191/\u2193 navigate');
            if (symU.startsWith(q) && symU !== q) {
                tail = active.symbol.slice(query.trim().length);
                hints.push('\u21E5 autofill');
            } else if (symU !== q) {
                tail = ` (${active.symbol})`;
                hints.push('\u21E5 autofill');
            }
        }
        return { tail, hint: hints.join(' \u2022 ') };
    }

    const onSearchKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (suggestions.length > 0) {
                setActiveIdx((activeIdx + 1) % suggestions.length);
                setSelectedEntity(null);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (suggestions.length > 0) {
                setActiveIdx((activeIdx - 1 + suggestions.length) % suggestions.length);
                setSelectedEntity(null);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (suggestions.length > 0) selectEntity(suggestions[activeIdx]);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (!selectedEntity && suggestions.length > 0) {
                selectEntity(suggestions[activeIdx]);
            }
        }
    };

    const onSearchInput = (e) => {
        setQuery(e.target.value);
        setActiveIdx(0);
        setSelectedEntity(null);
    };

    const doSubmit = () => {
        const entity = selectedEntityRef.current;
        const tp = targetPriceRef.current;
        if (!entity || !tp || isNaN(Number(tp))) return;
        if (Number(tp) <= 0) return;

        const direction = conditionRef.current === 'above' ? 'UP' : 'DN';
        api.createPriceAlert(entity.pbCode, direction, Number(tp));
        setView('list');
    };

    const handleDelete = (slot) => {
        api.deletePriceAlert(slot);
    };

    if (!show) return null;

    const playerAlerts = alerts.filter(a => a.playerId === playerId);
    const { tail, hint } = getOverlayHint();

    // Current price of selected entity
    const selectedPrice = selectedEntity?.price;

    if (view === 'create') {
        return html`<${Modal} show=${true} onClose=${onClose} style="display: flex; flex-direction: column; --modal-w: 560px; --modal-h: auto;">
            <div class="flex-1 min-h-0 p-3 overflow-y-auto">
                <div class="text-lg font-bold text-center">Create Price Alert</div>
                <br/>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div>
                        <label style="font-size: 13px; color: var(--fg-muted, #888); margin-bottom: 4px; display: block;">Search stocks, commodities, rates, or crypto:</label>
                        <div style="position: relative;">
                            <div class="command-line suggestion-overlay" aria-hidden="true">${query}${tail ? html`<span style="color:#888">${tail}</span>` : ''}${hint ? html`<span style="color:#666; margin-left:8px;">${hint}</span>` : ''}</div>
                            <input
                                ref=${searchInputRef}
                                type="text"
                                class="command-line"
                                data-testid="alert-entity-search"
                                placeholder="Type symbol or name..."
                                value=${query.toUpperCase()}
                                onInput=${onSearchInput}
                                onKeyDown=${onSearchKeyDown}
                                autocomplete="off"
                                spellcheck="false"
                                style="background: transparent; position: relative; z-index: 1;"
                            />
                        </div>
                        ${selectedEntity ? html`
                            <div style="padding: 6px 0; color: #4f4; font-size: 13px;">
                                Selected: ${selectedEntity.symbol} - ${selectedEntity.name}
                                ${selectedPrice != null ? html` <span style="color: var(--fg-muted, #888);">(current: ${selectedPrice.toFixed(2)})</span>` : ''}
                            </div>
                        ` : suggestions.length > 0 ? html`
                            <ul style="max-height: 200px; overflow: auto; border: 1px solid #444; background: #111; padding: 4px 0; margin: 4px 0 0 0; list-style: none;">
                                ${suggestions.map((e, i) => html`
                                    <li
                                        key=${e.pbCode}
                                        style="padding: 5px 10px; cursor: pointer; display: flex; justify-content: space-between; gap: 8px; background: ${i === activeIdx ? '#333' : 'transparent'};"
                                        onMouseDown=${ev => ev.preventDefault()}
                                        onClick=${() => { setActiveIdx(i); selectEntity(e); }}
                                    >
                                        <span><span style="font-weight: bold;">${e.symbol}</span> <span style="opacity: 0.7;">${e.name}</span></span>
                                        <span style="opacity: 0.4; font-size: 12px;">${e.tag}</span>
                                    </li>
                                `)}
                            </ul>
                        ` : query.trim() ? html`
                            <div style="padding: 8px; color: #888; font-style: italic;">No matches</div>
                        ` : null}
                    </div>

                    ${selectedEntity ? html`
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <label style="width: 80px; font-size: 14px;">When:</label>
                            <select data-testid="alert-condition" value=${condition} onChange=${e => setCondition(e.target.value)}
                                class="command-line" style="font-size: 14px; height: auto; padding: 4px 8px;">
                                <option value="above">Price goes ABOVE</option>
                                <option value="below">Price goes BELOW</option>
                            </select>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <label style="width: 80px; font-size: 14px;">Target:</label>
                            <input ref=${priceInputRef} data-testid="alert-target-price" type="number" step="any" value=${targetPrice}
                                onInput=${e => setTargetPrice(e.target.value)} placeholder="Enter target price/rate"
                                onKeyDown=${e => { if (e.key === 'Enter') { e.preventDefault(); doSubmit(); } }}
                                class="command-line" style="font-size: 14px; height: auto; padding: 4px 8px;" />
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="flex justify-between items-center p-3 flex-shrink-0">
                <${Button} class="btn modal green" data-testid="btn-submit-alert"
                    onClick=${doSubmit}
                    disabled=${!selectedEntity || !targetPrice}>Submit</button>
                <${Button} class="btn modal" onClick=${onClose}>Close</button>
            </div>
        <//>`;
    }

    // List view
    return html`<${Modal} show=${true} onClose=${onClose} style="display: flex; flex-direction: column; --modal-w: 560px; --modal-h: auto;">
        <div class="flex-1 min-h-0 p-3 overflow-y-auto">
            <div class="text-lg font-bold text-center">Price Alerts</div>
            <br/>
            ${playerAlerts.length === 0 ? html`
                <div style="text-align: center; color: var(--fg-muted, #888); padding: 20px; font-size: 14px;">
                    No alerts set. Click "New Alert" to create one.
                </div>
            ` : html`
                <div style="display: flex; flex-direction: column; gap: 2px; max-height: 400px; overflow-y: auto;">
                    <div style="display: flex; gap: 8px; font-size: 13px; color: var(--fg-muted, #888); padding: 6px 8px; border-bottom: 1px solid var(--border-light, #333); font-weight: bold;">
                        <span style="flex: 2;">Asset</span>
                        <span style="flex: 1;">Condition</span>
                        <span style="flex: 1; text-align: right;">Target</span>
                        <span style="flex: 1; text-align: right;">Current</span>
                        <span style="width: 32px;"></span>
                    </div>
                    ${playerAlerts.map(a => {
                        const name = resolveEntityName(a.entityId, allCompanies);
                        const current = getCurrentPrice(a.entityId, allCompanies, allSecurities);
                        const isRate = a.entityId >= 3010 && a.entityId <= 3013;
                        const suffix = isRate ? '%' : '';
                        return html`
                            <div key=${a.slot} style="display: flex; gap: 8px; align-items: center; padding: 6px 8px; border-radius: 4px; font-size: 14px;"
                                data-testid="alert-row">
                                <span style="flex: 2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${name}</span>
                                <span style="flex: 1; color: ${a.direction === 'UP' ? '#22c55e' : '#ef4444'};">
                                    ${a.direction === 'UP' ? 'Above' : 'Below'}
                                </span>
                                <span style="flex: 1; text-align: right;">${a.displayPrice?.toFixed(2) ?? a.targetPrice?.toFixed(2) ?? '?'}${suffix}</span>
                                <span style="flex: 1; text-align: right;">${current != null ? current.toFixed(2) + suffix : 'N/A'}</span>
                                <${Button} class="btn btn-sm" style="width: 32px; color: #ef4444;"
                                    onClick=${() => handleDelete(a.slot)} data-testid="btn-delete-alert" title="Delete alert">\u00d7<//>
                            </div>
                        `;
                    })}
                </div>
            `}
        </div>
        <div class="flex justify-between items-center p-3 flex-shrink-0">
            <${Button} class="btn modal green" data-testid="btn-create-alert" onClick=${() => setView('create')}>New Alert</button>
            <${Button} class="btn modal" onClick=${onClose}>Close</button>
        </div>
    <//>`;
}
