/**
 * Select — Custom dropdown replacing native <select> elements site-wide.
 *
 * Motivation: Preact re-renders cause native <select> to flash and fail to
 * register selections on mobile. This component uses click events instead.
 *
 * Props:
 *   options  — Array of { value, label } objects
 *   value    — Currently selected value (string)
 *   onChange — Called with synthetic event { target: { value } } on selection
 *   class    — CSS class(es) applied to the trigger button
 *   style    — Inline styles applied to the trigger button
 *   disabled — If true, dropdown cannot be opened
 */
import { html, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';

export default function Select({ options = [], value, onChange, class: className = '', style, disabled = false }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const dropdownPos = useRef({});

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open]);

    const selected = options.find(o => String(o.value) === String(value));
    const displayLabel = selected ? selected.label : (value || '—');

    const handleSelect = (optValue) => {
        setOpen(false);
        if (onChange) {
            onChange({ target: { value: optValue } });
        }
    };

    const handleOpen = (e) => {
        e.preventDefault();
        if (disabled) return;
        if (!open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            dropdownPos.current = {
                top: rect.bottom + 'px',
                left: rect.left + 'px',
                minWidth: rect.width + 'px',
            };
        }
        setOpen(o => !o);
    };

    return html`
        <div ref=${containerRef} style="position: relative; display: inline-block;">
            <button
                ref=${triggerRef}
                class="${className} select-trigger"
                style=${style}
                disabled=${disabled}
                onClick=${handleOpen}
                type="button"
            >
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; display: inline-block; vertical-align: middle;">${displayLabel}</span>
                <span style="margin-left: 4px; opacity: 0.6; font-size: 10px;">▼</span>
            </button>
            ${open ? html`
                <div class="select-dropdown" style=${{
                    position: 'fixed',
                    top: dropdownPos.current.top,
                    left: dropdownPos.current.left,
                    minWidth: dropdownPos.current.minWidth,
                    zIndex: 99999,
                    maxHeight: '240px',
                    overflowY: 'auto',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}>
                    ${options.map(opt => html`
                        <div
                            key=${opt.value}
                            class="select-option ${String(opt.value) === String(value) ? 'select-option-selected' : ''}"
                            onClick=${() => handleSelect(opt.value)}
                            style="cursor: pointer; padding: 4px 10px; white-space: nowrap;"
                        >${opt.label}</div>
                    `)}
                </div>
            ` : ''}
        </div>
    `;
}
