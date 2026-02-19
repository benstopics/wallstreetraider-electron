import { html } from '../lib/preact.standalone.module.js';
import DropdownMenu from './DropdownMenu.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import { useShiftHeld } from '../hooks/useHotkey.js';
import * as api from '../api.js';

/**
 * ActionBar - Persistent action bar with dropdown menus
 * Implements Option C: Separate actions (dropdowns) from information (tabs)
 *
 * Uses useActionButtonProps hook for centralized button definitions.
 */
export default function ActionBar() {
    const props = useActionButtonProps();

    const shiftHeld = useShiftHeld();

    // ==================== TRADE DROPDOWN (Multi-Column) ====================
    // Column 1: Stocks, Corporate Bonds, Government Bonds
    const tradeColumn1 = [
        { header: 'Stocks' },
        props.buyStock,
        props.sellStock,
        props.shortStock,
        props.coverShort,
        { divider: true },
        { header: 'Corporate Bonds' },
        props.buyCorpBond,
        props.sellCorpBond,
        { divider: true },
        { header: 'Government Bonds' },
        props.buyLongGovtBonds,
        props.sellLongGovtBonds,
        props.buyShortGovtBonds,
        props.sellShortGovtBonds,
    ];

    // Column 2: Commodities, Crypto — redirect to Commodities tab
    // Note: Generic commodity/crypto buttons (passing id=0) caused either wrong trades
    // (defaulting to Stock Index) or hard freezes (Win32 Form18/Form23 dialogs invisible
    // in Electron). The Commodities tab has proper per-commodity buttons.
    const tradeColumn2 = [
        { header: 'Commodities' },
        { label: 'Buy Futures', onClick: () => api.buyCommodityFutures(api.STOCK_INDEX_ID), color: 'green' },
        { label: 'Sell Futures', onClick: () => api.sellCommodityFutures(api.STOCK_INDEX_ID), color: 'red' },
        { label: 'Short Futures', onClick: () => api.shortCommodityFutures(api.STOCK_INDEX_ID), color: 'red' },
        { label: 'Cover Futures', onClick: () => api.coverShortCommodityFutures(api.STOCK_INDEX_ID), color: 'green' },
        { divider: true },
        { label: 'Buy Physical', disabled: true, disabledMessage: 'Use the Commodities tab for physical commodity trading', color: 'green' },
        { label: 'Sell Physical', disabled: true, disabledMessage: 'Use the Commodities tab for physical commodity trading', color: 'red' },
        { divider: true },
        { header: 'Crypto' },
        { label: 'Buy Crypto', disabled: true, disabledMessage: 'Use the Commodities tab for crypto trading', color: 'green' },
        { label: 'Sell Crypto', disabled: true, disabledMessage: 'Use the Commodities tab for crypto trading', color: 'red' },
        { label: 'Buy Crypto Futures', disabled: true, disabledMessage: 'Use the Commodities tab for crypto futures trading', color: 'green' },
        { label: 'Sell Crypto Futures', disabled: true, disabledMessage: 'Use the Commodities tab for crypto futures trading', color: 'red' },
    ];

    // Column 3: Options
    const tradeColumn3 = [
        { header: 'Options' },
        props.buyCalls,
        props.sellCalls,
        props.buyPuts,
        props.sellPuts,
        { ...props.advancedOptions, label: 'Advanced Options...' },
        { divider: true },
        { header: 'Alerts' },
        { label: 'Price Alerts...', onClick: () => window.__showPriceAlerts?.(), color: 'blue', 'data-testid': 'btn-price-alerts' },
    ];

    const tradeColumns = [tradeColumn1, tradeColumn2, tradeColumn3];

    // ==================== CORPORATE DROPDOWN (Multi-Column) ====================
    // Column 1: Leadership, Strategy
    const corporateColumn1 = [
        { header: 'Leadership' },
        props.electResignCeo,
        props.changeManagers,
        { divider: true },
        { header: 'Strategy' },
        props.setProductivity,
        props.setGrowthRate,
        props.growthThrottle,
        props.rebrand,
        props.restructure,
    ];

    // Column 2: M&A, Assets, ETF/Advisory, Autopilot
    const corporateColumn2 = [
        { header: 'M&A' },
        props.merger,
        props.startup,
        props.capitalContribution,
        { divider: true },
        { header: 'Assets' },
        props.buyCorporateAssets,
        props.sellCorporateAssets,
        props.offerAssetsForSale,
        props.sellSubsidiaryStock,
        props.browseForSaleItems,
        { divider: true },
        { header: 'ETF / Advisory' },
        props.becomeEtfAdvisor,
        props.setAdvisoryFee,
        { divider: true },
        { header: 'Autopilot' },
        props.toggleGlobalAutopilot,
    ];

    const corporateColumns = [corporateColumn1, corporateColumn2];

    // ==================== FINANCE DROPDOWN (Multi-Column) ====================
    // Column 1: Equity, Debt
    const financeColumn1 = [
        { header: 'Equity' },
        props.publicStockOffering,
        props.privateStockOffering,
        props.splitStock,
        props.reverseSplit,
        { divider: true },
        { header: 'Debt' },
        props.issueCorpBonds,
        props.redeemCorpBonds,
        props.borrowMoney,
        props.repayLoan,
        props.tradeTbills,
    ];

    // Column 2: Returns, Banking, Swaps, Taxes, Accounting
    const financeColumn2 = [
        { header: 'Returns' },
        props.setDividend,
        props.extraordinaryDividend,
        props.taxFreeLiquidation,
        props.taxableLiquidation,
        { divider: true },
        { header: 'Banking' },
        props.changeBank,
        props.creditInfo,
        props.advanceFunds,
        { divider: true },
        { header: 'Swaps' },
        props.interestRateSwaps,
        { divider: true },
        { header: 'Taxes' },
        props.prepayTaxes,
        { header: 'Accounting' },
        props.increaseEarnings,
        props.decreaseEarnings,
    ];

    const financeColumns = [financeColumn1, financeColumn2];

    // ==================== BANKING DROPDOWN (only when acting as bank) ====================
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

    // ==================== HOSTILE DROPDOWN ====================
    const hostileItems = [
        { header: 'Legal' },
        props.changeLawFirm,
        props.antitrustLawsuit,
        props.harassingLawsuit,
        { divider: true },
        { header: 'Reputation' },
        props.spreadRumors,
        { divider: true },
        { header: 'Takeovers' },
        props.greenmail,
        props.leveragedBuyout,
        { divider: true },
    ];

    return html`
        <div class="action-bar">
            <${DropdownMenu}
                label="Trade"
                hotkeyChar="t"
                icon="📈"
                columns=${tradeColumns}
                color="green"
                shiftHeld=${shiftHeld}
            />
            <${DropdownMenu}
                label="Corporate"
                hotkeyChar="c"
                icon="🏢"
                columns=${corporateColumns}
                color="blue"
                shiftHeld=${shiftHeld}
            />
            <${DropdownMenu}
                label="Finance"
                hotkeyChar="f"
                icon="💰"
                columns=${financeColumns}
                color="brown"
                shiftHeld=${shiftHeld}
            />
            <${DropdownMenu}
                label="Hostile"
                hotkeyChar="h"
                icon="⚔️"
                items=${hostileItems}
                color="red"
                shiftHeld=${shiftHeld}
            />
            ${props.isActingAsBank ? html`<${DropdownMenu}
                label="Banking"
                hotkeyChar="b"
                icon="🏦"
                items=${bankingItems}
                color="blue"
                shiftHeld=${shiftHeld}
            />` : ''}
        </div>
    `;
}
