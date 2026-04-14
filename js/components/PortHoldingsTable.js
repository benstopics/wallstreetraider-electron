import { html, useState, useMemo, useEffect, useRef } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';

// ─── Formatters ──────────────────────────────────────────────────────────────

const fmtM = v => {
    if (v == null || !Number.isFinite(v)) return '—';
    const a = Math.abs(v);
    if (a >= 1e6) return '$' + (a / 1e6).toFixed(2) + 'T';
    if (a >= 1e3) return '$' + (a / 1e3).toFixed(2) + 'B';
    return '$' + a.toFixed(1) + 'M';
};
const fmtPct = v => (v == null || !Number.isFinite(v)) ? '—' : v.toFixed(2) + '%';
const fmtPrice = v => (v == null || !Number.isFinite(v)) ? '—' : '$' + v.toFixed(2);
const fmtQty = (v, unit) => {
    if (v == null) return '—';
    if (unit === 'pct') return Math.abs(v).toFixed(1) + '%';
    if (unit === 'contracts') return Math.abs(v) + ' ct';
    if (unit === 'units') return Number(v).toLocaleString();
    return v;
};
const pnlSign = v => (v > 0 ? '+' : '');
const pnlPct = (pnl, basis) => {
    if (pnl == null || basis == null || Math.abs(basis) < 0.0001) return null;
    return (pnl / Math.abs(basis)) * 100;
};

