import { html, render, useState, useEffect, useRef } from './lib/preact.standalone.module.js';
import './lib/tailwind.module.js';
import * as api from './api.js';

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
        let prevNavJson = '';           // last-seen navHistory JSON for change detection

        const NAV_STORAGE_KEY = 'wsr_navHistory';

        const fetchGameState = () => {
            pollSeq++;
            const seq = pollSeq;
            api.getGameState().then((newGameState) => {
                consecutiveErrors = 0;

                // Detect game-load transition (false → true)
                const justLoaded = !wasGameLoaded && newGameState.gameLoaded;

                // Log sparingly: first 3 polls, every 100th, or game state transitions
                if (seq <= 3 || seq % 100 === 0 || newGameState.gameLoaded !== wasGameLoaded) {
                    console.log(`[POLL #${seq}] gameLoaded=${newGameState.gameLoaded} modalType=${newGameState.modalType} companies=${newGameState.allCompanies?.length}`);
                }
                wasGameLoaded = newGameState.gameLoaded;

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
                    if (navJson !== prevNavJson) {
                        prevNavJson = navJson;
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
