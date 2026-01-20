import { html, useMemo, useEffect, useState, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { parseHyperlink, insertCurrencySymbols } from './helpers.js';

function stripHyperlink(rawLine) {
  const link = parseHyperlink(rawLine);
  let text = insertCurrencySymbols(rawLine || '');
  if (link) {
    const at = text.indexOf('@');
    if (at >= 0) text = text.slice(0, at);
  }
  return { text: text.trim(), link };
}

function parseHeldPct(text) {
  const heldA = text.match(/\bHELD\b\s*%?\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?)\s*%/i);
  const heldB = text.match(/\bOWN(?:S|ED)?\b\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?)\s*%/i);
  if (heldA) return parseFloat(heldA[1]);
  if (heldB) return parseFloat(heldB[1]);
  // Fallback: first percent on the line (often held%)
  const firstPct = text.match(/([0-9]+(?:\.[0-9]+)?)\s*%/);
  return firstPct ? parseFloat(firstPct[1]) : 0;
}

export default function MarketExposurePanel() {
  // IMPORTANT:
  // We must use the Stocks/Bonds *portfolio* report lines for exposure.
  // Some builds populate `myCorporationsReport` even when the player holds stocks,
  // but those lines are not the portfolio holdings and may not contain hyperlinks
  // that map cleanly to company IDs.
  const portfolio = api.useGameStore(s => s.gameState.portfolio) || [];
  const myCorporationsReport = api.useGameStore(s => s.gameState.myCorporationsReport) || [];
  const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];
  const allIndustries = api.useGameStore(s => s.gameState.allIndustries) || [];

  function useThrottledValue(value, ms = 1000) {
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

  // Prefer portfolio when it has content; otherwise fall back.
  const sourceLines = (portfolio && portfolio.length > 0)
    ? portfolio
    : myCorporationsReport;

  const throttledLines = useThrottledValue(sourceLines, 1200);

  const companyById = useMemo(() => {
    const m = new Map();
    for (const c of allCompanies) if (c && c.id != null) m.set(c.id, c);
    return m;
  }, [allCompanies]);

  const industryById = useMemo(() => {
    const m = new Map();
    for (const i of allIndustries) if (i && i.id != null) m.set(i.id, i);
    return m;
  }, [allIndustries]);

  const rows = useMemo(() => {
    const byIndustry = new Map();

    for (const raw of throttledLines) {
      if (!raw || !raw.trim()) continue;
      const { text, link } = stripHyperlink(raw);
      if (!link || !link.id) continue;

      // Only treat company-like holdings as market exposure.
      // (Shorts and bonds will either not map to companies or won't have a company industry.)
      const company = companyById.get(link.id);
      if (!company) continue;

      const pct = parseHeldPct(text);
      const indId = company.industryId ?? company.industry ?? company.industryNum;
      if (indId == null) continue;

      const cur = byIndustry.get(indId) || 0;
      byIndustry.set(indId, cur + (Number.isFinite(pct) ? pct : 0));
    }

    const list = [...byIndustry.entries()]
      .map(([industryId, exposure]) => {
        const ind = industryById.get(industryId);
        return { industryId, name: ind?.name || `Industry ${industryId}`, exposure };
      })
      .sort((a, b) => b.exposure - a.exposure)
      .slice(0, 12);

    const total = list.reduce((s, r) => s + r.exposure, 0) || 0;
    return { list, total };
  }, [throttledLines, companyById, industryById]);

  return html`
    <div class="panel market-panel">
      <div class="panel-header">Market</div>
      <div class="panel-body p-1">
        ${rows.list.length === 0 ? html`
          <div class="p-2 text-gray-400">No exposure data yet. Buy a few stocks first, then this panel will show your sector mix.</div>
        ` : html`
          <div class="market-scroll">
            ${rows.list.map(r => {
              const pct = rows.total > 0 ? (r.exposure / rows.total) * 100 : 0;
              return html`
                <div class="market-row">
                  <div class="market-name" title=${r.name}>${r.name}</div>
                  <div class="market-bar">
                    <div class="market-bar-fill" style=${`width: ${Math.min(100, Math.max(0, pct)).toFixed(1)}%`}></div>
                  </div>
                  <div class="market-pct">${pct.toFixed(1)}%</div>
                </div>
              `;
            })}
          </div>
        `}
      </div>
    </div>
  `;
}
