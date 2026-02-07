import { html, useEffect, useMemo, useState, useRef } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import * as api from '../api.js';
import { renderMultilineText } from './helpers.js';
import Button from './Button.js';

function toStr(v) {
    return v == null ? '' : String(v).trim();
}

function parseIntOrNull(val) {
    const s = toStr(val).trim();
    if (!s) return null;
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : null;
}

function inputClass(hasError) {
    return `modal-input w-full ${hasError ? 'border border-red-500 outline-red-500' : ''}`;
}

function normalizeState(inState) {
    const st = inState || {};
    return {
        stockName: toStr(st.stockName),
        primeAlloc: toStr(st.primeAlloc),
        subPrimeAlloc: toStr(st.subPrimeAlloc),
        consumAlloc: toStr(st.consumAlloc),
        bondAlloc: toStr(st.bondAlloc),
        cashEqvAlloc: toStr(st.cashEqvAlloc),
        summaryMessage: toStr(st.summaryMessage),
        summaryMessageType: toStr(st.summaryMessageType),
        forceUpdate: toStr(st.forceUpdate),
    };
}

function validate(state) {
    const errors = {};

    const prime = parseIntOrNull(state.primeAlloc);
    const subPrime = parseIntOrNull(state.subPrimeAlloc);
    const consum = parseIntOrNull(state.consumAlloc);
    const bond = parseIntOrNull(state.bondAlloc);
    const cashEqv = parseIntOrNull(state.cashEqvAlloc);

    // All fields must be valid numbers
    if (prime == null) errors.primeAlloc = { msg: 'Required' };
    if (subPrime == null) errors.subPrimeAlloc = { msg: 'Required' };
    if (consum == null) errors.consumAlloc = { msg: 'Required' };
    if (bond == null) errors.bondAlloc = { msg: 'Required' };
    if (cashEqv == null) errors.cashEqvAlloc = { msg: 'Required' };

    // Cash equivalents must be at least 10%
    if (cashEqv != null && cashEqv < 10) {
        errors.cashEqvAlloc = { msg: 'Must be at least 10%' };
    }

    // No negative values
    if (prime != null && prime < 0) errors.primeAlloc = { msg: 'Cannot be negative' };
    if (subPrime != null && subPrime < 0) errors.subPrimeAlloc = { msg: 'Cannot be negative' };
    if (consum != null && consum < 0) errors.consumAlloc = { msg: 'Cannot be negative' };
    if (bond != null && bond < 0) errors.bondAlloc = { msg: 'Cannot be negative' };
    if (cashEqv != null && cashEqv < 0) errors.cashEqvAlloc = { msg: 'Cannot be negative' };

    const hasBlockingErrors = Object.values(errors).some(Boolean);
    return { errors, hasBlockingErrors };
}

function calculateTotal(state) {
    const prime = parseIntOrNull(state.primeAlloc) || 0;
    const subPrime = parseIntOrNull(state.subPrimeAlloc) || 0;
    const consum = parseIntOrNull(state.consumAlloc) || 0;
    const bond = parseIntOrNull(state.bondAlloc) || 0;
    const cashEqv = parseIntOrNull(state.cashEqvAlloc) || 0;
    return prime + subPrime + consum + bond + cashEqv;
}

/**
 * BankAllocationModal
 *
 * Props:
 * - show: boolean
 * - title: string
 * - stateStr: string (PB AddDialogValue serialized "k=v|k=v|...")
 * - onSubmit: function(newState)
 *
 * Actions (buttonId sent back):
 * - APPLY, CANCEL, TURN_OFF
 */
