import { useEffect, useRef, html } from '../lib/preact.standalone.module.js';

export default function Modal({ show, onClose, children, class: cls = '' }) {
    const cardRef = useRef(null);

    useEffect(() => {
        if (!show) return;
        const onKey = e => { if (e.key === 'Escape') onClose(); };
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [show, onClose]);

    if (!show) return null;

    return html`<div
        role="dialog"
        aria-modal="true"
        class="modal-overlay"
        onClick=${onClose}
    >
        <div
            ref=${cardRef}
            class=${cls?.length > 0 ? cls : 'modal-card'}
            onClick=${e => e.stopPropagation()}
        >
            ${children}
        </div>
    </div>`;
}
