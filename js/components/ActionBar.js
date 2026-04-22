import { html, useState, useCallback } from '../lib/preact.standalone.module.js';
import DropdownMenu from './DropdownMenu.js';
import CommandPrompt from './CommandPrompt.js';
import CompanySelectModal from './CompanySelectModal.js';
import CommoditySelectModal from './CommoditySelectModal.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import * as api from '../api.js';

/**
 * ActionBar — five dropdowns of game actions driven by the viewed entity.
 *
 * Semantic model:
 *   - intParam2 = activeEntityNum (always, for ActionBar). Every endpoint call
 *       threads the viewed entity as acting-as. The PB dispatcher swaps
 *       PlayCo via SwapActingAs for the duration of the event.
 *   - Target-requiring actions (Buy Stock, Merger, Antitrust, etc.) open a
 *       frontend picker (CompanySelectModal or CommoditySelectModal) and
 *       fire the api.* fn with (targetId, activeEntityNum).
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

    // ==================== Picker State (company | commodity) ====================
    // pendingAction: { kind: 'company'|'commodity', title, text?, filter?, onResolve }
    const [pendingAction, setPendingAction] = useState(null);

    const openCompanyPicker = useCallback((cfg) => {
        setPendingAction({ kind: 'company', ...cfg });
    }, []);

    const openCommodityPicker = useCallback((cfg) => {
        setPendingAction({ kind: 'commodity', ...cfg });
    }, []);

    const handlePickerResolved = useCallback((resultStr) => {
        const current = pendingAction;
        setPendingAction(null);
        if (!current || !resultStr) return;
        const targetId = parseInt(resultStr, 10);
        if (!targetId || isNaN(targetId)) return;
        current.onResolve(targetId);
    }, [pendingAction]);

    // ==================== Helpers ====================
    // Build an acting-as suffix for picker titles.
    const actingSuffix = actingAsSymbol ? ` (acting as ${actingAsSymbol})` : '';

    // Wrap a hook button so clicking opens a CompanySelectModal, and on resolve
    // fires apiFn(targetId, activeEntityNum).
    const withCompanyPicker = (hookBtn, apiFn, { title, text, filter } = {}) => ({
        ...hookBtn,
        onClick: () => openCompanyPicker({
            title: title || `${hookBtn.label || 'Select Company'}${actingSuffix}`,
            text: text || 'Choose a company:',
            filter,
            onResolve: (targetId) => apiFn(targetId, activeEntityNum),
        }),
    });

    // Wrap a hook button so clicking opens a CommoditySelectModal.
    const withCommodityPicker = (hookBtn, apiFn, { title, text, filter } = {}) => ({
        ...hookBtn,
        onClick: () => openCommodityPicker({
            title: title || `${hookBtn.label || 'Select Commodity'}${actingSuffix}`,
            text: text || 'Choose a commodity:',
            filter,
            onResolve: (targetId) => apiFn(targetId, activeEntityNum),
        }),
    });

    // Default filters.
    const excludeSelf = (c) => c.id !== activeEntityNum;
    const controlledIdSet = new Set((controlledCompanies || []).map(c => c.id));
    const hostileFilter = (c) => !controlledIdSet.has(c.id);
    const antitrustFilter = (c) => !controlledIdSet.has(c.id) && c.industryId === actingAsIndustryId;

    // ==================== TRADE DROPDOWN (Multi-Column) ====================
    // Col 1: Stocks / Corp Bonds / Govt Bonds (opening positions only).
    const tradeColumn1 = [
        { header: 'Stocks' },
        withCompanyPicker(props.buyStock, api.buyStock,
            { title: `Buy Stock${actingSuffix}`, text: "Which company's stock?", filter: excludeSelf }),
        ...(!isActingAsETFAdvisor ? [
            withCompanyPicker(props.shortStock, api.shortStock,
                { title: `Short Stock${actingSuffix}`, text: "Which company's stock to short?", filter: excludeSelf }),
        ] : []),
        { divider: true },
        { header: 'Corporate Bonds' },
        withCompanyPicker(props.buyCorpBond, api.buyCorporateBond,
            { title: `Buy Corporate Bond${actingSuffix}`, text: "Which company's bond?", filter: excludeSelf }),
        ...(canTradeGovtBonds ? [
            { divider: true },
            { header: 'Government Bonds' },
            props.buyLongGovtBonds,
            props.buyShortGovtBonds,
        ] : []),
    ];

    // Col 2: Commodities (opening positions only).
    const nonCryptoCommodity = (c) => c.kind !== 'crypto';
    const physOnly = (c) => c.kind === 'phys';
    const cryptoOnly = (c) => c.kind === 'crypto';
    const tradeColumn2 = canTradeCommodities ? [
        { header: 'Commodities' },
        withCommodityPicker({ label: 'Buy Futures',   color: 'green' }, api.buyCommodityFutures,
            { title: `Buy Futures${actingSuffix}`, filter: nonCryptoCommodity }),
        withCommodityPicker({ label: 'Short Futures', color: 'red' }, api.shortCommodityFutures,
            { title: `Short Futures${actingSuffix}`, filter: nonCryptoCommodity }),
        withCommodityPicker({ label: 'Buy Physical', color: 'green' }, api.buyPhysicalCommodity,
            { title: `Buy Physical${actingSuffix}`, filter: physOnly }),
        { divider: true },
        { header: 'Crypto' },
        withCommodityPicker({ label: 'Buy Crypto', color: 'green' }, api.buyPhysicalCrypto,
            { title: `Buy Crypto${actingSuffix}`, filter: cryptoOnly }),
        withCommodityPicker({ label: 'Buy Crypto Futures', color: 'green' }, api.buyCryptoFutures,
            { title: `Buy Crypto Futures${actingSuffix}`, filter: cryptoOnly }),
    ] : [];

    // Col 3: Options (naked writes kept).
    const tradeColumn3 = canTradeOptions ? [
        { header: 'Options' },
        withCompanyPicker(props.buyCalls,  api.buyCalls,
            { title: `Buy Calls${actingSuffix}`, text: 'Underlying company?', filter: excludeSelf }),
        withCompanyPicker(props.sellCalls, api.sellCalls,
            { title: `Sell Calls${actingSuffix}`, text: 'Underlying company?', filter: excludeSelf }),
        withCompanyPicker(props.buyPuts,   api.buyPuts,
            { title: `Buy Puts${actingSuffix}`, text: 'Underlying company?', filter: excludeSelf }),
        withCompanyPicker(props.sellPuts,  api.sellPuts,
            { title: `Sell Puts${actingSuffix}`, text: 'Underlying company?', filter: excludeSelf }),
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
        {
            label: 'Merger', color: 'green',
            onClick: () => openCompanyPicker({
                title: `Merger${actingSuffix}`,
                text: 'Merge with which company?',
                filter: hostileFilter,
                onResolve: (targetId) => api.merger(targetId, activeEntityNum),
            }),
        },
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
        {
            label: 'Antitrust Lawsuit', color: 'red',
            onClick: () => openCompanyPicker({
                title: `Antitrust Lawsuit${actingSuffix}`,
                text: 'Sue which company? (same industry)',
                filter: antitrustFilter,
                onResolve: (targetId) => api.antitrustLawsuit(targetId, activeEntityNum),
            }),
        },
        {
            label: 'Harassing Lawsuit', color: 'red',
            onClick: () => openCompanyPicker({
                title: `Harassing Lawsuit${actingSuffix}`,
                text: 'Sue which company?',
                filter: hostileFilter,
                onResolve: (targetId) => api.harrassingLawsuit(targetId, activeEntityNum),
            }),
        },
        { divider: true },
        { header: 'Reputation' },
        {
            label: 'Spread Rumors', color: 'red',
            onClick: () => openCompanyPicker({
                title: `Spread Rumors${actingSuffix}`,
                text: 'Target which company?',
                filter: hostileFilter,
                onResolve: (targetId) => api.spreadRumors(targetId, activeEntityNum),
            }),
        },
        { divider: true },
        { header: 'Takeovers' },
        {
            label: 'Greenmail', color: 'red',
            onClick: () => openCompanyPicker({
                title: `Greenmail${actingSuffix}`,
                text: 'Greenmail which company?',
                filter: hostileFilter,
                onResolve: (targetId) => api.greenmail(targetId, activeEntityNum),
            }),
        },
        {
            label: 'Leveraged Buyout', color: 'red',
            onClick: () => openCompanyPicker({
                title: `Leveraged Buyout${actingSuffix}`,
                text: 'LBO which company?',
                filter: hostileFilter,
                onResolve: (targetId) => api.lbo(targetId, activeEntityNum),
            }),
        },
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
            show=${pendingAction?.kind === 'company'}
            title=${pendingAction?.title || ''}
            text=${pendingAction?.text || ''}
            onSubmit=${handlePickerResolved}
            filter=${pendingAction?.kind === 'company' ? pendingAction.filter : undefined}
        />
        <${CommoditySelectModal}
            show=${pendingAction?.kind === 'commodity'}
            title=${pendingAction?.title || ''}
            text=${pendingAction?.text || ''}
            onSubmit=${handlePickerResolved}
            filter=${pendingAction?.kind === 'commodity' ? pendingAction.filter : undefined}
        />
    `;
}
