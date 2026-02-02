import { html, useEffect, useMemo, useState } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import * as api from '../api.js';
import { renderMultilineText } from './helpers.js';
import AssetPriceChart from './AssetPriceChart.js';
import Button from './Button.js';

function toStr(v) {
    return v == null ? '' : String(v).trim();
}

function parseFloatOrNull(val) {
    const s = toStr(val).trim();
    if (!s) return null;
    // allow commas in notional (e.g., "129,621")
    const normalized = s.replace(/,/g, '');
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
}

function inputClass(hasError) {
    return `modal-input w-full ${hasError ? 'border border-red-500 outline-red-500' : ''}`;
}

function qIndex(q, y) {
    const qq = parseInt(q, 10);
    const yy = parseInt(y, 10);
    if (Number.isNaN(qq) || Number.isNaN(yy)) return null;
    return yy * 4 + qq; // 1-based quarter works fine for diffs
}

// Generate quarter/year options for dropdowns
function generateQuarterOptions(currentQuarter, currentYear, minOffset, maxOffset) {
    const options = [];
    const curQ = parseInt(currentQuarter, 10);
    const curY = parseInt(currentYear, 10);
    if (Number.isNaN(curQ) || Number.isNaN(curY)) return options;

    for (let offset = minOffset; offset <= maxOffset; offset++) {
        let q = curQ + offset;
        let y = curY;
        while (q > 4) { q -= 4; y++; }
        while (q < 1) { q += 4; y--; }
        options.push({ quarter: q, year: y, label: `Q${q} / ${y}` });
    }
    return options;
}

function parseQuarterValue(value) {
    if (!value) return { quarter: null, year: null };
    const [q, y] = value.split('/');
    return { quarter: parseInt(q, 10), year: parseInt(y, 10) };
}

function formatQuarterValue(quarter, year) {
    if (!quarter || !year) return '';
    return `${quarter}/${year}`;
}

function normalizeState(inState) {
    const st = inState || {};
    return {
        // expected from backend / PB string
        stockName: toStr(st.stockName),
        fixedRate: toStr(st.fixedRate),

        // user selections / inputs
        rateType: toStr(st.rateType) || 'P', // L | S | P
        position: toStr(st.position) || 'SHORT', // LONG | SHORT

        notionalMillions: toStr(st.notionalMillions),

        beginQuarter: toStr(st.beginQuarter),
        beginYear: toStr(st.beginYear),

        endQuarter: toStr(st.endQuarter),
        endYear: toStr(st.endYear),

        currentQuarter: toStr(st.currentQuarter),
        currentYear: toStr(st.currentYear),

        summaryMessage: toStr(st.summaryMessage),
        summaryMessageType: toStr(st.summaryMessageType),
        forceUpdate: toStr(st.forceUpdate),
    };
}

function validate(state, currentQuarter, currentYear) {
    const errors = {};

    const bq = parseInt(state.beginQuarter, 10);
    const by = parseInt(state.beginYear, 10);
    const eq = parseInt(state.endQuarter, 10);
    const ey = parseInt(state.endYear, 10);

    // Notional
    const notional = parseFloatOrNull(state.notionalMillions);
    if (toStr(state.notionalMillions).trim()) {
        if (notional == null) {
            errors.notionalMillions = { msg: 'Notional must be a number' };
        } else if (notional <= 0) {
            errors.notionalMillions = { msg: 'Notional must be greater than zero' };
        }
    } else {
        errors.notionalMillions = { msg: 'Notional is required' };
    }

    // Begin date required
    if (Number.isNaN(bq) || Number.isNaN(by)) {
        errors.beginDate = { msg: 'Beginning date is required' };
    }

    // End date required
    if (Number.isNaN(eq) || Number.isNaN(ey)) {
        errors.endDate = { msg: 'Final date is required' };
    }

    // End must be >= begin
    const beginIdx = qIndex(bq, by);
    const endIdx = qIndex(eq, ey);
    if (beginIdx != null && endIdx != null && endIdx < beginIdx) {
        errors.endDate = { msg: 'Final date must be on or after beginning date' };
    }

    const hasBlockingErrors = Object.values(errors).some(Boolean);
    return { errors, hasBlockingErrors };
}

const rateTypeOptions = {
    L: {
        description: 'Long-Term Govt. Bond Interest Rate',
        bondId: api.TBOND_RATE_ID
    },
    S: {
        description: 'Short-Term Govt. Bond Interest Rate',
        bondId: api.SBOND_RATE_ID
    },
    P: {
        description: 'Bank Prime Interest Rate',
        bondId: api.PRIME_RATE_ID
    }
}

