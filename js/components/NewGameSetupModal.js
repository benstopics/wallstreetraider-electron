import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import * as api from '../api.js';
import DifficultyLevelInput from './DifficultyLevelInput.js';


export default function NewGameSetupModal({ show, onSubmit, onCancel }) {

    const allPlayers = api.useGameStore(s => s.gameState.allPlayers);
    const defaultStartingMoney = api.useGameStore(s => s.gameState.startingMoney);
    const defaultGameLength = api.useGameStore(s => s.gameState.gameLength);
    const defaultDifficultyLevel = api.useGameStore(s => s.gameState.difficultyLevel);
    const numPlayers = api.useGameStore(s => s.gameState.numPlayers) || 2;

    const playerIdsOrdered = [api.HUMAN1_ID, api.COMPUTER1_ID, api.COMPUTER2_ID, api.COMPUTER3_ID, api.COMPUTER4_ID];
    const defaultPlayerNames = playerIdsOrdered.map(id => allPlayers?.find(p => p.id === id)?.name || "");

    const [playerNames, setPlayerNames] = useState(defaultPlayerNames);
    const [money, setMoney] = useState(() => defaultStartingMoney?.toString() || "1000");
    const [gameLength, setGameLength] = useState(() => defaultGameLength?.toString() || "35");
    const [difficultyLevel, setDifficultyLevel] = useState(() => defaultDifficultyLevel?.toString() || "2");

    useEffect(() => {
        setPlayerNames(defaultPlayerNames || ["", "", "", "", ""]);
        setMoney(defaultStartingMoney?.toString() || "1000");
        setGameLength(defaultGameLength?.toString() || "35");
        setDifficultyLevel(defaultDifficultyLevel?.toString() || "2");
    }, [show]);

    const submit = () => {

        const sanitizeNames = playerNames.map((name) => name?.replaceAll(/[|"]/g, " ") || "");

        const body = {
            startingMoney: money,
            gameLength,
            difficultyLevel: difficultyLevel
        };
        sanitizeNames.forEach((name, index) => {
            const playerNum = playerIdsOrdered[index];
            body[`player${playerNum}Name`] = name;
        });

        onSubmit(body);
    }

    return html`<${Modal} show=${show}>
        <div>
            <div class="text-lg font-bold h-full">Startup Choices</div>
            <br/>
            <div class="mb-4">
                <div class="flex flex-col">
                    <div class="flex">
                        <div class="flex-1 p-2"></div>
                        <div class="flex-1 p-2">Enter Player Names:</div>
                        <div class="flex-1 p-2">(20 characters max)</div>
                    </div>
                    ${playerIdsOrdered.slice(0, numPlayers).map((playerId, index) => html`<div class="flex">
                        <div class="flex-1 p-2 text-right">${playerId === api.HUMAN1_ID ? "You:" : "Computer:"}</div>
                        <div class="flex-1 p-2">
                            <input type="text" maxlength="20" class="modal-input" value=${playerNames[index]} onInput=${(e) => {
                                const newNames = [...playerNames];
                                newNames[index] = e.target.value;
                                setPlayerNames(newNames);
                            }} /><br/>
                        </div>
                        <div class="flex-1 p-2"></div>
                    </div>`)}
                    <div class="flex mt-4">
                        <div class="flex-2 p-2 w-36 text-right">Difficulty Level:</div>
                        <div class="flex-1 p-2 w-full">
                            <${DifficultyLevelInput}
                                value=${difficultyLevel}
                                onChange=${(val) => setDifficultyLevel(val)}
                                disabled=${false}
                                label="Difficulty"
                            />
                        </div>
                        <div class="flex-2 p-2">(Levels 1, 2, 3, or 4)</div>
                    </div>
                    <div class="flex">
                        <div class="flex-2 p-2 text-right w-36">Starting Money<br/>per Player:</div>
                        <div class="flex-1 p-2">
                            <input type="number" min="100" max="1000" class="modal-input w-full" value=${money} onInput=${(e) => {
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
                        <div class="flex-2 p-2">(100 to 1000 mil. USD)</div>
                    </div>
                    <div class="flex mb-12 ">
                        <div class="flex-2 p-2 text-right w-36">Game Length:</div>
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
                        <div class="flex-2 p-2 text-right">(1 to 35 years)</div>
                    </div>
                </div>
            </div>
        </div>
        <br/>
        <div class="flex justify-between items-center mb-4">
            <button class="btn modal green" onClick=${submit}>Submit</button>
            <button class="btn modal" onClick=${onCancel}>Cancel</button>
        </div>
    <//>`;
}