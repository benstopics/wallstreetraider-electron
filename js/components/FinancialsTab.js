import { html, useRef, useState } from '../lib/preact.standalone.module.js';
import { renderLines, LetterHotkeyButton } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import CapitalizationChart from './CapitalizationChart.js';
import AdvisorySummary from './AdvisorySummary.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';


// For insurance companies and bond redemption
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
        const disabledTooltip = controlsActiveEntity
            ? `Must be acting as this company. Click to act as ${activeEntitySymbol}`
            : "Must be acting as this company";
        const handleActAsClick = controlsActiveEntity ? () => api.changeActingAs(activeEntityNum) : null;

        const sellIdx = extrasCounter ? extrasCounter.current++ : null;
        const buyIdx = extrasCounter ? extrasCounter.current++ : null;

        if (!actingAs) {
            nodes.push(html`<${DisabledTooltipButton}
                disabledMessage=${disabledTooltip}
                onDisabledClick=${handleActAsClick}
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

            nodes.push(html`<${DisabledTooltipButton}
                disabledMessage=${disabledTooltip}
                onDisabledClick=${handleActAsClick}
                label="Buy"
                color="green"
                containerClass="w-12 mx-1"
                buttonClass="w-full"
                extrasIndex=${buyIdx}
                scopeActive=${scopeActiveRef?.current}
                hotkeyLetter="b"
                isLineSelected=${isLineSelected}
                lineNumber=${lineNumber}
            />`);
        } else {
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
        }

        return html`<div class="flex justify-center items-center">
            ${nodes}
        </div>`;
    }

    return html`<div class="flex justify-center items-center">${nodes}</div>`;
};

function FinancialsTab() {

    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    // Check if user controls the active entity (for renderExtras)
    const controlsActiveEntity = (controlledCompanies || []).some(c => c.id === activeEntityNum);

    // Show extra buttons only when viewing a company (not player)
    const showCorpButtons = activeEntityNum >= 10 || buttonProps.isActiveEntityETF;

    // Extras hotkey refs
    const extrasContainerRef = useRef(null);
    const scopeActiveRef = useRef(false);
    const [, setScopeRenderTick] = useState(0);
    const barButtons = [
        // Equity group
        showCorpButtons && buttonProps.publicStockOffering,
        showCorpButtons && !buttonProps.isActiveEntityETF && buttonProps.privateStockOffering,
        showCorpButtons && buttonProps.splitStock,
        showCorpButtons && buttonProps.reverseSplit,
        showCorpButtons && { divider: true },
        // Debt group
        showCorpButtons && buttonProps.issueCorpBonds,
        buttonProps.borrowMoney,
        buttonProps.repayLoan,
        buttonProps.changeBank,
        showCorpButtons && !buttonProps.isActiveEntityETF && buttonProps.tradeTbills,
        { divider: true },
        // Returns group
        showCorpButtons && buttonProps.extraordinaryDividend,
        showCorpButtons && !buttonProps.isActiveEntityETF && buttonProps.taxFreeLiquidation,
        showCorpButtons && !buttonProps.isActiveEntityETF && buttonProps.taxableLiquidation,
        // Player-only
        !showCorpButtons && buttonProps.prepayTaxes,
    ];
    const extrasStartNumber = barButtons.filter(Boolean).length + 1;

    return html`
            <div class="flex flex-col w-full h-full min-h-0 items-center">
                <${HotkeyButtonBar} buttons=${barButtons}
                    extrasContainerRef=${extrasContainerRef}
                    scopeActiveRef=${scopeActiveRef}
                    onScopeActiveChange=${() => setScopeRenderTick(n => n + 1)}
                    class="flex flex-row items-center gap-5 mb-2" />
                <div class="flex flex-row w-full h-full gap-2 min-h-0">
                    ${activeEntityNum < 10 ? html`
                        <div class="flex flex-col w-1/4 gap-2 h-full min-h-0">
                            <div class="">
                                ${html`<${CapitalizationChart} assetId=${activeEntityNum} chartTitle="Net Worth" />`}
                            </div>
                            <div class="flex flex-1 min-h-0">
                                ${html`<${AdvisorySummary} />`}
                            </div>
                        </div>` : ''}
                    <div class="flex ${activeEntityNum < 10 ? 'w-3/4' : 'w-full'}">
                        <div ref=${extrasContainerRef} class="flex flex-col items-center overflow-y-auto w-full max-h-full">
                            ${renderLines(financialProfile, ({ id }) => api.setViewAsset(id), renderExtras(buttonProps.actingAs, controlsActiveEntity, activeEntityNum, activeEntitySymbol, buttonProps.redeemCorpBonds, scopeActiveRef), hyperlinkRegex,
                                (text) => text.includes('Bonds Due in') ? { type: 'BONDS_DUE', id: null } : null, extrasStartNumber, scopeActiveRef)}
                        </div>
                    </div>
                </div>
            </div>
    `;
}

export default FinancialsTab;
