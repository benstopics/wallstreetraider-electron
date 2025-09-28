import { html, render, useState, useEffect } from './lib/preact.standalone.module.js';
import './lib/tailwind.module.js';
import * as api from './api.js';
import GameUI from './components/GameUI.js';
import MainMenu from './components/MainMenu.js';


const App = () => {
    const [gameState, setGameState] = useState({ gameLoaded: false, isTickerRunning: false });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.getGameState().then(setGameState).catch(console.error);

        const connectWebSocket = (retryCount = 0) => {
            const ws = new WebSocket('ws://127.0.0.1:9632');

            ws.onopen = () => {
                console.log('WebSocket connection established');
                retryCount = 0; // Reset retry count on successful connection
            };

            ws.onmessage = (evt) => {
                setLoading(false);
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
        const handleKey = (e) => {
            if (e.key === '`') {
                api.toggleTicker()
            } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                setLoading(true);
                api.saveGame()
            }
        };

        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    return html`
        <div class="app-container">
            ${gameState.gameLoaded ? html`<${GameUI} gameState=${gameState} />`
            : html`<${MainMenu} />`}
            ${loading && html`
                <div className="loading-overlay">
                    <span>Loading...</span>
                </div>
            `}
        </div>
    `;
}

render(html`<${App} />`, document.getElementById('app'));
