import * as api from '../api.js';

/**
 * Centralized hook for action button props.
 * Provides consistent button definitions (label, onClick, disabled logic, colors)
 * that can be used across ActionBar, IndustrialView, PlayerView, and other components.
 *
 * Usage:
 *   const { buyStock, shortStock, buyCalls } = useActionButtonProps();
 *   <${DisabledTooltipButton} ...${buyStock} />
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

    // ==================== Click Handlers ====================
    // Handler for switching to the active entity (company or ETF advisor)
    const handleActAsClick = () => {
        if (isActiveEntityETF && controlsETFAdvisor && !isActingAsETFAdvisor) {
            api.changeActingAs(etfAdvisorId);
        } else if (!isActiveEntityETF && controlsActiveEntity && !actingAs) {
            api.changeActingAs(activeEntityNum);
        }
    };

    // Handler for switching to player
    const handleActAsPlayer = () => api.changeActingAs(api.HUMAN1_ID);

    // ==================== Disabled Message Helpers ====================

    // Standard "must be acting as this company" check with ETF support
    const getActingAsDisabledMessage = () => {
        if (isActiveEntityETF) {
            if (!controlsETFAdvisor) return "You must control the ETF's investment advisor";
            if (!isActingAsETFAdvisor) return `Must be acting as the ETF's investment advisor. Click to act as ${etfAdvisorSymbol}`;
            return false;
        }
        if (!actingAs) {
            return controlsActiveEntity
                ? `Must be acting as this company. Click to act as ${activeEntitySymbol}`
                : "Must be acting as this company";
        }
        return false;
    };

    // Must be acting as company (non-ETF, simpler check)
    const mustActAsCompany = !actingAs
        ? (controlsActiveEntity
            ? `Must be acting as this company. Click to act as ${activeEntitySymbol}`
            : "Must be acting as this company")
        : false;

    // Must be acting as yourself (player)
    const mustActAsYourself = actingAsId !== api.HUMAN1_ID
        ? `Must be acting as yourself. Click to act as ${playerName}`
        : false;

    // Cannot act as self (for actions that target another entity)
    const cannotActAsSelf = actingAs ? "You cannot do this to yourself!" : false;

    // onDisabledClick handlers
    const onMustActAsCompanyClick = controlsActiveEntity ? handleActAsClick : null;
    const onMustActAsYourselfClick = handleActAsPlayer;

    // Check if handleActAsClick would actually do something
    const canActAsClick = isActiveEntityETF
        ? (controlsETFAdvisor && !isActingAsETFAdvisor)
        : (controlsActiveEntity && !actingAs);
    const onActAsClick = canActAsClick ? handleActAsClick : null;

    // Handler for switching to the viewed entity (player or controlled company)
    const handleActAsViewed = () => {
        if (activeEntityNum === api.HUMAN1_ID) {
            api.changeActingAs(api.HUMAN1_ID);
        } else if (isActiveEntityETF && controlsETFAdvisor) {
            api.changeActingAs(etfAdvisorId);
        } else if (controlsActiveEntity) {
            api.changeActingAs(activeEntityNum);
        }
    };

    // Check if we can switch to the viewed entity (player or controlled company)
    const canActAsViewed =
        (activeEntityNum === api.HUMAN1_ID && actingAsId !== api.HUMAN1_ID) ||
        (isActiveEntityETF && controlsETFAdvisor && actingAsId !== etfAdvisorId) ||
        (!isActiveEntityETF && controlsActiveEntity && actingAsId !== activeEntityNum);
    const onActAsViewedClick = canActAsViewed ? handleActAsViewed : null;

    // Must act as the viewed entity (player or company) - for portfolio sell/cover buttons
    const mustActAsViewedEntity = activeEntityNum < 10
        ? mustActAsYourself
        : mustActAsCompany;
    const onMustActAsViewedEntityClick = activeEntityNum < 10
        ? onMustActAsYourselfClick
        : onMustActAsCompanyClick;

    // ==================== Specific Disabled Checks ====================

    // Short stock: only players can short
    const canShortStockDisabled = isActingAsETFAdvisor
        ? "ETFs cannot short stocks"
        : actingAsId !== api.HUMAN1_ID
            ? `Only players can short stocks. Click to act as ${playerName}`
            : false;

    // Bond buying: players, banks, insurance only
    const buyBondDisabled = ![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
        ? `Only players, banks, and insurance companies can buy bonds. Click to act as ${playerName}`
        : false;

    // ==================== TRADING BUTTONS ====================

    const buyStock = {
        label: 'Buy Stock',
        onClick: () => api.buyStock(actingAs ? 0 : activeEntityNum),
        color: 'green',
        dataTutorial: 'buy-stock'
    };

    const sellStock = {
        label: 'Sell Stock',
        onClick: () => api.sellStock(0),
        disabled: !!mustActAsViewedEntity,
        disabledMessage: mustActAsViewedEntity,
        onDisabledClick: onMustActAsViewedEntityClick,
        color: 'red'
    };

    const shortStock = {
        label: 'Short Stock',
        onClick: () => api.shortStock(actingAs ? 0 : activeEntityNum),
        disabled: !!canShortStockDisabled,
        disabledMessage: canShortStockDisabled,
        onDisabledClick: !isActingAsETFAdvisor && actingAsId !== api.HUMAN1_ID ? onMustActAsYourselfClick : null,
        color: 'red'
    };

    const coverShort = {
        label: 'Cover Short',
        onClick: () => api.coverShortStock(0),
        disabled: !!mustActAsViewedEntity,
        disabledMessage: mustActAsViewedEntity,
        onDisabledClick: onMustActAsViewedEntityClick,
        color: 'green'
    };

    const buyCorpBond = {
        label: 'Buy Corp Bond',
        onClick: () => api.buyCorporateBond(actingAs ? 0 : activeEntityNum),
        disabled: !!buyBondDisabled,
        disabledMessage: buyBondDisabled,
        onDisabledClick: buyBondDisabled ? handleActAsPlayer : null,
        color: 'green'
    };

    const sellCorpBond = {
        label: 'Sell Corp Bond',
        onClick: () => api.sellCorporateBond(0),
        disabled: !!mustActAsViewedEntity,
        disabledMessage: mustActAsViewedEntity,
        onDisabledClick: onMustActAsViewedEntityClick,
        color: 'red'
    };

    // Government bond trading: must be acting as player, bank, or insurance company
    const govtBondDisabledMessage = !actingAs
        ? (controlsActiveEntity
            ? `Must be acting as this company. Click to act as ${activeEntitySymbol}`
            : "Must be acting as this company")
        : (![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
            ? `Only players, banks, and insurance companies can trade government bonds. Click to act as ${playerName}`
            : false);

    const onGovtBondDisabledClick = !actingAs
        ? (controlsActiveEntity ? handleActAsClick : null)
        : (![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
            ? handleActAsPlayer
            : null);

    const buyLongGovtBonds = {
        label: 'Buy Long Govt Bonds',
        onClick: api.buyLongGovtBonds,
        disabled: !!govtBondDisabledMessage,
        disabledMessage: govtBondDisabledMessage,
        onDisabledClick: onGovtBondDisabledClick,
        color: 'green'
    };

    const sellLongGovtBonds = {
        label: 'Sell Long Govt Bonds',
        onClick: api.sellLongGovtBonds,
        disabled: !!govtBondDisabledMessage,
        disabledMessage: govtBondDisabledMessage,
        onDisabledClick: onGovtBondDisabledClick,
        color: 'red'
    };

    const buyShortGovtBonds = {
        label: 'Buy Short Govt Bonds',
        onClick: api.buyShortGovtBonds,
        disabled: !!govtBondDisabledMessage,
        disabledMessage: govtBondDisabledMessage,
        onDisabledClick: onGovtBondDisabledClick,
        color: 'green'
    };

    const sellShortGovtBonds = {
        label: 'Sell Short Govt Bonds',
        onClick: api.sellShortGovtBonds,
        disabled: !!govtBondDisabledMessage,
        disabledMessage: govtBondDisabledMessage,
        onDisabledClick: onGovtBondDisabledClick,
        color: 'red'
    };

    // ==================== OPTIONS BUTTONS ====================

    // Options trading is available to everyone (players, companies, banks, insurers).
    // ETFs can trade options through their advisor — the PB code handles ETF routing
    // internally via IsETFActive, so these buttons should not be disabled for ETFs.
    // The Advanced Options Trading Station is the only exception (ETFs cannot use it
    // per W$R rules, and the PB code enforces this in CASE 330).

    const buyCalls = {
        label: 'Buy Calls',
        onClick: () => api.buyCalls(0),
        color: 'green'
    };

    const sellCalls = {
        label: 'Sell Calls',
        onClick: () => api.sellCalls(0),
        color: 'red'
    };

    const buyPuts = {
        label: 'Buy Puts',
        onClick: () => api.buyPuts(0),
        color: 'green'
    };

    const sellPuts = {
        label: 'Sell Puts',
        onClick: () => api.sellPuts(0),
        color: 'red'
    };

    const advancedOptions = {
        label: 'Advanced Options',
        onClick: api.advancedOptionsTrading,
        disabled: isActiveEntityETF,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs" : false,
        color: 'green'
    };

    // ==================== FINANCE BUTTONS ====================

    // These use getActingAsDisabledMessage() for full ETF advisor support
    const financeDisabledMessage = getActingAsDisabledMessage();

    const borrowMoney = {
        label: 'Borrow Money',
        onClick: api.borrowMoney,
        disabled: !!financeDisabledMessage,
        disabledMessage: financeDisabledMessage,
        onDisabledClick: onActAsViewedClick,
        color: 'green'
    };

    const repayLoan = {
        label: 'Repay Loan',
        onClick: api.repayLoan,
        disabled: !!financeDisabledMessage,
        disabledMessage: financeDisabledMessage,
        onDisabledClick: onActAsClick,
        color: ''
    };

    const changeBank = {
        label: 'Change Bank',
        onClick: api.changeBank,
        disabled: !!financeDisabledMessage,
        disabledMessage: financeDisabledMessage,
        onDisabledClick: onActAsViewedClick,
        color: 'blue'
    };

    const tradeTbills = {
        label: 'Trade T-Bills',
        onClick: api.tradeTbills,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: onActAsViewedClick,
        color: 'brown'
    };

    const advanceFunds = {
        label: 'Advance Funds',
        onClick: api.advanceFunds,
        disabled: !!mustActAsYourself,
        disabledMessage: mustActAsYourself,
        onDisabledClick: onMustActAsYourselfClick,
        color: 'green'
    };

    const interestRateSwaps = {
        label: 'Interest Rate Swaps',
        onClick: api.interestRateSwaps,
        disabled: !!mustActAsCompany,
        disabledMessage: mustActAsCompany,
        onDisabledClick: onMustActAsCompanyClick,
        color: 'blue'
    };

    const prepayTaxes = {
        label: 'Prepay Taxes',
        onClick: api.prepayTaxes,
        disabled: !!mustActAsYourself,
        disabledMessage: mustActAsYourself,
        onDisabledClick: onActAsViewedClick,
        color: 'green'
    };

    // ==================== CORPORATE BUTTONS ====================

    const electResignCeo = {
        label: playerIsCEO ? 'Resign as CEO' : 'Elect as CEO',
        onClick: playerIsCEO ? api.resignAsCeo : api.electCeo,
        disabled: !!mustActAsCompany || isActiveEntityETF || !playerControlsActive,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : (!playerControlsActive ? "Must control this company" : false)),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: playerIsCEO ? 'red' : 'green'
    };

    const changeManagers = {
        label: 'Change Managers',
        onClick: api.changeManagers,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'red'
    };

    const setDividend = {
        label: 'Set Dividend',
        onClick: api.setDividend,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'green'
    };

    const setProductivity = {
        label: 'Set Productivity',
        onClick: api.setProductivity,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'brown'
    };

    const setGrowthRate = {
        label: 'Set Growth Rate',
        onClick: api.setGrowthRate,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'orange'
    };

    const rebrand = {
        label: 'Rebrand',
        onClick: api.rebrand,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'blue'
    };

    const restructure = {
        label: 'Restructure',
        onClick: api.restructure,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'blue'
    };

    const publicStockOffering = {
        label: 'Public Stock Offering',
        onClick: api.publicStockOffering,
        disabled: !!getActingAsDisabledMessage(),
        disabledMessage: getActingAsDisabledMessage(),
        onDisabledClick: onActAsClick,
        color: 'green'
    };

    const privateStockOffering = {
        label: 'Private Stock Offering',
        onClick: api.privateStockOffering,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'brown'
    };

    const issueCorpBonds = {
        label: 'Issue Corp Bonds',
        onClick: api.issueNewCorpBonds,
        disabled: !!getActingAsDisabledMessage(),
        disabledMessage: getActingAsDisabledMessage(),
        onDisabledClick: onActAsClick,
        color: 'brown'
    };

    const redeemCorpBonds = {
        label: 'Redeem Corp Bonds',
        onClick: api.redeemCorpBonds,
        disabled: !!getActingAsDisabledMessage(),
        disabledMessage: getActingAsDisabledMessage(),
        onDisabledClick: onActAsClick,
        color: 'brown'
    };

    const extraordinaryDividend = {
        label: 'Extraordinary Dividend',
        onClick: api.extraordinaryDividend,
        disabled: !!financeDisabledMessage,
        disabledMessage: financeDisabledMessage,
        onDisabledClick: onActAsClick,
        color: 'green'
    };

    const splitStock = {
        label: 'Split Stock',
        onClick: api.splitStock,
        disabled: !!getActingAsDisabledMessage(),
        disabledMessage: getActingAsDisabledMessage(),
        onDisabledClick: onActAsClick,
        color: 'green'
    };

    const reverseSplit = {
        label: 'Reverse Split',
        onClick: api.reverseSplitStock,
        disabled: !!getActingAsDisabledMessage(),
        disabledMessage: getActingAsDisabledMessage(),
        onDisabledClick: onActAsClick,
        color: 'red'
    };

    const buyCorporateAssets = {
        label: 'Buy Corporate Assets',
        onClick: api.buyCorporateAssets,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'green'
    };

    const sellCorporateAssets = {
        label: 'Sell Corporate Assets',
        onClick: api.sellCorporateAssets,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'red'
    };

    const offerAssetsForSale = {
        label: 'Offer Assets For Sale',
        onClick: api.offerCorporateAssetsForSale,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'blue'
    };

    const sellSubsidiaryStock = {
        label: 'Offer to Sell Subsidiary Stock',
        onClick: api.sellSubsidiaryStock,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'red'
    };

    const spinOff = {
        label: 'Spin-Off',
        onClick: (id) => api.spinOff(id),
        disabled: !!financeDisabledMessage,
        disabledMessage: financeDisabledMessage,
        onDisabledClick: onActAsClick,
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
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'green'
    };

    const taxableLiquidation = {
        label: 'Taxable Liquidation',
        onClick: api.taxableLiquidation,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
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
        disabled: !!cannotActAsSelf || isActiveEntityETF,
        disabledMessage: cannotActAsSelf || (isActiveEntityETF ? "Not available for ETFs" : false),
        color: 'green'
    };

    const setAdvisoryFee = {
        label: 'Set Advisory Fee',
        onClick: api.setAdvisoryFee,
        disabled: !!mustActAsCompany || !(isActingAsInsurance || isActingAsBroker),
        disabledMessage: mustActAsCompany || (!(isActingAsInsurance || isActingAsBroker) ? "Only for insurance/broker companies" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
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
        disabled: !!mustActAsCompany,
        disabledMessage: mustActAsCompany,
        onDisabledClick: onMustActAsCompanyClick,
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
        disabled: !!mustActAsCompany,
        disabledMessage: mustActAsCompany,
        onDisabledClick: onMustActAsCompanyClick,
        color: 'blue'
    };

    const buyBusinessLoans = {
        label: 'Buy Business Loans',
        onClick: api.buyBusinessLoans,
        disabled: !!mustActAsCompany,
        disabledMessage: mustActAsCompany,
        onDisabledClick: onMustActAsCompanyClick,
        color: 'green'
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
        onClick: api.greenmail,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'green'
    };

    const leveragedBuyout = {
        label: 'Leveraged Buyout',
        onClick: api.lbo,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'green'
    };

    const merger = {
        label: `Merger with${activeEntitySymbol ? ` ${activeEntitySymbol}` : ''}`,
        onClick: api.merger,
        disabled: isActiveEntityETF || !actingAs || actingAsId === activeEntityNum,
        disabledMessage: isActiveEntityETF ? "Not available for ETFs"
            : !actingAs ? "Must be acting as a company"
            : actingAsId === activeEntityNum ? "Cannot merge with yourself"
            : false,
        color: 'green'
    };

    const increaseEarnings = {
        label: 'Increase Earnings',
        onClick: api.increaseEarnings,
        disabled: !!mustActAsCompany || isActiveEntityETF || isActingAsBank,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : (isActingAsBank ? "Banks cannot draw from bad debt reserves" : false)),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'green'
    };

    const decreaseEarnings = {
        label: 'Decrease Earnings',
        onClick: api.decreaseEarnings,
        disabled: !!mustActAsCompany || isActiveEntityETF,
        disabledMessage: mustActAsCompany || (isActiveEntityETF ? "Not available for ETFs" : false),
        onDisabledClick: mustActAsCompany ? onMustActAsCompanyClick : null,
        color: 'red'
    };

    // ==================== RETURN ALL PROPS ====================
    return {
        // Context values for conditional rendering
        isActiveEntityETF,
        isActingAsBank,
        actingAs,
        actingAsId,
        playerName,
        activeEntitySymbol,
        actingAsSymbol,
        activeEntityNum,
        controlledCompanies,

        // Helper functions/values for dynamic buttons (e.g., in renderLines)
        mustActAsCompanyMessage: mustActAsViewedEntity,
        onMustActAsCompanyClick: onMustActAsViewedEntityClick,
        handleActAsClick,
        getActingAsDisabledMessage,

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
        offerAssetsForSale,
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
        setAdvisoryFee,

        // Corporate - Autopilot
        toggleGlobalAutopilot,

        // Bank Operations
        setBankAllocation,
        listBankLoans,
        freezeAllLoans,
        buyBusinessLoans,
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
