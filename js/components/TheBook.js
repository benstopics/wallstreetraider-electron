/**
 * TheBook — Full-screen Layer 1 master portfolio view (Req 2.1 / 2.3)
 *
 * Replaces PlayerView as the canonical "what do I own?" view.
 * Summary bar → entity filter → filtered tabs (Stocks & Bonds, Loans, Commodities, Options,
 * Swaps, Advances, Cashflow, Financials, My Companies) → controlled companies section.
 *
 * DEVIATION NOTE (Req 2.1 — 9-column unified table):
 *   Backend delivers portfolio data as pre-formatted BSTR text arrays, not structured rows.
 *   Cost Basis, Quantity, P&L per-row are not available as structured fields.
 *   The tab-based approach (delegating to PortfolioTab, LoansTab, CommoditiesTab, OptionsTab)
 *   is retained as a documented deviation. Each tab has inline Sell/Cover buttons per row.
 *   TODO(backend): expose structured portfolio rows with CostBasis/Qty/PL fields per row.
 *
 * DEVIATION NOTE (Req 2.1 — sort/filter controls):
 *   Entity filter is implemented (see EntityFilter below).
 *   Sector and performance filters require structured row data — not available from text arrays.
 *   TODO(backend): expose structured rows so client-side sort/filter can be applied.
 *
 * DEVIATION NOTE (Req 2.1 — P&L today, position count in SummaryBar):
 *   Backend does not expose a daily P&L or total position count field.
 *   Shown as "—" until backend support is added.
 *   TODO(backend): add plToday and positionCount to game_state JSON.
 *
 * DEVIATION NOTE (Req 2.1 — controlled company revenue/margin/cash/debt):
 *   controlledCompanies from backend only contains id/name/symbol.
 *   allCompanies adds price/marketCap/priceChange. Revenue, profit margin, cash, debt
 *   are not in the current API. Shown as "—" until backend adds them.
 *   TODO(backend): add revenue, profitMargin, companyCash, companyDebt to
 *   controlledCompanies or a separate endpoint.
 *
 * Phase 2 navigation: clicking a controlled company → CompanyManagement via api.navigateTo.
 */
import { html, useState, useEffect, useMemo } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import PortfolioTab from './PortfolioTab.js';
import LoansTab from './LoansTab.js';
import CommoditiesTab from './CommoditiesTab.js';
import OptionsTab from './OptionsTab.js';
import InterestRateSwapsTab from './InterestRateSwapsTab.js';
import CashflowTab from './CashflowTab.js';
import FinancialsTab from './FinancialsTab.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import Button from './Button.js';
import OwnershipGraph from './OwnershipGraph.js';
import { renderLines, insertCurrencySymbols, formatCurrency } from './helpers.js';
import * as api from '../api.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import { useCookie } from '../hooks/useCookie.js';

const Tab = Tabs.Tab;

// ── Health dot for a controlled company ──────────────────────────────────────
function HealthDot({ price, oldPrice }) {
    const color = price > oldPrice ? '#22c55e' : price < oldPrice ? '#ef4444' : '#eab308';
    const label = price > oldPrice ? 'Up' : price < oldPrice ? 'Down' : 'Flat';
    return html`
        <span title=${`Price ${label}`} style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:4px;flex-shrink:0;"></span>
    `;
}

