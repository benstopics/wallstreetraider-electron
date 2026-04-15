import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols, renderLines } from './helpers.js';
import * as api from '../api.js';
import Modal from './Modal.js';
import Button from './Button.js';


export default function InfoModal({ show, title, text, onClose }) {
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const okButtonRef = useRef(null);

    const lines = text?.trim().split('\r') || [];

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
            onClose?.();
        }
    };

    // Check if title contains picture delimiter "|||"
    // Format: "Title Text|||picturename.bmp"
    let displayTitle = title || '';
    let pictureName = null;

    if (title && title.includes('|||')) {
        const parts = title.split('|||');
        displayTitle = parts[0];
        pictureName = parts[1];
    }

    // Determine if we have a picture to show
    const hasPicture = pictureName && pictureName.length > 0;

    return html`<${Modal} show=${show} onClose=${onClose} onKeyDown=${handleKeyDown} style="display: flex; flex-direction: column; ${hasPicture ? 'max-width: 500px;' : ''}">
        ${hasPicture && html`
            <div class="text-center p-2 border-b border-gray-600">
                <div class="font-bold text-lg mb-2">${displayTitle}</div>
                <img
                    src=${"assets/" + pictureName}
                    alt=${displayTitle}
                    style="max-width: 100%; height: auto; max-height: 50vh; margin: auto; border-radius: 4px;"
                    onError=${(e) => { e.target.style.display = 'none'; }}
                />
            </div>
        `}
        <div class="flex-1 min-h-0 p-3 overflow-y-auto">
            <div>
                ${renderLines(lines, null, null, null)}
            </div>
        </div>
        <div class="flex justify-between items-center p-3 flex-shrink-0">
            <div></div>
            <button ref=${okButtonRef} class="btn modal green" data-testid="btn-close" onClick=${onClose}>Close</button>
        </div>
    <//>`;
}