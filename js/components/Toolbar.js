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

function Toolbar() {
    const { showTutorial, showHelp } = api.useWSRContext();

    const [showNotepad, setShowNotepad] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showKeybinds, setShowKeybinds] = useState(false);

    const [showTickerSpeedModal, setShowTickerSpeedModal] = useState(false);
    const shiftHeld = useShiftHeld();

    const tickSpeed = api.useGameStore(s => s.gameState.tickSpeed);
    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);

    const toggleTicker = () => {
        if (isTickerRunning) {
            api.stopTicker();
        } else {
            api.startTicker();
        }
    }

    return html`
        <div class="top-bar items-center justify-between" style="height: 60px; flex-shrink: 0;">
            <${NotesModal} show=${showNotepad} onClose=${() => setShowNotepad(false)} />
            <${CalculatorModal} show=${showCalculator} onClose=${() => setShowCalculator(false)} />
            <${KeybindsModal} show=${showKeybinds} onClose=${() => setShowKeybinds(false)} />
            <${InputStringModal}
                show=${showTickerSpeedModal}
                title="Set Ticker Speed"
                text="Enter the desired ticker speed (1-100):"
                defaultValue=${tickSpeed.toString()}
                onSubmit=${(value) => {
                api.setTickSpeed(Math.min(100, Math.max(1, parseInt(value))))
                    setShowTickerSpeedModal(false);
                }}
                onCancel=${() => setShowTickerSpeedModal(false)}
            />
            <div class="flex items-center gap-2" style="flex-shrink: 1; min-width: 0;">
                <div style="width: 25px; height: 20px"
                data-tutorial="pause-button"
                class="btn ${isTickerRunning ? 'stop' : 'play'}"
                onClick=${toggleTicker}>
                    <div class="" style="width: 20px">
                        <${isTickerRunning ? StopIcon : PlayIcon} />
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <div style="height: 20px" class="btn blue" onClick=${() => {
                        setShowTickerSpeedModal(true)
                    }}>
                        <div class="flex w-full items-center justify-center gap-1" style="">
                            <div class="" style="width: 20px">
                                <${GaugeIcon} />
                            </div>
                            <div>
                                ${tickSpeed}
                            </div>
                        </div>
                    </div>
                    <div style="height: 20px" class="btn" onClick=${() => {
                        api.runTicker()
                    }}>
                        <div class="flex w-full items-center justify-center gap-1" style="">
                            <div class="" style="width: 20px">
                                <${ForwardIcon} />
                            </div>
                        </div>
                    </div>
                    <div class="btn green" onClick=${() => {
                        api.saveGame()
                    }}>
                        <!--<div class="mr-1" style="width: 7px">
                            <${SaveIcon} />
                        </div>-->
                        <span style="white-space: nowrap;">
                            ${insertCurrencySymbols("Save Game")}
                        </span>
                    </div>
                    <div class="btn green" onClick=${() => {
                        api.saveGameAs()
                    }}>
                        <!--<div class="mr-1" style="width: 7px">
                            <${SaveIcon} />
                        </div>-->
                        <span style="white-space: nowrap;">
                            ${insertCurrencySymbols("Save As")}
                        </span>
                    </div>
                    <div class="btn" onClick=${() => {
                        api.exitGame()
                    }}>
                        <span style="white-space: nowrap;">
                            ${insertCurrencySymbols("Exit Game")}
                        </span>
                    </div>
                    <${SettingsModal}>
                        <div class="btn" data-tutorial="settings-dropdown">
                            <span style="white-space: nowrap;">${insertCurrencySymbols("Settings")}</span>
                        </div>
                    <//>
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