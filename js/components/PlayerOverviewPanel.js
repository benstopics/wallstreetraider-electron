/**
 * PlayerOverviewPanel — Player Overview tab for PlayerView
 *
 * Mirrors IndustrialView's OverviewPanel dashboard pattern for the human
 * player. Consumes the Phase 1 typed struct `activeEntityPlayerFinancials`
 * (emitted in /gamestate via GameServer.h) plus existing Bucket 1 fields
 * (totalAssets, totalDebt, netWorth, playerName, chairedCompanyId,
 * activeEntityData.credRating, activeEntityFinancials.bankId).
 *
 * Layout (two-column flex row, 50/50):
 *   LEFT:
 *     - CapitalizationChart (Net Worth trend)
 *     - Personal Profile panel (GRID_2_S × 6 cells)
 *   RIGHT:
 *     - Net Worth panel (GRID_3_S × 3 MetricCards)
 *     - Borrowing panel (GRID_2_S × 4 cells)
 *     - AdvisorySummary (fills remainder)
 *
 * Styling: .panel/.panel-header/.panel-body from panels.css + panelStyles.js
 * primitives. No custom CSS.
 */
import { html } from '../lib/preact.standalone.module.js';
import {
    GRID_3_S, GRID_2_S,
    CELL_S, CELL_LABEL_S, CELL_NUM_S, CELL_TXT_S,
    MetricCard,
    getCreditLabel, getCreditColor,
} from './panelStyles.js';
import CapitalizationChart from './CapitalizationChart.js';
import AdvisorySummary from './AdvisorySummary.js';
import * as api from '../api.js';

