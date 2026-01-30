import { html, useEffect, useMemo, useState } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import * as api from '../api.js';
import { renderMultilineText } from './helpers.js';
import AssetPriceChart from './AssetPriceChart.js';
import Button from './Button.js';

function toStr(v) {
    return v == null ? '' : String(v).trim();
}

function clampInt(val, min, max) {
    const n = parseInt(val, 10);
    if (Number.isNaN(n)) return null;
    return Math.min(max, Math.max(min, n));
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

    // Quarter ranges
    const bqRaw = toStr(state.beginQuarter).trim();
    const eqRaw = toStr(state.endQuarter).trim();
    const byRaw = toStr(state.beginYear).trim();
    const eyRaw = toStr(state.endYear).trim();

    const curQ = parseInt(currentQuarter, 10);
    const curY = parseInt(currentYear, 10);
    const curIdx = qIndex(curQ, curY);

    const bq = bqRaw ? clampInt(bqRaw, 1, 4) : null;
    const eq = eqRaw ? clampInt(eqRaw, 1, 4) : null;

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

    // Begin Q/Y
    if (bqRaw) {
        if (bq == null) errors.beginQuarter = { msg: 'Quarter must be 1 to 4' };
        else if (String(bq) !== bqRaw) errors.beginQuarter = { msg: 'Quarter must be 1 to 4' };
    } else {
        errors.beginQuarter = { msg: 'Beginning quarter is required' };
    }

    if (byRaw) {
        const by = parseInt(byRaw, 10);
        if (Number.isNaN(by) || by < 1) errors.beginYear = { msg: 'Beginning year must be valid' };
    } else {
        errors.beginYear = { msg: 'Beginning year is required' };
    }

    // End Q/Y
    if (eqRaw) {
        if (eq == null) errors.endQuarter = { msg: 'Quarter must be 1 to 4' };
        else if (String(eq) !== eqRaw) errors.endQuarter = { msg: 'Quarter must be 1 to 4' };
    } else {
        errors.endQuarter = { msg: 'Final quarter is required' };
    }

    if (eyRaw) {
        const ey = parseInt(eyRaw, 10);
        if (Number.isNaN(ey) || ey < 1) errors.endYear = { msg: 'Final year must be valid' };
    } else {
        errors.endYear = { msg: 'Final year is required' };
    }

    // Relative date rules (only if we can compute indices)
    const beginIdx = bq != null ? qIndex(bq, parseInt(byRaw, 10)) : null;
    const endIdx = eq != null ? qIndex(eq, parseInt(eyRaw, 10)) : null;

    if (curIdx != null && beginIdx != null) {
        const beginFromNow = beginIdx - curIdx; // ((InputYear-CurrentYear)*4 + InputQuarter) - CurrentQuarter
        if (beginFromNow < 1) {
            errors.beginQuarter = { msg: 'Beginning date must be at least next quarter' };
            errors.beginYear = errors.beginYear || { msg: 'Beginning date must be at least next quarter' };
        } else if (beginFromNow > 4) {
            errors.beginQuarter = { msg: 'Beginning date must be no later than 4 quarters from now' };
            errors.beginYear = errors.beginYear || { msg: 'Beginning date must be no later than 4 quarters from now' };
        }
    }

    if (curIdx != null && endIdx != null) {
        const endFromNow = endIdx - curIdx;
        if (endFromNow < 1) {
            errors.endQuarter = { msg: 'Final date must be at least next quarter' };
            errors.endYear = errors.endYear || { msg: 'Final date must be at least next quarter' };
        } else if (endFromNow > 21) {
            errors.endQuarter = { msg: 'Final date cannot be more than 5 years from next quarter' };
            errors.endYear = errors.endYear || { msg: 'Final date cannot be more than 5 years from next quarter' };
        }
    }

    if (beginIdx != null && endIdx != null && endIdx < beginIdx) {
        errors.endQuarter = { msg: 'Final date must be after beginning date' };
        errors.endYear = errors.endYear || { msg: 'Final date must be after beginning date' };
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
                <div class="grid grid-cols-12 gap-2">
                  <div class="col-span-6">
                    <input
                      type="number"
                      min="1"
                      max="4"
                      class=${inputClass(!!errors.beginQuarter)}
                      value=${mergedState.beginQuarter}
                      onInput=${(e) => setField('beginQuarter', e.target.value)}
                      onBlur=${(e) => {
              const raw = toStr(e.target.value).trim();
              if (!raw) return;
              const clamped = clampInt(raw, 1, 4);
              if (clamped != null) setField('beginQuarter', String(clamped));
          }}
                    />
                    ${errors.beginQuarter ? html`<div class="text-red-600 text-sm mt-1">${errors.beginQuarter.msg}</div>` : null}
                  </div>
                  <div class="col-span-6">
                    <input
                      type="number"
                      class=${inputClass(!!errors.beginYear)}
                      value=${mergedState.beginYear}
                      onInput=${(e) => setField('beginYear', e.target.value)}
                    />
                    ${errors.beginYear ? html`<div class="text-red-600 text-sm mt-1">${errors.beginYear.msg}</div>` : null}
                  </div>
                </div>
              </div>

              <div class="col-span-12 md:col-span-6">
                <div class="mb-2">Final Quarter / Year:</div>
                <div class="grid grid-cols-12 gap-2">
                  <div class="col-span-6">
                    <input
                      type="number"
                      min="1"
                      max="4"
                      class=${inputClass(!!errors.endQuarter)}
                      value=${mergedState.endQuarter}
                      onInput=${(e) => setField('endQuarter', e.target.value)}
                      onBlur=${(e) => {
              const raw = toStr(e.target.value).trim();
              if (!raw) return;
              const clamped = clampInt(raw, 1, 4);
              if (clamped != null) setField('endQuarter', String(clamped));
          }}
                    />
                    ${errors.endQuarter ? html`<div class="text-red-600 text-sm mt-1">${errors.endQuarter.msg}</div>` : null}
                  </div>
                  <div class="col-span-6">
                    <input
                      type="number"
                      class=${inputClass(!!errors.endYear)}
                      value=${mergedState.endYear}
                      onInput=${(e) => setField('endYear', e.target.value)}
                    />
                    ${errors.endYear ? html`<div class="text-red-600 text-sm mt-1">${errors.endYear.msg}</div>` : null}
                  </div>
                </div>
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
