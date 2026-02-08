import { html, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { PauseIcon, StopIcon, SaveIcon, GaugeIcon, ForwardIcon, PlayIcon } from '../icons.js';
import NavigationPanel from './NavigationPanel.js';
import InputStringModal from './InputStringModal.js';
import NotesModal from './NotesModal.js';
import CalculatorModal from './CalculatorModal.js';
import KeybindsModal from './KeybindsModal.js';
import SettingsModal from './SettingsModal.js';
import Button from './Button.js';
import { insertCurrencySymbols } from './helpers.js';
import { bracketLabel } from '../hotkeys.js';
import { useShiftHeld } from '../hooks/useHotkey.js';

function CheatsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const onDocMouseDown = (e) => {
            if (!popoverRef.current) return;
            if (popoverRef.current.contains(e.target)) return;
            if (triggerRef.current && triggerRef.current.contains(e.target)) return;
            setIsOpen(false);
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, [isOpen]);

    const handleCheat = (fn) => {
        setIsOpen(false);
        fn();
    };

    return html`
        <div style="position: relative; display: inline-block;">
            <div ref=${triggerRef} class="btn" onClick=${() => setIsOpen(prev => !prev)}>
                <span style="white-space: nowrap;">${insertCurrencySymbols("Cheats")}</span>
            </div>
            ${isOpen ? html`
                <div ref=${popoverRef} class="toolbar-menu-popover" style="position: absolute; top: 100%; left: 0; z-index: 99999999 !important; display: flex; flex-direction: column; gap: 2px; border: 1px solid var(--panel-border); border-radius: 4px; padding: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                    <${Button} class="toolbar-menu-item" onClick=${() => handleCheat(api.cheatDisableLawsuits)}>${insertCurrencySymbols("Disable Lawsuits")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => handleCheat(api.cheatMergerInfo)}>${insertCurrencySymbols("Inside Info: Merger")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => handleCheat(api.cheatEarningsInfo)}>${insertCurrencySymbols("Inside Info: Earnings")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => handleCheat(api.cheatAddCash)}>${insertCurrencySymbols("Add/Subtract Cash")}<//>
                </div>
            ` : ''}
        </div>
    `;
}

function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const onDocMouseDown = (e) => {
            if (!popoverRef.current) return;
            if (popoverRef.current.contains(e.target)) return;
            if (triggerRef.current && triggerRef.current.contains(e.target)) return;
            setIsOpen(false);
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, [isOpen]);

    const handleAction = (fn) => {
        setIsOpen(false);
        fn();
    };

    return html`
        <div style="position: relative; display: inline-block;">
            <div ref=${triggerRef} class="btn" onClick=${() => setIsOpen(prev => !prev)}
                 style="font-size: 18px; line-height: 1; padding: 0 8px;">
                \u2630
            </div>
            ${isOpen ? html`
                <div ref=${popoverRef} class="toolbar-menu-popover" style="position: absolute; top: 100%; left: 0; z-index: 99999999 !important; display: flex; flex-direction: column; gap: 2px; border: 1px solid var(--panel-border); border-radius: 4px; padding: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                    <${Button} class="toolbar-menu-item" onClick=${() => handleAction(api.saveGame)}>${insertCurrencySymbols("Save Game")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => handleAction(api.saveGameAs)}>${insertCurrencySymbols("Save As")}<//>
                    <${Button} class="toolbar-menu-item" onClick=${() => handleAction(api.exitGame)}>${insertCurrencySymbols("Exit Game")}<//>
                    <${SettingsModal}>
                        <${Button} class="toolbar-menu-item" data-tutorial="settings-dropdown">${insertCurrencySymbols("Settings")}<//>
                    <//>
                </div>
            ` : ''}
        </div>
    `;
}

function Toolbar() {
    const { showTutorial, showHelp } = api.useWSRContext();

    const [showNotepad, setShowNotepad] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showKeybinds, setShowKeybinds] = useState(false);

    const shiftHeld = useShiftHeld();

    return html`
        <div class="top-bar items-center justify-between" style="height: 60px; flex-shrink: 0;">
            <${NotesModal} show=${showNotepad} onClose=${() => setShowNotepad(false)} />
            <${CalculatorModal} show=${showCalculator} onClose=${() => setShowCalculator(false)} />
            <${KeybindsModal} show=${showKeybinds} onClose=${() => setShowKeybinds(false)} />
            <div class="flex items-center gap-2" style="flex-shrink: 1; min-width: 0;">
                <${HamburgerMenu} />
                <div class="flex flex-wrap items-center gap-2">
                    <div class="btn" data-tutorial="fullscreen-button" onClick=${() => api.toggleFullscreen()}>
                        <span style="white-space: nowrap;">${insertCurrencySymbols("Fullscreen")}</span>
                    </div>
                    <div class="btn" onClick=${() => showTutorial()}>
                        <span style="white-space: nowrap;">${insertCurrencySymbols("Tutorial")}</span>
                    </div>
                    <div class="btn" onClick=${() => showHelp()}>
                        <span style="white-space: nowrap;">${insertCurrencySymbols("Help")}</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap items-center gap-2" style="flex-shrink: 1; min-width: 0;">
                <div class="btn" onClick=${() => api.changeLawFirm()}>
                    <span style="white-space: nowrap;">${shiftHeld ? bracketLabel("Change Law Firm", "L") : insertCurrencySymbols("Change Law Firm")}</span>
                </div>
                <div class="btn" onClick=${() => api.toggleGlobalAutopilot()}>
                    <span style="white-space: nowrap;">${insertCurrencySymbols("Toggle Global Autopilot")}</span>
                </div>
                <${CheatsMenu} />
                <div class="btn" data-tutorial="market-reports" onClick=${() => api.viewIndustry(0)}>
                    <span style="white-space: nowrap;">${shiftHeld ? bracketLabel("Market Reports", "M") : insertCurrencySymbols("Market Reports")}</span>
                </div>
                <div class="btn" data-tutorial="database-search" onClick=${() => api.viewDbSearch()}>
                    <span style="white-space: nowrap;">${shiftHeld ? bracketLabel("Database Search", "D") : insertCurrencySymbols("Database Search")}</span>
                </div>
            </div>
            <${NavigationPanel} />
        </div>
    `;
}

export default Toolbar;