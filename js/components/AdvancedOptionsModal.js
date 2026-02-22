import { html, useEffect, useMemo, useState } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import * as api from '../api.js';
import InTheMoneyChart from './InTheMoneyChart.js';
import { renderMultilineText } from './helpers.js';
import Button from './Button.js';

/**
 * AdvancedOptionsModal
 *
 * Props:
 * - show: boolean
 * - stateStr: object (mirrors PB AddDialogValue keys)
 * - title: string
 * - onSubmit: (newStateObj) => void
 * - onCancel: () => void
 *
 * Expected state keys (strings):
 * bsPutEntry1..4, putStrike1..4, putExp1..4, putNumOpt1..4, putPrice1..4
 * bsCallEntry1..4, callStrike1..4, callExp1..4, callNumOpt1..4, callPrice1..4
 * loStrike, hiStrike, startExpRange, endExpRange
 * stockName, stockPrice
 */

const ROWS = [1, 2, 3, 4];

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
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

function parseExpMMYYYY(s) {
    const str = toStr(s).trim();
    if (!str) return null;
    const m = str.match(/^(\d{1,2})\s*\/\s*(\d{4})$/);
    if (!m) return null;
    const mm = parseInt(m[1], 10);
    const yyyy = parseInt(m[2], 10);
    if (mm < 1 || mm > 12) return null;
    return { mm, yyyy, key: yyyy * 100 + mm };
}

function expInRange(expStr, startStr, endStr) {
    const e = parseExpMMYYYY(expStr);
    const s = parseExpMMYYYY(startStr);
    const t = parseExpMMYYYY(endStr);
    if (!e || !s || !t) return null; // cannot validate
    return e.key >= s.key && e.key <= t.key;
}

function inputClass(hasError) {
    return `modal-input w-full ${hasError ? 'border border-red-500 outline-red-500' : ''}`;
}

function normalizeState(inState) {
    const st = inState || {};
    const out = {
        loStrike: toStr(st.loStrike),
        hiStrike: toStr(st.hiStrike),
        startExpRange: toStr(st.startExpRange),
        endExpRange: toStr(st.endExpRange),

        stockName: toStr(st.stockName),
        stockPrice: toStr(st.stockPrice),

        outstandingShares: toStr(st.outstandingShares),
        summaryMessage: toStr(st.summaryMessage),
        summaryMessageType: toStr(st.summaryMessageType),
        forceUpdate: toStr(st.forceUpdate),
    };

    for (const i of ROWS) {
        out[`bsPutEntry${i}`] = toStr(st[`bsPutEntry${i}`]);
        out[`putStrike${i}`] = toStr(st[`putStrike${i}`]);
        out[`putExp${i}`] = toStr(st[`putExp${i}`]);
        out[`putNumOpt${i}`] = toStr(st[`putNumOpt${i}`]);
        out[`putPrice${i}`] = toStr(st[`putPrice${i}`]);

        out[`bsCallEntry${i}`] = toStr(st[`bsCallEntry${i}`]);
        out[`callStrike${i}`] = toStr(st[`callStrike${i}`]);
        out[`callExp${i}`] = toStr(st[`callExp${i}`]);
        out[`callNumOpt${i}`] = toStr(st[`callNumOpt${i}`]);
        out[`callPrice${i}`] = toStr(st[`callPrice${i}`]);

        out[`outstandingShares`] = toStr(st[`outstandingShares`]);

        out[`summaryMessage`] = toStr(st[`summaryMessage`]);
        out[`summaryMessageType`] = toStr(st[`summaryMessageType`]);
    }

    return out;
}

function hasAnyNonEmpty(fields) {
    return fields.some((v) => toStr(v).trim().length > 0);
}

