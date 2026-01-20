import { html, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { PauseIcon, StopIcon, SaveIcon, GaugeIcon, ForwardIcon } from '../icons.js';
import NavigationControl from './NavigationControl.js';
import ActingAsDropdown from './ActingAsDropdown.js';
import InputStringModal from './InputStringModal.js';
import NotesModal from './NotesModal.js';
import CalculatorModal from './CalculatorModal.js';
import KeybindsModal from './KeybindsModal.js';

function Toolbar() {
    const { showHelp } = api.useWSRContext();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);

    const [showNotepad, setShowNotepad] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showKeybinds, setShowKeybinds] = useState(false);

    // Persisted menu position (draggable popover)
    const [menuPos, setMenuPos] = useState(() => {
        try {
            const raw = localStorage.getItem('wsr_menu_pos');
            if (!raw) return { x: null, y: null };
            const parsed = JSON.parse(raw);
            if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') return parsed;
        } catch { }
        return { x: null, y: null };
    });
    const dragStateRef = useRef({ dragging: false, dx: 0, dy: 0 });

    const [showTickerSpeedModal, setShowTickerSpeedModal] = useState(false);

    const tickSpeed = api.useGameStore(s => s.gameState.tickSpeed);
    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);

    const toggleSpeed = () => {
        const speed = tickSpeed;
        const newSpeed = speed >= 90 ? 30 : speed >= 75 ? 100 : 75;
        api.setTickSpeed(newSpeed);
    }

    const toggleTicker = () => {
        if (isTickerRunning) {
            api.stopTicker();
        } else {
            api.startTicker();
        }
    }

    // Close menu on outside click
    useEffect(() => {
        const onDocMouseDown = (e) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, []);

    // Drag handlers
    useEffect(() => {
        const onMove = (e) => {
            if (!dragStateRef.current.dragging) return;
            const x = Math.max(0, e.clientX - dragStateRef.current.dx);
            const y = Math.max(0, e.clientY - dragStateRef.current.dy);
            const next = { x, y };
            setMenuPos(next);
            try { localStorage.setItem('wsr_menu_pos', JSON.stringify(next)); } catch { }
        };
        const onUp = () => { dragStateRef.current.dragging = false; };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }, []);

    const startDragMenu = (e) => {
        if (e.button !== 0) return;
        const pop = e.currentTarget.closest('.toolbar-menu-popover');
        if (!pop) return;
        const rect = pop.getBoundingClientRect();
        dragStateRef.current.dragging = true;
        dragStateRef.current.dx = e.clientX - rect.left;
        dragStateRef.current.dy = e.clientY - rect.top;
        if (menuPos.x === null || menuPos.y === null) {
            const next = { x: rect.left, y: rect.top };
            setMenuPos(next);
            try { localStorage.setItem('wsr_menu_pos', JSON.stringify(next)); } catch { }
        }
        e.preventDefault();
        e.stopPropagation();
    };

    const toggleMenu = () => {
        setMenuOpen(prev => {
            const nextOpen = !prev;
            if (nextOpen && (menuPos.x === null || menuPos.y === null)) {
                const btn = menuButtonRef.current;
                if (btn && typeof btn.getBoundingClientRect === 'function') {
                    const r = btn.getBoundingClientRect();
                    const next = { x: Math.max(0, Math.round(r.left)), y: Math.max(0, Math.round(r.bottom + 4)) };
                    setMenuPos(next);
                    try { localStorage.setItem('wsr_menu_pos', JSON.stringify(next)); } catch { }
                }
            }
            return nextOpen;
        });
    };

    const safe = async (fn) => {
        try {
            await fn();
        } catch (e) {
            console.error(e);
            alert(e?.message || String(e));
        }
    };

    // Some builds can feel like they require multiple clicks because:
    //  - the popover is draggable (mousedown listeners)
    //  - we also close on document mousedown
    // Trigger actions on mousedown (and also keep onClick as fallback) so the
    // action fires reliably on the first press.
    const MenuItem = ({ label, onActivate }) => {
        const run = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            setMenuOpen(false);
            // Run after state update so the UI closes immediately.
            queueMicrotask(() => safe(onActivate));
        };
        return html`
            <button class="toolbar-menu-item" onMouseDown=${run} onClick=${run}>${label}</button>
        `;
    };


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
                detachToBody=${true}
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
                <div class="toolbar-menu" ref=${menuRef}>
                    <button class="btn" ref=${menuButtonRef} onClick=${toggleMenu}>
                        <span style="white-space: nowrap;">Menu</span>
                    </button>
                    ${menuOpen ? html`
                        <div class="toolbar-menu-popover" style=${(menuPos.x !== null && menuPos.y !== null)
                            ? `position:fixed; left:${menuPos.x}px; top:${menuPos.y}px; z-index:9999;`
                            : `position:fixed; left:8px; top:44px; z-index:9999;`}>
                            <div class="toolbar-menu-drag-handle" onMouseDown=${startDragMenu}>Menu</div>
                            <${MenuItem} label="Database Search" onActivate=${() => api.databaseSearch()} />
                            <${MenuItem} label="Change Law Firm" onActivate=${() => api.changeLawFirm()} />
                            <${MenuItem} label="Harassment Lawsuit" onActivate=${() => api.harrassingLawsuit()} />
                            <${MenuItem} label="Spread Rumors" onActivate=${() => api.spreadRumors()} />
                            ${'' /* Removed: WSR Heat Map (requested) */}
                            <${MenuItem} label="Toggle Global Autopilot" onActivate=${() => api.toggleGlobalAutopilot()} />
                            <div class="toolbar-menu-sep"></div>
                            <${MenuItem} label="Unethical Scenarios" onActivate=${() => api.unethicalScenarios()} />
                            <${MenuItem} label="Suppress Popups" onActivate=${() => api.toggleSuppressPopups()} />
                            <${MenuItem} label="Enable Cheats" onActivate=${() => api.enableCheats()} />
                            <${MenuItem} label="Fullscreen" onActivate=${() => api.toggleFullscreen()} />
                            <div class="toolbar-menu-sep"></div>
                            <${MenuItem} label="Notepad" onActivate=${() => setShowNotepad(true)} />
                            <${MenuItem} label="Calculator" onActivate=${() => setShowCalculator(true)} />
                            <${MenuItem} label="Help" onActivate=${() => showHelp()} />
                            <${MenuItem} label="Keybinds" onActivate=${() => setShowKeybinds(true)} />
                        </div>
                    ` : ''}
                </div>

                <div class="btn" onClick=${() => { safe(() => api.viewIndustry(0)); }}>
                    <span style="white-space: nowrap;">Market Reports</span>
                </div>
                <div class="w-60">
                    <${NavigationControl} />
                </div>
            </div>
            <${ActingAsDropdown} />
        </div>
    `;
}

export default Toolbar;