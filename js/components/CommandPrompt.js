import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import Modal from './Modal.js';
import Button from './Button.js';

const COMMAND_CATEGORIES = [
    { label: 'Trading - Stocks',          keys: ['BUY','SELL','SHORT','COVER'] },
    { label: 'Trading - Corp Bonds',      keys: ['BUYBOND','SELLBOND'] },
    { label: 'Trading - Govt Bonds',      keys: ['BUYLGOV','SELLLGOV','BUYSGOV','SELLSGOV'] },
    { label: 'Trading - Options',         keys: ['CALL','SELLCALL','PUT','SELLPUT','ADVOPTS'] },
    { label: 'Trading - Commodity Futures',keys: ['BUYFUT','SELLFUT','SHORTFUT','COVERFUT'] },
    { label: 'Trading - Physical Commodities', keys: ['BUYCOMM','SELLCOMM'] },
    { label: 'Trading - Crypto',          keys: ['BUYCRYPTO','SELLCRYPTO','BUYCFUT','SELLCFUT'] },
    { label: 'Finance',                   keys: ['BORROW','REPAY','PREPAY','ADVANCE','SWAPS','TBILLS','CHGBANK'] },
    { label: 'Corporate - Leadership',    keys: ['ELECT','RESIGN','MANAGERS'] },
    { label: 'Corporate - Strategy',      keys: ['DIVIDEND','PRODUCTIVITY','GROWTH','REBRAND','RESTRUCTURE'] },
    { label: 'Corporate - Equity',        keys: ['PSO','PPO','SPLIT','RSPLIT'] },
    { label: 'Corporate - Debt',          keys: ['ISSUEBOND','REDEEMBOND'] },
    { label: 'Corporate - Returns',       keys: ['EXTDIV','TAXFREE','TAXLIQ'] },
    { label: 'Corporate - Assets',        keys: ['BUYASSET','SELLASSET','OFFERASSET','SELLSUB','SPINOFF','BROWSE'] },
    { label: 'Corporate - M&A',           keys: ['MERGER','GREENMAIL','LBO','STARTUP','CONTRIB'] },
    { label: 'Hostile Actions',           keys: ['HARASS','RUMORS','ANTITRUST','LAWFIRM'] },
    { label: 'Accounting',               keys: ['INCREARN','DECREARN'] },
    { label: 'ETF / Advisory',           keys: ['FEE','AUTOPILOT'] },
    { label: 'Bank Operations',          keys: ['ALLOC','LISTLOANS','FREEZE','BUYBIZ','BUYCONS','SELLCONS','BUYMORT','SELLMORT','BUYSUBMORT','SELLSUBMORT'] },
];