export default function PlayerOverviewPanel() {

    // ── Game state ─────────────────────────────────────────
    const activeEntityNum  = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeEntityData = api.useGameStore(s => s.gameState.activeEntityData) || {};
    const aef              = api.useGameStore(s => s.gameState.activeEntityFinancials) || {};
    const aep              = api.useGameStore(s => s.gameState.activeEntityPlayerFinancials) || {};
    const playerName       = api.useGameStore(s => s.gameState.playerName) || 'Player';
    const totalAssets      = api.useGameStore(s => s.gameState.totalAssets);
    const totalDebt        = api.useGameStore(s => s.gameState.totalDebt);
    const netWorth         = api.useGameStore(s => s.gameState.netWorth);
    const chairedCompanyId = api.useGameStore(s => s.gameState.chairedCompanyId);
    const allCompanies     = api.useGameStore(s => s.gameState.allCompanies) || [];
    const dlrSign          = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro             = api.useGameStore(s => s.gameState.euro)    || '';

    // ── Formatters ─────────────────────────────────────────
    const fmtM = (v) => {
        const n = parseFloat(v);
        if (v == null || isNaN(n)) return '—';
        if (Math.abs(n) >= 1000)
            return `${dlrSign}${(n / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} billion${euro}`;
        return `${dlrSign}${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} million${euro}`;
    };
    const fmtPct = (v) => v != null ? `${parseFloat(v).toFixed(2)}%` : '—';

    // ── Derived ────────────────────────────────────────────
    // Employment status: CEO of corp > 10, else "Unemployed"
    const ceoCorp = (chairedCompanyId && chairedCompanyId > 10)
        ? allCompanies.find(c => c.id === chairedCompanyId)
        : null;
    const employmentStatus = ceoCorp ? `CEO of ${ceoCorp.name}` : 'Independent';

    // Lending bank: reuse corp's bankId (GameServer.h:552 derives from bankNum[aeNum-1],
    // which works for both corp and player active entities)
    const bankId = aef.bankId && aef.bankId > 0 ? aef.bankId : null;
    const bank = bankId ? allCompanies.find(c => c.id === bankId) : null;
    const bankLabel = bank ? bank.name : (bankId ? `Bank #${bankId}` : '—');

    // Credit rating (from activeEntityData; populated for both corps and players)
    const credRating = activeEntityData.credRating;

    // D/E ratio (client-computed)
    const deVal   = (netWorth != null && netWorth > 0 && totalDebt != null) ? (totalDebt / netWorth) : null;
    const deLabel = deVal != null ? deVal.toFixed(2) + 'x' : '—';
    const deColor = deVal == null ? 'neutral' : deVal < 1 ? 'green' : deVal < 3 ? 'yellow' : 'red';

    // Net Worth color (green if positive, red if negative, yellow if zero)
    const netWorthColor = (netWorth == null) ? 'neutral' : netWorth > 0 ? 'green' : netWorth < 0 ? 'red' : 'yellow';

    // Net Worth direction indicator: under-specified in Phase 1 plan — render em-dash
    // until a year-start baseline is bridged (Phase 2 candidate).
    const netWorthDirection = '—';

    // YTD Realized Cap Gain/Loss (bridged via Phase 1 addendum a47ca21):
    // signed — positive = gains, negative = losses.
    const rcg = aep.realizedCapGainLoss;
    const rcgColor = rcg == null ? 'neutral' : rcg > 0 ? 'green' : rcg < 0 ? 'red' : 'neutral';
    const rcgLabel = rcg == null
        ? '—'
        : rcg > 0
            ? `${fmtM(rcg)} Gains`
            : rcg < 0
                ? `${fmtM(Math.abs(rcg))} Losses`
                : fmtM(0);

    // Country: not currently bridged for players. Render em-dash.
    const country = activeEntityData.country || '—';

    return html`
    <div class="flex flex-col w-full h-full min-h-0 overflow-y-auto" style="padding:6px;">

        <!-- ══════════════════════════════════════════════
             SPLIT LAYOUT: chart+profile left | net-worth+borrowing+advisory right
             ══════════════════════════════════════════════ -->
        <div style="display:flex; gap:6px; align-items:stretch; flex:1; min-height:0;">

        <!-- LEFT: Capitalization chart + Personal Profile -->
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:6px;">

            <!-- Net Worth Chart -->
            <div class="panel" style="flex:1; min-height:140px;">
                <div class="panel-header">Net Worth History</div>
                <div class="panel-body flex flex-col w-full" style="padding:0;">
                    <${CapitalizationChart}
                        assetId=${activeEntityNum}
                        chartTitle="${playerName} Net Worth"
                    />
                </div>
            </div>

            <!-- Personal Profile -->
            <div class="panel" style="flex:1; min-height:0; display:flex; flex-direction:column;">
                <div class="panel-header">Personal Profile</div>
                <div class="panel-body">
                    <div style="${GRID_2_S}">

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Name</div>
                            <div style="${CELL_TXT_S}">${playerName}</div>
                        </div>

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Country</div>
                            <div style="${CELL_TXT_S}">${country}</div>
                        </div>

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Employment Status</div>
                            <div style="${CELL_TXT_S}">
                                ${ceoCorp ? html`<span
                                    class="hover:underline"
                                    style="color:#60a5fa; cursor:pointer;"
                                    title="Navigate to ${ceoCorp.name}"
                                    onClick=${() => api.setViewAsset(chairedCompanyId)}
                                >${employmentStatus}</span>` : employmentStatus}
                            </div>
                        </div>

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Lending Bank</div>
                            <div style="${CELL_TXT_S}">
                                ${bank ? html`<span
                                    class="hover:underline"
                                    style="color:#60a5fa; cursor:pointer;"
                                    title="Navigate to ${bank.name}"
                                    onClick=${() => api.setViewAsset(bankId)}
                                >${bank.name}</span>` : bankLabel}
                            </div>
                        </div>

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Credit Rating</div>
                            <div style="${CELL_TXT_S}">
                                ${credRating != null ? html`
                                    <span style="color:var(--color-${getCreditColor(credRating)}); font-weight:600;">
                                        ${getCreditLabel(credRating)}
                                    </span>
                                ` : '—'}
                            </div>
                        </div>

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Net Worth Trend</div>
                            <div style="${CELL_TXT_S}">${netWorthDirection}</div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
        <!-- END LEFT -->

        <!-- RIGHT: Net Worth + Borrowing + Advisory Summary stacked -->
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:6px;">

            <!-- Net Worth (3 MetricCards) -->
            <div class="panel" style="height:auto; flex-shrink:0;">
                <div class="panel-header">Net Worth</div>
                <div class="panel-body" style="padding:0;">
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border-color); border-radius:6px; overflow:hidden;">
                        <${MetricCard}
                            label="Total Assets"
                            value=${totalAssets != null ? fmtM(totalAssets) : '—'}
                            color="neutral"
                        />
                        <${MetricCard}
                            label="Total Debt"
                            value=${totalDebt != null ? fmtM(totalDebt) : '—'}
                            color="neutral"
                        />
                        <${MetricCard}
                            label="Net Worth"
                            value=${netWorth != null ? fmtM(netWorth) : '—'}
                            color=${netWorthColor}
                        />
                    </div>
                </div>
            </div>

            <!-- Borrowing (4 cells, 2x2) -->
            <div class="panel" style="height:auto; flex-shrink:0;">
                <div class="panel-header">Borrowing</div>
                <div class="panel-body">
                    <div style="${GRID_2_S}">

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Borrowing Rate</div>
                            <div style="${CELL_NUM_S}">
                                ${aep.borrowRate != null ? fmtPct(aep.borrowRate) : '—'}
                            </div>
                        </div>

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Unused Line of Credit</div>
                            <div style="${CELL_NUM_S}">
                                ${aep.lineOfCredit != null ? fmtM(aep.lineOfCredit) : '—'}
                            </div>
                        </div>

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">Debt / Equity Ratio</div>
                            <div style="${CELL_NUM_S}; color:var(--color-${deColor});">
                                ${deLabel}
                            </div>
                        </div>

                        <div style="${CELL_S}">
                            <div style="${CELL_LABEL_S}">YTD Realized Cap Gains</div>
                            <div style="${CELL_NUM_S}; color:var(--color-${rcgColor});">
                                ${rcgLabel}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Advisory Summary — fills remaining space -->
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
