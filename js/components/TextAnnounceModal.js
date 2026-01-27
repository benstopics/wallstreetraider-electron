import { renderHyperlinks } from '../api.js';
import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols } from './helpers.js';
import Modal from './Modal.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import Button from './Button.js';


export default function TextAnnounceModal({ show, title, text, onSubmit, onCancel }) {

    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    const lines = useMemo(() => {
        return show && text ? text?.split('\r') : [];
    }, [text]);

    return html`<${Modal} show=${show} class="text-announce-modal modal-card">
        <div class="text-center">
            <div class="text-lg font-bold h-full">${insertCurrencySymbols(title)}</div>
            <br/>
            ${lines.length > 0 && html`<div class="mb-4 overflow-y-auto justify-center flex fixed-width" style="max-height: 75vh">
                ${renderLines(lines, ({ type, id }) => { api.modalResult(type + id.toString().padStart(4, '0')); }, null, hyperlinkRegex)}
            </div>`}
        </div>
        <br/>
        <div class="flex justify-between items-center mb-4">
            <div></div>
            <${Button} class="btn modal" onClick=${onCancel}>CLOSE</button>
        </div>
    <//>`;
}