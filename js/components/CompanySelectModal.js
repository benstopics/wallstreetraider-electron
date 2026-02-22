import { html, useState, useRef, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols } from './helpers.js';
import Modal from './Modal.js';
import Button from './Button.js';
import * as api from '../api.js';

export default function CompanySelectModal({ show, title, text, onSubmit, defaultValue }) {
    const gameState = api.useGameStore(s => s.gameState);
    const [query, setQuery] = useState('');
    const [activeIdx, setActiveIdx] = useState(0);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const inputRef = useRef(null);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];

    useEffect(() => {
        if (show && gameState.allCompanies?.length > 0) {
            setQuery('');
            setActiveIdx(0);
            const defaultCompany = defaultValue ? gameState.allCompanies.find(c => c.id.toString() === defaultValue.trim()) : null;
            setSelectedCompany(defaultCompany);
            setQuery(defaultCompany ? defaultCompany.name?.toUpperCase() || '' : '');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [show]);

    const entities = useMemo(() => {
        return (gameState.allCompanies ?? [])
            .filter(c => title.includes('Change the Bank') ? c.industryId === api.BANK_IND
                : title.includes('A COMPANY YOU CONTROL') ? api.isPlayerControlled(controlledCompanies, c.id)
                : true);
    }, [gameState.allCompanies, title]);

    const suggestions = useMemo(() => {
        const q = (query || '').toUpperCase().trim();
        if (!q) return [];

        const tagged = entities
            .filter(c =>
                c.symbol?.toUpperCase().includes(q) ||
                c.name?.toUpperCase().includes(q)
            )
            .map(c => {
                const symU = (c.symbol || '').toUpperCase();
                const nameU = (c.name || '').toUpperCase();

                let matchType = 'none';
                if (symU === q) matchType = 'fullSymbol';
                else if (symU.startsWith(q)) matchType = 'prefixSymbol';
                else if (nameU.includes(q)) matchType = 'nameMatch';

                return { ...c, matchType };
            });

        tagged.sort((a, b) => {
            const rank = t => (
                t === 'fullSymbol' ? 0 :
                    t === 'prefixSymbol' ? 1 :
                        t === 'nameMatch' ? 2 : 3
            );
            const ra = rank(a.matchType), rb = rank(b.matchType);
            if (ra !== rb) return ra - rb;
            const la = (a.symbol || '').length;
            const lb = (b.symbol || '').length;
            if (la !== lb) return la - lb;
            return (a.symbol || '').localeCompare(b.symbol || '');
        });

        return tagged.slice(0, 10);
    }, [entities, query]);

    const selectCompany = (company) => {
        if (company && company.id) {
            setSelectedCompany(company);
            setQuery(company.symbol?.toUpperCase() || '');
        }
    };

    const handleSubmit = () => {
        if (selectedCompany) {
            onSubmit(selectedCompany.id.toString());
        } else if (suggestions.length > 0) {
            onSubmit(suggestions[activeIdx].id.toString());
        }
    };

    const handleCancel = () => {
        onSubmit("");
    };

    // Overlay/hint computation (like CommandPrompt)
    function getOverlayAndHint() {
        if (selectedCompany) {
            return { tail: '', hint: '\u21B5 submit' };
        }

        const active = suggestions[activeIdx] ?? suggestions[0];
        if (!active || !query.trim()) return { tail: '', hint: '' };

        const q = query.toUpperCase().trim();
        const sym = active.symbol || '';
        const symU = sym.toUpperCase();

        let tail = '';
        let hints = [];

        if (symU === q) {
            tail = '';
            hints.push('\u21B5 submit');
        }

        if (suggestions.length > 1) {
            hints.push('\u2191/\u2193 up/down');

            if (symU.startsWith(q) && symU !== q) {
                tail = sym.slice(query.trim().length);
                hints.push('\u21E5 autofill');
            } else if (symU !== q) {
                tail = ` (${sym})`;
                hints.push('\u21E5 autofill');
            }
        }
        return { tail, hint: hints.join(' \u2022 ') };
    }

    const { tail, hint } = getOverlayAndHint();

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            handleCancel();
            return;
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            if (suggestions.length > 0) {
                selectCompany(suggestions[activeIdx]);
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (suggestions.length > 0) {
                setActiveIdx((activeIdx + 1) % suggestions.length);
                setSelectedCompany(null);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (suggestions.length > 0) {
                setActiveIdx((activeIdx - 1 + suggestions.length) % suggestions.length);
                setSelectedCompany(null);
            }
        }
    };

    const onInput = (e) => {
        setQuery(e.target.value);
        setActiveIdx(0);
        setSelectedCompany(null);
    };

    return html`<${Modal} show=${show} onClose=${handleCancel} style="display: flex; flex-direction: column;">
        <div class="flex-1 min-h-0 p-3 overflow-y-auto">
            <div class="text-lg font-bold text-center">${insertCurrencySymbols(title)}</div>
            <br/>
            <div class="mb-4">${insertCurrencySymbols(text)}</div>
            <div style="position:relative;">
                <div style="position:relative; width:100%;">
                    <div class="command-line suggestion-overlay" aria-hidden="true">${query}${tail ? html`<span style="color:#888">${tail}</span>` : ''}${hint ? html`<span style="color:#666; margin-left:8px;">${hint}</span>` : ''}</div>
                    <input
                        ref=${inputRef}
                        type="text"
                        class="command-line"
                        placeholder="Type symbol or name..."
                        value=${query.toUpperCase()}
                        onInput=${onInput}
                        onKeyDown=${onKeyDown}
                        autocomplete="off"
                        spellcheck="false"
                        style="width:600px; background:transparent; position:relative; z-index:1;"
                    />
                </div>
                ${selectedCompany ? html`
                    <div style="padding:8px; color:#4f4; font-size:0.9em;">
                        Selected: ${selectedCompany.symbol?.toUpperCase()} - ${selectedCompany.name}
                    </div>
                ` : suggestions.length > 0 ? html`
                    <ul style="
                        max-height:200px; overflow:auto;
                        border:1px solid #444; background:#111;
                        padding:4px 0; margin:4px 0 0 0;
                        list-style:none;
                    ">
                        ${suggestions.map((c, i) => html`
                            <li
                                key=${c.id}
                                style="
                                    padding:6px 10px; cursor:pointer;
                                    display:flex; justify-content:space-between; gap:8px;
                                    background:${i === activeIdx ? '#333' : 'transparent'};
                                "
                                onMouseDown=${(e) => e.preventDefault()}
                                onClick=${() => { setActiveIdx(i); selectCompany(c); }}
                            >
                                <span style="font-weight:bold;">${c.symbol?.toUpperCase()}</span>
                                <span style="opacity:0.7">${c.name}</span>
                            </li>
                        `)}
                    </ul>
                ` : query.trim() ? html`
                    <div style="padding:8px; color:#888; font-style:italic;">No matches found</div>
                ` : null}
            </div>
        </div>
        <div class="flex justify-between items-center p-3 flex-shrink-0">
            <${Button} class="btn modal green" onClick=${handleSubmit}>Submit</button>
            <${Button} class="btn modal" onClick=${handleCancel}>Cancel</button>
        </div>
    <//>`;
}
