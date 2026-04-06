/**
 * Breadcrumb — Layer 1 navigation breadcrumb trail (Req 2.5)
 *
 * Reads uiNavStack from the store and renders a back button + breadcrumb trail.
 * Only visible when there is navigation history in the client-side stack.
 *
 * Examples:
 *   [← Back]  The Book > TechCo Research > MegaCorp Management
 */
import { html, useMemo } from '../lib/preact.standalone.module.js';
import Button from './Button.js';
import * as api from '../api.js';

function viewLabel(view, entityId, allCompanies) {
    const company = entityId ? (allCompanies || []).find(c => c.id === entityId) : null;
    const name = company?.name || (entityId ? `Company #${entityId}` : null);
    if (view === 'company-management') return name ? `${name} Management` : 'Management';
    if (view === 'company-research')   return name ? `${name} Research` : 'Research';
    if (view === 'the-book')           return 'The Book';
    if (view === 'default') {
        if (!entityId) return 'Market';
        return name || 'View';
    }
    return 'Back';
}

export default function Breadcrumb() {
    const uiNavStack      = api.useGameStore(s => s.uiNavStack) || [];
    const uiCurrentView   = api.useGameStore(s => s.uiCurrentView);
    const uiViewedEntityId = api.useGameStore(s => s.uiViewedEntityId);
    const allCompanies    = api.useGameStore(s => s.gameState.allCompanies) || [];
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);

    const hasStack = uiNavStack.length > 0;
    if (!hasStack) return null;

    const crumbs = useMemo(() => {
        const trail = uiNavStack.map((entry, i) => ({
            key: i,
            label: viewLabel(entry.view, entry.entityId, allCompanies),
        }));
        // Current view label
        const currentLabel = viewLabel(
            uiCurrentView,
            uiViewedEntityId || activeEntityNum,
            allCompanies
        );
        return { trail, currentLabel };
    }, [uiNavStack, uiCurrentView, uiViewedEntityId, activeEntityNum, allCompanies]);

    return html`
        <div style="display:flex;align-items:center;gap:4px;padding:3px 0;flex-shrink:0;flex-wrap:wrap;font-size:11px;opacity:0.8;">
            <${Button} class="btn text-xs" style="padding:1px 6px;" onClick=${() => api.navigateBack()}>
                ← Back
            <//>
            ${crumbs.trail.map((c, i) => html`
                <span key=${c.key} style="opacity:0.6;">${c.label}</span>
                <span style="opacity:0.4;">›</span>
            `)}
            <span style="opacity:1;font-weight:600;">${crumbs.currentLabel}</span>
        </div>
    `;
}
