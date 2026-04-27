import { html } from '../lib/preact.standalone.module.js';
import DropdownMenu from './DropdownMenu.js';
import CommandPrompt from './CommandPrompt.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import * as api from '../api.js';

/**
 * ActionBar — five dropdowns of game actions driven by the viewed entity.
 *
 * Semantic model:
 *   - intParam2 = activeEntityNum (always, for ActionBar). Every endpoint call
 *       threads the viewed entity as acting-as. The PB dispatcher swaps
 *       PlayCo via SwapActingAs for the duration of the event.
 *   - Target-requiring actions (Buy Stock, Merger, Antitrust, etc.) post the
 *       event with intParam1 = 0 (company target) or -1 (commodity target).
 *       PB opens SelectCompanyModal$ / SelectCommodityModal$ which BLOCKS
 *       PB until the user picks. This avoids the bug-01 race where game ticks
 *       could interleave with picker input and corrupt PlayCo (see
 *       docs/bugs/bug-01-corpinfoitems-error-zero.md).
 *   - Self-actions (Set Dividend, Rebrand, etc.) call api.* fn(activeEntityNum)
 *       with intParam1 = 0.
 *
 * Industry-inapplicable buttons are HIDDEN (conditional spreads) rather than
 * greyed out. Position-closing buttons (Sell Stock, Cover Short, etc.) are
 * absent here — they live per-row in Portfolio / Options / Commodities tabs.
 * Naked option writes (Sell Calls, Sell Puts) stay because they open positions.
 */
