import { renderHyperlinks } from '../api.js';
import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols } from './helpers.js';
import Modal from './Modal.js';
import { renderLines } from './helpers.js';
import { bracketLabel } from '../hotkeys.js';
import * as api from '../api.js';
import Button from './Button.js';


export default function TextAnnounceModal({ show, title, text, onSubmit, onCancel }) {
    const okButtonRef = useRef(null);

    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    const lines = useMemo(() => {
        return show && text ? text?.split('\r') : [];
    }, [show, text]);

    // Auto-focus OK button when modal shows
    useEffect(() => {
        if (!show) return;
        const t = setTimeout(() => {
            okButtonRef.current?.focus();
        }, 50);
        return () => clearTimeout(t);
    }, [show]);

    // Handle Enter key to close
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onCancel?.();
        }
    };

    return html`<${Modal} show=${show} onKeyDown=${handleKeyDown} class="text-announce-modal modal-card" style="display: flex; flex-direction: column;">
        <div class="flex-1 min-h-0 p-3 overflow-y-auto text-center">
            <div class="text-lg font-bold">${insertCurrencySymbols(title)}</div>
            <br/>
            ${lines.length > 0 ? html`<div class="mb-4 flex fixed-width text-left text-report-content">
                ${renderLines(lines, ({ id }) => { api.modalResult(id.toString().padStart(4, '0')); }, null, hyperlinkRegex)}
            </div>` : ''}
        </div>
        <div class="flex justify-between items-center p-3 flex-shrink-0">
            <div></div>
            <${Button} ref=${okButtonRef} class="btn modal green" data-testid="btn-close" onClick=${onCancel}>${bracketLabel('Close', 'C')}</button>
        </div>
    <//>`;
}