function validateRows(state, side /* 'put' | 'call' */) {
    const lo = parseFloatOrNull(state.loStrike);
    const hi = parseFloatOrNull(state.hiStrike);
    const startExp = state.startExpRange;
    const endExp = state.endExpRange;

    const errors = {};
    for (const i of ROWS) {
        const bsKey = `bs${side === 'put' ? 'Put' : 'Call'}Entry${i}`;
        const strikeKey = `${side}Strike${i}`;
        const expKey = `${side}Exp${i}`;
        const numKey = `${side}NumOpt${i}`;
        const priceKey = `${side}Price${i}`;

        const bs = toStr(state[bsKey]).trim();
        const strikeStr = toStr(state[strikeKey]).trim();
        const expStr = toStr(state[expKey]).trim();
        const numStr = toStr(state[numKey]).trim();
        const priceStr = toStr(state[priceKey]).trim();

        const rowTouched = hasAnyNonEmpty([strikeStr, expStr, numStr, priceStr]);
        const rowActive = rowTouched || (bs === 'B' || bs === 'S');

        // Auto-default Buy/Sell to "B" if user starts filling the row.
        if (rowTouched && !bs) {
            errors[bsKey] = { type: 'auto_default', msg: '' };
        } else if (bs && bs !== 'B' && bs !== 'S') {
            errors[bsKey] = { type: 'invalid', msg: 'Choose B or S' };
        }

        // Strike is required when row has Buy/Sell selected or other fields filled
        if (rowActive && !strikeStr) {
            errors[strikeKey] = { type: 'required', msg: 'Strike price is required' };
        } else if (strikeStr) {
            const strike = parseFloatOrNull(strikeStr);
            if (strike == null) {
                errors[strikeKey] = { type: 'invalid', msg: 'Strike must be a number' };
            } else if (lo != null && hi != null && (strike < lo || strike > hi)) {
                errors[strikeKey] = { type: 'range', msg: `Strike must be between ${lo} and ${hi}` };
            }
        }

        // Expiration is required when row is active
        if (rowActive && !expStr) {
            errors[expKey] = { type: 'required', msg: 'Expiration date is required' };
        } else if (expStr) {
            const parsed = parseExpMMYYYY(expStr);
            if (!parsed) {
                errors[expKey] = { type: 'invalid', msg: 'Use MM/YYYY (4-digit year)' };
            } else {
                const inRange = expInRange(expStr, startExp, endExp);
                if (inRange === false) {
                    errors[expKey] = { type: 'range', msg: `Exp must be between ${startExp} and ${endExp}` };
                }
            }
        }

        // Number of options is required when row is active
        if (rowActive && !numStr) {
            errors[numKey] = { type: 'required', msg: '% options is required' };
        } else if (numStr) {
            const raw = parseInt(numStr, 10);
            if (Number.isNaN(raw)) {
                errors[numKey] = { type: 'invalid', msg: 'Must be 1 to 10' };
            } else if (raw < 1 || raw > 10) {
                errors[numKey] = { type: 'range', msg: 'Must be 1 to 10' };
            }
        }
    }
    return errors;
}

function applyAutoDefaults(state, rowErrors) {
    const out = { ...state };
    Object.keys(rowErrors).forEach((k) => {
        if (rowErrors[k]?.type === 'auto_default') {
            out[k] = 'B';
            delete rowErrors[k];
        }
    });
    return out;
}

