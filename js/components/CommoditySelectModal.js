import { html, useState, useRef, useEffect } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import Button from './Button.js';
import * as api from '../api.js';
import { insertCurrencySymbols } from './helpers.js';

/**
 * CommoditySelectModal — sibling of CompanySelectModal for commodity picking.
 *
 * Props:
 *   show        — boolean
 *   title       — string
 *   text        — string
 *   onSubmit    — function(idString); "" == cancel
 *   defaultValue — optional preselected commodity id as string
 *   filter      — optional (commodity) => boolean
 */

// Matches SetSelectedCommodity in ui.inc:784-799
const COMMODITIES = [
    { id: api.STOCK_INDEX_ID, symbol: 'SPX',  name: 'Stock Index',       kind: 'index'  },
    { id: api.OIL_ID,         symbol: 'OIL',  name: 'Oil',               kind: 'phys'   },
    { id: api.GOLD_ID,        symbol: 'GOLD', name: 'Gold',              kind: 'phys'   },
    { id: api.SILVER_ID,      symbol: 'SILV', name: 'Silver',            kind: 'phys'   },
    { id: api.WHEAT_ID,       symbol: 'WHT',  name: 'Wheat',             kind: 'phys'   },
    { id: api.CORN_ID,        symbol: 'CORN', name: 'Corn',              kind: 'phys'   },
    { id: api.BITCOIN_ID,     symbol: 'BTC',  name: 'Bitcoin',           kind: 'crypto' },
    { id: api.ETHEREUM_ID,    symbol: 'ETH',  name: 'Ethereum',          kind: 'crypto' },
];

export default function CommoditySelectModal({ show, title, text, onSubmit, defaultValue, filter }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const containerRef = useRef(null);

    const list = filter ? COMMODITIES.filter(filter) : COMMODITIES;

    useEffect(() => {
        if (!show) return;
        const defaultIdx = defaultValue != null
            ? list.findIndex(c => c.id.toString() === defaultValue.toString().trim())
            : -1;
        setActiveIdx(defaultIdx >= 0 ? defaultIdx : 0);
        setTimeout(() => containerRef.current?.focus(), 50);
    }, [show]);

    const submit = (id) => onSubmit(id.toString());
    const cancel = () => onSubmit('');

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (list[activeIdx]) submit(list[activeIdx].id);
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            cancel();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx((activeIdx + 1) % list.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((activeIdx - 1 + list.length) % list.length);
        }
    };

    return html`<${Modal} show=${show} onClose=${cancel} style=${{ '--modal-w': '380px', '--modal-h': 'auto' }}>
        <div
            ref=${containerRef}
            tabindex="0"
            onKeyDown=${onKeyDown}
            style="outline: none; display: flex; flex-direction: column;"
        >
            <div class="p-4">
                <div class="text-lg font-bold text-center mb-2">${insertCurrencySymbols(title || 'Select Commodity')}</div>
                ${text ? html`<div class="text-center mb-4" style="color: #aaa; font-size: 13px;">${insertCurrencySymbols(text)}</div>` : ''}
                <div class="flex flex-col gap-1">
                    ${list.length === 0 ? html`
                        <div style="text-align:center; opacity:0.6; padding: 12px 0;">No commodities available.</div>
                    ` : list.map((c, i) => html`
                        <${Button}
                            key=${c.id}
                            class="btn ${c.kind === 'crypto' ? 'orange' : c.kind === 'index' ? 'blue' : 'green'} w-full"
                            style="
                                display:flex; justify-content:space-between; align-items:center;
                                padding: 8px 12px;
                                ${i === activeIdx ? 'outline: 2px solid #fff;' : ''}
                            "
                            onMouseDown=${(e) => e.preventDefault()}
                            onMouseEnter=${() => setActiveIdx(i)}
                            onClick=${() => submit(c.id)}
                        >
                            <span style="font-weight:600;">${c.symbol}</span>
                            <span style="opacity:0.85;">${c.name}</span>
                        <//>
                    `)}
                </div>
                <div style="margin-top: 10px; font-size: 11px; color: #888; text-align: center;">
                    ↑/↓ navigate • Enter submit • Esc cancel
                </div>
            </div>
            <div class="flex justify-center p-3 flex-shrink-0">
                <${Button} class="btn modal" data-testid="btn-cancel" onClick=${cancel}>Cancel<//>
            </div>
        </div>
    <//>`;
}
