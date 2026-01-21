import { html, useState, useEffect, useRef, useMemo } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { PauseIcon, StopIcon, SaveIcon, GaugeIcon, ForwardIcon } from '../icons.js';
import NavigationControl from './NavigationControl.js';
import ActingAsDropdown from './ActingAsDropdown.js';
import InputStringModal from './InputStringModal.js';
import NotesModal from './NotesModal.js';
import CalculatorModal from './CalculatorModal.js';
import KeybindsModal from './KeybindsModal.js';
import SettingsModal from './SettingsModal.js';

function Toolbar() {
    const { showHelp } = api.useWSRContext();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);

    const [showNotepad, setShowNotepad] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showKeybinds, setShowKeybinds] = useState(false);

    const [showTickerSpeedModal, setShowTickerSpeedModal] = useState(false);

    const tickSpeed = api.useGameStore(s => s.gameState.tickSpeed);
    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);

    const toggleTicker = () => {
        if (isTickerRunning) {
            api.stopTicker();
        } else {
            api.startTicker();
        }
    }

    // Close menu on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const onDocMouseDown = (e) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const MenuItem = useMemo(() => ({ label, onActivate }) => {
        const handleMenuAction = (action) => {
            setMenuOpen(false);
            action();
        };

        return html`
            <button class="toolbar-menu-item" onClick=${() => handleMenuAction(onActivate)}>${label}</button>
        `;
    }, []);

    return html`
        <div class="top-bar items-center justify-between" style="height: 40px; flex-shrink: 0;">
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
            <div class="flex items-center gap-2">
                <div style="width: 25px; height: 20px"
                class="btn ${isTickerRunning ? 'stop' : 'play'}"
                onClick=${toggleTicker}>
                    <div class="" style="width: 20px">
                        <${isTickerRunning ? StopIcon : PauseIcon} />
                    </div>
                </div>
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
                        Save Game
                    </span>
                </div>
                <div class="btn" onClick=${() => {
                    api.exitGame()
                }}>
                    <span style="white-space: nowrap;">
                        Exit Game
                    </span>
                </div>
                <${SettingsModal}>
                    <div class="btn">
                        <span style="white-space: nowrap;">Settings</span>
                    </div>
                <//>
                <div class="btn" onClick=${() => showHelp()}>
                    <span style="white-space: nowrap;">Help</span>
                </div>
            </div>
            <div class="flex items-center">
                <div class="w-60">
                    <${NavigationControl} />
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="toolbar-menu" ref=${menuRef}>
                    <button class="btn" ref=${menuButtonRef} onClick=${toggleMenu}>
                        <span style="white-space: nowrap;">Tools</span>
                    </button>
                    ${menuOpen && html`
                        <div class="toolbar-menu-popover">
                            <${MenuItem} key="db-search" label="Database Search" onActivate=${() => api.databaseSearch()} />
                            <${MenuItem} key="law-firm" label="Change Law Firm" onActivate=${() => api.changeLawFirm()} />
                            <${MenuItem} key="autopilot" label="Toggle Global Autopilot" onActivate=${() => api.toggleGlobalAutopilot()} />
                            <div key="sep1" class="toolbar-menu-sep"></div>
                            <${MenuItem} label="Fullscreen" onActivate=${() => api.toggleFullscreen()} />
                            <!--<div key="sep4" class="toolbar-menu-sep"></div> -->
                            <!--<${MenuItem} key="notepad" label="Notepad" onActivate=${() => setShowNotepad(true)} /> -->
                            <!--<${MenuItem} key="calculator" label="Calculator" onActivate=${() => setShowCalculator(true)} />-->
                            <${MenuItem} key="help" label="Help" onActivate=${() => showHelp()} />
                            <!--<${MenuItem} key="keybinds" label="Keybinds" onActivate=${() => setShowKeybinds(true)} />-->
                        </div>
                    `}
                </div>

                <div class="btn" onClick=${() => api.viewIndustry(0)}>
                    <span style="white-space: nowrap;">Market Reports</span>
                </div>
            </div>
            <${ActingAsDropdown} />
        </div>
    `;
}

export default Toolbar;