import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { PauseIcon, StopIcon, SaveIcon,  } from '../icons.js';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Toolbar({ gameState }) {
    const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const id = setInterval(() => {
            setLocalTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const gameDate = `${months[gameState.currentMonth - 1]} ${gameState.currentDay}, ${gameState.currentYear} (Q${gameState.currentQuarter})`;

    return html`
        <div class="top-bar items-center justify-between" style="height: 40px; flex-shrink: 0;">
            <div class="flex items-center gap-2">
                <div style="width: 20px; height: 20px" class="btn ${gameState.isTickerRunning ? 'stop' : 'play'}" onClick=${api.toggleTicker}>
                    <div class="" style="width: 7px">
                        <${gameState.isTickerRunning ? StopIcon : PauseIcon} />
                    </div>
                </div>
                <div style="width: 30px; height: 20px" class="btn blue" onClick=${() => {
                    const speed = gameState.tickSpeed;
                    api.setTickSpeed(speed >= 100 ? 30 : speed >= 75 ? 100 : 75);
                }}>
                    <div class="" style="">
                        ${gameState.tickSpeed > 75 ? '▶▶▶'
                            : gameState.tickSpeed > 50 ? '▶▶'
                            : '▶'
                        }
                    </div>
                </div>
                <div class="btn green" onClick=${api.saveGame}>
                    <!--<div class="mr-1" style="width: 7px">
                        <${SaveIcon} />
                    </div>-->
                    <span style="white-space: nowrap;">
                        Save Game
                    </span>
                </div>
                <div class="btn" onClick=${api.databaseSearch}>
                    <span style="white-space: nowrap;">
                        Database Search
                    </span>
                </div>
                <div class="btn brown" onClick=${api.changeLawFirm}>
                    <span style="white-space: nowrap;">
                        Change Law Firm
                    </span>
                </div>
                <div class="btn red" onClick=${api.harrassingLawsuit}>
                    <span style="white-space: nowrap;">
                        Harrassing Lawsuit
                    </span>
                </div>
                <div class="btn red" onClick=${api.spreadRumors}>
                    <span style="white-space: nowrap;">
                        Spread Rumors
                    </span>
                </div>
                <div class="btn red" onClick=${api.toggleGlobalAutopilot}>
                    <span style="white-space: nowrap;">
                        Toggle Global Autopilot
                    </span>
                </div>
            </div>
            <div class="date-display ml10 fixed-width">
                ${gameDate} - ${localTime}
            </div>
        </div>
    `;
}

export default Toolbar;