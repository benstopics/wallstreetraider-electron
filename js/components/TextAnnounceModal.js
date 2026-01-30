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
    }, [show, text]);

    return html`<${Modal} show=${show} class="text-announce-modal modal-card" style="display: flex; flex-direction: column;">
        <div class="flex-1 min-h-0 p-3 overflow-y-auto text-center">
            <div class="text-lg font-bold h-full">${insertCurrencySymbols(title)}</div>
            <br/>
            ${lines.length > 0 ? html`<div class="mb-4 justify-center flex fixed-width">
                ${renderLines(lines, ({ id }) => { api.modalResult(id.toString().padStart(4, '0')); }, null, hyperlinkRegex)}
            </div>` : ''}
        </div>
        <div class="flex justify-between items-center p-3 flex-shrink-0">
            <div></div>
            <${Button} class="btn modal" onClick=${onCancel}>CLOSE</button>
        </div>
    <//>`;
}