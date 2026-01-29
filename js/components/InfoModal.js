import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols, renderLines } from './helpers.js';
import Modal from './Modal.js';
import Button from './Button.js';


export default function InfoModal({ show, text, onClose }) {

    const lines = text?.trim().split('\r') || [];

    return html`<${Modal} show=${show} onClose=${onClose} style="display: flex; flex-direction: column;">
        <div class="flex-1 min-h-0 p-3 overflow-y-auto">
            <div>
                ${renderLines(lines)}
            </div>
        </div>
        <div class="flex justify-between items-center p-3 flex-shrink-0">
            <div></div>
            <${Button} class="btn modal green" onClick=${onClose}>OK</button>
        </div>
    <//>`;
}