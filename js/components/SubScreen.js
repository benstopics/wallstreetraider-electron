import { html } from '../lib/preact.standalone.module.js';

/**
 * SubScreen — local-state drilldown wrapper.
 *
 * Renders a panel-header with a ← Back button and optional title, then
 * children fill the remaining space. Use this for in-component drilldowns
 * where local state controls visibility (FinancialsTab, OverviewPanel,
 * IndustryView industry detail, etc.).
 *
 * Do NOT use this for full-page views that navigate away (IndustryView's
 * main back button, DatabaseSearchView's back button).
 */
export function SubScreen({ title, onBack, children }) {
    return html`
    <div class="flex flex-col w-full h-full min-h-0">
        <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
            <button class="btn" style="padding:1px 8px; font-size:var(--font-size-sm);" onClick=${onBack}>← Back</button>
            ${title && html`<span>${title}</span>`}
        </div>
        ${children}
    </div>`;
}

export default SubScreen;
