import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols, renderLines } from './helpers.js';
import Modal from './Modal.js';
import Button from './Button.js';


export default function InputStringModal({ show, title, text, defaultValue, onSubmit, onCancel }) {
    const [inputValue, setInputValue] = useState((defaultValue || '').trim());
    const inputRef = useRef(null);
    const selectRef = useRef(null);
    const inputValueRef = useRef(inputValue);
    inputValueRef.current = inputValue;

    useEffect(() => {
        if (show) {
            setInputValue((defaultValue || '').trim());
        }
    }, [defaultValue, show]);

    // Auto-focus input or select when modal shows
    useEffect(() => {
        if (!show) return;
        const t = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
            } else if (selectRef.current) {
                selectRef.current.focus();
            }
        }, 0);
        return () => clearTimeout(t);
    }, [show]);

    // Guard: ignore letter shortcuts briefly after modal opens (prevents key repeat from prior modal)
    const letterReadyRef = useRef(false);
    useEffect(() => {
        if (!show) { letterReadyRef.current = false; return; }
        const t = setTimeout(() => { letterReadyRef.current = true; }, 200);
        return () => clearTimeout(t);
    }, [show]);

    // Keyboard shortcuts for modal buttons
    useEffect(() => {
        if (!show) return;
        const isSelectVariant = text?.includes('_____');
        const isLoadGameDialog = title?.includes('Load Saved Game');
        const handleKey = (e) => {
            // ESC is handled by Modal.js via onClose — no duplicate needed here
            // For text input variant: Enter submits (already handled on the input itself)
            // For select variant: Enter also submits
            if (e.key === 'Enter' && isSelectVariant) {
                e.preventDefault();
                onSubmit(inputValueRef.current);
                return;
            }
            // Letter shortcuts only work in select variant, or when text input looks like a number
            if (!letterReadyRef.current) return;
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            const key = e.key.toLowerCase();
            if (!isSelectVariant) {
                // For text input: allow S/C as hotkeys when value looks numeric
                const val = inputValueRef.current;
                if (val.length > 0 && /\d/.test(val[0])) {
                    const digitCount = (val.match(/\d/g) || []).length;
                    if (digitCount / val.length > 0.5) {
                        if (key === 's') { e.preventDefault(); onSubmit(val); return; }
                        if (key === 'c') { e.preventDefault(); onCancel(); return; }
                    }
                }
                return;
            }
            if (key === 's') { e.preventDefault(); onSubmit(inputValueRef.current); }
            else if (key === 'c') { e.preventDefault(); onCancel(); }
            else if (key === 'd' && isLoadGameDialog && inputValueRef.current) {
                e.preventDefault();
                onSubmit(inputValueRef.current + '|DELETE');
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [show, text, title]);

    if (text?.includes('_____')) {
        const data = text.split('_____');
        const lines = data[0].trim().split('\r');
        const options = data[1].trim().split('|').map(kv => kv.split('=')).map(([k, v]) => ({ value: k.trim(), label: v.trim() }));

        // Check if this is the Load Saved Game dialog
        const isLoadGameDialog = title?.includes('Load Saved Game');

        // Default to first option if inputValue is empty (select shows first option
        // visually but inputValue stays "" until user interacts with the dropdown)
        if (!inputValue && options.length > 0 && options[0].value) {
            setInputValue(options[0].value);
        }

        return html`<${Modal} show=${show} onClose=${onCancel} style="display: flex; flex-direction: column;">
            <div class="flex-1 min-h-0 p-3 overflow-y-auto">
                <div class="text-lg font-bold text-center">${insertCurrencySymbols(title)}</div>
                <br/>
                <div class="mb-4">${renderLines(lines)}</div>
                <div class="flex gap-2 items-center">
                    <select ref=${selectRef} class="basic flex-grow" value=${inputValue} onChange=${(e) => setInputValue(e.target.value)}>
                        ${options.map(opt => html`<option value=${opt.value}>${opt.label}</option>`)}
                    </select>
                    ${isLoadGameDialog && inputValue ? html`
                        <${Button} class="btn modal red" data-testid="btn-delete" onClick=${() => { onSubmit(inputValue + '|DELETE'); }}>Delete</button>
                    ` : ''}
                </div>
            </div>
            <div class="flex justify-between items-center p-3 flex-shrink-0">
                <${Button} class="btn modal green" data-testid="btn-submit" onClick=${() => { onSubmit(inputValue); }}>Submit</button>
                <${Button} class="btn modal" data-testid="btn-cancel" onClick=${onCancel}>Cancel</button>
            </div>
        <//>`;
    }

    return html`<${Modal} show=${show} onClose=${onCancel} style="display: flex; flex-direction: column;">
        <div class="flex-1 min-h-0 p-3 overflow-y-auto">
            <div class="text-lg font-bold text-center">${insertCurrencySymbols(title)}</div>
            <br/>
            <div class="mb-4">${insertCurrencySymbols(text)}</div>
            <input
                ref=${inputRef}
                type="text"
                class="modal-input"
                data-testid="modal-input"
                value=${inputValue}
                onInput=${(e) => setInputValue(e.target.value)}
                onKeyDown=${(e) => {
                    if (e.key === 'Enter') {
                        onSubmit(inputValue);
                    }
                }}
            /><br/>
        </div>
        <div class="flex justify-between items-center p-3 flex-shrink-0">
            <${Button} class="btn modal green" data-testid="btn-submit" onClick=${() => { onSubmit(inputValue); }}>Submit</button>
            <${Button} class="btn modal" data-testid="btn-cancel" onClick=${onCancel}>Cancel</button>
        </div>
    <//>`;
}