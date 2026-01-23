import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols, renderLines } from './helpers.js';
import Modal from './Modal.js';
import Button from './Button.js';


export default function InputStringModal({ show, title, text, defaultValue, onSubmit, onCancel }) {
    const [inputValue, setInputValue] = useState((defaultValue || '').trim());

    useEffect(() => {
        if (show) {
            setInputValue((defaultValue || '').trim());
        }
    }, [defaultValue, show]);

    if (text?.includes('_____')) {
        const data = text.split('_____');
        const lines = data[0].trim().split('\r');
        const options = data[1].trim().split('|').map(kv => kv.split('=')).map(([k, v]) => ({ value: k.trim(), label: v.trim() }));

        return html`<${Modal} show=${show}>
            <div>
                <div class="text-lg font-bold h-full">${insertCurrencySymbols(title)}</div>
                <br/>
                <div class="mb-4">${renderLines(lines)}</div>
                <select class="basic flex-grow w-full" value=${inputValue} onChange=${(e) => setInputValue(e.target.value)}>
                    ${options.map(opt => html`<option value=${opt.value}>${opt.label}</option>`)}
                </select>
            </div>
            <br/>
            <div class="flex justify-between items-center mb-4">
                <${Button} class="btn modal green" onClick=${() => { onSubmit(inputValue); }}>Submit</button>
                <${Button} class="btn modal" onClick=${onCancel}>Cancel</button>
            </div>
        <//>`;
    }

    return html`<${Modal} show=${show}>
        <div>
            <div class="text-lg font-bold h-full">${insertCurrencySymbols(title)}</div>
            <br/>
            <div class="mb-4">${insertCurrencySymbols(text)}</div>
            <input
                type="text"
                class="modal-input"
                value=${inputValue}
                onInput=${(e) => setInputValue(e.target.value)}
                onKeyDown=${(e) => {
                    if (e.key === 'Enter') {
                        onSubmit(inputValue);
                    }
                }}
            /><br/>
        </div>
        <br/>
        <div class="flex justify-between items-center mb-4">
            <${Button} class="btn modal green" onClick=${() => { onSubmit(inputValue); }}>Submit</button>
            <${Button} class="btn modal" onClick=${onCancel}>Cancel</button>
        </div>
    <//>`;
}