// ── Controlled companies section ──────────────────────────────────────────────
function ControlledCompaniesSection({ companies }) {
    const dlrSign = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro = api.useGameStore(s => s.gameState.euro) || '';
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];

    const enriched = useMemo(() => {
        const map = new Map((allCompanies || []).map(c => [c.id, c]));
        return (companies || []).map(c => {
            const full = map.get(c.id) || {};
            const price = full.price ?? 0;
            const oldPrice = full.oldPrice ?? price;
            const pctChange = oldPrice > 0 ? ((price - oldPrice) / oldPrice * 100) : 0;
            const mktCap = full.marketCap ?? null;
            return { ...c, price, oldPrice, pctChange, mktCap };
        });
    }, [companies, allCompanies]);

    if (!enriched.length) return html`<div style="opacity:0.5; padding:8px;">No controlled companies.</div>`;

    const fmt = v => `${dlrSign}${formatCurrency(v)}${euro}`;
    const fmtM = v => v != null ? `${dlrSign}${formatCurrency(v / 1e6)}M${euro}` : '—';

    return html`
        <div class="flex flex-col gap-1">
            <!-- Column headers -->
            <div class="flex flex-row items-center gap-2" style="padding:4px 8px; font-size:10px; opacity:0.5; font-weight:600;">
                <span style="min-width:10px;">&nbsp;</span>
                <span style="min-width:60px;">Ticker</span>
                <span style="flex:1; min-width:120px;">Name</span>
                <span style="min-width:75px; text-align:right;">Price</span>
                <span style="min-width:60px; text-align:right;">Chg%</span>
                <span style="min-width:80px; text-align:right;">Mkt Cap</span>
                <!-- TODO(backend): Revenue, Margin, Cash, Debt columns when API provides them -->
                <span style="min-width:70px; text-align:right; opacity:0.5;">Revenue</span>
                <span style="min-width:60px; text-align:right; opacity:0.5;">Margin</span>
                <span style="min-width:70px; text-align:right; opacity:0.5;">Cash</span>
                <span style="min-width:70px; text-align:right; opacity:0.5;">Debt</span>
            </div>
            ${enriched.map(c => html`
                <div key=${c.id}
                    class="flex flex-row items-center gap-2 panel cursor-pointer hover:bg-blue-900"
                    style="padding:6px 8px; border-radius:4px;"
                    onClick=${() => api.navigateTo('company-management', c.id)}
                >
                    <${HealthDot} price=${c.price} oldPrice=${c.oldPrice} />
                    <span style="font-weight:600; min-width:60px; white-space:nowrap;">${c.symbol || c.name}</span>
                    <span style="flex:1; min-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${c.name}</span>
                    <span style="min-width:75px; text-align:right; white-space:nowrap;">${fmt(c.price)}</span>
                    <span style="min-width:60px; text-align:right; white-space:nowrap; color:${c.pctChange >= 0 ? '#22c55e' : '#ef4444'};">
                        ${c.pctChange >= 0 ? '+' : ''}${c.pctChange.toFixed(2)}%
                    </span>
                    <span style="min-width:80px; text-align:right; white-space:nowrap;">${fmtM(c.mktCap)}</span>
                    <!-- TODO(backend): show real revenue, margin, cash, debt when available -->
                    <span style="min-width:70px; text-align:right; opacity:0.4; white-space:nowrap;">—</span>
                    <span style="min-width:60px; text-align:right; opacity:0.4; white-space:nowrap;">—</span>
                    <span style="min-width:70px; text-align:right; opacity:0.4; white-space:nowrap;">—</span>
                    <span style="min-width:70px; text-align:right; opacity:0.4; white-space:nowrap;">—</span>
                </div>
            `)}
        </div>
    `;
}

// ── Summary bar ───────────────────────────────────────────────────────────────
function SummaryBar() {
    const netWorth  = api.useGameStore(s => s.gameState.netWorth)  ?? 0;
    const cash      = api.useGameStore(s => s.gameState.cash)      ?? 0;
    const totalDebt = api.useGameStore(s => s.gameState.totalDebt) ?? 0;
    const dlrSign   = api.useGameStore(s => s.gameState.dlrSign)   || '$';
    const euro      = api.useGameStore(s => s.gameState.euro)      || '';
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];

    const fmt = v => `${dlrSign}${formatCurrency(v)}${euro}`;

    return html`
        <div class="flex flex-row flex-wrap gap-4 items-center" style="padding:6px 10px; background: rgba(255,255,255,0.05); border-radius:4px; font-size:12px; flex-shrink:0;">
            <span>${insertCurrencySymbols('Net Worth:')} <strong>${fmt(netWorth)}</strong></span>
            <span style="opacity:0.6;">|</span>
            <span>${insertCurrencySymbols('Cash:')} <strong>${fmt(cash)}</strong></span>
            <span style="opacity:0.6;">|</span>
            <span>${insertCurrencySymbols('Debt:')} <strong class="negative">${fmt(totalDebt)}</strong></span>
            <span style="opacity:0.6;">|</span>
            <span>Controlled: <strong>${controlledCompanies.length}</strong></span>
            <span style="opacity:0.6;">|</span>
            <!-- TODO(backend): show real P&L today when backend exposes plToday field -->
            <span style="opacity:0.6;" title="P&L Today: not available — TODO(backend): add plToday to game_state">P&L Today: <strong>—</strong></span>
            <span style="opacity:0.6;">|</span>
            <!-- TODO(backend): show real position count when backend exposes positionCount field -->
            <span style="opacity:0.6;" title="Positions: not available — TODO(backend): add positionCount to game_state">Positions: <strong>—</strong></span>
        </div>
    `;
}

// ── Entity filter bar ─────────────────────────────────────────────────────────
// Lets user switch which entity's portfolio is shown in the tabs (Req 2.1 filter).
function EntityFilter() {
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const playerId = api.useGameStore(s => s.gameState.playerId) || api.HUMAN1_ID;
    const playerName = api.useGameStore(s => s.gameState.playerName) || 'Player';
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];

    if (!controlledCompanies.length) return null;

    const entities = [
        { id: playerId, label: playerName },
        ...controlledCompanies.map(c => ({ id: c.id, label: c.symbol || c.name })),
    ];

    return html`
        <div class="flex flex-row flex-wrap gap-1 items-center" style="flex-shrink:0; font-size:11px;">
            <span style="opacity:0.5; margin-right:4px;">View as:</span>
            ${entities.map(e => html`
                <button key=${e.id}
                    class="btn text-xs"
                    style=${`padding:2px 8px; ${actingAsId === e.id ? 'background:rgba(59,130,246,0.4); border-color:#3b82f6;' : ''}`}
                    onClick=${() => api.changeActingAs(e.id)}
                >${e.label}</button>
            `)}
        </div>
    `;
}

