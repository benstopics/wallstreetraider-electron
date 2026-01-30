import { useEffect, useRef, html } from '../lib/preact.standalone.module.js';
import { useActiveTooltip } from './TutorialTooltip.js';

export default function Modal({ show, onClose, enableClickOutsideClose = true, children, class: cls = '', style = '' }) {
    const cardRef = useRef(null);
    const activeTooltip = useActiveTooltip();

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

    // Shift modal to the right when tooltip is active
    const shiftStyle = activeTooltip ? 'transform: translateX(200px);' : '';
    const combinedStyle = style ? `${style}; ${shiftStyle}` : shiftStyle;

    return html`<div
        role="dialog"
        aria-modal="true"
        class="modal-overlay"
        onClick=${enableClickOutsideClose ? onClose : undefined}
    >
        <div
            ref=${cardRef}
            class=${cls?.length > 0 ? cls : 'modal-card'}
            style=${combinedStyle}
            onClick=${e => e.stopPropagation()}
        >
            ${children}
        </div>
    </div>`;
}
