import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';


export default function InputStringModal({ show, title, text, defaultValue, onSubmit, onCancel }) {
    const [inputValue, setInputValue] = useState(defaultValue || '');

    useEffect(() => {
        setInputValue(defaultValue || '');
    }, [defaultValue]);

    if (text?.includes('_____')) {
        const data = text.split('_____');
        const actualText = data[0].trim();
        const options = data[1].trim().split('|').map(kv => kv.split('=')).map(([k, v]) => ({ value: k.trim(), label: v.trim() }));

        return html`<${Modal} show=${show}>
            <div>
                <div class="text-lg font-bold h-full">${title}</div>
                <br/>
                <div class="mb-4">${actualText}</div>
                <select class="basic flex-grow w-full" value=${inputValue} onChange=${(e) => setInputValue(e.target.value)}>
                    ${options.map(opt => html`<option value=${opt.value}>${opt.label}</option>`)}
                </select>
            </div>
            <br/>
            <div class="flex justify-between items-center mb-4">
                <button class="btn modal green" onClick=${() => { onSubmit(inputValue); }}>Submit</button>
                <button class="btn modal" onClick=${onCancel}>Cancel</button>
            </div>
        <//>`;
    }

    return html`<${Modal} show=${show}>
        <div>
            <div class="text-lg font-bold h-full">${title}</div>
            <br/>
            <div class="mb-4">${text}</div>
            <input type="text" class="modal-input" value=${inputValue} onInput=${(e) => setInputValue(e.target.value)} /><br/>
        </div>
        <br/>
        <div class="flex justify-between items-center mb-4">
            <button class="btn modal green" onClick=${() => { onSubmit(inputValue); }}>Submit</button>
            <button class="btn modal" onClick=${onCancel}>Cancel</button>
        </div>
    <//>`;
}