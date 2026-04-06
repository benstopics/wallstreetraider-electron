/**
 * AlertBadge — Bell icon with unread count badge (Req 2.7)
 *
 * Visual states:
 *   Default: bell icon + count badge (grey/blue)
 *   Critical alert present (severity === 'red'): bell pulses red
 *
 * Clicking opens the AlertPanel.
 */
import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import AlertPanel from './AlertPanel.js';

export default function AlertBadge() {
    const alerts       = api.useGameStore(s => s.alerts) || [];
    const alertsUnread = api.useGameStore(s => s.alertsUnread) || 0;
    const [open, setOpen] = useState(false);

    const hasCritical = alerts.some(a => a.severity === 'red');

    // Inject keyframe CSS once — can't use nested backtick template inside html`` tag
    useEffect(() => {
        if (document.getElementById('alert-badge-css')) return;
        const style = document.createElement('style');
        style.id = 'alert-badge-css';
        style.textContent = '@keyframes alertPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }';
        document.head.appendChild(style);
    }, []);

    const handleOpen = () => {
        setOpen(true);
        api.markAlertsRead();
    };

    return html`
        <div style="position:relative;display:inline-block;">
            <button
                class="btn"
                style="position:relative;padding:2px 8px;font-size:16px;line-height:1;${hasCritical ? 'animation:alertPulse 1s ease-in-out infinite;color:#ef4444;' : ''}"
                title="Alerts"
                onClick=${handleOpen}
            >
                🔔
                ${alertsUnread > 0 ? html`
                    <span style="
                        position:absolute;top:-4px;right:-4px;
                        background:${hasCritical ? '#ef4444' : '#3b82f6'};
                        color:#fff;border-radius:50%;
                        min-width:16px;height:16px;
                        font-size:10px;font-weight:700;
                        display:flex;align-items:center;justify-content:center;
                        padding:0 2px;line-height:1;
                    ">${alertsUnread > 99 ? '99+' : alertsUnread}</span>
                ` : ''}
            </button>
            <${AlertPanel} open=${open} onClose=${() => setOpen(false)} />
        </div>
    `;
}
