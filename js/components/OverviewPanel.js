/**
 * OverviewPanel — Company Overview tab for IndustrialView
 *
 * Three subpanels:
 *   1. Company Identity  — name header + 3×3 metric grid
 *   2. Leadership        — 2-column metric grid + action buttons
 *   3. Analyst Summary   — 2-column metric grid with color dots
 *
 * Plus a "View Full Report" button that triggers the game's native research report modal via /open_research_report.
 *
 * Styling: uses .panel/.panel-header/.panel-body from panels.css + inline styles
 * per app-style-guide.md. No custom CSS file.
 */
import { html, useState } from '../lib/preact.standalone.module.js';
import { formatCurrency, renderLines } from './helpers.js';
import SubScreen from './SubScreen.js';
import {
    GRID_3_S, GRID_2_S,
    CELL_S, CELL_LABEL_S, CELL_NUM_S, CELL_TXT_S, CELL_MUT_S,
    MetricCard,
    getCreditLabel, getCreditColor,
    getAnalystLabel, getAnalystColor,
    getCashFlowLabel, getCashFlowColor,
    getMgmtLabel, getMgmtColor,
} from './panelStyles.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import AssetPriceChart from './AssetPriceChart.js';
import AdvisorySummary from './AdvisorySummary.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import * as api from '../api.js';

// ─── Main component ─────────────────────────────────────────────────────────────

