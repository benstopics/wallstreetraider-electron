import { html, render, useState, useEffect, useRef } from './lib/preact.standalone.module.js';
import './lib/tailwind.module.js';
import * as api from './api.js';
import GameUI from './components/GameUI.js';
import MainMenu from './components/MainMenu.js';
import SplashSequence from './components/SplashSequence.js';
import HelpModal from './components/HelpModal.js';
import InputStringModal from './components/InputStringModal.js';
import ConfirmModal from './components/ConfirmModal.js';
import InfoModal from './components/InfoModal.js';
import NewGameSetupModal from './components/NewGameSetupModal.js';

const logos = [
    { src: "assets/roninsoft_logo.png", backgroundColor: "#ffffff" },
    { src: "assets/hackjackgames_logo.png", backgroundColor: "#000000" }
];

const AppInner = () => {
    const { helpShown, hideHelp, patchGameState } = api.useWSRContext();

    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);
    const splashScreenPlayed = api.useGameStore(s => s.gameState.splashScreenPlayed);
    const gameLoaded = api.useGameStore(s => s.gameState.gameLoaded);
    const isLoading = api.useGameStore(s => s.gameState.isLoading);
    const modalType = api.useGameStore(s => s.gameState.modalType);
    const modalTitle = api.useGameStore(s => s.gameState.modalTitle);
    const modalText = api.useGameStore(s => s.gameState.modalText);
    const modalDefault = api.useGameStore(s => s.gameState.modalDefault);

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

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === ' ') {
                if (isTickerRunning) {
                    api.stopTicker();
                } else {
                    api.startTicker();
                }
            } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                api.saveGame()
                e.stopPropagation();
            }
        };

        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isTickerRunning]);

    const hideModal = () => {
        api.closeModal();
    }

    const lastUpdateRef = useRef(Date.now());
    let lastUpdate = lastUpdateRef.current;

    useEffect(() => {
        let timeoutId;

        const fetchGameState = () => {
            api.getGameState().then((newGameState) => {
                requestAnimationFrame(() => {
                    patchGameState({...newGameState, allCompanies: []});
                });

                timeoutId = setTimeout(fetchGameState, 50);
            }).catch(console.error);
        };

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
            <${ConfirmModal}
                show=${modalType === 1 || modalType === 2}
                title=${modalTitle}
                text=${modalText}
                onYes=${() => { patchGameState({ isLoading: true }); api.modalResult(1); }}
                onNo=${() => { patchGameState({ isLoading: true }); api.modalResult(2); }}
                onCancel=${modalType === 2 ? () => { patchGameState({ isLoading: true }); api.modalResult(3); } : undefined}
            />
            <${InputStringModal}
                show=${modalType === 3}
                title=${modalTitle}
                text=${modalText}
                defaultValue=${modalDefault}
                onSubmit=${(value) => { patchGameState({ isLoading: true }); api.modalResult(value); }}
                onCancel=${hideModal}
            />
            <${InfoModal}
                show=${modalType === 4}
                text=${modalText}
                onClose=${hideModal}
            />
            <${NewGameSetupModal}
                show=${modalType === 5}
                onSubmit=${(newSettings) => {
            const strInput = Object.entries(newSettings).map(([key, value]) => `${key}=${value}`).join('|');
            patchGameState({ isLoading: true });
            api.modalResult(strInput);
        }}
                onCancel=${hideModal}
            />
            <${HelpModal} show=${helpShown} onClose=${hideHelp} />
        </div>
    `;
}

const App = () => {
    return html`<${api.WSRProvider}>
        <${AppInner} />
    <//>`;
};

render(html`<${App} />`, document.getElementById('app'));
