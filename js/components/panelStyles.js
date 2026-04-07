/**
 * panelStyles.js — Shared style constants, MetricCard component, and rating helpers
 * for panel-based views (OverviewPanel, FinancialsTab, etc.).
 *
 * Follows app-style-guide.md: all styling via CSS variables + inline styles only.
 * No custom CSS file.
 */
import { html } from '../lib/preact.standalone.module.js';

// ─── Dense metric grid layouts ───────────────────────────────────────────────────

export const GRID_3_S = 'display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border-color); border-radius:6px; overflow:hidden;';
export const GRID_2_S = 'display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:var(--border-color); border-radius:6px; overflow:hidden;';

// ─── Grid cell styles ────────────────────────────────────────────────────────────

/** Standard grid cell container */
export const CELL_S       = 'padding:6px 10px; background:var(--bg-primary);';
/** Label row — muted, uppercase, small */
export const CELL_LABEL_S = 'font-size:var(--font-size-sm); color:var(--fg-muted); text-transform:uppercase; letter-spacing:0.4px; margin-bottom:2px;';
/** Financial number — warning yellow */
export const CELL_NUM_S   = 'font-size:var(--font-size-sm); color:var(--color-warning);';
/** Text value — primary colour */
export const CELL_TXT_S   = 'font-size:var(--font-size-sm); color:var(--fg-primary);';
/** Muted placeholder — for TODO / unavailable fields */
export const CELL_MUT_S   = 'font-size:var(--font-size-sm); color:var(--fg-muted);';

// ─── Dot/text colour maps (MetricCard) ──────────────────────────────────────────

export const DOT_COLORS = {
    green:   'var(--color-positive)',
    yellow:  'var(--color-warning)',
    red:     'var(--color-negative)',
    neutral: 'var(--fg-muted)',
};

export const METRIC_TEXT_COLORS = {
    green:   'var(--color-positive)',
    yellow:  'var(--color-warning)',
    red:     'var(--color-negative)',
    neutral: 'var(--color-warning)',
};

// ─── MetricCard ──────────────────────────────────────────────────────────────────

/** Grid cell with label + coloured dot + value — used in Analyst Summary etc.
 *  Pass onClick + title to render the value as a clickable hyperlink. */
export function MetricCard({ label, value, color = 'neutral', onClick, title }) {
    const dot       = DOT_COLORS[color]        || DOT_COLORS.neutral;
    const textColor = onClick ? '#60a5fa' : (METRIC_TEXT_COLORS[color] || 'var(--color-warning)');
    return html`
        <div style="display:flex; flex-direction:column; padding:7px 10px; background:var(--bg-primary); gap:3px;">
            <div style="font-size:var(--font-size-sm); color:var(--fg-muted); text-transform:uppercase; letter-spacing:0.4px;">
                ${label}
            </div>
            <div style="font-size:var(--font-size-sm); font-weight:600; display:flex; align-items:center; gap:5px; white-space:nowrap;">
                <span style="width:7px; height:7px; border-radius:50%; background:${dot}; flex-shrink:0; display:inline-block;"></span>
                ${onClick ? html`
                    <span class="hover:underline" style="color:${textColor}; cursor:pointer;" onClick=${onClick} title=${title}>${value}</span>
                ` : html`<span style="color:${textColor};">${value}</span>`}
            </div>
        </div>
    `;
}

// ─── Credit Rating helpers ───────────────────────────────────────────────────────

export const CREDIT_RATING_LABELS = ['NR', 'D', 'C', 'CC', 'CCC', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA'];

export function getCreditLabel(r) { return CREDIT_RATING_LABELS[r] ?? '—'; }

export function getCreditColor(r) {
    if (r == null) return 'neutral';
    if (r <= 4)    return 'red';    // NR/D/C/CC/CCC
    if (r <= 6)    return 'yellow'; // B/BB
    return 'green';                 // BBB/A/AA/AAA
}

// ─── Analyst Rating helpers ──────────────────────────────────────────────────────

export const ANALYST_LABELS = [null, 'Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'];

export function getAnalystLabel(r) { return ANALYST_LABELS[r] ?? '—'; }

export function getAnalystColor(r) {
    if (!r)       return 'neutral';
    if (r <= 2)   return 'green';
    if (r === 3)  return 'yellow';
    return 'red';
}

// ─── Cash Flow helpers ───────────────────────────────────────────────────────────

/** Cash flow encoding from game: CashFlowProj returns 1=Positive, 2-8=various negative severity */
export function getCashFlowLabel(cf) {
    if (cf === 1) return 'Positive';
    if (cf >= 2)  return 'Negative';
    return '—';
}

export function getCashFlowColor(cf) {
    if (cf === 1) return 'green';
    if (cf >= 2)  return 'red';
    return 'neutral';
}

// ─── Management Rating helpers ───────────────────────────────────────────────────

export function getMgmtLabel(r) {
    if (r == null)  return 'N/A';
    if (r > 8)      return 'Excellent';
    if (r >= 0)     return 'Competent';
    if (r >= -6)    return 'Mediocre';
    if (r >= -10)   return 'Poor';
    return 'Failing';
}

export function getMgmtColor(r) {
    if (r == null) return 'neutral';
    if (r > 8)     return 'green';
    if (r >= 0)    return 'yellow';
    return 'red';
}
