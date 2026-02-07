import { html, useEffect, useState, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import Modal from './Modal.js';
import Button from './Button.js';

export default function NotesModal({ show, onClose }) {
  const [value, setValue] = useState(() => localStorage.getItem('wsr_notes') || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('wsr_notes', value);
  }, [value]);

  // Auto-focus textarea when modal shows
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [show]);

  return html`
    <${Modal} show=${show} onClose=${onClose} class="modal-card notes-modal" style="display: flex; flex-direction: column;">
      <div class="flex flex-row justify-between items-center p-3 flex-shrink-0">
        <div class="text-lg font-bold">Notes</div>
        <${Button} class="btn p-2" onClick=${onClose}>Close</button>
      </div>
      <div class="flex-1 min-h-0 px-3 pb-3 overflow-y-auto">
        <textarea
          ref=${textareaRef}
          class="w-full h-full p-2 border rounded"
          style="resize: none; min-height: 300px; background: var(--main-bg-color); color: var(--main-fg-color); border-color: rgba(255, 255, 255, 0.1);"
          value=${value}
          placeholder="Write here..."
          onInput=${(e) => setValue(e.target.value)}
        ></textarea>
      </div>
    <//>
  `;
}
