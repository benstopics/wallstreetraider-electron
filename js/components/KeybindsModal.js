import { html, useEffect, useMemo, useState } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import Modal from './Modal.js';
import * as api from '../api.js';
import {
  loadCompanyKeybinds,
  saveCompanyKeybinds,
  clearCompanyKeybinds,
  loadGlobalKeybinds,
  saveGlobalKeybinds,
  clearGlobalKeybinds,
  GLOBAL_ACTIONS,
  formatCode,
  isEditableTarget,
  isForbiddenKey,
  eventToBindCode,
} from '../keybinds.js';
import Button from './Button.js';

const cloneObj = (x) => {
  try {
    if (typeof structuredClone === 'function') return structuredClone(x);
  } catch {
    // ignore
  }
  return JSON.parse(JSON.stringify(x ?? {}));
};

function ensureRows(options, bindings) {
  const optionIds = new Set((options || []).map((o) => Number(o.id)));
  const byId = new Map();
  for (const b of bindings || []) {
    if (!b || !Number.isFinite(Number(b.companyId))) continue;
    const id = Number(b.companyId);
    // Drop bindings for entities that are no longer available/controlled.
    if (!optionIds.has(id)) continue;

    byId.set(id, {
      companyId: id,
      primary: b.primary ?? null,
      secondary: b.secondary ?? null,
    });
  }

  // Ensure every option has a row so UI never breaks
  for (const opt of options) {
    const id = Number(opt.id);
    if (!byId.has(id)) byId.set(id, { companyId: id, primary: null, secondary: null });
  }

  return [...byId.values()];
}

function clearDuplicateCodes(rows, code, exceptCompanyId) {
  if (!code) return rows;
  return rows.map((r) => {
    if (r.companyId === exceptCompanyId) return r;
    const next = { ...r };
    if (next.primary === code) next.primary = null;
    if (next.secondary === code) next.secondary = null;
    return next;
  });
}

