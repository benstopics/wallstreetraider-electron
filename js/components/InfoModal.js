import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';


export default function InfoModal({ show, text, onClose }) {
    return html`<${Modal} show=${show} onClose=${onClose}>
        ${(text ?? '').split(/\r\r|\r|\n/).map((line, index) => html`
            <div key=${index} className="mb-2">
                ${line}
            </div>
        `)}
        <br/>
        <div class="flex justify-between items-center mb-4">
            <div></div>
            <button class="btn modal green" onClick=${onClose}>OK</button>
        </div>
    <//>`;
}