/**
 * OverviewPanel — Company Overview tab for IndustrialView
 *
 * Three subpanels:
 *   1. Company Identity  — name/symbol/price/market info
 *   2. Management Team   — CEO, management quality, ETF advisor
 *   3. Analyst Summary   — PE, yield, credit, analyst, cash flow metrics
 *
 * Plus a drill-down "View Full Research Report" button opening InfoModal.
 */
import { html, useState, useEffect, useMemo } from '../lib/preact.standalone.module.js';
import { formatCurrency } from './helpers.js';
import InfoModal from './InfoModal.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import * as api from '../api.js';

// ─── Rating helpers (aligned with DatabaseSearchView actual game values) ────────

const CREDIT_RATING_LABELS = ['NR', 'D', 'C', 'CC', 'CCC', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA'];

function getCreditLabel(r) {
    return CREDIT_RATING_LABELS[r] ?? '—';
}
function getCreditColor(r) {
    if (r == null) return 'neutral';
    if (r <= 4) return 'red';    // NR/D/C/CC/CCC
    if (r <= 6) return 'yellow'; // B/BB
    return 'green';              // BBB/A/AA/AAA
}

const ANALYST_LABELS = [null, 'Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'];

function getAnalystLabel(r) {
    return ANALYST_LABELS[r] ?? '—';
}
function getAnalystColor(r) {
    if (!r) return 'neutral';
    if (r <= 2) return 'green';
    if (r === 3) return 'yellow';
    return 'red';
}

// Cash flow encoding from game: 1=Positive, 2=Before Debt Service, -1=Negative
function getCashFlowLabel(cf) {
    if (cf === 1) return 'Positive';
    if (cf === 2) return 'Before Debt';
    if (cf === -1) return 'Negative';
    return '—';
}
function getCashFlowColor(cf) {
    if (cf === 1) return 'green';
    if (cf === 2) return 'yellow';
    if (cf === -1) return 'red';
    return 'neutral';
}

// Management rating (continuous scale, not 1-5)
function getMgmtLabel(r) {
    if (r == null) return 'N/A';
    if (r > 8) return 'Excellent';
    if (r >= 0) return 'Competent';
    if (r >= -6) return 'Mediocre';
    if (r >= -10) return 'Poor';
    return 'Failing';
}
function getMgmtColor(r) {
    if (r == null) return 'neutral';
    if (r > 8) return 'green';
    if (r >= 0) return 'yellow';
    return 'red';
}

// ─── Metric card ────────────────────────────────────────────────────────────────

// Match game palette: --color-positive / --color-warning / --color-negative
const DOT_COLORS = {
    green:   'var(--color-positive)',
    yellow:  'var(--color-warning)',
    red:     'var(--color-negative)',
    neutral: 'var(--fg-muted)',
};
const TEXT_COLORS = {
    green:   'color:var(--color-positive)',
    yellow:  'color:var(--color-warning)',
    red:     'color:var(--color-negative)',
    neutral: '',   // inherits --color-warning from .overview-metric-value
};

function MetricCard({ label, value, color = 'neutral' }) {
    const dot  = DOT_COLORS[color]  || DOT_COLORS.neutral;
    const text = TEXT_COLORS[color] || '';
    return html`
        <div class="overview-metric-card">
            <div class="overview-metric-label">${label}</div>
            <div class="overview-metric-value" style="${text}">
                <span class="overview-metric-dot" style="background:${dot}"></span>
                ${value}
            </div>
        </div>
    `;
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function OverviewPanel() {

    // ── Game state ─────────────────────────────────────────
    const activeEntityNum     = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeEntityName    = api.useGameStore(s => s.gameState.activeEntityName);
    const activeEntitySymbol  = api.useGameStore(s => s.gameState.activeEntitySymbol);
    const activeIndustryId    = api.useGameStore(s => s.gameState.activeIndustryId);
    const dlrSign             = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro                = api.useGameStore(s => s.gameState.euro)    || '';
    const nextEarningsDate    = api.useGameStore(s => s.gameState.nextEarningsDate);
    const researchReport      = api.useGameStore(s => s.gameState.researchReport);
    const chairedCompanyId    = api.useGameStore(s => s.gameState.chairedCompanyId);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];
    const allCompanies        = api.useGameStore(s => s.gameState.allCompanies)        || [];
    const allIndustries       = api.useGameStore(s => s.gameState.allIndustries)       || [];
    const playerName          = api.useGameStore(s => s.gameState.playerName) || 'Player';
    const actingAsId          = api.useGameStore(s => s.gameState.actingAsId);

    const buttonProps = useActionButtonProps();

    // ── Derived ────────────────────────────────────────────
    const isActiveEntityETF    = activeIndustryId === api.ETF_IND;
    const playerControlsActive = api.isPlayerControlled(controlledCompanies, activeEntityNum);
    const playerIsCEO          = api.isPlayerCEO(chairedCompanyId, activeEntityNum);

    const company = useMemo(
        () => allCompanies.find(c => c.id === activeEntityNum),
        [allCompanies, activeEntityNum]
    );

    const advisorCompany = useMemo(
        () => (company?.advisorId > 0 ? allCompanies.find(c => c.id === company.advisorId) : null),
        [allCompanies, company]
    );

    const industryName = useMemo(
        () => allIndustries.find(i => i.id === activeIndustryId)?.name || '—',
        [allIndustries, activeIndustryId]
    );

    // Acting-as entity is the ETF's advisor (for Set Advisory Fee visibility)
    const isActingAsAdvisor = isActiveEntityETF && actingAsId > 10 && actingAsId === company?.advisorId;

    // ── Database metrics (PE, yield, book value, ratings) ──
    const [dbEntry, setDbEntry] = useState(null);

    useEffect(() => {
        let cancelled = false;
        if (!activeEntityNum) return;
        api.getDatabaseData()
            .then(res => {
                if (cancelled) return;
                const entries = res?.entries || [];
                setDbEntry(entries.find(e => e.id === activeEntityNum) || null);
            })
            .catch(() => { if (!cancelled) setDbEntry(null); });
        return () => { cancelled = true; };
    }, [activeEntityNum]);

    // ── Modal ──────────────────────────────────────────────
    const [showResearchModal, setShowResearchModal] = useState(false);

    // InfoModal expects a string; join array lines with the '\r' delimiter it uses internally
    const reportText = useMemo(
        () => Array.isArray(researchReport) ? researchReport.join('\r') : (researchReport || ''),
        [researchReport]
    );

    // ── Formatters ─────────────────────────────────────────
    const fmtPrice = (v) =>
        v != null ? `${dlrSign}${formatCurrency(v)}${euro}` : '—';

    const fmtMillions = (v) => {
        const n = parseFloat(v);
        if (v == null || isNaN(n)) return '—';
        if (n >= 1000)
            return `${dlrSign}${(n / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} billion${euro}`;
        return `${dlrSign}${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} million${euro}`;
    };

    const sharesLabel = (v) => {
        if (v == null) return '—';
        return `${(v / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} million`;
    };

    // ── Render ─────────────────────────────────────────────
    return html`
    <div class="overview-panel">

        <!-- ══════════════════════════════════════════════
             SUBPANEL 1: Company Identity
             ══════════════════════════════════════════════ -->
        <div class="panel" style="height:auto;">
            <div class="panel-header">Company Identity</div>
            <div class="overview-identity-grid">

                <div class="overview-field">
                    <span class="overview-label">Name</span>
                    <span class="overview-value">
                        ${activeEntityName || '—'}
                        ${(playerControlsActive && !isActiveEntityETF) ? html`
                            <button
                                class="overview-pencil-btn"
                                onClick=${buttonProps.rebrand.disabled
                                    ? (buttonProps.rebrand.onDisabledClick || undefined)
                                    : buttonProps.rebrand.onClick}
                                disabled=${buttonProps.rebrand.disabled && !buttonProps.rebrand.onDisabledClick}
                                title=${buttonProps.rebrand.disabled
                                    ? (buttonProps.rebrand.disabledMessage || 'Rename Company')
                                    : 'Rename Company'}
                                aria-label="Rename Company"
                            >✎</button>
                        ` : ''}
                    </span>
                </div>

                <div class="overview-field">
                    <span class="overview-label">Symbol</span>
                    <span class="overview-value overview-mono">${activeEntitySymbol || '—'}</span>
                </div>

                <div class="overview-field">
                    <span class="overview-label">Stock Price</span>
                    <span class="overview-value overview-mono">
                        ${company?.price != null ? fmtPrice(company.price) : '—'}
                    </span>
                </div>

                <!-- TODO: Bridge stockPriceHighs / stockPriceLows arrays from PB to gameState for 52-week range -->
                <div class="overview-field">
                    <span class="overview-label">52-Week High / Low</span>
                    <span class="overview-value overview-mono overview-placeholder">—</span>
                </div>

                <div class="overview-field">
                    <span class="overview-label">Market Cap</span>
                    <span class="overview-value overview-mono">
                        ${company?.marketCap != null ? fmtMillions(company.marketCap) : '—'}
                    </span>
                </div>

                <div class="overview-field">
                    <span class="overview-label">Shares Outstanding</span>
                    <span class="overview-value overview-mono">
                        ${company?.outstandingShares != null ? sharesLabel(company.outstandingShares) : '—'}
                    </span>
                </div>

                <div class="overview-field">
                    <span class="overview-label">Industry</span>
                    <span class="overview-value">
                        <button
                            class="overview-industry-link"
                            onClick=${() => api.viewIndustry(activeIndustryId)}
                            title="View industry"
                        >${industryName}</button>
                    </span>
                </div>

                <!-- TODO: Bridge NationNum / country-of-incorporation field from PB globals to gameState -->
                <div class="overview-field">
                    <span class="overview-label">Country</span>
                    <span class="overview-value overview-placeholder">—</span>
                </div>

                <div class="overview-field">
                    <!-- TODO: Bridge controlledBy[] array to identify AI-player owners; currently only human-player ownership is known -->
                    <span class="overview-label">Controlled By</span>
                    <span class="overview-value">
                        ${playerControlsActive ? playerName : '—'}
                    </span>
                </div>

                <div class="overview-field">
                    <span class="overview-label">Next Earnings</span>
                    <span class="overview-value">${nextEarningsDate || '—'}</span>
                </div>

            </div>
        </div>

        <!-- ══════════════════════════════════════════════
             SUBPANEL 2: Management Team
             ══════════════════════════════════════════════ -->
        <div class="panel" style="height:auto;">
            <div class="panel-header">Management Team</div>
            <div class="flex flex-col gap-3">

                <div class="overview-mgmt-row">
                    <div class="overview-field" style="flex:1">
                        <!-- TODO: Bridge chair[] PB array to gameState so AI-player CEO names can be shown -->
                        <span class="overview-label">CEO</span>
                        <span class="overview-value">
                            ${playerIsCEO ? 'You' : '—'}
                        </span>
                    </div>
                    ${(playerControlsActive && !isActiveEntityETF) ? html`
                        <${DisabledTooltipButton}
                            ...${buttonProps.electResignCeo}
                            buttonClass=""
                        />
                    ` : ''}
                </div>

                <div class="overview-mgmt-row">
                    <div class="overview-field" style="flex:1">
                        <span class="overview-label">Management Quality</span>
                        <span class="overview-value">
                            ${dbEntry != null ? getMgmtLabel(dbEntry.mgmtRating) : 'N/A'}
                        </span>
                    </div>
                    ${(playerControlsActive && !isActiveEntityETF) ? html`
                        <${DisabledTooltipButton}
                            ...${buttonProps.changeManagers}
                            buttonClass=""
                        />
                    ` : ''}
                </div>

                ${isActiveEntityETF ? html`
                    <!-- ETF Advisor section -->
                    <div class="overview-mgmt-row">
                        <div class="overview-field" style="flex:1">
                            <span class="overview-label">Investment Advisor</span>
                            <span class="overview-value">
                                ${advisorCompany?.name || '—'}
                            </span>
                        </div>
                        <!-- Become ETF Advisor: insurance/broker companies with ID > 10 only -->
                        <${DisabledTooltipButton}
                            ...${buttonProps.becomeEtfAdvisor}
                            buttonClass=""
                        />
                        <!-- Set Advisory Fee: only when acting as the current advisor -->
                        ${isActingAsAdvisor ? html`
                            <${DisabledTooltipButton}
                                ...${buttonProps.setAdvisoryFee}
                                buttonClass=""
                            />
                        ` : ''}
                    </div>
                ` : ''}

            </div>
        </div>

        <!-- ══════════════════════════════════════════════
             SUBPANEL 3: Analyst Summary
             ══════════════════════════════════════════════ -->
        <!-- TODO: Bridge EPro (projected EPS) from PB global for "Analyst EPS Estimate" metric -->
        <!-- TODO: Bridge GROW% from PB global for "Growth Rate" metric -->
        <!-- TODO: Bridge RD% from PB global for "R&D/Ad Spend" metric -->
        <!-- TODO: Bridge PL1-PL4 from PB globals for "Earnings Trend" sparkline -->
        <!-- TODO: Add analyst commentary lines as structured data from backend -->
        <div class="panel" style="height:auto;">
            <div class="panel-header">Analyst Summary</div>
            <div class="overview-metrics-grid">

                <${MetricCard}
                    label="P/E Ratio"
                    value=${dbEntry != null
                        ? (dbEntry.pe > 0 ? dbEntry.pe.toFixed(1) : 'NMF')
                        : '—'}
                    color="neutral"
                />

                <${MetricCard}
                    label="Dividend Yield"
                    value=${dbEntry?.divYield > 0 ? `${dbEntry.divYield.toFixed(2)}%` : '—'}
                    color="neutral"
                />

                <${MetricCard}
                    label="Book Value"
                    value=${dbEntry?.bookValue > 0 ? fmtMillions(dbEntry.bookValue) : '—'}
                    color="neutral"
                />

                <${MetricCard}
                    label="Credit Rating"
                    value=${dbEntry != null
                        ? `${getCreditLabel(dbEntry.credRating)} (${dbEntry.credRating ?? 0})`
                        : '—'}
                    color=${dbEntry != null ? getCreditColor(dbEntry.credRating) : 'neutral'}
                />

                <${MetricCard}
                    label="Analyst Rating"
                    value=${dbEntry != null ? getAnalystLabel(dbEntry.analystRating) : '—'}
                    color=${dbEntry != null ? getAnalystColor(dbEntry.analystRating) : 'neutral'}
                />

                <${MetricCard}
                    label="Cash Flow"
                    value=${dbEntry != null ? getCashFlowLabel(dbEntry.cashFlow) : '—'}
                    color=${dbEntry != null ? getCashFlowColor(dbEntry.cashFlow) : 'neutral'}
                />

                <${MetricCard}
                    label="Management"
                    value=${dbEntry != null ? getMgmtLabel(dbEntry.mgmtRating) : 'N/A'}
                    color=${dbEntry != null ? getMgmtColor(dbEntry.mgmtRating) : 'neutral'}
                />

            </div>
        </div>

        <!-- ══════════════════════════════════════════════
             DRILL-DOWN: Full Research Report
             ══════════════════════════════════════════════ -->
        <div class="flex justify-center pb-2">
            <button class="btn blue" onClick=${() => setShowResearchModal(true)}>
                View Full Research Report
            </button>
        </div>

        <${InfoModal}
            show=${showResearchModal}
            title=${`${activeEntityName || ''} — Research Report`}
            text=${reportText}
            onClose=${() => setShowResearchModal(false)}
        />

    </div>
    `;
}
