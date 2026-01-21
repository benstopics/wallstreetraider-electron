import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import Modal from './Modal.js';
const { ipcRenderer } = require('electron');

// Convert zoom level to percentage (zoom level 0 = 100%, each level is ~20%)
function zoomLevelToPercent(level) {
    return Math.round(Math.pow(1.2, level) * 100);
}

// Counter-scale factor: inverse of the zoom so modal stays fixed size on screen
function getCounterScale(level) {
    return 1 / Math.pow(1.2, level);
}

function DisplayModal({ show, onClose }) {
    const [zoomLevel, setZoomLevel] = useState(0);
    const [zoomPercent, setZoomPercent] = useState(100);

    // Fetch current zoom level when modal opens
    useEffect(() => {
        if (show) {
            ipcRenderer.invoke('get-zoom-level').then((level) => {
                setZoomLevel(level);
                setZoomPercent(zoomLevelToPercent(level));
            });
        }
    }, [show]);

    const handleZoomIn = () => {
        const newLevel = zoomLevel + 1;
        setZoomLevel(newLevel);
        setZoomPercent(zoomLevelToPercent(newLevel));
        ipcRenderer.send('set-zoom-level', newLevel);
    };

    const handleZoomOut = () => {
        const newLevel = zoomLevel - 1;
        setZoomLevel(newLevel);
        setZoomPercent(zoomLevelToPercent(newLevel));
        ipcRenderer.send('set-zoom-level', newLevel);
    };

    const handleReset = () => {
        setZoomLevel(0);
        setZoomPercent(100);
        ipcRenderer.send('set-zoom-level', 0);
    };

    const counterScale = getCounterScale(zoomLevel);

    return html`
        <${Modal} show=${show} onClose=${onClose} style="width: 280px; max-width: 280px; transform: scale(${counterScale}); transform-origin: center center;">
            <div style="margin-bottom: 16px;">
                <h2 style="margin: 0; font-size: 16px; font-weight: 600;">Display Settings</h2>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 12px; font-size: 13px; color: #ccc;">Zoom Level</label>

                <div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
                    <button
                        onClick=${handleZoomOut}
                        style="
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            border: 1px solid #555;
                            background: #333;
                            color: #fff;
                            font-size: 20px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        "
                    >
                        −
                    </button>

                    <div style="
                        min-width: 80px;
                        text-align: center;
                        font-size: 24px;
                        font-weight: 500;
                        color: #fff;
                    ">
                        ${zoomPercent}%
                    </div>

                    <button
                        onClick=${handleZoomIn}
                        style="
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            border: 1px solid #555;
                            background: #333;
                            color: #fff;
                            font-size: 20px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        "
                    >
                        +
                    </button>
                </div>
            </div>

            <div style="display: flex; justify-content: center; gap: 12px;">
                <button
                    onClick=${handleReset}
                    style="
                        padding: 6px 16px;
                        border: 1px solid #555;
                        background: #333;
                        color: #fff;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 13px;
                    "
                >
                    Reset to 100%
                </button>
                <button
                    onClick=${onClose}
                    style="
                        padding: 6px 16px;
                        border: 1px solid #555;
                        background: #333;
                        color: #fff;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 13px;
                    "
                >
                    Close
                </button>
            </div>
        <//>
    `;
}

export default DisplayModal;
