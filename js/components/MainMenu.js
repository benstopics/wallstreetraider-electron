import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import QuoteOfTheDay from './QuoteOfTheDay.js';

const MainMenu = () => {

    return html`
    <div>
        <${QuoteOfTheDay} />
        <video autoplay muted loop class="video-bg">
            <source src="./assets/wall-street-bull.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div class="centered-overlay">
            <button class="btn green main-menu" onClick=${api.loadGame}>Load Game</button>
            <button class="btn green main-menu" onClick=${api.newGame}>New Game</button>
        </div>
    </div>`;
}

export default MainMenu;