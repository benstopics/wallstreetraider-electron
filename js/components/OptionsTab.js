import { html } from '../lib/preact.standalone.module.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
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

    // Get disabled message and click handler from hook for dynamic buttons
    const actingAsDisabledMessage = buttonProps.buyCalls.disabledMessage;
    const handleActAsClick = buttonProps.handleActAsClick;

    return html`
            <div class="flex flex-col w-full h-full min-h-0">
                <div class="flex flex-col items-center mb-2">
                    <div class="flex flex-row justify-center gap-2 mt-2" style="height:30px">
                        <${DisabledTooltipButton} ...${buttonProps.buyCalls} />
                        <${DisabledTooltipButton} ...${buttonProps.sellCalls} />
                        <${DisabledTooltipButton} ...${buttonProps.buyPuts} />
                        <${DisabledTooltipButton} ...${buttonProps.sellPuts} />
                    </div>
                    ${!buttonProps.isActiveEntityETF ? html`<div class="flex flex-row justify-center mt-2" style="height:30px">
                        <${DisabledTooltipButton} ...${buttonProps.advancedOptions} />
                    </div>` : ''}
                </div>
                <div class="flex flex-col flex-[3] items-center overflow-y-auto min-h-0">
                    ${renderLines(
                        optionsList,
                        ({ id }) => api.setViewAsset(parseInt(id.split('|').pop())),
                        ({ id, type, text }) => {
                            const contract = parseReportLine(text);
                            const notInTheMoney = (type.includes('LONGCALL') && contract.stockPrice < contract.strikePrice)
                                || (type.includes('LONGPUT') && contract.stockPrice > contract.strikePrice);
                            const exerciseDisabledMsg = actingAsDisabledMessage ? actingAsDisabledMessage : (notInTheMoney ? "Option not in the money" : false);
                            // Only provide click handler if the issue is acting-as related
                            const exerciseDisabledClick = actingAsDisabledMessage ? handleActAsClick : null;

                            return html`
                            <${DisabledTooltipButton}
                                disabledMessage=${actingAsDisabledMessage}
                                onClick=${() => (
                                    type === 'LONGCALL' ? api.sellCalls
                                    : type === 'LONGPUT' ? api.sellPuts
                                    : type === 'SHORTCALL' ? api.buyCalls
                                    : type === 'SHORTPUT' ? api.buyPuts
                                    : () => { }
                                )(parseInt(id.split('|')[0]))}
                                onDisabledClick=${handleActAsClick}
                                label=${type.includes('LONG') ? 'Sell' : 'Cover'}
                                color="red"
                            />
                            <${DisabledTooltipButton}
                                disabledMessage=${exerciseDisabledMsg}
                                onClick=${() => (
                                    type.includes('CALL') ? api.exerciseCallOptionsEarly
                                    : type.includes('PUT') ? api.exercisePutOptionsEarly
                                    : () => { }
                                )(parseInt(id.split('|')[0]))}
                                onDisabledClick=${exerciseDisabledClick}
                                label="Exercise Early"
                                color="blue"
                            />
                        `}
                    , hyperlinkRegex)}
                </div>
            </div>
    `;
}

export default OptionsTab;