export default function CommandPrompt() {
    const gameState = api.useGameStore(s => s.gameState);

    const [command, setCommand] = useState('');
    const inputRef = useRef(null);
    const caretRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [showHelp, setShowHelp] = useState(false);

    const tokens = useMemo(() => command.trim().split(/\s+/), [command]);
    const lastPart = useMemo(() => (tokens.length ? tokens[tokens.length - 1] : ''), [tokens]);

    const commands = Object.entries(api.commandMap).map(([key, { description }]) => ({
        symbol: key,
        name: description,
        id: 0,
        isCommand: true
    }));

    const entities = [
        { id: api.HUMAN1_ID, symbol: 'ME', name: 'Player (You)' },
        { id: api.HUMAN1_ID, symbol: 'PLAYER', name: gameState?.playerName || 'Player' },
    ].concat(gameState.allCompanies ?? []);

    const parts = (command ?? '').trim().toUpperCase().split(/\s+/);
    const cmdKey = parts[0];
    const operandStr = parts.length > 1 ? parts[parts.length - 1] : null;
    const cmdEntry = api.commandMap[cmdKey];

    const suggestions = useMemo(() => {

        if (command.trim() === '') return commands;

        const q = (lastPart || "").toUpperCase();
        if (!q) return [];

        // When no recognized command and multiple words typed, do a full-name search
        // so "NIPPON SECURITIES" finds NIPPON SECURITIES (NISK), not URBAN GROUP SECURITIES (UGS)
        if (!cmdEntry && tokens.length > 1) {
            const fullQ = command.trim().toUpperCase();
            return entities
                .filter(c => c.name?.toUpperCase().includes(fullQ))
                .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                .slice(0, 8);
        }

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
    }, [entities, lastPart, cmdEntry, tokens, command]);

    const resolveEntityId = (str) => {
        if (!str) return undefined;
        if (str === 'ME' || str === 'PLAYER') return api.HUMAN1_ID;
        if (/^P(\d+)$/.test(str)) return parseInt(str.slice(1));
        if (gameState?.playerName && str === gameState.playerName.toUpperCase()) return api.HUMAN1_ID;
        return api.getCompanyBySymbol(gameState?.allCompanies, str)?.id ?? undefined;
    };

    const resolvedId = useMemo(() => {
        // Multi-word input with no command: resolve by full company name (e.g. "NIPPON SECURITIES")
        if (!cmdEntry && tokens.length > 1) {
            const fullQ = parts.join(' ');
            return (gameState?.allCompanies || []).find(c =>
                c.name?.toUpperCase() === fullQ
            )?.id ?? undefined;
        }
        // Resolve operand (second token) for commands like "BUY AAPL"
        if (operandStr) return resolveEntityId(operandStr);
        // Resolve single token as entity when it's not a recognized command
        if (!cmdEntry && cmdKey) return resolveEntityId(cmdKey);
        return 0;
    }, [operandStr, cmdKey, cmdEntry, tokens, parts, gameState?.allCompanies, gameState?.playerName]);

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
            hints.push('↵ submit');
        }
        
        if (symU.startsWith(q) && symU !== q) {
            // symbol prefix -> we can complete remainder
            tail = sym.slice(lastPart.length);
            hints.push('⇥ autofill');
        } else {
            // name match -> show "(SYM)" to suggest which symbol would be completed
            tail = ` (${sym})`;
            hints.push('⇥ autofill');
        }

        if (suggestions.length > 1)
            hints.push(`↑/↓ up/down`);
        return { tail, hint: hints.join(' • ') };
    }

    // --- render ------------------------------------------------------------------
    const { tail, hint } = getOverlayAndHint();

    // Build the overlay text once
    const overlayText = html`${command}${tail ? html`${tail}` : ''}${hint ? html`  ${' '} ${hint}` : ''}`;

    const completeSuggestion = (suggestion) => {
        // Determine replacement symbol
        let sym;
        if (suggestion.isCommand) {
            sym = suggestion.symbol.toUpperCase();
        } else if (suggestion.id > 0 && suggestion.id <= 5) {
            sym = `P${suggestion.id}`;
        } else {
            sym = suggestion.symbol.toUpperCase();
        }

        // If first token is a recognized command and there's an operand,
        // replace just the last token. Otherwise replace entire input
        // (handles both command completion and multi-word company name searches).
        if (cmdEntry && tokens.length > 1) {
            const before = command.slice(0, command.length - lastPart.length);
            const next = (before + sym + ' ').toUpperCase();
            setCommand(next);
            caretRef.current = next.length;
        } else {
            const next = (sym + ' ').toUpperCase();
            setCommand(next);
            caretRef.current = next.length;
        }
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
        if (e.key === 'Enter' && command.trim()) {
            if (cmdEntry) {
                if (cmdEntry.takesId) {
                    if (resolvedId !== undefined) cmdEntry.fn(resolvedId);
                } else {
                    cmdEntry.fn();
                }
            } else if (resolvedId && resolvedId !== 0) {
                api.setViewAsset(resolvedId);
            }

            setCommand('');
            caretRef.current = 0;
            setOpen(false);
            // keep focus so the user can type the next command immediately
            return;
        }
        if (e.key === ' ') {
            e.stopPropagation();
            return;
        }
        if (e.key === 'Escape') {
            setOpen(false);
            inputRef.current?.blur();
            return;
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
            completeSuggestion(suggestions[activeIdx]);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            // inputRef.current.focus();
        }
    }, []);


    return html`
    <div style="position:relative; width:100%; display:flex; align-items:stretch; gap:0;">
      <${Button}
        class="btn"
        style="flex-shrink:0; padding:0 7px; font-weight:bold; font-size:14px; border-right:none; border-radius:0;"
        onClick=${() => setShowHelp(true)}
        title="Show all commands"
      >?<//>
      <div style="position:relative; flex:1; min-width:0;">
        <div class="command-line suggestion-overlay whitespace-nowrap" aria-hidden="true">
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
        ${open && suggestions.length ? html`
          <ul
            class="command-suggestions"
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
                onClick=${() => completeSuggestion(c)}
              >
                <span>${c.symbol.toUpperCase()}</span>
                <span style="opacity:0.7">${c.id ? c.name : html`<i>${c.name}</i>`}</span>
              </li>
            `)}
          </ul>
        ` : null}
      </div>

      ${showHelp ? html`
        <${Modal} show=${true} onClose=${() => setShowHelp(false)} class="modal-card" style="max-width:720px; max-height:80vh; display:flex; flex-direction:column;">
          <div class="flex justify-between items-center p-3 flex-shrink-0">
            <div class="text-lg font-bold">Command Reference</div>
            <${Button} class="btn p-2" onClick=${() => setShowHelp(false)}>Close<//>
          </div>
          <div class="px-3 pb-1 text-xs opacity-70 flex-shrink-0">
            Type a command in the prompt followed by a company symbol. e.g. <b>BUY AAPL</b>
          </div>
          <div style="overflow-y:auto; flex:1; min-height:0; padding:0 12px 12px;">
            ${COMMAND_CATEGORIES.map(cat => html`
              <div style="margin-top:10px;">
                <div class="text-sm font-bold opacity-80" style="margin-bottom:4px; border-bottom:1px solid #333; padding-bottom:2px;">${cat.label}</div>
                <div style="display:grid; grid-template-columns:auto 1fr; gap:2px 12px;">
                  ${cat.keys.map(k => {
                    const entry = api.commandMap[k];
                    if (!entry) return null;
                    return html`
                      <span class="font-mono text-sm" style="color:var(--accent-secondary);">${k}</span>
                      <span class="text-sm opacity-70">${entry.description}${entry.takesId ? html` <span style="opacity:0.5">[symbol]</span>` : ''}</span>
                    `;
                  })}
                </div>
              </div>
            `)}
          </div>
        <//>
      ` : null}
    </div>
  `;
}
