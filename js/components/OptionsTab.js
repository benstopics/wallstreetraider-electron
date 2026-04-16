import { html, useRef } from '../lib/preact.standalone.module.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';

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

    // Extras hotkey refs
    const extrasContainerRef = useRef(null);
    const scopeActiveRef = useRef(false);

    return html`
            <div class="flex flex-col w-full h-full min-h-0">
                <div ref=${extrasContainerRef} class="flex flex-col flex-[3] items-center overflow-y-auto min-h-0">
                    ${renderLines(
                        optionsList,
                        ({ id }) => api.setViewAsset(parseInt(id.split('|').pop())),
                        ({ id, type, text, extrasCounter, isLineSelected, lineNumber }) => {
                            const contract = parseReportLine(text);
                            const notInTheMoney = (type.includes('LONGCALL') && contract.stockPrice < contract.strikePrice)
                                || (type.includes('LONGPUT') && contract.stockPrice > contract.strikePrice);
                            const isShort = type.includes('SHORT');
                            const exerciseDisabledMsg = (isShort ? "Cannot exercise shorted options" : false) || (notInTheMoney ? "Option not in the money" : false);
                            const sellIdx = extrasCounter ? extrasCounter.current++ : null;
                            const exerciseIdx = !isShort && extrasCounter ? extrasCounter.current++ : null;

                            return html`
                            <${DisabledTooltipButton}
                                onClick=${async () => {
                                    await (
                                        type === 'LONGCALL' ? api.sellCalls
                                        : type === 'LONGPUT' ? api.sellPuts
                                        : type === 'SHORTCALL' ? api.buyCalls
                                        : type === 'SHORTPUT' ? api.buyPuts
                                        : () => { }
                                    )(parseInt(id.split('|')[0]));
                                    api.setViewAsset(parseInt(id.split('|').pop()));
                                }}
                                label=${type.includes('LONG') ? 'Sell' : 'Cover'}
                                color="red"
                                extrasIndex=${sellIdx}
                                scopeActive=${scopeActiveRef.current}
                                hotkeyLetter="s"
                                isLineSelected=${isLineSelected}
                                lineNumber=${lineNumber}
                            />
                            ${!isShort && html`<${DisabledTooltipButton}
                                disabledMessage=${exerciseDisabledMsg}
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
                            />`}
                        `}
                    , hyperlinkRegex, undefined, 1, scopeActiveRef)}
                </div>
            </div>
    `;
}

export default OptionsTab;
