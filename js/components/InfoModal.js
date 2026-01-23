import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols, renderLines } from './helpers.js';
import Modal from './Modal.js';
import Button from './Button.js';


export default function InfoModal({ show, text, onClose }) {

    const lines = text?.trim().split('\r') || [];

    return html`<${Modal} show=${show} onClose=${onClose}>
        <div class="h-full p-3">
            <div>
                ${renderLines(lines)}
            </div>
        </div>
        <br/>
        <div class="flex justify-between items-center mb-4">
            <div></div>
            <${Button} class="btn modal green" onClick=${onClose}>OK</button>
        </div>
    <//>`;
}