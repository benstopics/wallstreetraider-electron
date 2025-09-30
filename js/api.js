import { html, render, useState, useEffect } from './lib/preact.standalone.module.js';


export const apiBase = 'http://127.0.0.1:9631';

export const PLAYER_IND = 0;
export const BANK_IND = 1;
export const INSURANCE_IND = 2;
export const SECURITIES_BROKER_IND = 37;

export const PLAYER1_ID = 2;
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
    return response.text();
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

export function isPlayerControlled(gameState, entityId) {
    return (gameState.controlledCompanies || []).some(c => c.id === entityId);
}

export function isPlayerCEO(gameState, entityId) {
    return gameState.chairedCompanyId === entityId;
}

export function getCompanyBySymbol(gameState, symbol) {
    return (gameState.allCompanies || []).find(c => c.symbol === symbol);
}

export function getIndustry(gameState, industryNum) {
    return (gameState.allIndustries || []).find(ind => ind.id === industryNum);
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function buildDictRegex(keys) {
  // prefer longer keys first
  const esc = keys.map(escapeRe).sort((a,b) => b.length - a.length);

  const singles = esc.filter(k => /^[A-Za-z]$/.test(k));
  const others  = esc.filter(k => !singles.includes(k));

  const parts = [];
  if (others.length) parts.push(`(?:${others.join("|")})`);
  if (singles.length) {
    // do NOT match single-letter keys when followed by ".<word>"
    // do NOT match when preceded by apostrophe (…'S)
    parts.push(`(?:${singles.join("|")})(?!\\.(?=\\w))`);
  }

  // token boundaries: not letter/digit on both sides
  const pattern = `(?<![A-Za-z0-9])(?:${parts.join("|")})(?![A-Za-z0-9])(?!-(?=[A-Za-z0-9]))(?!/(?=[A-Za-z0-9]))`;
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

export function renderHyperlinks(headline, gameState, onClick) {
    const lookup = Object.create(null); // key: lowercased token -> {id, type}

    // Companies: match by symbol and name
    for (const c of gameState.allCompanies || []) {
        if (c.symbol) lookup[c.symbol] = { id: c.id, type: 'C' };
        if (c.name) lookup[c.name] = { id: c.id, type: 'C' };
    }

    // Industries: names can be multi-word
    for (const ind of gameState.allIndustries || []) {
        if (ind.name) {
            lookup[ind.name] = { id: ind.id, type: 'I' };
            lookup[toTitleCase(ind.name)] = { id: ind.id, type: 'I' }; // also title case
            lookup[toTitleCase(ind.name).toUpperCase()] = { id: ind.id, type: 'I' }; // also title case
        }
    }

    const keys = Object.keys(lookup);

    if (keys.length === 0) return headline;

    // Case-sensitive, whole-token match
    const regex = buildDictRegex(keys);

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
export async function toggleTicker() { await postNoArg('/toggle_ticker'); }
export async function setTickSpeed(speed) { await postIdArg('/set_ticker_speed', speed); }
export async function loadGame() { await postNoArg('/loadgame'); }
export async function newGame() { await postNoArg('/newgame'); }
export async function saveGame() { await postNoArg('/savegame'); }
export async function checkScoreboard() { await postNoArg('/check_scoreboard'); }
export async function getQuoteOfTheDay() { return getJSON('/quote'); }

export async function getAssetChart(id) {
    return getJSON(`/asset_chart?id=${id}`);
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
export async function spreadRumors() { await postNoArg('/spread_rumors'); }

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

export async function viewIndustry(id) {
    await postIdArg('/set_view_industry', id);
}

export async function setViewAsset(id) {

    await postIdArg('/set_view_asset', id);

    const maxHistory = 30;

    // If we are not at the start, remove all "forward" items
    if (navPointerIdx > 0) {
        navHistory.splice(0, navPointerIdx);
    }

    // Remove if already exists in history
    const index = navHistory.indexOf(id);
    if (index !== -1) {
        navHistory.splice(index, 1);
    }

    // Insert new id at front
    navHistory.unshift(id);

    // Trim if too long
    if (navHistory.length > maxHistory) {
        navHistory.pop();
    }

    // Reset pointer to start
    navPointerIdx = 0;
}

export async function goBack() {
    if (navPointerIdx < navHistory.length - 1) {
        navPointerIdx++;
        const id = navHistory[navPointerIdx];
        await postIdArg('/set_view_asset', id);
    }
}

export async function goForward() {
    if (navPointerIdx > 0) {
        navPointerIdx--;
        const id = navHistory[navPointerIdx];
        await postIdArg('/set_view_asset', id);
    }
}

export async function changeActingAs(id) { await postIdArg('/change_acting_as', id); }
export async function databaseSearch() { await postIdArg('/database_search'); }
export async function toggleStreamingQuote(id) { await postIdArg('/toggle_streaming_quote', id); }

export const commandMap = {
    'VIEW': {
        description: 'View acting-as profile',
        fn: (_, gameState) => setViewAsset(gameState.actingAsId),
    },
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

export function executeCommand(gameState, command) {
    const parts = command.trim().toUpperCase().split(/\s+/);
    if (parts.length === 0) return;

    let id = getCompanyBySymbol(gameState, parts[0])?.id ?? (parts[0] == 'ME' ? PLAYER1_ID : undefined);
    if (id ?? false) {
        setViewAsset(id);
        return
    }

    const cmd = commandMap[parts[0]]?.fn;
    id = getCompanyBySymbol(gameState, parts[1])?.id ?? (parts[1] == 'ME' ? PLAYER1_ID : gameState.activeEntityNum);

    if (cmd)
        cmd(id, gameState);
}