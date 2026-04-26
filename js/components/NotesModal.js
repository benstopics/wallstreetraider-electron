import { html, useEffect, useState, useRef, useMemo } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import Modal from './Modal.js';
import Button from './Button.js';

const SAVE_DEBOUNCE_MS = 500;
const EMPTY_CUSTOM_DATA = Object.freeze({});

export default function NotesModal({ show, onClose }) {
  const customData = api.useGameStore(s => s.gameState?.customData ?? EMPTY_CUSTOM_DATA);
  const gameLoaded = api.useGameStore(s => s.gameState?.gameLoaded);

  const [value, setValue] = useState('');
  const restoredRef = useRef(false);
  const textareaRef = useRef(null);

  const debouncedSave = useMemo(() => api.debounce((notes) => {
    api.setCustomData({ notes }).catch(() => {});
  }, SAVE_DEBOUNCE_MS), []);

  // Restore notes from customData once gameLoaded so customData has hydrated from .WSR.
  // Flip restoredRef unconditionally so the persist effect can fire even when there's
  // nothing saved yet (first-time users).
  useEffect(() => {
    if (restoredRef.current || !gameLoaded) return;
    restoredRef.current = true;
    const saved = customData?.notes;
    if (typeof saved === 'string') setValue(saved);
  }, [customData, gameLoaded]);

  // Persist notes to customData on change (debounced)
  useEffect(() => {
    if (!restoredRef.current || !gameLoaded) return;
    debouncedSave(value);
  }, [value, gameLoaded]);

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
