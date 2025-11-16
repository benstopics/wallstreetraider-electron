// DifficultyLevelInput.js
import { html, useState, useRef, useEffect, useLayoutEffect, useMemo } from '../lib/preact.standalone.module.js';

const LEVELS = [
  { id: "1", label: 'Level 1', short: 'Easiest', desc: 'Easiest difficulty.' },
  { id: "2", label: 'Level 2', short: 'Medium', desc: 'Medium difficulty.' },
  { id: "3", label: 'Level 3', short: 'Aggressive AI', desc: 'More difficult. Computer player is more aggressive.' },
  { id: "4", label: 'Level 4', short: 'Taxes Enabled', desc: 'Same as Level 3, but game may enact capital taxes at times (e.g., “Oil Windfall Profits Tax”).' },
];

export default function DifficultyLevelInput({
  value = "1",
  onChange = () => {},
  disabled = false
}) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(
    Math.max(0, LEVELS.findIndex(l => l.id === value))
  );
  const btnRef = useRef(null);
  const listRef = useRef(null);

  const selected = useMemo(
    () => LEVELS.find(l => l.id === value) || LEVELS[0],
    [value]
  );

  const openMenu = () => !disabled && setOpen(true);
  const closeMenu = () => setOpen(false);

  const selectIdx = (idx) => {
    const item = LEVELS[idx];
    if (!item) return;
    setActiveIdx(idx);
    onChange(item.id);
    closeMenu();
  };

  const onKeyDown = (e) => {
    if (disabled) return;
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((activeIdx + 1) % LEVELS.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((activeIdx - 1 + LEVELS.length) % LEVELS.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      selectIdx(activeIdx);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
    }
  };

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e) => {
      if (!btnRef.current?.contains(e.target) && !listRef.current?.contains(e.target)) {
        closeMenu();
      }
    };
    window.addEventListener('mousedown', onClickAway);
    return () => window.removeEventListener('mousedown', onClickAway);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    // Ensure active item is in view
    const active = listRef.current?.querySelector('li.active');
    active?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIdx]);

  return html`
    <div style="position:relative; width:100%;">
      <button
        ref=${btnRef}
        type="button"
        class="basic"
        disabled=${disabled}
        aria-haspopup="listbox"
        aria-expanded=${open}
        onClick=${() => (open ? closeMenu() : openMenu())}
        onKeyDown=${onKeyDown}
        style="
          width:100%;
          text-align:left;
          display:flex; align-items:center; justify-content:space-between;
        "
      >
        <span>
          <strong>${selected.label}</strong>
          <span style="opacity:.7; margin-left:8px;">${selected.short}</span>
        </span>
        <span aria-hidden="true" style="opacity:.7">▾</span>
      </button>

      ${open ? html`
        <div style="max-height:220px; overflow:auto;">
            <ul
            ref=${listRef}
            class="basic border"
            role="listbox"
            tabindex="-1"
            style="
                position:absolute; left:0; right:0; top:100%; z-index:50;
                padding:4px 0; margin:4px 0 0 0;
            "
            >
            ${LEVELS.map((item, i) => html`
                <li
                role="option"
                aria-selected=${value === item.id}
                key=${item.id}
                class="${i === activeIdx ? 'active' : ''}"
                style="
                    padding:8px 10px; cursor:pointer; display:flex; flex-direction:column; gap:2px;
                "
                onMouseEnter=${() => setActiveIdx(i)}
                onMouseDown=${(e) => e.preventDefault()}
                onClick=${() => selectIdx(i)}
                >
                <div style="display:flex; justify-content:space-between; gap:8px;">
                    <span><strong>${item.label}</strong></span>
                    <span style="opacity:.7">${item.short}</span>
                </div>
                <div style="opacity:.8; font-size:.9em; max-width: 200px">${item.desc}</div>
                </li>
            `)}
            </ul>
        </div>
      ` : null}
    </div>
  `;
}
