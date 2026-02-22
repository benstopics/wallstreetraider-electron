import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import * as api from '../api.js';
import DifficultyLevelInput from './DifficultyLevelInput.js';
import Button from './Button.js';
import { insertCurrencySymbols } from './helpers.js';


export default function NewGameSetupModal({ show, onSubmit, onCancel }) {

    const allPlayers = api.useGameStore(s => s.gameState.allPlayers);
    const defaultStartingMoney = api.useGameStore(s => s.gameState.startingMoney);
    const defaultGameLength = api.useGameStore(s => s.gameState.gameLength);
    const defaultDifficultyLevel = api.useGameStore(s => s.gameState.difficultyLevel);
    const defaultTutorialEnabled = api.useGameStore(s => s.gameState.tutorialEnabled);
    const defaultStartPaused = api.useGameStore(s => s.gameState.startPaused);
    const numPlayers = api.useGameStore(s => s.gameState.numPlayers) || 2;

    const playerIdsOrdered = [api.HUMAN1_ID, api.COMPUTER1_ID, api.COMPUTER2_ID, api.COMPUTER3_ID, api.COMPUTER4_ID];
    const defaultPlayerNames = playerIdsOrdered.map(id => allPlayers?.find(p => p.id === id)?.name || "");

    const [playerNames, setPlayerNames] = useState(["", "", "", "", ""]);
    const [money, setMoney] = useState("1000");
    const [gameLength, setGameLength] = useState("35");
    const [difficultyLevel, setDifficultyLevel] = useState("2");
    const [tutorialEnabled, setTutorialEnabled] = useState(true);
    const [startPaused, setStartPaused] = useState(false);
    const hasInitialized = useRef(false);
    const hasNamesInitialized = useRef(false);
    const firstInputRef = useRef(null);

    // Reset form state only when modal opens (show transitions to true)
    useEffect(() => {
        if (show) {
            if (!hasInitialized.current) {
                hasInitialized.current = true;
                hasNamesInitialized.current = false;
                // Initialize with current values from game state
                setPlayerNames(defaultPlayerNames || ["", "", "", "", ""]);
                setMoney(defaultStartingMoney?.toString() || "1000");
                setGameLength(defaultGameLength?.toString() || "35");
                setDifficultyLevel(defaultDifficultyLevel?.toString() || "2");
                setTutorialEnabled(defaultTutorialEnabled === 1 || defaultTutorialEnabled === undefined);
                setStartPaused(defaultStartPaused === 1);
                // Check if we got real names (not empty defaults)
                if (defaultPlayerNames?.some(n => n && n.length > 0)) {
                    hasNamesInitialized.current = true;
                }
            }
        } else {
            hasInitialized.current = false; // Reset flag when modal closes
            hasNamesInitialized.current = false;
        }
    }, [show]);

    // BUG-075 fix: If the modal opened before allPlayers was populated (names were empty),
    // re-initialize names once they become available from game state polling.
    useEffect(() => {
        if (show && hasInitialized.current && !hasNamesInitialized.current) {
            if (defaultPlayerNames?.some(n => n && n.length > 0)) {
                setPlayerNames(defaultPlayerNames);
                hasNamesInitialized.current = true;
            }
        }
    }, [show, allPlayers]);

    // Auto-focus first input when modal shows
    useEffect(() => {
        if (!show) return;
        const t = setTimeout(() => {
            firstInputRef.current?.focus();
            firstInputRef.current?.select();
        }, 0);
        return () => clearTimeout(t);
    }, [show]);

    const submit = () => {

        const sanitizeNames = playerNames.map((name) => name?.replaceAll(/[|"]/g, " ") || "");

        const body = {
            startingMoney: money,
            gameLength,
            difficultyLevel: difficultyLevel,
            tutorialEnabled: tutorialEnabled ? 1 : 0,
            startPaused: startPaused ? 1 : 0
        };
        sanitizeNames.forEach((name, index) => {
            const playerNum = playerIdsOrdered[index];
            body[`player${playerNum}Name`] = name;
        });

        onSubmit(body);
    }

    return html`<${Modal} show=${show} style="display: flex; flex-direction: column;">
        <div class="flex-1 min-h-0 p-3 overflow-y-auto">
            <div class="text-lg font-bold text-center">${insertCurrencySymbols("Startup Choices")}</div>
            <br/>
            <div class="mb-4">
                <div class="flex flex-col">
                    <div class="flex">
                        <div class="flex-1 p-2"></div>
                        <div class="flex-1 p-2">${insertCurrencySymbols("Enter Player Names:")}</div>
                        <div class="flex-1 p-2">${insertCurrencySymbols("(20 characters max)")}</div>
                    </div>
                    ${playerIdsOrdered.slice(0, numPlayers).map((playerId, index) => html`<div class="flex">
                        <div class="flex-1 p-2 text-right">${playerId === api.HUMAN1_ID ? insertCurrencySymbols("You:") : insertCurrencySymbols("Computer:")}</div>
                        <div class="flex-1 p-2">
                            <input type="text" maxlength="20" class="modal-input" data-testid=${`input-player-name-${index}`} ref=${index === 0 ? firstInputRef : undefined} value=${playerNames[index] || ""} onInput=${(e) => {
                                const val = e.target.value;
                                setPlayerNames(prev => {
                                    const newNames = [...prev];
                                    newNames[index] = val;
                                    return newNames;
                                });
                            }} /><br/>
                        </div>
                        <div class="flex-1 p-2"></div>
                    </div>`)}
                    <div class="flex mt-4">
                        <div class="flex-2 p-2 w-36 text-right">${insertCurrencySymbols("Difficulty Level:")}</div>
                        <div class="flex-1 p-2 w-full">
                            <${DifficultyLevelInput}
                                value=${difficultyLevel}
                                onChange=${(val) => setDifficultyLevel(val)}
                                disabled=${false}
                                label=${insertCurrencySymbols("Difficulty")}
                            />
                        </div>
                        <div class="flex-2 p-2">${insertCurrencySymbols("(Levels 1, 2, 3, or 4)")}</div>
                    </div>
                    <div class="flex">
                        <div class="flex-2 p-2 text-right w-36">${insertCurrencySymbols("Starting Money")}<br/>${insertCurrencySymbols("per Player:")}</div>
                        <div class="flex-1 p-2">
                            <input type="number" min="100" max="1000" class="modal-input w-full" data-testid="input-starting-money" value=${money} onInput=${(e) => {
                                setMoney(String(e.target.value));
                            }} onBlur=${(e) => {
                                let val = parseInt(e.target.value);
                                if (isNaN(val)) val = 100;
                                if (val < 100) val = 100;
                                if (val > 1000) val = 1000;
                                setMoney(String(val));
                            }} />
                            <br/>
                        </div>
                        <div class="flex-2 p-2">${insertCurrencySymbols("(@DLRSIGN100 to @DLRSIGN1000 @MIL@EURO)")}</div>
                    </div>
                    <div class="flex">
                        <div class="flex-2 p-2 text-right w-36">${insertCurrencySymbols("Game Length:")}</div>
                        <div class="flex-1 p-2 w-40">
                            <input
                                type="number"
                                min="1"
                                max="35"
                                class="modal-input w-full"
                                value=${gameLength}
                                onInput=${(e) => {
                                    setGameLength(e.target.value);
                                }}
                                onBlur=${(e) => {
                                    let val = parseInt(e.target.value);
                                    if (isNaN(val)) val = 1;
                                    if (val < 1) val = 1;
                                    if (val > 35) val = 35;
                                    setGameLength(val);
                                }}
                            />
                            <br/>
                        </div>
                        <div class="flex-2 p-2 text-right">${insertCurrencySymbols("(1 to 35 years)")}</div>
                    </div>
                    <div class="flex">
                        <div class="flex-2 p-2 text-right w-36">${insertCurrencySymbols("Tutorial:")}</div>
                        <div class="flex-1 p-2">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked=${tutorialEnabled}
                                    onChange=${(e) => setTutorialEnabled(e.target.checked)}
                                    class="w-4 h-4"
                                />
                                <span>${insertCurrencySymbols("Enable interactive tutorial")}</span>
                            </label>
                        </div>
                        <div class="flex-2 p-2"></div>
                    </div>
                    <div class="flex">
                        <div class="flex-2 p-2 text-right w-36">${insertCurrencySymbols("Ticker:")}</div>
                        <div class="flex-1 p-2">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked=${startPaused}
                                    onChange=${(e) => setStartPaused(e.target.checked)}
                                    class="w-4 h-4"
                                />
                                <span>${insertCurrencySymbols("Start game paused")}</span>
                            </label>
                        </div>
                        <div class="flex-2 p-2"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-between items-center p-3 flex-shrink-0">
            <${Button} class="btn modal green" data-testid="btn-submit" onClick=${submit}>${insertCurrencySymbols("Submit")}</button>
            <${Button} class="btn modal" data-testid="btn-cancel" onClick=${onCancel}>${insertCurrencySymbols("Cancel")}</button>
        </div>
    <//>`;
}