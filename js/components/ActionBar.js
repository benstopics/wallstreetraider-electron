import { html } from '../lib/preact.standalone.module.js';
import DropdownMenu from './DropdownMenu.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import * as api from '../api.js';

/**
 * ActionBar - Persistent action bar with dropdown menus
 * Implements Option C: Separate actions (dropdowns) from information (tabs)
 *
 * Uses useActionButtonProps hook for centralized button definitions.
 */
export default function ActionBar() {
    const props = useActionButtonProps();

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

    // Column 2: Options, Commodities, Crypto
    const tradeColumn2 = [
        { header: 'Options' },
        props.buyCalls,
        props.sellCalls,
        props.buyPuts,
        props.sellPuts,
        { ...props.advancedOptions, label: 'Advanced Options...' },
        { divider: true },
        { header: 'Commodities' },
        {
            label: 'Commodities',
            submenu: [
                { label: 'Buy Futures', onClick: () => api.buyCommodityFutures(0), color: 'green' },
                { label: 'Sell Futures', onClick: () => api.sellCommodityFutures(0), color: 'red' },
                { label: 'Short Futures', onClick: () => api.shortCommodityFutures(0), color: 'red' },
                { label: 'Cover Futures', onClick: () => api.coverShortCommodityFutures(0), color: 'green' },
                { divider: true },
                { label: 'Buy Physical', onClick: () => api.buyPhysicalCommodity(0), color: 'green' },
                { label: 'Sell Physical', onClick: () => api.sellPhysicalCommodity(0), color: 'red' },
            ]
        },
        { divider: true },
        { header: 'Crypto' },
        {
            label: 'Crypto',
            submenu: [
                { label: 'Buy Crypto', onClick: () => api.buyPhysicalCrypto(0), color: 'green' },
                { label: 'Sell Crypto', onClick: () => api.sellPhysicalCrypto(0), color: 'red' },
                { label: 'Buy Crypto Futures', onClick: () => api.buyCryptoFutures(0), color: 'green' },
                { label: 'Sell Crypto Futures', onClick: () => api.sellCryptoFutures(0), color: 'red' },
            ]
        },
    ];

    const tradeColumns = [tradeColumn1, tradeColumn2];

    // ==================== CORPORATE DROPDOWN (Multi-Column) ====================
    // Column 1: Leadership, Strategy, Raise Capital, Return Capital
    const corporateColumn1 = [
        { header: 'Leadership' },
        props.electResignCeo,
        props.changeManagers,
        { divider: true },
        { header: 'Strategy' },
        props.setDividend,
        props.setProductivity,
        props.setGrowthRate,
        props.rebrand,
        props.restructure,
        { divider: true },
        { header: 'Raise Capital' },
        props.publicStockOffering,
        props.privateStockOffering,
        props.issueCorpBonds,
        { divider: true },
        { header: 'Return Capital' },
        props.redeemCorpBonds,
        props.extraordinaryDividend,
        props.splitStock,
        props.reverseSplit,
    ];

    // Column 2: Assets, Liquidation, New Ventures, ETF/Advisory, Autopilot
    const corporateColumn2 = [
        { header: 'Assets' },
        props.buyCorporateAssets,
        props.sellCorporateAssets,
        props.offerAssetsForSale,
        props.sellSubsidiaryStock,
        props.browseForSaleItems,
        { divider: true },
        { header: 'Liquidation' },
        props.taxFreeLiquidation,
        props.taxableLiquidation,
        { divider: true },
        { header: 'New Ventures' },
        props.startup,
        props.capitalContribution,
        { divider: true },
        { header: 'ETF / Advisory' },
        props.setAdvisoryFee,
        { divider: true },
        { header: 'Autopilot' },
        props.toggleGlobalAutopilot,
    ];

    const corporateColumns = [corporateColumn1, corporateColumn2];

    // ==================== FINANCE DROPDOWN (Multi-Column) ====================
    // Column 1: Loans, Advances, Swaps, Taxes
    const financeColumn1 = [
        { header: 'Loans' },
        props.borrowMoney,
        props.repayLoan,
        props.changeBank,
        props.tradeTbills,
        { divider: true },
        { header: 'Advances' },
        props.advanceFunds,
        { divider: true },
        { header: 'Swaps' },
        props.interestRateSwaps,
        { divider: true },
        { header: 'Taxes' },
        props.prepayTaxes,
    ];

    // Column 2: Bank Operations (only shown when acting as bank)
    const financeColumn2 = props.isActingAsBank ? [
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
    ] : [];

    const financeColumns = props.isActingAsBank ? [financeColumn1, financeColumn2] : [financeColumn1];

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
        props.merger,
        { divider: true },
        { header: 'Accounting' },
        props.increaseEarnings,
        props.decreaseEarnings,
    ];

    return html`
        <div class="action-bar">
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
            <${DropdownMenu}
                label="Hostile"
                icon="⚔️"
                items=${hostileItems}
                color="red"
            />
        </div>
    `;
}
