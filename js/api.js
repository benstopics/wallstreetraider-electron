import { insertCurrencySymbols } from './components/helpers.js';
import { html, render, useRef, useState, useEffect, useContext, createContext } from './lib/preact.standalone.module.js';
import zustand from './lib/zustand.module.js';
import { debugLog } from './debug-log.js';
const { createStore } = zustand;

// In a plain browser (phone access), Electron APIs are unavailable — stub them out.
const ipcRenderer = (typeof require !== 'undefined')
    ? require('electron').ipcRenderer
    : { invoke: () => Promise.resolve(null), send: () => {}, on: () => {} };

export const apiBase = window.__WSR_API_BASE_OVERRIDE || 'http://127.0.0.1:9631';

// Detect addon mode: WSR_NO_REST=1 means no REST server, use IPC for everything
const useIPC = typeof process !== 'undefined' && process.env && process.env.WSR_NO_REST === '1';
console.log('[api] useIPC =', useIPC, 'WSR_NO_REST =', typeof process !== 'undefined' && process.env ? process.env.WSR_NO_REST : 'N/A');

// REST path → GameEventType mapping (from GameEvent.h)
// Used to route postNoArg/postIdArg through game:dispatch IPC in addon mode
const REST_TO_EVENT = {
    '/clear_event_string': 5,
    '/start_ticker': 10,
    '/run_ticker': 13,
    '/stop_ticker': 15,
    '/set_ticker_speed': 1160,
    '/loadgame': 20,
    '/newgame': 30,
    '/savegame': 40,
    '/exit_game': 45,
    '/check_scoreboard': 50,
    '/buy_stock': 60,
    '/sell_stock': 70,
    '/short_stock': 80,
    '/cover_short_stock': 90,
    '/buy_corporate_bond': 100,
    '/sell_corporate_bond': 110,
    '/buy_long_govt_bonds': 120,
    '/sell_long_govt_bonds': 125,
    '/buy_short_govt_bonds': 130,
    '/sell_short_govt_bonds': 135,
    '/buy_commodity_futures': 140,
    '/sell_commodity_futures': 150,
    '/short_commodity_futures': 160,
    '/cover_short_commodity_futures': 170,
    '/buy_physical_commodity': 180,
    '/sell_physical_commodity': 190,
    '/buy_physical_crypto': 200,
    '/sell_physical_crypto': 210,
    '/buy_crypto_futures': 220,
    '/sell_crypto_futures': 230,
    '/buy_calls': 280,
    '/sell_calls': 290,
    '/buy_puts': 300,
    '/sell_puts': 310,
    '/advanced_options_trading': 330,
    '/exercise_call_options_early': 340,
    '/exercise_put_options_early': 350,
    '/prepay_taxes': 360,
    '/elect_ceo': 370,
    '/resign_as_ceo': 380,
    '/change_managers': 390,
    '/set_dividend': 400,
    '/set_productivity': 410,
    '/set_growth_rate': 420,
    '/restructure': 430,
    '/buy_corporate_assets': 440,
    '/sell_corporate_assets': 450,
    '/view_for_sale_items': 456,
    '/sell_subsidiary_stock': 460,
    '/rebrand': 470,
    '/toggle_company_autopilot': 480,
    '/toggle_global_autopilot': 490,
    '/become_etf_advisor': 500,
    '/set_advisory_fee': 510,
    '/merger': 530,
    '/greenmail': 540,
    '/lbo': 550,
    '/startup': 560,
    '/capital_contribution': 570,
    '/public_stock_offering': 580,
    '/private_stock_offering': 590,
    '/issue_new_corp_bonds': 600,
    '/redeem_corp_bonds': 610,
    '/extraordinary_dividend': 620,
    '/tax_free_liquidation': 630,
    '/taxable_liquidation': 640,
    '/spin_off': 650,
    '/split_stock': 660,
    '/reverse_split_stock': 670,
    '/borrow_money': 680,
    '/repay_loan': 690,
    '/advance_funds': 700,
    '/call_in_advance': 710,
    '/interest_rate_swaps': 720,
    '/view_swap_details': 724,
    '/terminate_swap': 725,
    '/set_bank_allocation': 730,
    '/trade_tbills': 740,
    '/list_bank_loans': 750,
    '/change_bank': 770,
    '/call_in_loan': 780,
    '/buy_business_loans': 810,
    '/sell_business_loan': 820,
    '/buy_consumer_loans': 830,
    '/sell_consumer_loans': 840,
    '/buy_prime_mortgages': 850,
    '/sell_prime_mortgages': 860,
    '/buy_subprime_mortgages': 870,
    '/sell_subprime_mortgages': 880,
    '/list_etfs': 890,
    '/freeze_all_loans': 900,
    '/freeze_loan': 905,
    '/decrease_earnings': 910,
    '/increase_earnings': 920,
    '/change_law_firm': 930,
    '/antitrust_lawsuit': 940,
    '/harrassing_lawsuit': 950,
    '/spread_rumors': 960,
    '/credit_info': 1080,
    '/clear_chart': 1090,
    '/growth_throttle': 1100,
    '/clear_stream_list': 1110,
    '/fill_stream_list': 1120,
    '/database_search': 1150,
    '/set_ticker_speed': 1160,
    '/set_view_asset': 2000,
    '/set_view_industry': 2003,
    '/change_acting_as': 2001,
    '/toggle_streaming_quote': 2002,
    '/close_modal': 3000,
    // '/set_active_ui_report' — handled as special case in postIdArg (direct pointer write, not an event)
    '/set_tutorial_step': 4100,
    '/set_tutorial_enabled': 4101,
    '/supp_earn_select': 2100,
    '/currency_select': 2101,
    '/supp_warn_select': 2102,
    '/suppress_select': 2103,
    '/autosave_select': 2104,
    '/exercise_select': 2105,
    '/sweep_select': 2106,
    '/makedelivery_select': 2107,
    '/takedelivery_select': 2108,
    '/tooltips_select': 2109,
    '/shareholdergraph_select': 2110,
    '/unethical_select': 2111,
    '/disablehotkeys_select': 2112,
    '/autoadd_select': 2113,
    '/cheat_disable_lawsuits': 2120,
    '/cheat_merger_info': 2121,
    '/cheat_earnings_info': 2122,
    '/cheat_add_cash': 2123,
    '/create_price_alert': 4102,
    '/delete_price_alert': 4103,
    '/show_price_alerts': 4104,
};

// Market report REST paths that use trigger_event with specific GameEventTypes
const REPORT_PATH_TO_EVENT = {
    '/view_current_interest_rates': 970,
    '/whos_ahead': 980,
    '/db_research_tool': 990,
    '/economic_stats': 1000,
    '/most_cash_report': 1010,
    '/largest_market_cap': 1020,
    '/largest_tax_losses': 1030,
    '/industry_summary': 1040,
    '/industry_projections': 1050,
    '/view_corp_assets_for_sale': 1060,
};

// Network error handling - refresh browser only after sustained failures (e.g., sleep/wake).
// Transient failures (server busy during game load) must NOT trigger reload or it causes
// an infinite refresh loop: load game -> server busy -> fetch fails -> reload -> repeat.
let _networkFailCount = 0;
const NETWORK_FAIL_THRESHOLD = 5;

async function fetchWithRetry(url, options = {}) {
    const method = options.method || 'GET';
    const pathOnly = url.replace(apiBase, '');
    const t0 = performance.now();
    try {
        const response = await fetch(url, options);
        _networkFailCount = 0; // Reset on any successful fetch
        return response;
    } catch (error) {
        _networkFailCount++;
        if (_networkFailCount <= 1 || _networkFailCount % 10 === 0) {
            console.warn(`[FETCH #${_networkFailCount}] ${method} ${pathOnly} FAILED (${(performance.now() - t0).toFixed(1)}ms, streak=${_networkFailCount}): ${error.message}`);
        }
        throw error;
    }
}

// Industry IDs
export const PLAYER_IND = 0;
export const BANK_IND = 1;
export const INSURANCE_IND = 2;
export const SECURITIES_BROKER_IND = 37;
export const ETF_IND = 71;

// Entity IDs
export const HUMAN1_ID = 2;
export const COMPUTER1_ID = 1;
export const COMPUTER2_ID = 3;
export const COMPUTER3_ID = 4;
export const COMPUTER4_ID = 5;
export const STOCK_INDEX_ID = 0;
export const CMOD_ID = 1600;  // Basic Commodities Fund ETF
export const OIL_ID = 6;
export const GOLD_ID = 7;
export const SILVER_ID = 8;
export const WHEAT_ID = 9;
export const CORN_ID = 10;
export const PRIME_RATE_ID = 1601;
export const TBOND_RATE_ID = 1602;
export const SBOND_RATE_ID = 1603;
export const GNP_RATE_ID = 1604;
export const BITCOIN_ID = 1605;
export const ETHEREUM_ID = 1606;

