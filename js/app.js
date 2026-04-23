import { html, render, useState, useEffect, useRef } from './lib/preact.standalone.module.js';
import './lib/tailwind.module.js';
import * as api from './api.js';
import { applyPatch } from './lib/fast-json-patch.module.js';

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
import CommoditySelectModal from './components/CommoditySelectModal.js';
import TutorialModal from './components/TutorialModal.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import PriceAlertModal from './components/PriceAlertModal.js';


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

    // Detect ready to restart signal and restart WSR to return to main menu
    // This flag is set AFTER all end-game dialogs are closed
    useEffect(() => {
        if (readyToRestart === 'Y' && modalType === 0) {
            console.log('Ready to restart detected, restarting WSR...');
            ipcRenderer.send('restart-wsr');
        }
    }, [readyToRestart, modalType]);

    useEffect(() => {
        let wsRef = null;
        let cancelled = false;

        const connectWebSocket = async (retryCount = 0) => {
            // Wait for electron/main.js to deliver the OS-assigned WS port via
            // IPC (bridge-ports). Until then getWsUrl() returns null.
            await api.bridgeReady;
            if (cancelled) return;
            const url = api.getWsUrl();
            if (!url) {
                console.warn('[WS] bridgeReady resolved but wsUrl missing; aborting');
                return;
            }
            const ws = new WebSocket(url);
            wsRef = ws;

            ws.onopen = () => {
                console.log('[WS] Connected:', url);
                wsConnectedRef.current = true;
                retryCount = 0;
                api.getGameState().then(newGameState => {
                    if (newGameState.allCompanies?.length > 0) {
                        newGameState.hyperlinkRegex = api.buildDictRegex(
                            newGameState.allCompanies, newGameState.allIndustries);
                    }
                    setGameState(api.mergeGameState(newGameState));
                }).catch(console.error);
            };

            ws.onmessage = (evt) => {
                const msg = JSON.parse(evt.data);
                if (msg.path === '/game_state_patch') {
                    const prev = api.gameStore.getState().gameState;
                    const ops = Array.isArray(msg.payload)
                        ? msg.payload
                        : JSON.parse(msg.payload);
                    const patched = applyPatch(prev, ops, false, false).newDocument;
                    if (patched.gameLoaded && patched.navHistory?.length > 0) {
                        const navJson = JSON.stringify(patched.navHistory);
                        if (navJson !== prevNavJsonRef.current) {
                            prevNavJsonRef.current = navJson;
                            try { localStorage.setItem(NAV_STORAGE_KEY, navJson); } catch (e) {}
                        }
                    }
                    if (patched.allCompanies?.length > 0) {
                        patched.hyperlinkRegex = api.buildDictRegex(
                            patched.allCompanies, patched.allIndustries);
                    }
                    setGameState(api.mergeGameState(patched));
                    if (!wasGameLoadedRef.current && patched.gameLoaded) {
                        wasGameLoadedRef.current = true;
                        try {
                            const saved = localStorage.getItem(NAV_STORAGE_KEY);
                            const history = saved ? JSON.parse(saved) : [];
                            if (history.length > 0) {
                                api.navSetHistory(history).catch(() => {});
                            } else {
                                const aeid = patched.activeEntityNum;
                                if (aeid > 0) api.navSetHistory([{ id: aeid, type: 'asset' }]).catch(() => {});
                            }
                        } catch (e) {
                            const aeid = patched.activeEntityNum;
                            if (aeid > 0) api.navSetHistory([{ id: aeid, type: 'asset' }]).catch(() => {});
                        }
                    }
                } else if (msg.path === '/game_state') {
                    const newState = msg.payload;
                    const justLoaded = !wasGameLoadedRef.current && newState.gameLoaded;
                    wasGameLoadedRef.current = !!newState.gameLoaded;
                    if (justLoaded) {
                        try {
                            const saved = localStorage.getItem(NAV_STORAGE_KEY);
                            const history = saved ? JSON.parse(saved) : [];
                            if (history.length > 0) {
                                api.navSetHistory(history).catch(() => {});
                            } else {
                                const aeid = newState.activeEntityNum;
                                if (aeid > 0) api.navSetHistory([{ id: aeid, type: 'asset' }]).catch(() => {});
                            }
                        } catch (e) {
                            const aeid = newState.activeEntityNum;
                            if (aeid > 0) api.navSetHistory([{ id: aeid, type: 'asset' }]).catch(() => {});
                        }
                    }
                    if (newState.gameLoaded && newState.navHistory?.length > 0) {
                        const navJson = JSON.stringify(newState.navHistory);
                        if (navJson !== prevNavJsonRef.current) {
                            prevNavJsonRef.current = navJson;
                            try { localStorage.setItem(NAV_STORAGE_KEY, navJson); } catch (e) {}
                        }
                    }
                    if (newState.allCompanies?.length > 0) {
                        newState.hyperlinkRegex = api.buildDictRegex(
                            newState.allCompanies, newState.allIndustries);
                    }
                    setGameState(api.mergeGameState(newState));
                }
            };

            ws.onerror = (err) => {
                console.error('[WS] Error:', err);
            };

            ws.onclose = () => {
                wsConnectedRef.current = false;
                console.warn('[WS] Closed, retrying with backoff...');
                const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
                setTimeout(() => connectWebSocket(retryCount + 1), delay);
            };
        };

        connectWebSocket();

        return () => {
            cancelled = true;
            if (wsRef) wsRef.close();
        };
    }, []);

    const hideModal = () => {
        api.closeModal();
    }

    // Stop ticker when help modal is shown
    useEffect(() => {
        if (helpShown && isTickerRunning) {
            api.stopTicker();
        }
    }, [helpShown]);

    // Global hotkeys — keep refs so the listener always sees current values
    const isTickerRunningRef = useRef(isTickerRunning);
    const modalTypeRef = useRef(modalType);
    const gameLoadedRef = useRef(gameLoaded);
    const wsConnectedRef = useRef(false);
    const wasGameLoadedRef = useRef(false);
    const prevNavJsonRef = useRef('');
    const NAV_STORAGE_KEY = 'wsr_navHistory';
    useEffect(() => { isTickerRunningRef.current = isTickerRunning; }, [isTickerRunning]);
    useEffect(() => { modalTypeRef.current = modalType; }, [modalType]);
    useEffect(() => { gameLoadedRef.current = gameLoaded; }, [gameLoaded]);

    useEffect(() => {
        const isEditable = (el) => {
            if (!el) return false;
            const tag = el.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
            if (el.isContentEditable) return true;
            return false;
        };

        const onKeyDown = (e) => {
            if (!gameLoadedRef.current) return;

            // CTRL+S → save game (works even in editable elements)
            if (e.ctrlKey && !e.altKey && !e.shiftKey && e.key === 's') {
                e.preventDefault();
                api.saveGame();
                return;
            }

            if (isEditable(e.target)) return;

            const modal = modalTypeRef.current;

            // Space → toggle ticker (not when modal is open)
            if (e.key === ' ' && modal === 0) {
                e.preventDefault();
                if (isTickerRunningRef.current) api.stopTicker();
                else api.startTicker();
                return;
            }

            // / → focus command prompt
            if (e.key === '/' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                e.preventDefault();
                const input = document.querySelector('input.command-line');
                if (input) input.focus();
                return;
            }

            // Arrow left/right → nav back/forward (not when modal is open)
            if (modal === 0 && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                if (e.key === 'ArrowLeft') { e.preventDefault(); api.goBack(); return; }
                if (e.key === 'ArrowRight') { e.preventDefault(); api.goForward(); return; }
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    useEffect(() => {
        let timeoutId;
        let pollSeq = 0;
        let consecutiveErrors = 0;

        const fetchGameState = () => {
            if (wsConnectedRef.current) {
                // WS is active — suspend polling, resume check in 500ms
                timeoutId = setTimeout(fetchGameState, 500);
                return;
            }
            pollSeq++;
            const seq = pollSeq;
            api.getGameState().then((newGameState) => {
                consecutiveErrors = 0;

                // Detect game-load transition (false → true)
                const justLoaded = !wasGameLoadedRef.current && newGameState.gameLoaded;

                // Log sparingly: first 3 polls, every 100th, or game state transitions
                if (seq <= 3 || seq % 100 === 0 || newGameState.gameLoaded !== wasGameLoadedRef.current) {
                    console.log(`[POLL #${seq}] gameLoaded=${newGameState.gameLoaded} modalType=${newGameState.modalType} companies=${newGameState.allCompanies?.length}`);
                }
                wasGameLoadedRef.current = !!newGameState.gameLoaded;

                // On game load: restore persisted nav history, or seed with current entity
                if (justLoaded) {
                    try {
                        const saved = localStorage.getItem(NAV_STORAGE_KEY);
                        const history = saved ? JSON.parse(saved) : [];
                        if (history.length > 0) {
                            api.navSetHistory(history).catch(() => {});
                        } else {
                            const aeid = newGameState.activeEntityNum;
                            if (aeid > 0) api.navSetHistory([{ id: aeid, type: 'asset' }]).catch(() => {});
                        }
                    } catch (e) {
                        const aeid = newGameState.activeEntityNum;
                        if (aeid > 0) api.navSetHistory([{ id: aeid, type: 'asset' }]).catch(() => {});
                    }
                }

                // Persist nav history whenever it changes (only during gameplay)
                if (newGameState.gameLoaded && newGameState.navHistory?.length > 0) {
                    const navJson = JSON.stringify(newGameState.navHistory);
                    if (navJson !== prevNavJsonRef.current) {
                        prevNavJsonRef.current = navJson;
                        try { localStorage.setItem(NAV_STORAGE_KEY, navJson); } catch (e) {}
                    }
                }

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

        console.log('[POLL] Starting gamestate polling loop (fallback mode)');
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
        <${CommoditySelectModal}
            show=${modalType === 12}
            title=${modalTitle}
            text=${modalText}
            defaultValue=${modalDefault}
            onSubmit=${(value) => { api.modalResult(value); }}
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
