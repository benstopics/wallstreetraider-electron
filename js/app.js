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

const logos = [
    { src: "assets/roninsoft_logo.png", backgroundColor: "#ffffff" },
    { src: "assets/hackjackgames_logo.png", backgroundColor: "#000000" }
];

const AppInner = () => {
    const [gameState, setGameState] = useState({ gameLoaded: false, isTickerRunning: false });
    const [inputString, setInputString] = useState('');

    const { loading, showLoading, hideLoading, helpShown, showHelp, hideHelp, toggleTicker } = api.useWSRContext();

    useEffect(() => {
        api.getGameState().then(setGameState).catch(console.error);

        const connectWebSocket = (retryCount = 0) => {
            const ws = new WebSocket('ws://127.0.0.1:9632');

            ws.onopen = () => {
                console.log('WebSocket connection established');
                retryCount = 0; // Reset retry count on successful connection
            };

            ws.onmessage = (evt) => {
                hideLoading();
                // console.log('WebSocket message received:', evt.data);
                // console.log(JSON.parse(evt.data))
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
        hideLoading();
    }, [gameState]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === ' ') {
                toggleTicker();
            } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                showLoading();
                api.saveGame()
                e.stopPropagation();
            }
        };

        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    useEffect(() => {
        setInputString(gameState.modalDefault || '');
    }, [gameState.modalDefault]);

    const hideModal = () => {
        api.closeModal();
        showLoading();
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
            ${loading && html`
                <div className="loading-overlay">
                    <img src="assets/loading.gif" alt="Loading..." />
                </div>
            `}
            <${ConfirmModal}
                show=${!loading && gameState.modalType === 1}
                title=${gameState.modalTitle}
                text=${gameState.modalText}
                onYes=${() => { api.modalResult(1); showLoading(); }}
                onNo=${() => { api.modalResult(2); showLoading(); }}
                onCancel=${() => { api.modalResult(3); showLoading(); }}
            />
            <${InputStringModal}
                show=${!loading && gameState.modalType === 3}
                title=${gameState.modalTitle}
                text=${gameState.modalText}
                defaultValue=${inputString}
                onSubmit=${(value) => { api.modalResult(value); showLoading(); }}
                onCancel=${hideModal}
            />
            <${InfoModal}
                show=${!loading && gameState.modalType === 4}
                text=${gameState.modalText}
                onClose=${hideModal}
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
