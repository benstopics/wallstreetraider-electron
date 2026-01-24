import { html, useMemo, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import Modal from './Modal.js';
import Button from './Button.js';

// Helper components using existing iu-* CSS classes
function Pill({ active, label, onClick }) {
    return html`
        <${Button} class=${`iu-pill ${active ? 'active' : ''}`} onClick=${onClick}>
            ${label}
        </button>
    `;
}

function Select({ value, onChange, options }) {
    return html`
        <select class="iu-select" value=${value} onChange=${onChange}>
            ${options.map(o => html`<option value=${o.value}>${o.label}</option>`)}
        </select>
    `;
}

function Checkbox({ checked, onChange, label }) {
    return html`
        <label class="iu-check">
            <input type="checkbox" checked=${!!checked} onChange=${onChange} />
            <span>${label}</span>
        </label>
    `;
}

function SectionTitle({ children }) {
    return html`<div class="iu-section-title">${children}</div>`;
}

function Label({ children }) {
    return html`<div class="iu-label">${children}</div>`;
}

function Row({ children }) {
    return html`<div class="iu-row">${children}</div>`;
}

function Input({ value, onInput, placeholder, className = '', ...rest }) {
    return html`<input class=${`iu-input ${className}`} value=${value} onInput=${onInput} placeholder=${placeholder} ...${rest} />`;
}

// Utility functions
function toNumber(v) {
    if (v == null) return null;
    if (typeof v === 'number' && Number.isFinite(v)) return v;

    let s = String(v).trim();
    if (!s) return null;
    const low = s.toLowerCase();
    if (low === 'n/a' || low === 'na' || low === '--' || low === '-') return null;

    s = s.replace(/[%$,]/g, '').replace(/\s+/g, '').trim();
    if (!s) return null;

    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

function fmtInt(n) {
    if (n == null || !Number.isFinite(n)) return '-';
    try { return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n); }
    catch { return String(Math.round(n)); }
}

function fmt1(n) {
    if (n == null || !Number.isFinite(n)) return '-';
    try { return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(n); }
    catch { return String(n); }
}

function fmtPrice(n) {
    if (n == null || !Number.isFinite(n)) return '-';
    try { return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n); }
    catch { return String(n); }
}

function fmtPct(n) {
    if (n == null || !Number.isFinite(n)) return '-';
    return `${fmt1(n)}%`;
}

