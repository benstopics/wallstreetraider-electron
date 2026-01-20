import { html, useEffect, useMemo, useRef, useState } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';

// Floating, draggable calculator (does not block the rest of the UI)
// - Drag by header (unless docked)
// - Resizable (custom handle + ResizeObserver persistence)
// - Snap-to-edge on drop

const POS_KEY = 'wsr_calc_pos_v2';
const SIZE_KEY = 'wsr_calc_size_v1';
const DOCK_KEY = 'wsr_calc_dock_v1';

const SNAP_PX = 22;

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function getViewport() {
  const w = Math.max(320, window.innerWidth || 0);
  const h = Math.max(320, window.innerHeight || 0);
  return { w, h };
}

function safeEval(expr) {
  const s = String(expr || '').trim();
  if (!s) return { ok: true, value: '' };
  // Allow digits, operators, parentheses, decimal points, commas, spaces, percent
  // If invalid characters are present, mark invalid but keep the display clean (no huge "Error").
  if (!/^[0-9+\-*/().,\s%]+$/.test(s)) return { ok: false, value: '' };

  // Don't flash errors while the user is still typing an incomplete expression.
  // Examples: "1+", "(2*", "3.", "("
  if (/[+\-*/.]$/.test(s) || /\($/.test(s)) return { ok: true, value: '' };

  // If parentheses are unbalanced, treat as "pending" (no error).
  const open = (s.match(/\(/g) || []).length;
  const close = (s.match(/\)/g) || []).length;
  if (close > open || open !== close) return { ok: true, value: '' };

  const normalized = s
    .replace(/,/g, '')
    .replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${normalized});`);
    const out = fn();
    if (typeof out !== 'number' || Number.isNaN(out) || !Number.isFinite(out)) return { ok: true, value: '' };
    return { ok: true, value: out };
  } catch {
    // Syntax errors during typing shouldn't spam the UI.
    return { ok: true, value: '' };
  }
}

function formatResult(x) {
  if (x === '' || x === null || x === undefined) return '';
  const n = Number(x);
  if (!Number.isFinite(n)) return String(x);
  // Keep it readable: trim long floats
  const s = n.toString();
  if (s.length <= 14) return s;
  return n.toPrecision(10).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function renderResultText(result) {
  if (!result || !result.ok) return "";
  const txt = formatResult(result.value);
  if (!txt) return "";
  if (String(txt).toLowerCase().includes("error")) return "";
  return txt;
}

export default function CalculatorModal({ show, onClose }) {
  const boxRef = useRef(null);
  const inputRef = useRef(null);
  const drag = useRef({ dragging: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 });
  const resizeRef = useRef({ resizing: false, startX: 0, startY: 0, startW: 0, startH: 0 });

  const [expr, setExpr] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dock, setDock] = useState('free'); // free | left | right | bottom

  const result = useMemo(() => safeEval(expr), [expr]);

  const press = (token) => {
    // Keep state transitions predictable; avoid calling setState from inside another setState.
    setExpr((prev) => {
      const p = String(prev ?? '');
      if (justEvaluated && /\d/.test(token)) return token; // start fresh after '='
      return p + token;
    });
    setJustEvaluated(false);
    // Ensure the expression input always reflects keypad presses immediately.
    try { inputRef.current?.focus(); } catch {}
  };

  const backspace = () => {
    setExpr((p) => String(p ?? '').slice(0, -1));
    setJustEvaluated(false);
  };

  const clear = () => {
    setExpr('');
    setJustEvaluated(false);
  };

  const evaluate = () => {
    if (!result.ok) return;
    const v = result.value;
    if (v === '') return;
    setExpr(formatResult(v));
    setJustEvaluated(true);
  };

  // Restore & persist position; drag handlers
  useEffect(() => {
    if (!show) return;

    // Restore dock
    try {
      const d = localStorage.getItem(DOCK_KEY);
      if (d === 'left' || d === 'right' || d === 'bottom' || d === 'free') setDock(d);
    } catch {}

    // Restore size
    try {
      const rawS = localStorage.getItem(SIZE_KEY);
      if (rawS) {
        const s = JSON.parse(rawS);
        const el = boxRef.current;
        if (el && typeof s?.w === 'number' && typeof s?.h === 'number') {
          el.style.width = `${clamp(s.w, 280, 760)}px`;
          el.style.height = `${clamp(s.h, 200, Math.floor(getViewport().h * 0.86))}px`;
        }
      }
    } catch {}

    // Restore position (or center on first open)
    let hadSavedPos = false;
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        const el = boxRef.current;
        if (el && typeof p?.left === 'number' && typeof p?.top === 'number') {
          el.style.left = `${p.left}px`;
          el.style.top = `${p.top}px`;
          hadSavedPos = true;
        }
      }
    } catch {
      // ignore
    }

    // If there's no saved position, force a true centered default (prevents half-off-screen)
    try {
      const el = boxRef.current;
      if (el && !hadSavedPos) {
        const vp = getViewport();
        // Ensure we have dimensions
        const w = el.offsetWidth || 360;
        const h = el.offsetHeight || 460;
        const left = clamp(Math.round((vp.w - w) / 2), 10, vp.w - 40);
        const top = clamp(Math.round((vp.h - h) / 2), 10, vp.h - 40);
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
      }
    } catch {}

    // Observe size changes to persist them (covers both CSS resize and handle resize)
    const el = boxRef.current;
    let ro;
    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        try {
          localStorage.setItem(SIZE_KEY, JSON.stringify({ w: el.offsetWidth, h: el.offsetHeight }));
        } catch {}
      });
      ro.observe(el);
    }

    const onMove = (e) => {
      const el2 = boxRef.current;
      if (!el2) return;

      if (resizeRef.current.resizing) {
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        const vp = getViewport();
        const w = clamp(resizeRef.current.startW + dx, 280, 760);
        const h = clamp(resizeRef.current.startH + dy, 200, Math.floor(vp.h * 0.86));
        el2.style.width = `${w}px`;
        el2.style.height = `${h}px`;
        return;
      }

      if (!drag.current.dragging) return;
      if (dock !== 'free') return;

      const dx = e.clientX - drag.current.startX;
      const dy = e.clientY - drag.current.startY;
      const vp = getViewport();
      const left = clamp(drag.current.startLeft + dx, 10, vp.w - 40);
      const top = clamp(drag.current.startTop + dy, 10, vp.h - 40);
      el2.style.left = `${left}px`;
      el2.style.top = `${top}px`;
    };

    const onUp = () => {
      const el2 = boxRef.current;
      if (!el2) return;

      if (resizeRef.current.resizing) {
        resizeRef.current.resizing = false;
        try {
          localStorage.setItem(SIZE_KEY, JSON.stringify({ w: el2.offsetWidth, h: el2.offsetHeight }));
        } catch {}
        return;
      }

      if (!drag.current.dragging) return;
      drag.current.dragging = false;

      // Snap to edges if close
      const vp = getViewport();
      const rect = el2.getBoundingClientRect();
      const nearLeft = rect.left <= SNAP_PX;
      const nearRight = vp.w - rect.right <= SNAP_PX;
      const nearBottom = vp.h - rect.bottom <= SNAP_PX;

      if (nearBottom) {
        setDock('bottom');
        try { localStorage.setItem(DOCK_KEY, 'bottom'); } catch {}
      } else if (nearLeft) {
        setDock('left');
        try { localStorage.setItem(DOCK_KEY, 'left'); } catch {}
      } else if (nearRight) {
        setDock('right');
        try { localStorage.setItem(DOCK_KEY, 'right'); } catch {}
      } else {
        try {
          localStorage.setItem(POS_KEY, JSON.stringify({ left: el2.offsetLeft, top: el2.offsetTop }));
        } catch {}
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      try { ro?.disconnect?.(); } catch {}
    };
  }, [show, dock]);

  // Keyboard support (Enter to eval)
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }
      if (e.key === 'Enter') {
        // Let Enter evaluate even when the input is focused
        e.preventDefault();
        evaluate();
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, result]);

  // Auto-focus input when opened
  useEffect(() => {
    if (!show || collapsed) return;
    const t = setTimeout(() => {
      try { inputRef.current?.focus(); } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [show, collapsed]);

  // Reset any stale input artifacts when opening the calculator
  useEffect(() => {
    if (!show) return;
    setExpr((v) => (typeof v === 'string' ? v : ''));
    setJustEvaluated(false);
  }, [show]);

  if (!show) return null;

  const keypad = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '%', '+'],
  ];

  return html`
    <div class="notes-float calc-float" onClick=${(e) => e.stopPropagation()}>
      <div
        ref=${boxRef}
        class=${`notes-window calc-window ${collapsed ? 'calc-collapsed' : ''} calc-dock-${dock}`}
        style=${{
          // Position is restored from localStorage; if none is saved we center it on open.
          left: dock === 'free' ? undefined : undefined,
          top: dock === 'free' ? undefined : undefined,
          resize: 'none',
          minWidth: '280px',
          minHeight: collapsed ? '56px' : '260px',
          maxWidth: '760px',
          maxHeight: '86vh',
          overflow: 'hidden',
        }}
      >
        <div
          class="notes-header calc-header"
          onMouseDown=${(e) => {
            const el = boxRef.current;
            if (!el) return;
            if (dock !== 'free') return;
            drag.current.dragging = true;
            drag.current.startX = e.clientX;
            drag.current.startY = e.clientY;
            drag.current.startLeft = el.offsetLeft;
            drag.current.startTop = el.offsetTop;
            e.preventDefault();
          }}
        >
          <div class="notes-title calc-titlebar">
            <button class="calc-hamburger" title="Menu" onClick=${(e)=>e.stopPropagation()}>☰</button>
            <div class="calc-titletexts">
              <div class="calc-appname">Calculator</div>
              <div class="calc-mode">Standard</div>
            </div>
          </div>
          <div class="calc-header-actions">
            <button
              class="notes-close calc-dock"
              title="Dock left"
              onClick=${() => {
                setDock('left');
                try { localStorage.setItem(DOCK_KEY, 'left'); } catch {}
              }}
            >◧</button>
            <button
              class="notes-close calc-dock"
              title="Dock bottom"
              onClick=${() => {
                setDock('bottom');
                try { localStorage.setItem(DOCK_KEY, 'bottom'); } catch {}
              }}
            >▤</button>
            <button
              class="notes-close calc-dock"
              title="Dock right"
              onClick=${() => {
                setDock('right');
                try { localStorage.setItem(DOCK_KEY, 'right'); } catch {}
              }}
            >◨</button>
            <button
              class="notes-close calc-dock"
              title="Float"
              onClick=${() => {
                setDock('free');
                try { localStorage.setItem(DOCK_KEY, 'free'); } catch {}
              }}
            >⤢</button>
            <button class="notes-close calc-min" title=${collapsed ? 'Expand' : 'Minimize'} onClick=${() => setCollapsed((v) => !v)}>
              ${collapsed ? '▢' : '—'}
            </button>
            <button class="notes-close" title="Close" onClick=${() => onClose?.()}>×</button>
          </div>
        </div>

        ${collapsed
          ? null
          : html`<div class="calc-body">
          <div class="calc-display">
            <input
              ref=${inputRef}
              class="calc-expr calc-expr-input"
              value=${expr}
              placeholder="0"
              onInput=${(e) => {
                const v = e?.target?.value ?? '';
                setExpr(String(v));
                setJustEvaluated(false);
              }}
            />
            <div class="calc-result ">${renderResultText(result)}</div>
          </div>

          <div class="calc-actions">
            <button class="btn calc-btn calc-btn-muted" onClick=${clear}>AC</button>
            <button class="btn calc-btn calc-btn-muted" onClick=${backspace}>⌫</button>
            <button class="btn calc-btn calc-btn-muted" onClick=${() => press('(')}>(</button>
            <button class="btn calc-btn calc-btn-muted" onClick=${() => press(')')}>)</button>
          </div>

          <div class="calc-grid">
            ${keypad.flat().map((k) => {
              const isOp = ['/', '*', '-', '+'].includes(k);
              return html`<button class="btn calc-btn ${isOp ? 'calc-op' : ''}" onClick=${() => press(k)}>${k}</button>`;
            })}
            <button class="btn calc-btn calc-btn-eq" onClick=${evaluate}>=</button>
          </div>

          <div
            class="calc-resize"
            title="Resize"
            onMouseDown=${(e) => {
              const el = boxRef.current;
              if (!el) return;
              if (collapsed) return;
              resizeRef.current.resizing = true;
              resizeRef.current.startX = e.clientX;
              resizeRef.current.startY = e.clientY;
              resizeRef.current.startW = el.offsetWidth;
              resizeRef.current.startH = el.offsetHeight;
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        </div>`}
      </div>
    </div>
  `;
}
