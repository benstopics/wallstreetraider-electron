// HelpModal.jsx (Preact + htm)
import { html, useMemo, useState } from '../lib/preact.standalone.module.js';
import { HELP_TEXT } from './helptext.js';
import Modal from './Modal.js';

function flatten(items) {
  const map = new Map(); // key -> { key, depth, label, content, hasChildren }
  for (const it of items) {
    const path = Array.isArray(it.section) ? it.section : [it.section];
    path.forEach((label, i) => {
      const key = path.slice(0, i + 1).join(' › ');
      const existing = map.get(key) || { key, depth: i, label, content: null, hasChildren: false };
      if (i < path.length - 1) existing.hasChildren = true;      // this node is a parent
      if (i === path.length - 1 && it.content) existing.content = it.content; // leaf content
      map.set(key, existing);
    });
  }
  return Array.from(map.values());
}


function firstLeafKey(rows, fromIndex = 0, baseDepth = -1) {
  for (let i = fromIndex; i < rows.length; i++) {
    const r = rows[i];
    if (baseDepth >= 0 && r.depth <= baseDepth) break; // left this subtree
    if (r.content) return r.key;
  }
  return rows.find(r => r.content)?.key || '';
}

export default function HelpModal({ show, onClose }) {
  const rows = useMemo(() => flatten(HELP_TEXT), []);
  const initialKey = useMemo(() => firstLeafKey(rows), [rows]);
  const [selectedKey, setSelectedKey] = useState(initialKey);

  const content = useMemo(() => {
    const row = rows.find(r => r.key === selectedKey);
    return row?.content ?? html`<div>No content available</div>`;
  }, [rows, selectedKey]);

  if (!show) return null;

  return html`
    <${Modal}
      show=${show}
      onClose=${onClose}
      class="help-modal"
      style=${{ "--modal-w": "80vw", "--modal-h": "80vh" }}
    >
      <nav class="help-sidebar" role="navigation" aria-label="Help">
        <ul class="help-flat">
          ${rows.map((r, idx) => html`
            <li>
              <button
                type="button"
                style=${{ paddingLeft: `${10 + r.depth * 16}px` }}
                class=${`help-item ${selectedKey === r.key ? 'active' : ''} ${r.content ? '' : 'is-header'}`}
                onClick=${() => {
                if (r.content) return setSelectedKey(r.key);
                const leafKey = firstLeafKey(rows, idx + 1, r.depth);
                setSelectedKey(leafKey || r.key);
                }}
              >${r.label}</button>
            </li>
          `)}
        </ul>
      </nav>
      <div class="help-content">${content}</div>
    <//>
  `;
}