export default function KeybindsModal({ show, onClose }) {
  const playerId = api.useGameStore((s) => s.gameState.playerId);
  const playerName = api.useGameStore((s) => s.gameState.playerName);
  const controlledCompanies = api.useGameStore((s) => s.gameState.controlledCompanies) || [];
  const allCompanies = api.useGameStore((s) => s.gameState.allCompanies) || [];

  // Build a fast lookup so the Company Hotkeys table always shows clean names/symbols.
  const companyInfoById = useMemo(() => {
    const m = new Map();
    for (const c of allCompanies || []) {
      const id = Number(c?.id ?? c?.companyId ?? c?.company_id);
      if (!Number.isFinite(id)) continue;
      const name = c?.name ?? c?.companyName ?? c?.company_name;
      const symbol = c?.symbol ?? c?.ticker ?? c?.stockSymbol ?? c?.stock_symbol;
      m.set(id, { name: name || `ID ${id}`, symbol: symbol || '' });
    }
    return m;
  }, [allCompanies]);

  const options = useMemo(() => {
    const player = { id: playerId, name: playerName, symbol: '' };
    const normalized = (controlledCompanies || []).map((c) => {
      const id = Number(c?.id ?? c?.companyId ?? c?.company_id);
      const fallback = companyInfoById.get(id);
      return {
        id,
        name: c?.name || fallback?.name || `ID ${id}`,
        symbol: c?.symbol || c?.ticker || fallback?.symbol || ''
      };
    }).filter((c) => Number.isFinite(c.id));

    // Keep stable ordering: player first, then by name
    const rest = normalized.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return [player, ...rest];
  }, [playerId, playerName, controlledCompanies, companyInfoById]);

  const [rows, setRows] = useState(() => ensureRows(options, loadCompanyKeybinds()));
  const [globalBinds, setGlobalBinds] = useState(() => loadGlobalKeybinds());
  // Single-bind UI: one key per action/company (we still store under "primary" for backwards compat)
  const [listening, setListening] = useState(null); // { kind:'company'|'action', companyId?, actionId? }

  // Keep rows in sync when controlledCompanies changes
  useEffect(() => {
    setRows((prev) => ensureRows(options, prev));
  }, [options]);

  // Mark UI as "keybinds open" so global hotkeys don't fire
  useEffect(() => {
    if (!show) return;
    window.__wsrKeybindsOpen = true;
    return () => {
      window.__wsrKeybindsOpen = false;
    };
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const onKeyDown = (e) => {
      if (!listening) return;
      if (isEditableTarget(e.target)) return;

      // Escape cancels listening
      if (e.key === 'Escape') {
        setListening(null);
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const bindCode = eventToBindCode(e);
      if (!bindCode) return;
      if (isForbiddenKey(bindCode) || isForbiddenKey(e.code)) {
        // Ignore forbidden keys (like Space) to avoid breaking core UI
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Clear duplicates across BOTH global + company bindings
      const clearFromGlobal = (gb, exceptActionId) => {
        const next = cloneObj(gb);
        for (const a of GLOBAL_ACTIONS) {
          if (a.id === exceptActionId) continue;
          if (next?.[a.id]?.primary === bindCode) next[a.id].primary = null;
          if (next?.[a.id]?.secondary === bindCode) next[a.id].secondary = null;
        }
        return next;
      };

      if (listening.kind === 'action') {
        setGlobalBinds((prev) => {
          let next = cloneObj(prev || loadGlobalKeybinds());
          // clear duplicates in other actions
          next = clearFromGlobal(next, listening.actionId);
          // clear duplicates in company rows
          setRows((prevRows) => {
            let nr = prevRows.map((r) => ({ ...r }));
            nr = clearDuplicateCodes(nr, bindCode, -999999); // clear from all
            saveCompanyKeybinds(nr);
            return nr;
          });
          if (!next[listening.actionId]) next[listening.actionId] = { primary: null, secondary: null };
          next[listening.actionId].primary = bindCode;
          next[listening.actionId].secondary = null;
          saveGlobalKeybinds(next);
          return next;
        });
      } else {
        // company binding
        setRows((prev) => {
          let next = prev.map((r) => ({ ...r }));
          next = clearDuplicateCodes(next, bindCode, listening.companyId);
          next = next.map((r) => {
            if (r.companyId !== listening.companyId) return r;
            return {
              ...r,
              primary: bindCode,
              secondary: null,
            };
          });
          saveCompanyKeybinds(next);
          return next;
        });
        // also clear from global binds
        setGlobalBinds((prev) => {
          const next = clearFromGlobal(cloneObj(prev || loadGlobalKeybinds()), null);
          saveGlobalKeybinds(next);
          return next;
        });
      }

      setListening(null);
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [show, listening]);

  const close = () => {
    setListening(null);
    onClose?.();
  };

  const resetAll = () => {
    clearCompanyKeybinds();
    clearGlobalKeybinds();
    setRows((prev) => {
      const next = prev.map((r) => ({ ...r, primary: null, secondary: null }));
      return next;
    });
    setGlobalBinds(loadGlobalKeybinds());
  };

  const resetRow = (companyId) => {
    setRows((prev) => {
      const next = prev.map((r) => (r.companyId === companyId ? { ...r, primary: null, secondary: null } : r));
      saveCompanyKeybinds(next);
      return next;
    });
  };

  const clearSlot = (companyId, slot) => {
    // Single-bind: clear primary and always null secondary
    setRows((prev) => {
      const next = prev.map((r) => (r.companyId === companyId ? { ...r, primary: null, secondary: null } : r));
      saveCompanyKeybinds(next);
      return next;
    });
  };

  if (!show) return null;

  return html`
    <${Modal}
      show=${show}
      onClose=${close}
      class="modal-card keybinds-modal"
      style="display: flex; flex-direction: column;"
    >
      <div class="flex flex-row justify-between items-center p-3 flex-shrink-0">
        <div>
          <div class="text-lg font-bold">Hotkeys</div>
          <div class="text-xs opacity-70">Set shortcuts for UI tools and for switching <b>Acting As</b>.</div>
        </div>
        <div class="flex gap-2">
          <${Button} class="btn p-2" onClick=${resetAll}>Reset All</button>
          <${Button} class="btn p-2" onClick=${close}>Close</button>
        </div>
      </div>

      <div class="flex flex-row gap-2 flex-1 min-h-0 px-3 overflow-y-auto">
        <!-- Left: UI hotkeys -->
        <div class="border keybinds-panel" style="padding:10px; flex: 1; overflow-y: auto;">
          <div class="font-bold mb-2">UI Hotkeys</div>
          <div class="keybinds-grid one">
            <div class="font-bold">Action</div>
            <div class="font-bold text-center">Key</div>
            <div class="font-bold text-center">Clear</div>

            ${GLOBAL_ACTIONS.map((a) => {
              const isListening = listening && listening.kind === 'action' && listening.actionId === a.id;
              const code = globalBinds?.[a.id]?.primary || null;
              const valueLabel = isListening ? 'Press a key…' : (code ? formatCode(code) : '—');
              return html`
                <div class="truncate">${a.label}</div>
                <${Button}
                  class="btn keybinds-bind"
                  style=${isListening ? { outline: '2px solid var(--selected-bg-color)' } : undefined}
                  onClick=${() => setListening({ kind: 'action', actionId: a.id })}
                >${valueLabel}</button>
                <div class="flex justify-center">
                  <${Button} class="btn p-2" onClick=${() => {
                    setGlobalBinds((prev) => {
                      const next = cloneObj(prev || loadGlobalKeybinds());
                      next[a.id] = { primary: null, secondary: null };
                      saveGlobalKeybinds(next);
                      return next;
                    });
                  }}>Clear</button>
                </div>
              `;
            })}
          </div>
        </div>

        <!-- Right: Company hotkeys -->
        <div class="border keybinds-panel" style="padding:10px; flex: 1; overflow-y: auto;">
          <div class="font-bold mb-2">Company Hotkeys</div>
          <div class="keybinds-grid one">
          <div class="font-bold">Entity</div>
          <div class="font-bold text-center">Key</div>
          <div class="font-bold text-center">Clear</div>

          ${rows
            .sort((a, b) => {
              // keep player first
              if (a.companyId === Number(playerId)) return -1;
              if (b.companyId === Number(playerId)) return 1;
              const ao = options.find((o) => Number(o.id) === a.companyId);
              const bo = options.find((o) => Number(o.id) === b.companyId);
              return String(ao?.name || '').localeCompare(String(bo?.name || ''));
            })
            .map((r) => {
              const opt = options.find((o) => Number(o.id) === r.companyId);
              const label = opt ? `${opt.name}${opt.symbol ? ` (${opt.symbol})` : ''}` : `ID ${r.companyId}`;
              const isListening = listening && listening.kind === 'company' && listening.companyId === r.companyId;
              const code = r.primary;
              const valueLabel = isListening ? 'Press a key…' : (code ? formatCode(code) : '—');

              return html`
                <div class="truncate">${label}</div>
                <div class="flex justify-center">
                  <${Button} class="btn keybinds-bind" style=${isListening ? { outline: '2px solid var(--selected-bg-color)' } : undefined} onClick=${() => setListening({ kind: 'company', companyId: r.companyId })}>${valueLabel}</button>
                </div>
                <div class="flex justify-center">
                  <${Button} class="btn p-2" onClick=${() => resetRow(r.companyId)}>Clear</button>
                </div>
              `;
            })}
          </div>
        </div>
      </div>

      <div class="text-xs opacity-70 p-3 flex-shrink-0">
        <b>Shift hotkeys:</b> Hold Shift to reveal and activate the Action Bar menus (Shift+T/C/F/H/B) and Toolbar shortcuts (Shift+L/M/D/S).<br/>
        <b>Always-visible hotkeys:</b> Tab labels, button bar numbers, navigation panel shortcuts (V, A, P, L, I), and panel badges are always shown.<br/>
        Space is reserved for the ticker (pause/run). While this window is open, global hotkeys are disabled.
      </div>
    <//>
  `;
}
