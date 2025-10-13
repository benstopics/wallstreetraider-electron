import { html, useState, useRef, useLayoutEffect, useMemo, useEffect } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import * as api from '../api.js';
import DifficultyLevelInput from './DifficultyLevelInput.js';


export default function NewGameSetupModal({ show, onSubmit, onCancel, gameState }) {
    const playerIdsOrdered = [api.PLAYER2_ID, api.PLAYER1_ID, api.PLAYER3_ID, api.PLAYER4_ID, api.PLAYER5_ID];
    const defaultPlayerNames = playerIdsOrdered.map(id => gameState.allPlayers?.find(p => p.id === id)?.name) || ["", "", "", "", ""];

    const [playerNames, setPlayerNames] = useState(defaultPlayerNames);
    const [money, setMoney] = useState(() => gameState.startingMoney?.toString() || "1000");
    const [gameLength, setGameLength] = useState(() => gameState.gameLength?.toString() || "35");
    const [difficultyLevel, setDifficultyLevel] = useState(() => gameState.difficultyLevel?.toString() || "2");

    useEffect(() => {
        setPlayerNames(defaultPlayerNames || ["", "", "", "", ""]);
        setMoney(gameState.startingMoney?.toString() || "1000");
        setGameLength(gameState.gameLength?.toString() || "35");
        setDifficultyLevel(gameState.difficultyLevel?.toString() || "2");
    }, [show]);
    const submit = () => {

        const sanitizeNames = playerNames.map((name) => name?.replaceAll(/[|"]/g, " ") || "");

        onSubmit({
            player1Name: sanitizeNames[0],
            player2Name: sanitizeNames[1],
            player3Name: sanitizeNames[2],
            player4Name: sanitizeNames[3],
            player5Name: sanitizeNames[4],
            startingMoney: money,
            gameLength,
            difficultyLevel: difficultyLevel
        });
    }

    // Cut off from end of list to match number of players
    playerIdsOrdered.length = gameState.numPlayers || 2;

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
                    ${playerIdsOrdered.map((playerId, index) => html`<div class="flex">
                        <div class="flex-1 p-2 text-right">${playerId === api.PLAYER2_ID ? "You:" : "Computer:"}</div>
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