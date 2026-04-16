import * as api from '../api.js';

/**
 * Centralized hook for action button props.
 * Provides consistent button definitions (label, onClick, disabled logic, colors)
 * that can be used across ActionBar, IndustrialView, PlayerView, and other components.
 *
 * Usage:
 *   const { buyStock, shortStock, buyCalls } = useActionButtonProps();
 *   <${DisabledTooltipButton} ...${buyStock} />
 *
 * Acting-as is handled by the PB-side override (ui.inc) which prompts the user to
 * select a controlled company when an action is triggered. Buttons are therefore
 * never disabled solely because of wrong acting-as state.
 */
export function useActionButtonProps() {
    // ==================== Game State ====================
    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const actingAsSymbol = api.useGameStore(s => s.gameState.actingAsSymbol);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies);
    const chairedCompanyId = api.useGameStore(s => s.gameState.chairedCompanyId);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];
    const playerName = api.useGameStore(s => s.gameState.playerName) || 'Player';

    // ==================== ETF Detection ====================
    const isActiveEntityETF = activeIndustryId === api.ETF_IND;
    const activeEntity = allCompanies.find(c => c.id === activeEntityNum);
    const etfAdvisorId = activeEntity?.advisorId || 0;
    const etfAdvisor = allCompanies.find(c => c.id === etfAdvisorId);
    const etfAdvisorSymbol = etfAdvisor?.symbol || etfAdvisor?.name || 'Advisor';
    const controlsETFAdvisor = isActiveEntityETF && (controlledCompanies || []).some(c => c.id === etfAdvisorId);
    const isActingAsETFAdvisor = isActiveEntityETF && controlsETFAdvisor && actingAsId === etfAdvisorId;

    // ==================== Control Checks ====================
    const controlsActiveEntity = (controlledCompanies || []).some(c => c.id === activeEntityNum);
    const playerControlsActive = api.isPlayerControlled(controlledCompanies, activeEntityNum);
    const playerIsCEO = api.isPlayerCEO(chairedCompanyId, activeEntityNum);

    // ==================== Industry Checks ====================
    const isActingAsBank = actingAsIndustryId === api.BANK_IND;
    const isActingAsInsurance = actingAsIndustryId === api.INSURANCE_IND;
    const isActingAsBroker = actingAsIndustryId === api.SECURITIES_BROKER_IND;

    // ==================== TRADING BUTTONS ====================

    const buyStock = {
        label: 'Buy Stock',
        onClick: () => api.buyStock(actingAs ? 0 : activeEntityNum, actingAsId),
        color: 'green',
        dataTutorial: 'buy-stock'
    };

    const sellStock = {
        label: 'Sell Stock',
        onClick: () => api.sellStock(0, actingAsId),
        color: 'red'
    };

    const shortStock = {
        label: 'Short Stock',
        onClick: () => api.shortStock(actingAs ? 0 : activeEntityNum, actingAsId),
        disabled: isActingAsETFAdvisor,
        disabledMessage: isActingAsETFAdvisor ? "ETFs cannot short stocks" : false,
        color: 'red'
    };

    const coverShort = {
        label: 'Cover Short',
        onClick: () => api.coverShortStock(0, actingAsId),
        color: 'green'
    };

    const buyCorpBond = {
        label: 'Buy Corp Bond',
        onClick: () => api.buyCorporateBond(actingAs ? 0 : activeEntityNum, actingAsId),
        color: 'green'
    };

    const sellCorpBond = {
        label: 'Sell Corp Bond',
        onClick: () => api.sellCorporateBond(0, actingAsId),
        color: 'red'
    };

    // Government bonds: restricted to players, banks, and insurance companies
    const govtBondDisabled = ![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
        ? "Only players, banks, and insurance companies can trade government bonds."
        : false;

    const buyLongGovtBonds = {
        label: 'Buy Long Govt Bonds',
        onClick: () => api.buyLongGovtBonds(actingAsId),
        disabled: !!govtBondDisabled,
        disabledMessage: govtBondDisabled,
        color: 'green'
    };

    const sellLongGovtBonds = {
        label: 'Sell Long Govt Bonds',
        onClick: () => api.sellLongGovtBonds(actingAsId),
        disabled: !!govtBondDisabled,
        disabledMessage: govtBondDisabled,
        color: 'red'
    };

    const buyShortGovtBonds = {
        label: 'Buy Short Govt Bonds',
        onClick: () => api.buyShortGovtBonds(actingAsId),
        disabled: !!govtBondDisabled,
        disabledMessage: govtBondDisabled,
        color: 'green'
    };

    const sellShortGovtBonds = {
        label: 'Sell Short Govt Bonds',
        onClick: () => api.sellShortGovtBonds(actingAsId),
        disabled: !!govtBondDisabled,
        disabledMessage: govtBondDisabled,
        color: 'red'
    };

    // ==================== OPTIONS BUTTONS ====================

    const buyCalls = {
        label: 'Buy Calls',
        onClick: () => api.buyCalls(0, actingAsId),
        color: 'green'
    };

    const sellCalls = {
        label: 'Sell Calls',
        onClick: () => api.sellCalls(0, actingAsId),
        color: 'red'
    };

    const buyPuts = {
        label: 'Buy Puts',
        onClick: () => api.buyPuts(0, actingAsId),
        color: 'green'
    };

    const sellPuts = {
        label: 'Sell Puts',
        onClick: () => api.sellPuts(0, actingAsId),
        color: 'red'
    };

    const advancedOptions = {
        label: 'Advanced Options',
        onClick: api.advancedOptionsTrading,
        disabled: isActiveEntityETF || isActingAsBank || isActingAsInsurance,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : (isActingAsBank || isActingAsInsurance) ? "Not available for banks/insurers"
            : false,
        color: 'green'
    };

    // ==================== FINANCE BUTTONS ====================

    const borrowMoney = {
        label: 'Borrow Money',
        onClick: api.borrowMoney,
        color: 'green'
    };

    const repayLoan = {
        label: 'Repay Loan',
        onClick: api.repayLoan,
        color: ''
    };

    const changeBank = {
        label: 'Change Bank',
        onClick: api.changeBank,
        color: 'blue'
    };

    const tradeTbills = {
        label: 'Trade T-Bills',
        onClick: api.tradeTbills,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'brown'
    };

    const advanceFunds = {
        label: 'Advance Funds',
        onClick: api.advanceFunds,
        color: 'green'
    };

    const interestRateSwaps = {
        label: 'Interest Rate Swaps',
        onClick: api.interestRateSwaps,
        color: 'blue'
    };

    const prepayTaxes = {
        label: 'Prepay Taxes',
        onClick: api.prepayTaxes,
        color: 'green'
    };

    // ==================== CORPORATE BUTTONS ====================

    const electResignCeo = {
        label: playerIsCEO ? 'Resign as CEO' : 'Elect as CEO',
        onClick: playerIsCEO ? api.resignAsCeo : api.electCeo,
        disabled: isActiveEntityETF || !playerControlsActive,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : (!playerControlsActive ? "Must control this company" : false),
        color: playerIsCEO ? 'red' : 'green'
    };

    const changeManagers = {
        label: 'Fire Management',
        onClick: api.changeManagers,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'red'
    };

    const setDividend = {
        label: 'Set Dividend',
        onClick: api.setDividend,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'green'
    };

    const setProductivity = {
        label: 'Set Productivity',
        onClick: api.setProductivity,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'brown'
    };

    const setGrowthRate = {
        label: 'Set Growth Rate',
        onClick: api.setGrowthRate,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'orange'
    };

    const growthThrottle = {
        label: 'Growth Throttle',
        onClick: api.growthThrottle,
        color: 'orange'
    };

    const rebrand = {
        label: 'Rebrand',
        onClick: api.rebrand,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'blue'
    };

    const restructure = {
        label: 'Restructure',
        onClick: api.restructure,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'blue'
    };

    const publicStockOffering = {
        label: 'Public Stock Offering',
        onClick: api.publicStockOffering,
        color: 'green'
    };

    const privateStockOffering = {
        label: 'Private Stock Offering',
        onClick: api.privateStockOffering,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'brown'
    };

    const issueCorpBonds = {
        label: 'Issue Corp Bonds',
        onClick: api.issueNewCorpBonds,
        color: 'brown'
    };

    const redeemCorpBonds = {
        label: 'Redeem Corp Bonds',
        onClick: api.redeemCorpBonds,
        color: 'brown'
    };

    const extraordinaryDividend = {
        label: 'Extraordinary Dividend',
        onClick: api.extraordinaryDividend,
        color: 'green'
    };

    const splitStock = {
        label: 'Split Stock',
        onClick: api.splitStock,
        color: 'green'
    };

    const reverseSplit = {
        label: 'Reverse Split',
        onClick: api.reverseSplitStock,
        color: 'red'
    };

    const buyCorporateAssets = {
        label: 'Buy Corporate Assets',
        onClick: api.buyCorporateAssets,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'green'
    };

    const sellCorporateAssets = {
        label: 'Sell Corporate Assets',
        onClick: api.sellCorporateAssets,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'red'
    };

    const sellSubsidiaryStock = {
        label: 'Offer to Sell Subsidiary Stock',
        onClick: api.sellSubsidiaryStock,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'red'
    };

    const spinOff = {
        label: 'Spin-Off',
        onClick: (id) => api.spinOff(id),
        color: 'blue'
    };

    const browseForSaleItems = {
        label: 'Browse For Sale Items',
        onClick: api.viewForSaleItems,
        color: 'green'
    };

    const taxFreeLiquidation = {
        label: 'Tax-Free Liquidation',
        onClick: api.taxFreeLiquidation,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'green'
    };

    const taxableLiquidation = {
        label: 'Taxable Liquidation',
        onClick: api.taxableLiquidation,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'green'
    };

    const startup = {
        label: 'Startup',
        onClick: api.startup,
        color: 'green'
    };

    const capitalContribution = {
        label: 'Capital Contribution',
        onClick: api.capitalContribution,
        disabled: isActiveEntityETF && isActingAsETFAdvisor,
        disabledMessage: isActiveEntityETF && isActingAsETFAdvisor ? "Not available for ETFs" : false,
        color: 'green'
    };

    const becomeEtfAdvisor = {
        label: 'Become ETF Advisor',
        onClick: api.becomeEtfAdvisor,
        disabled: !(isActingAsInsurance || isActingAsBroker),
        disabledMessage: !(isActingAsInsurance || isActingAsBroker) ? "Only for insurance/broker companies" : false,
        color: 'green'
    };

    const setAdvisoryFee = {
        label: 'Set Advisory Fee',
        onClick: api.setAdvisoryFee,
        disabled: !(isActingAsInsurance || isActingAsBroker),
        disabledMessage: !(isActingAsInsurance || isActingAsBroker) ? "Only for insurance/broker companies" : false,
        color: 'blue'
    };

    const toggleGlobalAutopilot = {
        label: 'Toggle Global Autopilot',
        onClick: api.toggleGlobalAutopilot,
        color: 'blue'
    };

    // ==================== BANK OPERATIONS ====================

    const setBankAllocation = {
        label: 'Set Allocation',
        onClick: api.setBankAllocation,
        color: 'brown'
    };

    const listBankLoans = {
        label: 'List Bank Loans',
        onClick: api.listBankLoans,
        color: 'blue'
    };

    const freezeAllLoans = {
        label: 'Freeze All Loans',
        onClick: api.freezeAllLoans,
        color: 'blue'
    };

    const buyBusinessLoans = {
        label: 'Buy Business Loans',
        onClick: api.buyBusinessLoans,
        color: 'green'
    };

    const sellBusinessLoans = {
        label: 'Sell Business Loans',
        onClick: api.sellBusinessLoan,
        color: 'red'
    };

    const buyConsumerLoans = {
        label: 'Buy Consumer Loans',
        onClick: api.buyConsumerLoans,
        color: 'green'
    };

    const sellConsumerLoans = {
        label: 'Sell Consumer Loans',
        onClick: api.sellConsumerLoans,
        color: 'red'
    };

    const buyPrimeMortgages = {
        label: 'Buy Prime Mortgages',
        onClick: api.buyPrimeMortgages,
        color: 'green'
    };

    const sellPrimeMortgages = {
        label: 'Sell Prime Mortgages',
        onClick: api.sellPrimeMortgages,
        color: 'red'
    };

    const buySubprimeMortgages = {
        label: 'Buy Subprime Mortgages',
        onClick: api.buySubprimeMortgages,
        color: 'green'
    };

    const sellSubprimeMortgages = {
        label: 'Sell Subprime Mortgages',
        onClick: api.sellSubprimeMortgages,
        color: 'red'
    };

    // ==================== HOSTILE ACTIONS ====================

    const changeLawFirm = {
        label: 'Change Law Firm',
        onClick: api.changeLawFirm,
        color: 'blue'
    };

    const antitrustLawsuit = {
        label: `Antitrust Lawsuit${actingAsSymbol && activeEntitySymbol ? ` ${actingAsSymbol} vs ${activeEntitySymbol}` : ''}`,
        onClick: () => api.antitrustLawsuit(activeEntityNum),
        disabled: isActiveEntityETF || actingAsId === activeEntityNum || actingAsId === api.HUMAN1_ID || actingAsIndustryId !== activeIndustryId || playerControlsActive,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : actingAsId === activeEntityNum ? "Cannot sue yourself"
            : actingAsId === api.HUMAN1_ID ? "Must act as a company"
            : actingAsIndustryId !== activeIndustryId ? "Must be in same industry"
            : playerControlsActive ? "Cannot sue controlled company"
            : false,
        color: 'red'
    };

    const harassingLawsuit = {
        label: `Harassing Lawsuit${actingAsSymbol && activeEntitySymbol ? ` ${actingAsSymbol} vs ${activeEntitySymbol}` : ''}`,
        onClick: () => api.harrassingLawsuit(activeEntityNum),
        disabled: isActiveEntityETF || !actingAs || actingAsId === activeEntityNum || playerControlsActive,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : !actingAs ? "Must be acting as a company"
            : actingAsId === activeEntityNum ? "Cannot sue yourself"
            : playerControlsActive ? "Cannot sue controlled company"
            : false,
        color: 'red'
    };

    const spreadRumors = {
        label: `Spread Rumors about${activeEntitySymbol ? ` ${activeEntitySymbol}` : ''}`,
        onClick: () => api.spreadRumors(activeEntityNum),
        disabled: isActiveEntityETF || !actingAs || actingAsId === activeEntityNum || playerControlsActive,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : !actingAs ? "Must be acting as a company"
            : actingAsId === activeEntityNum ? "Cannot target yourself"
            : playerControlsActive ? "Cannot target controlled company"
            : false,
        color: 'red'
    };

    const greenmail = {
        label: 'Greenmail',
        onClick: () => api.greenmail(),
        disabled: isActiveEntityETF || actingAsId === activeEntityNum,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : actingAsId === activeEntityNum ? "Cannot do Greenmail against yourself"
            : false,
        color: 'green'
    };

    const leveragedBuyout = {
        label: 'Leveraged Buyout',
        onClick: () => api.lbo(),
        disabled: isActiveEntityETF || actingAsId === activeEntityNum,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : actingAsId === activeEntityNum ? "Cannot do an LBO against yourself"
            : false,
        color: 'green'
    };

    const mergerIsSelf = actingAsId === activeEntityNum;
    const merger = {
        label: `Merger with${activeEntitySymbol ? ` ${activeEntitySymbol}` : ''}`,
        onClick: () => api.merger(),
        disabled: isActiveEntityETF || mergerIsSelf,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : mergerIsSelf ? "Cannot merge with yourself"
            : false,
        color: 'green'
    };

    const creditInfo = {
        label: 'Credit Info',
        onClick: api.creditInfo,
        color: 'blue'
    };

    const increaseEarnings = {
        label: 'Increase Earnings',
        onClick: api.increaseEarnings,
        disabled: isActiveEntityETF || isActingAsBank,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : isActingAsBank ? "Banks cannot draw from bad debt reserves"
            : false,
        color: 'green'
    };

    const decreaseEarnings = {
        label: 'Decrease Earnings',
        onClick: api.decreaseEarnings,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'red'
    };

    // ==================== RETURN ALL PROPS ====================
    return {
        // Context values for conditional rendering
        isActiveEntityETF,
        isActingAsBank,
        isActingAsETFAdvisor,
        actingAs,
        actingAsId,
        playerName,
        activeEntitySymbol,
        actingAsSymbol,
        activeEntityNum,
        controlledCompanies,
        controlsActiveEntity,
        controlsETFAdvisor,

        // Legacy stubs kept for external consumers (CommoditiesTab, LoansTab, OptionsTab, etc.)
        // These are no longer functional since acting-as switching is handled by the PB override.
        mustActAsCompanyMessage: null,
        onMustActAsCompanyClick: null,

        // Trading
        buyStock,
        sellStock,
        shortStock,
        coverShort,
        buyCorpBond,
        sellCorpBond,
        buyLongGovtBonds,
        sellLongGovtBonds,
        buyShortGovtBonds,
        sellShortGovtBonds,

        // Options
        buyCalls,
        sellCalls,
        buyPuts,
        sellPuts,
        advancedOptions,

        // Finance
        borrowMoney,
        repayLoan,
        changeBank,
        tradeTbills,
        advanceFunds,
        interestRateSwaps,
        prepayTaxes,

        // Corporate - Leadership
        electResignCeo,
        changeManagers,

        // Corporate - Strategy
        setDividend,
        setProductivity,
        setGrowthRate,
        growthThrottle,
        rebrand,
        restructure,

        // Corporate - Raise Capital
        publicStockOffering,
        privateStockOffering,
        issueCorpBonds,

        // Corporate - Return Capital
        redeemCorpBonds,
        extraordinaryDividend,
        splitStock,
        reverseSplit,

        // Corporate - Assets
        buyCorporateAssets,
        sellCorporateAssets,
        sellSubsidiaryStock,
        spinOff,
        browseForSaleItems,

        // Corporate - Liquidation
        taxFreeLiquidation,
        taxableLiquidation,

        // Corporate - New Ventures
        startup,
        capitalContribution,

        // Corporate - ETF/Advisory
        becomeEtfAdvisor,
        setAdvisoryFee,

        // Corporate - Autopilot
        toggleGlobalAutopilot,

        // Bank Operations
        setBankAllocation,
        listBankLoans,
        freezeAllLoans,
        buyBusinessLoans,
        sellBusinessLoans,
        buyConsumerLoans,
        sellConsumerLoans,
        buyPrimeMortgages,
        sellPrimeMortgages,
        buySubprimeMortgages,
        sellSubprimeMortgages,

        // Hostile Actions
        changeLawFirm,
        antitrustLawsuit,
        harassingLawsuit,
        spreadRumors,
        greenmail,
        leveragedBuyout,
        merger,
        increaseEarnings,
        decreaseEarnings,
    };
}

export default useActionButtonProps;
