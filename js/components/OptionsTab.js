import { html } from '../lib/preact.standalone.module.js';
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

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsId = api.useGameStore(s => s.gameState.actingAsId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];
    const optionsList = api.useGameStore(s => s.gameState.optionsList);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    // ETF Advisor detection
    const isActiveEntityETF = activeIndustryId === api.ETF_IND;
    const activeEntity = allCompanies.find(c => c.id === activeEntityNum);
    const etfAdvisorId = activeEntity?.advisorId || 0;
    const controlsETFAdvisor = isActiveEntityETF && (controlledCompanies || []).some(c => c.id === etfAdvisorId);
    const isActingAsETFAdvisor = isActiveEntityETF && controlsETFAdvisor && actingAsId === etfAdvisorId;

    const getActingAsDisabledMessage = () => {
        if (isActiveEntityETF) {
            if (!controlsETFAdvisor) return "You must control the ETF's investment advisor";
            if (!isActingAsETFAdvisor) return "Must be acting as the ETF's investment advisor";
            return false;
        }
        return !actingAs ? "Must be acting as this company" : false;
    };

    return html`
            <div class="flex flex-col w-full">
                <div class="flex flex-col items-center mb-2">
                    <div class="flex flex-row justify-center gap-2 mt-2" style="height:30px">
                        <${DisabledTooltipButton}
                            disabledMessage=${getActingAsDisabledMessage()}
                            onClick=${() => api.buyCalls(0)}
                            label="Buy Calls"
                            color="green"
                        />
                        <${DisabledTooltipButton}
                            disabledMessage=${getActingAsDisabledMessage()}
                            onClick=${() => api.sellCalls(0)}
                            label="Sell Calls"
                            color="red"
                        />
                        <${DisabledTooltipButton}
                            disabledMessage=${getActingAsDisabledMessage()}
                            onClick=${() => api.buyPuts(0)}
                            label="Buy Puts"
                            color="green"
                        />
                        <${DisabledTooltipButton}
                            disabledMessage=${getActingAsDisabledMessage()}
                            onClick=${() => api.sellPuts(0)}
                            label="Sell Puts"
                            color="red"
                        />
                    </div>
                    ${!isActiveEntityETF ? html`<div class="flex flex-row justify-center mt-2" style="height:30px">
                        <${DisabledTooltipButton}
                            disabledMessage=${getActingAsDisabledMessage()}
                            onClick=${api.advancedOptionsTrading}
                            label="Advanced Options"
                            color="green"
                        />
                    </div>` : ''}
                </div>
                <div class="flex flex-col flex-[3] items-center">
                    ${renderLines(
                        optionsList,
                        ({ id }) => api.setViewAsset(parseInt(id.split('|').pop())),
                        ({ id, type, text }) => html`
                            <${DisabledTooltipButton}
                                disabledMessage=${getActingAsDisabledMessage()}
                                onClick=${() => (
                                    type === 'LONGCALL' ? api.sellCalls
                                    : type === 'LONGPUT' ? api.sellPuts
                                    : type === 'SHORTCALL' ? api.buyCalls
                                    : type === 'SHORTPUT' ? api.buyPuts
                                    : () => { }
                                )(parseInt(id.split('|')[0]))}
                                label=${type.includes('LONG') ? 'Sell' : 'Cover'}
                                color="red"
                            />
                            <${DisabledTooltipButton}
                                disabledMessage=${(() => {
                                    const actingAsMsg = getActingAsDisabledMessage();
                                    if (actingAsMsg) return actingAsMsg;

                                    const contract = parseReportLine(text)
                                    if ((type.includes('LONGCALL') && contract.stockPrice < contract.strikePrice)
                                        || (type.includes('LONGPUT') && contract.stockPrice > contract.strikePrice)) {
                                        return "Option not in the money"
                                    }

                                    return false
                                })()}
                                onClick=${() => (
                                    type.includes('CALL') ? api.exerciseCallOptionsEarly
                                    : type.includes('PUT') ? api.exercisePutOptionsEarly
                                    : () => { }
                                )(parseInt(id.split('|')[0]))}
                                label="Exercise Early"
                                color="blue"
                            />
                        `
                    , hyperlinkRegex)}
                </div>
            </div>
    `;
}

export default OptionsTab;