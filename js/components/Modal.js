import { useEffect, useRef, html } from '../lib/preact.standalone.module.js';
import { useActiveTooltip } from './TutorialTooltip.js';

export default function Modal({ show, onClose, onKeyDown, enableClickOutsideClose = true, children, class: cls = '', style = '' }) {
    const cardRef = useRef(null);
    const activeTooltip = useActiveTooltip();

    useEffect(() => {
        if (!show) return;
        // Blur any focused editable element so modal hotkeys (C, Y, N) work
        // immediately without requiring a click on the modal first.
        const ae = document.activeElement;
        if (ae && ae !== document.body && ae !== document.documentElement) {
            ae.blur();
        }
    }, [show]);

    useEffect(() => {
        if (!show) return;
        const onKey = e => {
            // Only handle ESC if onClose is defined, otherwise let parent handlers deal with it
            if (e.key === 'Escape' && !e.defaultPrevented && onClose) { e.preventDefault(); onClose(); }
            onKeyDown?.(e);
        };
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [show, onClose, onKeyDown]);

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
