import { html, useState, useEffect, useMemo, useCallback, useRef } from '../lib/preact.standalone.module.js';
// useCallback still used for getIndustryName
import * as api from '../api.js';
import { insertCurrencySymbols } from './helpers.js';

const DEBOUNCE_DELAY = 500;

// Formatting helpers
const fmt = (n, decimals = 1) => {
    if (n == null || !Number.isFinite(n)) return '-';
    return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
};
const fmtInt = (n) => fmt(n, 0);

// Rating converters
const getMgmtRating = (r) => {
    if (r == null) return 'N/A';
    if (r > 8) return 'Excellent';
    if (r < -10) return 'Failing';
    if (r < -6) return 'Poor';
    if (r < 0) return 'Mediocre';
    return 'Competent';
};

const getAnalystRating = (r) => {
    if (r == null || r === 0) return '-';
    if (r === 1) return 'Strong Buy';
    if (r === 2) return 'Buy';
    if (r === 3) return 'Hold';
    if (r === 4) return 'Sell';
    if (r === 5) return 'Strong Sell';
    return r;
};

const getCreditRating = (r) => {
    const ratings = ['NR', 'D', 'C', 'CC', 'CCC', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA'];
    return ratings[r] || '-';
};

const getCashFlowText = (cf) => {
    if (cf === 1) return 'Positive';
    if (cf === 2) return 'Before Debt';
    if (cf === -1) return 'Negative';
    return '-';
};

const getShortScoreText = (score) => {
    if (score == null || score <= 0) return '-';
    if (score >= 4) return 'Strong';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Moderate';
    if (score >= 1) return 'Weak';
    return '-';
};

const DatabaseSearchView = () => {
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states - using uncontrolled inputs with refs to avoid re-renders during typing
    // Only the debounced filter values are in state
    const searchRef = useRef(null);
    const minROERef = useRef(null);
    const maxPERef = useRef(null);
    const maxPctBookRef = useRef(null);
    const minDivRef = useRef(null);
    const minMarketCapRef = useRef(null);
    const maxMarketCapRef = useRef(null);
    const maxConvPremRef = useRef(null);

    const [searchFilter, setSearchFilter] = useState('');
    const [industry, setIndustry] = useState('');
    const [minROEFilter, setMinROEFilter] = useState('');
    const [maxPEFilter, setMaxPEFilter] = useState('');
    const [maxPctBookFilter, setMaxPctBookFilter] = useState('');
    const [minDivFilter, setMinDivFilter] = useState('');
    const [minMarketCapFilter, setMinMarketCapFilter] = useState('');
    const [maxMarketCapFilter, setMaxMarketCapFilter] = useState('');
    const [maxConvPremFilter, setMaxConvPremFilter] = useState('');

    // Create debounced setters (memoized so they don't change)
    const debouncedSetSearch = useMemo(() => api.debounce(setSearchFilter, DEBOUNCE_DELAY), []);
    const debouncedSetMinROE = useMemo(() => api.debounce(setMinROEFilter, DEBOUNCE_DELAY), []);
    const debouncedSetMaxPE = useMemo(() => api.debounce(setMaxPEFilter, DEBOUNCE_DELAY), []);
    const debouncedSetMaxPctBook = useMemo(() => api.debounce(setMaxPctBookFilter, DEBOUNCE_DELAY), []);
    const debouncedSetMinDiv = useMemo(() => api.debounce(setMinDivFilter, DEBOUNCE_DELAY), []);
    const debouncedSetMinMarketCap = useMemo(() => api.debounce(setMinMarketCapFilter, DEBOUNCE_DELAY), []);
    const debouncedSetMaxMarketCap = useMemo(() => api.debounce(setMaxMarketCapFilter, DEBOUNCE_DELAY), []);
    const debouncedSetMaxConvPrem = useMemo(() => api.debounce(setMaxConvPremFilter, DEBOUNCE_DELAY), []);

    // Immediate setters for presets (updates both ref and state)
    const setMinROE = (v) => { if (minROERef.current) minROERef.current.value = v; setMinROEFilter(v); };
    const setMaxPE = (v) => { if (maxPERef.current) maxPERef.current.value = v; setMaxPEFilter(v); };
    const setMaxPctBook = (v) => { if (maxPctBookRef.current) maxPctBookRef.current.value = v; setMaxPctBookFilter(v); };
    const setMinDiv = (v) => { if (minDivRef.current) minDivRef.current.value = v; setMinDivFilter(v); };
    const setMinMarketCap = (v) => { if (minMarketCapRef.current) minMarketCapRef.current.value = v; setMinMarketCapFilter(v); };
    const setMaxMarketCap = (v) => { if (maxMarketCapRef.current) maxMarketCapRef.current.value = v; setMaxMarketCapFilter(v); };
    const setMaxConvPrem = (v) => { if (maxConvPremRef.current) maxConvPremRef.current.value = v; setMaxConvPremFilter(v); };

    // Dropdown/select filters
    const [minMgmtRating, setMinMgmtRating] = useState('');
    const [minCredRating, setMinCredRating] = useState('');
    const [minAnalystRating, setMinAnalystRating] = useState('');

    // Checkbox filters
    const [excludeFinancials, setExcludeFinancials] = useState(false);
    const [excludeHoldings, setExcludeHoldings] = useState(false);
    const [hasBonds, setHasBonds] = useState(false);
    const [convertiblesOnly, setConvertiblesOnly] = useState(false);
    const [positiveCashFlow, setPositiveCashFlow] = useState(false);
    const [cashFlowBeforeDebt, setCashFlowBeforeDebt] = useState(false);
    const [shortCandidates, setShortCandidates] = useState(false);
    const [hasPublicShares, setHasPublicShares] = useState(false);

    // Sort
    const [sortCol, setSortCol] = useState('marketCap');
    const [sortDir, setSortDir] = useState('desc');

    // Fetch data on mount, retry if database not ready (all marketCaps are 0)
    useEffect(() => {
        let timeoutId = null;
        let cancelled = false;

        const fetchData = () => {
            api.getDatabaseData()
                .then(res => {
                    if (cancelled) return;
                    const entries = res?.entries || [];
                    // Check if database is ready (at least one non-zero marketCap)
                    const hasData = entries.some(e => e.marketCap > 0);
                    if (!hasData && entries.length > 0) {
                        // Database not ready yet, retry in 1 second
                        timeoutId = setTimeout(fetchData, 1000);
                    } else {
                        setData(entries);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    if (cancelled) return;
                    setError(err.message);
                    setLoading(false);
                });
        };

        fetchData();

        return () => {
            cancelled = true;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Industry options
    const industryOptions = useMemo(() => {
        const inds = (allIndustries || [])
            .filter(i => i?.name && i.name !== '-')
            .sort((a, b) => a.name.localeCompare(b.name));
        return [{ id: '', name: 'All' }, ...inds];
    }, [allIndustries]);

    const getIndustryName = useCallback((id) => {
        return allIndustries?.find(i => i.id === id)?.name || '-';
    }, [allIndustries]);

    // Filter (uses debounced values for performance)
    const filtered = useMemo(() => {
        const q = searchFilter.trim().toLowerCase();
        const indId = industry ? parseInt(industry) : null;
        const minR = minROEFilter ? parseFloat(minROEFilter) : null;
        const maxP = maxPEFilter ? parseFloat(maxPEFilter) : null;
        const maxBook = maxPctBookFilter ? parseFloat(maxPctBookFilter) : null;
        const minD = minDivFilter ? parseFloat(minDivFilter) : null;
        const minCap = minMarketCapFilter ? parseFloat(minMarketCapFilter) : null;
        const maxCap = maxMarketCapFilter ? parseFloat(maxMarketCapFilter) : null;
        const maxConv = maxConvPremFilter ? parseFloat(maxConvPremFilter) : null;
        const minMgmt = minMgmtRating ? parseInt(minMgmtRating) : null;
        const minCred = minCredRating ? parseInt(minCredRating) : null;
        const minAnalyst = minAnalystRating ? parseInt(minAnalystRating) : null;

        return data.filter(c => {
            // Text search
            if (q && !c.symbol?.toLowerCase().includes(q) && !c.name?.toLowerCase().includes(q)) return false;

            // Industry filter
            if (indId && c.industryId !== indId) return false;

            // Numeric filters
            if (minR && (c.roe || 0) < minR) return false;
            if (maxP && c.pe > 0 && c.pe > maxP) return false;
            if (maxBook && c.bookValue > 0 && c.price > 0) {
                const pctOfBook = (c.marketCap / c.bookValue) * 100;
                if (pctOfBook > maxBook) return false;
            }
            if (minD && (c.divYield || 0) < minD) return false;
            if (minCap && (c.marketCap || 0) < minCap) return false;
            if (maxCap && (c.marketCap || 0) > maxCap) return false;
            if (maxConv && c.convPrem > maxConv) return false;

            // Rating filters
            if (minMgmt !== null && (c.mgmtRating || 0) < minMgmt) return false;
            if (minCred !== null && (c.credRating || 0) < minCred) return false;
            if (minAnalyst !== null) {
                const ar = c.analystRating || 0;
                if (ar === 0 || ar > minAnalyst) return false;
            }

            // Checkbox filters
            if (excludeFinancials && (c.industryId === 1 || c.industryId === 2)) return false;
            if (excludeHoldings && c.industryId === 70) return false;
            if (hasBonds && !c.jBondsPublic) return false;
            if (convertiblesOnly && c.convPrem <= 0) return false;
            if (positiveCashFlow && c.cashFlow !== 1 && c.cashFlow !== 2) return false;
            if (cashFlowBeforeDebt && c.cashFlow !== 2) return false;
            if (shortCandidates && (c.shortScore < 3 || !c.hasPublicShares)) return false;
            if (hasPublicShares && !c.hasPublicShares) return false;

            return true;
        });
    }, [data, searchFilter, industry, minROEFilter, maxPEFilter, maxPctBookFilter, minDivFilter,
        minMarketCapFilter, maxMarketCapFilter, maxConvPremFilter, minMgmtRating, minCredRating,
        minAnalystRating, excludeFinancials, excludeHoldings, hasBonds, convertiblesOnly,
        positiveCashFlow, cashFlowBeforeDebt, shortCandidates, hasPublicShares]);

    // Sort
    const sorted = useMemo(() => {
        const arr = [...filtered];
        arr.sort((a, b) => {
            let av, bv;
            if (sortCol === 'pctBook') {
                // Calculated column: marketCap / bookValue * 100
                av = (a.bookValue > 0 && a.marketCap > 0) ? (a.marketCap / a.bookValue) * 100 : null;
                bv = (b.bookValue > 0 && b.marketCap > 0) ? (b.marketCap / b.bookValue) * 100 : null;
            } else {
                av = a[sortCol];
                bv = b[sortCol];
            }
            if (av == null) av = sortDir === 'asc' ? Infinity : -Infinity;
            if (bv == null) bv = sortDir === 'asc' ? Infinity : -Infinity;
            if (sortCol === 'name' || sortCol === 'symbol') {
                return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
            }
            return sortDir === 'asc' ? av - bv : bv - av;
        });
        return arr;
    }, [filtered, sortCol, sortDir]);

    const handleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('desc'); }
    };

    const sortIcon = (col) => sortCol === col ? (sortDir === 'asc' ? ' \u25B2' : ' \u25BC') : '';

    const clearFilters = () => {
        // Clear input refs
        if (searchRef.current) searchRef.current.value = '';
        if (minROERef.current) minROERef.current.value = '';
        if (maxPERef.current) maxPERef.current.value = '';
        if (maxPctBookRef.current) maxPctBookRef.current.value = '';
        if (minDivRef.current) minDivRef.current.value = '';
        if (minMarketCapRef.current) minMarketCapRef.current.value = '';
        if (maxMarketCapRef.current) maxMarketCapRef.current.value = '';
        if (maxConvPremRef.current) maxConvPremRef.current.value = '';
        // Clear filter state immediately
        setSearchFilter(''); setIndustry(''); setMinROEFilter(''); setMaxPEFilter(''); setMaxPctBookFilter('');
        setMinDivFilter(''); setMinMarketCapFilter(''); setMaxMarketCapFilter(''); setMaxConvPremFilter('');
        setMinMgmtRating(''); setMinCredRating(''); setMinAnalystRating('');
        setExcludeFinancials(false); setExcludeHoldings(false); setHasBonds(false);
        setConvertiblesOnly(false); setPositiveCashFlow(false); setCashFlowBeforeDebt(false);
        setShortCandidates(false); setHasPublicShares(false);
    };

    // Recall last DB Search criteria from localStorage
    const DB_SEARCH_KEY = 'wsr_db_search_criteria';

    const applyCriteria = useCallback((c) => {
        clearFilters();
        if (c.searchFilter) { if (searchRef.current) searchRef.current.value = c.searchFilter; setSearchFilter(c.searchFilter); }
        if (c.minROEFilter) setMinROE(c.minROEFilter);
        if (c.maxPEFilter) setMaxPE(c.maxPEFilter);
        if (c.maxPctBookFilter) setMaxPctBook(c.maxPctBookFilter);
        if (c.minDivFilter) setMinDiv(c.minDivFilter);
        if (c.minMarketCapFilter) setMinMarketCap(c.minMarketCapFilter);
        if (c.maxMarketCapFilter) setMaxMarketCap(c.maxMarketCapFilter);
        if (c.maxConvPremFilter) setMaxConvPrem(c.maxConvPremFilter);
        if (c.industry) setIndustry(c.industry);
        if (c.minMgmtRating) setMinMgmtRating(c.minMgmtRating);
        if (c.minCredRating) setMinCredRating(c.minCredRating);
        if (c.minAnalystRating) setMinAnalystRating(c.minAnalystRating);
        if (c.excludeFinancials) setExcludeFinancials(true);
        if (c.excludeHoldings) setExcludeHoldings(true);
        if (c.hasBonds) setHasBonds(true);
        if (c.convertiblesOnly) setConvertiblesOnly(true);
        if (c.positiveCashFlow) setPositiveCashFlow(true);
        if (c.cashFlowBeforeDebt) setCashFlowBeforeDebt(true);
        if (c.shortCandidates) setShortCandidates(true);
        if (c.hasPublicShares) setHasPublicShares(true);
        if (c.sortCol) setSortCol(c.sortCol);
        if (c.sortDir) setSortDir(c.sortDir);
    }, []);

    const recallSearch = useCallback(() => {
        try {
            const saved = localStorage.getItem(DB_SEARCH_KEY);
            if (saved) applyCriteria(JSON.parse(saved));
        } catch (e) { /* ignore corrupt data */ }
    }, [applyCriteria]);

    // Auto-restore last criteria on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(DB_SEARCH_KEY);
            if (saved) applyCriteria(JSON.parse(saved));
        } catch (e) { /* ignore */ }
    }, []);

    // Auto-save criteria whenever filters change
    useEffect(() => {
        const criteria = {
            searchFilter, industry, minROEFilter, maxPEFilter, maxPctBookFilter,
            minDivFilter, minMarketCapFilter, maxMarketCapFilter, maxConvPremFilter,
            minMgmtRating, minCredRating, minAnalystRating,
            excludeFinancials, excludeHoldings, hasBonds, convertiblesOnly,
            positiveCashFlow, cashFlowBeforeDebt, shortCandidates, hasPublicShares,
            sortCol, sortDir
        };
        const hasAny = searchFilter || industry || minROEFilter || maxPEFilter || maxPctBookFilter
            || minDivFilter || minMarketCapFilter || maxMarketCapFilter || maxConvPremFilter
            || minMgmtRating || minCredRating || minAnalystRating
            || excludeFinancials || excludeHoldings || hasBonds || convertiblesOnly
            || positiveCashFlow || cashFlowBeforeDebt || shortCandidates || hasPublicShares;
        if (hasAny) {
            try { localStorage.setItem(DB_SEARCH_KEY, JSON.stringify(criteria)); } catch (e) { /* ignore */ }
        }
    }, [searchFilter, industry, minROEFilter, maxPEFilter, maxPctBookFilter,
        minDivFilter, minMarketCapFilter, maxMarketCapFilter, maxConvPremFilter,
        minMgmtRating, minCredRating, minAnalystRating,
        excludeFinancials, excludeHoldings, hasBonds, convertiblesOnly,
        positiveCashFlow, cashFlowBeforeDebt, shortCandidates, hasPublicShares,
        sortCol, sortDir]);

    // Presets
    const presets = [
        {
            name: 'Value Plays',
            desc: 'Low P/E, below book value, positive cash flow',
            apply: () => { clearFilters(); setMaxPE('15'); setMaxPctBook('100'); setPositiveCashFlow(true); setExcludeFinancials(true); setSortCol('pe'); setSortDir('asc'); }
        },
        {
            name: 'Income Stocks',
            desc: 'High dividend yield, investment grade credit',
            apply: () => { clearFilters(); setMinDiv('3'); setMinCredRating('7'); setPositiveCashFlow(true); setSortCol('divYield'); setSortDir('desc'); }
        },
        {
            name: 'Growth Stocks',
            desc: 'High ROE, good management, positive cash flow',
            apply: () => { clearFilters(); setMinROE('15'); setMinMgmtRating('0'); setPositiveCashFlow(true); setExcludeFinancials(true); setSortCol('roe'); setSortDir('desc'); }
        },
        {
            name: 'Blue Chips',
            desc: 'Large cap, analyst Buy+, strong credit',
            apply: () => { clearFilters(); setMinMarketCap('5000'); setMinAnalystRating('2'); setMinCredRating('7'); setSortCol('marketCap'); setSortDir('desc'); }
        },
        {
            name: 'Short Candidates',
            desc: 'High short score, weak fundamentals',
            apply: () => { clearFilters(); setShortCandidates(true); setSortCol('shortScore'); setSortDir('desc'); }
        },
        {
            name: 'Convertible Arb',
            desc: 'Convertible bonds with low premium',
            apply: () => { clearFilters(); setConvertiblesOnly(true); setMaxConvPrem('30'); setSortCol('convPrem'); setSortDir('asc'); }
        },
        {
            name: 'Small Cap Value',
            desc: 'Small companies trading cheap',
            apply: () => { clearFilters(); setMaxMarketCap('500'); setMaxPE('12'); setPositiveCashFlow(true); setSortCol('marketCap'); setSortDir('asc'); }
        },
        {
            name: 'Takeover Targets',
            desc: 'Small cap, below book, cash flow positive',
            apply: () => { clearFilters(); setMaxMarketCap('1000'); setMaxPctBook('80'); setPositiveCashFlow(true); setExcludeFinancials(true); setExcludeHoldings(true); setSortCol('bookValue'); setSortDir('desc'); }
        },
        {
            name: 'Bond Opportunities',
            desc: 'Companies with publicly traded bonds',
            apply: () => { clearFilters(); setHasBonds(true); setMinCredRating('5'); setSortCol('bondYield'); setSortDir('desc'); }
        },
        {
            name: 'Analyst Favorites',
            desc: 'Strong Buy ratings with good fundamentals',
            apply: () => { clearFilters(); setMinAnalystRating('1'); setPositiveCashFlow(true); setSortCol('analystRating'); setSortDir('asc'); }
        }
    ];

    if (loading) {
        return html`<div class="panel h-full flex items-center justify-center">
            <p>Loading database...</p>
        </div>`;
    }

    if (error) {
        return html`<div class="panel h-full flex items-center justify-center">
            <p class="text-red-400">Error: ${error}</p>
        </div>`;
    }

    return html`
        <div class="flex flex-col h-full gap-2 min-h-0">
            <!-- Filters -->
            <div class="panel p-2" style="height: auto; flex-shrink: 0;">
                <!-- Presets row -->
                <div class="flex items-center justify-between mb-2 pb-2 border-b border-gray-600">
                    <div class="text-sm font-semibold">Presets:</div>
                    <div class="flex flex-wrap gap-1">
                        ${presets.map(p => html`
                            <button
                                class="db-input px-2 py-0.5 text-xs cursor-pointer hover:bg-blue-600"
                                onClick=${p.apply}
                                title=${p.desc}
                            >${p.name}</button>
                        `)}
                    </div>
                </div>
                <div class="flex flex-wrap items-end gap-x-3 gap-y-2">
                    <!-- Row 1: Text search and dropdowns (uncontrolled inputs for performance) -->
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Search</div>
                        <input ref=${searchRef} class="db-input" style="width:100px" onInput=${e => debouncedSetSearch(e.target.value)} placeholder="Symbol/Name" />
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Industry</div>
                        <select class="db-input" style="width:100px" value=${industry} onChange=${e => setIndustry(e.target.value)}>
                            ${industryOptions.map(i => html`<option value=${i.id}>${i.name}</option>`)}
                        </select>
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Max P/E</div>
                        <input ref=${maxPERef} class="db-input" style="width:80px" type="number" placeholder="e.g. 15" onInput=${e => debouncedSetMaxPE(e.target.value)} />
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Min Div%</div>
                        <input ref=${minDivRef} class="db-input" style="width:80px" type="number" placeholder="e.g. 3" onInput=${e => debouncedSetMinDiv(e.target.value)} />
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Min ROE%</div>
                        <input ref=${minROERef} class="db-input" style="width:80px" type="number" placeholder="e.g. 10" onInput=${e => debouncedSetMinROE(e.target.value)} />
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Max P/B%</div>
                        <input ref=${maxPctBookRef} class="db-input" style="width:80px" type="number" placeholder="e.g. 100" onInput=${e => debouncedSetMaxPctBook(e.target.value)} />
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">${insertCurrencySymbols("Min Cap (@DLRSIGN@DENOMINATION@EURO)")}</div>
                        <input ref=${minMarketCapRef} class="db-input" style="width:100px" type="number" onInput=${e => debouncedSetMinMarketCap(e.target.value)} />
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">${insertCurrencySymbols("Max Cap (@DLRSIGN@DENOMINATION@EURO)")}</div>
                        <input ref=${maxMarketCapRef} class="db-input" style="width:100px" type="number" onInput=${e => debouncedSetMaxMarketCap(e.target.value)} />
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Max Conv%</div>
                        <input ref=${maxConvPremRef} class="db-input" style="width:80px" type="number" placeholder="e.g. 30" onInput=${e => debouncedSetMaxConvPrem(e.target.value)} />
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Min Mgmt</div>
                        <select class="db-input" style="width:100px" value=${minMgmtRating} onChange=${e => setMinMgmtRating(e.target.value)}>
                            <option value="">Any</option>
                            <option value="-6">Mediocre+</option>
                            <option value="0">Competent+</option>
                            <option value="8">Excellent</option>
                        </select>
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Min Credit</div>
                        <select class="db-input" style="width:100px" value=${minCredRating} onChange=${e => setMinCredRating(e.target.value)}>
                            <option value="">Any</option>
                            <option value="5">B+</option>
                            <option value="6">BB+</option>
                            <option value="7">BBB+</option>
                            <option value="8">A+</option>
                            <option value="9">AA+</option>
                        </select>
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Analyst Rating</div>
                        <select class="db-input" style="width:120px" value=${minAnalystRating} onChange=${e => setMinAnalystRating(e.target.value)}>
                            <option value="">Any</option>
                            <option value="1">Strong Buy</option>
                            <option value="2">Buy+</option>
                            <option value="3">Hold+</option>
                            <option value="4">Sell+</option>
                            <option value="5">Strong Sell+</option>
                        </select>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
                    <label class="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked=${excludeFinancials} onChange=${e => setExcludeFinancials(e.target.checked)} />
                        <span>No Financials</span>
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked=${excludeHoldings} onChange=${e => setExcludeHoldings(e.target.checked)} />
                        <span>No Holdings</span>
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked=${hasBonds} onChange=${e => setHasBonds(e.target.checked)} />
                        <span>Has Bonds</span>
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked=${convertiblesOnly} onChange=${e => setConvertiblesOnly(e.target.checked)} />
                        <span>Convertibles</span>
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked=${positiveCashFlow} onChange=${e => setPositiveCashFlow(e.target.checked)} />
                        <span>+Cash Flow</span>
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked=${shortCandidates} onChange=${e => setShortCandidates(e.target.checked)} />
                        <span>Short Candidates</span>
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked=${hasPublicShares} onChange=${e => setHasPublicShares(e.target.checked)} />
                        <span>Public Shares</span>
                    </label>
                    <button class="db-input px-2 cursor-pointer" data-testid="btn-clear-search" onClick=${clearFilters}>Clear</button>
                    <button class="db-input px-2 cursor-pointer" data-testid="btn-recall-search" onClick=${recallSearch} title="Recall last saved search criteria">Recall</button>
                    <div class="flex-1"></div>
                    <div class="text-gray-400">${filtered.length} of ${data.length}</div>
                </div>
            </div>

            <!-- Table -->
            <div class="panel flex-1 overflow-auto min-h-0">
                <table class="db-table">
                    <thead>
                        <tr>
                            <th class="cursor-pointer" onClick=${() => handleSort('symbol')}>Symbol${sortIcon('symbol')}</th>
                            <th class="cursor-pointer" onClick=${() => handleSort('name')}>Company${sortIcon('name')}</th>
                            <th>Industry</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('price')}>Price${sortIcon('price')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('marketCap')}>Market Cap${sortIcon('marketCap')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('pe')}>P/E${sortIcon('pe')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('bookValue')}>Book Value${sortIcon('bookValue')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('pctBook')}>P/B${sortIcon('pctBook')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('divYield')}>Dividend %${sortIcon('divYield')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('roe')}>ROE${sortIcon('roe')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('convPrem')}>Conv. Premium${sortIcon('convPrem')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('credRating')}>Credit${sortIcon('credRating')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('analystRating')}>Analyst${sortIcon('analystRating')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('mgmtRating')}>Management${sortIcon('mgmtRating')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('cashFlow')}>Cash Flow${sortIcon('cashFlow')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('shortScore')} title="0=Not a candidate, 1-2=Marginal, 3+=Good short (declining earnings, overvalued, poor outlook)">Short Score${sortIcon('shortScore')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('jBondsPublic')}>Bonds${sortIcon('jBondsPublic')}</th>
                            <th class="num cursor-pointer" onClick=${() => handleSort('bondYield')} title="Bond Yield to Maturity">Bond YTM${sortIcon('bondYield')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.length === 0 ? html`
                            <tr><td colspan="18" class="text-center text-gray-400 py-4">No results</td></tr>
                        ` : sorted.map(c => html`
                            <tr onClick=${() => api.setViewAsset(c.id)}>
                                <td><span class="symbol-chip">${c.symbol}</span></td>
                                <td class="truncate" style="max-width:120px" title=${c.name}>${c.name}</td>
                                <td class="truncate" style="max-width:60px" title=${getIndustryName(c.industryId)}>${getIndustryName(c.industryId)}</td>
                                <td class="num">$ ${fmt(c.price, 2)}</td>
                                <td class="num">$ ${fmtInt(c.marketCap)} M</td>
                                <td class="num">${c.pe > 0 ? fmt(c.pe) : '-'}</td>
                                <td class="num">$ ${c.bookValue > 0 ? fmt(c.bookValue, 2) : '-'} M</td>
                                <td class="num">${c.bookValue > 0 && c.price > 0 ? fmt((c.marketCap / c.bookValue) * 100) + '%' : '-'}</td>
                                <td class="num">${c.divYield > 0 ? fmt(c.divYield) + '%' : '-'}</td>
                                <td class="num">${c.roe ? fmt(c.roe) + '%' : '-'}</td>
                                <td class="num">${c.convPrem > 0 ? fmt(c.convPrem) + '%' : '-'}</td>
                                <td class="num">${getCreditRating(c.credRating)}</td>
                                <td class="num">${getAnalystRating(c.analystRating)}</td>
                                <td class="num">${getMgmtRating(c.mgmtRating)}</td>
                                <td class="num">${getCashFlowText(c.cashFlow)}</td>
                                <td class="num">${getShortScoreText(c.shortScore)}</td>
                                <td class="num">$ ${c.jBondsPublic > 0 ? fmtInt(c.jBondsPublic) : '-'} M</td>
                                <td class="num">${c.bondYield > 0 ? fmt(c.bondYield) + '%' : '-'}</td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

export default DatabaseSearchView;