export default function ActionBar({ entityLabel }) {
    const props = useActionButtonProps();

    const {
        actingAsId,
        activeEntityNum,
        controlsActiveEntity,
        isActiveEntityETF,
        isActingAsBank,
        isActingAsETFAdvisor,
    } = props;

    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);

    // ==================== Visibility Flags ====================
    const notActingAsCompany = !actingAsId || actingAsId <= 10;
    const viewingHuman = activeEntityNum === api.HUMAN1_ID;
    const canTradeGovtBonds = [api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId);
    const canTradeOptions = !isActingAsBank
        && actingAsIndustryId !== api.INSURANCE_IND
        && !isActiveEntityETF;
    const canTradeCommodities = !isActingAsBank
        && actingAsIndustryId !== api.INSURANCE_IND;
    const canActOnSelf = !isActiveEntityETF && controlsActiveEntity && !viewingHuman;
    const hostileVisible = !viewingHuman && !isActiveEntityETF && !notActingAsCompany;
    const bankingVisible = isActingAsBank;
    // Actions that PB rejects for a human player (PlayCo < 11). Merger, ETF
    // advisory role, public stock offering, and corporate bond issue/redeem
    // are all guarded corporation-only on the engine side.
    const corporateOnly = !viewingHuman;

    // ==================== Helpers ====================
    // All target-prompting actions post intParam1 = 0 (company) or -1 (commodity).
    // PB drives the picker via SelectCompanyModal$ / SelectCommodityModal$ which
    // routes through the global %MODAL_COMPANY_SELECT / %MODAL_COMMODITY_SELECT
    // modalType framework rendered in app.js. PB blocks during the picker, so
    // game ticks cannot race with user input.

    // ==================== TRADE DROPDOWN (Multi-Column) ====================
    // All target-prompting buttons here post intParam1 = 0 (company target) or
    // -1 (commodity target) — PB drives the picker. Hook button onClicks
    // already do this for buyStock / shortStock / buyCorpBond.
    const tradeColumn1 = [
        { header: 'Stocks' },
        props.buyStock,
        // Short Stock is player-only — ShortMargAcct# is dimmed (1 TO 5) in PB,
        // so corporate shorts have no margin account and Error 9 fires.
        ...(viewingHuman && !isActingAsETFAdvisor ? [props.shortStock] : []),
        { divider: true },
        { header: 'Corporate Bonds' },
        props.buyCorpBond,
        ...(canTradeGovtBonds ? [
            { divider: true },
            { header: 'Government Bonds' },
            props.buyLongGovtBonds,
            props.buyShortGovtBonds,
        ] : []),
    ];

    // Col 2: Commodities (opening positions only). Each posts intParam1 = -1
    // so PB CASE 140/160/180/200/220 opens SelectCommodityModal$.
    const tradeColumn2 = canTradeCommodities ? [
        { header: 'Commodities' },
        { label: 'Buy Futures',   color: 'green', onClick: () => api.buyCommodityFutures(-1, activeEntityNum) },
        { label: 'Short Futures', color: 'red',   onClick: () => api.shortCommodityFutures(-1, activeEntityNum) },
        { label: 'Buy Physical',  color: 'green', onClick: () => api.buyPhysicalCommodity(-1, activeEntityNum) },
        { divider: true },
        { header: 'Crypto' },
        { label: 'Buy Crypto',         color: 'green', onClick: () => api.buyPhysicalCrypto(-1, activeEntityNum) },
        { label: 'Buy Crypto Futures', color: 'green', onClick: () => api.buyCryptoFutures(-1, activeEntityNum) },
    ] : [];

    // Col 3: Options (naked writes kept). PB drives SelectCompanyModal$ for
    // the underlying when IntParam1=0.
    const tradeColumn3 = canTradeOptions ? [
        { header: 'Options' },
        props.buyCalls,
        props.sellCalls,
        props.buyPuts,
        props.sellPuts,
        { divider: true },
        {
            ...props.advancedOptions,
            label: 'Advanced Options...',
            onClick: () => api.advancedOptionsTrading(activeEntityNum),
        },
    ] : [];

    const tradeColumns = [tradeColumn1, tradeColumn2, tradeColumn3].filter(c => c.length > 0);

    // ==================== CORPORATE DROPDOWN ====================
    const corporateColumn1 = canActOnSelf ? [
        { header: 'Leadership' },
        props.electResignCeo,
        props.changeManagers,
        { divider: true },
        { header: 'Strategy' },
        props.setProductivity,
        props.setGrowthRate,
        props.rebrand,
        props.restructure,
    ] : [];

    const corporateColumn2 = [
        { header: 'M&A' },
        ...(corporateOnly ? [{
            label: 'Merger', color: 'green',
            onClick: () => api.merger(0, activeEntityNum),
        }] : []),
        props.startup,
        props.capitalContribution,
        ...(canActOnSelf ? [
            { divider: true },
            { header: 'Assets' },
            props.buyCorporateAssets,
            props.sellCorporateAssets,
            props.sellSubsidiaryStock,
            props.browseForSaleItems,
        ] : [props.browseForSaleItems]),
        ...(corporateOnly ? [
            { divider: true },
            { header: 'ETF / Advisory' },
            props.becomeEtfAdvisor,
            props.setAdvisoryFee,
        ] : []),
        { divider: true },
        { header: 'Autopilot' },
        props.toggleGlobalAutopilot,
    ];

    const corporateColumns = [corporateColumn1, corporateColumn2].filter(c => c.length > 0);

    // ==================== FINANCE DROPDOWN ====================
    const financeColumn1 = [
        ...(corporateOnly ? [
            { header: 'Equity' },
            props.publicStockOffering,
            ...(canActOnSelf ? [
                props.privateStockOffering,
                props.splitStock,
                props.reverseSplit,
            ] : []),
            { divider: true },
        ] : []),
        { header: 'Debt' },
        ...(corporateOnly ? [
            props.issueCorpBonds,
            props.redeemCorpBonds,
        ] : []),
        props.borrowMoney,
        props.repayLoan,
        ...(!isActiveEntityETF ? [props.tradeTbills] : []),
    ];

    const financeColumn2 = [
        ...(canActOnSelf ? [
            { header: 'Returns' },
            props.setDividend,
            props.extraordinaryDividend,
            props.taxFreeLiquidation,
            props.taxableLiquidation,
            { divider: true },
        ] : []),
        { header: 'Banking' },
        props.changeBank,
        props.advanceFunds,
        { divider: true },
        { header: 'Swaps' },
        props.interestRateSwaps,
        { divider: true },
        { header: 'Taxes' },
        props.prepayTaxes,
        ...(canActOnSelf ? [
            { header: 'Accounting' },
            props.increaseEarnings,
            props.decreaseEarnings,
        ] : []),
    ];

    const financeColumns = [financeColumn1, financeColumn2].filter(c => c.length > 0);

    // ==================== HOSTILE DROPDOWN ====================
    // Each hostile target-prompting button posts intParam1 = 0 — PB CASE 940
    // (antitrust), 950 (harass), 960 (rumors), 540 (greenmail), 550 (LBO)
    // open SelectCompanyModal$ when no target was supplied.
    const hostileItems = [
        { header: 'Legal' },
        props.changeLawFirm,
        { label: 'Antitrust Lawsuit', color: 'red', onClick: () => api.antitrustLawsuit(0, activeEntityNum) },
        { label: 'Harassing Lawsuit', color: 'red', onClick: () => api.harrassingLawsuit(0, activeEntityNum) },
        { divider: true },
        { header: 'Reputation' },
        { label: 'Spread Rumors', color: 'red', onClick: () => api.spreadRumors(0, activeEntityNum) },
        { divider: true },
        { header: 'Takeovers' },
        { label: 'Greenmail', color: 'red', onClick: () => api.greenmail(0, activeEntityNum) },
        { label: 'Leveraged Buyout', color: 'red', onClick: () => api.lbo(0, activeEntityNum) },
    ];

    // ==================== BANKING DROPDOWN ====================
    const bankingItems = [
        { header: 'Bank Operations' },
        props.setBankAllocation,
        props.listBankLoans,
        props.freezeAllLoans,
        { divider: true },
        { header: 'Loan Portfolio' },
        props.buyBusinessLoans,
        props.buyConsumerLoans,
        props.sellConsumerLoans,
        props.buyPrimeMortgages,
        props.sellPrimeMortgages,
        props.buySubprimeMortgages,
        props.sellSubprimeMortgages,
    ];

    // ==================== TOP-LEVEL GATE ====================
    // ActionBar is visible only when the user is viewing HUMAN1 (personal
    // trading) or viewing a company they control AND are acting as (so
    // Type 3 no-arg routes naturally hit the right PlayCo&).
    const actionBarVisible = viewingHuman
        || (!notActingAsCompany && controlsActiveEntity);

    return html`
        <div class="action-bar" style="align-items: center;">
            ${entityLabel ? html`<span style="font-weight: bold; font-size: var(--font-size-sm); white-space: nowrap; opacity: 0.7;">${entityLabel}</span>` : ''}
            ${actionBarVisible ? html`
                <${DropdownMenu}
                    label="Trade"
                    icon="📈"
                    columns=${tradeColumns}
                    color="green"
                />
                <${DropdownMenu}
                    label="Corporate"
                    icon="🏢"
                    columns=${corporateColumns}
                    color="blue"
                />
                <${DropdownMenu}
                    label="Finance"
                    icon="💰"
                    columns=${financeColumns}
                    color="brown"
                />
                ${hostileVisible ? html`
                    <${DropdownMenu}
                        label="Hostile"
                        icon="⚔️"
                        items=${hostileItems}
                        color="red"
                    />
                ` : ''}
                ${bankingVisible ? html`
                    <${DropdownMenu}
                        label="Banking"
                        icon="🏦"
                        items=${bankingItems}
                        color="blue"
                    />
                ` : ''}
            ` : ''}
            <div style="flex:1"><${CommandPrompt} /></div>
        </div>
    `;
}
