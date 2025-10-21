import { html, render, useState, useEffect } from './lib/preact.standalone.module.js';
import './lib/tailwind.module.js';
import * as api from './api.js';
import GameUI from './components/GameUI.js';
import MainMenu from './components/MainMenu.js';
import Modal from './components/Modal.js';
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
    const [inputString, setInputString] = useState('');

    const { helpShown, hideHelp, loading, gameState, setGameState } = api.useWSRContext();

    useEffect(() => {
        const connectWebSocket = (retryCount = 0) => {
            const ws = new WebSocket('ws://127.0.0.1:9632');

            ws.onopen = () => {
                console.log('WebSocket connection established');
                retryCount = 0; // Reset retry count on successful connection
                        
                api.getGameState().then((newGameState) => {
                    setGameState(newGameState);
                }).catch(console.error);

            };

            ws.onmessage = (evt) => {
                // console.log('WebSocket message received:', evt.data);
                console.log(JSON.parse(evt.data))
                setGameState(JSON.parse(evt.data));
            };

            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
            };

            ws.onclose = () => {
                console.warn('WebSocket connection closed, retrying...');
                const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with max delay of 30 seconds
                setTimeout(() => connectWebSocket(retryCount + 1), delay);
            };
        };

        connectWebSocket();

        return () => ws.close();
    }, []);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === ' ') {
                if (gameState.isTickerRunning) {
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
    }, [gameState]);

    useEffect(() => {
        setInputString(gameState.modalDefault || '');
    }, [gameState.modalDefault]);

    const hideModal = () => {
        api.closeModal();
    }

    return html`
        <${SplashSequence}
            images=${logos}
            fadeMs=${900}
            holdMs=${1500}
            blackoutMs=${700}
            exitFadeMs=${700}
            show=${!gameState.splashScreenPlayed}
        />
        <div class="app-container">
            ${gameState.gameLoaded ? html`<${GameUI} gameState=${gameState} />`
            : html`<${MainMenu} />`}
            ${(gameState.isLoading || loading) && !gameState.modalType ? html`
                <div className="loading-overlay">
                    <img src="assets/loading.gif" alt="Loading..." />
                </div>
            ` : ''}
            <${ConfirmModal}
                show=${gameState.modalType === 1 || gameState.modalType === 2}
                title=${gameState.modalTitle}
                text=${gameState.modalText}
                onYes=${() => { setTimeout(() => api.modalResult(1), 500); }}
                onNo=${() => { setTimeout(() => api.modalResult(2), 500); }}
                onCancel=${gameState.modalType === 2 ? () => { setTimeout(() => api.modalResult(3), 500); } : undefined}
            />
            <${InputStringModal}
                show=${gameState.modalType === 3}
                title=${gameState.modalTitle}
                text=${gameState.modalText}
                defaultValue=${gameState.modalDefault}
                onSubmit=${(value) => { setTimeout(() => api.modalResult(value), 500); }}
                onCancel=${hideModal}
            />
            <${InfoModal}
                show=${gameState.modalType === 4}
                text=${gameState.modalText}
                onClose=${hideModal}
            />
            <${NewGameSetupModal}
                show=${gameState.modalType === 5}
                gameState=${gameState}
                onSubmit=${(newSettings) => {
                    const strInput = Object.entries(newSettings).map(([key, value]) => `${key}=${value}`).join('|');
                    setTimeout(() => api.modalResult(strInput), 500);
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