// UI IDs
export const UI_ADVISORY_REPORT = 1;
export const UI_MARKET_REPORTS_COMMOD_FUTURES_REPORT = 1;
export const UI_MARKET_REPORTS_COMMOD_PHYSICAL_REPORT = 2;
export const UI_MARKET_REPORTS_OPTIONS_REPORT = 3;
export const UI_MARKET_REPORTS_INTEREST_RATE_SWAPS_REPORT = 4;
export const UI_MARKET_REPORTS_STOCKS_REPORT = 5;
export const UI_MARKET_REPORTS_INVESTMENT_CONTRACTS_REPORT = 6;
export const UI_MARKET_REPORTS_INDUSTRY_GROWTH_RATES_REPORT = 7;
export const UI_MARKET_REPORTS_LARGEST_MARKET_SHARE_REPORT = 8;
export const UI_MARKET_REPORTS_LARGEST_TAX_LOSSES_REPORT = 9;
export const UI_MARKET_REPORTS_MOST_CASH_REPORT = 10;
export const UI_MARKET_REPORTS_MOST_MARKET_CAP_REPORT = 11;
export const UI_MARKET_REPORTS_ECON_STATS_REPORT = 12;
export const UI_MARKET_REPORTS_INTEREST_RATES_REPORT = 13;
export const UI_MARKET_REPORTS_WHO_AHEAD_REPORT = 14;
export const UI_INDUSTRY_SUMMARY_REPORT = 15;
export const UI_INDUSTRY_PROJECTIONS_REPORT = 16;
export const UI_CORP_FINANCIAL_PROFILE = 17;
export const UI_BANK_LOANS_LIST = 18;
export const UI_CORP_CASH_FLOW_PROJECTION = 19;
export const UI_CORP_RESEARCH_REPORT = 20;
export const UI_CORP_STOCKS_BONDS_PORTFOLIO = 21;
export const UI_CORP_OPTIONS_PORTFOLIO = 22;
export const UI_CORP_SHAREHOLDERS_LIST = 23;
export const UI_CORP_COMMODITY_CONTRACTS_LIST = 24;
export const UI_CORP_EARNINGS_REPORT = 25;
export const UI_PLAYER_FINANCIAL_PROFILE = 26;
export const UI_PLAYER_CASH_FLOW_PROJECTION = 27;
export const UI_PLAYER_STOCKS_BONDS_PORTFOLIO = 28;
export const UI_PLAYER_OPTIONS_PORTFOLIO = 29;
export const UI_PLAYER_CORPORATIONS_LIST = 30;
export const UI_PLAYER_COMMODITY_CONTRACTS_LIST = 31;
export const UI_PLAYER_ADVANCES_LIST = 32;
export const UI_MARKET_HEATMAP = 33;
export const UI_INDUSTRY_HEATMAP = 34;
export const UI_INDUSTRIES_HEATMAP = 35;
export const UI_COMPANIES_HEATMAP = 36;
export const UI_CORP_SWAPS_PORTFOLIO = 37;
export const UI_PLAYER_SWAPS_PORTFOLIO = 38;
export const UI_DB_SEARCH = 39;
export const UI_CORP_HOLDINGS = 40;
export const UI_PLAYER_HOLDINGS = 41;
export const UI_CORP_OVERVIEW = 42;

export async function postNoArg(path) {
    if (useIPC) {
        // Special-case endpoints that need dedicated IPC handlers
        if (path === '/close_modal') { return ipcRenderer.invoke('game:closeModal'); }
        if (path === '/splash_screen_played') { return ipcRenderer.invoke('game:splashScreenPlayed'); }

        // Map REST path to event type and dispatch via IPC
        const eventType = REST_TO_EVENT[path] ?? REPORT_PATH_TO_EVENT[path];
        if (eventType !== undefined) {
            return ipcRenderer.invoke('game:dispatch', eventType, 0, '');
        }
        console.warn('[api] No IPC mapping for POST', path);
    }
    const url = `${apiBase}${path}`;
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.text();
}

export async function postIdArg(path, id) {
    if (useIPC) {
        // /asset_chart needs its own IPC handler (returns data, not just ack)
        if (path === '/asset_chart') {
            return ipcRenderer.invoke('game:getAssetChart', typeof id === 'string' ? Number(id) : id);
        }
        // /set_who_owns_filter uses a different param name
        if (path === '/set_who_owns_filter') {
            return ipcRenderer.invoke('game:setWhoOwnsFilter', id);
        }
        // /set_active_ui_report is a direct pointer write, not an event
        if (path === '/set_active_ui_report') {
            return ipcRenderer.invoke('game:setActiveUIReport', id);
        }

        const eventType = REST_TO_EVENT[path];
        if (eventType !== undefined) {
            return ipcRenderer.invoke('game:dispatch', eventType, id || 0, '');
        }
        console.warn('[api] No IPC mapping for POST', path, 'id=', id);
    }
    const url = `${apiBase}${path}`;
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
}

// Like postIdArg but optionally includes intParam2 (acting-as entity override).
// If actingAsId > 0, C++ handler switches acting-as, executes the trade, then restores.
export async function postIdArgWithActingAs(path, id, actingAsId = 0) {
    if (useIPC) {
        const eventType = REST_TO_EVENT[path];
        if (eventType !== undefined) {
            return ipcRenderer.invoke('game:dispatch', eventType, id || 0, '', actingAsId || 0);
        }
        console.warn('[api] No IPC mapping for POST', path, 'id=', id);
    }
    const url = `${apiBase}${path}`;
    const body = (actingAsId > 0) ? { id, intParam2: actingAsId } : { id };
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
}

export async function postStringArg(path, str) {
    if (useIPC) {
        // String-arg endpoints: map to event + strParam1
        if (path === '/load_specific_save') {
            // LOAD_SPECIFIC_GAME = 21, str goes in strParam1 as "filename"
            return ipcRenderer.invoke('game:dispatch', 21, 0, str || '');
        }
        if (path === '/savegameas') {
            // SAVE_GAME_AS = 41, filename in strParam1
            return ipcRenderer.invoke('game:dispatch', 41, 0, str || '');
        }
        console.warn('[api] No IPC mapping for POST string', path);
    }
    const url = `${apiBase}${path}`;
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ str })
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.text();
}

export async function getJSON(path) {
    if (useIPC) {
        if (path === '/gamestate') return ipcRenderer.invoke('game:getGameState');
        if (path === '/database_data') return ipcRenderer.invoke('game:getDatabaseData');
        if (path === '/ownership_tree') return ipcRenderer.invoke('game:getOwnershipTree');
        if (path === '/subsidiaries_tree') return ipcRenderer.invoke('game:getSubsidiariesTree');
        if (path === '/quote') return ipcRenderer.invoke('game:getQuote');
        console.warn('[api] No IPC mapping for GET', path);
    }
    const url = `${apiBase}${path}`;
    const response = await fetchWithRetry(url);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return data;
}

// Fetch database search data
export async function getDatabaseData() {
    return getJSON('/database_data');
}

// Fetch ownership tree (who owns the active entity)
export async function getOwnershipTree() {
    return getJSON('/ownership_tree');
}

// Fetch subsidiaries tree (what the active entity owns)
export async function getSubsidiariesTree() {
    return getJSON('/subsidiaries_tree');
}

export function isPlayerControlled(controlledCompanies, entityId) {
    return (controlledCompanies || []).some(c => c.id === entityId);
}

export function isPlayerCEO(chairedCompanyId, entityId) {
    return chairedCompanyId === entityId;
}

export function getCompanyBySymbol(allCompanies, symbol) {
    return (allCompanies || []).find(c => c.symbol === symbol);
}

