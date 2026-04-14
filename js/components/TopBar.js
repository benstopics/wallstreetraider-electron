/**
 * TopBar — Single persistent bar (~44px) replacing both Toolbar and the sidebar BalanceSheet.
 *
 * Layout (left → right):
 *   [☰ menu]  [utility buttons]  [NavigationPanel]  [Tycoon Vitals (clickable)]  [Charts toggle]
 *
 * Vitals line: "NW: $X | C: $X | D: $X"  — click to expand full balance sheet detail.
 * Charts: Net Worth / GDP / Prime Rate charts are moved behind a collapsible toggle here.
 *
 * Req 1.5: Tutorial button hidden (entry point removed; TutorialSteps.js preserved).
 * Req 1.10: Merged toolbar + vitals in one row.
 * Req 1.11: Charts behind on-demand toggle (not always visible).
 */
import { html, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import NavigationPanel from './NavigationPanel.js';
import NotesModal from './NotesModal.js';
import CalculatorModal from './CalculatorModal.js';
import SettingsModal from './SettingsModal.js';
import Modal from './Modal.js';
import Button from './Button.js';
import AlertBadge from './AlertBadge.js';
import { insertCurrencySymbols, formatCurrency } from './helpers.js';

// ── Cheats popover (unchanged from Toolbar) ──────────────────────────────────
function CheatsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (!popoverRef.current) return;
            if (popoverRef.current.contains(e.target)) return;
            if (triggerRef.current && triggerRef.current.contains(e.target)) return;
            setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    return html`
        <div style="position: relative; display: inline-block;">
            <div ref=${triggerRef} class="btn" onClick=${() => setIsOpen(p => !p)}>
                <span style="white-space: nowrap;">${insertCurrencySymbols("Cheats")}</span>
            </div>
            ${isOpen ? html`
                <div ref=${popoverRef} class="toolbar-menu-popover" style="position: absolute; top: 100%; left: 0; z-index: 99999999 !important; display: flex; flex-direction: column; gap: 2px; border: 1px solid var(--panel-border); border-radius: 4px; padding: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                    <${Button} class="toolbar-menu-item" onClick=${() => { setIsOpen(false); api.cheatDisableLawsuits(); }}>${insertCurrencySymbols("Disable Lawsuits")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => { setIsOpen(false); api.cheatMergerInfo(); }}>${insertCurrencySymbols("Inside Info: Merger")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => { setIsOpen(false); api.cheatEarningsInfo(); }}>${insertCurrencySymbols("Inside Info: Earnings")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => { setIsOpen(false); api.cheatAddCash(); }}>${insertCurrencySymbols("Add/Subtract Cash")}<//>
                </div>
            ` : ''}
        </div>
    `;
}

// ── Hamburger (save/settings/exit) ───────────────────────────────────────────
function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (!popoverRef.current) return;
            if (popoverRef.current.contains(e.target)) return;
            if (triggerRef.current && triggerRef.current.contains(e.target)) return;
            setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    const go = (fn) => { setIsOpen(false); fn(); };

    return html`
        <div style="position: relative; display: inline-block;">
            <div ref=${triggerRef} class="btn"
                 style="font-size: 18px; line-height: 1; padding: 0 8px;"
                 onClick=${() => setIsOpen(p => !p)}>
                ☰
            </div>
            ${isOpen ? html`
                <div ref=${popoverRef} class="toolbar-menu-popover" style="position: absolute; top: 100%; left: 0; z-index: 99999999 !important; display: flex; flex-direction: column; gap: 2px; border: 1px solid var(--panel-border); border-radius: 4px; padding: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                    <${Button} class="toolbar-menu-item" onClick=${() => go(api.saveGame)}>${insertCurrencySymbols("Save Game")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => go(api.saveGameAs)}>${insertCurrencySymbols("Save As")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => go(api.exitGame)}>${insertCurrencySymbols("Exit Game")}<//>
                    <${SettingsModal}>
                        <${Button} class="toolbar-menu-item" data-tutorial="settings-dropdown">${insertCurrencySymbols("Settings")}<//>
                    <//>
                </div>
            ` : ''}
        </div>
    `;
}