// ── TheBook main component ────────────────────────────────────────────────────
export default function TheBook() {
    const buttonProps = useActionButtonProps();

    const cashflowProjection   = api.useGameStore(s => s.gameState.cashflowProjection);
    const advances             = api.useGameStore(s => s.gameState.advances);
    const hyperlinkRegex       = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const controlledCompanies  = api.useGameStore(s => s.gameState.controlledCompanies) || [];
    const shareholderGraphSetting = api.useGameStore(s => s.gameState.shareholderGraphSetting);

    const [showCorpGraph, setShowCorpGraph] = useState(shareholderGraphSetting);

    // Set actingAs to player when first viewing TheBook
    useEffect(() => {
        api.changeActingAs(api.HUMAN1_ID);
    }, []);

    const [savedTab, setSavedTab] = useCookie('theBookTab', 'Stocks & Bonds');
    const [activeTab, setActiveTabInternal] = useState(savedTab);
    const setActiveTab = (tab) => { setActiveTabInternal(tab); setSavedTab(tab); };

    const advancesBarButtons = [
        { ...buttonProps.advanceFunds, buttonClass: "flex-1 mx-1" },
    ];

    return html`
        <div class="flex flex-col h-full gap-2" style="padding:8px; min-height:0;">
            <!-- Summary bar (Req 2.1) -->
            <${SummaryBar} />

            <!-- Entity filter (Req 2.1 — entity filter; only shown when player controls companies) -->
            <${EntityFilter} />

            <!-- Main tabs — tab-based approach per deviation note above -->
            <${Tabs} activeTab=${activeTab} onTabChange=${setActiveTab} style="flex:1;min-height:0;">
                <${Tab} label="Stocks & Bonds" hotkey="s">
                    <${PortfolioTab} />
                <//>
                <${Tab} label="Loans" hotkey="l">
                    <${LoansTab} />
                <//>
                <${Tab} label="Cashflow" hotkey="c">
                    <div class="flex flex-col items-center overflow-x-auto w-full">
                        <${HotkeyButtonBar} buttons=${[buttonProps.browseForSaleItems]} class="flex flex-row items-center gap-2 mb-2" />
                        ${renderLines(cashflowProjection, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                    </div>
                <//>
                <${Tab} label="Options" hotkey="o">
                    <${OptionsTab} />
                <//>
                <${Tab} label="Commodities" hotkey="m">
                    <${CommoditiesTab} />
                <//>
                <${Tab} label="Swaps" hotkey="w">
                    <${InterestRateSwapsTab} />
                <//>
                <${Tab} label="Advances" hotkey="d">
                    <div class="flex flex-col items-center">
                        <${HotkeyButtonBar} buttons=${advancesBarButtons} class="flex flex-row items-center gap-2 mb-2" />
                        <div class="flex flex-col items-center overflow-y-auto min-h-0 w-full">
                            ${renderLines(advances, ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                        </div>
                    </div>
                <//>
                <${Tab} label="Financials" hotkey="f">
                    <${FinancialsTab} />
                <//>
                <${Tab} label="My Companies" hotkey="p">
                    <div class="flex flex-col h-full gap-2">
                        <div class="flex flex-row items-center gap-2 flex-shrink-0">
                            <${Button} class="btn text-xs" onClick=${() => setShowCorpGraph(!showCorpGraph)}>
                                ${showCorpGraph ? 'Show Table' : 'Show Graph'}
                            <//>
                        </div>
                        ${showCorpGraph ? html`
                            <div class="flex-1 min-h-0 overflow-auto">
                                <${OwnershipGraph} showOwners=${false} showSubsidiaries=${true} />
                            </div>
                        ` : html`
                            <div class="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
                                <${ControlledCompaniesSection} companies=${controlledCompanies} />
                            </div>
                        `}
                    </div>
                <//>
            <//>

            <!-- Market Action buttons (Startup, Browse For Sale Items) -->
            <div class="flex flex-row items-center gap-2 flex-shrink-0" style="padding:4px 0;">
                <span style="font-size:11px; opacity:0.5;">Market:</span>
                <${Button} class="btn text-xs" onClick=${() => api.startup()}>
                    ${insertCurrencySymbols('Startup')}
                <//>
                <${Button} class="btn text-xs" onClick=${() => api.viewForSaleItems()}>
                    ${insertCurrencySymbols('Browse For Sale Items')}
                <//>
            </div>
        </div>
    `;
}
