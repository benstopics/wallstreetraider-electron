/**
 * FinancialsTab — Balance Sheet & Financial Profile tab for IndustrialView.
 *
 * For corp entities (activeEntityNum > 10): renders 5 structured panels backed by
 * activeEntityFinancials bridge data, plus a drill-down to the full BSTR text report.
 *
 * For player entities (activeEntityNum <= 10): renders the original BSTR layout
 * (CapitalizationChart + AdvisorySummary + financialProfile text).
 *
 * Styling: .panel/.panel-header/.panel-body + inline styles from panelStyles.js.
 * No custom CSS file. See app-style-guide.md.
 */
import { html, useRef, useState } from '../lib/preact.standalone.module.js';
import { renderLines, LetterHotkeyButton } from './helpers.js';
import SubScreen from './SubScreen.js';
import {
    GRID_3_S, GRID_2_S,
    CELL_S, CELL_LABEL_S, CELL_NUM_S, CELL_TXT_S, CELL_MUT_S,
    MetricCard,
    getCreditLabel, getCreditColor,
    getCashFlowLabel, getCashFlowColor,
} from './panelStyles.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import CapitalizationChart from './CapitalizationChart.js';
import AdvisorySummary from './AdvisorySummary.js';
import EPSChart from './EPSChart.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';

// ─── renderExtras — inline Redeem / Buy / Sell buttons inside BSTR drill-down ───
// Preserved exactly from the original FinancialsTab.

const renderExtras = (actingAs, controlsActiveEntity, activeEntityNum, activeEntitySymbol, redeemCorpBondsProps, scopeActiveRef) => ({ type, id, text, extrasCounter, isLineSelected, lineNumber }) => {

    const nodes = [];

    // Show Redeem button for "Bonds Due in" lines
    if (controlsActiveEntity && text && text.includes('Bonds Due in')) {
        const redeemIdx = extrasCounter ? extrasCounter.current++ : null;
        return html`<div class="flex justify-center items-center">
            <${DisabledTooltipButton}
                ...${redeemCorpBondsProps}
                label="Redeem"
                containerClass=""
                buttonClass="mx-1"
                extrasIndex=${redeemIdx}
                scopeActive=${scopeActiveRef?.current}
                hotkeyLetter="r"
                isLineSelected=${isLineSelected}
                lineNumber=${lineNumber}
            />
        </div>`;
    }

    if (type === 'SUBPRIME') {
        const sellable = !text?.includes('   0.0');

        const sellIdx = extrasCounter ? extrasCounter.current++ : null;
        const buyIdx  = extrasCounter ? extrasCounter.current++ : null;

        if (!sellable) {
                nodes.push(html`<${DisabledTooltipButton}
                    disabledMessage=${"No securities to sell"}
                    label="Sell"
                    color="red"
                    containerClass="w-12 mx-1"
                    buttonClass="w-full"
                    extrasIndex=${sellIdx}
                    scopeActive=${scopeActiveRef?.current}
                    hotkeyLetter="s"
                    isLineSelected=${isLineSelected}
                    lineNumber=${lineNumber}
                />`);
            } else {
                nodes.push(html`<${LetterHotkeyButton}
                    class="btn red flex-1 mx-1 w-12"
                    onClick=${() => api.sellSubprimeMortgages(id)}
                    label="Sell"
                    letter="s"
                    isLineSelected=${isLineSelected}
                    lineNumber=${lineNumber}
                />`);
            }
            nodes.push(html`<${LetterHotkeyButton}
                class="btn green flex-1 mx-1 w-12"
                onClick=${() => api.buySubprimeMortgages(id)}
                label="Buy"
                letter="b"
                isLineSelected=${isLineSelected}
                lineNumber=${lineNumber}
            />`);

        return html`<div class="flex justify-center items-center">${nodes}</div>`;
    }

    return html`<div class="flex justify-center items-center">${nodes}</div>`;
};

