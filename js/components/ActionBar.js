import { html } from '../lib/preact.standalone.module.js';
import DropdownMenu from './DropdownMenu.js';
import * as api from '../api.js';

/**
 * ActionBar - Persistent action bar with dropdown menus
 * Implements Option C: Separate actions (dropdowns) from information (tabs)
 */
export default function ActionBar() {
    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies);
    const chairedCompanyId = api.useGameStore(s => s.gameState.chairedCompanyId);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];

    // ETF detection
    const isActiveEntityETF = activeIndustryId === api.ETF_IND;
    const activeEntity = allCompanies.find(c => c.id === activeEntityNum);
    const etfAdvisorId = activeEntity?.advisorId || 0;
    const controlsETFAdvisor = isActiveEntityETF && (controlledCompanies || []).some(c => c.id === etfAdvisorId);
    const isActingAsETFAdvisor = isActiveEntityETF && controlsETFAdvisor && actingAsId === etfAdvisorId;

    // Industry checks
    const isActingAsBank = actingAsIndustryId === api.BANK_IND;
    const isActingAsInsurance = actingAsIndustryId === api.INSURANCE_IND;
    const isActingAsBroker = actingAsIndustryId === api.SECURITIES_BROKER_IND;

    // Helper for standard "must be acting as" checks
    const getActingAsDisabledMessage = () => {
        if (isActiveEntityETF) {
            if (!controlsETFAdvisor) return "You must control the ETF's investment advisor";
            if (!isActingAsETFAdvisor) return "Must be acting as the ETF's investment advisor";
            return false;
        }
        return !actingAs ? "Must be acting as this company" : false;
    };

    const mustActAsCompany = !actingAs ? "Must be acting as this company" : false;
    const mustActAsYourself = actingAsId !== api.HUMAN1_ID ? "Must be acting as yourself" : false;
    const cannotActAsSelf = actingAs ? "You cannot do this to yourself!" : false;

    // Check if player controls the active entity
    const playerControlsActive = api.isPlayerControlled(controlledCompanies, activeEntityNum);
    const playerIsCEO = api.isPlayerCEO(chairedCompanyId, activeEntityNum);

    // Can short stock check
    const canShortStock = isActingAsETFAdvisor
        ? "ETFs cannot short stocks"
        : actingAsId !== api.HUMAN1_ID
            ? "Only players can short stocks"
            : false;

    // Bond buying restrictions
    const buyBondDisabled = ![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
        ? "Only players, banks, and insurance companies can buy bonds"
        : false;

    // ==================== TRADE DROPDOWN (Multi-Column) ====================
    // Column 1: Stocks, Corporate Bonds, Government Bonds
    const tradeColumn1 = [
        { header: 'Stocks' },
        {
            label: `Buy Stock`,
            onClick: () => api.buyStock(actingAs ? 0 : activeEntityNum),
            color: 'green'
        },
        {
            label: 'Sell Stock',
            onClick: () => api.sellStock(0),
            color: 'red'
        },
        {
            label: 'Short Stock',
            onClick: () => api.shortStock(actingAs ? 0 : activeEntityNum),
            disabled: !!canShortStock,
            disabledMessage: canShortStock,
            color: 'red'
        },
        {
            label: 'Cover Short',
            onClick: () => api.coverShortStock(0),
            color: 'green'
        },
        { divider: true },
        { header: 'Corporate Bonds' },
        {
            label: 'Buy Corp Bond',
            onClick: () => api.buyCorporateBond(actingAs ? 0 : activeEntityNum),
            disabled: !!buyBondDisabled,
            disabledMessage: buyBondDisabled,
            color: 'green'
        },
        {
            label: 'Sell Corp Bond',
            onClick: () => api.sellCorporateBond(0),
            color: 'red'
        },
        { divider: true },
        { header: 'Government Bonds' },
        {
            label: 'Buy Long Govt Bonds',
            onClick: api.buyLongGovtBonds,
            color: 'green'
        },
        {
            label: 'Sell Long Govt Bonds',
            onClick: api.sellLongGovtBonds,
            color: 'red'
        },
        {
            label: 'Buy Short Govt Bonds',
            onClick: api.buyShortGovtBonds,
            color: 'green'
        },
        {
            label: 'Sell Short Govt Bonds',
            onClick: api.sellShortGovtBonds,
            color: 'red'
        },
    ];

    // Column 2: Options, Commodities, Crypto
    const tradeColumn2 = [
        { header: 'Options' },
        {
            label: 'Buy Calls',
            onClick: () => api.buyCalls(0),
            color: 'green'
        },
        {
            label: 'Sell Calls',
            onClick: () => api.sellCalls(0),
            color: 'red'
        },
        {
            label: 'Buy Puts',
            onClick: () => api.buyPuts(0),
            color: 'green'
        },
        {
            label: 'Sell Puts',
            onClick: () => api.sellPuts(0),
            color: 'red'
        },
        {
            label: 'Advanced Options...',
            onClick: api.advancedOptionsTrading,
            color: 'blue'
        },
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
        {
            label: playerIsCEO ? 'Resign as CEO' : 'Elect as CEO',
            onClick: playerIsCEO ? api.resignAsCeo : api.electCeo,
            disabled: !!mustActAsCompany || isActiveEntityETF || !playerControlsActive,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : (!playerControlsActive ? "Must control this company" : false)),
            color: playerIsCEO ? 'red' : 'green'
        },
        {
            label: 'Change Managers',
            onClick: api.changeManagers,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'red'
        },
        { divider: true },
        { header: 'Strategy' },
        {
            label: 'Set Dividend',
            onClick: api.setDividend,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        {
            label: 'Set Productivity',
            onClick: api.setProductivity,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'brown'
        },
        {
            label: 'Set Growth Rate',
            onClick: api.setGrowthRate,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'orange'
        },
        {
            label: 'Rebrand',
            onClick: api.rebrand,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'blue'
        },
        {
            label: 'Restructure',
            onClick: api.restructure,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'blue'
        },
        { divider: true },
        { header: 'Raise Capital' },
        {
            label: 'Public Stock Offering',
            onClick: api.publicStockOffering,
            disabled: !!getActingAsDisabledMessage(),
            disabledMessage: getActingAsDisabledMessage(),
            color: 'green'
        },
        {
            label: 'Private Stock Offering',
            onClick: api.privateStockOffering,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'brown'
        },
        {
            label: 'Issue Corp Bonds',
            onClick: api.issueNewCorpBonds,
            disabled: !!getActingAsDisabledMessage(),
            disabledMessage: getActingAsDisabledMessage(),
            color: 'brown'
        },
        { divider: true },
        { header: 'Return Capital' },
        {
            label: 'Redeem Corp Bonds',
            onClick: api.redeemCorpBonds,
            disabled: !!getActingAsDisabledMessage(),
            disabledMessage: getActingAsDisabledMessage(),
            color: 'brown'
        },
        {
            label: 'Extraordinary Dividend',
            onClick: api.extraordinaryDividend,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        {
            label: 'Split Stock',
            onClick: api.splitStock,
            disabled: !!getActingAsDisabledMessage(),
            disabledMessage: getActingAsDisabledMessage(),
            color: 'green'
        },
        {
            label: 'Reverse Split',
            onClick: api.reverseSplitStock,
            disabled: !!getActingAsDisabledMessage(),
            disabledMessage: getActingAsDisabledMessage(),
            color: 'red'
        },
    ];

    // Column 2: Assets, Liquidation, New Ventures, ETF/Advisory, Autopilot
    const corporateColumn2 = [
        { header: 'Assets' },
        {
            label: 'Buy Corporate Assets',
            onClick: api.buyCorporateAssets,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        {
            label: 'Sell Corporate Assets',
            onClick: api.sellCorporateAssets,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'red'
        },
        {
            label: 'Offer Assets For Sale',
            onClick: api.offerCorporateAssetsForSale,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'blue'
        },
        {
            label: 'Sell Subsidiary Stock',
            onClick: api.sellSubsidiaryStock,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'red'
        },
        {
            label: 'Browse For Sale Items',
            onClick: api.viewForSaleItems,
            color: 'green'
        },
        { divider: true },
        { header: 'Liquidation' },
        {
            label: 'Tax-Free Liquidation',
            onClick: api.taxFreeLiquidation,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        {
            label: 'Taxable Liquidation',
            onClick: api.taxableLiquidation,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        { divider: true },
        { header: 'New Ventures' },
        {
            label: 'Startup',
            onClick: api.startup,
            color: 'green'
        },
        {
            label: 'Capital Contribution',
            onClick: api.capitalContribution,
            disabled: !!cannotActAsSelf || isActiveEntityETF,
            disabledMessage: cannotActAsSelf || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        { divider: true },
        { header: 'ETF / Advisory' },
        {
            label: 'Set Advisory Fee',
            onClick: api.setAdvisoryFee,
            disabled: !!mustActAsCompany || !(isActingAsInsurance || isActingAsBroker),
            disabledMessage: mustActAsCompany || (!(isActingAsInsurance || isActingAsBroker) ? "Only for insurance/broker companies" : false),
            color: 'blue'
        },
        { divider: true },
        { header: 'Autopilot' },
        {
            label: 'Toggle Global Autopilot',
            onClick: api.toggleGlobalAutopilot,
            color: 'blue'
        },
    ];

    const corporateColumns = [corporateColumn1, corporateColumn2];

    // ==================== FINANCE DROPDOWN ====================
    const financeItems = [
        { header: 'Loans' },
        {
            label: 'Borrow Money',
            onClick: api.borrowMoney,
            disabled: !!mustActAsCompany,
            disabledMessage: mustActAsCompany,
            color: 'green'
        },
        {
            label: 'Repay Loan',
            onClick: api.repayLoan,
            disabled: !!mustActAsCompany,
            disabledMessage: mustActAsCompany,
            color: ''
        },
        {
            label: 'Change Bank',
            onClick: api.changeBank,
            disabled: !!mustActAsCompany,
            disabledMessage: mustActAsCompany,
            color: 'blue'
        },
        {
            label: 'Trade T-Bills',
            onClick: api.tradeTbills,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'brown'
        },
        { divider: true },
        { header: 'Advances' },
        {
            label: 'Advance Funds',
            onClick: api.advanceFunds,
            disabled: !!mustActAsYourself,
            disabledMessage: mustActAsYourself,
            color: 'green'
        },
        { divider: true },
        { header: 'Swaps' },
        {
            label: 'Interest Rate Swaps',
            onClick: api.interestRateSwaps,
            disabled: !!mustActAsCompany,
            disabledMessage: mustActAsCompany,
            color: 'blue'
        },
        { divider: true },
        { header: 'Taxes' },
        {
            label: 'Prepay Taxes',
            onClick: api.prepayTaxes,
            disabled: !!mustActAsYourself,
            disabledMessage: mustActAsYourself,
            color: 'green'
        },
    ];

    // Add bank-specific items if acting as a bank
    if (isActingAsBank) {
        financeItems.push(
            { divider: true },
            { header: 'Bank Operations' },
            {
                label: 'Set Bank Allocation',
                onClick: api.setBankAllocation,
                color: 'blue'
            },
            {
                label: 'List Bank Loans',
                onClick: api.listBankLoans,
                color: 'blue'
            },
            {
                label: 'Freeze All Loans',
                onClick: api.freezeAllLoans,
                color: 'red'
            },
            { divider: true },
            { header: 'Loan Portfolio' },
            {
                label: 'Buy Business Loans',
                onClick: api.buyBusinessLoans,
                color: 'green'
            },
            {
                label: 'Buy Consumer Loans',
                onClick: api.buyConsumerLoans,
                color: 'green'
            },
            {
                label: 'Sell Consumer Loans',
                onClick: api.sellConsumerLoans,
                color: 'red'
            },
            {
                label: 'Buy Prime Mortgages',
                onClick: api.buyPrimeMortgages,
                color: 'green'
            },
            {
                label: 'Sell Prime Mortgages',
                onClick: api.sellPrimeMortgages,
                color: 'red'
            },
            {
                label: 'Buy Subprime Mortgages',
                onClick: api.buySubprimeMortgages,
                color: 'green'
            },
            {
                label: 'Sell Subprime Mortgages',
                onClick: api.sellSubprimeMortgages,
                color: 'red'
            },
        );
    }

    // ==================== HOSTILE DROPDOWN ====================
    const hostileItems = [
        { header: 'Legal' },
        {
            label: 'Change Law Firm',
            onClick: api.changeLawFirm,
            color: 'blue'
        },
        {
            label: `Antitrust Lawsuit`,
            onClick: () => api.antitrustLawsuit(activeEntityNum),
            disabled: isActiveEntityETF || actingAsId === activeEntityNum || actingAsId === api.HUMAN1_ID || actingAsIndustryId !== activeIndustryId || playerControlsActive,
            disabledMessage: isActiveEntityETF ? "Not available for ETFs"
                : actingAsId === activeEntityNum ? "Cannot sue yourself"
                : actingAsId === api.HUMAN1_ID ? "Must act as a company"
                : actingAsIndustryId !== activeIndustryId ? "Must be in same industry"
                : playerControlsActive ? "Cannot sue controlled company"
                : false,
            color: 'red'
        },
        {
            label: `Harassing Lawsuit`,
            onClick: () => api.harrassingLawsuit(activeEntityNum),
            disabled: isActiveEntityETF || !actingAs || playerControlsActive,
            disabledMessage: isActiveEntityETF ? "Not available for ETFs"
                : !actingAs ? "Must be acting as a company"
                : playerControlsActive ? "Cannot sue controlled company"
                : false,
            color: 'red'
        },
        { divider: true },
        { header: 'Reputation' },
        {
            label: `Spread Rumors`,
            onClick: () => api.spreadRumors(activeEntityNum),
            disabled: isActiveEntityETF || !actingAs || playerControlsActive,
            disabledMessage: isActiveEntityETF ? "Not available for ETFs"
                : !actingAs ? "Must be acting as a company"
                : playerControlsActive ? "Cannot target controlled company"
                : false,
            color: 'red'
        },
        { divider: true },
        { header: 'Takeovers' },
        {
            label: 'Greenmail',
            onClick: api.greenmail,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        {
            label: 'Leveraged Buyout',
            onClick: api.lbo,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        {
            label: 'Merger',
            onClick: api.merger,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        { divider: true },
        { header: 'Accounting' },
        {
            label: 'Increase Earnings',
            onClick: api.increaseEarnings,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'green'
        },
        {
            label: 'Decrease Earnings',
            onClick: api.decreaseEarnings,
            disabled: !!mustActAsCompany || isActiveEntityETF,
            disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
            color: 'red'
        },
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
                items=${financeItems}
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