function DatabaseSearchModal() {
    const { dbSearchShown, hideDbSearch, gameState } = api.useWSRContext();

    const [q, setQ] = useState('');
    const [preset, setPreset] = useState('custom');
    const [industry, setIndustry] = useState('Any');
    const [minMcap, setMinMcap] = useState('');
    const [maxMcap, setMaxMcap] = useState('');
    const [maxPE, setMaxPE] = useState('');
    const [minDiv, setMinDiv] = useState('');
    const [excludeFinancials, setExcludeFinancials] = useState(false);
    const [excludeHoldingCos, setExcludeHoldingCos] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(true);

    const presets = useMemo(() => ([
        { value: 'custom', label: 'Custom' },
        { value: 'value', label: 'Value' },
        { value: 'growth', label: 'Growth' },
        { value: 'dividend', label: 'Dividend' },
        { value: 'smallcap', label: 'Small Cap' },
        { value: 'largecap', label: 'Large Cap' },
    ]), []);

    const applyPreset = (p) => {
        setPreset(p);
        // Reset filters first
        setMaxPE('');
        setMinDiv('');
        setMinMcap('');
        setMaxMcap('');
        setExcludeFinancials(false);
        setExcludeHoldingCos(false);

        if (p === 'value') {
            setMaxPE('15');
            setMinDiv('2');
        } else if (p === 'growth') {
            setMaxPE('30');
        } else if (p === 'dividend') {
            setMinDiv('4');
        } else if (p === 'smallcap') {
            setMaxMcap('500');
        } else if (p === 'largecap') {
            setMinMcap('5000');
        }
    };

    // Data from game state
    const allCompanies = gameState?.allCompanies || [];
    const allIndustries = gameState?.allIndustries || [];

    // Build industry options
    const industryOptions = useMemo(() => {
        const inds = (allIndustries || [])
            .map(i => ({ id: i?.id, name: i?.name }))
            .filter(i => i.name && i.name !== '-');
        const sorted = inds.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        return [
            { value: 'Any', label: 'Any Industry' },
            ...sorted.map(i => ({ value: String(i.id), label: i.name }))
        ];
    }, [allIndustries]);

    const getIndustryName = (industryNum) => {
        const ind = api.getIndustry(allIndustries, industryNum);
        return ind?.name || '-';
    };

    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState('');
    const searchTokenRef = useRef(0);

    // Normalize market cap to millions
    const normalizeMcap = (mcap) => {
        if (mcap == null || !Number.isFinite(mcap)) return null;
        // If value seems to be in dollars (>10M), convert to millions
        return mcap >= 10_000_000 ? (mcap / 1_000_000) : mcap;
    };

    // Run search
    const runSearch = () => {
        const token = ++searchTokenRef.current;

        const qq = q.trim().toLowerCase();
        const minM = toNumber(minMcap);
        const maxM = toNumber(maxMcap);
        const maxP = toNumber(maxPE);
        const minD = toNumber(minDiv);
        const industryFilter = industry !== 'Any' ? parseInt(industry, 10) : null;

        const MAX_RESULTS = 500;
        const CHUNK = 500;
        const src = allCompanies || [];

        setIsSearching(true);
        setSearchStatus(`Scanning 0 / ${src.length}`);
        setResults([]);
        setSelected(null);

        const hits = [];
        let i = 0;

        const normalize = (c) => {
            const id = c?.id;
            if (id == null) return null;
            if (typeof id === 'number' && id <= 10) return null; // Skip players

            const sym = c?.symbol ?? c?.ticker;
            const name = c?.name ?? c?.companyName;
            if (!sym || !name) return null;

            const industryId = c?.industryId ?? c?.industryNum ?? c?.industry;
            const sector = getIndustryName(industryId);
            const mcapRaw = normalizeMcap(c?.marketCap);
            const price = c?.price;
            const oldPrice = c?.oldPrice;
            const priceChange = price && oldPrice ? ((price - oldPrice) / oldPrice) * 100 : null;

            // P/E and Dividend yield would need additional data from backend
            // For now, we'll use what's available
            const peRaw = c?.pe ?? c?.peRatio ?? null;
            const divRaw = c?.dividendYield ?? c?.divYield ?? null;

            return {
                id,
                sym: String(sym).toUpperCase(),
                name: String(name),
                industryId,
                sector,
                mcapRaw,
                price,
                priceChange,
                peRaw,
                divRaw,
            };
        };

        const passes = (r) => {
            if (!r) return false;
            // Text search
            if (qq) {
                const hit = r.sym.toLowerCase().includes(qq) || r.name.toLowerCase().includes(qq);
                if (!hit) return false;
            }
            // Industry filter
            if (industryFilter != null && r.industryId !== industryFilter) return false;
            // Market cap filters
            if (minM != null && (r.mcapRaw == null || r.mcapRaw < minM)) return false;
            if (maxM != null && (r.mcapRaw == null || r.mcapRaw > maxM)) return false;
            // P/E filter
            if (maxP != null && r.peRaw != null && r.peRaw > maxP) return false;
            // Dividend filter
            if (minD != null && (r.divRaw == null || r.divRaw < minD)) return false;
            // Exclude financials (industry 1 = Banks, 2 = Insurance)
            if (excludeFinancials && (r.industryId === 1 || r.industryId === 2)) return false;
            // Exclude holding companies (industry 70)
            if (excludeHoldingCos && r.industryId === 70) return false;
            return true;
        };

        const step = () => {
            if (searchTokenRef.current !== token) return;

            const end = Math.min(i + CHUNK, src.length);
            for (; i < end; i++) {
                const r = normalize(src[i]);
                if (!passes(r)) continue;
                hits.push(r);
            }

            setSearchStatus(`Scanning ${end} / ${src.length} | Matches: ${hits.length}`);

            if (end < src.length) {
                setTimeout(step, 0);
            } else {
                // Sort by market cap descending
                hits.sort((a, b) => (b.mcapRaw ?? 0) - (a.mcapRaw ?? 0));
                const top = hits.slice(0, MAX_RESULTS);
                setResults(top);
                setSelected(top[0] || null);
                setIsSearching(false);
                setSearchStatus(top.length ? `Found ${hits.length} companies${hits.length > MAX_RESULTS ? ` (showing top ${MAX_RESULTS})` : ''}.` : 'No companies match your criteria.');
            }
        };

        setTimeout(step, 0);
    };

    // Run search on Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') runSearch();
    };

    // Export to CSV
    const exportCSV = () => {
        try {
            const header = ['Symbol', 'Company', 'Industry', 'Market Cap', 'Price', 'Change %'];
            const rows = results.map(r => [
                r.sym,
                r.name,
                r.sector,
                r.mcapRaw != null ? Math.round(r.mcapRaw) : '',
                r.price != null ? r.price.toFixed(2) : '',
                r.priceChange != null ? r.priceChange.toFixed(2) : ''
            ]);
            const esc = (v) => {
                const s = String(v ?? '');
                return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
            };
            const csv = [header, ...rows].map(line => line.map(esc).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'database_search_results.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            // no-op
        }
    };

    const onClose = () => {
        hideDbSearch();
    };

    // Open selected company in main view
    const openCompany = () => {
        if (selected?.id) {
            api.setViewAsset(selected.id);
            onClose();
        }
    };

    return html`
        <${Modal} show=${dbSearchShown} onClose=${onClose} wide=${true}>
            <div class="iu-modal">
                <div class="iu-layout">
                    <div class="iu-left">
                        <div class="iu-header">
                            <div>
                                <div class="iu-title">Database Search</div>
                                <div class="iu-subtitle">Search and filter the company database</div>
                            </div>
                            <div class="iu-actions">
                                <${Button} class="btn" onClick=${() => setFiltersOpen(v => !v)}>
                                    ${filtersOpen ? 'Hide Filters' : 'Show Filters'}
                                </button>
                                <${Button} class="btn blue" onClick=${runSearch} disabled=${isSearching}>
                                    ${isSearching ? 'Searching...' : 'Search'}
                                </button>
                                <${Button} class="btn" onClick=${onClose}>Close</button>
                            </div>
                        </div>

                        <div class="iu-block">
                            <${SectionTitle}>Search<//>
                            <${Row}>
                                <input
                                    class="iu-input"
                                    value=${q}
                                    onInput=${(e) => setQ(e.target.value)}
                                    onKeyDown=${handleKeyDown}
                                    placeholder="Enter company name or symbol..."
                                />
                            <//>
                        </div>

                        ${filtersOpen ? html`
                            <div class="iu-block">
                                <${SectionTitle}>Presets<//>
                                <div class="iu-pills">
                                    ${presets.map(p => html`
                                        <${Pill}
                                            active=${preset === p.value}
                                            label=${p.label}
                                            onClick=${() => applyPreset(p.value)}
                                        />
                                    `)}
                                </div>
                            </div>

                            <div class="iu-block">
                                <${SectionTitle}>Filters<//>
                                <div class="iu-grid">
                                    <div>
                                        <${Label}>Industry<//>
                                        <${Select}
                                            value=${industry}
                                            onChange=${(e) => setIndustry(e.target.value)}
                                            options=${industryOptions}
                                        />
                                    </div>
                                    <div>
                                        <${Label}>Min Market Cap (M)<//>
                                        <${Input}
                                            value=${minMcap}
                                            onInput=${(e) => setMinMcap(e.target.value)}
                                            placeholder="e.g. 500"
                                        />
                                    </div>
                                    <div>
                                        <${Label}>Max Market Cap (M)<//>
                                        <${Input}
                                            value=${maxMcap}
                                            onInput=${(e) => setMaxMcap(e.target.value)}
                                            placeholder="e.g. 5000"
                                        />
                                    </div>
                                    <div>
                                        <${Label}>Max P/E Ratio<//>
                                        <${Input}
                                            value=${maxPE}
                                            onInput=${(e) => setMaxPE(e.target.value)}
                                            placeholder="e.g. 15"
                                        />
                                    </div>
                                    <div>
                                        <${Label}>Min Dividend Yield %<//>
                                        <${Input}
                                            value=${minDiv}
                                            onInput=${(e) => setMinDiv(e.target.value)}
                                            placeholder="e.g. 3"
                                        />
                                    </div>
                                    <div class="iu-checks">
                                        <${Checkbox}
                                            checked=${excludeFinancials}
                                            onChange=${(e) => setExcludeFinancials(e.target.checked)}
                                            label="Exclude Financials"
                                        />
                                        <${Checkbox}
                                            checked=${excludeHoldingCos}
                                            onChange=${(e) => setExcludeHoldingCos(e.target.checked)}
                                            label="Exclude Holding Companies"
                                        />
                                    </div>
                                </div>
                            </div>
                        ` : null}

                        <div class="iu-block">
                            <${SectionTitle}>Results<//>
                            ${searchStatus ? html`<div class="iu-subtitle">${searchStatus}</div>` : null}
                            <div class="iu-table-wrap">
                                <table class="iu-table">
                                    <thead>
                                        <tr>
                                            <th>Symbol</th>
                                            <th>Company</th>
                                            <th>Industry</th>
                                            <th class="num">Mkt Cap (M)</th>
                                            <th class="num">Price</th>
                                            <th class="num">Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${results.map(r => html`
                                            <tr
                                                class=${selected?.id === r.id ? 'sel' : ''}
                                                onClick=${() => setSelected(r)}
                                                onDblClick=${() => { setSelected(r); openCompany(); }}
                                            >
                                                <td><span class="iu-chip">${r.sym}</span></td>
                                                <td>${r.name}</td>
                                                <td>${r.sector}</td>
                                                <td class="num">${fmtInt(r.mcapRaw)}</td>
                                                <td class="num">${fmtPrice(r.price)}</td>
                                                <td class=${`num ${r.priceChange > 0 ? 'positive' : r.priceChange < 0 ? 'negative' : ''}`}>
                                                    ${r.priceChange != null ? `${r.priceChange >= 0 ? '+' : ''}${fmt1(r.priceChange)}%` : '-'}
                                                </td>
                                            </tr>
                                        `)}
                                    </tbody>
                                </table>
                            </div>

                            <div class="iu-footer-actions">
                                <${Button} class="btn blue" disabled=${!selected?.id} onClick=${openCompany}>
                                    Open Company
                                </button>
                                <${Button} class="btn" disabled=${results.length === 0} onClick=${exportCSV}>
                                    Export CSV
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="iu-right">
                        <div class="iu-block">
                            <${SectionTitle}>Selected Company<//>
                            ${selected ? html`
                                <div class="iu-detail-title">${selected.name}</div>
                                <div class="iu-detail-sub">${selected.sym} - ${selected.sector}</div>
                                <div class="iu-mini-grid">
                                    <div class="iu-mini">
                                        <div class="k">Market Cap</div>
                                        <div class="v">${fmtInt(selected.mcapRaw)}M</div>
                                    </div>
                                    <div class="iu-mini">
                                        <div class="k">Price</div>
                                        <div class="v">${fmtPrice(selected.price)}</div>
                                    </div>
                                    <div class="iu-mini">
                                        <div class="k">Change</div>
                                        <div class=${`v ${selected.priceChange > 0 ? 'positive' : selected.priceChange < 0 ? 'negative' : ''}`}>
                                            ${fmtPct(selected.priceChange)}
                                        </div>
                                    </div>
                                </div>
                                <div class="iu-quick">
                                    <${Button} class="btn blue" onClick=${openCompany}>View Company</button>
                                </div>
                            ` : html`
                                <div class="iu-detail-sub">Select a company from the results to see details.</div>
                            `}
                        </div>

                        <div class="iu-block">
                            <${SectionTitle}>Tips<//>
                            <ul class="iu-tips">
                                <li>Use presets to quickly filter by investment style</li>
                                <li>Double-click a row to open the company directly</li>
                                <li>Press Enter in the search box to run search</li>
                                <li>Market Cap is shown in millions</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        <//>
    `;
}

export default DatabaseSearchModal;