export default function AdvancedOptionsModal({ show, title, stateStr, onSubmit }) {
    const [state, setState] = useState();
    const dlrSign = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro = api.useGameStore(s => s.gameState.euro) || '';

    useEffect(() => {
        if (!show || !stateStr) {
            setState(undefined);
        }

        const newState = {};
        stateStr?.trim().split('|').forEach((kv) => {
            const [k, v] = kv.split('=');
            if (k) newState[k.trim()] = v ? v.trim() : '';
        });

        const newStateNorm = normalizeState(newState);
        if (!api.isDifferent(newStateNorm, state)) return;

        let valueToSet;
        if (!state || !state.outstandingShares || newStateNorm.forceUpdate > 0) {
            valueToSet = newStateNorm;
        } else {
            valueToSet = {
                ...state,
                putPrice1: newStateNorm.putPrice1,
                putPrice2: newStateNorm.putPrice2,
                putPrice3: newStateNorm.putPrice3,
                putPrice4: newStateNorm.putPrice4,
                callPrice1: newStateNorm.callPrice1,
                callPrice2: newStateNorm.callPrice2,
                callPrice3: newStateNorm.callPrice3,
                callPrice4: newStateNorm.callPrice4,
                outstandingShares: newStateNorm.outstandingShares,
                summaryMessage: newStateNorm.summaryMessage,
                summaryMessageType: newStateNorm.summaryMessageType,
            };
        }

        setState(valueToSet);
    }, [stateStr, show]);

    const { mergedState, errors, hasSyncBlockingErrors, hasSubmitBlockingErrors } = useMemo(() => {
        const st = { ...state };

        const putErr = validateRows(st, 'put');
        const callErr = validateRows(st, 'call');
        const allErr = { ...putErr, ...callErr };

        const st2 = applyAutoDefaults(st, allErr);

        const putErr2 = validateRows(st2, 'put');
        const callErr2 = validateRows(st2, 'call');
        const allErr2 = { ...putErr2, ...callErr2 };

        // Sync-blocking: only invalid/range errors (not 'required' - user may still be typing)
        const syncBlocking = Object.values(allErr2).some((e) => e && e.type !== 'required');
        // Submit-blocking: all errors including required fields
        const submitBlocking = Object.values(allErr2).some((e) => e);
        return { mergedState: st2, errors: allErr2, hasSyncBlockingErrors: syncBlocking, hasSubmitBlockingErrors: submitBlocking };
    }, [state]);

    useEffect(() => {
        if (!show) return;
        if (!onSubmit) return;
        if (hasSyncBlockingErrors) return;

        api.modalResult(api.serialize(mergedState));
    }, [show, hasSyncBlockingErrors, mergedState]);

    const setField = (key, value) => setState((prev) => ({ ...prev, [key]: toStr(value) }));

    const clearAll = () => {
        setState(normalizeState({}));
        api.modalResult(api.serialize({}));
    };

    const onCalc = () => { api.modalResult(api.serialize({ ...state, buttonId: "CALC" })); };
    const onHelp = () => { api.modalResult(api.serialize({ ...state, buttonId: "HELP" })); };
    const onShowSizeLimits = () => { api.modalResult(api.serialize({ ...state, buttonId: "SHOW_SIZE_LIMITS" })); };
    const onAutoTrade = () => { api.modalResult(api.serialize({ ...state, buttonId: "AUTOTRADE" })); };
    const onListOptions = () => { api.modalResult(api.serialize({ ...state, buttonId: "LIST_OPTIONS" })); };
    const onCloseAll = () => { api.modalResult(api.serialize({ ...state, buttonId: "CLOSE_ALL_OPTIONS" })); };
    const onCancel = () => { api.modalResult(api.serialize({ ...state, buttonId: "CLOSE" })); };

    const submit = () => {
        if (!hasSubmitBlockingErrors && onSubmit) onSubmit(mergedState);
    };

    const renderRow = (side, i) => {
        const bsKey = `bs${side === 'put' ? 'Put' : 'Call'}Entry${i}`;
        const strikeKey = `${side}Strike${i}`;
        const expKey = `${side}Exp${i}`;
        const numKey = `${side}NumOpt${i}`;
        const priceKey = `${side}Price${i}`;

        const isPut = side === 'put';

        return html`
      <div class="grid grid-cols-12 gap-2 items-center mb-2">
        <div class="col-span-2 font-bold">${isPut ? 'PUT' : 'CALL'}</div>

        <div class="col-span-2">
          <select class=${inputClass(!!errors[bsKey])} value=${mergedState[bsKey]} onChange=${(e) => setField(bsKey, e.target.value)}>
            <option value=""> </option>
            <option value="B">Buy</option>
            <option value="S">Sell</option>
          </select>
        </div>

        <div class="col-span-2">
          <input type="number" step="1" class=${inputClass(!!errors[strikeKey])} value=${mergedState[strikeKey]} onInput=${(e) => setField(strikeKey, e.target.value)} />
        </div>

        <div class="col-span-2">
          <input type="text" placeholder="MM/YYYY" class=${inputClass(!!errors[expKey])} value=${mergedState[expKey]} onInput=${(e) => setField(expKey, e.target.value)} />
        </div>

        <div class="col-span-2">
          <input
            type="number"
            min="1"
            max="10"
            class=${inputClass(!!errors[numKey])}
            value=${mergedState[numKey]}
            onInput=${(e) => setField(numKey, e.target.value)}
            onBlur=${(e) => {
                const raw = toStr(e.target.value).trim();
                if (!raw) return;
                const clamped = clampInt(raw, 1, 10);
                if (clamped != null) setField(numKey, String(clamped));
            }}
          />
        </div>

        <div class="col-span-2 text-right">
          <span class="inline-block w-full px-2 py-1 bg-gray-700 text-white rounded text-sm">${mergedState[priceKey] || '-'}</span>
        </div>

        ${errors[bsKey] || errors[strikeKey] || errors[expKey] || errors[numKey]
                ? html`<div class="col-span-12 text-red-600 text-sm -mt-1">
              ${errors[bsKey]?.msg || errors[strikeKey]?.msg || errors[expKey]?.msg || errors[numKey]?.msg}
            </div>`
                : null}
      </div>
    `;
    };

    const headerTitle = useMemo(() => {
        const name = mergedState.stockName?.trim();
        const price = mergedState.stockPrice?.trim();
        if (name && price) return `Stock / Price: ${name} / ${price}`;
        if (name) return `Stock: ${name}`;
        return 'Advanced Options Trading Station';
    }, [mergedState.stockName, mergedState.stockPrice]);

    const strikeRangeText = useMemo(() => {
        const lo = mergedState.loStrike?.trim();
        const hi = mergedState.hiStrike?.trim();
        if (lo && hi) return `(${dlrSign}${lo}${euro} to ${dlrSign}${hi}${euro})`;
        return '';
    }, [mergedState.loStrike, mergedState.hiStrike, dlrSign, euro]);

    const expRangeText = useMemo(() => {
        const s = mergedState.startExpRange?.trim();
        const e = mergedState.endExpRange?.trim();
        if (s && e) return `${s} to ${e}`;
        return '';
    }, [mergedState.startExpRange, mergedState.endExpRange]);

    return html`
    <${Modal} show=${show} style="display: flex; flex-direction: column;">
      <div class="flex-1 min-h-0 p-3 overflow-y-auto">
        <div class="text-lg font-bold text-center">${title}</div>
        <br/>
        <div class="text-lg font-bold mb-2">${headerTitle}</div>

        <${InTheMoneyChart}
          contracts=${ROWS.flatMap((i) => {
              const contracts = [];
              const bsPut = mergedState[`bsPutEntry${i}`]?.trim();
              const putStrike = parseFloatOrNull(mergedState[`putStrike${i}`]);
              const putNumOpt = parseInt(mergedState[`putNumOpt${i}`], 10);
              const putPrice = parseFloatOrNull(mergedState[`putPrice${i}`]);
              if (bsPut && putStrike != null && putNumOpt != null && putPrice != null) {
                  contracts.push({
                      type: 'PUT',
                      bs: bsPut,
                      strike: putStrike,
                      pct: putNumOpt,
                      pricePerPct: putPrice,
                  });
              }
              const bsCall = mergedState[`bsCallEntry${i}`]?.trim();
              const callStrike = parseFloatOrNull(mergedState[`callStrike${i}`]);
              const callNumOpt = parseInt(mergedState[`callNumOpt${i}`], 10);
              const callPrice = parseFloatOrNull(mergedState[`callPrice${i}`]);
              if (bsCall && callStrike != null && callNumOpt != null && callPrice != null) {
                  contracts.push({
                      type: 'CALL',
                      bs: bsCall,
                      strike: callStrike,
                      pct: callNumOpt,
                      pricePerPct: callPrice,
                  });
              }
              return contracts;
          })}
          totalSharesM=${(mergedState.outstandingShares || 1000000) / 1000000}
          currentPrice=${parseFloatOrNull(mergedState.stockPrice)}
          theme=${api.DEFAULT_ASSET_PRICE_CHART_THEME}
          profitColor="#008000"
          lossColor="#FF0000"
          breakevenLineColor="#808080"
          points=${120}
        />

        <div class="grid grid-cols-12 gap-2 text-sm font-bold mb-2 items-center">
          <div class="col-span-2">Option Type</div>
          <div class="col-span-2">Buy/Sell<br/><span class="font-normal">(B or S)</span></div>
          <div class="col-span-2">Strike Price<br/><span class="font-normal">${strikeRangeText}</span></div>
          <div class="col-span-2">Exp. Date<br/><span class="font-normal">${expRangeText}</span></div>
          <div class="col-span-2">% Options<br/><span class="font-normal">(1% to 10%)</span></div>
          <div class="col-span-2">Opt. Price</div>
        </div>

        <div class="border-t border-gray-600 pt-2">
          ${ROWS.map((i) => renderRow('put', i))}
        </div>

        <div class="border-gray-300 pt-2 mt-3">
          ${ROWS.map((i) => renderRow('call', i))}
        </div>
      </div>
    ${mergedState.summaryMessageType > 0 ? html`
            <div class="mt-3 text-sm border border-gray-300 p-2">
                <div class=${`font-bold ${
                mergedState.summaryMessageType == 3
                    ? 'negative'
                    : mergedState.summaryMessageType == 2
                    ? 'text-yellow-600'
                  : ''
            }`}>
              ${renderMultilineText(mergedState.summaryMessage)}
            </div>
          </div>
        ` : html`<div class="mt-3 text-sm border border-gray-300 p-2">
        Enter details for multiple options contracts, then click on SUBMIT to create all of the options at once, such as straddles, strangles, etc..
    </div>`}

      <div class="flex justify-end gap-2 p-3 flex-shrink-0 items-center">
      
        <div class="my-4 flex flex-wrap gap-2">
            <${Button} class="btn modal" onClick=${onCalc}>CALC</button>
            <${Button} class="btn modal" onClick=${clearAll}>CLEAR ALL</button>
            <${Button} class="btn modal" onClick=${onHelp}>HELP</button>
            <${Button} class="btn modal" onClick=${onShowSizeLimits}>SHOW SIZE LIMITS</button>
            <${Button} class="btn modal" onClick=${onAutoTrade}>AUTO-TRADE</button>
            <${Button} class="btn modal" onClick=${onListOptions}>LIST OPTIONS</button>
            <${Button} class="btn modal" onClick=${onCloseAll}>CLOSE ALL OPTIONS</button>
        </div>
        
        <${Button} class="btn modal green" onClick=${submit} disabled=${hasSubmitBlockingErrors}>SUBMIT</button>
        <${Button} class="btn modal" onClick=${onCancel}>CLOSE</button>
      </div>
    <//>
  `;
}
