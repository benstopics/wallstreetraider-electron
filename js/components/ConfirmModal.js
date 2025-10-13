import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';


export default function ConfirmModal({ show, title, text, onYes, onNo, onCancel }) {
    return html`<${Modal} show=${show} onClose=${onCancel}>
        <div>
            <div class="text-lg font-bold h-full">${title}</div>
            <br/>
            <div class="mb-4">${text}</div>
        </div>
        <br/>
        <div class="flex justify-between items-center mb-4">
            <button class="btn modal green" onClick=${onYes}>Yes</button>
            <button class="btn modal red" onClick=${onNo}>No</button>
            ${onCancel ? html`<button class="btn modal" onClick=${onCancel}>Cancel</button>` : ''}
        </div>
    <//>`;
}