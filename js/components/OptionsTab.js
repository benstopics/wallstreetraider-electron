import { html } from '../lib/preact.standalone.module.js';
import ActingAsRequiredButton from './ActingAsRequiredButton.js';
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
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies);
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);
    const optionsList = api.useGameStore(s => s.gameState.optionsList);

    return html`
            <div class="flex flex-col w-full">
                <br />
                <div class="flex flex-col flex-[3] items-center">
                    ${renderLines(
                        allCompanies, allIndustries,
                        optionsList,
                        ({ id }) => api.setViewAsset(parseInt(id.split('|').pop())),
                        ({ id, type, text }) => html`
                            <${ActingAsRequiredButton} 
                                disabledMessage=${!actingAs ? "Must be acting as this company" : false} 
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
                            <${ActingAsRequiredButton}
                                disabledMessage=${(() => {
                                    if (!actingAs) return "Must be acting as this company"

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
                    )}
                </div>
            </div>
    `;
}

export default OptionsTab;