export function getIndustry(allIndustries, industryNum) {
    return (allIndustries || []).find(ind => ind.id === industryNum);
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

let lookup = {};

// Memoization cache for buildDictRegex - avoids rebuilding on every 50ms poll
let _cachedRegex = null;
let _cachedFingerprint = '';

function _dictFingerprint(allCompanies, allIndustries) {
    // Fast fingerprint: count + first/last IDs. Lists only change on mergers/new companies.
    const cl = (allCompanies || []).length;
    const il = (allIndustries || []).length;
    const c0 = cl > 0 ? allCompanies[0].id : 0;
    const cN = cl > 0 ? allCompanies[cl - 1].id : 0;
    const i0 = il > 0 ? allIndustries[0].id : 0;
    const iN = il > 0 ? allIndustries[il - 1].id : 0;
    return `${cl}:${c0}:${cN}:${il}:${i0}:${iN}`;
}

export function buildDictRegex(allCompanies, allIndustries) {
    // Return cached regex if the company/industry lists haven't changed
    const fp = _dictFingerprint(allCompanies, allIndustries);
    if (_cachedRegex && fp === _cachedFingerprint) {
        return _cachedRegex;
    }
    _cachedFingerprint = fp;

    lookup = Object.create(null); // key: lowercased token -> {id, type}

    // Companies: match by symbol (2+ chars only to avoid false hyperlinks) and name
    // BUG-027/082/103: Single-letter symbols (N, X, T, E, M, H, L) trigger on common words
    for (const c of allCompanies || []) {
        if (c.symbol && c.symbol.length >= 2) lookup[c.symbol] = { id: c.id, type: 'C' };
        if (c.name) lookup[c.name] = { id: c.id, type: 'C' };
    }

    // Industries: names can be multi-word, add common informal aliases (BUG-088)
    const INDUSTRY_ALIASES = {
        'BIOTECHNOLOGY': ['BioTech', 'Biotech', 'BIOTECH'],
        'MEDICAL EQUIP. / SUPPLIES': ['Medical Supplies', 'Medical Equipment'],
        'ENTERTAIN. & BROADCAST': ['Entertainment', 'Broadcasting'],
        'HOUSEHOLD & PERS. PRODS.': ['Household Products'],
        'INTERNET SERV. / CONTENT': ['Internet Services', 'Internet'],
        'NETWORK & TELECOM EQUIP.': ['Telecom Equipment'],
    };
    for (const ind of allIndustries || []) {
        if (ind.name) {
            lookup[ind.name] = { id: ind.id, type: 'I' };
            lookup[toTitleCase(ind.name)] = { id: ind.id, type: 'I' };
            lookup[toTitleCase(ind.name).toUpperCase()] = { id: ind.id, type: 'I' };
            // Add aliases for industry names that appear informally in game text
            const aliases = INDUSTRY_ALIASES[ind.name];
            if (aliases) {
                for (const alias of aliases) {
                    lookup[alias] = { id: ind.id, type: 'I' };
                }
            }
        }
    }

    const keys = Object.keys(lookup);

    const esc = keys.map(escapeRe).sort((a, b) => b.length - a.length);

    const singles = esc.filter(k => /^[A-Za-z]$/.test(k));
    const others = esc.filter(k => !singles.includes(k));

    const parts = [];
    if (others.length) parts.push(`(?:${others.join("|")})`);
    if (singles.length) parts.push(`(?:${singles.join("|")})(?!\\.(?=\\w))`);
    const core = `(?:${parts.join("|")})`;

    const parenWrapped = `(?<=\\()${core}(?=\\))`;
    const dblQuoted = `(?<=")${core}(?=")`;
    const sglQuotedBoth = `(?<=')${core}(?=')`;
    const bareEndSglOnly = `(?<!')(?<![A-Za-z0-9("'(])${core}(?=')`;
    const bareNoWrap = `(?<![A-Za-z0-9("'(])${core}(?![A-Za-z0-9)"'])`;

    const allowed = `(?:${parenWrapped}|${dblQuoted}|${sglQuotedBoth}|${bareEndSglOnly}|${bareNoWrap})`;

    const pattern =
        `(?<![./_])${allowed}(?![/$_])(?!-(?=[A-Za-z0-9]))(?!/(?=[A-Za-z0-9]))`;

    _cachedRegex = new RegExp(pattern, "g");
    return _cachedRegex;
}

function toTitleCase(str) {
    const exceptions = ['and', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'a', 'an', 'the'];
    return str
        .toLowerCase()
        .replaceAll("&", "and")
        .replace(/\b\w+/g, (w, i) =>
            exceptions.includes(w) && i !== 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)
        );
}

export function renderHyperlinks(headline, onClick, regex) {

    if ([
        "Operating Earnings",
        "LONG AND SHORT",
        "LONG POSITION",
        "SHORT POSITION",
        "Credit Rating",
        "SUBPRIME MORT.",
        "LONG BOND",
        "SHORT BOND",
        'AS "ACTIVE ENTITY"',
        "LONG PARTY",
        "NAME OF ENTITY WITH LONG",
        "SAVED AS"
    ].some(s => headline.includes(s))) return headline;

    headline = insertCurrencySymbols(headline);

    const parts = [];
    let lastIndex = 0;
    let m;

    regex.lastIndex = 0;
    while ((m = regex.exec(headline)) !== null) {
        const before = headline.slice(lastIndex, m.index);
        if (before) parts.push(before);

        const raw = m[0];
        const info = lookup[raw]; // {id, type}

        parts.push(html`
      <span
        class="text-blue-400 cursor-pointer hover:underline"
        onClick=${() => onClick({ id: info.id, type: info.type })}
      >${raw}</span>
    `);

        lastIndex = regex.lastIndex;
    }

    const after = headline.slice(lastIndex);
    if (after) parts.push(after);

    return html`${parts}`;
}

/* General */
export function getGameState() { return getJSON('/gamestate'); }
export async function clearEventString() { await postNoArg('/clear_event_string'); }
export async function startTicker() {
    // Optimistically update UI immediately so ticker starts without waiting for backend round-trip
    localTickerRunning = true;
    gameStore.setState(state => ({
        gameState: { ...state.gameState, isTickerRunning: true }
    }));
    await postNoArg('/start_ticker');
}
export async function runTicker() { await postNoArg('/run_ticker'); }
export async function stopTicker() {
    // Optimistically update UI immediately so ticker stops without waiting for backend round-trip
    localTickerRunning = false;
    gameStore.setState(state => ({
        gameState: { ...state.gameState, isTickerRunning: false }
    }));
    await postNoArg('/stop_ticker');
    advanceTutorialOnAction('stopTicker');
}
export async function setTickSpeed(speed) { await postIdArg('/set_ticker_speed', speed); }
export async function advanceTicker() {
    if (useIPC) return ipcRenderer.invoke('game:advanceTicker');
    return postNoArg('/ticker_advance');
}
export async function loadGame() {
    await postNoArg('/loadgame');
}
export async function newGame() {
    await postNoArg('/newgame');
}
export async function saveGame() { await postNoArg('/savegame'); }
export async function saveGameAs(filename) {
    if (useIPC) {
        // SAVE_GAME_AS = 41, filename in strParam1
        return ipcRenderer.invoke('game:dispatch', 41, 0, filename || '');
    }
    const url = `${apiBase}/savegameas`;
    await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
    });
}

// List available save files (via IPC to main process)
export async function listSaves() {
    return ipcRenderer.invoke('list-saves');
}

// Delete a save file (via IPC to main process)
export async function deleteSave(filename) {
    return ipcRenderer.invoke('delete-save', filename);
}

// Load a specific save file by triggering the backend load event
export async function loadSpecificSave(filename) {
    if (useIPC) {
        // LOAD_SPECIFIC_GAME = 21, filename in strParam1
        return ipcRenderer.invoke('game:dispatch', 21, 0, filename || '');
    }
    // First set the filename, then trigger load
    const url = `${apiBase}/load_specific_save`;
    await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
    });
}

