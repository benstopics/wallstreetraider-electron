import { html, useState, useCallback, useMemo } from '../lib/preact.standalone.module.js';
import DropdownMenu from './DropdownMenu.js';
import CommandPrompt from './CommandPrompt.js';
import CompanySelectModal from './CompanySelectModal.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import * as api from '../api.js';

/**
 * ActionBar — five dropdowns of game actions driven by the viewed entity.
 *
 * Semantic model:
 *   - intParam2 = activeEntityNum (always, for ActionBar)
 *       The viewed entity is the executor / acting-as for every action.
 *   - intParam1 = 0 for target-requiring trades/hostile actions
 *       PB-side SelectCompanyModal picks the target (e.g. "whose stock?").
 *       Hostile actions use a JS-side CompanySelectModal picker with filtering
 *       (non-controlled, same-industry for Antitrust) before firing the API.
 *   - Type 3 self-actions (Set Dividend, Rebrand, etc.) use the hook's no-arg
 *       onClick and rely on the top-level gate (`viewing == acting-as`) so PB
 *       sees PlayCo& = activeEntityNum without an explicit swap.
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
        actingAsSymbol,
        activeEntityNum,
        activeEntitySymbol,
        controlledCompanies,
        controlsActiveEntity,
        isActiveEntityETF,
        isActingAsBank,
        isActingAsETFAdvisor,
    } = props;

    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);

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

    // ==================== Hostile Target Picker State ====================
    const [hostileAction, setHostileAction] = useState(null);
    const [showTargetPicker, setShowTargetPicker] = useState(false);

    const targetFilter = useMemo(() => {
        const controlledIds = new Set((controlledCompanies || []).map(c => c.id));
        if (hostileAction === 'antitrust') {
            return (c) => !controlledIds.has(c.id) && c.industryId === actingAsIndustryId;
        }
        return (c) => !controlledIds.has(c.id);
    }, [hostileAction, controlledCompanies, actingAsIndustryId]);

    const openPicker = useCallback((action) => {
        setHostileAction(action);
        setShowTargetPicker(true);
    }, []);

    const handleTargetSelected = useCallback(async (targetIdStr) => {
        setShowTargetPicker(false);
        if (!targetIdStr) { setHostileAction(null); return; }
        const targetId = parseInt(targetIdStr, 10);
        if (!targetId || isNaN(targetId)) { setHostileAction(null); return; }
        const action = hostileAction;
        setHostileAction(null);
        const acting = activeEntityNum;
        if (action === 'antitrust')     api.antitrustLawsuit(targetId, acting);
        else if (action === 'harassing')  api.harrassingLawsuit(targetId, acting);
        else if (action === 'spreadRumors') api.spreadRumors(targetId, acting);
        else if (action === 'greenmail')    api.greenmail(targetId, acting);
        else if (action === 'lbo')          api.lbo(targetId, acting);
        else if (action === 'merger')       api.merger(targetId, acting);
    }, [hostileAction, activeEntityNum]);

    const actionLabels = {
        antitrust: 'Antitrust Lawsuit',
        harassing: 'Harassing Lawsuit',
        spreadRumors: 'Spread Rumors',
        greenmail: 'Greenmail',
        lbo: 'Leveraged Buyout',
        merger: 'Merger',
    };

    // ==================== Helpers ====================
    // Wrap a hook button so its onClick fires with (0, activeEntityNum) —
    // target picker on PB side, acting-as = viewed entity.
    const withPickerTarget = (hookBtn, apiFn) => ({
        ...hookBtn,
        onClick: () => apiFn(0, activeEntityNum),
    });
    // Wrap a hook button with a specific target id.
    const withTarget = (hookBtn, apiFn, targetId) => ({
        ...hookBtn,
        onClick: () => apiFn(targetId, activeEntityNum),
    });

    // ==================== TRADE DROPDOWN (Multi-Column) ====================
    // Col 1: Stocks / Corp Bonds / Govt Bonds (opening positions only).
    const tradeColumn1 = [
        { header: 'Stocks' },
        withPickerTarget(props.buyStock, api.buyStock),
        ...(!isActingAsETFAdvisor ? [withPickerTarget(props.shortStock, api.shortStock)] : []),
        { divider: true },
        { header: 'Corporate Bonds' },
        withPickerTarget(props.buyCorpBond, api.buyCorporateBond),
        ...(canTradeGovtBonds ? [
            { divider: true },
            { header: 'Government Bonds' },
            { ...props.buyLongGovtBonds,  onClick: () => api.buyLongGovtBonds(activeEntityNum) },
            { ...props.buyShortGovtBonds, onClick: () => api.buyShortGovtBonds(activeEntityNum) },
        ] : []),
    ];

    // Col 2: Commodities (opening positions only).
    const tradeColumn2 = canTradeCommodities ? [
        { header: 'Commodities' },
        { label: 'Buy Futures',   onClick: () => api.buyCommodityFutures(0, activeEntityNum),   color: 'green' },
        { label: 'Short Futures', onClick: () => api.shortCommodityFutures(0, activeEntityNum), color: 'red'   },
        { label: 'Buy Physical',  onClick: () => api.buyPhysicalCommodity(0, activeEntityNum),  color: 'green' },
        { divider: true },
        { header: 'Crypto' },
        { label: 'Buy Crypto',         onClick: () => api.buyPhysicalCrypto(0, activeEntityNum), color: 'green' },
        { label: 'Buy Crypto Futures', onClick: () => api.buyCryptoFutures(0, activeEntityNum),  color: 'green' },
    ] : [];

    // Col 3: Options (naked writes kept).
    const tradeColumn3 = canTradeOptions ? [
        { header: 'Options' },
        withPickerTarget(props.buyCalls,  api.buyCalls),
        withPickerTarget(props.sellCalls, api.sellCalls),
        withPickerTarget(props.buyPuts,   api.buyPuts),
        withPickerTarget(props.sellPuts,  api.sellPuts),
        { divider: true },
        { ...props.advancedOptions, label: 'Advanced Options...' },
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
        props.growthThrottle,
        props.rebrand,
        props.restructure,
    ] : [];

    const corporateColumn2 = [
        { header: 'M&A' },
        { label: 'Merger', onClick: () => openPicker('merger'), color: 'green' },
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
        { divider: true },
        { header: 'ETF / Advisory' },
        props.becomeEtfAdvisor,
        props.setAdvisoryFee,
        { divider: true },
        { header: 'Autopilot' },
        props.toggleGlobalAutopilot,
    ];

    const corporateColumns = [corporateColumn1, corporateColumn2].filter(c => c.length > 0);

    // ==================== FINANCE DROPDOWN ====================
    const financeColumn1 = [
        { header: 'Equity' },
        props.publicStockOffering,
        ...(canActOnSelf ? [
            props.privateStockOffering,
            props.splitStock,
            props.reverseSplit,
        ] : []),
        { divider: true },
        { header: 'Debt' },
        props.issueCorpBonds,
        props.redeemCorpBonds,
        props.borrowMoney,
        props.repayLoan,
        ...(!isActiveEntityETF ? [props.tradeTbills] : []),
    ];

    const financeColumn2 = [
        { header: 'Returns' },
        ...(canActOnSelf ? [
            props.setDividend,
            props.extraordinaryDividend,
            props.taxFreeLiquidation,
            props.taxableLiquidation,
        ] : []),
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
        ...(canActOnSelf ? [
            { header: 'Accounting' },
            props.increaseEarnings,
            props.decreaseEarnings,
        ] : []),
    ];

    const financeColumns = [financeColumn1, financeColumn2].filter(c => c.length > 0);

    // ==================== HOSTILE DROPDOWN ====================
    const hostileItems = [
        { header: 'Legal' },
        props.changeLawFirm,
        { label: 'Antitrust Lawsuit', onClick: () => openPicker('antitrust'), color: 'red' },
        { label: 'Harassing Lawsuit', onClick: () => openPicker('harassing'), color: 'red' },
        { divider: true },
        { header: 'Reputation' },
        { label: 'Spread Rumors',     onClick: () => openPicker('spreadRumors'), color: 'red' },
        { divider: true },
        { header: 'Takeovers' },
        { label: 'Greenmail',         onClick: () => openPicker('greenmail'), color: 'red' },
        { label: 'Leveraged Buyout',  onClick: () => openPicker('lbo'),       color: 'red' },
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
        <${CompanySelectModal}
            show=${showTargetPicker}
            title=${`Select target for ${actionLabels[hostileAction] || 'action'}${actingAsSymbol ? ` (acting as ${actingAsSymbol})` : ''}`}
            text="Choose a company to target:"
            onSubmit=${handleTargetSelected}
            filter=${targetFilter}
        />
    `;
}
