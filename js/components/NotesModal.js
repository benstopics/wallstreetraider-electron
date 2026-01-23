import { html, useEffect, useState } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import Modal from './Modal.js';
import Button from './Button.js';

export default function NotesModal({ show, onClose }) {
  const [value, setValue] = useState(() => localStorage.getItem('wsr_notes') || '');

  useEffect(() => {
    localStorage.setItem('wsr_notes', value);
  }, [value]);

  return html`
    <${Modal} show=${show} onClose=${onClose} class="modal-card notes-modal">
      <div class="flex flex-col" style="height: 400px;">
        <div class="flex flex-row justify-between items-center mb-2">
          <div class="text-lg font-bold">Notes</div>
          <${Button} class="btn p-2" onClick=${onClose}>Close</button>
        </div>
        <textarea
          class="flex-1 p-2 border rounded"
          style="resize: vertical; min-height: 200px; background: var(--main-bg-color); color: var(--main-fg-color); border-color: rgba(255, 255, 255, 0.1);"
          value=${value}
          placeholder="Write here..."
          onInput=${(e) => setValue(e.target.value)}
        ></textarea>
      </div>
    <//>
  `;
}
