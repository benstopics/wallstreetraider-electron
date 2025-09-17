import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';

export default function CommandPrompt({ gameState }) {
    const [command, setCommand] = useState('');
    const inputRef = useRef(null);
    const caretRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    const tokens = useMemo(() => command.trimStart().split(/\s+/), [command]);
    const lastPart = useMemo(() => (tokens.length ? tokens[tokens.length - 1] : ''), [tokens]);

    const entities = [
        ...gameState.allCompanies,
        // ...gameState.allPlayers.map(p => ({...p, symbol: `P${p.id}`})),
    ];

    const suggestions = useMemo(() => {
        const q = lastPart.toUpperCase();
        if (!q) return [];
        // filter by symbol prefix; map to display "SYM (Name)"
        const suggestions = Object.entries(api.commandMap).map(([key, { description }]) => ({
            symbol: key,
            name: description
        })).sort((a, b) => a.symbol.localeCompare(b.symbol))
            .concat({ id: api.PLAYER1_ID, symbol: 'ME', name: 'Player (You)' })
            .concat(entities.sort((a, b) => a.symbol.localeCompare(b.symbol)))
            .filter(c => c.symbol?.toUpperCase().startsWith(q)
                || c.name?.toUpperCase().includes(q)
                || (q.startsWith(`P`) && c.id <= 5)
            ).slice(0, 8);
        if (suggestions.length > 0)

            return suggestions
    }, [entities, lastPart]);

    const replaceLastPart = (sym) => {
        const before = command.slice(0, command.length - lastPart.length);
        const next = (before + sym + ' ').toUpperCase();
        setCommand(next);
        caretRef.current = (before + sym + ' ').length;
        setOpen(false);
        setActiveIdx(0);
    };

    const onInput = (e) => {
        const el = e.currentTarget;
        caretRef.current = el.selectionStart;
        const next = el.value.toUpperCase();
        setCommand(next);
        setOpen(true);
    };

    useLayoutEffect(() => {
        if (caretRef.current != null && inputRef.current) {
            inputRef.current.setSelectionRange(caretRef.current, caretRef.current);
            caretRef.current = null;
        }
    }, [command]);

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && command.trim()) {
            if (open && suggestions.length) {
                e.preventDefault();
                replaceLastPart(suggestions[activeIdx].symbol.toUpperCase());
                return;
            }
            api.executeCommand(gameState, command.trim());
            setCommand('');
            caretRef.current = 0;
            setOpen(false);
            return;
        }
        if (!open || !suggestions.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx((activeIdx + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((activeIdx - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Escape') {
            setOpen(false);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const suggestion = suggestions[activeIdx];
            if (suggestion.id <= 5)
                replaceLastPart(`P${suggestion.id}`);
            else
                replaceLastPart(suggestion.symbol.toUpperCase());
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return html`
    <div style="position:relative">
      <input
        ref=${inputRef}
        class="command-line"
        type="text"
        placeholder="Enter command..."
        value=${command}
        onInput=${onInput}
        onFocus=${() => suggestions.length && setOpen(true)}
        onBlur=${() => setTimeout(() => setOpen(false), 100)}
        onKeyDown=${onKeyDown}
        autocomplete="off"
        spellcheck="false"
      />
      ${open && suggestions.length ? html`
        <ul
          class="basic"
          style="
            position:absolute; left:0; right:0; top:100%; z-index:50;
            max-height:180px; overflow:auto; border:1px solid #444; background:#111; padding:4px 0; margin:4px 0 0 0;
          "
        >
          ${suggestions.map((c, i) => html`
            <li
              key=${c.id}
              class="${i === activeIdx ? 'active' : ''}"
              style="
                padding:6px 10px; cursor:pointer;
                display:flex; justify-content:space-between; gap:8px;
              "
              onMouseDown=${(e) => { e.preventDefault(); }} 
              onClick=${() => replaceLastPart(c.symbol.toUpperCase())}
            >
              <span>${c.symbol.toUpperCase()}</span>
              <span style="opacity:0.7">${c.id ? c.name : html`<i>${c.name}</i>`}</span>
            </li>
          `)}
        </ul>
      ` : null}
    </div>
  `;
}
