/**
 * CompanyResearch — Full-screen Layer 1 company view (Req 2.4 / 2.6 / 2.12)
 *
 * Renders the full IndustrialView content (without ActionBar) plus:
 *   • Company header with name/ticker/price and "Manage Company" button (if controlled)
 *   • Hostile Actions section (only for non-controlled targets — eliminates "Cannot merge with itself")
 *
 * Hostile actions eligibility per req 2.4:
 *   Merger/LBO:      actingCompany ID > 10, not ETF, not same company
 *   Antitrust:       same industry as target, acting company ID > 10, not ETF
 *   Harassing/Rumors: acting company is a company (not ETF)
 *   Greenmail:       acting company ID > 10, not ETF
 */
import { html, useState, useCallback, useMemo } from '../lib/preact.standalone.module.js';
import IndustrialView from './IndustrialView.js';
import EntityPicker from './EntityPicker.js';
import Breadcrumb from './Breadcrumb.js';
import Button from './Button.js';
import { insertCurrencySymbols, formatCurrency } from './helpers.js';
import * as api from '../api.js';

// ── Hostile Actions section ───────────────────────────────────────────────────
function HostileActionsSection({ targetId }) {
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];
    const playerId            = api.useGameStore(s => s.gameState.playerId) || api.HUMAN1_ID;
    const allCompanies        = api.useGameStore(s => s.gameState.allCompanies) || [];

    const targetCompany = useMemo(() => allCompanies.find(c => c.id === targetId), [allCompanies, targetId]);
    const targetIndustryId = targetCompany?.industryId ?? null;

    // Build set of acting entities (player + controlled companies)
    const actingEntities = useMemo(() => {
        const playerEntity = { id: playerId, name: 'Player', symbol: null, isPlayer: true, industryId: null };
        const corps = controlledCompanies.map(c => ({ ...c, isPlayer: false, ...(allCompanies.find(x => x.id === c.id) || {}) }));
        return [playerEntity, ...corps];
    }, [playerId, controlledCompanies, allCompanies]);

    const isETF = (entity) => entity.industryId === api.ETF_IND;
    const isCompany = (entity) => !entity.isPlayer && entity.id > 10;

    // Eligibility per action
    const eligible = useMemo(() => ({
        merger:    actingEntities.filter(e => isCompany(e) && !isETF(e) && e.id !== targetId),
        lbo:       actingEntities.filter(e => isCompany(e) && !isETF(e) && e.id !== targetId),
        antitrust: actingEntities.filter(e => isCompany(e) && !isETF(e) && e.industryId === targetIndustryId),
        harassing: actingEntities.filter(e => isCompany(e) && !isETF(e)),
        rumors:    actingEntities.filter(e => isCompany(e) && !isETF(e)),
        greenmail: actingEntities.filter(e => isCompany(e) && !isETF(e)),
    }), [actingEntities, targetId, targetIndustryId]);

    const [pickerAction, setPickerAction] = useState(null);

    const openAction = useCallback((action) => {
        const eligibleList = eligible[action] || [];
        if (eligibleList.length === 0) return;
        if (eligibleList.length === 1) {
            // Only one eligible entity — act directly
            executeAction(action, eligibleList[0].id);
        } else {
            setPickerAction(action);
        }
    }, [eligible]);

    const executeAction = (action, actingEntityId) => {
        api.changeActingAs(actingEntityId);
        setTimeout(() => {
            if (action === 'merger')    api.merger(targetId);
            else if (action === 'lbo')  api.lbo(targetId);
            else if (action === 'antitrust') api.antitrustLawsuit(targetId);
            else if (action === 'harassing') api.harrassingLawsuit(targetId);
            else if (action === 'rumors')    api.spreadRumors(targetId);
            else if (action === 'greenmail') api.greenmail(targetId);
        }, 100);
    };

    const handlePickerSelect = (entityId) => {
        const action = pickerAction;
        setPickerAction(null);
        if (!entityId) return;
        executeAction(action, entityId);
    };

    const ACTION_DEFS = [
        { key: 'merger',    label: 'Merger',            color: 'red' },
        { key: 'lbo',       label: 'Leveraged Buyout',  color: 'red' },
        { key: 'antitrust', label: 'Antitrust Lawsuit', color: 'red' },
        { key: 'harassing', label: 'Harassing Lawsuit', color: 'red' },
        { key: 'rumors',    label: 'Spread Rumors',     color: 'red' },
        { key: 'greenmail', label: 'Greenmail',         color: 'red' },
    ];

    // Only render if at least one action has eligible entities
    const anyEligible = ACTION_DEFS.some(a => (eligible[a.key] || []).length > 0);
    if (!anyEligible) return null;

    const pickerEligibility = pickerAction ? ((e) => (eligible[pickerAction] || []).some(x => x.id === e.id)) : null;

    return html`
        <div class="panel flex-shrink-0" style="margin-top:8px;">
            <div class="panel-header" style="color:#ef4444;">Hostile Actions</div>
            <div class="p-2 panel-body flex flex-row flex-wrap gap-2">
                ${ACTION_DEFS.map(a => {
                    const list = eligible[a.key] || [];
                    if (list.length === 0) return null;
                    const entityHint = list.length === 1
                        ? ` via ${list[0].symbol || list[0].name}`
                        : ` (${list.length} entities)`;
                    return html`
                        <${Button} key=${a.key} class="btn red text-xs" onClick=${() => openAction(a.key)}>
                            ${a.label}${entityHint}
                        <//>
                    `;
                })}
            </div>
        </div>

        <${EntityPicker}
            show=${pickerAction !== null}
            actionLabel=${pickerAction ? `Select acting entity for ${ACTION_DEFS.find(a=>a.key===pickerAction)?.label || ''}` : ''}
            eligibility=${pickerEligibility}
            onSelect=${handlePickerSelect}
            onCancel=${() => setPickerAction(null)}
        />
    `;
}