export default function BankAllocationModal({ show, title, stateStr, onSubmit }) {
    const [state, setState] = useState();
    const primeInputRef = useRef(null);

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
        if (!state || !state.stockName || newNorm.forceUpdate > 0) {
            valueToSet = newNorm;
        } else {
            // merge: keep user edits; allow backend to refresh summary
            valueToSet = {
                ...state,
                summaryMessage: newNorm.summaryMessage,
                summaryMessageType: newNorm.summaryMessageType,
            };
        }

        setState(valueToSet);
    }, [stateStr, show]);

    const { mergedState, errors, hasBlockingErrors } = useMemo(() => {
        const st = normalizeState(state || {});
        const v = validate(st);
        return { mergedState: st, errors: v.errors, hasBlockingErrors: v.hasBlockingErrors };
    }, [state]);

    const total = useMemo(() => calculateTotal(mergedState), [mergedState]);
    const totalIsValid = total === 100;

    // Keep backend in sync
    useEffect(() => {
        if (!show) return;
        if (!mergedState) return;
        if (hasBlockingErrors) return;

        api.modalResult(api.serialize(mergedState));
    }, [show, hasBlockingErrors, mergedState]);

    // Auto-focus first input when modal shows
    useEffect(() => {
        if (!show) return;
        const t = setTimeout(() => {
            primeInputRef.current?.focus();
            primeInputRef.current?.select();
        }, 0);
        return () => clearTimeout(t);
    }, [show]);

    const setField = (key, value) => setState((prev) => ({ ...(prev || {}), [key]: toStr(value) }));

    const headerTitle = useMemo(() => {
        const name = mergedState.stockName?.trim();
        if (name) return `Bank Asset Allocation Strategy for: ${name}`;
        return title || 'Bank Asset Allocation Strategy';
    }, [mergedState.stockName, title]);

    const cancel = () => {
        api.modalResult(api.serialize({ ...mergedState, buttonId: "CANCEL" }));
    }

    const turnOff = () => {
        api.modalResult(api.serialize({ ...mergedState, buttonId: "TURN_OFF" }));
    }

    const submit = () => {
        if (totalIsValid && !hasBlockingErrors && onSubmit) {
            onSubmit(mergedState);
        }
    };

    const renderAllocationRow = (label, fieldKey, inputRef = null) => {
        return html`
            <div class="grid grid-cols-12 gap-2 items-center mb-2">
                <div class="col-span-6 font-bold">${label}</div>
                <div class="col-span-4">
                    <input
                        ref=${inputRef}
                        type="number"
                        min="0"
                        max="100"
                        class=${inputClass(!!errors[fieldKey])}
                        value=${mergedState[fieldKey]}
                        onInput=${(e) => setField(fieldKey, e.target.value)}
                    />
                </div>
                <div class="col-span-2 text-lg">%</div>
            </div>
            ${errors[fieldKey] ? html`
                <div class="col-span-12 text-red-600 text-sm -mt-1 mb-1">${errors[fieldKey].msg}</div>
            ` : null}
        `;
    };

    return html`
    <${Modal} show=${show} style="display: flex; flex-direction: column;">
      <div class="flex-1 min-h-0 p-3 overflow-y-auto">
        <div class="text-lg font-bold h-full">${title}</div>
        <br/>
        <div class="text-lg font-bold mb-2">${headerTitle}</div>

        <div class="grid grid-cols-12 gap-2 text-sm font-bold mb-2 items-center">
          <div class="col-span-6">Asset Class</div>
          <div class="col-span-4">Allocation</div>
          <div class="col-span-2"></div>
        </div>

        <div class="border-t border-gray-600 pt-2">
          ${renderAllocationRow('Prime Mortgages', 'primeAlloc', primeInputRef)}
          ${renderAllocationRow('Sub-prime Mortgages', 'subPrimeAlloc')}
          ${renderAllocationRow('Consumer Loans', 'consumAlloc')}
          ${renderAllocationRow('Bonds (Corp. & Govt.)', 'bondAlloc')}
          ${renderAllocationRow('Cash Equivalents**', 'cashEqvAlloc')}
        </div>

        <div class="border-t border-gray-600 pt-2 mt-2">
          <div class="grid grid-cols-12 gap-2 items-center">
            <div class="col-span-6 font-bold">Total</div>
            <div class="col-span-4">
              <span class="inline-block w-full px-2 py-1 ${totalIsValid ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'} rounded text-sm text-right">${total}</span>
            </div>
            <div class="col-span-2 text-lg">%</div>
          </div>
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
        Allocate bank assets, other than business loans and equities. Total must add up to 100%. ** Cash Equivalents must be at least 10%.
      </div>`}

      <div class="flex justify-end gap-2 p-3 flex-shrink-0 items-center">
        <${Button} class="btn modal" onClick=${() => turnOff()}>TURN OFF</button>
        <${Button} class="btn modal green" onClick=${() => submit()} disabled=${!totalIsValid || hasBlockingErrors}>APPLY</button>
        <${Button} class="btn modal" onClick=${() => cancel()}>CANCEL</button>
      </div>
    <//>
  `;
}
