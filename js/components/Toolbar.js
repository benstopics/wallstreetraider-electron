import { html, useState, useEffect, useRef, useCallback } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { PauseIcon, StopIcon, SaveIcon, QuestionMarkIcon, } from '../icons.js';
import NavigationControl from './NavigationControl.js';
import ActingAsDropdown from './ActingAsDropdown.js';

function Toolbar() {
    const { showHelp, patchGameState } = api.useWSRContext();

    const tickSpeed = api.useGameStore(s => s.gameState.tickSpeed);
    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);

    const toggleSpeed = () => {
        const speed = tickSpeed;
        const newSpeed = speed >= 90 ? 30 : speed >= 75 ? 100 : 75;
        api.setTickSpeed(newSpeed);
    }

    const toggleTicker = () => {
        if (isTickerRunning) {
            api.stopTicker();
        } else {
            api.startTicker();
        }
    }


    return html`
        <div class="top-bar items-center justify-between" style="height: 40px; flex-shrink: 0;">
            <div class="flex items-center gap-2">
                <div style="width: 20px; height: 20px"
                class="btn ${isTickerRunning ? 'stop' : 'play'}"
                onClick=${toggleTicker}>
                    <div class="" style="width: 7px">
                        <${isTickerRunning ? StopIcon : PauseIcon} />
                    </div>
                </div>
                <div style="width: 60px; height: 20px" class="btn blue" onClick=${toggleSpeed}>
                    <div class="" style="">
                        ${tickSpeed > 75 ? '▶▶▶'
            : tickSpeed > 50 ? '▶▶'
                : '▶'
        }
                    </div>
                </div>
                <div class="btn green" onClick=${() => {
                    patchGameState({ isLoading: true });
                    api.saveGame()
                }}>
                    <!--<div class="mr-1" style="width: 7px">
                        <${SaveIcon} />
                    </div>-->
                    <span style="white-space: nowrap;">
                        Save Game
                    </span>
                </div>
                <div class="btn" onClick=${() => {
                    patchGameState({ isLoading: true });
                    setTimeout(() => api.exitGame(), 1000)
                }}>
                    <span style="white-space: nowrap;">
                        Exit Game
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
                <div class="btn blue" onClick=${() => {
                    patchGameState({ isLoading: true });
                    api.viewIndustry(0)
                }}>
                    <span style="white-space: nowrap;">
                        View Market Reports
                    </span>
                </div>
                <div class="btn blue" onClick=${showHelp}>
                    <div class="" style="width: 12px">
                        <${QuestionMarkIcon} />
                    </div>
                    <span style="white-space: nowrap;">
                        ${' '}Help
                    </span>
                </div>
                <div class="w-60">
                    <${NavigationControl} />
                </div>
            </div>
            <${ActingAsDropdown} />
        </div>
    `;
}

export default Toolbar;