// ── Tycoon Vitals (inline NW | Cash | Debt, expandable) ──────────────────────
function TycoonVitals() {
    const [expanded, setExpanded] = useState(false);

    const cash        = api.useGameStore(s => s.gameState.cash)        ?? 0;
    const otherAssets = api.useGameStore(s => s.gameState.otherAssets) ?? 0;
    const totalAssets = api.useGameStore(s => s.gameState.totalAssets) ?? 0;
    const totalDebt   = api.useGameStore(s => s.gameState.totalDebt)   ?? 0;
    const netWorth    = api.useGameStore(s => s.gameState.netWorth)    ?? 0;
    const dlrSign     = api.useGameStore(s => s.gameState.dlrSign)     || '$';
    const euro        = api.useGameStore(s => s.gameState.euro)        || '';

    const fmt = (v) => `${dlrSign}${formatCurrency(v)}${euro}`;

    return html`
        <div style="position: relative;">
            <div
                class="btn"
                style="cursor: pointer; white-space: nowrap; font-size: 12px;"
                onClick=${() => setExpanded(e => !e)}
                title="Click to expand balance sheet"
            >
                ${insertCurrencySymbols(`NW: ${fmt(netWorth)} | C: ${fmt(cash)} | D: ${fmt(totalDebt)}`)}
                <span style="margin-left:4px; opacity:0.5; font-size:10px;">${expanded ? '▲' : '▼'}</span>
            </div>
            ${expanded ? html`
                <div class="panel" style="position: absolute; top: 100%; right: 0; z-index: 9999; min-width: 280px; height: auto; margin-top: 2px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                    <div class="panel-header" style="font-size:12px;">${insertCurrencySymbols("My Balance Sheet")}</div>
                    <div class="p-1 panel-body font-text-sm" style="font-size:12px;">
                        <div class="flex justify-between gap-4">
                            <span class="text-gray-400">${insertCurrencySymbols("Cash [DD]")}</span>
                            <span class="whitespace-nowrap">${fmt(cash)}</span>
                        </div>
                        <div class="flex justify-between gap-4">
                            <span class="text-gray-400">${insertCurrencySymbols("Other Assets")}</span>
                            <span class="whitespace-nowrap">${fmt(otherAssets)}</span>
                        </div>
                        <div class="flex justify-between gap-4">
                            <span class="text-gray-400">${insertCurrencySymbols("Total Assets")}</span>
                            <span class="whitespace-nowrap">${fmt(totalAssets)}</span>
                        </div>
                        <div class="flex justify-between gap-4">
                            <span class="negative">${insertCurrencySymbols("Total Debt")}</span>
                            <span class="negative whitespace-nowrap">${fmt(totalDebt)}</span>
                        </div>
                        <div class="flex justify-between gap-4">
                            <span class="text-gray-400">${insertCurrencySymbols("Net Worth")}</span>
                            <span class="positive whitespace-nowrap">${fmt(netWorth)}</span>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// ── TopBar — main export ──────────────────────────────────────────────────────
export default function TopBar({ onToggleCharts, chartsVisible }) {
    const { showHelp } = api.useWSRContext();
    // Tutorial button intentionally hidden per req 1.5 (entry point disabled;
    // TutorialSteps.js / TutorialOverlay.js preserved for TutorialRewrite build).

    const [showNotepad, setShowNotepad]     = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showAbout, setShowAbout]         = useState(false);

    return html`
        <div class="top-bar items-center justify-between flex-wrap" style="min-height: 44px; flex-shrink: 0; gap: 4px; padding: 2px 6px;">
            <${NotesModal}     show=${showNotepad}   onClose=${() => setShowNotepad(false)} />
            <${CalculatorModal} show=${showCalculator} onClose=${() => setShowCalculator(false)} />

            ${showAbout ? html`
                <${Modal} show=${showAbout} onClose=${() => setShowAbout(false)} style=${{ '--modal-w': '400px', '--modal-h': 'auto' }}>
                    <div style="padding: 24px; text-align: center;">
                        <h2 style="margin: 0 0 8px 0; font-size: 20px;">Wall Street Raider</h2>
                        <p style="margin: 0 0 4px 0; font-size: 14px; opacity: 0.8;">Version 10 Remastered — Early Access</p>
                        <p style="margin: 0 0 4px 0; font-size: 13px;">Copyright © 1986-${new Date().getFullYear()}, All Rights Reserved</p>
                        <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold;">HackJack Games & Ronin Software</p>
                        <p style="margin: 0 0 16px 0; font-size: 12px; opacity: 0.7;">The most realistic Wall Street simulation ever created</p>
                        <${Button} class="btn px-4 py-1" data-testid="btn-close-about" onClick=${() => setShowAbout(false)}>Close</button>
                    </div>
                <//>
            ` : ''}

            <!-- Left: hamburger + utility buttons -->
            <div class="flex items-center gap-1" style="flex-shrink: 0;">
                <${HamburgerMenu} />
                <div class="btn" data-tutorial="fullscreen-button" onClick=${() => api.toggleFullscreen()}>
                    <span style="white-space: nowrap;">${insertCurrencySymbols("Fullscreen")}</span>
                </div>
                <!-- Tutorial button hidden per req 1.5 — TutorialRewrite build will restore it -->
                <div class="btn" onClick=${() => showHelp()}>
                    <span style="white-space: nowrap;">${insertCurrencySymbols("Help")}</span>
                </div>
                <div class="btn" data-testid="btn-about" onClick=${() => setShowAbout(true)}>
                    <span style="white-space: nowrap;">${insertCurrencySymbols("About")}</span>
                </div>
            </div>

            <!-- Center-left: action buttons -->
            <div class="flex flex-wrap items-center gap-1" style="flex-shrink: 1; min-width: 0;">
                <div class="btn" onClick=${() => api.toggleGlobalAutopilot()}>
                    <span style="white-space: nowrap;">${insertCurrencySymbols("Toggle Global Autopilot")}</span>
                </div>
                <${CheatsMenu} />

                <div class="btn" data-testid="btn-end-turn" onClick=${() => api.checkScoreboard()}>
                    <span style="white-space: nowrap;">Scoreboard</span>
                </div>
            </div>

            <!-- Center: Navigation -->
            <div style="flex-shrink: 0;">
                <${NavigationPanel} />
            </div>

            <!-- Right: AlertBadge + Tycoon Vitals + Charts toggle -->
            <div class="flex items-center gap-2" style="flex-shrink: 0;">
                <${AlertBadge} />
                <${TycoonVitals} />
                <div
                    class="btn ${chartsVisible ? 'yellow' : ''}"
                    style="white-space: nowrap; font-size: 12px;"
                    onClick=${onToggleCharts}
                    title="Show/hide Net Worth, GDP, and Prime Rate charts"
                >
                    Charts ${chartsVisible ? '▲' : '▼'}
                </div>
            </div>
        </div>
    `;
}
