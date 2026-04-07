import { html, render, useState, useEffect, useRef } from './lib/preact.standalone.module.js';
import './lib/tailwind.module.js';
import * as api from './api.js';
import { matchHotkey, setHotkeysVisualDisabled } from './hotkeys.js';
import { isEditableTarget } from './keybinds.js';
import { hotkeyManager, PRIORITY } from './hotkeyManager.js';
import { useHotkey } from './hooks/useHotkey.js';

const ipcRenderer = (typeof require !== 'undefined')
    ? require('electron').ipcRenderer
    : { invoke: () => Promise.resolve(null), send: () => {}, on: () => {} };
import GameUI from './components/GameUI.js';
import MainMenu from './components/MainMenu.js';
import SplashSequence from './components/SplashSequence.js';
import HelpModal from './components/HelpModal.js';
import InputStringModal from './components/InputStringModal.js';
import ConfirmModal from './components/ConfirmModal.js';
import InfoModal from './components/InfoModal.js';
import NewGameSetupModal from './components/NewGameSetupModal.js';
import AdvancedOptionsModal from './components/AdvancedOptionsModal.js';
import InterestRateSwapsModal from './components/InterestRateSwapsModal.js';
import BankAllocationModal from './components/BankAllocationModal.js';
import TextAnnounceModal from './components/TextAnnounceModal.js';
import CompanySelectModal from './components/CompanySelectModal.js';
import TutorialModal from './components/TutorialModal.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import PriceAlertModal from './components/PriceAlertModal.js';

// Initialize the centralized hotkey manager (single capture-phase listener).
// All hotkey handlers (modal, global, dropdown, tabs, line-selection) register
// via useHotkey() hook and dispatch through the manager's priority system.
hotkeyManager.init();

const logos = [
    { src: "assets/roninsoft_logo.png", backgroundColor: "#ffffff" },
    { src: "assets/hackjackgames_logo.png", backgroundColor: "#000000" }
];

const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV?.trim() == 'development';

