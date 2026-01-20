import { html, useEffect, useRef, useState } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';

// Draggable + resizable notes window that stays open while you interact with the game.
// - Drag by the header bar
// - Resize using the bottom-right corner (native CSS resize handle)

export default function NotesModal({ show, onClose }) {
  const [value, setValue] = useState(() => localStorage.getItem('wsr_notes') || '');
  const boxRef = useRef(null);
  const drag = useRef({ dragging: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 });

  useEffect(() => {
    localStorage.setItem('wsr_notes', value);
  }, [value]);

  useEffect(() => {
    if (!show) return;

    const onMove = (e) => {
      if (!drag.current.dragging) return;
      const el = boxRef.current;
      if (!el) return;
      const dx = e.clientX - drag.current.startX;
      const dy = e.clientY - drag.current.startY;
      const left = Math.max(10, drag.current.startLeft + dx);
      const top = Math.max(10, drag.current.startTop + dy);
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
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

  if (!show) return html``;

  return html`
    <div class="notes-float" onClick=${(e) => e.stopPropagation()}>
      <div
        class="notes-window"
        ref=${boxRef}
        style="left: 60%; top: 62%;"
      >
        <div
          class="notes-header"
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
          <div class="notes-title">Notes</div>
          <button class="notes-close" onClick=${() => onClose?.()}>×</button>
        </div>
        <textarea
          class="notes-body"
          value=${value}
          placeholder="Write here..."
          onInput=${(e) => setValue(e.target.value)}
        ></textarea>
      </div>
    </div>
  `;
}