// Validate Windows filename (no invalid characters)
export function isValidWindowsFilename(filename) {
    if (!filename || filename.length === 0) return false;
    // Invalid Windows filename characters: \ / : * ? " < > |
    const invalidChars = /[\\/:*?"<>|]/;
    return !invalidChars.test(filename);
}
export async function exitGame() {
    // Just send the exit_game request - WSR will show save dialog,
    // and if user confirms, WSR will exit and Electron will restart it automatically
    await postNoArg('/exit_game');
}
export async function exitToDesktop() {
    gameStore.setState(state => ({
        gameState: { ...state.gameState, isLoading: true }
    }));
    ipcRenderer.send('exit-to-desktop');
}

// Listen for wsr.exe restarting - show loading state
ipcRenderer.on('wsr-restarting', () => {
    console.log('wsr.exe exited, restarting...');
    gameStore.setState(state => ({
        gameState: { ...state.gameState, isLoading: true }
    }));
});

// Listen for wsr.exe restart completion - reset game state to show main menu
ipcRenderer.on('wsr-restarted', () => {
    console.log('wsr.exe restarted, returning to main menu...');
    gameStore.setState({ gameState: { gameLoaded: false, isLoading: false } });
});
export async function checkScoreboard() { await postNoArg('/check_scoreboard'); }
export async function getQuoteOfTheDay() { return getJSON('/quote'); }
export async function setActiveUIReport(uiId) { await postIdArg('/set_active_ui_report', uiId); }

export async function getAssetChart(id) {
    // Some Jenkins builds don't return chart history until later (e.g., after Q2 starts).
    // The UI should still render charts early in the game, so we provide a bounded
    // fallback: a flat series based on the latest known value.
    const buildFallback = () => {
        const gs = gameStore.getState?.().gameState || {};
        const month = Number.isFinite(gs.currentMonth) ? gs.currentMonth : 0;
        const year = Number.isFinite(gs.currentYear) ? gs.currentYear : 0;

        const idNum = (typeof id === 'string') ? Number(id) : id;
        let v = null;

        // Player / human net worth chart.
        if (idNum === HUMAN1_ID) v = gs.netWorth;
        // Macro charts (best-effort).
        else if (idNum === GNP_RATE_ID) v = gs.gnpRate ?? gs.gdpRate ?? gs.gdp;
        else if (idNum === PRIME_RATE_ID) v = gs.primeRate;

        // Stocks shown in Streaming Quotes.
        if (v == null) {
            const sq = Array.isArray(gs.streamingQuotesList) ? gs.streamingQuotesList : [];
            const hit = sq.find(q => Number(q?.id) === idNum);
            if (hit && Number.isFinite(hit.price)) v = hit.price;
        }

        // Last resort: 0 so chart can still paint.
        if (!Number.isFinite(v)) v = 0;

        return {
            prices: [v, v, v, v, v, v],
            highs: [],
            lows: [],
            baseMonth: month,
            baseYear: year,
        };
    };

    try {
        const data = await postIdArg('/asset_chart', id);
        if (data && Array.isArray(data.prices) && data.prices.length >= 3) {
            // Filter out leading zeros — matching PB's charTEST.inc behavior.
            // Zero values compress the chart scale, making it look like only
            // the current price is shown.
            const firstNonZero = data.prices.findIndex(p => p !== 0);
            if (firstNonZero > 0) {
                const fillValue = data.prices[firstNonZero];
                for (let i = 0; i < firstNonZero; i++) {
                    data.prices[i] = fillValue;
                }
            }
            if (!Array.isArray(data.highs)) data.highs = [];
            if (!Array.isArray(data.lows)) data.lows = [];
            return data;
        }
        return buildFallback();
    } catch (e) {
        console.error(e);
        return buildFallback();
    }
}

/* Trading Center - Stocks */
export async function buyStock(id, actingAsId = 0) {
    console.log('[Tutorial] buyStock called with id:', id);
    try {
        await postIdArgWithActingAs('/buy_stock', id, actingAsId);
    } finally {
        // Call advanceTutorialOnAction even if API call fails
        advanceTutorialOnAction('buyStock');
    }
}
export async function sellStock(id, actingAsId = 0) { await postIdArgWithActingAs('/sell_stock', id, actingAsId); }
export async function shortStock(id, actingAsId = 0) { await postIdArgWithActingAs('/short_stock', id, actingAsId); }
export async function coverShortStock(id, actingAsId = 0) { await postIdArgWithActingAs('/cover_short_stock', id, actingAsId); }

/* Bonds */
export async function buyCorporateBond(id, actingAsId = 0) { await postIdArgWithActingAs('/buy_corporate_bond', id, actingAsId); }
export async function sellCorporateBond(id, actingAsId = 0) { await postIdArgWithActingAs('/sell_corporate_bond', id, actingAsId); }
export async function buyLongGovtBonds(actingAsId = 0) { await postIdArgWithActingAs('/buy_long_govt_bonds', 0, actingAsId); }
export async function sellLongGovtBonds(actingAsId = 0) { await postIdArgWithActingAs('/sell_long_govt_bonds', 0, actingAsId); }
export async function buyShortGovtBonds(actingAsId = 0) { await postIdArgWithActingAs('/buy_short_govt_bonds', 0, actingAsId); }
export async function sellShortGovtBonds(actingAsId = 0) { await postIdArgWithActingAs('/sell_short_govt_bonds', 0, actingAsId); }

/* Commodity Futures */
export async function buyCommodityFutures(id, actingAsId = 0) { await postIdArgWithActingAs('/buy_commodity_futures', id, actingAsId); }
export async function sellCommodityFutures(id, actingAsId = 0) { await postIdArgWithActingAs('/sell_commodity_futures', id, actingAsId); }
export async function closeLongCommodityFuturesBySlot(slot, actingAsId = 0) { await postIdArgWithActingAs('/close_long_commodity_futures_by_slot', slot, actingAsId); }
export async function shortCommodityFutures(id, actingAsId = 0) { await postIdArgWithActingAs('/short_commodity_futures', id, actingAsId); }
export async function coverShortCommodityFutures(id, actingAsId = 0) { await postIdArgWithActingAs('/cover_short_commodity_futures', id, actingAsId); }
export async function coverShortCommodityFuturesBySlot(slot, actingAsId = 0) { await postIdArgWithActingAs('/cover_short_commodity_futures_by_slot', slot, actingAsId); }

/* Physical Commodities */
export async function buyPhysicalCommodity(id, actingAsId = 0) { await postIdArgWithActingAs('/buy_physical_commodity', id, actingAsId); }
export async function sellPhysicalCommodity(id, actingAsId = 0) { await postIdArgWithActingAs('/sell_physical_commodity', id, actingAsId); }

/* Crypto */
export async function buyPhysicalCrypto(id, actingAsId = 0) { await postIdArgWithActingAs('/buy_physical_crypto', id, actingAsId); }
export async function sellPhysicalCrypto(id) { await postIdArg('/sell_physical_crypto', id); }
export async function buyCryptoFutures(id, actingAsId = 0) { await postIdArgWithActingAs('/buy_crypto_futures', id, actingAsId); }
export async function sellCryptoFutures(id) { await postIdArg('/sell_crypto_futures', id); }

/* Options */
export async function buyCalls(id, actingAsId = 0) { await postIdArgWithActingAs('/buy_calls', id, actingAsId); }
export async function sellCalls(id, actingAsId = 0) { await postIdArgWithActingAs('/sell_calls', id, actingAsId); }
export async function buyPuts(id, actingAsId = 0) { await postIdArgWithActingAs('/buy_puts', id, actingAsId); }
export async function sellPuts(id, actingAsId = 0) { await postIdArgWithActingAs('/sell_puts', id, actingAsId); }
export async function advancedOptionsTrading(actingAsId = 0) { await postIdArgWithActingAs('/advanced_options_trading', 0, actingAsId); }
export async function exerciseCallOptionsEarly(id, actingAsId = 0) { await postIdArgWithActingAs('/exercise_call_options_early', id, actingAsId); }
export async function exercisePutOptionsEarly(id, actingAsId = 0) { await postIdArgWithActingAs('/exercise_put_options_early', id, actingAsId); }

/* Management */
export async function prepayTaxes(actingAsId = 0) { await postIdArgWithActingAs('/prepay_taxes', 0, actingAsId); }
export async function electCeo(actingAsId = 0) { await postIdArgWithActingAs('/elect_ceo', 0, actingAsId); }
export async function resignAsCeo(actingAsId = 0) { await postIdArgWithActingAs('/resign_as_ceo', 0, actingAsId); }
export async function changeManagers(actingAsId = 0) { await postIdArgWithActingAs('/change_managers', 0, actingAsId); }
export async function setDividend(actingAsId = 0) { await postIdArgWithActingAs('/set_dividend', 0, actingAsId); }
export async function setProductivity(actingAsId = 0) { await postIdArgWithActingAs('/set_productivity', 0, actingAsId); }
export async function setGrowthRate(actingAsId = 0) { await postIdArgWithActingAs('/set_growth_rate', 0, actingAsId); }
export async function restructure(actingAsId = 0) { await postIdArgWithActingAs('/restructure', 0, actingAsId); }
export async function buyCorporateAssets(actingAsId = 0) { await postIdArgWithActingAs('/buy_corporate_assets', 0, actingAsId); }
export async function sellCorporateAssets(actingAsId = 0) { await postIdArgWithActingAs('/sell_corporate_assets', 0, actingAsId); }
export async function viewForSaleItems(actingAsId = 0) { await postIdArgWithActingAs('/view_for_sale_items', 0, actingAsId); }
export async function sellSubsidiaryStock(id, actingAsId = 0) { await postIdArgWithActingAs('/sell_subsidiary_stock', id, actingAsId); }
export async function rebrand(actingAsId = 0) { await postIdArgWithActingAs('/rebrand', 0, actingAsId); }
export async function toggleCompanyAutopilot(id) { await postIdArg('/toggle_company_autopilot', id); }
export async function toggleGlobalAutopilot(actingAsId = 0) { await postIdArgWithActingAs('/toggle_global_autopilot', 0, actingAsId); }
export async function becomeEtfAdvisor(actingAsId = 0) { await postIdArgWithActingAs('/become_etf_advisor', 0, actingAsId); }
export async function setAdvisoryFee(actingAsId = 0) { await postIdArgWithActingAs('/set_advisory_fee', 0, actingAsId); }

/* Deals & Funding */
export async function merger(targetId = 0, actingAsId = 0) { await postIdArgWithActingAs('/merger', targetId, actingAsId); }
export async function greenmail(targetId = 0, actingAsId = 0) { await postIdArgWithActingAs('/greenmail', targetId, actingAsId); }
export async function lbo(targetId = 0, actingAsId = 0) { await postIdArgWithActingAs('/lbo', targetId, actingAsId); }
export async function startup(actingAsId = 0) { await postIdArgWithActingAs('/startup', 0, actingAsId); }
export async function capitalContribution(actingAsId = 0) { await postIdArgWithActingAs('/capital_contribution', 0, actingAsId); }
export async function publicStockOffering(actingAsId = 0) { await postIdArgWithActingAs('/public_stock_offering', 0, actingAsId); }
export async function privateStockOffering(actingAsId = 0) { await postIdArgWithActingAs('/private_stock_offering', 0, actingAsId); }
export async function issueNewCorpBonds(actingAsId = 0) { await postIdArgWithActingAs('/issue_new_corp_bonds', 0, actingAsId); }
export async function redeemCorpBonds(actingAsId = 0) { await postIdArgWithActingAs('/redeem_corp_bonds', 0, actingAsId); }
export async function extraordinaryDividend(actingAsId = 0) { await postIdArgWithActingAs('/extraordinary_dividend', 0, actingAsId); }
export async function taxFreeLiquidation(actingAsId = 0) { await postIdArgWithActingAs('/tax_free_liquidation', 0, actingAsId); }
export async function taxableLiquidation(actingAsId = 0) { await postIdArgWithActingAs('/taxable_liquidation', 0, actingAsId); }
export async function spinOff(id) { await postIdArg('/spin_off', id); }
export async function splitStock(actingAsId = 0) { await postIdArgWithActingAs('/split_stock', 0, actingAsId); }
export async function reverseSplitStock(actingAsId = 0) { await postIdArgWithActingAs('/reverse_split_stock', 0, actingAsId); }

/* Lender Services */
export async function borrowMoney(actingAsId = 0) { await postIdArgWithActingAs('/borrow_money', 0, actingAsId); }
export async function repayLoan(actingAsId = 0) { await postIdArgWithActingAs('/repay_loan', 0, actingAsId); }
export async function advanceFunds(actingAsId = 0) { await postIdArgWithActingAs('/advance_funds', 0, actingAsId); }
export async function callInAdvance(id) { await postIdArg('/call_in_advance', id); }
export async function interestRateSwaps(actingAsId = 0) { await postIdArgWithActingAs('/interest_rate_swaps', 0, actingAsId); }
export async function viewSwapDetails(id, actingAsId = 0) { await postIdArgWithActingAs('/view_swap_details', id, actingAsId); }
export async function terminateSwap(id, actingAsId = 0) { await postIdArgWithActingAs('/terminate_swap', id, actingAsId); }

/* Bank/Insurance Specific */
export async function setBankAllocation(actingAsId = 0) { await postIdArgWithActingAs('/set_bank_allocation', 0, actingAsId); }
export async function tradeTbills(actingAsId = 0) { await postIdArgWithActingAs('/trade_tbills', 0, actingAsId); }
export async function listBankLoans(actingAsId = 0) { await postIdArgWithActingAs('/list_bank_loans', 0, actingAsId); }
export async function changeBank(actingAsId = 0) { await postIdArgWithActingAs('/change_bank', 0, actingAsId); }
export async function callInLoan(id) { await postIdArg('/call_in_loan', id); }
export async function buyBankLoans() { await postNoArg('/buy_bank_loans'); }
export async function buyBusinessLoans(actingAsId = 0) { await postIdArgWithActingAs('/buy_business_loans', 0, actingAsId); }
export async function sellBusinessLoan(id) { await postIdArg('/sell_business_loan', id); }
export async function buyConsumerLoans(actingAsId = 0) { await postIdArgWithActingAs('/buy_consumer_loans', 0, actingAsId); }
export async function sellConsumerLoans(actingAsId = 0) { await postIdArgWithActingAs('/sell_consumer_loans', 0, actingAsId); }
export async function buyPrimeMortgages(actingAsId = 0) { await postIdArgWithActingAs('/buy_prime_mortgages', 0, actingAsId); }
export async function sellPrimeMortgages(actingAsId = 0) { await postIdArgWithActingAs('/sell_prime_mortgages', 0, actingAsId); }
export async function buySubprimeMortgages(actingAsId = 0) { await postIdArgWithActingAs('/buy_subprime_mortgages', 0, actingAsId); }
export async function sellSubprimeMortgages(actingAsId = 0) { await postIdArgWithActingAs('/sell_subprime_mortgages', 0, actingAsId); }
export async function listEtfs() { await postNoArg('/list_etfs'); }
export async function freezeAllLoans(actingAsId = 0) { await postIdArgWithActingAs('/freeze_all_loans', 0, actingAsId); }
export async function freezeLoan(id) { await postIdArg('/freeze_loan', id); }

/* Accounting */
export async function decreaseEarnings(actingAsId = 0) { await postIdArgWithActingAs('/decrease_earnings', 0, actingAsId); }
export async function increaseEarnings(actingAsId = 0) { await postIdArgWithActingAs('/increase_earnings', 0, actingAsId); }

/* Legal */
export async function changeLawFirm(actingAsId = 0) { await postIdArgWithActingAs('/change_law_firm', 0, actingAsId); }
export async function creditInfo(actingAsId = 0) { await postIdArgWithActingAs('/credit_info', 0, actingAsId); }
export async function clearChart() { await postNoArg('/clear_chart'); }
export async function growthThrottle() { await postNoArg('/growth_throttle'); }
export async function clearStreamList() { await postNoArg('/clear_stream_list'); }
export async function fillStreamList() { await postNoArg('/fill_stream_list'); }
export async function setWhoOwnsFilter(value) {
    const url = `${apiBase}/set_who_owns_filter`;
    await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
    });
}
export async function antitrustLawsuit(id, actingAsId = 0) { await postIdArgWithActingAs('/antitrust_lawsuit', id, actingAsId); }

