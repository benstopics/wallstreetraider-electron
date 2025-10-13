import { html, useState, useEffect, useRef, useCallback } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { PauseIcon, StopIcon, SaveIcon, QuestionMarkIcon, } from '../icons.js';
import NavigationControl from './NavigationControl.js';
import ActingAsDropdown from './ActingAsDropdown.js';

function Toolbar({ gameState }) {
    const { showHelp } = api.useWSRContext();

    const toggleSpeed = () => {
        const speed = gameState.tickSpeed;
        const newSpeed = speed >= 90 ? 30 : speed >= 75 ? 100 : 75;
        api.setTickSpeed(newSpeed);
    }

    const toggleTicker = () => {
        api.toggleTicker();
    }


    return html`
        <div class="top-bar items-center justify-between" style="height: 40px; flex-shrink: 0;">
            <div class="flex items-center gap-2">
                <div style="width: 20px; height: 20px"
                class="btn ${gameState.isTickerRunning ? 'stop' : 'play'}"
                onClick=${toggleTicker}>
                    <div class="" style="width: 7px">
                        <${gameState.isTickerRunning ? StopIcon : PauseIcon} />
                    </div>
                </div>
                <div style="width: 60px; height: 20px" class="btn blue" onClick=${toggleSpeed}>
                    <div class="" style="">
                        ${gameState.tickSpeed > 75 ? '▶▶▶'
            : gameState.tickSpeed > 50 ? '▶▶'
                : '▶'
        }
                    </div>
                </div>
                <div class="btn green" onClick=${() => {
                    setTimeout(() => api.saveGame(), 500);
                }}>
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
                <div class="btn blue" onClick=${() => api.viewIndustry(0)}>
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
                    <${NavigationControl} gameState=${gameState} />
                </div>
            </div>
            <${ActingAsDropdown} gameState=${gameState} />
        </div>
    `;
}

export default Toolbar;