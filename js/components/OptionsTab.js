import { html, useRef, useState } from '../lib/preact.standalone.module.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';

function parseReportLine(line) {
    const data = {
        companyName: line.slice(0, 21).trim(),
        stockPrice: parseFloat(line.slice(21, 30).trim()) || null,
        strikePrice: parseFloat(line.slice(30, 39).trim()) || null,
        expiry: line.slice(39, 47).trim(),
        pctHeld: line.slice(47, 52).trim(),
        taxBasis: parseFloat(line.slice(52, 60).trim()) || null,
        value: parseFloat(line.slice(72).trim()) || null
    };

    return data;
}

// -------------------- -------- -------- ------- ---- ------- ---------- ----------


function OptionsTab() {

    const optionsList = api.useGameStore(s => s.gameState.optionsList);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    // ETF check for disabling options in the list
    const isETF = buttonProps.isActiveEntityETF;
    const etfDisabledMessage = isETF ? "Not available for ETFs" : false;

    // Acting-as check for line buttons (higher priority than ETF check)
    const actingAsDisabledMessage = buttonProps.mustActAsCompanyMessage;
    const handleActAsClick = buttonProps.onMustActAsCompanyClick;

    // Extras hotkey refs
    const extrasContainerRef = useRef(null);
    const scopeActiveRef = useRef(false);
    const [, setScopeRenderTick] = useState(0);
    const barButtons = [
        buttonProps.buyCalls,
        buttonProps.sellCalls,
        buttonProps.buyPuts,
        buttonProps.sellPuts,
        !isETF && buttonProps.advancedOptions,
    ];
    const extrasStartNumber = barButtons.filter(Boolean).length + 1;

    return html`
            <div class="flex flex-col w-full h-full min-h-0">
                <div class="flex flex-col items-center mb-2">
                    <${HotkeyButtonBar} buttons=${barButtons}
                        extrasContainerRef=${extrasContainerRef}
                        scopeActiveRef=${scopeActiveRef}
                        onScopeActiveChange=${() => setScopeRenderTick(n => n + 1)}
                        class="flex flex-row justify-center gap-2 mt-2" style="height:30px" />
                </div>
                <div ref=${extrasContainerRef} class="flex flex-col flex-[3] items-center overflow-y-auto min-h-0">
                    ${renderLines(
                        optionsList,
                        ({ id }) => api.setViewAsset(parseInt(id.split('|').pop())),
                        ({ id, type, text, extrasCounter, isLineSelected, lineNumber }) => {
                            const contract = parseReportLine(text);
                            const notInTheMoney = (type.includes('LONGCALL') && contract.stockPrice < contract.strikePrice)
                                || (type.includes('LONGPUT') && contract.stockPrice > contract.strikePrice);
                            // Priority: acting-as > ETF > not-in-the-money
                            const sellDisabledMsg = actingAsDisabledMessage || etfDisabledMessage;
                            const sellDisabledClick = actingAsDisabledMessage ? handleActAsClick : null;
                            const isShort = type.includes('SHORT');
                            const exerciseDisabledMsg = actingAsDisabledMessage || etfDisabledMessage || (isShort ? "Cannot exercise shorted options" : false) || (notInTheMoney ? "Option not in the money" : false);
                            const exerciseDisabledClick = actingAsDisabledMessage ? handleActAsClick : null;
                            const sellIdx = extrasCounter ? extrasCounter.current++ : null;
                            const exerciseIdx = extrasCounter ? extrasCounter.current++ : null;

                            return html`
                            <${DisabledTooltipButton}
                                disabledMessage=${sellDisabledMsg}
                                onDisabledClick=${sellDisabledClick}
                                onClick=${() => (
                                    type === 'LONGCALL' ? api.sellCalls
                                    : type === 'LONGPUT' ? api.sellPuts
                                    : type === 'SHORTCALL' ? api.buyCalls
                                    : type === 'SHORTPUT' ? api.buyPuts
                                    : () => { }
                                )(parseInt(id.split('|')[0]))}
                                label=${type.includes('LONG') ? 'Sell' : 'Cover'}
                                color="red"
                                extrasIndex=${sellIdx}
                                scopeActive=${scopeActiveRef.current}
                                hotkeyLetter="s"
                                isLineSelected=${isLineSelected}
                                lineNumber=${lineNumber}
                            />
                            <${DisabledTooltipButton}
                                disabledMessage=${exerciseDisabledMsg}
                                onDisabledClick=${exerciseDisabledClick}
                                onClick=${() => (
                                    type.includes('CALL') ? api.exerciseCallOptionsEarly
                                    : type.includes('PUT') ? api.exercisePutOptionsEarly
                                    : () => { }
                                )(parseInt(id.split('|')[0]))}
                                label="Exercise Early"
                                color="blue"
                                extrasIndex=${exerciseIdx}
                                scopeActive=${scopeActiveRef.current}
                                hotkeyLetter="e"
                                isLineSelected=${isLineSelected}
                                lineNumber=${lineNumber}
                            />
                        `}
                    , hyperlinkRegex, undefined, extrasStartNumber, scopeActiveRef)}
                </div>
            </div>
    `;
}

export default OptionsTab;