export async function harrassingLawsuit(id, actingAsId = 0) { await postIdArgWithActingAs('/harrassing_lawsuit', id, actingAsId); }
export async function spreadRumors(id, actingAsId = 0) { await postIdArgWithActingAs('/spread_rumors', id, actingAsId); }

// Menu/Settings
export async function suppEarnSelect() { await postNoArg('/supp_earn_select'); }
export async function currencySelect() { await postNoArg('/currency_select'); }
export async function suppWarnSelect() { await postNoArg('/supp_warn_select'); }
export async function suppressSelect() { await postNoArg('/suppress_select'); }
export async function autosaveSelect() { await postNoArg('/autosave_select'); }
export async function exerciseSelect() { await postNoArg('/exercise_select'); }
export async function sweepSelect() { await postNoArg('/sweep_select'); }
export async function makedeliverySelect() { await postNoArg('/makedelivery_select'); }
export async function takedeliverySelect() { await postNoArg('/takedelivery_select'); }
export async function tooltipsSelect() { await postNoArg('/tooltips_select'); }
export async function shareholderGraphSelect() { await postNoArg('/shareholdergraph_select'); }
export async function unethicalSelect() { await postNoArg('/unethical_select'); }
export async function disableHotkeysSelect() { await postNoArg('/disablehotkeys_select'); }
export async function autoAddSelect() { await postNoArg('/autoadd_select'); }

// Cheat Menu
export async function cheatDisableLawsuits() { await postNoArg('/cheat_disable_lawsuits'); }
export async function cheatMergerInfo() { await postNoArg('/cheat_merger_info'); }
export async function cheatEarningsInfo() { await postNoArg('/cheat_earnings_info'); }
export async function cheatAddCash() { await postNoArg('/cheat_add_cash'); }

// Fullscreen toggle (Electron if available, otherwise browser fullscreen API)
export function toggleFullscreen() {
    try {
        // Electron preload bridge (if the host provides it)
        if (window?.electron?.toggleFullscreen) {
            return window.electron.toggleFullscreen();
        }
        if (window?.electron?.setFullscreen) {
            // Some builds expose a setter that toggles internally
            return window.electron.setFullscreen();
        }

        // Browser fallback
        if (!document.fullscreenElement) {
            return document.documentElement.requestFullscreen?.();
        }
        return document.exitFullscreen?.();
    } catch (e) {
        console.error('toggleFullscreen failed', e);
        // Re-throw so Toolbar.safe() can show a user message
        throw e;
    }
}

