import { html, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';

// Simple toast notification queue — module-level state
let toastQueue = [];
let toastListeners = [];

export function showToast(message, { duration = 5000, type = 'info' } = {}) {
    const id = Date.now() + Math.random();
    toastQueue = [...toastQueue, { id, message, duration, type }];
    toastListeners.forEach(fn => fn(toastQueue));
}

function removeToast(id) {
    toastQueue = toastQueue.filter(t => t.id !== id);
    toastListeners.forEach(fn => fn(toastQueue));
}

const typeColors = {
    info: '#3b82f6',
    success: '#22c55e',
    warning: '#eab308',
    alert: '#f59e0b',
    error: '#ef4444',
};

export function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        toastListeners.push(setToasts);
        return () => { toastListeners = toastListeners.filter(fn => fn !== setToasts); };
    }, []);

    // Auto-dismiss
    useEffect(() => {
        const timers = toasts.map(t =>
            setTimeout(() => removeToast(t.id), t.duration)
        );
        return () => timers.forEach(clearTimeout);
    }, [toasts]);

    if (toasts.length === 0) return null;

    return html`
        <div style="position: fixed; top: 12px; right: 12px; z-index: 999999; display: flex; flex-direction: column; gap: 8px; pointer-events: none;">
            ${toasts.map(t => html`
                <div key=${t.id} style="
                    background: ${typeColors[t.type] || typeColors.info};
                    color: white;
                    padding: 10px 16px;
                    border-radius: 6px;
                    font-size: 13px;
                    max-width: 360px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    pointer-events: auto;
                    cursor: pointer;
                    animation: toast-slide-in 0.3s ease-out;
                " onClick=${() => removeToast(t.id)} data-testid="toast">
                    ${t.message}
                </div>
            `)}
        </div>
    `;
}

export default ToastContainer;
