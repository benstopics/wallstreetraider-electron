import { html, useState, useCallback, useMemo } from '../lib/preact.standalone.module.js';
import DropdownMenu from './DropdownMenu.js';
import CommandPrompt from './CommandPrompt.js';
import CompanySelectModal from './CompanySelectModal.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import * as api from '../api.js';

/**
 * ActionBar - Dropdown menus for Corporate & Hostile actions, plus standalone buttons.
 *
 * Corporate (hotkey C): M&A, Assets, Misc
 * Hostile (hotkey H): Legal, Reputation, Takeovers
 * Standalone: Price Alerts
 *
 * Hostile actions that need a target company open a CompanySelectModal picker.
 */
export default function ActionBar({ entityLabel }) {
    const props = useActionButtonProps();

    // ==================== Hostile Target Picker State ====================
    const [hostileAction, setHostileAction] = useState(null);
    const [showTargetPicker, setShowTargetPicker] = useState(false);

    const {
        actingAsId,
        actingAsSymbol,
        activeEntityNum,
        controlledCompanies,
        controlsActiveEntity,
        isActiveEntityETF,
        isActingAsBank,
        isActingAsETFAdvisor,
    } = props;

    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const canTradeGovtBonds = [api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId);
    const canTradeOptions = !isActingAsBank && actingAsIndustryId !== api.INSURANCE_IND;

    // Build filter for target picker based on action
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

        // Actions that take a target ID directly — no navigation needed
        if (action === 'antitrust') { api.antitrustLawsuit(targetId); return; }
        if (action === 'harassing') { api.harrassingLawsuit(targetId); return; }
        if (action === 'spreadRumors') { api.spreadRumors(targetId); return; }

        // Pass target ID directly — PB temporarily sets ActvEntyNum to target,
        // runs the action, then restores ActvEntyNum. No navigation needed.
        if (action === 'greenmail') api.greenmail(targetId);
        else if (action === 'lbo') api.lbo(targetId);
        else if (action === 'merger') api.merger(targetId);
    }, [hostileAction, activeEntityNum]);

    // ==================== Disabled Helpers ====================
    const notActingAsCompany = !actingAsId || actingAsId <= 10;
    const companyMsg = notActingAsCompany ? "Must be acting as a company" : false;
    const etfMsg = isActiveEntityETF ? "Not available for ETFs" : false;
    const pickerDisabled = isActiveEntityETF || notActingAsCompany;
    const pickerDisabledMsg = etfMsg || companyMsg;

    // ==================== Action Labels for Picker Title ====================
    const actionLabels = {
        antitrust: 'Antitrust Lawsuit',
        harassing: 'Harassing Lawsuit',
        spreadRumors: 'Spread Rumors',
        greenmail: 'Greenmail',
        lbo: 'Leveraged Buyout',
        merger: 'Merger',
    };

    // ==================== CORPORATE DROPDOWN ====================
    const corporateItems = [
        { header: 'M&A' },
        props.startup,
        {
            ...props.merger,
            label: 'Merger',
            onClick: () => openPicker('merger'),
            disabled: pickerDisabled,
            disabledMessage: pickerDisabledMsg,
            color: 'green',
        },
        props.capitalContribution,
        { divider: true },
        { header: 'Assets' },
        props.browseForSaleItems,
        { divider: true },
        { header: 'Misc' },
        props.electResignCeo,
    ];

    // ==================== INVEST DROPDOWN ====================
    const investItems = [
        { header: 'Stocks' },
        props.buyStock,
        props.sellStock,
        ...(!isActingAsETFAdvisor ? [props.shortStock] : []),
        props.coverShort,
        { divider: true },
        { header: 'Bonds' },
        props.buyCorpBond,
        props.sellCorpBond,
        ...(canTradeGovtBonds ? [
            { divider: true },
            { header: 'Govt Bonds' },
            props.buyLongGovtBonds,
            props.sellLongGovtBonds,
            props.buyShortGovtBonds,
            props.sellShortGovtBonds,
        ] : []),
        ...(canTradeOptions ? [
            { divider: true },
            { header: 'Options' },
            props.buyCalls,
            props.sellCalls,
            props.buyPuts,
            props.sellPuts,
            { divider: true },
            props.advancedOptions,
        ] : []),
    ];

    // ==================== HOSTILE DROPDOWN ====================
    const hostileItems = [
        { header: 'Legal' },
        props.changeLawFirm,
        {
            label: 'Antitrust Lawsuit',
            onClick: () => openPicker('antitrust'),
            disabled: pickerDisabled,
            disabledMessage: pickerDisabledMsg,
            color: 'red',
        },
        {
            label: 'Harassing Lawsuit',
            onClick: () => openPicker('harassing'),
            disabled: false,
            color: 'red',
        },
        { divider: true },
        { header: 'Reputation' },
        {
            label: 'Spread Rumors',
            onClick: () => openPicker('spreadRumors'),
            disabled: false,
            color: 'red',
        },
        { divider: true },
        { header: 'Takeovers' },
        {
            label: 'Greenmail',
            onClick: () => openPicker('greenmail'),
            disabled: pickerDisabled,
            disabledMessage: pickerDisabledMsg,
            color: 'red',
        },
        {
            label: 'Leveraged Buyout',
            onClick: () => openPicker('lbo'),
            disabled: pickerDisabled,
            disabledMessage: pickerDisabledMsg,
            color: 'red',
        },
    ];

    return html`
        <div class="action-bar" style="align-items: center;">
            ${entityLabel ? html`<span style="font-weight: bold; font-size: var(--font-size-sm); white-space: nowrap; opacity: 0.7;">${entityLabel}</span>` : ''}
            ${(activeEntityNum === api.HUMAN1_ID || (!notActingAsCompany && controlsActiveEntity)) ? html`
                ${activeEntityNum !== api.HUMAN1_ID ? html`
                    <${DropdownMenu}
                        label="Corporate"
                        icon="🏢"
                        items=${corporateItems}
                        color="blue"
                    />
                ` : ''}
                ${activeEntityNum === api.HUMAN1_ID ? html`
                    <${DropdownMenu}
                        label="Invest"
                        icon="📈"
                        items=${investItems}
                        color="green"
                    />
                ` : ''}
                ${activeEntityNum !== api.HUMAN1_ID ? html`
                    <${DropdownMenu}
                        label="Hostile"
                        icon="⚔️"
                        items=${hostileItems}
                        color="red"
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