/* Market Reports */
export async function viewCurrentInterestRates() { await postNoArg('/view_current_interest_rates'); }
export async function whosAhead() { await postNoArg('/whos_ahead'); }
export async function dbResearchTool() { await postNoArg('/db_research_tool'); }
export async function economicStats() { await postNoArg('/economic_stats'); }
export async function mostCashReport() { await postNoArg('/most_cash_report'); }
export async function largestMarketCap() { await postNoArg('/largest_market_cap'); }
export async function largestTaxLosses() { await postNoArg('/largest_tax_losses'); }
export async function industrySummary() { await postNoArg('/industry_summary'); }
export async function industryProjections() { await postNoArg('/industry_projections'); }
export async function viewCorpAssetsForSale() { await postNoArg('/view_corp_assets_for_sale'); }


/*
 * Navigation is now managed in C++ (GameState.h).
 * navHistory + navPointerIndex come from gameState polling.
 * Back/forward/goto are POST calls to C++ endpoints.
 */

export async function splashScreenPlayed() { await postNoArg('/splash_screen_played'); }

/* Modal */
export async function closeModal(result) { await postNoArg('/close_modal', result); }
export async function modalResult(result) {
    if (useIPC) {
        if (typeof result === 'number') {
            return ipcRenderer.invoke('game:modalResult', result, '');
        } else {
            return ipcRenderer.invoke('game:modalResult', 0, result || '');
        }
    }
    const url = `${apiBase}/modal_result`;
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: typeof result === 'number' ? JSON.stringify({ answer: result }) : JSON.stringify({ str: result })
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.text();
}

/* CustomData API */
export async function setCustomData(blob) {
    if (useIPC) {
        return ipcRenderer.invoke('game:setCustomData', JSON.stringify(blob));
    }
    const url = `${apiBase}/set_custom_data`;
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blob)
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.text();
}

/* Price Alerts API — bridge to PB alerts.inc via events 4102/4103/4104 */
export async function showPriceAlerts() { await postNoArg('/show_price_alerts'); }

export async function createPriceAlert(entityId, direction, targetPrice) {
    const str = `${entityId}|${direction}|${targetPrice}`;
    const url = `${apiBase}/create_price_alert`;
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ str })
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.text();
}

export async function deletePriceAlert(slot) {
    const url = `${apiBase}/delete_price_alert`;
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slot })
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.text();
}

/* Ticker optimistic state */
// Track locally set ticker running state - preserve until backend catches up
let localTickerRunning = null; // null means use backend value

/* Tutorial API */
// Track locally set tutorial values - preserve until backend catches up
let localTutorialStep = null; // null means use backend value
let localTutorialEnabled = null; // null means use backend value

export async function setTutorialStep(step) {
    // Optimistically update the local state immediately
    const state = gameStore.getState();
    state.setGameState({ ...state.gameState, tutorialStep: step });
    localTutorialStep = step; // Track expected value
    return postIdArg('/set_tutorial_step', step);
}

export async function setTutorialEnabled(enabled) {
    // Optimistically update the local state immediately
    const state = gameStore.getState();
    const value = enabled ? 1 : 0;
    state.setGameState({ ...state.gameState, tutorialEnabled: value });
    localTutorialEnabled = value; // Track expected value
    return postIdArg('/set_tutorial_enabled', value);
}

// Merge new game state from polling, preserving local tutorial changes until backend catches up
export function mergeGameState(newState) {
    const state = gameStore.getState();
    const currentState = state.gameState || {};

    // For tutorialStep: keep local value until backend matches or exceeds it
    if (localTutorialStep !== null) {
        if (newState.tutorialStep >= localTutorialStep) {
            // Backend caught up, clear local override
            localTutorialStep = null;
        } else {
            // Backend hasn't caught up, use local value
            newState.tutorialStep = currentState.tutorialStep;
        }
    }

    // For tutorialEnabled: keep local value until backend matches
    if (localTutorialEnabled !== null) {
        if (newState.tutorialEnabled === localTutorialEnabled) {
            // Backend caught up, clear local override
            localTutorialEnabled = null;
        } else {
            // Backend hasn't caught up, use local value
            newState.tutorialEnabled = currentState.tutorialEnabled;
        }
    }

    // For isTickerRunning: keep local value until backend matches
    if (localTickerRunning !== null) {
        if (newState.isTickerRunning === localTickerRunning) {
            // Backend caught up, clear local override
            localTickerRunning = null;
        } else {
            // Backend hasn't caught up, use local value
            newState.isTickerRunning = currentState.isTickerRunning;
        }
    }

    // Preserve UI-only preferred tab overrides — the backend doesn't know about these
    // fields, so polling would otherwise overwrite them with undefined before the view
    // components can consume them.
    if (currentState.uiPreferredCompanyTab && !newState.uiPreferredCompanyTab) {
        newState.uiPreferredCompanyTab = currentState.uiPreferredCompanyTab;
    }
    if (currentState.uiPreferredPlayerTab && !newState.uiPreferredPlayerTab) {
        newState.uiPreferredPlayerTab = currentState.uiPreferredPlayerTab;
    }

    // BUG-105 FIX: Reuse old references when contents haven't changed.
    // This prevents unnecessary re-renders of report/list components every poll cycle.
    for (const key of Object.keys(newState)) {
        const prev = currentState[key];
        const next = newState[key];
        if (Array.isArray(prev) && Array.isArray(next)) {
            if (prev.length === next.length) {
                let same = true;
                for (let i = 0; i < prev.length; i++) {
                    if (prev[i] !== next[i]) { same = false; break; }
                }
                if (same) newState[key] = prev;
            }
        } else if (typeof prev === 'string' && typeof next === 'string' && prev === next) {
            // String dedup: reuse old reference when value hasn't changed
            // Prevents flicker in AdvisorySummary and other text components
            newState[key] = prev;
        }
    }

    return newState;
}

// Module-level tutorial action listener
// TutorialModal registers its listener here via registerTutorialActionListener
let tutorialActionListener = null;
let pendingTutorialAction = null;

export function setTutorialActionListener(listener) {
    tutorialActionListener = listener;
    // Process any pending action when listener is registered
    if (listener && pendingTutorialAction) {
        const action = pendingTutorialAction;
        pendingTutorialAction = null;
        listener(action);
    }
}

// Emit tutorial action - TutorialModal will check advanceOn.action and advanceOn.state
export function advanceTutorialOnAction(actionName) {
    const state = gameStore.getState();
    const gs = state.gameState;
    if (!gs?.tutorialEnabled) return;

    // Emit to the listener (TutorialModal handles the advancement logic)
    if (tutorialActionListener) {
        tutorialActionListener(actionName);
    } else {
        // Store pending action if listener not ready (will be processed when listener registers)
        pendingTutorialAction = actionName;
    }
}

export function serialize(obj) {
    return Object.entries(obj).map(([key, value]) => `${key}=${value}`).join('|');
}

// Navigation — C++ handles history tracking in set_view_asset/set_view_industry/change_acting_as

export async function viewIndustry(id) {
    await postIdArg('/set_view_industry', id);
    advanceTutorialOnAction('viewIndustry');
}

export async function viewDbSearch() {
    await postIdArg('/set_view_industry', -2);
    await postIdArg('/set_active_ui_report', UI_DB_SEARCH);
}

export async function openMarketHeatMap() {
    const state = gameStore.getState();
    const gs = state.gameState || {};
    const industryId = (typeof gs.activeIndustryNum === 'number' && gs.activeIndustryNum >= 0)
        ? gs.activeIndustryNum
        : 0;
    state.setGameState({ ...gs, uiPreferredIndustryTab: 'Heat Maps' });
    await viewIndustry(industryId);
    await setActiveUIReport(UI_MARKET_HEATMAP);
}

export async function setViewAsset(id) {
    // Optimistically update activeEntityNum so components reading from the store
    // during the 50ms polling gap don't compute actAs against the previous entity.
    gameStore.setState(state => ({
        gameState: { ...state.gameState, activeEntityNum: id }
    }));
    await postIdArg('/set_view_asset', id);
    if (id === HUMAN1_ID) {
        advanceTutorialOnAction('viewPlayer');
    } else {
        advanceTutorialOnAction('viewCorp');
    }
}

