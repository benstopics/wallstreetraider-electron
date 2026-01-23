import { html, useMemo, useEffect, useState, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import Modal from './Modal.js';
import { parseHyperlink, insertCurrencySymbols } from './helpers.js';
import Button from './Button.js';

// Throttle re-computation so we don't lock the UI when gamestate refreshes frequently.
function useThrottledValue(value, ms = 750) {
  const [throttled, setThrottled] = useState(value);
  const last = useRef(0);
  const timer = useRef(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - last.current;
    const remaining = ms - elapsed;

    if (remaining <= 0) {
      last.current = now;
      setThrottled(value);
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      last.current = Date.now();
      setThrottled(value);
    }, remaining);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, ms]);

  return throttled;
}

function stripHyperlink(rawLine) {
  const link = parseHyperlink(rawLine);
  let text = insertCurrencySymbols(rawLine || '');
  if (link) {
    // remove hyperlink suffix (helpers.renderLines uses the '@' marker)
    const at = text.indexOf('@');
    if (at >= 0) text = text.slice(0, at);
  }
  return { text: text.trim(), link };
}

function parsePercent(text) {
  const m = text.match(/([0-9]+(?:\.[0-9]+)?)\s*%/);
  return m ? parseFloat(m[1]) : null;
}

function parseNumberToken(tok) {
  if (!tok) return null;
  const cleaned = tok.toString().replace(/[^0-9.\-]/g, '');
  if (!cleaned || cleaned === '-' || cleaned === '.') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function getCompanyPrice(company) {
  if (!company) return null;
  const keys = ['price', 'sharePrice', 'stockPrice', 'lastPrice', 'currentPrice', 'quotePrice'];
  for (const k of keys) {
    const v = company[k];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return null;
}

export default function AssetsManagementPanel() {
  const portfolio = api.useGameStore(s => s.gameState.portfolio) || [];
  const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];
  const actingAs = api.useGameStore(s => s.gameState.actingAs);
  const actingAsId = api.useGameStore(s => s.gameState.actingAsId);

  // Reduce churn: the backend tends to refresh frequently. We only re-parse at most ~1x/sec.
  const throttledReport = useThrottledValue(portfolio, 800);

  const companyById = useMemo(() => {
    const m = new Map();
    for (const c of allCompanies) {
      if (c && c.id != null) m.set(Number(c.id), c);
    }
    return m;
  }, [allCompanies]);

  const [stopModal, setStopModal] = useState(null); // { assetId, kind:'loss'|'gain', priceStr, currentPrice }

  function parsePortfolioLine(text, fallbackSymbol = '') {
    const clean = (text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return null;
    const tokens = clean.split(' ').filter(Boolean);

    // Symbol
    let sym = (fallbackSymbol || '').trim();
    if (!sym) {
      const sm = clean.match(/\b([A-Z]{1,10})\b/);
      sym = sm ? sm[1] : '';
    }

    // Name
    let name = clean;
    if (sym) {
      const idx = clean.indexOf(sym);
      if (idx > 0) name = clean.slice(0, idx).trim();
    }

    // Held%
    let heldPct = null;
    let symIndex = -1;
    if (sym) {
      for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i] !== sym) continue;
        const next = tokens[i + 1];
        if (!next || !next.includes('%')) continue;
        const hp = parseNumberToken(next.replace('%', ''));
        if (hp != null) { heldPct = hp; symIndex = i; break; }
      }
      if (symIndex < 0) symIndex = tokens.findIndex(t => t === sym);
    }
    if (heldPct == null) heldPct = parsePercent(clean);

    // Share price
    let sharePrice = null;
    if (symIndex >= 0) {
      const start = symIndex + 2;
      for (let i = start; i < Math.min(tokens.length, start + 8); i++) {
        if (tokens[i].includes('%')) continue;
        const n = parseNumberToken(tokens[i]);
        if (n != null) { sharePrice = n; break; }
      }
    }

    // Value(M) & Tax Basis(M)
    let valueM = null;
    let taxM = null;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i].toUpperCase();
      if (t === 'VALUE' && valueM == null) {
        const v = parseNumberToken(tokens[i + 1]);
        if (v != null) valueM = v;
      }
      if ((t === 'TAX' && (tokens[i + 1] || '').toUpperCase() === 'BASIS') && taxM == null) {
        const v = parseNumberToken(tokens[i + 2]);
        if (v != null) taxM = v;
      }
      if ((t === 'TAXBASIS') && taxM == null) {
        const v = parseNumberToken(tokens[i + 1]);
        if (v != null) taxM = v;
      }
    }
    if (valueM == null || taxM == null) {
      const nums = tokens.map(parseNumberToken).filter(v => v != null);
      if (nums.length >= 2) {
        const prev = nums[nums.length - 2];
        const last = nums[nums.length - 1];
        if (valueM == null) valueM = prev;
        if (taxM == null) taxM = last;
      }
    }

    return { symbol: sym, name, heldPct, sharePrice, valueM, taxM };
  }

  const rows = useMemo(() => {
    const out = [];
    for (const raw of throttledReport) {
      if (!raw || !raw.trim || !raw.trim()) continue;
      const { text, link } = stripHyperlink(raw);
      if (!link || link.type !== 'C' || link.id == null) continue;
      const company = companyById.get(Number(link.id));
      const parsed = parsePortfolioLine(text, company?.symbol || '');

      const symbol = (company?.symbol || parsed?.symbol || '').toString();
      const name = (company?.name || parsed?.name || text).toString().trim();
      const heldPct = (typeof parsed?.heldPct === 'number') ? parsed.heldPct : parsePercent(text);

      let shares = null;
      let plPct = null;
      if (parsed && Number.isFinite(parsed.valueM) && Number.isFinite(parsed.sharePrice) && parsed.sharePrice > 0) {
        shares = (parsed.valueM * 1_000_000) / parsed.sharePrice;
      }
      if (parsed && Number.isFinite(parsed.valueM) && Number.isFinite(parsed.taxM) && parsed.taxM > 0) {
        plPct = ((parsed.valueM - parsed.taxM) / parsed.taxM) * 100;
      }

      out.push({ id: Number(link.id), symbol, name, shares, heldPct, plPct });
    }
    return out;
  }, [throttledReport, companyById]);

  const openStopModal = (kind, assetId) => {
    const company = companyById.get(Number(assetId));
    const cur = getCompanyPrice(company);
    setStopModal({ kind, assetId: Number(assetId), currentPrice: cur, priceStr: cur != null ? String(cur) : '' });
  };

  const submitStopModal = () => {
    if (!stopModal || !actingAsId) return;
    const p = Number((stopModal.priceStr || '').toString().replace(/[^0-9.\-]/g, ''));
    if (!Number.isFinite(p) || p <= 0) {
      setStopModal(null);
      return;
    }
    const key = `C:${Number(stopModal.assetId)}`;
    const existing = api.getStopOrder(actingAsId, key) || {};
    const nextStopLoss = (stopModal.kind === 'loss') ? p : (existing.stopLoss ?? null);
    const nextStopGain = (stopModal.kind === 'gain') ? p : (existing.stopGain ?? null);
    api.setStopOrder(actingAsId, key, nextStopLoss, nextStopGain);
    setStopModal(null);
  };

  const clearStop = (assetId, kind) => {
    if (!actingAsId) return;
    const key = `C:${Number(assetId)}`;
    const existing = api.getStopOrder(actingAsId, key) || {};
    const nextStopLoss = (kind === 'loss') ? null : (existing.stopLoss ?? null);
    const nextStopGain = (kind === 'gain') ? null : (existing.stopGain ?? null);
    api.setStopOrder(actingAsId, key, nextStopLoss, nextStopGain);
  };

  return html`
    <div class="panel assets-panel">
      ${stopModal ? html`
        <${Modal} show=${true} onClose=${() => setStopModal(null)} class="modal-card stop-modal">
          <div class="flex items-center justify-between" style="gap: 12px;">
            <div class="text-lg font-bold">${stopModal.kind === 'loss' ? 'Stop Loss' : 'Stop Gain'}</div>
            <${Button} class="btn" onClick=${() => setStopModal(null)} style="height: 24px;">Close</button>
          </div>
          <div class="opacity-80" style="margin-top: 6px;">
            Current price: <b>${stopModal.currentPrice != null ? stopModal.currentPrice : '—'}</b>
          </div>
          <div style="margin-top: 10px;">
            <div class="text-xs opacity-70" style="margin-bottom: 6px;">Sell automatically when price ${stopModal.kind === 'loss' ? 'falls to' : 'reaches'}:</div>
            <input type="text" class="modal-input" value=${stopModal.priceStr}
              onInput=${(e) => setStopModal((prev) => prev ? { ...prev, priceStr: e.target.value } : prev)} />
          </div>
          <div class="flex justify-between items-center" style="margin-top: 12px; gap: 10px;">
            <${Button} class="btn" onClick=${() => { clearStop(stopModal.assetId, stopModal.kind); setStopModal(null); }}>Clear</button>
            <div class="flex gap-2">
              <${Button} class="btn" onClick=${() => setStopModal(null)}>Cancel</button>
              <${Button} class="btn green" onClick=${submitStopModal}>Save</button>
            </div>
          </div>
        <//>
      ` : ''}

      <div class="panel-header">Assets Management</div>
      <div class="panel-body p-1">
        <div class="assets-row assets-head">
          <div>Symbol</div>
          <div>Name</div>
          <div class="assets-num">Shares</div>
          <div class="assets-num">Held %</div>
          <div class="assets-num">P/L %</div>
          <div class="assets-actions-head">Sell</div>
        </div>

        <div class="assets-scroll">
          ${rows.length === 0 ? html`
            <div class="p-2 text-gray-400">
              No holdings found. This panel reads from the <b>Stocks & Bonds → Portfolio</b> report.
              Make sure you have at least one stock holding (not just a company you are acting as).
            </div>
          ` : rows.map(r => {
            const pl = (typeof r.plPct === 'number') ? r.plPct : null;
            const badgeClass = pl == null ? 'neutral' : (pl >= 0 ? 'positive' : 'negative');

            const stopKey = `C:${Number(r.id)}`;
            const stop = (actingAsId && Number.isFinite(r.id)) ? (api.getStopOrder(actingAsId, stopKey) || null) : null;
            const hasStopLoss = (stop && typeof stop.stopLoss === 'number') ? stop.stopLoss : null;
            const hasStopGain = (stop && typeof stop.stopGain === 'number') ? stop.stopGain : null;

            return html`
              <div class="assets-row">
                <div class="mono">${r.symbol || '—'}</div>
                <div class="c-name" title=${r.name}>${r.name}</div>
                <div class="mono assets-num">${typeof r.shares === 'number' ? Math.round(r.shares).toLocaleString() : '—'}</div>
                <div class="mono assets-num">${typeof r.heldPct === 'number' ? r.heldPct.toFixed(2) + '%' : '—'}</div>
                <div class=${`pl-badge ${badgeClass} assets-num`}>${pl == null ? '—' : pl.toFixed(2) + '%'}</div>
                <div class="assets-actions" style="gap:6px;">
                  <${Button}
                    class=${`btn p-2 stop-btn stop-loss ${hasStopLoss != null ? 'is-set' : ''}`}
                    title=${hasStopLoss != null ? `Stop Loss @ ${hasStopLoss}` : 'Set Stop Loss'}
                    disabled=${!actingAs}
                    onClick=${() => openStopModal('loss', r.id)}
                  >SL</button>
                  <${Button}
                    class=${`btn p-2 stop-btn stop-gain ${hasStopGain != null ? 'is-set' : ''}`}
                    title=${hasStopGain != null ? `Stop Gain @ ${hasStopGain}` : 'Set Stop Gain'}
                    disabled=${!actingAs}
                    onClick=${() => openStopModal('gain', r.id)}
                  >SG</button>
                  <${Button}
                    type="button"
                    class="assets-sell btn red"
                    disabled=${!actingAs}
                    title=${!actingAs ? 'Must be acting as an entity' : 'Sell'}
                    onClick=${() => api.sellStock(r.id)}
                  >Sell</button>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    </div>
  `;
}
