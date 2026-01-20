import { html, useMemo, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import Modal from './Modal.js';

function Pill({ active, label, onClick }) {
  return html`
    <button class=${`iu-pill ${active ? 'active' : ''}`} onClick=${onClick}>
      ${label}
    </button>
  `;
}

function SectionTitle({ children }) {
  return html`<div class="iu-section-title">${children}</div>`;
}

function Row({ children }) {
  return html`<div class="iu-row">${children}</div>`;
}

function Label({ children }) {
  return html`<div class="iu-label">${children}</div>`;
}

function Input({ value, onInput, placeholder, className = '', inputMode, pattern }) {
  return html`
    <input
      class=${`iu-input ${className}`}
      value=${value}
      onInput=${onInput}
      placeholder=${placeholder || ''}
      inputMode=${inputMode || undefined}
      pattern=${pattern || undefined}
    />
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

function DbSearchBody({ onClose }) {
  const { gameState } = api.useWSRContext();

  const [q, setQ] = useState('');
  const [preset, setPreset] = useState('value');
  const [industry, setIndustry] = useState('Any');
  const [country, setCountry] = useState('Any');
  const [minMcap, setMinMcap] = useState('');
  const [maxMcap, setMaxMcap] = useState('');
  const [maxPE, setMaxPE] = useState('');
  const [minDiv, setMinDiv] = useState('');
  const [minGrowth, setMinGrowth] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);

  const presets = useMemo(() => ([
    { value: 'value', label: 'Value' },
    { value: 'growth', label: 'Growth' },
    { value: 'distressed', label: 'Distressed' },
    { value: 'dividend', label: 'Dividend' },
    { value: 'smallcap', label: 'Small Cap' },
    { value: 'custom', label: 'Custom' },
  ]), []);

  const applyPreset = (p) => {
    setPreset(p);
    if (p === 'value') {
      setMaxPE('12');
      setMinDiv('2');
      setMinGrowth('');
    } else if (p === 'growth') {
      setMaxPE('');
      setMinDiv('');
      setMinGrowth('12');
    } else if (p === 'distressed') {
      setMaxPE('');
      setMinDiv('');
      setMinGrowth('');
      setMaxMcap('2000');
    } else if (p === 'dividend') {
      setMinDiv('4');
      setMaxPE('');
      setMinGrowth('');
    } else if (p === 'smallcap') {
      setMaxMcap('1500');
    }
  };

  // ---------- Data wiring (real game state) ----------
  const allCompanies = gameState?.allCompanies || [];
  const allIndustries = gameState?.allIndustries || [];
  const streamingQuotesList = gameState?.streamingQuotesList || [];

  const quoteById = useMemo(() => {
    const m = new Map();
    for (const q of (streamingQuotesList || [])) {
      const id = q?.id;
      if (id == null) continue;
      m.set(id, q);
      m.set(String(id), q);
    }
    return m;
  }, [streamingQuotesList]);

  // Fast lookup so displayed metrics can follow the live gameState.
  const companyById = useMemo(() => {
    // Some builds use numeric ids, others use string ids.
    // Keep both the raw id key and a string key so lookups stay reliable.
    const m = new Map();
    for (const c of (allCompanies || [])) {
      const id = c?.id;
      if (id == null) continue;
      m.set(id, c);
      m.set(String(id), c);
    }
    return m;
  }, [allCompanies]);

  // Locale-safe number parsing.
  // Handles common formats seen in Jenkins/Terminal builds:
  //  - "103 %" -> 103
  //  - "34,26" -> 34.26
  //  - "1 234,56" -> 1234.56
  //  - "1,234.56" -> 1234.56
  // Also strips currency symbols and other noise.
  const toNumber = (v) => {
    if (v == null) return null;
    if (typeof v === 'number' && Number.isFinite(v)) return v;

    let s = String(v).trim();
    if (!s) return null;
    const low = s.toLowerCase();
    if (low === 'n/a' || low === 'na' || low === '--' || low === '—') return null;

    // Remove common adornments.
    s = s
      .replace(/[%$€£¥]/g, '')
      .replace(/\u00a0/g, ' ') // NBSP
      .replace(/\s+/g, ' ')    // collapse spaces
      .trim();

    // Keep only digits, separators, and sign.
    s = s.replace(/[^0-9,\.\- ]/g, '').trim();
    if (!s) return null;

    // Remove spaces used as thousand separators.
    s = s.replace(/\s/g, '');

    const hasComma = s.includes(',');
    const hasDot = s.includes('.');

    // If we have both, assume commas are thousands separators: 1,234.56
    if (hasComma && hasDot) {
      s = s.replace(/,/g, '');
    } else if (hasComma && !hasDot) {
      // If only comma, assume it's a decimal separator: 34,26
      s = s.replace(/,/g, '.');
    }

    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };



  // Generic field extraction: backend schemas vary between builds.
  // We try common keys first, then fall back to regex-based key matching.
  const pickNumber = (obj, preferredKeys, keyRegexes) => {
    if (!obj) return null;
    for (const k of preferredKeys) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        const n = toNumber(obj[k]);
        if (n != null) return n;
      }
    }
    for (const [k, v] of Object.entries(obj)) {
      const kk = String(k).toLowerCase();
      if (keyRegexes.some((re) => re.test(kk))) {
        const n = toNumber(v);
        if (n != null) return n;
      }
    }
    // One-level deep scan (common pattern: { fundamentals: { marketCap: ... } })
    for (const v of Object.values(obj)) {
      if (!v || typeof v !== 'object') continue;
      for (const k of preferredKeys) {
        if (Object.prototype.hasOwnProperty.call(v, k)) {
          const n = toNumber(v[k]);
          if (n != null) return n;
        }
      }
      for (const [k2, v2] of Object.entries(v)) {
        const kk2 = String(k2).toLowerCase();
        if (keyRegexes.some((re) => re.test(kk2))) {
          const n = toNumber(v2);
          if (n != null) return n;
        }
      }
    }
    return null;
  };

  // Deep numeric extraction: bounded BFS over nested objects/arrays.
  // This avoids assumptions about backend schema and keeps UI responsive.
  const pickNumberDeep = (obj, preferredKeys, keyRegexes, maxDepth = 8) => {
    if (!obj || typeof obj !== 'object') return null;
    const seen = new Set();
    const q = [[obj, 0]];
    let visited = 0;

    while (q.length) {
      const [node, depth] = q.shift();
      if (!node || typeof node !== 'object') continue;
      if (seen.has(node)) continue;
      seen.add(node);
      visited++;
      // NOTE: Some builds nest company fundamentals fairly deep (reports/financials/etc.).
      // Keep this bounded but high enough to actually find values.
      if (visited > 2000) break; // hard safety cap

      const n = pickNumber(node, preferredKeys, keyRegexes);
      if (n != null) return n;

      if (depth >= maxDepth) continue;

      if (Array.isArray(node)) {
        for (const child of node) {
          if (child && typeof child === 'object') q.push([child, depth + 1]);
        }
      } else {
        for (const child of Object.values(node)) {
          if (child && typeof child === 'object') q.push([child, depth + 1]);
        }
      }
    }
    return null;
  };

  const pickStringDeep = (obj, preferredKeys, keyRegexes, maxDepth = 8) => {
    if (!obj || typeof obj !== 'object') return null;
    const seen = new Set();
    const q = [[obj, 0]];
    let visited = 0;

    const toStr = (v) => {
      if (v == null) return null;
      if (typeof v === 'string') {
        const s = v.trim();
        return s ? s : null;
      }
      return null;
    };

    while (q.length) {
      const [node, depth] = q.shift();
      if (!node || typeof node !== 'object') continue;
      if (seen.has(node)) continue;
      seen.add(node);
      visited++;
      if (visited > 2000) break;

      for (const k of preferredKeys) {
        if (Object.prototype.hasOwnProperty.call(node, k)) {
          const s = toStr(node[k]);
          if (s != null) return s;
        }
      }
      for (const [k, v] of Object.entries(node)) {
        const kk = String(k).toLowerCase();
        if (keyRegexes.some((re) => re.test(kk))) {
          const s = toStr(v);
          if (s != null) return s;
        }
      }

      if (depth >= maxDepth) continue;
      if (Array.isArray(node)) {
        for (const child of node) {
          if (child && typeof child === 'object') q.push([child, depth + 1]);
        }
      } else {
        for (const child of Object.values(node)) {
          if (child && typeof child === 'object') q.push([child, depth + 1]);
        }
      }
    }
    return null;
  };

  const normalizeMcapMillions = (m) => {
    if (m == null || !Number.isFinite(m)) return null;
    // Heuristic:
    // - If backend already gives "millions", values are typically 1..100000.
    // - If backend gives dollars, values are typically huge (>= 10,000,000).
    return m >= 10_000_000 ? (m / 1_000_000) : m;
  };

  const normalizeDivPct = (d) => {
    if (d == null || !Number.isFinite(d)) return null;
    // Some builds store dividend yield as a fraction (0.04) instead of percent (4).
    return d > 0 && d <= 1 ? (d * 100) : d;
  };
  const fmtInt = (n) => {
    if (n == null || !Number.isFinite(n)) return '—';
    try { return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n); }
    catch { return String(Math.round(n)); }
  };

  const fmt1 = (n) => {
    if (n == null || !Number.isFinite(n)) return '—';
    try { return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(n); }
    catch { return String(n); }
  };

  const fmt0 = (n) => {
    if (n == null || !Number.isFinite(n)) return '—';
    try { return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n); }
    catch { return String(Math.round(n)); }
  };

  const fmtPrice = (n) => {
    if (n == null || !Number.isFinite(n)) return '—';
    try { return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n); }
    catch { return String(n); }
  };

  // If the backend doesn't provide explicit market cap / P/E / dividend yield fields,
  // try to derive them from common raw components (price, shares outstanding, EPS, dividend per share).
  const deriveFundamentals = (c) => {
    const price = pickNumberDeep(c,
      ['price','lastPrice','stockPrice','sharePrice','last','close','currentPrice','stock_price','share_price','last_trade','lastTrade','last_trade_price','lastTradePrice','px','px_last'],
      [/price/,/last/,/close/,/trade/,/px/]);
    // Shares outstanding is named very inconsistently across builds.
    // Use a constrained scan: prefer known keys, then allow broader "share count" patterns
    // while excluding common false positives (e.g., shareholdersEquity).
    const pickSharesOutDeep = (obj) => {
      if (!obj || typeof obj !== 'object') return null;
      const preferred = [
        'sharesOutstanding','shares_outstanding','outstandingShares','sharesOut','shares_out',
        'sharesIssued','shares_issued','issuedShares','totalShares','total_shares',
        'shareCount','share_count','numShares','num_shares','commonShares','common_shares',
        // Common “already in millions” variants
        'sharesOutstandingMil','sharesOutstandingM','shares_outstanding_m','shares_outstanding_mil',
        'sharesOutstandingMillions','shares_outstanding_millions','outstandingSharesMil','outstanding_shares_mil'
      ];
      const seen = new Set();
      const q = [[obj, 0]];
      let visited = 0;
      while (q.length) {
        const [node, depth] = q.shift();
        if (!node || typeof node !== 'object') continue;
        if (seen.has(node)) continue;
        seen.add(node);
        visited++;
        if (visited > 250) break;

        // Prefer exact keys first
        for (const k of preferred) {
          if (Object.prototype.hasOwnProperty.call(node, k)) {
            const n = toNumber(node[k]);
            if (n != null) return n;
          }
        }

        // Then allow share-ish keys, but avoid ...Equity / shareholder...
        for (const [k, v] of Object.entries(node)) {
          const kk = String(k).toLowerCase();
          if (kk.includes('equity') || kk.includes('shareholder')) continue;
          if (/(shares?(_|\s)?(outstanding|issued|count|total))/.test(kk) || kk === 'shares') {
            const n = toNumber(v);
            if (n != null) return n;
          }
        }

        if (depth >= 3) continue;
        if (Array.isArray(node)) {
          for (const child of node) if (child && typeof child === 'object') q.push([child, depth + 1]);
        } else {
          for (const child of Object.values(node)) if (child && typeof child === 'object') q.push([child, depth + 1]);
        }
      }
      return null;
    };

    let sharesOut = pickSharesOutDeep(c);
    const eps = pickNumberDeep(c,
      ['eps','earningsPerShare','earnings_per_share','EPS','ttmEps','epsTTM','eps_ttm','eps12m','eps_12m','ttm_eps','earningsPS','earnings_ps','epsAnnual','eps_annual','epsYear','eps_year','epsFY','eps_fy'],
      [/earn.*per.*share/,/^eps$/,/(eps|earnings).*ttm/,/eps.*12/,/eps.*year/,/eps.*annual/]);
    const divPerShare = pickNumberDeep(c,
      ['dividendPerShare','divPerShare','div_per_share','dps','dividendPS','dividend_per_share','annualDividendPerShare','annual_dividend_per_share','dividendAnnual','dividend_annual'],
      [/div.*per.*share/,/^dps$/,/(annual|year).*div/]);

    // Some builds provide total earnings / net income instead of EPS.
    const netIncomeMil = pickNumberDeep(c,
      ['netIncome','net_income','earnings','earningsAfterTax','earnings_after_tax','afterTaxEarnings','after_tax_earnings','profit','netProfit','net_profit','income','totalEarnings','total_earnings'],
      [/net.*income/,/after.*tax/,/earnings/,/net.*profit/,/^profit$/,/^income$/]);

    // Some builds provide total dividends paid.
    const totalDivMil = pickNumberDeep(c,
      ['dividendsPaid','dividends_paid','totalDividends','total_dividends','dividendPaid','dividend_paid','cashDividends','cash_dividends'],
      [/dividends.*paid/,/total.*div/,/cash.*div/]);

    const out = { mcap: null, pe: null, div: null };
    if (price != null && sharesOut != null) {
      // Some builds store shares outstanding in *millions* (e.g., "100.0" meaning 100M).
      // Heuristic: if sharesOut is small but price*sharesOut looks too small for a market cap,
      // treat sharesOut as millions.
      let shares = sharesOut;
      if (shares > 0 && shares < 5000) {
        const raw = price * shares;
        if (raw < 10_000_000) shares = shares * 1_000_000;
      }
      // Keep units consistent with filters (millions).
      out.mcap = (price * shares) / 1_000_000;
    }
    if (price != null && eps != null && eps !== 0) {
      out.pe = price / eps;
    }

    // If EPS is missing but we have earnings and shares, derive EPS.
    if (out.pe == null && price != null && netIncomeMil != null && sharesOut != null) {
      let shares = sharesOut;
      if (shares > 0 && shares < 5000) shares = shares * 1_000_000; // common "millions" encoding
      const eps2 = (netIncomeMil * 1_000_000) / shares;
      if (eps2 !== 0 && Number.isFinite(eps2)) out.pe = price / eps2;
    }
    if (price != null && divPerShare != null && price !== 0) {
      out.div = (divPerShare / price) * 100;
    }

    // If dividend per share is missing but total dividends and shares exist, derive it.
    if (out.div == null && price != null && totalDivMil != null && sharesOut != null && price !== 0) {
      let shares = sharesOut;
      if (shares > 0 && shares < 5000) shares = shares * 1_000_000;
      const dps2 = (totalDivMil * 1_000_000) / shares;
      if (Number.isFinite(dps2)) out.div = (dps2 / price) * 100;
    }
    return out;
  };

  // Fallback: some builds do not expose fundamentals as structured fields, but embed them
  // inside report-like text blobs. We scan reachable strings and parse common patterns.
  // This is strictly best-effort and heavily bounded to avoid impacting Streaming Quotes.
  const extractMetricsFromText = (c, { sym, name, extraStrings } = {}) => {
    if (!c || typeof c !== 'object') return null;

    const collected = [];
    const seen = new Set();
    const q = [[c, 0]];
    let visited = 0;

    while (q.length) {
      const [node, depth] = q.shift();
      if (node == null) continue;
      if (typeof node === 'string') {
        const s = node.trim();
        if (s) collected.push(s);
        continue;
      }
      if (typeof node !== 'object') continue;
      if (seen.has(node)) continue;
      seen.add(node);
      visited++;
      if (visited > 1200) break;
      if (depth > 8) continue;

      if (Array.isArray(node)) {
        for (const child of node) q.push([child, depth + 1]);
      } else {
        for (const child of Object.values(node)) q.push([child, depth + 1]);
      }
    }

    if (Array.isArray(extraStrings)) {
      for (const s of extraStrings) {
        if (typeof s === 'string') {
          const t = s.trim();
          if (t) collected.push(t);
        }
      }
    }

    if (!collected.length) return null;

    // Helper: find the best match across strings.
    const findFirstNumber = (re) => {
      for (const s of collected) {
        const m = s.match(re);
        if (!m) continue;
        const n = toNumber(m[1]);
        if (n != null) return n;
      }
      return null;
    };

    const findFirstPercent = (re) => {
      for (const s of collected) {
        const m = s.match(re);
        if (!m) continue;
        const n = toNumber(m[1]);
        if (n != null) return n;
      }
      return null;
    };

    // Patterns seen across Jenkins/Terminal reports.
    const mcap = findFirstNumber(/market\s*cap\s*[:=]?\s*([\d\s,\.]+)/i);
    const pe = findFirstNumber(/p\/?e(?:\s*ratio)?\s*[:=]?\s*([\d\s,\.]+)/i);
    const div = findFirstPercent(/div(?:idend)?\s*(?:yield|%)\s*[:=]?\s*([\d\s,\.]+)\s*%/i);
    const ptnw = findFirstPercent(/price\s*to\s*net\s*worth\s*[:=]?\s*([\d\s,\.]+)\s*%/i);

    // If we didn't find direct patterns, try parsing an ASCII table row.
    // We look for a line containing the company name (or symbol) and multiple numeric tokens.
    const keyNeedle = (name || sym || '').trim();
    if ((mcap == null || pe == null || div == null || ptnw == null) && keyNeedle) {
      const needle = keyNeedle.toLowerCase();
      for (const s of collected) {
        const sl = s.toLowerCase();
        if (!sl.includes(needle)) continue;
        // Extract tokens like "103 %" "24.9" "3.2%" etc.
        const tokens = s.split(/\s{2,}/).map(t => t.trim()).filter(Boolean);
        if (tokens.length < 4) continue;

        // Try to find a percent token -> ptnw, a pe token, and a div token.
        // Market cap is often a large number without %.
        let _pt = null, _pe = null, _div = null, _mc = null;
        for (const t of tokens) {
          if (_pt == null && /%/.test(t) && /\d/.test(t)) {
            const n = toNumber(t);
            if (n != null) _pt = n;
          }
          if (_div == null && /%/.test(t) && /\d/.test(t)) {
            const n = toNumber(t);
            if (n != null && (_pt == null || n !== _pt)) _div = n;
          }
          if (_pe == null && !/%/.test(t) && /\d/.test(t) && /\./.test(t)) {
            const n = toNumber(t);
            if (n != null) _pe = n;
          }
          if (_mc == null && !/%/.test(t) && /\d/.test(t) && !/\./.test(t)) {
            const n = toNumber(t);
            if (n != null) _mc = n;
          }
        }

        return {
          mcap: mcap ?? _mc,
          pe: pe ?? _pe,
          div: div ?? _div,
          ptnw: ptnw ?? _pt,
        };
      }
    }

    if (mcap == null && pe == null && div == null && ptnw == null) return null;
    return { mcap, pe, div, ptnw };
  };

  const getIndustryName = (industryNum) => {
    const ind = api.getIndustry(allIndustries, industryNum);
    return ind?.name || '—';
  };

  // NOTE: allCompanies can be very large; do not pre-build a full normalized universe on modal open.
  // We scan allCompanies in chunks only when the user explicitly runs a search.
  const universe = null;

  const industryOptions = useMemo(() => {
    const inds = (allIndustries || [])
      .map(i => i?.name)
      .filter(Boolean)
      .filter(n => n !== '—');
    const uniq = Array.from(new Set(inds)).sort();
    return [
      { value: 'Any', label: 'Any' },
      ...uniq.map(v => ({ value: v, label: v }))
    ];
  }, [allIndustries]);

  const [countryOptions, setCountryOptions] = useState([{ value: 'Any', label: 'Any' }]);

  // Build a country list from a small sample without blocking the UI.
  useEffect(() => {
    let cancelled = false;
    const src = allCompanies || [];
    const set = new Set();
    let i = 0;
    const LIMIT = 10000;
    const CHUNK = 2000;

    function step() {
      const end = Math.min(i + CHUNK, Math.min(src.length, LIMIT));
      for (; i < end; i++) {
        const c = src[i];
        if (!c) continue;
        const cc = c.country || c.nation || c.countryName;
        if (cc) set.add(String(cc));
      }
      if (cancelled) return;
      if (i < Math.min(src.length, LIMIT)) {
        setTimeout(step, 0);
      } else {
        const arr = Array.from(set).filter(x => x && x !== '—').sort();
        setCountryOptions([{ value: 'Any', label: 'Any' }, ...arr.map(v => ({ value: v, label: v }))]);
      }
    }

    setTimeout(step, 0);
    return () => { cancelled = true; };
  }, [allCompanies]);

  // ---------- Watchlist (client-side) ----------
  const WATCH_KEY = 'wsr_db_watchlist_v1';
  const loadWatch = () => {
    try {
      const raw = localStorage.getItem(WATCH_KEY);
      const arr = JSON.parse(raw || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  };
  const [watchIds, setWatchIds] = useState(() => loadWatch());
  const saveWatch = (next) => {
    setWatchIds(next);
    try { localStorage.setItem(WATCH_KEY, JSON.stringify(next)); } catch {}
  };

  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const searchTokenRef = useRef(0);
  const prevPriceRef = useRef(new Map());
  const priceTrendRef = useRef(new Map()); // id -> 1 (up/green) | -1 (down/red) | 0 (flat/neutral)
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareBId, setCompareBId] = useState('');

  // Note: We intentionally do NOT fetch Research Report text for each row.
  // Switching active UI reports breaks other live panels (Streaming Quotes) and can freeze the game.

  // Note: We intentionally do NOT fetch Market Reports/Research Report text per row.
  // We only use live gameState/streaming quotes to avoid freezing the game or breaking Streaming Quotes.


  // Live metrics (refresh automatically as gameState updates).
  // We keep the search result list stable, but hydrate market stats from the current company objects.
  const liveMetricsById = useMemo(() => {
    const out = new Map();
    const extraReportStrings = (() => {
      const acc = [];
      // Known report fields (when exposed).
      const known = [
        ...(Array.isArray(gameState?.researchReport) ? gameState.researchReport : []),
        ...(Array.isArray(gameState?.mostMarketCapReport) ? gameState.mostMarketCapReport : []),
        ...(Array.isArray(gameState?.mostEarningsReport) ? gameState.mostEarningsReport : []),
        ...(Array.isArray(gameState?.mostCashReport) ? gameState.mostCashReport : []),
        ...(Array.isArray(gameState?.mostProfitableReport) ? gameState.mostProfitableReport : []),
      ];
      for (const s of known) if (typeof s === 'string') acc.push(s);

      // Dynamic scan: Jenkins builds often store Market/Industry/DB tool output under different keys.
      // We opportunistically collect *any* array-of-strings found in gameState and let the parser match.
      // Hard caps to avoid impacting Streaming Quotes.
      try {
        const MAX_LINES = 6000;
        const MAX_CHARS = 240;
        for (const [k, v] of Object.entries(gameState || {})) {
          if (!v) continue;
          // Avoid duplicating known keys.
          if (k === 'researchReport' || k === 'mostMarketCapReport' || k === 'mostEarningsReport' || k === 'mostCashReport' || k === 'mostProfitableReport') continue;
          if (Array.isArray(v) && v.length && typeof v[0] === 'string') {
            for (const line of v) {
              if (typeof line !== 'string') continue;
              const t = line.trim();
              if (!t) continue;
              acc.push(t.length > MAX_CHARS ? t.slice(0, MAX_CHARS) : t);
              if (acc.length >= MAX_LINES) break;
            }
          } else if (typeof v === 'string') {
            const t = v.trim();
            if (t) acc.push(t.length > MAX_CHARS ? t.slice(0, MAX_CHARS) : t);
          }
          if (acc.length >= MAX_LINES) break;
        }
      } catch {
        // ignore
      }

      return acc;
    })();
    for (const r of (results || [])) {
      const c = companyById.get(r.id);
      const q = quoteById.get(r.id) || quoteById.get(String(r.id)) || null;
      if (!c && !q) continue;
      let mcapRaw = normalizeMcapMillions(pickNumberDeep(c,
        ['marketCap','mktCap','mktcap','market_cap','marketcap','marketCapitalization','capitalization','marketValue','market_value','marketCapMillions','mktCapMillions','market_cap_m','cap_mil','capMil','capMillions'],
        [/market.*cap/,/mkt.*cap/,/market.*value/,/capital/,/cap.*mil/,/cap.*m$/]));
      let peRaw = pickNumberDeep(c,
        ['pe','pE','priceEarnings','peRatio','pe_ratio','pERatio','p_e','pToE','price_to_earnings','priceToEarnings','peTTM','pe_ttm'],
        [/^pe$/, /p\/e/, /earn/]);
      let divRaw = normalizeDivPct(pickNumberDeep(c,
        [
          'divYield','dividendYield','dividend_yield','div_yield',
          'divYieldPct','divYieldPercent','dividendYieldPct','dividendYieldPercent','dividend_yield_pct','dividend_yield_percent',
          'dividendPct','dividend_percent','divPct','div_pcnt','divPcnt'
        ],
        [/div.*yield/,/yield.*div/,/dividend.*y/,/div.*pct/,/div.*percent/]));

      let priceRaw = (q?.price != null) ? q.price : pickNumberDeep(c,
        ['price','lastPrice','stockPrice','sharePrice','last','close','currentPrice','stock_price','share_price','last_trade','lastTrade','last_trade_price','lastTradePrice','px','px_last'],
        [/price/,/last/,/close/,/trade/,/px/]);

      if (mcapRaw == null || peRaw == null || divRaw == null) {
        const d = deriveFundamentals(c);
        if (mcapRaw == null && d.mcap != null) mcapRaw = d.mcap;
        if (peRaw == null && d.pe != null) peRaw = d.pe;
        if (divRaw == null && d.div != null) divRaw = d.div;
      }

      // If we have a live quote price and shares, recompute market cap from live price.
      const d2 = deriveFundamentals(c);
      const sharesMil = d2?.sharesMil;
      if (priceRaw != null && sharesMil != null) {
        mcapRaw = priceRaw * sharesMil;
      }

      const netWorthMil = normalizeMcapMillions(pickNumberDeep(c,
        ['netWorth','net_worth','bookValue','book_value','equity','shareholdersEquity','shareholders_equity','netAssets','net_assets','netAssetValue','net_asset_value'],
        [/net.*worth/,/book/,/equity/,/net.*asset/])) ?? null;

      // Price-to-Net-Worth (aka Price-to-Book / P/NW) is often available even when Market Cap is not.
      // In those builds, compute Market Cap from Net Worth and P/NW to ensure Market Cap is populated.
      const ptnwRawNum = pickNumberDeep(c,
        ['priceToNetWorth','price_to_net_worth','priceToBook','price_to_book','ptnw','p2nw','pnw','priceNetWorth'],
        [/price.*net.*worth/,/price.*book/,/p\s*\/\s*nw/,/p\s*\/\s*book/]);
      let ptnwPct = (ptnwRawNum == null) ? null
        : (ptnwRawNum <= 10 ? (ptnwRawNum * 100) : ptnwRawNum); // handle 1.03 vs 103

      // Best-effort: parse embedded report text blobs if structured fields are absent.
      // This can recover Market Cap / P/E / Div Yield / Price-to-Net-Worth in some Jenkins builds.
      if ((mcapRaw == null || peRaw == null || divRaw == null || ptnwPct == null) && c) {
        const parsed = extractMetricsFromText(c, { sym: r.sym, name: r.name, extraStrings: extraReportStrings });
        if (parsed) {
          if (mcapRaw == null && parsed.mcap != null) mcapRaw = normalizeMcapMillions(parsed.mcap);
          if (peRaw == null && parsed.pe != null) peRaw = parsed.pe;
          if (divRaw == null && parsed.div != null) divRaw = normalizeDivPct(parsed.div);
          if (ptnwPct == null && parsed.ptnw != null) ptnwPct = (parsed.ptnw <= 10 ? parsed.ptnw * 100 : parsed.ptnw);
        }
      }

      // If Market Cap is missing but we have Net Worth and P/NW, derive Market Cap (in millions).
      if (mcapRaw == null && netWorthMil != null && ptnwPct != null) {
        mcapRaw = (netWorthMil * ptnwPct) / 100;
      }

      // If shares are missing but we have Market Cap + Price, derive shares (in millions) for future ticks.
      if ((sharesMil == null) && (mcapRaw != null) && (priceRaw != null) && priceRaw !== 0) {
        // Note: we do not write back into the company object; we only use it for this row's live calc.
        // This keeps us safe from side effects in the game's state.
        // eslint-disable-next-line no-unused-vars
        const _derivedSharesMil = mcapRaw / priceRaw;
      }

      const priceToNetWorth = (ptnwPct != null)
        ? ptnwPct
        : ((mcapRaw != null && netWorthMil != null && netWorthMil !== 0)
          ? (mcapRaw / netWorthMil) * 100
          : null);

      // Track price trend per row (green if price rises, red if it falls, neutral if unchanged).
      const prev = prevPriceRef.current.get(r.id) ?? prevPriceRef.current.get(String(r.id));
      const current = (priceRaw != null && Number.isFinite(priceRaw)) ? priceRaw : null;
      let trend = priceTrendRef.current.get(r.id) ?? priceTrendRef.current.get(String(r.id));
      if (trend == null) trend = 0; // default neutral until we have a comparison
      if (prev != null && current != null) {
        if (current > prev) trend = 1;
        else if (current < prev) trend = -1;
        else trend = 0;
      }
      if (current != null) {
        prevPriceRef.current.set(r.id, current);
        prevPriceRef.current.set(String(r.id), current);
        priceTrendRef.current.set(r.id, trend);
        priceTrendRef.current.set(String(r.id), trend);
      }

      out.set(r.id, {
        ptnw: (priceToNetWorth == null ? '—' : `${fmt0(priceToNetWorth)} %`),
        mcap: fmtInt(mcapRaw ?? r.mcapRaw),
        pe: fmt1(peRaw ?? r.peRaw),
        div: fmt1(divRaw ?? r.divRaw),
        priceNum: current,
        price: fmtPrice(current),
        priceTrend: trend,
      });
    }
    return out;
  }, [results, companyById, quoteById, gameState?.researchReport, gameState?.mostMarketCapReport, gameState?.mostEarningsReport, gameState?.mostCashReport, gameState?.mostProfitableReport]);

  const liveFor = (id) => liveMetricsById.get(id) || null;

  const scoreRow = (r) => {
    // Heuristic scoring with safe fallbacks.
    // Higher score = more relevant to the chosen preset.
    const pe = r.peRaw;
    const div = r.divRaw;
    const growth = r.growthRaw;
    const mcap = r.mcapRaw;
    let s = 0;

    const has = (x) => (x != null && Number.isFinite(x));

    if (preset === 'value') {
      if (has(pe)) s += Math.max(0, 40 - pe * 2);
      if (has(div)) s += Math.min(20, div * 3);
      if (has(mcap)) s += Math.max(0, 10 - (mcap / 100000));
    } else if (preset === 'growth') {
      if (has(growth)) s += Math.min(50, growth * 3);
      if (has(pe)) s += Math.max(0, 20 - pe);
    } else if (preset === 'dividend') {
      if (has(div)) s += Math.min(60, div * 6);
      if (has(pe)) s += Math.max(0, 15 - pe);
    } else if (preset === 'smallcap') {
      if (has(mcap)) s += Math.max(0, 60 - (mcap / 2000));
    } else if (preset === 'distressed') {
      if (has(pe)) s += Math.max(0, 30 - pe);
      if (has(mcap)) s += Math.max(0, 25 - (mcap / 5000));
    }
    // Basic relevance to query
    if (q) {
      const qq = q.trim().toLowerCase();
      if (qq) {
        const hit = (r.sym.toLowerCase().includes(qq) || r.name.toLowerCase().includes(qq));
        if (hit) s += 25;
      }
    }
    return Math.max(0, Math.round(s));
  };

  const runSearch = () => {
    const token = ++searchTokenRef.current;

    const qq = q.trim().toLowerCase();
    const minM = toNumber(minMcap);
    const maxM = toNumber(maxMcap);
    const maxP = toNumber(maxPE);
    const minD = toNumber(minDiv);
    const minG = toNumber(minGrowth);

    const MAX_RESULTS = 300;
    const CHUNK = 2000;
    const src = allCompanies || [];

    setIsSearching(true);
    setSearchStatus(`Scanning 0 / ${src.length}`);
    setResults([]);
    setSelected(null);
    setCompareOpen(false);
    setCompareBId('');

    const hits = [];
    let i = 0;

    const normalize = (c) => {
      const id = c?.id;
      if (id == null) return null;
      // Some builds use string ids, others use numeric ids.
      if (typeof id === 'number' && id <= 0) return null;

      const sym = c?.symbol ?? c?.ticker ?? c?.stockSymbol ?? c?.stock_symbol;
      const name = c?.name ?? c?.companyName ?? c?.company_name;
      if (!sym || !name) return null;

      const sector = getIndustryName(c.industryNum ?? c.industry ?? c.industryId);
      const countryVal = pickStringDeep(c,
        ['country','countryName','nation','homeCountry','hqCountry','domicile','country_code','countryCode'],
        [/country/,/nation/,/domic/]) || '—';
      let mcapRaw = normalizeMcapMillions(pickNumberDeep(c,
        ['marketCap','mktCap','mktcap','market_cap','marketcap','marketCapitalization','capitalization','marketValue','market_value','marketCapMillions','mktCapMillions','market_cap_m','cap_mil','capMil','capMillions'],
        [/market.*cap/,/mkt.*cap/,/market.*value/,/capital/,/cap.*mil/,/cap.*m$/]));
      let peRaw = pickNumberDeep(c,
        ['pe','pE','priceEarnings','peRatio','pe_ratio','pERatio','p_e','pToE','price_to_earnings','priceToEarnings','peTTM','pe_ttm'],
        [/^pe$/, /p\/e/, /earn/]);
      let divRaw = normalizeDivPct(pickNumberDeep(c,
        [
          'divYield','dividendYield','dividend_yield',
          'divYieldPct','div_yield','dividendYieldPct',
          'dividendPct','dividend_percent','divPct',
          // Extra variants seen in Jenkins/Terminal builds
          'dividendYieldPercent','dividend_yield_percent','dividend_yield_pct',
          'divYieldPercent','div_yield_percent','divYieldPcnt','div_yield_pcnt'
        ],
        [/div.*yield/,/yield.*div/,/dividend.*y/,/div.*pct/,/yield.*pct/]));

      if (mcapRaw == null || peRaw == null || divRaw == null) {
        const d = deriveFundamentals(c);
        if (mcapRaw == null && d.mcap != null) mcapRaw = d.mcap;
        if (peRaw == null && d.pe != null) peRaw = d.pe;
        if (divRaw == null && d.div != null) divRaw = d.div;
      }

      const growthRaw = pickNumber(c,
        ['growth','growthRate','growth_rate','revGrowth','revenueGrowth','salesGrowth','earningsGrowth'],
        [/growth/,/rev.*grow/,/sales.*grow/]);

      return {
        id,
        sym: String(sym).toUpperCase(),
        name: String(name),
        sector,
        country: countryVal,
        mcapRaw, peRaw, divRaw, growthRaw
      };
    };

    const passes = (r) => {
      if (!r) return false;
      if (qq) {
        const hit = r.sym.toLowerCase().includes(qq) || r.name.toLowerCase().includes(qq);
        if (!hit) return false;
      }
      if (industry !== 'Any' && r.sector !== industry) return false;
      if (country !== 'Any' && r.country !== country) return false;
      if (minM != null && r.mcapRaw != null && r.mcapRaw < minM) return false;
      if (maxM != null && r.mcapRaw != null && r.mcapRaw > maxM) return false;
      if (maxP != null && r.peRaw != null && r.peRaw > maxP) return false;
      if (minD != null && r.divRaw != null && r.divRaw < minD) return false;
      if (minG != null && r.growthRaw != null && r.growthRaw < minG) return false;
      return true;
    };

    const pruneIfNeeded = () => {
      // Keep the candidate set bounded while scanning (prevents big memory/sort costs).
      const HARD = MAX_RESULTS * 8;
      if (hits.length <= HARD) return;
      hits.sort((a, b) => (b.score - a.score) || a.sym.localeCompare(b.sym));
      hits.length = MAX_RESULTS * 4;
    };

    const step = () => {
      if (searchTokenRef.current !== token) return;

      const end = Math.min(i + CHUNK, src.length);
      for (; i < end; i++) {
        const r = normalize(src[i]);
        if (!passes(r)) continue;
        const scored = {
          ...r,
          score: scoreRow(r),
        };
        hits.push(scored);
      }

      pruneIfNeeded();
      setSearchStatus(`Scanning ${end} / ${src.length}  |  Matches: ${hits.length}`);

      if (end < src.length) {
        setTimeout(step, 0);
      } else {
        // Finalize
        hits.sort((a, b) => (b.score - a.score) || a.sym.localeCompare(b.sym));
        const top = hits.slice(0, MAX_RESULTS).map(r => ({
          ...r,
          mcap: r.mcapRaw != null ? fmtInt(r.mcapRaw) : '—',
          pe: r.peRaw != null ? fmt1(r.peRaw) : '—',
          div: r.divRaw != null ? fmt1(r.divRaw) : '—',
        }));
        setResults(top);
        setSelected(top[0] || null);
        setIsSearching(false);
        setSearchStatus(top.length ? `Done. Showing top ${top.length} results.` : 'Done. No matches.');

        // No background hydration: keep this modal read-only and lightweight.
      }
    };

    // Let the modal render first, then scan.
    setTimeout(step, 0);
  };


  // Keyboard shortcut: '/' focuses global search.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/') return;
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
      const el = document.getElementById('iu-dbsearch-q');
      if (el) {
        e.preventDefault();
        el.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Background hydration (best-effort): refresh the legacy DB Research Tool output so
  // Price-to-Net-Worth / P/E / Div Yield can be parsed even when not exposed as structured fields.
  // This is the least invasive way to get the same numbers you see in the ASCII reports.
  useEffect(() => {
    let alive = true;
    let timer = null;

    const tick = async () => {
      try {
        // Ask the game to generate the DB research output (ASCII table).
        await api.dbResearchTool();
        // Pull a fresh gamestate snapshot so the report text is present in gameState.
        const gs = await api.getGameState();
        if (alive && gs && api.gameStore?.getState) {
          api.gameStore.getState().setGameState(gs);
        }
      } catch {
        // ignore
      }
    };

    // Prime once, then refresh periodically.
    tick();
    timer = setInterval(tick, 8000);

    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, []);


  const toggleWatch = () => {
    if (!selected?.id) return;
    const id = selected.id;
    if (watchIds.includes(id)) saveWatch(watchIds.filter(x => x !== id));
    else saveWatch([id, ...watchIds].slice(0, 50));
  };

  const exportCSV = () => {
    try {
      const header = ['Symbol', 'Company', 'Industry', 'PriceToNetWorth', 'MktCap', 'PE', 'Div', 'PricePerShare'];
      const rows = results.map(r => { const l = liveFor(r.id); return [r.sym, r.name, r.sector, (l?.ptnw ?? '—'), (l?.mcap ?? r.mcap), (l?.pe ?? r.pe), (l?.div ?? r.div), (l?.price ?? '—')]; });
      const esc = (v) => {
        const s = String(v ?? '');
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const csv = [header, ...rows].map(line => line.map(esc).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wsr_database_search.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // no-op
    }
  };

  return html`
    <div class="iu-layout">
      <div class="iu-left">
        <div class="iu-header">
          <div>
            <div class="iu-title">Database Search</div>
            <div class="iu-subtitle">Fast screeners, query builder, and compare — themed for Wall Street Raider.</div>
          </div>
          <div class="iu-actions">
            <button class="btn" onClick=${() => setFiltersOpen(v => !v)}>${filtersOpen ? 'Hide Filters' : 'Show Filters'}</button>
            <button class="btn blue" onClick=${runSearch} disabled=${isSearching}>${isSearching ? 'Searching…' : 'Run Search'}</button>
            <button class="btn" onClick=${onClose}>Close</button>
          </div>
        </div>

        <div class="iu-block">
          <SectionTitle>Global Search</SectionTitle>
          <Row>
            <input
              id="iu-dbsearch-q"
              class="iu-input"
              value=${q}
              onInput=${(e) => setQ(e.target.value)}
              onKeyDown=${(e) => { if (e.key === 'Enter') runSearch(); }}
              placeholder="Search symbol, company name, or type / to focus..."
            />
            <div class="iu-kbd">/</div>
          </Row>
        </div>

        ${filtersOpen ? html`
          <div class="iu-block">
            <SectionTitle>Presets</SectionTitle>
            <div class="iu-pills">
              ${presets.map(p => html`<${Pill} active=${preset === p.value} label=${p.label} onClick=${() => applyPreset(p.value)} />`)}
            </div>
          </div>

          <div class="iu-block">
            <SectionTitle>Advanced Filters</SectionTitle>
            <div class="iu-grid">
              <div>
                <Label>Industry</Label>
                <${Select} value=${industry} onChange=${(e) => setIndustry(e.target.value)} options=${industryOptions} />
              </div>
              <div>
                <Label>Country</Label>
                <${Select} value=${country} onChange=${(e) => setCountry(e.target.value)} options=${countryOptions} />
              </div>
              <div>
                <Label>Market Cap (min)</Label>
                <Input value=${minMcap} onInput=${(e) => setMinMcap(e.target.value)} placeholder="500" className="iu-num" inputMode="numeric" pattern="[0-9]*" />
              </div>
              <div>
                <Label>Market Cap (max)</Label>
                <Input value=${maxMcap} onInput=${(e) => setMaxMcap(e.target.value)} placeholder="5000" className="iu-num" inputMode="numeric" pattern="[0-9]*" />
              </div>
              <div>
                <Label>P/E (max)</Label>
                <Input value=${maxPE} onInput=${(e) => setMaxPE(e.target.value)} placeholder="15" className="iu-num" inputMode="decimal" pattern="[0-9.]*" />
              </div>
              <div>
                <Label>Dividend Yield (min %)</Label>
                <Input value=${minDiv} onInput=${(e) => setMinDiv(e.target.value)} placeholder="3" className="iu-num" inputMode="decimal" pattern="[0-9.]*" />
              </div>
              <div>
                <Label>Growth (min %)</Label>
                <Input value=${minGrowth} onInput=${(e) => setMinGrowth(e.target.value)} placeholder="10" className="iu-num" inputMode="decimal" pattern="[0-9.]*" />
              </div>
              <div class="iu-checks">
                <${Checkbox} checked=${true} onChange=${() => {}} label="Include public companies" />
                <${Checkbox} checked=${true} onChange=${() => {}} label="Include holding companies" />
              </div>
            </div>
          </div>
        ` : null}

        <div class="iu-block">
          <SectionTitle>Results</SectionTitle>
          ${searchStatus ? html`<div class="iu-subtitle">${searchStatus}</div>` : null}
          <div class="iu-table-wrap">
            <table class="iu-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Price to Net Worth</th>
                  <th class="num">Mkt Cap</th>
                  <th class="num">P/E</th>
                  <th class="num">Div %</th>
                  <th class="num">Price / Share</th>
                </tr>
              </thead>
              <tbody>
                ${results.map(r => {
                  const l = liveFor(r.id);
                  return html`
                    <tr class=${selected?.id === r.id ? 'sel' : ''} onClick=${() => setSelected(r)}>
                      <td><span class="iu-chip">${r.sym}</span></td>
                      <td>${r.name}</td>
                      <td>${r.sector}</td>
                      <td>${l?.ptnw ?? '—'}</td>
                      <td class="num">${l?.mcap ?? r.mcap}</td>
                      <td class="num">${l?.pe ?? r.pe}</td>
                      <td class="num">${l?.div ?? r.div}</td>
                      ${(() => {
                        const cls = (l?.priceTrend === -1) ? 'negative' : (l?.priceTrend === 1 ? 'positive' : 'neutral');
                        return html`<td class=${`num ${cls}`}>${l?.price ?? '—'}</td>`;
                      })()}
                    </tr>
                  `;
                })}
              </tbody>
            </table>
          </div>

          <div class="iu-footer-actions">
            <button class="btn" disabled=${!selected?.id} onClick=${() => selected?.id ? api.setViewAsset(selected.id) : null}>Open Company</button>
            <button class="btn" disabled=${!selected?.id} onClick=${toggleWatch}>
              ${selected?.id && watchIds.includes(selected.id) ? 'Remove Watch' : 'Watchlist'}
            </button>
            <button class="btn" disabled=${!selected?.id || results.length < 2} onClick=${() => setCompareOpen(v => !v)}>
              ${compareOpen ? 'Close Compare' : 'Compare'}
            </button>
            <button class="btn" disabled=${results.length === 0} onClick=${exportCSV}>Export CSV</button>
          </div>
        </div>
      </div>

      <div class="iu-right">
        <div class="iu-block">
          <SectionTitle>Details</SectionTitle>
          ${selected ? (() => {
            const l = liveFor(selected.id);
            const countryTxt = l?.country ?? selected.country;
            const mcapTxt = l?.mcap ?? selected.mcap;
            const peTxt = l?.pe ?? selected.pe;
            const divTxt = l?.div ?? selected.div;
            return html`
              <div class="iu-detail-title">${selected.name}</div>
              <div class="iu-detail-sub">${selected.sym} • ${selected.sector} • ${countryTxt}</div>
              <div class="iu-mini-grid">
                <div class="iu-mini">
                  <div class="k">Market Cap</div>
                  <div class="v">${mcapTxt}</div>
                </div>
                <div class="iu-mini">
                  <div class="k">P/E</div>
                  <div class="v">${peTxt}</div>
                </div>
                <div class="iu-mini">
                  <div class="k">Dividend %</div>
                  <div class="v">${divTxt}</div>
                </div>
              </div>
            `;
          })() : html`<div class="iu-detail-sub">Select a row to see details.</div>`}
            ${selected ? html`<div class="iu-quick">
              <button class="btn blue" onClick=${() => api.setViewAsset(selected.id)}>View</button>
              <button class="btn" onClick=${toggleWatch}>
                ${watchIds.includes(selected.id) ? 'Unwatch' : 'Watch'}
              </button>
              <button class="btn" disabled=${results.length < 2} onClick=${() => setCompareOpen(true)}>Compare</button>
            </div>` : null}
        </div>

        ${compareOpen ? html`
          <div class="iu-block">
            <SectionTitle>Compare</SectionTitle>
            <div class="iu-note" style="margin-bottom: 10px;">
              Compare shows a quick side-by-side using data available in the current build.
            </div>
            <div style="display:flex; gap:10px; align-items:end;">
              <div style="flex:1;">
                <Label>A (selected)</Label>
                <div class="iu-detail-sub">${selected ? `${selected.sym} — ${selected.name}` : '—'}</div>
              </div>
              <div style="flex:1;">
                <Label>B</Label>
                <select class="iu-select" value=${compareBId} onChange=${(e) => setCompareBId(e.target.value)}>
                  <option value="">Pick a company…</option>
                  ${results.filter(r => r.id !== selected?.id).slice(0, 300).map(r => html`<option value=${String(r.id)}>${r.sym} — ${r.name}</option>`)}
                </select>
              </div>
            </div>

            ${(() => {
              const b = results.find(r => String(r.id) === String(compareBId));
              if (!selected || !b) return null;
              const la = liveFor(selected.id);
              const lb = liveFor(b.id);
              const row = (k, av, bv) => html`
                <tr>
                  <td>${k}</td>
                  <td class="num">${av ?? '—'}</td>
                  <td class="num">${bv ?? '—'}</td>
                </tr>
              `;
              return html`
                <div class="iu-table-wrap" style="margin-top: 10px;">
                  <table class="iu-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th class="num">${selected.sym}</th>
                        <th class="num">${b.sym}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${row('Price / Share', la?.price ?? '—', lb?.price ?? '—')}
                      ${row('Market Cap', la?.mcap ?? selected.mcap, lb?.mcap ?? b.mcap)}
                      ${row('P/E', la?.pe ?? selected.pe, lb?.pe ?? b.pe)}
                      ${row('Dividend %', la?.div ?? selected.div, lb?.div ?? b.div)}
                      ${row('Industry', selected.sector, b.sector)}
                      ${row('Price to Net Worth', la?.ptnw ?? '—', lb?.ptnw ?? '—')}
                    </tbody>
                  </table>
                </div>
              `;
            })()}
          </div>
        ` : null}

        ${watchIds.length ? html`
          <div class="iu-block">
            <SectionTitle>Watchlist</SectionTitle>
            <div class="iu-note" style="margin-bottom: 8px;">
              Stored locally on your PC (per browser profile).
            </div>
            <div class="iu-table-wrap">
              <table class="iu-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Company</th>
                    <th class="num">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${watchIds
                    .map(id => companyById.get(id))
                    .filter(Boolean)
                    .slice(0, 50)
                    .map(c => {
                      const id = c?.id;
                      const sym = String(c?.symbol || '—').toUpperCase();
                      const name = c?.name || '—';
                      return html`
                      <tr>
                        <td><span class="iu-chip">${sym}</span></td>
                        <td>${name}</td>
                        <td class="num">
                          <button class="btn" onClick=${() => api.setViewAsset(id)}>Open</button>
                          <button class="btn" onClick=${() => saveWatch(watchIds.filter(x => x !== id))}>Remove</button>
                        </td>
                      </tr>
                    `;
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ` : null}
      </div>
    </div>
  `;
}

function LawFirmBody({ onClose }) {
  const [choice, setChoice] = useState('Average');
  const firms = [
    { id: 'Cheap', name: 'Cheap Law Firm', desc: 'Low cost, low effectiveness.' },
    { id: 'Average', name: 'Average Law Firm', desc: 'Balanced cost vs. results.' },
    { id: 'Expensive', name: 'Expensive Law Firm', desc: 'High cost, best defense.' },
  ];

  return html`
    <div class="iu-layout single">
      <div class="iu-left">
        <div class="iu-header">
          <div>
            <div class="iu-title">Change Law Firm</div>
            <div class="iu-subtitle">Choose how aggressive your legal shield should be.</div>
          </div>
          <div class="iu-actions">
            <button class="btn blue" onClick=${() => onClose()}>Apply</button>
            <button class="btn" onClick=${onClose}>Close</button>
          </div>
        </div>

        <div class="iu-block">
          <SectionTitle>Available Firms</SectionTitle>
          <div class="iu-cards">
            ${firms.map(f => html`
              <div class=${`iu-card ${choice === f.id ? 'sel' : ''}`} onClick=${() => setChoice(f.id)}>
                <div class="h">${f.name}</div>
                <div class="p">${f.desc}</div>
                <div class="tag">Selected: ${choice === f.id ? 'Yes' : 'No'}</div>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function SpreadRumorsBody({ onClose }) {
  const [sym, setSym] = useState('');
  const [intensity, setIntensity] = useState('Medium');
  return html`
    <div class="iu-layout single">
      <div class="iu-left">
        <div class="iu-header">
          <div>
            <div class="iu-title">Spread Rumors</div>
            <div class="iu-subtitle">Target a ticker and apply market pressure (UI mock).</div>
          </div>
          <div class="iu-actions">
            <button class="btn blue" onClick=${() => onClose()}>Execute</button>
            <button class="btn" onClick=${onClose}>Close</button>
          </div>
        </div>

        <div class="iu-block">
          <SectionTitle>Target</SectionTitle>
          <Row>
            <div style="flex:1;">
              <Label>Stock Symbol</Label>
              <Input value=${sym} onInput=${(e) => setSym(e.target.value.toUpperCase())} placeholder="BCLK" />
            </div>
            <div style="width: 220px;">
              <Label>Intensity</Label>
              <${Select} value=${intensity} onChange=${(e) => setIntensity(e.target.value)} options=${[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ]} />
            </div>
          </Row>
          <div class="iu-note">
            This replaces the legacy white dialog. Backend wiring can be added later (endpoint: /spread_rumors).
          </div>
        </div>
      </div>
    </div>
  `;
}

function LawsuitBody({ onClose }) {
  const [sym, setSym] = useState('');
  const [budget, setBudget] = useState('100');
  return html`
    <div class="iu-layout single">
      <div class="iu-left">
        <div class="iu-header">
          <div>
            <div class="iu-title">Harassing Lawsuit</div>
            <div class="iu-subtitle">Legal pressure campaign (UI mock).</div>
          </div>
          <div class="iu-actions">
            <button class="btn blue" onClick=${() => onClose()}>File</button>
            <button class="btn" onClick=${onClose}>Close</button>
          </div>
        </div>

        <div class="iu-block">
          <SectionTitle>Target</SectionTitle>
          <Row>
            <div style="flex:1;">
              <Label>Stock Symbol</Label>
              <Input value=${sym} onInput=${(e) => setSym(e.target.value.toUpperCase())} placeholder="STSW" />
            </div>
            <div style="width: 220px;">
              <Label>Budget (millions)</Label>
              <Input value=${budget} onInput=${(e) => setBudget(e.target.value)} placeholder="100" className="iu-num" inputMode="numeric" pattern="[0-9]*" />
            </div>
          </Row>
          <div class="iu-note">
            Backend wiring can be added later (endpoint: /harrassing_lawsuit).
          </div>
        </div>
      </div>
    </div>
  `;
}

export default function InUniverseToolsModal() {
  const {
    dbSearchShown, hideDbSearch,
    lawFirmShown, hideLawFirm,
    rumorsShown, hideRumors,
    lawsuitShown, hideLawsuit,
  } = api.useWSRContext();

  const anyShown = dbSearchShown || lawFirmShown || rumorsShown || lawsuitShown;

  // Modal component expects boolean + onClose.
  // We keep a single modal shell and swap bodies to avoid stacking overlays.
  const onClose = () => {
    hideDbSearch();
    hideLawFirm();
    hideRumors();
    hideLawsuit();
  };

  let body = null;
  if (dbSearchShown) body = html`<${DbSearchBody} onClose=${onClose} />`;
  else if (lawFirmShown) body = html`<${LawFirmBody} onClose=${onClose} />`;
  else if (rumorsShown) body = html`<${SpreadRumorsBody} onClose=${onClose} />`;
  else if (lawsuitShown) body = html`<${LawsuitBody} onClose=${onClose} />`;

  return html`
    <${Modal} show=${anyShown} onClose=${onClose} wide=${true}>
      <div class="iu-modal">
        ${body}
      </div>
    <//>
  `;
}
