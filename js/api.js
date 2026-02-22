import { insertCurrencySymbols } from './components/helpers.js';
import { html, render, useRef, useState, useEffect, useContext, createContext } from './lib/preact.standalone.module.js';
import zustand from './lib/zustand.module.js';
const { createStore } = zustand;

const { ipcRenderer } = require('electron');

export const apiBase = 'http://127.0.0.1:9631';

// Network error handling - log sustained failures but NEVER reload.
// location.reload() was causing an infinite refresh loop:
//   POST /newgame -> wsr.exe busy/crash -> gamestate poll fails ->
//   5 failures -> location.reload() -> polling restarts -> still failing -> reload -> OOM
let _networkFailCount = 0;
const NETWORK_FAIL_THRESHOLD = 5;

async function fetchWithRetry(url, options = {}) {
    try {
        const response = await fetch(url, options);
        _networkFailCount = 0; // Reset on any successful fetch
        return response;
    } catch (error) {
        _networkFailCount++;
        if (_networkFailCount <= 1 || _networkFailCount % 10 === 0) {
            console.warn(`[FETCH #${_networkFailCount}] ${options.method || 'GET'} ${url.replace(apiBase, '')} FAILED (${(performance.now()).toFixed(1)}ms, streak=${_networkFailCount}): ${error.message}`);
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

export async function postNoArg(path) {
    const url = `${apiBase}${path}`;
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.text();
}

export async function postIdArg(path, id) {
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

export async function postStringArg(path, str) {
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
export async function advanceTicker() { return postNoArg('/ticker_advance'); }
export async function loadGame() {
    await postNoArg('/loadgame');
}
export async function newGame() {
    await postNoArg('/newgame');
}
export async function saveGame() { await postNoArg('/savegame'); }
export async function saveGameAs(filename) {
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
    // Reset navigation manager so it can re-init from customData on next game load
    navManager.reset();
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
            return data;
        }
        return buildFallback();
    } catch (e) {
        console.error(e);
        return buildFallback();
    }
}

/* Trading Center - Stocks */
export async function buyStock(id) {
    console.log('[Tutorial] buyStock called with id:', id);
    try {
        await postIdArg('/buy_stock', id);
    } finally {
        // Call advanceTutorialOnAction even if API call fails
        advanceTutorialOnAction('buyStock');
    }
}
export async function sellStock(id) { await postIdArg('/sell_stock', id); }
export async function shortStock(id) { await postIdArg('/short_stock', id); }
export async function coverShortStock(id) { await postIdArg('/cover_short_stock', id); }

/* Bonds */
export async function buyCorporateBond(id) { await postIdArg('/buy_corporate_bond', id); }
export async function sellCorporateBond(id) { await postIdArg('/sell_corporate_bond', id); }
export async function buyLongGovtBonds() { await postNoArg('/buy_long_govt_bonds'); }
export async function sellLongGovtBonds() { await postNoArg('/sell_long_govt_bonds'); }
export async function buyShortGovtBonds() { await postNoArg('/buy_short_govt_bonds'); }
export async function sellShortGovtBonds() { await postNoArg('/sell_short_govt_bonds'); }

/* Commodity Futures */
export async function buyCommodityFutures(id) { await postIdArg('/buy_commodity_futures', id); }
export async function sellCommodityFutures(id) { await postIdArg('/sell_commodity_futures', id); }
export async function shortCommodityFutures(id) { await postIdArg('/short_commodity_futures', id); }
export async function coverShortCommodityFutures(id) { await postIdArg('/cover_short_commodity_futures', id); }

/* Physical Commodities */
export async function buyPhysicalCommodity(id) { await postIdArg('/buy_physical_commodity', id); }
export async function sellPhysicalCommodity(id) { await postIdArg('/sell_physical_commodity', id); }

/* Crypto */
export async function buyPhysicalCrypto(id) { await postIdArg('/buy_physical_crypto', id); }
export async function sellPhysicalCrypto(id) { await postIdArg('/sell_physical_crypto', id); }
export async function buyCryptoFutures(id) { await postIdArg('/buy_crypto_futures', id); }
export async function sellCryptoFutures(id) { await postIdArg('/sell_crypto_futures', id); }

/* Options */
export async function buyCalls(id) { await postIdArg('/buy_calls', id); }
export async function sellCalls(id) { await postIdArg('/sell_calls', id); }
export async function buyPuts(id) { await postIdArg('/buy_puts', id); }
export async function sellPuts(id) { await postIdArg('/sell_puts', id); }
export async function sellOptions() { await postNoArg('/sell_options'); }
export async function advancedOptionsTrading() { await postNoArg('/advanced_options_trading'); }
export async function exerciseCallOptionsEarly(id) { await postIdArg('/exercise_call_options_early', id); }
export async function exercisePutOptionsEarly(id) { await postIdArg('/exercise_put_options_early', id); }

/* Management */
export async function prepayTaxes() { await postNoArg('/prepay_taxes'); }
export async function electCeo() { await postNoArg('/elect_ceo'); }
export async function resignAsCeo() { await postNoArg('/resign_as_ceo'); }
export async function changeManagers() { await postNoArg('/change_managers'); }
export async function setDividend() { await postNoArg('/set_dividend'); }
export async function setProductivity() { await postNoArg('/set_productivity'); }
export async function setGrowthRate() { await postNoArg('/set_growth_rate'); }
export async function restructure() { await postNoArg('/restructure'); }
export async function buyCorporateAssets() { await postNoArg('/buy_corporate_assets'); }
export async function sellCorporateAssets() { await postNoArg('/sell_corporate_assets'); }
export async function offerCorporateAssetsForSale() { await postNoArg('/offer_corporate_assets_for_sale'); }
export async function viewForSaleItems() { await postNoArg('/view_for_sale_items'); }
export async function sellSubsidiaryStock() { await postNoArg('/sell_subsidiary_stock'); }
export async function rebrand() { await postNoArg('/rebrand'); }
export async function toggleCompanyAutopilot(id) { await postIdArg('/toggle_company_autopilot', id); }
export async function toggleGlobalAutopilot() { await postNoArg('/toggle_global_autopilot'); }
export async function becomeEtfAdvisor() { await postNoArg('/become_etf_advisor'); }
export async function setAdvisoryFee() { await postNoArg('/set_advisory_fee'); }

/* Deals & Funding */
export async function merger() { await postNoArg('/merger'); }
export async function greenmail() { await postNoArg('/greenmail'); }
export async function lbo() { await postNoArg('/lbo'); }
export async function startup() { await postNoArg('/startup'); }
export async function capitalContribution() { await postNoArg('/capital_contribution'); }
export async function publicStockOffering() { await postNoArg('/public_stock_offering'); }
export async function privateStockOffering() { await postNoArg('/private_stock_offering'); }
export async function issueNewCorpBonds() { await postNoArg('/issue_new_corp_bonds'); }
export async function redeemCorpBonds() { await postNoArg('/redeem_corp_bonds'); }
export async function extraordinaryDividend() { await postNoArg('/extraordinary_dividend'); }
export async function taxFreeLiquidation() { await postNoArg('/tax_free_liquidation'); }
export async function taxableLiquidation() { await postNoArg('/taxable_liquidation'); }
export async function spinOff(id) { await postIdArg('/spin_off', id); }
export async function splitStock() { await postNoArg('/split_stock'); }
export async function reverseSplitStock() { await postNoArg('/reverse_split_stock'); }

/* Lender Services */
export async function borrowMoney() { await postNoArg('/borrow_money'); }
export async function repayLoan() { await postNoArg('/repay_loan'); }
export async function advanceFunds() { await postNoArg('/advance_funds'); }
export async function callInAdvance(id) { await postIdArg('/call_in_advance', id); }
export async function interestRateSwaps() { await postNoArg('/interest_rate_swaps'); }
export async function viewSwapDetails(id) { await postIdArg('/view_swap_details', id); }
export async function terminateSwap(id) { await postIdArg('/terminate_swap', id); }

/* Bank/Insurance Specific */
export async function setBankAllocation() { await postNoArg('/set_bank_allocation'); }
export async function tradeTbills() { await postNoArg('/trade_tbills'); }
export async function listBankLoans() { await postNoArg('/list_bank_loans'); }
export async function changeBank() { await postNoArg('/change_bank'); }
export async function callInLoan(id) { await postIdArg('/call_in_loan', id); }
export async function buyBankLoans() { await postNoArg('/buy_bank_loans'); }
export async function buyBusinessLoans() { await postNoArg('/buy_business_loans'); }
export async function sellBusinessLoan(id) { await postIdArg('/sell_business_loan', id); }
export async function buyConsumerLoans() { await postNoArg('/buy_consumer_loans'); }
export async function sellConsumerLoans() { await postNoArg('/sell_consumer_loans'); }
export async function buyPrimeMortgages() { await postNoArg('/buy_prime_mortgages'); }
export async function sellPrimeMortgages() { await postNoArg('/sell_prime_mortgages'); }
export async function buySubprimeMortgages() { await postNoArg('/buy_subprime_mortgages'); }
export async function sellSubprimeMortgages() { await postNoArg('/sell_subprime_mortgages'); }
export async function listEtfs() { await postNoArg('/list_etfs'); }
export async function freezeAllLoans() { await postNoArg('/freeze_all_loans'); }
export async function freezeLoan(id) { await postIdArg('/freeze_loan', id); }

/* Accounting */
export async function decreaseEarnings() { await postNoArg('/decrease_earnings'); }
export async function increaseEarnings() { await postNoArg('/increase_earnings'); }

/* Legal */
export async function changeLawFirm() { await postNoArg('/change_law_firm'); }
export async function creditInfo() { await postNoArg('/credit_info'); }
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
export async function antitrustLawsuit(id) { await postIdArg('/antitrust_lawsuit', id); }

export async function harrassingLawsuit(id) { await postIdArg('/harrassing_lawsuit', id); }
export async function spreadRumors(id) { await postIdArg('/spread_rumors', id); }

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
 * Navigation Manager – purely local state.
 *
 * History lives in-memory on this instance.  The UI reads from
 * store.navState (separate from gameState, never overwritten by polling).
 * CustomData is only used for save/restore persistence (debounced).
 */
class NavigationManager {
    constructor() {
        this.history = [];
        this.pointerIndex = 0;
        this.maxHistory = 30;
        this.initialized = false;
        this._persistTimer = null;
    }

    // Restore from CustomData on app load (called once)
    init(savedData) {
        if (savedData?.entries && this.history.length === 0) {
            this.history = savedData.entries.slice();
            this.pointerIndex = Math.max(0, Math.min(
                savedData.pointerIndex ?? 0, this.history.length - 1));
        }
        this.initialized = true;
        this._notifyUI();
    }

    // Reset navigation state (called on wsr restart / exit game)
    reset() {
        this.history = [];
        this.pointerIndex = 0;
        this.initialized = false;
        clearTimeout(this._persistTimer);
        this._notifyUI();
    }

    // Push local state to the store so reactive components re-render.
    // This ONLY touches navState, never gameState.
    _notifyUI() {
        gameStore.getState().setNavState({
            entries: this.history.slice(),
            pointerIndex: this.pointerIndex,
        });
    }

    // Debounced save to CustomData for cross-session persistence only.
    // Does NOT touch gameState or the store.
    _schedulePersist() {
        clearTimeout(this._persistTimer);
        this._persistTimer = setTimeout(() => {
            setCustomData({
                navHistory: { entries: this.history, pointerIndex: this.pointerIndex }
            }).catch(() => {});
        }, 1000);
    }

    _navigateToCurrentPage() {
        const page = this.history[this.pointerIndex];
        if (!page) return;

        // Tab restoration (instant local state on gameState – fine, it's a pref)
        if (page.tab) {
            const state = gameStore.getState();
            const gs = state.gameState || {};
            if (page.type === 'industry') {
                state.setGameState({ ...gs, uiPreferredIndustryTab: page.tab });
            } else if (page.id === HUMAN1_ID) {
                state.setGameState({ ...gs, uiPreferredPlayerTab: page.tab });
            } else {
                state.setGameState({ ...gs, uiPreferredCompanyTab: page.tab });
            }
        }

        // Fire the POST to switch the viewed entity
        const endpoint = page.type === 'industry' ? '/set_view_industry' : '/set_view_asset';
        postIdArg(endpoint, page.id).catch(() => {});
    }

    push(page) {
        if (!page || !page.type) return;
        if (this.pointerIndex > 0) {
            this.history.splice(0, this.pointerIndex);
            this.pointerIndex = 0;
        }
        const index = this.history.findIndex(p => p.id === page.id && p.type === page.type);
        if (index !== -1) this.history.splice(index, 1);
        this.history.unshift(page);
        if (this.history.length > this.maxHistory) this.history.pop();
        this._notifyUI();
        this._schedulePersist();
    }

    goBack() {
        if (this.pointerIndex >= this.history.length - 1) return false;
        this.pointerIndex++;
        this._navigateToCurrentPage();
        this._notifyUI();
        this._schedulePersist();
        return true;
    }

    goForward() {
        if (this.pointerIndex <= 0) return false;
        this.pointerIndex--;
        this._navigateToCurrentPage();
        this._notifyUI();
        this._schedulePersist();
        return true;
    }

    gotoIndex(index) {
        if (index < 0 || index >= this.history.length) return false;
        this.pointerIndex = index;
        this._navigateToCurrentPage();
        this._notifyUI();
        this._schedulePersist();
        return true;
    }

    gotoPage(page) {
        if (!page || !page.type) return false;
        const index = this.history.findIndex(p => p.id === page.id && p.type === page.type);
        if (index !== -1) return this.gotoIndex(index);
        // Not in history – navigate directly
        if (page.type === 'industry') {
            postIdArg('/set_view_industry', page.id).catch(() => {});
        } else if (page.type === 'asset') {
            postIdArg('/set_view_asset', page.id).catch(() => {});
        }
        this.push(page);
        return true;
    }

    updateCurrentTab(tab) {
        if (this.pointerIndex >= 0 && this.pointerIndex < this.history.length) {
            this.history[this.pointerIndex].tab = tab;
            this._schedulePersist();
        }
    }
}

export const navManager = new NavigationManager();

export async function splashScreenPlayed() { await postNoArg('/splash_screen_played'); }

/* Modal */
export async function closeModal(result) { await postNoArg('/close_modal', result); }
export async function modalResult(result) {
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

    // BUG-105 FIX: Reuse old array references when contents haven't changed.
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

function shiftNavHistory(page) {
    navManager.push(page);
}

export async function viewIndustry(id) {
    await postIdArg('/set_view_industry', id);
    shiftNavHistory({ id, type: 'industry' });
    advanceTutorialOnAction('viewIndustry');
}

// Open the Database Search view (sets activeIndustryNum to -2)
export async function viewDbSearch() {
    await postIdArg('/set_view_industry', -2);
    // Also set the active UI report to trigger UpdateDatabase
    await postIdArg('/set_active_ui_report', UI_DB_SEARCH);
    shiftNavHistory({ id: -2, type: 'industry' });
}

// Open the Market Heat Map (IndustryView -> "Heat Maps" tab) from anywhere (e.g., top Menu).
// This sets a one-shot tab preference that IndustryView will consume and then clear.
export async function openMarketHeatMap() {
    const state = gameStore.getState();
    const gs = state.gameState || {};

    // Ensure IndustryView is active (needs activeIndustryNum >= 0)
    const industryId = (typeof gs.activeIndustryNum === 'number' && gs.activeIndustryNum >= 0)
        ? gs.activeIndustryNum
        : 0;

    // One-shot preference used by IndustryView to select the proper tab.
    state.setGameState({ ...gs, uiPreferredIndustryTab: 'Heat Maps' });

    // Navigate to IndustryView and request the correct report id.
    await viewIndustry(industryId);
    await setActiveUIReport(UI_MARKET_HEATMAP);
}

export async function setViewAsset(id) {
    await postIdArg('/set_view_asset', id);
    shiftNavHistory({ id, type: 'asset' });

    // Tutorial advancement
    if (id === HUMAN1_ID) {
        advanceTutorialOnAction('viewPlayer');
    } else {
        advanceTutorialOnAction('viewCorp');
    }
}

export function gotoPage(p) {
    return navManager.gotoPage(p);
}

export function goBack() {
    return navManager.goBack();
}

export function goForward() {
    return navManager.goForward();
}

// Update the tab on the current navigation entry (called when user changes tabs)
export function updateCurrentNavTab(tab) {
    navManager.updateCurrentTab(tab);
}

export async function changeActingAs(id) {
    await postIdArg('/change_acting_as', id);
    // BUG-079: Add the acting-as entity to navigation history
    if (id && id !== HUMAN1_ID) {
        shiftNavHistory({ id, type: 'asset' });
    }
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
    'ACT':          { description: 'Act as company/player',           fn: changeActingAs,              takesId: true },

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
    'OFFERASSET':   { description: 'Offer assets for sale',           fn: offerCorporateAssetsForSale, takesId: false },
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
    navState: { entries: [], pointerIndex: 0 },
    setNavState: (next) => set({ navState: next }),
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
