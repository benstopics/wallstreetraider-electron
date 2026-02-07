import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols, renderLines } from './helpers.js';
import Modal from './Modal.js';
import Button from './Button.js';
import { bracketLabel } from '../hotkeys.js';


export default function ConfirmModal({ show, title, text, onYes, onNo, onCancel }) {

    const lines = text?.trim().split('\r') || [];

    return html`<${Modal} show=${show} onClose=${onCancel} style="display: flex; flex-direction: column;">
        <div class="flex-1 min-h-0 p-3 overflow-y-auto">
            <div class="text-lg font-bold h-full text-center">${insertCurrencySymbols(title)}</div>
            <br/>
            <div class="mb-4">${renderLines(lines)}</div>
        </div>
        <div class="flex justify-between items-center p-3 flex-shrink-0">
            <${Button} class="btn modal green" onClick=${onYes}>${bracketLabel('Yes', 'Y')}</button>
            <${Button} class="btn modal red" onClick=${onNo}>${bracketLabel('No', 'N')}</button>
            ${onCancel ? html`<${Button} class="btn modal" onClick=${onCancel}>${bracketLabel('Cancel', 'C')}</button>` : ''}
        </div>
    <//>`;
}