// ─── Main component ──────────────────────────────────────────────────────────────

function FinancialsTab() {

    // ── Game state ─────────────────────────────────────────
    const activeEntityNum    = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryId   = api.useGameStore(s => s.gameState.activeIndustryId);
    const activeEntityData   = api.useGameStore(s => s.gameState.activeEntityData)   || {};
    const aef                = api.useGameStore(s => s.gameState.activeEntityFinancials) || {};
    const allCompanies       = api.useGameStore(s => s.gameState.allCompanies) || [];
    const financialProfile      = api.useGameStore(s => s.gameState.financialProfile);
    const cashflowProjection    = api.useGameStore(s => s.gameState.cashflowProjection);
    const earningsReport        = api.useGameStore(s => s.gameState.earningsReport);
    const hyperlinkRegex        = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const activeEntitySymbol    = api.useGameStore(s => s.gameState.activeEntitySymbol);
    const dlrSign               = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro                  = api.useGameStore(s => s.gameState.euro)    || '';
    const currentYear           = api.useGameStore(s => s.gameState.currentYear) || 0;

    const hasNoEarnings = !earningsReport?.length ||
        earningsReport.some(l => l.includes('No prior earnings reports are available yet'));

    const [showFullProfile,    setShowFullProfile]    = useState(false);
    const [showFullProjection, setShowFullProjection] = useState(false);
    const [showEarningsReport, setShowEarningsReport] = useState(false);

    const buttonProps        = useActionButtonProps();
    const { controlledCompanies, isActiveEntityETF } = buttonProps;
    const controlsActiveEntity = (controlledCompanies || []).some(c => c.id === activeEntityNum);

    // Entity type flags
    const isCorp   = activeEntityNum > 10;
    const isBank    = activeIndustryId === api.BANK_IND;
    const isInsurer = activeIndustryId === api.INSURANCE_IND;
    const isPlayer = activeEntityNum > 0 && activeEntityNum <= 10;

    // Extras hotkey refs (used in both player view and drill-down)
    const extrasContainerRef = useRef(null);
    const scopeActiveRef     = useRef(false);
    const [, setScopeRenderTick] = useState(0);

    // ── Formatters ─────────────────────────────────────────
    const fmtM = (v) => {
        const n = parseFloat(v);
        if (v == null || isNaN(n)) return '—';
        if (n >= 1000)
            return `${dlrSign}${(n / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} billion${euro}`;
        return `${dlrSign}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} million${euro}`;
    };

    // ── Button bars ────────────────────────────────────────
    // Corp button bar — shown only when player controls the active corp entity
    const corpBarButtons = [].filter(Boolean);

    // Player button bar (always shown for player entity)
    const playerBarButtons = [
        buttonProps.borrowMoney,
        buttonProps.repayLoan,
        buttonProps.advanceFunds,
        buttonProps.prepayTaxes,
        buttonProps.changeBank,
        buttonProps.tradeTbills,
    ].filter(Boolean);

    const extrasStartNumber = (isPlayer ? playerBarButtons : corpBarButtons).length + 1;

    // ── Derived financials ─────────────────────────────────
    const { credRating, cashFlow } = activeEntityData;

    // Debt-to-equity ratio
    const deVal   = aef.equity > 0 ? (aef.totalDebt / aef.equity) : null;
    const deLabel = deVal != null ? deVal.toFixed(2) + 'x' : '—';
    const deColor = deVal == null ? 'neutral' : deVal < 1 ? 'green' : deVal < 3 ? 'yellow' : 'red';

    // Equity color (green if positive, red if negative)
    const equityColor = (aef.equity == null || aef.equity === 0)
        ? 'var(--color-warning)'
        : aef.equity > 0
            ? 'var(--color-positive)'
            : 'var(--color-negative)';

    // Correct total liabilities by industry type (matches Profiles() TL# + HidReserve# formula)
    const totalLiabilities = isBank
        ? (aef.demandDeposits||0) + (aef.certDeposits||0) + (aef.totalDebt||0) + (aef.hidReserve||0)
        : isInsurer
            ? (aef.totalDebt||0) + (aef.insurReserves||0) + (aef.hidReserve||0)
            : (aef.totalDebt||0) + (aef.hidReserve||0);

    // ── Drill-down view — cash flow projection text ──────────
    if (showFullProjection) return html`
        <${SubScreen} title="Cash Flow Projection — ${activeEntitySymbol || activeEntityNum}" onBack=${() => setShowFullProjection(false)}>
            <div class="flex flex-col items-center overflow-y-auto flex-1 min-h-0" style="padding:8px 10px;">
                ${renderLines(cashflowProjection, ({ id }) => api.setViewAsset(id))}
            </div>
        <//>
    `;

    // ── Drill-down view — earnings report text ───────────────
    if (showEarningsReport) return html`
        <${SubScreen} title="Earnings Report — ${activeEntitySymbol || activeEntityNum}" onBack=${() => setShowEarningsReport(false)}>
            <div class="flex flex-col items-center overflow-y-auto flex-1 min-h-0" style="padding:8px 10px;">
                ${renderLines(earningsReport, ({ id }) => api.setViewAsset(id))}
            </div>
        <//>
    `;

    // ── Drill-down view — full BSTR financial profile text ──
    if (showFullProfile) return html`
        <${SubScreen} title="Financial Profile — ${activeEntitySymbol || activeEntityNum}" onBack=${() => setShowFullProfile(false)}>
            <div ref=${extrasContainerRef} class="flex flex-col items-center overflow-y-auto flex-1 min-h-0" style="padding:8px 10px;">
                ${renderLines(
                    financialProfile,
                    ({ id }) => api.setViewAsset(id),
                    renderExtras(buttonProps.actingAs, controlsActiveEntity, activeEntityNum, activeEntitySymbol, buttonProps.redeemCorpBonds, scopeActiveRef),
                    hyperlinkRegex,
                    null,
                    extrasStartNumber,
                    scopeActiveRef
                )}
            </div>
        <//>
    `;

    // ── Player entity view — original BSTR layout ──────────
    if (isPlayer) return html`
        <div class="flex flex-col w-full h-full min-h-0 items-center">
            <${HotkeyButtonBar}
                buttons=${playerBarButtons}
                extrasContainerRef=${extrasContainerRef}
                scopeActiveRef=${scopeActiveRef}
                onScopeActiveChange=${() => setScopeRenderTick(n => n + 1)}
                class="flex flex-row items-center gap-5 mb-2"
            />
            <div class="flex flex-row w-full h-full gap-2 min-h-0">
                <div class="flex flex-col w-1/4 gap-2 h-full min-h-0">
                    <div>
                        <${CapitalizationChart} assetId=${activeEntityNum} chartTitle="Net Worth" />
                    </div>
                    <div class="flex flex-1 min-h-0">
                        <${AdvisorySummary} />
                    </div>
                </div>
                <div class="flex w-3/4">
                    <div ref=${extrasContainerRef} class="flex flex-col items-center overflow-y-auto w-full max-h-full">
                        ${renderLines(
                            financialProfile,
                            ({ id }) => api.setViewAsset(id),
                            renderExtras(buttonProps.actingAs, controlsActiveEntity, activeEntityNum, activeEntitySymbol, buttonProps.redeemCorpBonds, scopeActiveRef),
                            hyperlinkRegex,
                            (text) => text.includes('Bonds Due in') ? { type: 'BONDS_DUE', id: null } : null,
                            extrasStartNumber,
                            scopeActiveRef
                        )}
                    </div>
                </div>
            </div>
        </div>
    `;

    // ── Corp entity view — 5 structured panels ──────────────

    return html`
    <div class="flex flex-col w-full h-full min-h-0">

        <!-- ── View Financial Statement button (centered, always visible for corp) ── -->
        <div style="display:flex; justify-content:center; margin-bottom:6px; flex-shrink:0;">
            <button class="btn blue" style="padding:2px 14px; font-size:var(--font-size-sm);"
                onClick=${() => setShowFullProfile(true)}>
                View Financial Disclosure
            </button>
        </div>

        <!-- ── Scrollable panels area ── -->
        <div class="overflow-y-auto flex-1 min-h-0" style="padding:6px;">

        <!-- ══════════════════════════════════════════════
             PANELS 1 + 2: Assets | Liabilities side-by-side
             ══════════════════════════════════════════════ -->
        ${(() => {
            // Row styles for the list layout
            const RS = 'display:flex; justify-content:space-between; align-items:center; padding:2px 0; min-height:22px;';
            const RL = `${CELL_LABEL_S} margin-bottom:0; flex:1;`;
            const RV = CELL_NUM_S;
            const RB = 'display:flex; align-items:center; gap:3px; flex-shrink:0;';
            const SEP = html`<div style="border-top:1px solid var(--border-color); margin:3px 0;"></div>`;

            // Row helpers
            const row = (label, val, btns) => html`
                <div style="${RS}">
                    <div style="${RL}">${label}</div>
                    ${btns ? html`<div style="${RB}">${btns}</div>` : ''}
                    <div style="${RV} margin-left:8px;">${fmtM(val)}</div>
                </div>`;
            const rowNeg = (label, val) => html`
                <div style="${RS}">
                    <div style="${RL}">${label}</div>
                    <div style="font-size:var(--font-size-sm); color:var(--color-negative); margin-left:8px;">${val > 0 ? fmtM(-val) : fmtM(0)}</div>
                </div>`;

            // Asset rows — industry-specific
            const assetRows = isBank ? html`
                ${row('Cash (Bank Demand Deposits)', aef.cash)}
                ${row('Short-term T-Bills', aef.tBills,
                    controlsActiveEntity && !isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.tradeTbills} label="Trade" buttonClass="" />` : null)}
                ${row('Stock in Subsidiary Corps.', aef.stocksPortfolioValue)}
                ${row('Options Long/Short: Net Value', aef.optPortfolio)}
                ${row('Govt. Bonds (@ Adjusted Cost)', aef.govBonds)}
                ${row('Corp. Bonds (@ Adjusted Cost)', aef.corpBonds)}
                ${row('Business Loan Portfolio', aef.bizLoan)}
                ${row('Consumer Loan Portfolio', aef.consumerLoan)}
                ${row('Mortgage Loans/Securities', aef.mortgageLoan)}
                ${rowNeg('Less: Bad Debt Reserves', aef.badDebt)}
            ` : isInsurer ? html`
                ${row('Cash (Bank Demand Deposits)', aef.cash)}
                ${row('Short-term T-Bills', aef.tBills,
                    controlsActiveEntity && !isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.tradeTbills} label="Trade" buttonClass="" />` : null)}
                ${row('Stock Portfolio', aef.stocksPortfolioValue)}
                ${row('Options Long/Short: Net Value', aef.optPortfolio)}
                ${row('Govt. Bonds (@ Adjusted Cost)', aef.govBonds)}
                ${row('Corp. Bonds (@ Adjusted Cost)', aef.corpBonds)}
                ${aef.mortgageLoan > 0 ? row('Subprime Mortgage Securities', aef.mortgageLoan) : ''}
                ${row('Index Futures: Marked to Mkt.', aef.commoditiesPortfolioValue)}
                ${aef.commodMargin > 0 ? row('Commodity A/C Margin Balance', aef.commodMargin) : ''}
            ` : isActiveEntityETF ? html`
                ${row('Cash', aef.cash)}
                ${row('Short-term T-Bills', aef.tBills)}
                ${row('Stock Portfolio', aef.stocksPortfolioValue)}
                ${row('Options Long/Short: Net Value', aef.optPortfolio)}
                ${aef.govBonds > 0 ? row('Govt. Bonds (@ Market Value)', aef.govBonds) : ''}
                ${aef.corpBonds > 0 ? row('Corp. Bonds (@ Market Value)', aef.corpBonds) : ''}
                ${row('Commodities: Marked to Market', aef.commoditiesPortfolioValue)}
                ${aef.commodMargin > 0 ? row('Commodity A/C Margin Balance', aef.commodMargin) : ''}
            ` : html`
                ${row('Cash', aef.cash)}
                ${row('Short-term T-Bills', aef.tBills,
                    controlsActiveEntity && !isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.tradeTbills} label="Trade" buttonClass="" />` : null)}
                ${row('Working Capital (A/R, Inven.)', aef.workingCap)}
                ${row('Business Assets/Equipment', aef.capAssets,
                    controlsActiveEntity ? html`
                        ${!isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.restructure} label="Restructure" buttonClass="" />` : ''}
                        <${DisabledTooltipButton} ...${buttonProps.buyCorporateAssets} label="Buy" buttonClass="" />
                        ${aef.capAssets > 0 ? html`<${DisabledTooltipButton} ...${buttonProps.sellCorporateAssets} label="Sell" buttonClass="" />` : ''}
                    ` : null)}
                ${row('Stock in Subsidiary Corps.', aef.stocksPortfolioValue)}
                ${row('Options Long/Short: Net Value', aef.optPortfolio)}
                ${row('Commodities: Marked to Market', aef.commoditiesPortfolioValue)}
                ${aef.commodMargin > 0 ? row('Commodity A/C Margin Balance', aef.commodMargin) : ''}
                ${aef.goodwill > 0 ? row('Unamortized Goodwill', aef.goodwill) : ''}
            `;

            // Liability rows — industry-specific
            const loanLabel = isBank ? 'Interbank Debt — Fed Funds' : 'Bank Loan';
            const liabRows = html`
                ${row('Bonds Outstanding', aef.bondsOut,
                    controlsActiveEntity && !isActiveEntityETF ? html`
                        <${DisabledTooltipButton} ...${buttonProps.issueCorpBonds} label="Issue" buttonClass="" />
                        <${DisabledTooltipButton} ...${buttonProps.redeemCorpBonds} label="Redeem" buttonClass="" />
                    ` : null)}
                ${isBank ? html`
                    ${row('Demand Deposits', aef.demandDeposits)}
                    ${row('Certificates of Deposit', aef.certDeposits)}
                ` : isInsurer ? html`
                    ${row('Insurance Policy Reserves', aef.insurReserves)}
                ` : ''}
                ${row(loanLabel, aef.loan,
                    !isBank && controlsActiveEntity ? html`
                        <${DisabledTooltipButton} ...${buttonProps.borrowMoney} label="Borrow" buttonClass="" />
                        <${DisabledTooltipButton} ...${buttonProps.repayLoan} label="Repay" buttonClass="" />
                    ` : null)}
                ${row('Accrued Income Tax', aef.accTax)}
                ${aef.capTax > 0 ? row('Accrued Taxes on Capital', aef.capTax) : ''}
                ${aef.hidReserve > 0 ? row('Reserve for Contingencies', aef.hidReserve) : ''}
            `;

            return html`
            <div style="display:flex; gap:6px; align-items:stretch; margin-bottom:14px;">

                <!-- ── PANEL 1: Assets Breakdown ── -->
                <div style="flex:1; min-width:0; display:flex; flex-direction:column;">
                <div class="panel" style="flex:1;">
                    <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Assets</span>
                        ${controlsActiveEntity && !isActiveEntityETF ? html`
                            <div style="display:flex; gap:4px; align-items:center;">
                                <${DisabledTooltipButton} ...${buttonProps.taxFreeLiquidation}  buttonClass="" />
                                <${DisabledTooltipButton} ...${buttonProps.taxableLiquidation}  buttonClass="" />
                            </div>
                        ` : ''}
                    </div>
                    <div class="panel-body" style="display:flex; flex-direction:column;">
                        ${assetRows}
                        ${SEP}
                        <div style="${RS}">
                            <div style="${RL} font-weight:700;">Total Assets</div>
                            <div style="font-size:var(--font-size-sm); color:var(--color-warning); font-weight:700;">${fmtM(aef.totalAssets)}</div>
                        </div>
                    </div>
                </div>
                </div>

                <!-- ── PANEL 2: Liabilities & Equity ── -->
                <div style="flex:1; min-width:0; display:flex; flex-direction:column;">
                <div class="panel" style="flex:1;">
                    <div class="panel-header">Liabilities & Equity</div>
                    <div class="panel-body" style="display:flex; flex-direction:column;">
                        ${liabRows}
                        ${SEP}
                        <div style="${RS}">
                            <div style="${RL} font-weight:700;">Total Liabilities</div>
                            <div style="font-size:var(--font-size-sm); color:var(--color-warning); font-weight:700;">${fmtM(totalLiabilities)}</div>
                        </div>
                        <div style="${RS} margin-top:4px;">
                            <div style="${RL} font-weight:700;">Equity</div>
                            <div style="font-size:var(--font-size-sm); color:${equityColor}; font-weight:800;">${fmtM(aef.equity)}</div>
                        </div>
                    </div>
                </div>
                </div>

            </div>`;
        })()}
        <!-- END PANELS 1+2 -->

        <!-- ══════════════════════════════════════════════
             PANEL 4: EPS Chart | Borrower Status | Quarterly Cashflow
             Three equal columns, same height
             ══════════════════════════════════════════════ -->
        ${(() => {
            // EPS data: PL4=oldest → PL1=most recent (left to right on chart)
            const epsData = [
                { year: currentYear - 4, eps: aef.eps4 || 0 },
                { year: currentYear - 3, eps: aef.eps3 || 0 },
                { year: currentYear - 2, eps: aef.eps2 || 0 },
                { year: currentYear - 1, eps: aef.eps1 || 0 },
            ].filter(d => d.eps !== 0);

            // Row style helpers for vertical label-value layout
            const rowS = 'flex:1; display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:var(--bg-primary);';
            const rowLabelS = 'font-size:var(--font-size-sm); color:var(--fg-muted); text-transform:uppercase; letter-spacing:0.4px;';
            const rowValColor = (v) => v > 0 ? 'var(--color-positive)' : v < 0 ? 'var(--color-negative)' : 'var(--color-warning)';

            // Credit rating color → CSS var
            const creditCssColor = (r) => {
                if (r == null) return 'var(--color-warning)';
                if (r <= 4) return 'var(--color-negative)';
                if (r <= 6) return 'var(--color-warning)';
                return 'var(--color-positive)';
            };
            const deCssColor = deVal == null ? 'var(--color-warning)' : deVal < 1 ? 'var(--color-positive)' : deVal < 3 ? 'var(--color-warning)' : 'var(--color-negative)';

            const bid = aef.bankId;
            const bank = bid ? allCompanies.find(c => c.id === bid) : null;
            const bankLabel = bank ? bank.name : (bid ? `#${bid}` : '—');

            return html`
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:14px;">

                <!-- Col 1: EPS Bar Chart -->
                <div class="panel" style="flex:1; min-width:0; display:flex; flex-direction:column;">
                    <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Earnings Per Share</span>
                        <${DisabledTooltipButton}
                            label="View Earnings Report"
                            color="blue"
                            buttonClass=""
                            disabledMessage=${hasNoEarnings ? 'No earnings reports available yet' : undefined}
                            onClick=${() => { api.setActiveUIReport(api.UI_CORP_EARNINGS_REPORT); setShowEarningsReport(true); }}
                        />
                    </div>
                    <div class="panel-body" style="flex:1; min-height:0; padding:0; display:flex;">
                        <${EPSChart} epsData=${epsData} />
                    </div>
                </div>

                <!-- Col 2: Borrower Status -->
                <div class="panel" style="flex:1; min-width:0; display:flex; flex-direction:column;">
                    <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
                        <span>Borrower Status</span>
                        ${controlsActiveEntity ? html`
                            <${DisabledTooltipButton} ...${buttonProps.changeBank}
                                label="Switch Banks" buttonClass=""
                                style="padding:1px 8px; font-size:var(--font-size-sm);"
                            />
                        ` : ''}
                    </div>
                    <div class="panel-body" style="padding:0; flex:1; display:flex; flex-direction:column;">
                        <div style="display:flex; flex-direction:column; flex:1; gap:1px; background:var(--border-color); border-radius:6px; overflow:hidden;">

                            <div style="${rowS}">
                                <span style="${rowLabelS}">Bank</span>
                                ${bid ? html`
                                    <span class="hover:underline" style="font-size:var(--font-size-sm); font-weight:600; color:#60a5fa; cursor:pointer;"
                                        onClick=${() => api.setViewAsset(bid)} title="Navigate to ${bankLabel}">${bankLabel}</span>
                                ` : html`<span style="font-size:var(--font-size-sm); font-weight:600; color:var(--color-warning);">—</span>`}
                            </div>

                            <div style="${rowS}">
                                <span style="${rowLabelS}">Debt / Equity</span>
                                <span style="font-size:var(--font-size-sm); font-weight:600; color:${deCssColor};">${deLabel}</span>
                            </div>

                            <div style="${rowS}">
                                <span style="${rowLabelS}">Credit Rating</span>
                                <span style="font-size:var(--font-size-sm); font-weight:600; color:${creditCssColor(credRating)};">${credRating != null ? getCreditLabel(credRating) : '—'}</span>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Col 3: Quarterly Cashflow -->
                <div class="panel" style="flex:1; min-width:0; display:flex; flex-direction:column;">
                    <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
                        <span>Quarterly Cashflow</span>
                        <button class="btn blue" style="padding:1px 8px; font-size:var(--font-size-sm);"
                            onClick=${() => { api.setActiveUIReport(api.UI_CORP_CASH_FLOW_PROJECTION); setShowFullProjection(true); }}>
                            View Breakdown
                        </button>
                    </div>
                    <div class="panel-body" style="padding:0; flex:1; display:flex; flex-direction:column;">
                        <div style="display:flex; flex-direction:column; flex:1; gap:1px; background:var(--border-color); border-radius:6px; overflow:hidden;">

                            <div style="${rowS}">
                                <span style="${rowLabelS}">Operating Profit</span>
                                <span style="font-size:var(--font-size-sm); font-weight:600; color:${rowValColor(aef.operatingProfit)};">${aef.operatingProfit != null ? fmtM(aef.operatingProfit) : '—'}</span>
                            </div>

                            <div style="${rowS}">
                                <span style="${rowLabelS}">Before Debt</span>
                                <span style="font-size:var(--font-size-sm); font-weight:600; color:${rowValColor(aef.cfBeforeDebt)};">${aef.cfBeforeDebt != null ? fmtM(aef.cfBeforeDebt) : '—'}</span>
                            </div>

                            ${aef.normalCashFlo != null && Math.abs(aef.normalCashFlo - aef.cfAfterDebt) > 0.01 ? html`
                            <div style="${rowS}">
                                <span style="${rowLabelS}; font-style:italic; opacity:0.85;">Oper. Cash Flow</span>
                                <span style="font-size:var(--font-size-sm); color:${rowValColor(aef.normalCashFlo)};">${fmtM(aef.normalCashFlo)}</span>
                            </div>` : ''}

                            <div style="${rowS}">
                                <span style="${rowLabelS}">After Debt</span>
                                <span style="font-size:var(--font-size-sm); font-weight:600; color:${rowValColor(aef.cfAfterDebt)};">${aef.cfAfterDebt != null ? fmtM(aef.cfAfterDebt) : '—'}</span>
                            </div>

                            <div style="${rowS}">
                                <span style="${rowLabelS}">Est. Cash in 3 Mo.</span>
                                <span style="font-size:var(--font-size-sm); font-weight:600; color:${rowValColor(aef.estCashIn3Months)};">${aef.estCashIn3Months != null ? fmtM(aef.estCashIn3Months) : '—'}</span>
                            </div>

                        </div>
                    </div>
                </div>

            </div>`;
        })()}

        <!-- ══════════════════════════════════════════════
             PANEL 5: Operations (growth rate, R&D, dividend)
             For banks: Banking section instead.
             ══════════════════════════════════════════════ -->
        ${isBank ? html`
        <div class="panel" style="margin-bottom:14px; height:auto;">
            <div class="panel-header">Banking</div>
            <div class="panel-body">
                <div style="${GRID_3_S}">

                    <!-- Available LOC used instead of deposit data (deposits TODO) -->
                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Avail. Line of Credit</div>
                        <div style="${CELL_NUM_S}">${fmtM(aef.loc)}</div>
                    </div>

                    <!-- TODO: Bridge Calc_LoanPortfolio result for bank loan portfolio total -->
                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Loan Portfolio</div>
                        <div style="${CELL_MUT_S}">—</div>
                    </div>

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Total Deposits</div>
                        <div style="${CELL_NUM_S}">${fmtM(aef.demandDeposits + aef.certDeposits)}</div>
                    </div>

                </div>
            </div>
        </div>
        ` : html`
        <div class="panel" style="margin-bottom:14px; height:auto;">
            <div class="panel-header">Operations</div>
            <div class="panel-body">
                <div style="${GRID_3_S}">

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Dividend / Share</div>
                        <div style="display:flex; align-items:center; gap:4px;">
                            <div style="${CELL_NUM_S}">
                                ${aef.dividend == null
                                    ? '—'
                                    : aef.dividend > 0
                                        ? `${dlrSign}${aef.dividend.toFixed(2)}${euro}`
                                        : 'None'}
                            </div>
                            ${controlsActiveEntity ? html`
                                <${DisabledTooltipButton}
                                    ...${buttonProps.setDividend}
                                    label="✎ Adjust"
                                    buttonClass=""
                                />
                                <${DisabledTooltipButton}
                                    ...${buttonProps.extraordinaryDividend}
                                    label="Extraordinary"
                                    buttonClass=""
                                />
                            ` : ''}
                        </div>
                    </div>

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">Growth Rate</div>
                        <div style="display:flex; align-items:center; gap:4px;">
                            <div style="${CELL_NUM_S}">
                                ${aef.growRate != null ? `${aef.growRate}%` : '—'}
                            </div>
                            ${controlsActiveEntity ? html`
                                <${DisabledTooltipButton}
                                    ...${buttonProps.setGrowthRate}
                                    label="✎ Adjust"
                                    buttonClass=""
                                />
                            ` : ''}
                        </div>
                    </div>

                    <div style="${CELL_S}">
                        <div style="${CELL_LABEL_S}">R&D / Ad Spend</div>
                        <div style="display:flex; align-items:center; gap:4px;">
                            <div style="${CELL_NUM_S}">
                                ${aef.rdRate != null ? `${aef.rdRate}%` : '—'}
                            </div>
                            ${controlsActiveEntity ? html`
                                <${DisabledTooltipButton}
                                    ...${buttonProps.setProductivity}
                                    label="✎ Adjust"
                                    buttonClass=""
                                />
                            ` : ''}
                        </div>
                    </div>

                </div>
            </div>
        </div>
        `}

        </div>
        <!-- END scrollable panels -->

    </div>
    `;
}

export default FinancialsTab;
