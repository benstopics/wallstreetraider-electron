import { html, useState } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { PauseIcon, StopIcon, SaveIcon, GaugeIcon, ForwardIcon, PlayIcon } from '../icons.js';
import NavigationControl from './NavigationControl.js';
import ActingAsDropdown from './ActingAsDropdown.js';
import InputStringModal from './InputStringModal.js';
import NotesModal from './NotesModal.js';
import CalculatorModal from './CalculatorModal.js';
import KeybindsModal from './KeybindsModal.js';
import SettingsModal from './SettingsModal.js';
import { insertCurrencySymbols } from './helpers.js';

function Toolbar() {
    const { showTutorial, showHelp } = api.useWSRContext();

    const [showNotepad, setShowNotepad] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showKeybinds, setShowKeybinds] = useState(false);

    const [showTickerSpeedModal, setShowTickerSpeedModal] = useState(false);

    const tickSpeed = api.useGameStore(s => s.gameState.tickSpeed);
    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);

    const toggleTicker = () => {
        if (isTickerRunning) {
            api.stopTicker();
        } else {
            api.startTicker();
        }
    }

    return html`
        <div class="top-bar items-center justify-between" style="height: 60px; flex-shrink: 0;">
            <${NotesModal} show=${showNotepad} onClose=${() => setShowNotepad(false)} />
            <${CalculatorModal} show=${showCalculator} onClose=${() => setShowCalculator(false)} />
            <${KeybindsModal} show=${showKeybinds} onClose=${() => setShowKeybinds(false)} />
            <${InputStringModal}
                show=${showTickerSpeedModal}
                title="Set Ticker Speed"
                text="Enter the desired ticker speed (1-100):"
                defaultValue=${tickSpeed.toString()}
                onSubmit=${(value) => {
                api.setTickSpeed(Math.min(100, Math.max(1, parseInt(value))))
                    setShowTickerSpeedModal(false);
                }}
                onCancel=${() => setShowTickerSpeedModal(false)}
            />
            <div class="flex items-center gap-2">
                <div style="width: 25px; height: 20px"
                data-tutorial="pause-button"
                class="btn ${isTickerRunning ? 'stop' : 'play'}"
                onClick=${toggleTicker}>
                    <div class="" style="width: 20px">
                        <${isTickerRunning ? StopIcon : PlayIcon} />
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <div style="height: 20px" class="btn blue" onClick=${() => {
                        setShowTickerSpeedModal(true)
                    }}>
                        <div class="flex w-full items-center justify-center gap-1" style="">
                            <div class="" style="width: 20px">
                                <${GaugeIcon} />
                            </div>
                            <div>
                                ${tickSpeed}
                            </div>
                        </div>
                    </div>
                    <div style="height: 20px" class="btn" onClick=${() => {
                        api.runTicker()
                    }}>
                        <div class="flex w-full items-center justify-center gap-1" style="">
                            <div class="" style="width: 20px">
                                <${ForwardIcon} />
                            </div>
                        </div>
                    </div>
                    <div class="btn green" onClick=${() => {
                        api.saveGame()
                    }}>
                        <!--<div class="mr-1" style="width: 7px">
                            <${SaveIcon} />
                        </div>-->
                        <span style="white-space: nowrap;">
                            ${insertCurrencySymbols("Save Game")}
                        </span>
                    </div>
                    <div class="btn green" onClick=${() => {
                        api.saveGameAs()
                    }}>
                        <!--<div class="mr-1" style="width: 7px">
                            <${SaveIcon} />
                        </div>-->
                        <span style="white-space: nowrap;">
                            ${insertCurrencySymbols("Save As")}
                        </span>
                    </div>
                    <div class="btn" onClick=${() => {
                        api.exitGame()
                    }}>
                        <span style="white-space: nowrap;">
                            ${insertCurrencySymbols("Exit Game")}
                        </span>
                    </div>
                    <${SettingsModal}>
                        <div class="btn" data-tutorial="settings-dropdown">
                            <span style="white-space: nowrap;">${insertCurrencySymbols("Settings")}</span>
                        </div>
                    <//>
                    <div class="btn" data-tutorial="fullscreen-button" onClick=${() => api.toggleFullscreen()}>
                        <span style="white-space: nowrap;">${insertCurrencySymbols("Fullscreen")}</span>
                    </div>
                    <div class="btn" onClick=${() => showTutorial()}>
                        <span style="white-space: nowrap;">${insertCurrencySymbols("Tutorial")}</span>
                    </div>
                    <div class="btn" onClick=${() => showHelp()}>
                        <span style="white-space: nowrap;">${insertCurrencySymbols("Help")}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center">
                <div class="w-60">
                    <${NavigationControl} />
                </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <div class="btn" onClick=${() => api.changeLawFirm()}>
                    <span style="white-space: nowrap;">${insertCurrencySymbols("Change Law Firm")}</span>
                </div>
                <div class="btn" onClick=${() => api.toggleGlobalAutopilot()}>
                    <span style="white-space: nowrap;">${insertCurrencySymbols("Toggle Global Autopilot")}</span>
                </div>
                <div class="btn" data-tutorial="market-reports" onClick=${() => api.viewIndustry(0)}>
                    <span style="white-space: nowrap;">${insertCurrencySymbols("Market Reports")}</span>
                </div>
                <div class="btn" data-tutorial="database-search" onClick=${() => api.viewDbSearch()}>
                    <span style="white-space: nowrap;">${insertCurrencySymbols("Database Search")}</span>
                </div>
            </div>
            <${ActingAsDropdown} />
        </div>
    `;
}

export default Toolbar;