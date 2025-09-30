import { html, render, useState, useEffect } from './lib/preact.standalone.module.js';
import './lib/tailwind.module.js';
import * as api from './api.js';
import GameUI from './components/GameUI.js';
import MainMenu from './components/MainMenu.js';
import Modal from './components/Modal.js';



const AppInner = () => {
    const [gameState, setGameState] = useState({ gameLoaded: false, isTickerRunning: false });
    const [inputString, setInputString] = useState('');

    const { loading, showLoading, hideLoading } = api.useLoading();

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
            if (e.key === '`') {
                api.toggleTicker()
            } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                showLoading();
                api.saveGame()
            }
        };

        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    useEffect(() => {
        setInputString(gameState.modalDefault || '');
    }, [gameState.modalDefault]);

    return html`
        <div class="app-container">
            ${gameState.gameLoaded ? html`<${GameUI} gameState=${gameState} />`
            : html`<${MainMenu} />`}
            ${loading && html`
                <div className="loading-overlay">
                    <span>Loading...</span>
                </div>
            `}
            <${Modal} show=${!loading && gameState.modalType > 0} onClose=${() => gameState.modalType === 4 && api.closeModal()}>
                ${gameState.modalType === 4 ? html`<div class="flex justify-between items-center mb-4">
                    <div class="text-lg font-bold h-full">${gameState.modalTitle}</div>
                    <button class="btn red" onClick=${() => api.closeModal()}>Close</button>
                </div>`
            : html`<div>
                    <div class="text-lg font-bold h-full">${gameState.modalTitle}</div>
                    <br/>
                    <div class="mb-4">${gameState.modalText}</div>
                    ${gameState.modalType === 3 ? html`<input type="text" class="modal-input" value=${inputString} onInput=${(e) => setInputString(e.target.value)} /><br/>` : ''}
                </div>`}
                ${gameState.modalType === 4 ? gameState.modalText.split(/\r\r|\r|\n/).map((line, index) => html`
                    <div key=${index}>
                        ${line}
                        <br/><br/>
                    </div>
                `) : ''}
                <br/>
                ${gameState.modalType === 1 ? html`<div class="flex justify-between items-center mb-4">
                    <button class="btn modal green" onClick=${() => { api.modalResult(1); showLoading(); }}>Yes</button>
                    <button class="btn modal red" onClick=${() => { api.modalResult(2); showLoading(); }}>No</button>
                    <button class="btn modal" onClick=${() => { api.modalResult(3); showLoading(); }}>Cancel</button>
                </div>`
            : gameState.modalType === 3 ? html`<div class="flex justify-between items-center mb-4">
                    <button class="btn modal green" onClick=${() => { api.modalResult(inputString); showLoading(); }}>Submit</button>
                    <button class="btn modal" onClick=${() => api.closeModal()}>Cancel</button>
                </div>` : ''}
            <//>
        </div>
    `;
}

const App = () => {
    const [loading, setLoading] = useState(false);
    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);

    return html`<${api.LoadingContext.Provider} value=${{ loading, showLoading, hideLoading }}>
        <${AppInner} />
    <//>`;
};

render(html`<${App} />`, document.getElementById('app'));