// Credit rating integer → label (from DatabaseSearchView.js convention)
const CRED_LABELS = ['D', 'D', 'C', 'CC', 'CCC', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA'];
const credLabel = r => (r != null && r >= 0 && r <= 10) ? CRED_LABELS[r] : null;

// Credit rating label → CSS color class
const CRED_COLOR = {
    AAA: 'var(--color-positive)', AA: 'var(--color-positive)',
    A:   'var(--color-info)',     BBB: 'var(--color-warning)',
    BB:  '#e08040',               B: '#c06040',
    CCC: 'var(--color-negative)', CC: 'var(--color-negative)',
    C:   'var(--color-negative)', D: 'var(--color-negative)',
};

// ─── COND_COLS: which extra columns appear per filter ────────────────────────
const COND_COLS = {
    ALL:       { strike: false, notional: false, inttype: false, estprofit: false },
    STOCK:     { strike: false, notional: false, inttype: false, estprofit: false },
    SHORT:     { strike: false, notional: false, inttype: false, estprofit: false },
    CORP_BOND: { strike: false, notional: true,  inttype: false, estprofit: false },
    GOVT_BOND: { strike: false, notional: true,  inttype: false, estprofit: false },
    OPTION:    { strike: true,  notional: false, inttype: false, estprofit: false },
    FUTURE:    { strike: false, notional: true,  inttype: false, estprofit: false },
    PHYSICAL:  { strike: false, notional: false, inttype: false, estprofit: false },
    SWAP:      { strike: false, notional: true,  inttype: true,  estprofit: true  },
};

// ─── Row normaliser ──────────────────────────────────────────────────────────
// Converts raw C++ JSON rows into a uniform display shape.
function normaliseRow(r) {
    // Resolve display assetType (GOVT_BOND_L/S → GOVT_BOND)
    const rawType = r.assetType || '';
    const dispType = (rawType === 'GOVT_BOND_L' || rawType === 'GOVT_BOND_S')
        ? 'GOVT_BOND' : rawType;

    const base = {
        _raw: r,
        assetType: dispType,
        rawAssetType: rawType,           // A.4: preserve original type string
        companyId: r.companyId ?? null,
        name: r.name || '—',
        symbol: r.symbol || null,
        ownerCompanyId: r.ownerCompanyId ?? null,   // D.2
        ownerName:      r.ownerName      ?? null,   // D.2
        ownerSymbol:    r.ownerSymbol    ?? null,   // D.2
        holderId: r.holderId ?? null,
        position: null,
        quantity: null,
        quantityUnit: null,
        price: null,
        marketValue: null,
        costBasis: null,
        pnl: null,
        yield: null,
        yieldLabel: null,
        creditRating: null,
        expiry: null,
        strike: null,
        notional: null,
        interestType: null,
        estProfit: null,
        optType: null,
        inTheMoney: null,
        isGrant: false,
        isConvertible: false,
        isDefaulted: false,
        slot: null,
        commodityId: null,
    };

    switch (dispType) {
        case 'STOCK':
        case 'SHORT': {
            const isSht = dispType === 'SHORT';
            return { ...base,
                position: isSht ? 'SHORT' : 'LONG',
                quantity: r.pct, quantityUnit: 'pct',
                price: r.price,
                marketValue: r.marketValue,
                costBasis: r.costBasis,
                pnl: r.pnl,
                yield: r.divYield ?? null,
                yieldLabel: 'Div Yield',
            };
        }
        case 'OPTION': {
            const expM = String(r.expiryMonth ?? '').padStart(2, '0');
            return { ...base,
                companyId: r.companyId,
                position: r.posType || 'LONG',
                quantity: r.numContracts, quantityUnit: 'contracts',
                price: r.underlyingPrice,
                marketValue: r.marketValue,
                costBasis: r.costBasis,
                pnl: r.pnl,
                expiry: expM + '/' + (r.expiryYear ?? ''),
                strike: r.strike,
                optType: r.optType,
                inTheMoney: r.inTheMoney ?? false,
                isGrant: r.isGrant ?? false,
            };
        }
        case 'GOVT_BOND': {
            return { ...base,
                position: rawType === 'GOVT_BOND_S' ? 'SHORT' : 'LONG',
                quantity: r.faceValue, quantityUnit: 'units',   // A.3
                price: r.price,
                marketValue: r.marketValue,
                costBasis: r.costBasis,
                pnl: r.pnl,
                yield: r.coupon, yieldLabel: 'Coupon',
                creditRating: typeof r.credRating === 'string' ? r.credRating : null,  // A.2
                expiry: r.maturity || null,
                notional: r.faceValue,
            };
        }
        case 'CORP_BOND': {
            return { ...base,
                companyId: r.companyId,
                position: 'LONG',
                price: r.price,
                marketValue: r.marketValue,
                costBasis: r.costBasis,
                pnl: r.pnl,
                yield: r.ytm ?? null, yieldLabel: 'YTM~',
                creditRating: credLabel(r.credRating),
                expiry: r.maturity || null,
                notional: r.faceValue,
                isConvertible: r.isConvertible ?? false,
                isDefaulted: r.isDefaulted ?? false,
            };
        }
        case 'FUTURE': {
            const sm = String(r.settleMonth ?? '').padStart(2, '0');
            return { ...base,
                position: r.posType || 'LONG',
                quantity: r.contracts, quantityUnit: 'contracts',
                price: r.spotPrice,
                marketValue: r.marketValue,
                costBasis: r.costBasis,
                pnl: r.pnl,
                expiry: sm + '/' + (r.settleYear ?? ''),
                notional: r.costBasis,
                slot: r.slot ?? null,
                commodityId: r.commodityId ?? null,
            };
        }
        case 'PHYSICAL': {
            return { ...base,
                position: 'LONG',
                quantity: r.units, quantityUnit: 'units',
                price: r.spotPrice,
                marketValue: r.marketValue,
                costBasis: r.costBasis,
                pnl: r.pnl,
                slot: r.slot ?? null,
                commodityId: r.commodityId ?? null,
            };
        }
        case 'SWAP': {
            const intTypeMap = { P: 'PRIME', L: 'LONG BOND', S: 'SHORT BOND' };
            return { ...base,
                position: r.posType || 'LONG',
                yield: r.fixedRate, yieldLabel: 'Fixed Rate',
                notional: r.notional,
                interestType: intTypeMap[r.intType] || r.intType || null,
                estProfit: r.pnl,
                pnl: null,
                marketValue: null,
                slot: r.slot ?? null,
            };
        }
        default:
            return base;
    }
}

// ─── Inline spark chart — same style as StockTicker MiniSpark ────────────────
const HOLDING_SPARK_CACHE_MAX = 200;
const holdingSparkCache = new Map();

function PortSpark({ companyId, isUp }) {
    const [prices, setPrices] = useState(null);

    useEffect(() => {
        if (!companyId) return;
        if (holdingSparkCache.has(companyId)) { setPrices(holdingSparkCache.get(companyId)); return; }
        let active = true;
        api.getAssetChart(companyId).then(data => {
            if (!active) return;
            const p = data?.prices;
            if (p && p.length >= 2) {
                if (holdingSparkCache.size >= HOLDING_SPARK_CACHE_MAX)
                    holdingSparkCache.delete(holdingSparkCache.keys().next().value);
                holdingSparkCache.set(companyId, p);
                setPrices(p);
            }
        }).catch(() => {});
        return () => { active = false; };
    }, [companyId]);

    if (!companyId || !prices || prices.length < 2)
        return html`<span style="color:var(--fg-muted)">—</span>`;

    const min = Math.min(...prices), max = Math.max(...prices);
    const range = max - min || 1;
    const w = 56, h = 22;
    const pts = prices.map((p, i) =>
        `${(i / (prices.length - 1)) * w},${h - ((p - min) / range) * h}`
    ).join(' ');
    const color = isUp ? 'var(--color-positive)' : 'var(--color-negative)';

    return html`<svg class="stock-ticker-spark" width=${w} height=${h} viewBox="0 0 56 ${h}">
        <polyline points=${pts} fill="none" stroke=${color} stroke-width="1.5" />
    </svg>`;
}

// ─── Type chip ───────────────────────────────────────────────────────────────
const TYPE_COLORS = {
    STOCK:     { bg: 'rgba(122,96,212,0.18)', fg: '#a090e0' },
    SHORT:     { bg: 'rgba(200,64,64,0.15)',  fg: '#d07070' },
    CORP_BOND: { bg: 'rgba(200,144,42,0.15)', fg: '#c8a050' },
    GOVT_BOND: { bg: 'rgba(58,158,106,0.15)', fg: '#5ab882' },
    OPTION:    { bg: 'rgba(58,127,212,0.15)', fg: '#70a8e0' },
    FUTURE:    { bg: 'rgba(42,158,138,0.15)', fg: '#50c8b0' },
    PHYSICAL:  { bg: 'rgba(42,158,138,0.10)', fg: '#40a090' },
    SWAP:      { bg: 'rgba(160,100,200,0.15)', fg: '#b08ad4' },
};
function TypeChip({ type }) {
    const c = TYPE_COLORS[type] || { bg: 'rgba(100,100,100,0.15)', fg: '#999' };
    const label = type.replace('_', ' ');
    return html`<span style="display:inline-block;padding:1px 5px;border-radius:2px;font-size:10px;font-weight:600;letter-spacing:0.05em;background:${c.bg};color:${c.fg}">${label}</span>`;
}

// ─── Single table row ─────────────────────────────────────────────────────────
function PortRow({ row, cond, onSymbolClick, onAction }) {
    const pnlV    = row.pnl;
    const pnlColor = pnlV == null ? 'var(--fg-muted)'
                   : pnlV > 0    ? 'var(--color-positive)'
                   : pnlV < 0    ? 'var(--color-negative)'
                   : 'var(--fg-muted)';
    const pnlPctV  = pnlPct(pnlV, row.costBasis);
    const posColor = row.position === 'SHORT' ? 'var(--color-negative)' : 'var(--color-positive)';
    const absMarketVal = (row.marketValue != null) ? Math.abs(row.marketValue) : null;

    const optTag = row.optType
        ? html` <span style="font-size:9px;color:var(--fg-muted)">${row.optType}${row.isGrant ? ' ★' : ''}</span>`
        : null;

    // G.2a: company name hyperlink — matches OverviewPanel style (#60a5fa, hover:underline)
    const companyCell = row.companyId
        ? html`<span class="hover:underline" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;max-width:180px;color:#60a5fa;cursor:pointer" onClick=${() => onSymbolClick(row.companyId)}>${row.name}${optTag}</span>`
        : html`<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;max-width:180px">${row.name}${optTag}</span>`;

    const credR = row.creditRating;
    const credColor = credR ? (CRED_COLOR[credR] || 'var(--fg-muted)') : null;
    const ratingCell = credR
        ? html`<span style="padding:1px 5px;border-radius:2px;font-size:10px;font-weight:600;background:rgba(0,0,0,0.25);color:${credColor}">${credR}${row.isConvertible ? ' cv' : ''}${row.isDefaulted ? ' ⚠' : ''}</span>`
        : html`<span style="color:var(--fg-muted)">—</span>`;

    // G.2b: Owner column — matches OverviewPanel hyperlink style
    const viaCell = row.ownerCompanyId
        ? html`<span class="hover:underline" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;max-width:130px;color:#60a5fa;cursor:pointer" onClick=${() => onSymbolClick(row.ownerCompanyId)}>${row.ownerName}</span>`
        : html`<span style="color:var(--fg-muted)">—</span>`;

    const actions = html`<${RowActions} row=${row} onAction=${onAction} />`;

    // C.2: use db-table td/th classes; num class for right-aligned
    const td  = (content) => html`<td>${content}</td>`;
    const tdR = (content, style='') => html`<td class="num" style=${style || undefined}>${content}</td>`;

    const trStyle = row.ownerCompanyId ? 'background:rgba(96,165,250,0.05)' : undefined;
    return html`<tr style=${trStyle}>
        ${td(html`<${TypeChip} type=${row.assetType} />`)}
        ${td(viaCell)}
        ${td(companyCell)}
        ${td(row.position ? html`<span style="color:${posColor}">${row.position}</span>` : html`<span style="color:var(--fg-muted)">—</span>`)}
        ${tdR(fmtQty(row.quantity, row.quantityUnit))}
        ${tdR(fmtPrice(row.price))}
        ${td(html`<${PortSpark} companyId=${row.companyId ?? null} isUp=${row.pnl == null || row.pnl >= 0} />`)}
        ${tdR(absMarketVal != null ? fmtM(absMarketVal) : '—')}
        ${tdR(row.costBasis != null ? fmtM(Math.abs(row.costBasis)) : '—')}
        ${tdR(pnlV != null ? pnlSign(pnlV) + fmtM(pnlV) : '—', pnlV != null ? 'color:' + pnlColor : '')}
        ${tdR(pnlPctV != null ? pnlSign(pnlPctV) + fmtPct(pnlPctV) : '—', pnlPctV != null ? 'color:' + pnlColor : '')}
        ${tdR(row.yield != null ? fmtPct(row.yield) : '—')}
        ${td(ratingCell)}
        ${td(row.expiry || html`<span style="color:var(--fg-muted)">—</span>`)}
        ${cond.strike    ? tdR(row.strike != null ? fmtPrice(row.strike) : '—') : null}
        ${cond.notional  ? tdR(row.notional != null ? fmtM(row.notional) : '—') : null}
        ${cond.inttype   ? td(row.interestType || html`<span style="color:var(--fg-muted)">—</span>`) : null}
        ${cond.estprofit ? tdR(row.estProfit != null
            ? html`<span style="color:${row.estProfit >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'}">${pnlSign(row.estProfit) + fmtM(row.estProfit)}</span>`
            : '—') : null}
        ${td(actions)}
    </tr>`;
}

// ─── Inline action buttons ────────────────────────────────────────────────────
function RowActions({ row, onAction }) {
    // F.1: pass label (not kind) so handleAction can match 'Sell', 'Buy More', etc.
    // F.5A: use .btn color classes
    const btn = (label, color, disabled) => html`<button
        class=${'btn ' + color + (disabled ? ' disabled' : '')}
        disabled=${disabled || undefined}
        title=${disabled ? 'Not yet available' : ''}
        onClick=${disabled ? null : () => onAction(row, label)}
        style="margin-right:3px;height:auto">
        ${label}
    </button>`;

    switch (row.assetType) {
        case 'STOCK': {
            const canBuy   = row.quantity < 100;
            const canShort = row.quantity < 100 && !row.ownerCompanyId;
            return html`<div style="display:flex;gap:3px">
                ${btn('Sell','red',false)}
                ${canBuy   ? btn('Buy More','green',false) : null}
                ${canShort ? btn('Short','red',false)      : null}
            </div>`;
        }
        case 'SHORT':     return btn('Cover','blue',false);
        case 'CORP_BOND': return btn('Sell','red',false);
        case 'GOVT_BOND': return btn('Sell','red',false);
        case 'OPTION':
            if (row.position === 'LONG') {
                return html`${btn('Sell','red',false)}${btn('Exercise','blue',!row.inTheMoney)}`;
            }
            return btn('Cover','blue',false);
        case 'FUTURE':   return btn('Close','red',false);
        case 'PHYSICAL': return btn('Sell','red',false);
        case 'SWAP':     return html`${btn('Details','',false)}${btn('Terminate','red',false)}`;
        default:         return null;
    }
}

// ─── Pill bar ─────────────────────────────────────────────────────────────────
const PILLS = [
    { key: 'ALL', label: 'All' },
    { key: 'STOCK', label: 'Stocks' },
    { key: 'SHORT', label: 'Shorts' },
    { key: 'CORP_BOND', label: 'Corp Bonds' },
    { key: 'GOVT_BOND', label: 'Govt Bonds' },
    { key: 'OPTION', label: 'Options' },
    { key: 'FUTURE', label: 'Futures' },
    { key: 'PHYSICAL', label: 'Physical' },
    { key: 'SWAP', label: 'Swaps' },
];

// ─── Sort header cell ─────────────────────────────────────────────────────────
// C.2: th uses cursor-pointer, num class for right-aligned; no large inline style block
function Th({ col, label, sortCol, sortDir, onSort, right }) {
    const icon = sortCol === col ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';
    return html`<th
        class=${right ? 'num' : ''}
        onClick=${() => onSort(col)}
        style="cursor:pointer;user-select:none;white-space:nowrap"
        >${label}${icon}</th>`;
}

const HOLDINGS_CUSTOM_KEY = 'holdingsCriteria';

// ─── Main component ───────────────────────────────────────────────────────────
export default function PortHoldingsTable() {
    const rawHoldings         = api.useGameStore(s => s.gameState?.portHoldings ?? []);
    const controlledCompanies = api.useGameStore(s => s.gameState?.controlledCompanies ?? []);
    const customData          = api.useGameStore(s => s.gameState?.customData ?? {});

    const controlledIds = useMemo(
        () => new Set((controlledCompanies || []).map(c => c.id)),
        [controlledCompanies]
    );

    const [filter,       setFilter]       = useState('ALL');
    const [sortCol,      setSortCol]      = useState('marketValue');
    const [sortDir,      setSortDir]      = useState('desc');
    const [hideSubsid,   setHideSubsid]   = useState(false);

    const restoredRef = useRef(false);

    // Restore from customData on first load (save-persistent)
    useEffect(() => {
        if (restoredRef.current) return;
        const saved = customData?.[HOLDINGS_CUSTOM_KEY];
        if (!saved) return;
        restoredRef.current = true;
        if (saved.filter)              setFilter(saved.filter);
        if (saved.sortCol)             setSortCol(saved.sortCol);
        if (saved.sortDir)             setSortDir(saved.sortDir);
        if (saved.hideSubsid != null)  setHideSubsid(saved.hideSubsid);
    }, [customData]);

    // Persist criteria to customData on change
    useEffect(() => {
        if (!restoredRef.current) return;
        api.setCustomData({ [HOLDINGS_CUSTOM_KEY]: { filter, sortCol, sortDir, hideSubsid } });
    }, [filter, sortCol, sortDir, hideSubsid]);

    // Normalise once per raw change
    const rows = useMemo(() => (rawHoldings || []).map(normaliseRow), [rawHoldings]);

    // Filter
    const filtered = useMemo(() => {
        const base = filter === 'ALL' ? rows : rows.filter(r => r.assetType === filter);
        return base.filter(r => {
            if (r.ownerCompanyId !== null && !controlledIds.has(r.ownerCompanyId)) return false;
            if (hideSubsid && r.ownerCompanyId !== null) return false;
            return true;
        });
    }, [rows, filter, controlledIds, hideSubsid]);

    // Sort
    const sorted = useMemo(() => {
        const arr = [...filtered];
        arr.sort((a, b) => {
            const av = a[sortCol], bv = b[sortCol];
            // Nulls always sort to end regardless of direction
            if (av == null && bv == null) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;
            const an = Number(av), bn = Number(bv);
            if (!isNaN(an) && !isNaN(bn))
                return sortDir === 'asc' ? an - bn : bn - an;
            if (typeof av === 'string' && typeof bv === 'string')
                return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
            return sortDir === 'asc' ? av - bv : bv - av;
        });
        return arr;
    }, [filtered, sortCol, sortDir]);

    const handleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir(col === 'name' || col === 'assetType' ? 'asc' : 'desc'); }
    };

    const handleFilter = (key) => setFilter(f => f === key && key !== 'ALL' ? 'ALL' : key);

    const handleSymbolClick = async (companyId) => {
        await api.setViewAsset(companyId);
    };

    // Full action routing — passes ownerCompanyId as actingAsId for subsidiary rows
    const handleAction = async (row, kind) => {
        const t = row.assetType;
        // holderId is always populated by the backend with the exact entity that holds the asset.
        // Always pass it as actAs (intParam2) so ui.inc sets PlayCo& explicitly.
        const actAs = row.holderId ?? 0;

        if (t === 'STOCK') {
            if (kind === 'Sell')     await api.sellStock(row.companyId, actAs);
            if (kind === 'Buy More') await api.buyStock(row.companyId, actAs);
        }
        if (t === 'SHORT' && kind === 'Cover') {
            await api.coverShortStock(row.companyId, actAs);
        }
        if (t === 'CORP_BOND' && kind === 'Sell') {
            await api.sellCorporateBond(row.companyId, actAs);
        }
        if (t === 'GOVT_BOND' && kind === 'Sell') {
            if (row.rawAssetType === 'GOVT_BOND_L') await api.sellLongGovtBonds(actAs);
            else                                    await api.sellShortGovtBonds(actAs);
        }
        if (t === 'OPTION') {
            if (kind === 'Sell') {
                if (row.optType === 'CALL') await api.sellCalls(row.slot, actAs);
                else                        await api.sellPuts(row.slot, actAs);
            }
            if (kind === 'Exercise') {
                if (row.optType === 'CALL') await api.exerciseCallOptionsEarly(row.slot, actAs);
                else                        await api.exercisePutOptionsEarly(row.slot, actAs);
            }
        }
        if (t === 'FUTURE' && kind === 'Close' && row.commodityId) {
            if (row.position === 'SHORT') await api.coverShortCommodityFutures(row.commodityId, actAs);
            else                          await api.sellCommodityFutures(row.commodityId, actAs);
        }
        if (t === 'PHYSICAL' && kind === 'Sell' && row.commodityId) {
            await api.sellPhysicalCommodity(row.commodityId, actAs);
        }
        if (t === 'SWAP') {
            if (kind === 'Details')   await api.viewSwapDetails(row.slot, actAs);
            if (kind === 'Terminate') await api.terminateSwap(row.slot, actAs);
        }
        if (t === 'STOCK' && kind === 'Short') {
            await api.shortStock(row.companyId, actAs);
        }
    };

    const cond = COND_COLS[filter] || COND_COLS.ALL;
    const ftCount = sorted.length;
    const tdHeader = (col, label, right) => html`<${Th} col=${col} label=${label} sortCol=${sortCol} sortDir=${sortDir} onSort=${handleSort} right=${right} />`;

    if (!rawHoldings || rawHoldings.length === 0) {
        return html`
            <div class="panel" style="align-items:center;justify-content:center;font-size:12px;gap:8px">
                <div style="color:var(--accent-primary);letter-spacing:0.12em;font-size:11px;font-weight:600">Holdings</div>
                <div>No positions for this entity.</div>
            </div>`;
    }

    return html`
    <div class="panel" style="display:flex;flex-direction:column;overflow:hidden">

      <!-- C.1: panel-header -->
      <div class="panel-header">
        Holdings & Portfolio
      </div>

      <!-- C.3: db-input class for filter pills -->
      <div style="padding:5px 10px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;gap:4px;flex-wrap:wrap;flex-shrink:0">
        ${PILLS.map(p => {
          const tc = TYPE_COLORS[p.key];
          const active = filter === p.key;
          const activeStyle = tc
              ? `border-color:${tc.fg};color:${tc.fg};background:${tc.bg}`
              : 'border-color:var(--accent-secondary);color:var(--accent-secondary)';
          const inactiveStyle = tc ? `color:${tc.fg};opacity:0.65` : '';
          return html`
          <button
            key=${p.key}
            class="db-input"
            onClick=${() => handleFilter(p.key)}
            style="cursor:pointer;${active ? activeStyle : inactiveStyle}">
            ${p.label}
          </button>`;
        })}
        <div style="margin-left:auto">
          <button
            class="db-input"
            onClick=${() => setHideSubsid(v => !v)}
            style="cursor:pointer;${hideSubsid ? 'border-color:var(--accent-secondary);color:var(--accent-secondary)' : ''}">
            Hide Subsidiaries
          </button>
        </div>
      </div>

      <!-- C.2: db-table class -->
      <div style="flex:1;overflow-y:auto;overflow-x:auto;background:var(--bg-primary)">
        <table class="db-table">
          <thead>
            <tr>
              ${tdHeader('assetType',   'Type',      false)}
              ${tdHeader('ownerName',   'Owner',     false)}
              ${tdHeader('name',        'Company',   false)}
              ${tdHeader('position',    'Pos',       false)}
              ${tdHeader('quantity',    'Qty / %',   true)}
              ${tdHeader('price',       'Price',     true)}
              <th style="width:56px">Chart</th>
              ${tdHeader('marketValue', 'Mkt Val',   true)}
              ${tdHeader('costBasis',   'Cost Basis',true)}
              ${tdHeader('pnl',         'P&L',       true)}
              ${tdHeader('pnl',         'P&L %',     true)}
              ${tdHeader('yield',       'Yield/Rate',true)}
              ${tdHeader('creditRating','Rating',    false)}
              ${tdHeader('expiry',      'Expiry',    false)}
              ${cond.strike    ? tdHeader('strike',      'Strike',   true) : null}
              ${cond.notional  ? tdHeader('notional',    'Notional', true) : null}
              ${cond.inttype   ? tdHeader('interestType','Int Type', false): null}
              ${cond.estprofit ? tdHeader('estProfit',   'Est Qtr Profit', true) : null}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map((row, i) => html`<${PortRow}
              key=${row._raw?.slot + '_' + row.assetType + '_' + i}
              row=${row}
              cond=${cond}
              onSymbolClick=${handleSymbolClick}
              onAction=${handleAction}
            />`)}
          </tbody>
        </table>
      </div>

    </div>`;
}