// ── CompanyResearch main component ────────────────────────────────────────────
export default function CompanyResearch() {
    const activeEntityNum     = api.useGameStore(s => s.gameState.activeEntityNum);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];
    const allCompanies        = api.useGameStore(s => s.gameState.allCompanies) || [];
    const dlrSign             = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro                = api.useGameStore(s => s.gameState.euro) || '';

    const company = useMemo(() => allCompanies.find(c => c.id === activeEntityNum), [allCompanies, activeEntityNum]);
    const isControlled = useMemo(() => controlledCompanies.some(c => c.id === activeEntityNum), [controlledCompanies, activeEntityNum]);

    const priceStr = company?.price != null ? `${dlrSign}${formatCurrency(company.price)}${euro}` : '—';

    return html`
        <div class="flex flex-col h-full min-h-0">
            <!-- Breadcrumb navigation -->
            <${Breadcrumb} />

            <!-- Company header -->
            <div class="flex flex-row items-center gap-3 flex-shrink-0"
                style="padding:6px 10px; background:rgba(255,255,255,0.05); border-radius:4px; margin-bottom:4px; flex-wrap:wrap;">
                <span style="font-weight:700; font-size:14px;">${company?.name || '—'}</span>
                ${company?.symbol ? html`<span class="panel" style="padding:1px 6px; font-size:12px;">${company.symbol}</span>` : ''}
                <span style="font-size:12px; opacity:0.7;">${company?.industryName || ''}</span>
                <span style="font-size:13px; font-weight:600;">${priceStr}</span>
                <div style="flex:1;"></div>
                ${isControlled ? html`
                    <${Button} class="btn blue text-xs" onClick=${() => api.navigateTo('company-management', activeEntityNum)}>
                        Manage Company →
                    <//>
                ` : ''}
            </div>

            <div class="flex-1 min-h-0 overflow-hidden">
                <${IndustrialView} />
            </div>

            <!-- Hostile Actions (req 2.4 / 2.12 — only for non-controlled targets) -->
            ${!isControlled ? html`<${HostileActionsSection} targetId=${activeEntityNum} />` : ''}
        </div>
    `;
}
