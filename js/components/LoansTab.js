import { html, useRef, useState } from '../lib/preact.standalone.module.js';
import { renderLines, LetterHotkeyButton } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';

const renderExtras = (actingAs, controlledCompanies, scopeActiveRef) => ({ type, id, text, extrasCounter, isLineSelected, lineNumber }) => {

    const nodes = [];

    if (['CONSUMER', 'MORTGAGE', 'SUBPRIME'].includes(type)) {
        const sellable = !text?.includes('   0.0   ');

        const sell = type === 'CONSUMER' ? api.sellConsumerLoans
            : type === 'MORTGAGE' ? api.sellPrimeMortgages
                : type === 'SUBPRIME' ? api.sellSubprimeMortgages
                    : () => { };

        const buy = type === 'CONSUMER' ? api.buyConsumerLoans
            : type === 'MORTGAGE' ? api.buyPrimeMortgages
                : type === 'SUBPRIME' ? api.buySubprimeMortgages
                    : () => { };

        const sellIdx = extrasCounter ? extrasCounter.current++ : null;
        const buyIdx = extrasCounter ? extrasCounter.current++ : null;

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
                    onClick=${() => sell(id)}
                    label="Sell"
                    letter="s"
                    isLineSelected=${isLineSelected}
                    lineNumber=${lineNumber}
                />`);
            }

        nodes.push(html`<${LetterHotkeyButton}
            class="btn green flex-1 mx-1 w-12"
            onClick=${() => buy(id)}
            label="Buy"
            letter="b"
            isLineSelected=${isLineSelected}
            lineNumber=${lineNumber}
        />`);

        return html`<div class="flex justify-center items-center">
            ${nodes}
        </div>`;
    }

    const sellIdx = extrasCounter ? extrasCounter.current++ : null;
    const freezeIdx = extrasCounter ? extrasCounter.current++ : null;
    const callInIdx = extrasCounter ? extrasCounter.current++ : null;


    // SELL
    const hasLoans = !text?.includes('   0.0   ');
    const playerControlled = api.isPlayerControlled(controlledCompanies, id);

    if (!hasLoans || playerControlled) {
        const tooltipText = playerControlled
            ? 'Cannot sell loans of companies you control'
            : 'Depositor has no loans to sell';
        nodes.push(html`<${DisabledTooltipButton}
            disabledMessage=${tooltipText}
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
            onClick=${() => api.sellBusinessLoan(id)}
            label="Sell"
            letter="s"
            isLineSelected=${isLineSelected}
            lineNumber=${lineNumber}
        />`);
    }

    // FREEZE / UNFREEZE
    const isFrozen = text?.includes('FROZ');
    nodes.push(html`<${LetterHotkeyButton}
        class="btn ${isFrozen ? 'orange' : 'blue'} flex-1 mx-1 w-12"
        onClick=${() => api.freezeLoan(id)}
        label=${isFrozen ? 'Unfreeze' : 'Freeze'}
        letter="f"
        isLineSelected=${isLineSelected}
        lineNumber=${lineNumber}
    />`);

    // CALL IN (below investment grade only - BB or worse)
    const isBBBOrBetter = ['   AAA   ', '   AA   ', '   A   ', '   BBB   '].some(s => text?.includes(s));
    if (!isBBBOrBetter) {
        nodes.push(html`<${LetterHotkeyButton}
            class="btn brown flex-1 mx-1 whitespace-nowrap w-12"
            onClick=${() => api.callInLoan(id)}
            label="Call In"
            letter="c"
            isLineSelected=${isLineSelected}
            lineNumber=${lineNumber}
        />`);
    } else {
        nodes.push(html`<${DisabledTooltipButton}
            disabledMessage=${"Can only call in loans below investment grade (BB or worse)"}
            label="Call In"
            color="brown"
            containerClass="mx-1"
            buttonClass="whitespace-nowrap"
            extrasIndex=${callInIdx}
            scopeActive=${scopeActiveRef?.current}
            hotkeyLetter="c"
            isLineSelected=${isLineSelected}
            lineNumber=${lineNumber}
        />`);
    }

    return html`<div class="flex justify-center items-center">${nodes}</div>`;
};

function LoansTab() {

    const gameState = api.useGameStore(s => s.gameState);
    const frozenAllLoans = gameState.frozenAllLoans;
    const loansReport = gameState.loansReport;
    const hyperlinkRegex = gameState.hyperlinkRegex;

    // Get centralized button props
    const buttonProps = useActionButtonProps();
    const playerControlsBank = buttonProps.controlsActiveEntity;

    // Extras hotkey refs
    const extrasContainerRef = useRef(null);
    const scopeActiveRef = useRef(false);
    const [, setScopeRenderTick] = useState(0);
    const barButtons = [
        buttonProps.buyBusinessLoans,
        { ...buttonProps.freezeAllLoans, label: `${frozenAllLoans ? "Unfreeze" : "Freeze"} All Loans` },
        buttonProps.setBankAllocation,
    ];
    const extrasStartNumber = barButtons.filter(Boolean).length + 1;

    const extrasFn = playerControlsBank
        ? renderExtras(buttonProps.actingAs, buttonProps.controlledCompanies, scopeActiveRef)
        : undefined;

    return html`
        <div class="flex flex-col items-center w-full h-full min-h-0">
            ${playerControlsBank ? html`<${HotkeyButtonBar} buttons=${barButtons}
                extrasContainerRef=${extrasContainerRef}
                scopeActiveRef=${scopeActiveRef}
                onScopeActiveChange=${() => setScopeRenderTick(n => n + 1)}
                class="flex flex-row items-center gap-2 mb-2" />` : ''}

            <div ref=${extrasContainerRef} class="flex flex-col items-center overflow-y-auto flex-1 min-h-0 w-full">
                ${renderLines(loansReport, ({ id }) => id && api.setViewAsset(id), extrasFn, hyperlinkRegex, undefined, extrasStartNumber, scopeActiveRef)}
            </div>
        </div>
    `;
}

export default LoansTab;
