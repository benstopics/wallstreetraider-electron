/**
 * CompanyManagement — Full-screen Layer 1 view for governed companies (Req 2.2 / 2.11)
 *
 * Opened when a player navigates to manage one of their controlled companies.
 * Provides all management actions in one place — no entity picker, actions are scoped
 * to the company being viewed (activeEntityNum / uiViewedEntityId).
 *
 * Sections (tabs): Board Room, Treasury/Banking, Assets, Legal,
 *   Bank Operations (bank only), ETF/Advisory (insurance/broker only), Info
 *
 * Guard conditions per req 1.4:
 *   - Set Growth Rate / Interest Rate Swaps: company ID > 10 only
 *   - Increase/Decrease Earnings: ID > 10, not ETF (Decrease also not bank)
 *   - Bank Operations sub-buttons: bank industry (IndNum = 1), ID > 10
 *   - ETF/Advisory: insurance (2) or broker (37), ID > 10
 */
import { html, useState, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import Breadcrumb from './Breadcrumb.js';
import Button from './Button.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import { insertCurrencySymbols, formatCurrency } from './helpers.js';
import * as api from '../api.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';

const Tab = Tabs.Tab;

// ── Small action button helper ────────────────────────────────────────────────
function ActionBtn({ label, onClick, disabled, disabledMessage, color = '' }) {
    if (disabled) {
        return html`
            <button class="btn text-xs ${color}" disabled title=${disabledMessage || 'Not available'} style="opacity:0.4; cursor:not-allowed;">
                ${insertCurrencySymbols(label)}
            </button>
        `;
    }
    return html`
        <${Button} class="btn text-xs ${color}" onClick=${onClick}>
            ${insertCurrencySymbols(label)}
        <//>
    `;
}

// ── Stat + Action row ─────────────────────────────────────────────────────────
// Each management action is placed next to its relevant stat (Req 2.2).
// Stat values show "—" until backend exposes structured company fields.
// TODO(backend): add ceoName, managerNames, dividendRate, productivityRate,
//   growthRate, autopilotEnabled to allCompanies or a separate company-detail endpoint.
function StatActionRow({ label, statValue, children }) {
    return html`
        <div class="flex flex-row items-center gap-3 p-2" style="border-bottom:1px solid rgba(255,255,255,0.06); min-height:38px;">
            <span style="min-width:120px; font-size:11px; opacity:0.6; flex-shrink:0;">${label}</span>
            <span style="min-width:80px; font-size:12px; font-weight:600; flex-shrink:0;" title="Live value — TODO(backend): expose structured fields">
                ${statValue ?? '—'}
            </span>
            <div class="flex flex-row gap-2 flex-wrap">
                ${children}
            </div>
        </div>
    `;
}

// ── Board Room section ────────────────────────────────────────────────────────
// Stat-next-to-action layout per Req 2.2. Current stat values are "—" (see deviation note above).
function BoardRoomSection({ props, companyId }) {
    const canGrowthRate = companyId > 10;
    return html`
        <div class="flex flex-col" style="overflow-y:auto;">
            <${StatActionRow} label="CEO" statValue=${null}>
                <${ActionBtn} label="Elect CEO"       onClick=${() => api.electCeo()} />
                <${ActionBtn} label="Resign as CEO"   onClick=${() => api.resignAsCeo()} />
            <//>
            <${StatActionRow} label="Managers" statValue=${null}>
                <${ActionBtn} label="Change Managers" onClick=${() => api.changeManagers()} />
            <//>
            <${StatActionRow} label="Dividend" statValue=${null}>
                <${ActionBtn} label="Set Dividend"    onClick=${() => api.setDividend()} />
            <//>
            <${StatActionRow} label="Productivity" statValue=${null}>
                <${ActionBtn} label="Set Productivity" onClick=${() => api.setProductivity()} />
            <//>
            <${StatActionRow} label="Growth Rate" statValue=${null}>
                <${ActionBtn} label="Set Growth Rate"
                    disabled=${!canGrowthRate}
                    disabledMessage="Only available for company ID > 10"
                    onClick=${() => api.setGrowthRate()} />
                <${ActionBtn} label="Growth Throttle" onClick=${() => api.growthThrottle()} />
            <//>
            <${StatActionRow} label="Brand / Structure" statValue=${null}>
                <${ActionBtn} label="Rebrand"         onClick=${() => api.rebrand()} />
                <${ActionBtn} label="Restructure"     onClick=${() => api.restructure()} />
            <//>
            <${StatActionRow} label="Autopilot" statValue=${null}>
                <${ActionBtn} label="Toggle Autopilot" onClick=${() => api.toggleCompanyAutopilot(companyId)} />
            <//>
        </div>
    `;
}

// ── Treasury / Banking section ────────────────────────────────────────────────
function TreasurySection({ props, companyId, isBank, isETF }) {
    const canSwaps = companyId > 10;
    return html`
        <div class="flex flex-row flex-wrap gap-2 p-2">
            <${ActionBtn} label="Borrow Money"          onClick=${() => api.borrowMoney()} />
            <${ActionBtn} label="Repay Loan"            onClick=${() => api.repayLoan()} />
            <${ActionBtn} label="Change Bank"           onClick=${() => api.changeBank()} />
            <${ActionBtn} label="Trade T-Bills"         onClick=${() => api.tradeTbills()} />
            <${ActionBtn} label="Interest Rate Swaps"
                disabled=${!canSwaps}
                disabledMessage="Only available for company ID > 10"
                onClick=${() => api.interestRateSwaps()} />
            ${!isETF ? html`
                <${ActionBtn} label="Public Stock Offering"  onClick=${() => api.publicStockOffering()} />
                <${ActionBtn} label="Private Stock Offering" onClick=${() => api.privateStockOffering()} />
                <${ActionBtn} label="Issue Corp Bonds"       onClick=${() => api.issueNewCorpBonds()} />
                <${ActionBtn} label="Redeem Corp Bonds"      onClick=${() => api.redeemCorpBonds()} />
                <${ActionBtn} label="Extraordinary Dividend" onClick=${() => api.extraordinaryDividend()} />
                <${ActionBtn} label="Split Stock"            onClick=${() => api.splitStock()} />
                <${ActionBtn} label="Reverse Split"          onClick=${() => api.reverseSplitStock()} />
            ` : ''}
            <${ActionBtn} label="Capital Contribution"  onClick=${() => api.capitalContribution()} />
        </div>
    `;
}

// ── Assets section ────────────────────────────────────────────────────────────
function AssetsSection({ companyId, isETF }) {
    return html`
        <div class="flex flex-row flex-wrap gap-2 p-2">
            <${ActionBtn} label="Buy Corporate Assets"       onClick=${() => api.buyCorporateAssets()} />
            <${ActionBtn} label="Sell Corporate Assets"      onClick=${() => api.sellCorporateAssets()} />
            <${ActionBtn} label="Offer Assets For Sale"      onClick=${() => api.offerCorporateAssetsForSale()} />
            <${ActionBtn} label="Offer Subsidiary Stock"     onClick=${() => api.sellSubsidiaryStock()} />
            ${!isETF ? html`
                <${ActionBtn} label="Spin-Off"               onClick=${() => api.spinOff(companyId)} />
                <${ActionBtn} label="Tax-Free Liquidation"   onClick=${() => api.taxFreeLiquidation()} />
                <${ActionBtn} label="Taxable Liquidation"    onClick=${() => api.taxableLiquidation()} />
            ` : ''}
        </div>
    `;
}

// ── Legal section ─────────────────────────────────────────────────────────────
function LegalSection({ companyId, isETF, isBank }) {
    const canEarnings = companyId > 10 && !isETF;
    const canDecEarnings = companyId > 10 && !isETF && !isBank;
    return html`
        <div class="flex flex-row flex-wrap gap-2 p-2">
            <${ActionBtn} label="Change Law Firm"     onClick=${() => api.changeLawFirm()} />
            <${ActionBtn} label="Increase Earnings"
                disabled=${!canEarnings}
                disabledMessage="Not available for ETFs or company ID ≤ 10"
                onClick=${() => api.increaseEarnings()} />
            <${ActionBtn} label="Decrease Earnings"
                disabled=${!canDecEarnings}
                disabledMessage="Not available for ETFs, banks, or company ID ≤ 10"
                onClick=${() => api.decreaseEarnings()} />
        </div>
    `;
}

// ── Bank Operations section ───────────────────────────────────────────────────
function BankOpsSection({ companyId }) {
    const canAdvanced = companyId > 10;
    return html`
        <div class="flex flex-row flex-wrap gap-2 p-2">
            <${ActionBtn} label="Set Allocation"
                disabled=${!canAdvanced}
                disabledMessage="Only available for company ID > 10"
                onClick=${() => api.setBankAllocation()} />
            <${ActionBtn} label="List Bank Loans"     onClick=${() => api.listBankLoans()} />
            <${ActionBtn} label="Freeze All Loans"
                disabled=${!canAdvanced}
                disabledMessage="Only available for company ID > 10"
                onClick=${() => api.freezeAllLoans()} />
            <${ActionBtn} label="Buy Business Loans"
                disabled=${!canAdvanced}
                disabledMessage="Only available for company ID > 10"
                onClick=${() => api.buyBusinessLoans()} />
            <${ActionBtn} label="Buy Consumer Loans"  onClick=${() => api.buyConsumerLoans()} />
            <${ActionBtn} label="Sell Consumer Loans" onClick=${() => api.sellConsumerLoans()} />
            <${ActionBtn} label="Buy Prime Mortgages"    onClick=${() => api.buyPrimeMortgages()} />
            <${ActionBtn} label="Sell Prime Mortgages"   onClick=${() => api.sellPrimeMortgages()} />
            <${ActionBtn} label="Buy Subprime Mortgages" onClick=${() => api.buySubprimeMortgages()} />
            <${ActionBtn} label="Sell Subprime Mortgages" onClick=${() => api.sellSubprimeMortgages()} />
        </div>
    `;
}

// ── ETF / Advisory section ────────────────────────────────────────────────────
function EtfAdvisorySection({ companyId }) {
    const canAdvisory = companyId > 10;
    return html`
        <div class="flex flex-row flex-wrap gap-2 p-2">
            <${ActionBtn} label="Become ETF Advisor"
                disabled=${!canAdvisory}
                disabledMessage="Only available for company ID > 10"
                onClick=${() => api.becomeEtfAdvisor()} />
            <${ActionBtn} label="Set Advisory Fee"    onClick=${() => api.setAdvisoryFee()} />
        </div>
    `;
}

// ── CompanyManagement main component ─────────────────────────────────────────
export default function CompanyManagement() {
    const uiViewedEntityId    = api.useGameStore(s => s.uiViewedEntityId);
    const activeEntityNum     = api.useGameStore(s => s.gameState.activeEntityNum);
    const allCompanies        = api.useGameStore(s => s.gameState.allCompanies) || [];
    const dlrSign             = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro                = api.useGameStore(s => s.gameState.euro) || '';

    // The managed company is the one we navigated to
    const companyId = uiViewedEntityId || activeEntityNum;

    const company = useMemo(() => allCompanies.find(c => c.id === companyId), [allCompanies, companyId]);

    const isBank     = company?.industryId === api.BANK_IND;
    const isETF      = company?.industryId === api.ETF_IND;
    const isInsurance = company?.industryId === api.INSURANCE_IND;
    const isBroker   = company?.industryId === api.SECURITIES_BROKER_IND;
    const showEtfAdvisory = (isInsurance || isBroker) && companyId > 10;

    const fmt = v => (v != null ? `${dlrSign}${formatCurrency(v)}${euro}` : '—');

    const props = useActionButtonProps();

    // Auto-set actingAs to the managed company so all actions are scoped correctly
    useEffect(() => {
        if (companyId > 10) api.changeActingAs(companyId);
    }, [companyId]);

    const [savedTab, setSavedTab] = useState('Board Room');
    const [activeTab, setActiveTab] = useState(savedTab);

    return html`
        <div class="flex flex-col h-full min-h-0">
            <!-- Breadcrumb -->
            <${Breadcrumb} />

            <!-- Company header (Req 2.2) -->
            <!-- Cash, Total Debt, Revenue, Net Income show "—" until backend exposes structured fields. -->
            <!-- TODO(backend): add companyCash, companyDebt, revenue, netIncome to allCompanies or separate endpoint -->
            <div class="flex flex-row items-center gap-3 flex-shrink-0 flex-wrap"
                style="padding:6px 10px; background:rgba(255,255,255,0.05); border-radius:4px; margin-bottom:4px;">
                <span style="font-weight:700; font-size:14px;">${company?.name || `Company #${companyId}`}</span>
                ${company?.symbol ? html`<span class="panel" style="padding:1px 6px; font-size:12px;">${company.symbol}</span>` : ''}
                <span style="font-size:12px; opacity:0.7;">${company?.industryName || ''}</span>
                <span style="font-size:13px;">${insertCurrencySymbols('Price:')} ${fmt(company?.price)}</span>
                <span style="opacity:0.6;">|</span>
                <span style="font-size:12px;" title="TODO(backend): expose company cash">${insertCurrencySymbols('Cash:')} <strong>—</strong></span>
                <span style="font-size:12px;" title="TODO(backend): expose company total debt">${insertCurrencySymbols('Debt:')} <strong>—</strong></span>
                <span style="font-size:12px;" title="TODO(backend): expose company revenue">${insertCurrencySymbols('Revenue:')} <strong>—</strong></span>
                <span style="font-size:12px;" title="TODO(backend): expose company net income">${insertCurrencySymbols('Net Income:')} <strong>—</strong></span>
            </div>

            <!-- Management tabs -->
            <${Tabs} activeTab=${activeTab} onTabChange=${setActiveTab} style="flex:1;min-height:0;">

                <${Tab} label="Board Room" hotkey="b">
                    <${BoardRoomSection} props=${props} companyId=${companyId} />
                <//>

                <${Tab} label="Treasury" hotkey="t">
                    <${TreasurySection} props=${props} companyId=${companyId} isBank=${isBank} isETF=${isETF} />
                <//>

                <${Tab} label="Assets" hotkey="a">
                    <${AssetsSection} companyId=${companyId} isETF=${isETF} />
                <//>

                <${Tab} label="Legal" hotkey="l">
                    <${LegalSection} companyId=${companyId} isETF=${isETF} isBank=${isBank} />
                <//>

                ${isBank ? html`
                    <${Tab} label="Bank Ops" hotkey="k">
                        <${BankOpsSection} companyId=${companyId} />
                    <//>
                ` : ''}

                ${showEtfAdvisory ? html`
                    <${Tab} label="ETF/Advisory" hotkey="e">
                        <${EtfAdvisorySection} companyId=${companyId} />
                    <//>
                ` : ''}

                <${Tab} label="Info" hotkey="i">
                    <div class="flex flex-row flex-wrap gap-2 p-2">
                        <${Button} class="btn text-xs" onClick=${() => api.creditInfo()}>
                            ${insertCurrencySymbols('Credit Info')}
                        <//>
                    </div>
                <//>

            <//>
        </div>
    `;
}