const AppInner = () => {
    const { helpShown, helpSectionId, hideHelp, setGameState } = api.useWSRContext();

    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);
    const splashScreenPlayed = isDev ? true : api.useGameStore(s => s.gameState.splashScreenPlayed);
    const gameLoaded = api.useGameStore(s => s.gameState.gameLoaded);
    const isLoading = api.useGameStore(s => s.gameState.isLoading);
    const modalType = api.useGameStore(s => s.gameState.modalType);
    const modalTitle = api.useGameStore(s => s.gameState.modalTitle);
    const modalText = api.useGameStore(s => s.gameState.modalText);
    const modalDefault = api.useGameStore(s => s.gameState.modalDefault);
    const readyToRestart = api.useGameStore(s => s.gameState.readyToRestart);
    const disableHotkeysSetting = api.useGameStore(s => s.gameState.disableHotkeysSetting);

    // Sync "Disable Hotkeys" setting from game state to hotkeyManager
    useEffect(() => {
        hotkeyManager.setDisabled(!!disableHotkeysSetting);
        setHotkeysVisualDisabled(!!disableHotkeysSetting);
    }, [disableHotkeysSetting]);

    // Detect ready to restart signal and restart WSR to return to main menu
    // This flag is set AFTER all end-game dialogs are closed
    useEffect(() => {
        if (readyToRestart === 'Y' && modalType === 0) {
            console.log('Ready to restart detected, restarting WSR...');
            ipcRenderer.send('restart-wsr');
        }
    }, [readyToRestart, modalType]);

    // useEffect(() => {
    //     const connectWebSocket = (retryCount = 0) => {
    //         const ws = new WebSocket('ws://127.0.0.1:9632');

    //         ws.onopen = () => {
    //             console.log('WebSocket connection established');
    //             retryCount = 0; // Reset retry count on successful connection

    //             api.getGameState().then((newGameState) => {
    //                 setGameState(newGameState);
    //             }).catch(console.error);

    //         };

    //         ws.onmessage = (evt) => {
    //             const msg = JSON.parse(evt.data);
    //             if (msg.path === '/game_state_patch') {
    //                 // console.log('Patch received', msg.payload);
    //                 setGameState(prev => {
    //                     const ops = Array.isArray(msg.payload) ? msg.payload : JSON.parse(msg.payload);
    //                     // non-mutating apply; prev remains untouched
    //                     const { newDocument } = applyPatch(prev, ops, /* validate */ true, /* mutateDocument */ false);
    //                     return newDocument;
    //                 });
    //             } else if (msg.path === '/game_state') {
    //                 // console.log('Full patch', msg.payload);
    //                 setGameState(prev => ({ ...prev, ...msg.payload }));
    //             }
    //         };

    //         ws.onerror = (err) => {
    //             console.error('WebSocket error:', err);
    //         };

    //         ws.onclose = () => {
    //             console.warn('WebSocket connection closed, retrying...');
    //             const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with max delay of 30 seconds
    //             setTimeout(() => connectWebSocket(retryCount + 1), delay);
    //         };
    //     };

    //     connectWebSocket();

    //     return () => ws.close();
    // }, []);

    const hideModal = () => {
        api.closeModal();
    }

    // Modal keyboard shortcuts (Y/N/C/ESC when modal is open)
    const modalHotkeyIdRef = useRef(Symbol('app-modal-hotkey'));
    useHotkey(
        modalHotkeyIdRef.current,
        PRIORITY.MODAL,
        (e) => {
            if (e.key === 'Escape') return true;
            if (isEditableTarget(e.target)) return false;
            const match = matchHotkey(e);
            // InputStringModal (type 3) handles its own letter shortcuts (C/S/D)
            if (match?.action === 'MODAL_CANCEL' && modalType === 3) return false;
            return !!(match && (match.action === 'MODAL_YES' || match.action === 'MODAL_NO' || match.action === 'MODAL_CANCEL'));
        },
        (e) => {
            if (e.key === 'Escape' && !e.defaultPrevented) {
                e.preventDefault();
                if (modalType === 2) api.modalResult(3);
                else hideModal();
                return true;
            }
            const match = matchHotkey(e);
            if (!match) return false;
            if (match.action === 'MODAL_CANCEL') {
                if (modalType === 3) return false; // InputStringModal handles its own shortcuts
                if (modalType === 2) api.modalResult(3);
                else hideModal();
                return true;
            }
            if (modalType === 1 || modalType === 2) {
                if (match.action === 'MODAL_YES') { api.modalResult(1); return true; }
                if (match.action === 'MODAL_NO') { api.modalResult(2); return true; }
            }
            return false;
        },
        { active: modalType > 0 },
        [modalType]
    );

    // Global game keyboard shortcuts
    const globalHotkeyIdRef = useRef(Symbol('app-global-hotkey'));
    useHotkey(
        globalHotkeyIdRef.current,
        PRIORITY.GLOBAL,
        (e) => {
            // ESC, Enter (digit confirm) work even with helpShown or modal open
            if (e.key === 'Escape' && !isEditableTarget(e.target)) return true;
            if (e.key === 'Enter' && hotkeyManager.digitBuffer && !isEditableTarget(e.target)) return true;
            if (isEditableTarget(e.target)) return false;
            if (helpShown) return false;
            if (modalType > 0) return false; // Don't fire global hotkeys while a game modal is showing
            // Shift+letter for dropdowns (Corporate=c, Hostile=h)
            if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey) {
                if (['c', 'h'].includes(e.key.toLowerCase())) return true;
            }
            return !!matchHotkey(e);
        },
        (e) => {
            // ESC: clear digit buffer
            if (e.key === 'Escape' && !isEditableTarget(e.target)) {
                if (hotkeyManager.digitBuffer) {
                    hotkeyManager.clearDigitBuffer();
                    e.preventDefault();
                    return true;
                }
                return false;
            }

            // Enter: confirm digit buffer if non-empty
            if (e.key === 'Enter' && hotkeyManager.digitBuffer && !isEditableTarget(e.target)) {
                e.preventDefault();
                hotkeyManager.confirmDigitBuffer();
                return true;
            }

            if (isEditableTarget(e.target)) return false;
            if (helpShown) return false;
            if (modalType > 0) return false; // Don't fire global hotkeys while a game modal is showing

            // Dropdown letter keys (Shift+letter to open action bar dropdowns)
            if (!e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey) {
                const dropdownChars = ['c', 'h'];
                if (dropdownChars.includes(e.key.toLowerCase())) {
                    document.dispatchEvent(new CustomEvent('hotkey-dropdown', { detail: { char: e.key.toLowerCase() } }));
                    return true;
                }
            }

            // Handle Ctrl+Shift+= (produces e.key='+' on US keyboards) for zoom in
            if (e.ctrlKey && (e.key === '+' || e.key === '_')) {
                e.preventDefault();
                ipcRenderer.send(e.key === '+' ? 'zoom-in' : 'zoom-out');
                return true;
            }

            const match = matchHotkey(e);
            if (!match) return false;

            // Ignore key repeat for navigation and one-shot actions
            if (e.repeat && (match.action === 'NAV_BACK' || match.action === 'NAV_FORWARD' ||
                             match.action === 'ACTING_AS_PREV' || match.action === 'ACTING_AS_NEXT' ||
                             match.action === 'SAVE_GAME')) {
                e.preventDefault();
                return true;
            }

            switch (match.action) {
                case 'NAV_BACK':      e.preventDefault(); api.goBack(); return true;
                case 'NAV_FORWARD':   e.preventDefault(); api.goForward(); return true;
                case 'FOCUS_COMMAND':  e.preventDefault(); document.dispatchEvent(new CustomEvent('hotkey-focus-command')); return true;
                case 'MARKET_REPORTS':    api.viewIndustry(0); return true;
                case 'DATABASE_SEARCH':   api.viewDbSearch(); return true;
                case 'CHANGE_LAW_FIRM':   api.changeLawFirm(); return true;
                case 'VIEW_ACTING_AS':   api.setViewAsset(api.gameStore.getState().gameState.actingAsId); return true;
                case 'ACT_AS':           document.dispatchEvent(new CustomEvent('hotkey-act-as')); return true;
                case 'VIEW_LAST_ENTITY': document.dispatchEvent(new CustomEvent('hotkey-view-last-entity')); return true;
                case 'VIEW_INDUSTRY':    document.dispatchEvent(new CustomEvent('hotkey-view-industry')); return true;
                case 'VIEW_PLAYER':      document.dispatchEvent(new CustomEvent('hotkey-view-player')); return true;
                case 'ACTING_AS_PREV':   e.preventDefault(); api.cycleActingAs(-1); return true;
                case 'ACTING_AS_NEXT':   e.preventDefault(); api.cycleActingAs(1); return true;

                // Streaming Quotes
                case 'FILL_STREAM':   api.fillStreamList(); return true;
                case 'SHOW_ALERTS':   api.showPriceAlerts(); return true;
                case 'CLEAR_STREAM':  api.clearStreamList(); return true;

                // Bar buttons (SHIFT+number)
                case 'BAR_1': case 'BAR_2': case 'BAR_3': case 'BAR_4': case 'BAR_5':
                case 'BAR_6': case 'BAR_7': case 'BAR_8': case 'BAR_9': case 'BAR_10': {
                    const idx = match.action === 'BAR_10' ? 9 : parseInt(match.action.slice(4), 10) - 1;
                    document.dispatchEvent(new CustomEvent('hotkey-tab', { detail: { index: idx } }));
                    return true;
                }

                // Tabs / Line selection (plain number keys) - routed through manager's digit buffer
                case 'TAB_1': case 'TAB_2': case 'TAB_3': case 'TAB_4': case 'TAB_5':
                case 'TAB_6': case 'TAB_7': case 'TAB_8': case 'TAB_9': case 'TAB_10': {
                    const digit = match.action === 'TAB_10' ? '0' : match.action.slice(4);
                    hotkeyManager.handleDigit(digit);
                    return true;
                }

                case 'TOGGLE_TICKER':
                    if (isTickerRunning) api.stopTicker();
                    else api.startTicker();
                    return true;
                case 'SAVE_GAME':
                    e.preventDefault();
                    api.saveGame();
                    return true;
                case 'ZOOM_IN':
                    e.preventDefault();
                    ipcRenderer.send('zoom-in');
                    return true;
                case 'ZOOM_OUT':
                    e.preventDefault();
                    ipcRenderer.send('zoom-out');
                    return true;
                case 'ZOOM_RESET':
                    e.preventDefault();
                    ipcRenderer.send('zoom-reset');
                    return true;
            }
            return false;
        },
        { active: gameLoaded },
        [isTickerRunning, helpShown, gameLoaded, modalType]
    );

    // Stop ticker when help modal is shown
    useEffect(() => {
        if (helpShown && isTickerRunning) {
            api.stopTicker();
        }
    }, [helpShown]);

    useEffect(() => {
        let timeoutId;
        let pollSeq = 0;
        let consecutiveErrors = 0;
        let wasGameLoaded = false;

        const fetchGameState = () => {
            pollSeq++;
            const seq = pollSeq;
            api.getGameState().then((newGameState) => {
                consecutiveErrors = 0;

                // Log sparingly: first 3 polls, every 100th, or game state transitions
                if (seq <= 3 || seq % 100 === 0 || newGameState.gameLoaded !== wasGameLoaded) {
                    console.log(`[POLL #${seq}] gameLoaded=${newGameState.gameLoaded} modalType=${newGameState.modalType} companies=${newGameState.allCompanies?.length}`);
                }
                wasGameLoaded = newGameState.gameLoaded;

                // Only build hyperlink regex when there are companies to link
                if (newGameState.allCompanies?.length > 0) {
                    newGameState.hyperlinkRegex = api.buildDictRegex(
                        newGameState.allCompanies,
                        newGameState.allIndustries
                    );
                }

                const mergedState = api.mergeGameState(newGameState);
                requestAnimationFrame(() => {
                    setGameState(mergedState);
                });

                // Adaptive polling: 200ms on main menu, 50ms during gameplay
                const interval = newGameState.gameLoaded ? 50 : 200;
                timeoutId = setTimeout(fetchGameState, interval);
            }).catch((error) => {
                consecutiveErrors++;
                if (consecutiveErrors <= 1 || consecutiveErrors % 10 === 0) {
                    console.error(`[POLL #${seq}] FAILED (errors=${consecutiveErrors}): ${error.message}`);
                }
                // Exponential backoff: 1s, 2s, 4s, max 5s
                const backoff = Math.min(1000 * Math.pow(2, consecutiveErrors - 1), 5000);
                timeoutId = setTimeout(fetchGameState, backoff);
            });
        };

        console.log('[POLL] Starting gamestate polling loop');
        fetchGameState();

        return () => clearTimeout(timeoutId);
    }, []);

    return html`
        <${SplashSequence}
            images=${logos}
            fadeMs=${900}
            holdMs=${1500}
            blackoutMs=${700}
            exitFadeMs=${700}
            show=${!splashScreenPlayed}
        />
        <div class="app-container">
            ${gameLoaded ? html`<${GameUI} />`
            : html`<${MainMenu} />`}
            ${isLoading && !modalType ? html`
                <div className="loading-overlay">
                    <img src="assets/loading.gif" alt="Loading..." />
                </div>
            ` : ''}
        </div>
        <!-- Modals rendered outside app-container to prevent clipping -->
        <${ConfirmModal}
            show=${modalType === 1 || modalType === 2}
            title=${modalTitle}
            text=${modalText}
            onYes=${() => { api.modalResult(1); }}
            onNo=${() => { api.modalResult(2); }}
            onCancel=${modalType === 2 ? () => { api.modalResult(3); } : undefined}
        />
        <${InputStringModal}
            show=${modalType === 3}
            title=${modalTitle}
            text=${modalText}
            defaultValue=${modalDefault}
            onSubmit=${(value) => { api.modalResult(value); }}
            onCancel=${hideModal}
        />
        <${InfoModal}
            show=${modalType === 4}
            title=${modalTitle}
            text=${modalText}
            onClose=${hideModal}
        />
        <${NewGameSetupModal}
            show=${modalType === 5}
            onSubmit=${(newSettings) => {
                api.modalResult(api.serialize(newSettings));
            }}
            onCancel=${hideModal}
        />
        <${AdvancedOptionsModal}
            show=${modalType === 6}
            stateStr=${modalType === 6 ? modalText : ''}
            title=${modalTitle}
            onSubmit=${(newState) => {
                api.modalResult(api.serialize({...newState, buttonId: "SUBMIT"}));
            }}
        />
        <${HelpModal} show=${helpShown} onClose=${hideHelp} initialSectionId=${helpSectionId} />
        <${InterestRateSwapsModal}
            show=${modalType === 7}
            title=${modalTitle}
            stateStr=${modalType === 7 ? modalText : ''}
            onSubmit=${(newState) => {
                api.modalResult(api.serialize({...newState, buttonId: "OFFER"}));
            }}
        />
        <${BankAllocationModal}
            show=${modalType === 10}
            title=${modalTitle}
            stateStr=${modalType === 10 ? modalText : ''}
            onSubmit=${(newState) => {
                api.modalResult(api.serialize({...newState, buttonId: "APPLY"}));
            }}
        />
        <${TextAnnounceModal}
            show=${modalType === 8}
            title=${modalTitle}
            text=${modalText}
            onSubmit=${(value) => { api.modalResult(value); }}
            onCancel=${hideModal}
        />
        <${CompanySelectModal}
            show=${modalType === 9}
            title=${modalTitle}
            text=${modalText}
            defaultValue=${modalDefault}
            onSubmit=${(value) => { api.modalResult(value); }}
            onCancel=${hideModal}
        />
        <${TutorialModal} />
        <${PriceAlertModal} show=${modalType === 11} onClose=${hideModal} />
    `;
}

const App = () => {
    return html`<${ErrorBoundary}>
        <${api.WSRProvider}>
            <${AppInner} />
        <//>
    <//>`;
};

render(html`<${App} />`, document.getElementById('app'));