export default function OverviewPanel() {

    // ── Game state ─────────────────────────────────────────
    const activeEntityNum  = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeEntityData = api.useGameStore(s => s.gameState.activeEntityData) || {};
    const researchReport   = api.useGameStore(s => s.gameState.researchReport)   || [];
    const dlrSign          = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro             = api.useGameStore(s => s.gameState.euro)    || '';
    const playerName       = api.useGameStore(s => s.gameState.playerName) || 'Player';
    const actingAsId       = api.useGameStore(s => s.gameState.actingAsId);
    const hyperlinkRegex   = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const allCompanies     = api.useGameStore(s => s.gameState.allCompanies) || [];
    const allPlayers       = api.useGameStore(s => s.gameState.allPlayers)   || [];

    const [showReport, setShowReport] = useState(false);

    const buttonProps = useActionButtonProps();

    // ── Destructure activeEntityData ───────────────────────
    const aef = api.useGameStore(s => s.gameState.activeEntityFinancials) || {};

    const {
        name:               activeEntityName,
        symbol:             activeEntitySymbol,
        industryId:         activeIndustryId,
        industryName,
        price,
        marketCap,
        outstandingShares,
        nextEarningsDate,
        advisorId,
        advisorName,
        isPlayerControlled: playerControlsActive,
        isPlayerCEO:        playerIsCEO,
        pe,
        divYield,
        bookValue,
        credRating,
        analystRating,
        mgmtRating,
        cashFlow,
        stockPrice52WkHigh,
        stockPrice52WkLow,
        controlledById,
        country,
        bondDesc = '',
        bondPrice = 0,
    } = activeEntityData;

    // ── Derived ────────────────────────────────────────────
    const isActiveEntityETF = activeIndustryId === api.ETF_IND;
    const isActingAsAdvisor = isActiveEntityETF && actingAsId > 10 && actingAsId === advisorId;
    const advisedFund = !isActiveEntityETF
        ? allCompanies.find(c => c.industryId === api.ETF_IND && c.advisorId === activeEntityNum)
        : null;

    // ── Bond parsing ───────────────────────────────────────
    // jBondDesc format: "YYYY@cc.cc" (straight) or "YYYYcv|CVP|@cc.cc" (convertible)
    const hasBonds = bondDesc !== '' && bondPrice > 0;
    const bondIsConvertible = hasBonds && bondDesc.includes('cv');
    let bondCoupon = 0, bondMaturity = '', bondCvp = 0;
    if (hasBonds) {
        if (bondIsConvertible) {
            bondMaturity = bondDesc.substring(0, 4);
            const afterCv = bondDesc.split('cv|')[1] || '';
            const cvParts = afterCv.split('|@');
            bondCvp = parseFloat(cvParts[0]) || 0;
            bondCoupon = parseFloat(cvParts[1]) || 0;
        } else {
            const parts = bondDesc.split('@');
            bondMaturity = parts[0];
            bondCoupon = parseFloat(parts[1]) || 0;
        }
    }
    // Conversion premium for convertible bonds (premium over par)
    const bondPremium = (bondIsConvertible && bondPrice > 0)
        ? (bondPrice - 100).toFixed(1)
        : null;

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
        // Bridge value = PMult * 1M; actual shares = PMult * 100M, so multiply by 100
        return `${(v * 100 / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
    };

    // ── Render ─────────────────────────────────────────────

    if (showReport) return html`
        <${SubScreen} title="Research Report — ${activeEntityName || '—'}" onBack=${() => setShowReport(false)}>
            <div class="flex flex-col items-center overflow-y-auto" style="flex:1; min-height:0; padding:8px 10px;">
                ${renderLines(researchReport, ({ id }) => api.setViewAsset(parseInt(id)), null, hyperlinkRegex)}
            </div>
        <//>
    `;

    return html`
    <div class="flex flex-col w-full h-full min-h-0 overflow-y-auto" style="padding:6px;">

        <!-- ══════════════════════════════════════════════
             SPLIT LAYOUT: Company Info left | Management+Analyst right
             ══════════════════════════════════════════════ -->
        <div style="display:flex; gap:6px; align-items:stretch; flex:1; min-height:0;">

        <!-- LEFT: Chart (top) + Company Info (bottom) -->
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:6px;">

        <!-- Stock Price Chart -->
        <div class="panel" style="flex:1; min-height:140px;">
            <div class="panel-header">Stock Price History</div>
            <div class="panel-body flex flex-col w-full" style="padding:0;">
                <${AssetPriceChart}
                    assetId=${activeEntityNum}
                    chartTitle="${activeEntitySymbol} Stock Price"
                />
            </div>
        </div>

        <div class="panel" style="flex:1; min-height:0; display:flex; flex-direction:column;">
            <div class="panel-header">Company Information</div>
            <div class="panel-body">

                <!-- Company name header — above the grid, not inside it -->
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                    <span style="font-size:var(--font-size-md); color:var(--fg-primary); font-weight:700;">
                        ${activeEntityName || '—'}
                    </span>
                    ${activeEntitySymbol ? html`
                        <span style="font-size:var(--font-size-sm); color:var(--fg-muted);">(${activeEntitySymbol})</span>
                    ` : ''}
                    ${(playerControlsActive && !isActiveEntityETF) ? html`
                        <${DisabledTooltipButton}
                            ...${buttonProps.rebrand}
                            label="✎ Rebrand"
                            buttonClass=""
                        />
                    ` : ''}
                </div>

                <!-- 2-column dense metric grid -->
                <div style="${GRID_2_S}">

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Stock Price</div>
                        <div style="${CELL_NUM_S}">
                            ${price != null ? fmtPrice(price) : '—'}
                        </div>
                    </div>

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">52-Wk High / Low</div>
                        <div style="${CELL_NUM_S}">
                            ${stockPrice52WkHigh > 0 && stockPrice52WkLow > 0
                                ? `${fmtPrice(stockPrice52WkHigh)} / ${fmtPrice(stockPrice52WkLow)}`
                                : '—'}
                        </div>
                    </div>

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Market Cap</div>
                        <div style="${CELL_NUM_S}">
                            ${marketCap != null ? fmtMillions(marketCap) : '—'}
                        </div>
                    </div>

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Shares Out.</div>
                        <div style="${CELL_NUM_S}">
                            ${outstandingShares != null ? sharesLabel(outstandingShares) : '—'}
                        </div>
                    </div>

                    ${playerControlsActive && !isActiveEntityETF ? html`
                        <div style="grid-column:1/-1; display:flex; gap:6px; flex-wrap:wrap; padding:4px 0;">
                            <${DisabledTooltipButton}
                                ...${buttonProps.publicStockOffering}
                                onClick=${() => api.publicStockOffering(activeEntityNum)}
                                buttonClass=""
                            />
                            <${DisabledTooltipButton}
                                ...${buttonProps.privateStockOffering}
                                onClick=${() => api.privateStockOffering(activeEntityNum)}
                                buttonClass=""
                            />
                        </div>
                    ` : ''}

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Industry</div>
                        <div>
                            <span
                                class="hover:underline"
                                style="font-size:var(--font-size-sm); color:#60a5fa; cursor:pointer;"
                                onClick=${() => api.viewIndustry(activeIndustryId)}
                                title="View industry"
                            >${industryName}</span>
                        </div>
                    </div>

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Country</div>
                        <div style="${CELL_TXT_S}">${country || '—'}</div>
                    </div>

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Controlled By</div>
                        <div style="${CELL_TXT_S}">
                            ${(() => {
                                if (playerControlsActive) {
                                    return html`<span
                                        class="hover:underline"
                                        style="color:#60a5fa; cursor:pointer;"
                                        title="Navigate to ${playerName}"
                                        onClick=${() => api.setViewAsset(api.HUMAN1_ID)}
                                    >${playerName}</span>`;
                                }
                                const cid = controlledById;
                                if (!cid || cid === activeEntityNum) {
                                    return 'Independent';
                                }
                                if (cid >= 1 && cid <= 10) {
                                    const aiPlayer = allPlayers.find(p => p.id === cid);
                                    return aiPlayer?.name || 'AI Player';
                                }
                                // cid > 10: another corporation owns this entity
                                const parent = allCompanies.find(c => c.id === cid);
                                const parentName = parent?.name || `Corp #${cid}`;
                                return html`<span
                                    class="hover:underline"
                                    style="color:#60a5fa; cursor:pointer;"
                                    title="Navigate to ${parentName}"
                                    onClick=${() => api.setViewAsset(cid)}
                                >Subs. of ${parentName}</span>`;
                            })()}
                        </div>
                    </div>

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Next Earnings</div>
                        <div style="${CELL_TXT_S}">${nextEarningsDate || '—'}</div>
                    </div>

                </div>
            </div>
        </div>

        </div>
        <!-- END LEFT -->

        <!-- RIGHT: Management Team + Analyst Summary stacked -->
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:6px;">

        <!-- ══════════════════════════════════════════════
             Leadership
             ══════════════════════════════════════════════ -->
        <div class="panel" style="height:auto;">
            <div class="panel-header">Leadership</div>
            <div class="panel-body">

                ${isActiveEntityETF ? html`
                    <!-- ETF: Investment Advisor cell (full-width single column) -->
                    <!-- TODO: Bridge chair[] PB array so AI-player CEO names can be shown -->
                    <div style="display:grid; grid-template-columns:1fr; gap:1px; background:var(--border-color); border-radius:6px; overflow:hidden; margin-bottom:8px;">
                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Investment Advisor</div>
                            <div style="${CELL_TXT_S}">
                                ${advisorId && advisorName ? html`
                                    <span class="hover:underline" style="color:#60a5fa; cursor:pointer;"
                                        onClick=${() => api.setViewAsset(advisorId)} title="Navigate to ${advisorName}">${advisorName}</span>
                                ` : (advisorName || '—')}
                            </div>
                        </div>
                    </div>
                    <!-- ETF action buttons -->
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <${DisabledTooltipButton} ...${buttonProps.becomeEtfAdvisor} buttonClass="" />
                        ${isActingAsAdvisor ? html`
                            <${DisabledTooltipButton} ...${buttonProps.setAdvisoryFee} buttonClass="" />
                        ` : ''}
                    </div>
                ` : html`
                    <!-- Non-ETF: CEO | Management Quality grid (+ Fund Advisor For if applicable) -->
                    <!-- TODO: Bridge chair[] PB array so AI-player CEO names can be shown -->
                    <div style="${advisedFund ? GRID_3_S : GRID_2_S} margin-bottom:${playerControlsActive ? '8px' : '0'};">
                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">CEO</div>
                            <div style="${CELL_TXT_S}">${playerIsCEO ? 'You' : '—'}</div>
                        </div>
                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Reputation</div>
                            <div style="${CELL_TXT_S}">
                                ${mgmtRating != null ? getMgmtLabel(mgmtRating) : 'N/A'}
                            </div>
                        </div>
                        ${advisedFund ? html`
                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Fund Advisor For</div>
                            <div style="${CELL_TXT_S}">
                                <span class="hover:underline" style="color:#60a5fa; cursor:pointer;"
                                    onClick=${() => api.setViewAsset(advisedFund.id)}
                                    title="Navigate to ${advisedFund.name}">${advisedFund.name}</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    <!-- Action buttons below grid (only when player controls this company) -->
                    ${playerControlsActive ? html`
                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
                            <${DisabledTooltipButton} ...${buttonProps.electResignCeo} buttonClass="" />
                            <${DisabledTooltipButton} ...${buttonProps.changeManagers}  buttonClass="" />
                        </div>
                    ` : ''}
                `}

            </div>
        </div>

        <!-- ══════════════════════════════════════════════
             Analyst Summary
             ══════════════════════════════════════════════ -->
        <!-- TODO: Bridge EPro (projected EPS) from PB global for "Analyst EPS Estimate" metric -->
        <!-- TODO: Bridge GROW% from PB global for "Growth Rate" metric -->
        <!-- TODO: Bridge RD% from PB global for "R&D/Ad Spend" metric -->
        <!-- TODO: Bridge PL1-PL4 from PB globals for "Earnings Trend" sparkline -->
        <div class="panel" style="height:auto; flex-shrink:0;">
            <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center;">
                <span>Analyst Summary</span>
                <button class="btn blue" style="padding:1px 8px; font-size:var(--font-size-sm);" onClick=${() => setShowReport(true)}>View Research Report</button>
            </div>
            <div class="panel-body" style="padding:0;">
                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border-color); border-radius:6px; overflow:hidden;">

                    <${MetricCard}
                        label="P/E Ratio"
                        value=${pe != null
                            ? (pe > 0 ? pe.toFixed(1) : 'NMF')
                            : '—'}
                        color="neutral"
                    />

                    <${MetricCard}
                        label="Dividend Yield"
                        value=${divYield > 0 ? `${divYield.toFixed(2)}%` : '—'}
                        color="neutral"
                    />

                    <${MetricCard}
                        label="Book Value/Share"
                        value=${bookValue > 0 ? fmtMillions(bookValue) : '—'}
                        color="neutral"
                    />

                    <${MetricCard}
                        label="Credit Rating"
                        value=${credRating != null ? getCreditLabel(credRating) : '—'}
                        color=${credRating != null ? getCreditColor(credRating) : 'neutral'}
                    />

                    <${MetricCard}
                        label="Analyst Rating"
                        value=${analystRating != null ? getAnalystLabel(analystRating) : '—'}
                        color=${analystRating != null ? getAnalystColor(analystRating) : 'neutral'}
                    />

                    <${MetricCard}
                        label="Cash Flow"
                        value=${cashFlow != null ? getCashFlowLabel(cashFlow) : '—'}
                        color=${cashFlow != null ? getCashFlowColor(cashFlow) : 'neutral'}
                    />

                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════════════
             Corporate Bonds (only when bonds are outstanding)
             ══════════════════════════════════════════════ -->
        <div class="panel" style="height:auto; flex-shrink:0;">
            <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center;">
                <span>Corporate Bonds</span>
                ${hasBonds
                    ? html`<${DisabledTooltipButton} ...${buttonProps.buyCorpBond} label="Buy Bonds" buttonClass="" />`
                    : ''}
            </div>
            <div class="panel-body" style="padding:0;">
                ${hasBonds ? html`
                    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border-color); border-radius:6px; overflow:hidden;">
                        <${MetricCard}
                            label="Type"
                            value=${bondIsConvertible ? 'Convertible' : 'Straight'}
                            color="neutral"
                        />
                        <${MetricCard}
                            label="Premium"
                            value=${bondPremium != null ? `${bondPremium}%` : '—'}
                            color="neutral"
                        />
                        <${MetricCard}
                            label="Outstanding"
                            value=${aef.bondsOut > 0 ? fmtMillions(aef.bondsOut) : '—'}
                            color="neutral"
                        />
                        <${MetricCard}
                            label="Price"
                            value=${bondPrice > 0 ? bondPrice.toFixed(2) : '—'}
                            color="neutral"
                        />
                    </div>
                ` : (playerControlsActive && !isActiveEntityETF) ? html`
                    <div style="padding:6px;">
                        <${DisabledTooltipButton} ...${buttonProps.issueCorpBonds} buttonClass="" />
                    </div>
                ` : ''}
            </div>
        </div>

        <!-- Advisory Summary — grows to fill remaining space in right column -->
        <div style="flex:1; min-height:0; overflow:hidden; border-radius:var(--radius-md);">
            <${AdvisorySummary} />
        </div>

        </div>
        <!-- END RIGHT -->

        </div>
        <!-- END SPLIT -->

    </div>
    `;
}
