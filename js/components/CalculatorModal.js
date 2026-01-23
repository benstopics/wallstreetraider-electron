import { html, useEffect, useMemo, useRef, useState } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import Button from './Button.js';

// Floating, draggable calculator (does not block the rest of the UI)

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function getViewport() {
  const w = Math.max(320, window.innerWidth || 0);
  const h = Math.max(320, window.innerHeight || 0);
  return { w, h };
}

function centerInViewport(el) {
  if (!el) return;
  const vp = getViewport();

  // Assure des dimensions valides (si CSS pas encore appliqué)
  const w = el.offsetWidth || 360;
  const h = el.offsetHeight || 460;

  const left = clamp(Math.round((vp.w - w) / 2), 10, vp.w - 40);
  const top = clamp(Math.round((vp.h - h) / 2), 10, vp.h - 40);

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
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

  const [expr, setExpr] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

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

  // Center calculator on open; simple drag handlers
  useEffect(() => {
    if (!show) return;

    // Force center every time the calculator opens
    const el = boxRef.current;
    if (el) {
      requestAnimationFrame(() => centerInViewport(el));
    }

    const onMove = (e) => {
      const el2 = boxRef.current;
      if (!el2 || !drag.current.dragging) return;

      const dx = e.clientX - drag.current.startX;
      const dy = e.clientY - drag.current.startY;
      const vp = getViewport();
      const left = clamp(drag.current.startLeft + dx, 10, vp.w - 40);
      const top = clamp(drag.current.startTop + dy, 10, vp.h - 40);
      el2.style.left = `${left}px`;
      el2.style.top = `${top}px`;
    };

    const onUp = () => {
      drag.current.dragging = false;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [show]);

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
    if (!show) return;
    const t = setTimeout(() => {
      try { inputRef.current?.focus(); } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [show]);

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
        class="notes-window calc-window"
        style=${{
          width: '400px',
          height: '550px',
          overflow: 'hidden',
        }}
      >
        <div
          class="notes-header calc-header"
          onMouseDown=${(e) => {
            const el = boxRef.current;
            if (!el) return;
            drag.current.dragging = true;
            drag.current.startX = e.clientX;
            drag.current.startY = e.clientY;
            drag.current.startLeft = el.offsetLeft;
            drag.current.startTop = el.offsetTop;
            e.preventDefault();
          }}
        >
          <div class="notes-title calc-titlebar">
            <div class="calc-titletexts">
              <div class="calc-appname">Calculator</div>
            </div>
          </div>
          <div class="calc-header-actions">
            <${Button} class="notes-close" title="Close" onClick=${() => onClose?.()}>×</button>
          </div>
        </div>

        <div class="calc-body">
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
            <div class="calc-result">${renderResultText(result)}</div>
          </div>

          <div class="calc-actions">
            <${Button} class="btn calc-btn calc-btn-muted" onClick=${clear}>AC</button>
            <${Button} class="btn calc-btn calc-btn-muted" onClick=${backspace}>⌫</button>
            <${Button} class="btn calc-btn calc-btn-muted" onClick=${() => press('(')}>(</button>
            <${Button} class="btn calc-btn calc-btn-muted" onClick=${() => press(')')}>)</button>
          </div>

          <div class="calc-grid">
            ${keypad.flat().map((k) => {
              const isOp = ['/', '*', '-', '+'].includes(k);
              return html`<${Button} class="btn calc-btn ${isOp ? 'calc-op' : ''}" onClick=${() => press(k)}>${k}</button>`;
            })}
            <${Button} class="btn calc-btn calc-btn-eq" onClick=${evaluate}>=</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