// Like setViewAsset but also sets a preferred tab so the destination view
// opens on the correct tab (e.g. "Stocks & Bonds" when drilling from Holdings).
// preferredTab is a string matching the tab label in IndustrialView / PlayerView.
// NOTE: the preferred tab is set AFTER the navigation REST call completes so that
// it lands in a separate render cycle and doesn't cause a simultaneous activeEntityNum
// + preferredTab state change, which previously caused rapid mount/unmount of heavy
// components (Holdings ↔ target tab) and an Oilpan OOM crash.
export async function setViewAssetWithTab(id, preferredTab) {
    const isPlayer = id <= 10; // players are entity 1-10
    // Navigate first (same as setViewAsset — single render cycle)
    gameStore.setState(state => ({
        gameState: { ...state.gameState, activeEntityNum: id }
    }));
    await postIdArg('/set_view_asset', id);
    if (id === HUMAN1_ID) {
        advanceTutorialOnAction('viewPlayer');
    } else {
        advanceTutorialOnAction('viewCorp');
    }
    // Set preferred tab AFTER navigation, in its own render cycle
    const gs = gameStore.getState().gameState || {};
    const patchKey = isPlayer ? 'uiPreferredPlayerTab' : 'uiPreferredCompanyTab';
    gameStore.getState().setGameState({ ...gs, [patchKey]: preferredTab });
}

export async function gotoPage(p) {
    const endpoint = p.type === 'industry' ? '/set_view_industry' : '/set_view_asset';
    await postIdArg(endpoint, p.id);
}

export async function goBack() {
    await postNoArg('/nav_back');
}

export async function goForward() {
    await postNoArg('/nav_forward');
}

export async function navGotoIndex(index) {
    await postIdArg('/nav_goto', index);
}

// Restore nav history from localStorage — called on game load.
// entries: [{id, type}] ordered most-recent-first.
export async function navSetHistory(entries) {
    await fetchWithRetry(`${apiBase}/nav_set_history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries)
    });
}

export async function changeActingAs(id) {
    await postIdArg('/change_acting_as', id);
}

// Cycle acting-as to next/previous controlled company
export function cycleActingAs(direction) {
    const state = gameStore.getState();
    const gs = state.gameState || {};
    const playerId = gs.playerId;
    const controlledCompanies = gs.controlledCompanies || [];
    const actingAsId = gs.actingAsId;

    // Build the full options list: player + controlled companies
    const options = [playerId, ...controlledCompanies.map(c => c.id)];
    if (options.length <= 1) return; // Nothing to cycle

    const currentIndex = options.indexOf(actingAsId);
    let nextIndex;
    if (direction > 0) {
        nextIndex = (currentIndex + 1) % options.length;
    } else {
        nextIndex = (currentIndex - 1 + options.length) % options.length;
    }
    changeActingAs(options[nextIndex]);
}
export async function toggleStreamingQuote(id) { await postIdArg('/toggle_streaming_quote', id); }

export const commandMap = {
    // === Navigation / Acting As ===

    // === Trading - Stocks ===
    'BUY':          { description: 'Buy stock',                       fn: buyStock,                    takesId: true },
    'SELL':         { description: 'Sell stock',                      fn: sellStock,                   takesId: true },
    'SHORT':        { description: 'Short stock',                     fn: shortStock,                  takesId: true },
    'COVER':        { description: 'Cover short',                     fn: coverShortStock,             takesId: true },

    // === Trading - Corporate Bonds ===
    'BUYBOND':      { description: 'Buy corporate bond',              fn: buyCorporateBond,            takesId: true },
    'SELLBOND':     { description: 'Sell corporate bond',             fn: sellCorporateBond,           takesId: true },

    // === Trading - Government Bonds ===
    'BUYLGOV':      { description: 'Buy long govt bonds',             fn: buyLongGovtBonds,            takesId: false },
    'SELLLGOV':     { description: 'Sell long govt bonds',            fn: sellLongGovtBonds,           takesId: false },
    'BUYSGOV':      { description: 'Buy short govt bonds',            fn: buyShortGovtBonds,           takesId: false },
    'SELLSGOV':     { description: 'Sell short govt bonds',           fn: sellShortGovtBonds,          takesId: false },

    // === Trading - Options ===
    'CALLS':        { description: 'Buy calls',                       fn: buyCalls,                    takesId: true },
    'SELLCALLS':    { description: 'Sell calls',                      fn: sellCalls,                   takesId: true },
    'PUTS':         { description: 'Buy puts',                        fn: buyPuts,                     takesId: true },
    'SELLPUTS':     { description: 'Sell puts',                       fn: sellPuts,                    takesId: true },
    'ADVOPTS':      { description: 'Advanced options trading',        fn: advancedOptionsTrading,      takesId: false },

    // === Trading - Commodity Futures ===
    'BUYFUT':       { description: 'Buy commodity futures',           fn: buyCommodityFutures,         takesId: true },
    'SELLFUT':      { description: 'Sell commodity futures',          fn: sellCommodityFutures,        takesId: true },
    'SHORTFUT':     { description: 'Short commodity futures',         fn: shortCommodityFutures,       takesId: true },
    'COVERFUT':     { description: 'Cover short commodity futures',   fn: coverShortCommodityFutures,  takesId: true },

    // === Trading - Physical Commodities ===
    'BUYCOMM':      { description: 'Buy physical commodity',          fn: buyPhysicalCommodity,        takesId: true },
    'SELLCOMM':     { description: 'Sell physical commodity',         fn: sellPhysicalCommodity,       takesId: true },

    // === Trading - Crypto ===
    'BUYCRYPTO':    { description: 'Buy physical crypto',             fn: buyPhysicalCrypto,           takesId: true },
    'SELLCRYPTO':   { description: 'Sell physical crypto',            fn: sellPhysicalCrypto,          takesId: true },
    'BUYCFUT':      { description: 'Buy crypto futures',              fn: buyCryptoFutures,            takesId: true },
    'SELLCFUT':     { description: 'Sell crypto futures',             fn: sellCryptoFutures,           takesId: true },

    // === Finance ===
    'BORROW':       { description: 'Borrow money',                    fn: borrowMoney,                 takesId: false },
    'REPAY':        { description: 'Repay loan',                      fn: repayLoan,                   takesId: false },
    'PREPAY':       { description: 'Prepay taxes',                    fn: prepayTaxes,                 takesId: false },
    'ADVANCE':      { description: 'Advance funds',                   fn: advanceFunds,                takesId: false },
    'SWAPS':        { description: 'Interest rate swaps',             fn: interestRateSwaps,           takesId: false },
    'TBILLS':       { description: 'Trade T-Bills',                   fn: tradeTbills,                 takesId: false },
    'CHGBANK':      { description: 'Change bank',                     fn: changeBank,                  takesId: false },

    // === Corporate - Leadership ===
    'ELECT':        { description: 'Elect yourself as CEO',           fn: electCeo,                    takesId: false },
    'RESIGN':       { description: 'Resign as CEO',                   fn: resignAsCeo,                 takesId: false },
    'MANAGERS':     { description: 'Change managers',                 fn: changeManagers,              takesId: false },

    // === Corporate - Strategy ===
    'DIVIDEND':     { description: 'Set dividend',                    fn: setDividend,                 takesId: false },
    'PRODUCTIVITY': { description: 'Set productivity',                fn: setProductivity,             takesId: false },
    'GROWTH':       { description: 'Set growth rate',                 fn: setGrowthRate,               takesId: false },
    'REBRAND':      { description: 'Rebrand company',                 fn: rebrand,                     takesId: false },
    'RESTRUCTURE':  { description: 'Restructure company',             fn: restructure,                 takesId: false },

    // === Corporate - Equity ===
    'PSO':          { description: 'Public stock offering',           fn: publicStockOffering,         takesId: false },
    'PPO':          { description: 'Private stock offering',          fn: privateStockOffering,        takesId: false },
    'SPLIT':        { description: 'Split stock',                     fn: splitStock,                  takesId: false },
    'RSPLIT':       { description: 'Reverse split stock',             fn: reverseSplitStock,           takesId: false },

    // === Corporate - Debt ===
    'ISSUEBOND':    { description: 'Issue new corp bonds',            fn: issueNewCorpBonds,           takesId: false },
    'REDEEMBOND':   { description: 'Redeem corp bonds',               fn: redeemCorpBonds,             takesId: false },

    // === Corporate - Returns / Liquidation ===
    'EXTDIV':       { description: 'Extraordinary dividend',          fn: extraordinaryDividend,       takesId: false },
    'TAXFREE':      { description: 'Tax-free liquidation',            fn: taxFreeLiquidation,          takesId: false },
    'TAXLIQ':       { description: 'Taxable liquidation',             fn: taxableLiquidation,          takesId: false },

    // === Corporate - Assets ===
    'BUYASSET':     { description: 'Buy corporate assets',            fn: buyCorporateAssets,          takesId: false },
    'SELLASSET':    { description: 'Sell corporate assets',           fn: sellCorporateAssets,         takesId: false },
    'SELLSUB':      { description: 'Sell subsidiary stock',           fn: sellSubsidiaryStock,         takesId: false },
    'SPINOFF':      { description: 'Spin off a subsidiary',           fn: spinOff,                     takesId: true },
    'BROWSE':       { description: 'Browse for-sale items',           fn: viewForSaleItems,            takesId: false },

    // === Corporate - M&A ===
    'MERGER':       { description: 'Merge with viewed company',       fn: merger,                      takesId: false },
    'GREENMAIL':    { description: 'Greenmail',                        fn: greenmail,                   takesId: false },
    'LBO':          { description: 'Leveraged buyout',                 fn: lbo,                         takesId: false },
    'STARTUP':      { description: 'Start a new company',             fn: startup,                     takesId: false },
    'CONTRIB':      { description: 'Capital contribution',            fn: capitalContribution,         takesId: false },

    // === Hostile Actions ===
    'HARASS':       { description: 'Harassing lawsuit',               fn: harrassingLawsuit,           takesId: true },
    'RUMORS':       { description: 'Spread rumors',                   fn: spreadRumors,                takesId: true },
    'ANTITRUST':    { description: 'Antitrust lawsuit',               fn: antitrustLawsuit,            takesId: true },
    'LAWFIRM':      { description: 'Change law firm',                 fn: changeLawFirm,               takesId: false },

    // === Accounting ===
    'INCREARN':     { description: 'Increase earnings',               fn: increaseEarnings,            takesId: false },
    'DECREARN':     { description: 'Decrease earnings',               fn: decreaseEarnings,            takesId: false },

    // === ETF / Advisory ===
    'FEE':          { description: 'Set advisory fee',                fn: setAdvisoryFee,              takesId: false },
    'AUTOPILOT':    { description: 'Toggle global autopilot',         fn: toggleGlobalAutopilot,       takesId: false },

    // === Bank Operations ===
    'ALLOC':        { description: 'Set bank allocation',             fn: setBankAllocation,           takesId: false },
    'LISTLOANS':    { description: 'List bank loans',                 fn: listBankLoans,               takesId: false },
    'FREEZE':       { description: 'Freeze all loans',                fn: freezeAllLoans,              takesId: false },
    'BUYBIZ':       { description: 'Buy business loans',              fn: buyBusinessLoans,            takesId: false },
    'BUYCONS':      { description: 'Buy consumer loans',              fn: buyConsumerLoans,            takesId: false },
    'SELLCONS':     { description: 'Sell consumer loans',             fn: sellConsumerLoans,           takesId: false },
    'BUYMORT':      { description: 'Buy prime mortgages',             fn: buyPrimeMortgages,           takesId: false },
    'SELLMORT':     { description: 'Sell prime mortgages',            fn: sellPrimeMortgages,          takesId: false },
    'BUYSUBMORT':   { description: 'Buy subprime mortgages',          fn: buySubprimeMortgages,        takesId: false },
    'SELLSUBMORT':  { description: 'Sell subprime mortgages',         fn: sellSubprimeMortgages,       takesId: false },
}

export const WSRContext = createContext();

export const gameStore = createStore((set, get) => ({
    gameState: {},
    setGameState: (next) => set({ gameState: next }),
    uiHoldingsTabActive: false,
    setUiHoldingsTabActive: (v) => set({ uiHoldingsTabActive: v }),
}));

const shallow = (a, b) => {
    if (Object.is(a, b)) return true;
    if (a && b && typeof a === 'object' && typeof b === 'object') {
        const ka = Object.keys(a), kb = Object.keys(b);
        if (ka.length !== kb.length) return false;
        for (let i = 0; i < ka.length; i++) {
            const k = ka[i];
            if (!Object.prototype.hasOwnProperty.call(b, k) || !Object.is(a[k], b[k])) return false;
        }
        return true;
    }
    return false;
};

export function useGameStore(selector = s => s, isEqual = Object.is) {
    const selRef = useRef(selector);
    selRef.current = selector;
    const isEqualRef = useRef(isEqual);
    isEqualRef.current = isEqual;

    const [val, setVal] = useState(() => selRef.current(gameStore.getState()));
    const valRef = useRef(val);
    valRef.current = val;

    useEffect(() => {
        const unsub = gameStore.subscribe((state) => {
            const next = selRef.current(state);
            if (!isEqualRef.current(next, valRef.current)) setVal(next);
        });
        return unsub;
    }, []); // stable subscription — selRef/valRef always point to latest values

    return val;
}

export function WSRProvider({ children }) {
    const [helpShown, setHelpShown] = useState(false);
    const [helpSectionId, setHelpSectionId] = useState(null);
    const showHelp = (sectionId = null) => {
        setHelpSectionId(sectionId);
        setHelpShown(true);
    };
    const hideHelp = () => {
        setHelpShown(false);
        setHelpSectionId(null);
    };

    // Database Search modal state
    const [dbSearchShown, setDbSearchShown] = useState(false);
    const showDbSearch = () => setDbSearchShown(true);
    const hideDbSearch = () => setDbSearchShown(false);

    // Tutorial modal state
    const showTutorial = () => setTutorialEnabled(true);
    const hideTutorial = () =>  setTutorialEnabled(false);

    const { gameState, setGameState } = useGameStore(
        s => ({ gameState: s.gameState, setGameState: s.setGameState }),
        shallow
    );

    return html`<${WSRContext.Provider} value=${{
        gameState,
        setGameState,
        helpShown,
        helpSectionId,
        showHelp,
        hideHelp,
        dbSearchShown,
        showDbSearch,
        hideDbSearch,
        showTutorial,
        hideTutorial,
    }}>
        ${children}
    <//>`;
}

export const useWSRContext = () => useContext(WSRContext);

export function debounce(fn, delay) {
    let timer = null;

    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
}

export function diffObjects(oldObj, newObj, path = []) {
    const result = {
        added: {},
        removed: {},
        changed: {}
    };

    const oldKeys = Object.keys(oldObj || {});
    const newKeys = Object.keys(newObj || {});
    const allKeys = new Set([...oldKeys, ...newKeys]);

    for (const key of allKeys) {
        const oldVal = oldObj?.[key];
        const newVal = newObj?.[key];
        const currentPath = path.concat(key).join('.');

        // Added
        if (!(key in (oldObj || {}))) {
            result.added[currentPath] = newVal;
            continue;
        }

        // Removed
        if (!(key in (newObj || {}))) {
            result.removed[currentPath] = oldVal;
            continue;
        }

        // Both exist
        if (isObject(oldVal) && isObject(newVal)) {
            const child = diffObjects(oldVal, newVal, path.concat(key));
            Object.assign(result.added, child.added);
            Object.assign(result.removed, child.removed);
            Object.assign(result.changed, child.changed);
            continue;
        }

        // Changed
        if (!isEqual(oldVal, newVal)) {
            result.changed[currentPath] = { from: oldVal, to: newVal };
        }
    }

    return result;
}

function isObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function isEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (isObject(a) && isObject(b)) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        return aKeys.every(k => isEqual(a[k], b[k]));
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((v, i) => isEqual(v, b[i]));
    }
    return false;
}

