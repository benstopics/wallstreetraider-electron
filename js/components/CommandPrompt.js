import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';

export default function CommandPrompt() {
    const gameState = api.useGameStore(s => s.gameState);

    const [command, setCommand] = useState('');
    const inputRef = useRef(null);
    const caretRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    const tokens = useMemo(() => command.trimStart().split(/\s+/), [command]);
    const lastPart = useMemo(() => (tokens.length ? tokens[tokens.length - 1] : ''), [tokens]);

    const commands = Object.entries(api.commandMap).map(([key, { description }]) => ({
        symbol: key,
        name: description,
        id: 0
    }));

    const entities = [{ id: api.HUMAN1_ID, symbol: '', name: 'Player (You)' }]
        .concat(gameState.allCompanies ?? []);

    const suggestions = useMemo(() => {

        if (command.trim() === '') return commands;

        const q = (lastPart || "").toUpperCase();
        if (!q) return [];

        const base = commands.concat(entities);

        const tagged = base
            .filter(c =>
                c.symbol?.toUpperCase().startsWith(q) ||
                c.name?.toUpperCase().includes(q) ||
                (q.startsWith('P') && c.id <= 5)
            )
            .map(c => {
                const symU = (c.symbol || '').toUpperCase();
                const nameU = (c.name || '').toUpperCase();

                let matchType = 'none';
                if (symU === q) matchType = 'fullSymbol';
                else if (symU.startsWith(q)) matchType = 'prefixSymbol';
                else if (nameU.includes(q)) matchType = 'nameMatch';
                else if (q.startsWith('P') && c.id <= 5) matchType = 'special';

                return { ...c, matchType };
            });

        // Priority: fullSymbol (shortest symbol first) -> prefixSymbol (shortest first)
        // -> nameMatch (alphabetical) -> special (last)
        tagged.sort((a, b) => {
            const rank = t => (
                t === 'fullSymbol' ? 0 :
                    t === 'prefixSymbol' ? 1 :
                        t === 'nameMatch' ? 2 :
                            3
            );
            const ra = rank(a.matchType), rb = rank(b.matchType);
            if (ra !== rb) return ra - rb;

            // within same bucket, prefer shorter symbol
            const la = (a.symbol || '').length;
            const lb = (b.symbol || '').length;
            if (la !== lb) return la - lb;

            // stable tie-break
            return (a.symbol || '').localeCompare(b.symbol || '');
        });

        return tagged.slice(0, 8);
    }, [entities, lastPart]);

    const parts = (command ?? '').trim().toUpperCase().split(/\s+/);

    const cmdFn = api.commandMap[parts[0]]?.fn;
    const operand = parts.length === 1 ? parts[0] : parts[-1];
    const cmdId = api.getCompanyBySymbol(gameState.allCompanies, operand)?.id ?? (operand == 'ME' ? HUMAN1_ID : undefined);

    // --- overlay/hint computation ------------------------------------------------
    function getOverlayAndHint() {
        const active = suggestions[activeIdx] ?? suggestions[0];

        if (!active || !lastPart) return { tail: '', hint: '' };

        const q = lastPart.toUpperCase();
        const sym = active.symbol || '';
        const symU = sym.toUpperCase();

        // remaining tail to show inline in the overlay (ghost completion)
        let tail = '';
        let hints = [];

        if (symU === q) {
            // exact/full symbol match -> ready to execute
            tail = ''; // nothing to complete
            hints.push('↵ to execute');
        }
        
        if (symU.startsWith(q) && symU !== q) {
            // symbol prefix -> we can complete remainder
            tail = sym.slice(lastPart.length);
            hints.push('⇥ to complete');
        } else {
            // name match -> show "(SYM)" to suggest which symbol would be completed
            tail = ` (${sym})`;
            hints.push('⇥ to complete');
        }

        if (suggestions.length > 1)
            hints.push(`${activeIdx + 1}/${suggestions.length} ↑/↓ to navigate`);
        return { tail, hint: hints.join(' • ') };
    }

    // --- render ------------------------------------------------------------------
    const { tail, hint } = getOverlayAndHint();

    // Build the overlay text once
    const overlayText = html`${command}${tail ? html`${tail}` : ''}${hint ? html`  ${' '} ${hint}` : ''}`;

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
        const next = el.value.toUpperCase().replaceAll(/`/g, '');
        setCommand(next);
        setOpen(true);
        e.preventDefault();
        e.stopPropagation();
    };

    useLayoutEffect(() => {
        if (caretRef.current != null && inputRef.current) {
            inputRef.current.setSelectionRange(caretRef.current, caretRef.current);
            caretRef.current = null;
        }
    }, [command]);

    const onKeyDown = (e) => {
        console.log('KeyDown', { key: e.key });
        if (e.key === 'Enter' && command.trim()) {

            if ((cmdId ?? false) && !cmdFn) {
                api.setViewAsset(cmdId);
            } else if (cmd) {
                cmdFn(id, gameState);
            }

            setCommand('');
            caretRef.current = 0;
            setOpen(false);
            return;
        }
        if (e.key === ' ') {
            e.stopPropagation();
            return;
        }
        if (e.key === 'Escape') {
            if (open)
                setOpen(false);
            else
                inputRef.current?.blur();
        }
        if (!open || !suggestions.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx((activeIdx + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((activeIdx - 1 + suggestions.length) % suggestions.length);
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
            // inputRef.current.focus();
        }
    }, []);

    return html`
    <div style="position:relative; width:100%;">
      <div style="position:relative; width:100%;">
        <div class="command-line suggestion-overlay" aria-hidden="true">
            ${overlayText}
        </div>
        <input
          ref=${inputRef}
          class="command-line"
          type="text"
          placeholder=${open ? "Type company symbol/name • ↑/↓ to navigate" : "Enter command..."}
          value=${command}
          onInput=${onInput}
          onFocus=${() => suggestions.length && setOpen(true)}
          onBlur=${() => setTimeout(() => setOpen(false), 100)}
          onKeyDown=${onKeyDown}
          autocomplete="off"
          spellcheck="false"
          style="background:transparent; position:relative; z-index:1;"
        />
      </div>
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
