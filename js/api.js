import { insertCurrencySymbols } from './components/helpers.js';
import { html, render, useRef, useState, useEffect, useContext, createContext } from './lib/preact.standalone.module.js';
import zustand from './lib/zustand.module.js';
const { createStore } = zustand;

const { ipcRenderer } = require('electron');

export const apiBase = 'http://127.0.0.1:9631';

// Industry IDs
export const PLAYER_IND = 0;
export const BANK_IND = 1;
export const INSURANCE_IND = 2;
export const SECURITIES_BROKER_IND = 37;

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

export async function postNoArg(path) {
    const url = `${apiBase}${path}`;
    const response = await fetch(url, {
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
    const response = await fetch(url, {
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
    const response = await fetch(url, {
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
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return data;
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

export function buildDictRegex(allCompanies, allIndustries) {

    lookup = Object.create(null); // key: lowercased token -> {id, type}

    // Companies: match by symbol and name
    for (const c of allCompanies || []) {
        if (c.symbol) lookup[c.symbol] = { id: c.id, type: 'C' };
        if (c.name) lookup[c.name] = { id: c.id, type: 'C' };
    }

    // Industries: names can be multi-word
    for (const ind of allIndustries || []) {
        if (ind.name) {
            lookup[ind.name] = { id: ind.id, type: 'I' };
            lookup[toTitleCase(ind.name)] = { id: ind.id, type: 'I' }; // also title case
            lookup[toTitleCase(ind.name).toUpperCase()] = { id: ind.id, type: 'I' }; // also title case
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

    return new RegExp(pattern, "g");
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
export async function startTicker() { await postNoArg('/start_ticker'); }
export async function runTicker() { await postNoArg('/run_ticker'); }
export async function stopTicker() { await postNoArg('/stop_ticker'); }
export async function setTickSpeed(speed) { await postIdArg('/set_ticker_speed', speed); }
export async function loadGame() { await postNoArg('/loadgame'); }
export async function newGame() { await postNoArg('/newgame'); }
export async function saveGame() { await postNoArg('/savegame'); }
export async function exitGame() { await postNoArg('/exit_game'); }
export async function exitToDesktop() { 
    ipcRenderer.send('exit-to-desktop');
 }
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
        if (data && Array.isArray(data.prices) && data.prices.length >= 2) return data;
        return buildFallback();
    } catch (e) {
        console.error(e);
        return buildFallback();
    }
}

/* Trading Center - Stocks */
export async function buyStock(id) { await postIdArg('/buy_stock', id); }
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
export async function industryGrowthRates() { await postNoArg('/industry_growth_rates'); }

/* Who Owns What */
export async function whoOwnsCommodities() { await postNoArg('/who_owns_commodities'); }
export async function whoOwnsInterestRateSwaps() { await postNoArg('/who_owns_interest_rate_swaps'); }
export async function whoOwnsOptions() { await postNoArg('/who_owns_options'); }
export async function whoOwnsStocks() { await postNoArg('/who_owns_stocks'); }
export async function whoAreAdvisors() { await postNoArg('/who_are_advisors'); }
export async function whoOwnsCrypto() { await postNoArg('/who_owns_crypto'); }

/* Misc */
export const navHistory = [];
export let navPointerIdx = -1; // -1 means "not pointing", reset after setViewAsset
export async function splashScreenPlayed() { await postNoArg('/splash_screen_played'); }

/* Modal */
export async function closeModal(result) { await postNoArg('/close_modal', result); }
export async function modalResult(result) {
    const url = `${apiBase}/modal_result`;
    const response = await fetch(url, {
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
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blob)
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.text();
}

export function serialize(obj) {
    return Object.entries(obj).map(([key, value]) => `${key}=${value}`).join('|');
}

function shiftNavHistory(page) {

    const maxHistory = 30;

    // If we are not at the start, remove all "forward" items
    if (navPointerIdx > 0) {
        navHistory.splice(0, navPointerIdx);
    }

    // Remove if already exists in history
    const index = navHistory.findIndex(p => p.id === page.id && p.type === page.type);
    if (index !== -1) {
        navHistory.splice(index, 1);
    }

    // Insert new id at front
    navHistory.unshift(page);

    // Trim if too long
    if (navHistory.length > maxHistory) {
        navHistory.pop();
    }

    // Reset pointer to start
    navPointerIdx = 0;
}

export async function viewIndustry(id) {
    await postIdArg('/set_view_industry', id);

    shiftNavHistory({ id, type: 'industry' });
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
}

export function gotoPage(p) {
    const page = p ?? navHistory[navPointerIdx];
    if (page.type === 'industry') {
        return postIdArg('/set_view_industry', page.id);
    } else if (page.type === 'asset') {
        return postIdArg('/set_view_asset', page.id);
    }
}

export async function goBack() {
    if (navPointerIdx < navHistory.length - 1) {
        navPointerIdx++;
        gotoPage();
    }
}

export async function goForward() {
    if (navPointerIdx > 0) {
        navPointerIdx--;
        gotoPage();
    }
}

export async function changeActingAs(id) { await postIdArg('/change_acting_as', id); }
export async function toggleStreamingQuote(id) { await postIdArg('/toggle_streaming_quote', id); }

export const commandMap = {
    'ACT': {
        description: 'Act as company/player',
        fn: changeActingAs,
    },
    'BUY': {
        description: 'Buy stock',
        fn: buyStock,
    },
    'SELL': {
        description: 'Sell stock',
        fn: sellStock,
    },
    'SHORT': {
        description: 'Short stock',
        fn: shortStock,
    },
    'COVER': {
        description: 'Cover short stock',
        fn: coverShortStock,
    },
    'BORROW': {
        description: 'Borrow money',
        fn: borrowMoney,
    },
    'REPAY': {
        description: 'Repay loan',
        fn: repayLoan,
    },
    'PREPAY': {
        description: 'Prepay taxes',
        fn: prepayTaxes,
    },
    'ELECT': {
        description: 'Elect yourself as CEO',
        fn: electCeo,
    },
    'RESIGN': {
        description: 'Resign as CEO',
        fn: resignAsCeo,
    },
    'HARASS': {
        description: 'File a harassing lawsuit',
        fn: harrassingLawsuit,
    },
    'RUMORS': {
        description: 'Spread rumors about a company',
        fn: spreadRumors,
    },
    'STARTUP': {
        description: 'Start a new company',
        fn: startup,
    },
    'FEE': {
        description: 'Set advisory fee (for insurers and securities brokers)',
        fn: setAdvisoryFee,
    },
}

export const WSRContext = createContext();

export const gameStore = createStore((set, get) => ({
    gameState: {},
    setGameState: (next) => set({ gameState: next }),
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

    const [val, setVal] = useState(() => selRef.current(gameStore.getState()));
    const valRef = useRef(val);
    valRef.current = val;

    useEffect(() => {
        // sync immediately in case selector changed
        const immediate = selRef.current(gameStore.getState());
        if (!isEqual(immediate, valRef.current)) setVal(immediate);

        const unsub = gameStore.subscribe((state) => {
            const next = selRef.current(state);
            if (!isEqual(next, valRef.current)) setVal(next);
        });
        return unsub;
    }, [selector, isEqual]);

    return val;
}

export function WSRProvider({ children }) {
    const [helpShown, setHelpShown] = useState(false);
    const showHelp = () => setHelpShown(true);
    const hideHelp = () => setHelpShown(false);
    const { gameState, setGameState } = useGameStore(
        s => ({ gameState: s.gameState, setGameState: s.setGameState }),
        shallow
    );

    return html`<${WSRContext.Provider} value=${{
        gameState,
        setGameState,
        helpShown,
        showHelp,
        hideHelp,
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