export function isDifferent(oldObj, newObj) {
    const diff = diffObjects(oldObj, newObj);
    return Object.keys(diff.added).length > 0 ||
        Object.keys(diff.removed).length > 0 ||
        Object.keys(diff.changed).length > 0;
}

export function formatThousandsPreserveCaret(e, formatFn) {
    function formatFn(value) {
        // remove commas and spaces
        const raw = value.replace(/,/g, '').trim();

        // allow empty
        if (raw === '') return '';

        // reject non-numeric input
        if (!/^\d+(\.\d*)?$/.test(raw)) return null;

        // Add thousands commas
        const num = Number(raw);
        if (isNaN(num)) return null;
        // Preserve decimals if present
        const [intPart, decPart] = raw.split('.');
        let formatted = Number(intPart).toLocaleString();
        if (decPart !== undefined) {
            formatted += '.' + decPart;
        }
        return formatted;
    }

    const input = e.target;
    const prev = input.value;
    const start = input.selectionStart ?? prev.length;

    // How many digits were to the left of the caret
    const digitsLeft = (prev.slice(0, start).match(/\d/g) || []).length;

    const formatted = formatFn(prev);
    if (formatted == null) return;

    // Apply formatted value
    input.value = formatted;

    // Restore caret after same number of digits
    let pos = 0;
    let seenDigits = 0;
    while (pos < formatted.length && seenDigits < digitsLeft) {
        if (/\d/.test(formatted[pos])) seenDigits++;
        pos++;
    }

    input.setSelectionRange(pos, pos);
}