/**
 * InterestRateSwapsModal
 *
 * Props:
 * - show: boolean
 * - title: string
 * - stateStr: string (PB AddDialogValue serialized "k=v|k=v|...")
 * - onSubmit: function(newState)
 *
 * Backend-controlled (read-only):
 * - fixedRate (updates based on rateType selection)
 *
 * Actions (buttonId sent back):
 * - OFFER, SWAP_INFO, VIEW_LIST_OF_SWAP_CONTRACTS, TERMINATE_A_CONTRACT, EXIT
 */
export default function InterestRateSwapsModal({ show, title, stateStr, onSubmit }) {
    const [state, setState] = useState();

    const currentQuarter = state?.currentQuarter || 0
    const currentYear = state?.currentYear || 0

    useEffect(() => {
        if (!show || !stateStr) {
            setState(undefined);
            return;
        }

        const newState = {};
        stateStr?.trim().split('|').forEach((kv) => {
            const [k, v] = kv.split('=');
            if (k) newState[k.trim()] = v ? v.trim() : '';
        });

        const newNorm = normalizeState(newState);
        if (!api.isDifferent(newNorm, state)) return;

        let valueToSet;
        if (!state || !state.fixedRate || newNorm.forceUpdate > 0) {
            valueToSet = newNorm;
        } else {
            // merge: keep user edits; allow backend to refresh fixedRate + summary
            valueToSet = {
                ...state,
                fixedRate: newNorm.fixedRate,
                summaryMessage: newNorm.summaryMessage,
                summaryMessageType: newNorm.summaryMessageType,
            };
        }

        setState(valueToSet);
    }, [stateStr, show]);

    const { mergedState, errors, hasBlockingErrors } = useMemo(() => {
        if (!currentQuarter || !currentYear) {
            return { mergedState: {}, errors: {}, hasBlockingErrors: false };
        }

        const st = normalizeState(state || {});
        const v = validate(st, currentQuarter, currentYear);
        return { mergedState: st, errors: v.errors, hasBlockingErrors: v.hasBlockingErrors };
    }, [state, currentQuarter, currentYear]);

    // Keep backend in sync so it can recompute fixedRate as rateType changes.
    useEffect(() => {
        if (!show) return;
        if (!mergedState) return;
        if (hasBlockingErrors) return;

        api.modalResult(api.serialize(mergedState));
    }, [show, hasBlockingErrors, mergedState]);

    const setField = (key, value) => setState((prev) => ({ ...(prev || {}), [key]: toStr(value) }));

    const headerTitle = useMemo(() => {
        const name = mergedState.stockName?.trim();
        if (name) return `Create/Terminate Interest Rate Swap Derivative Contract for: ${name}`;
        return title || 'Interest Rate Swaps';
    }, [mergedState.stockName, title]);

    const exit = () => {
        api.modalResult(api.serialize({ ...mergedState, buttonId: "EXIT" }));
    }

    const submit = () => {
        if (!hasBlockingErrors && onSubmit) onSubmit(mergedState);
    };

    return html`
    <${Modal} show=${show} style="display: flex; flex-direction: column;">
      <div class="flex-1 min-h-0 p-3 overflow-y-auto">
        <div class="text-lg font-bold">${headerTitle}</div>

        <div class="mt-3 grid grid-cols-12 border-t border-gray-300">
          <!-- Rate Type -->
          <div class="col-span-12">
            <div class="flex mt-2 w-full gap-2 items-start">
              <div class="w-1/4 text-md">
                <div class="mb-2">Rate Type:</div>
              </div>
              <div class="w-3/4 flex flex-col items-center">
                <select
                  class="basic text-center w-full"
                  value=${mergedState.rateType}
                  onChange=${(e) => setField('rateType', e.target.value)}
                >
                  ${Object.entries(rateTypeOptions).map(([key, { description }]) =>
                      html`<option value=${key}>${description}</option>`
                  )}
                </select>
                <div class="flex justify-center mt-2" style="width: 300px; height: 100px">
                  <${AssetPriceChart} chartTitle=${rateTypeOptions[mergedState.rateType]?.description} assetId=${rateTypeOptions[mergedState.rateType]?.bondId} />
                </div>
              </div>
            </div>
          </div>

          <!-- Position -->
          <div class="col-span-12">
            <div class="flex items-center mt-2 w-full gap-2">
              <div class="w-1/4 text-right">Position:</div>
              <div class="w-3/4">
                <select
                  class="basic text-center w-full"
                  value=${mergedState.position}
                  onChange=${(e) => setField('position', e.target.value)}
                >
                  <option value="LONG">Long Position (Receive fixed rate during term)</option>
                  <option value="SHORT">Short Position (Pay fixed rate during term)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Amount -->
          <div class="col-span-12">
            <div class="flex items-center mt-2 w-full gap-2">
              <div class="w-1/4 text-right text-md">Notional Amount:</div>
              <div class="w-1/4">
                <input
                  type="text"
                  class=${inputClass(!!errors.notionalMillions)}
                  value=${mergedState.notionalMillions}
                  onInput=${(e) => {
              api.formatThousandsPreserveCaret(e);
              setField('notionalMillions', e.target.value);
          }}
                />
              </div>
              <div class="w-2/4 text-sm">Notional amount on which interest is to be computed (in millions)</div>
            </div>
            <div class="flex items-start w-full gap-2">
              <div class="w-1/4 text-right text-md"></div>
              <div class="w-1/4">
                ${errors.notionalMillions
              ? html`<div class="text-red-600 text-sm">${errors.notionalMillions.msg}</div>`
              : null}
              </div>
            </div>
          </div>

          <!-- Dates -->
          <div class="col-span-12 p-3 border-b border-gray-300">
            <div class="grid grid-cols-12 gap-3">
              <div class="col-span-12 md:col-span-6">
                <div class="mb-2">Beginning Quarter / Year:</div>
                <select
                  class=${`basic w-full ${errors.beginDate ? 'border border-red-500' : ''}`}
                  value=${formatQuarterValue(mergedState.beginQuarter, mergedState.beginYear)}
                  onChange=${(e) => {
                    const { quarter, year } = parseQuarterValue(e.target.value);
                    setField('beginQuarter', quarter);
                    setField('beginYear', year);
                  }}
                >
                  ${generateQuarterOptions(currentQuarter, currentYear, 1, 4).map(opt =>
                    html`<option value=${formatQuarterValue(opt.quarter, opt.year)}>${opt.label}</option>`
                  )}
                </select>
                ${errors.beginDate ? html`<div class="text-red-600 text-sm mt-1">${errors.beginDate.msg}</div>` : null}
              </div>

              <div class="col-span-12 md:col-span-6">
                <div class="mb-2">Final Quarter / Year:</div>
                <select
                  class=${`basic w-full ${errors.endDate ? 'border border-red-500' : ''}`}
                  value=${formatQuarterValue(mergedState.endQuarter, mergedState.endYear)}
                  onChange=${(e) => {
                    const { quarter, year } = parseQuarterValue(e.target.value);
                    setField('endQuarter', quarter);
                    setField('endYear', year);
                  }}
                >
                  ${generateQuarterOptions(currentQuarter, currentYear, 1, 21).map(opt =>
                    html`<option value=${formatQuarterValue(opt.quarter, opt.year)}>${opt.label}</option>`
                  )}
                </select>
                ${errors.endDate ? html`<div class="text-red-600 text-sm mt-1">${errors.endDate.msg}</div>` : null}
              </div>
            </div>

          </div>

        ${mergedState.summaryMessageType > 0 ? html`
          <div class="mt-3 text-sm border border-gray-300 p-2">
            <div class=${`font-bold ${mergedState.summaryMessageType == 3
                  ? 'negative'
                  : mergedState.summaryMessageType == 2
                      ? 'text-yellow-600'
                      : ''
              }`}>
              ${renderMultilineText(mergedState.summaryMessage)}
            </div>
          </div>
        ` : ''}

        </div> <!-- close grid grid-cols-12 -->

        <div class="mt-3 text-sm p-2 w-full">
          Select type of swap and position, notional principal amount, and applicable dates.
          Click 'OFFER' to find a counter-offer or acceptance of your offer from a counterparty for this proposed interest rate swap
        </div>
      </div>

      <div class="flex justify-end items-center p-3 flex-shrink-0">
        <div class="flex gap-2">
          <${Button} class="btn modal green" onClick=${() => submit()} disabled=${hasBlockingErrors}>
            OFFER
          </button>
          <${Button} class="btn modal" onClick=${() => exit()}>EXIT</button>
        </div>
      </div>
    <//>
  `;
}
