import { html, useState, useCallback, useMemo } from '../lib/preact.standalone.module.js';
import DropdownMenu from './DropdownMenu.js';
import CommandPrompt from './CommandPrompt.js';
import CompanySelectModal from './CompanySelectModal.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import { useShiftHeld } from '../hooks/useHotkey.js';
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
    const shiftHeld = useShiftHeld();

    // ==================== Hostile Target Picker State ====================
    const [hostileAction, setHostileAction] = useState(null);
    const [showTargetPicker, setShowTargetPicker] = useState(false);

    const {
        actingAsId,
        actingAsSymbol,
        activeEntityNum,
        controlledCompanies,
        isActiveEntityETF,
        isActingAsBank,
    } = props;

    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);

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
            <${DropdownMenu}
                label="Corporate"
                icon="🏢"
                items=${corporateItems}
                color="blue"
                hotkeyChar="c"
                shiftHeld=${shiftHeld}
            />
            <div style="flex:1"><${CommandPrompt} /></div>
            <${DropdownMenu}
                label="Hostile"
                icon="⚔️"
                items=${hostileItems}
                color="red"
                hotkeyChar="h"
                shiftHeld=${shiftHeld}
            />
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
