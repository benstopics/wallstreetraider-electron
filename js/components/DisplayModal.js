import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import Modal from './Modal.js';
import Button from './Button.js';
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
        <${Modal} show=${show} onClose=${onClose} style="display: flex; flex-direction: column; width: 280px; max-width: 280px; transform: scale(${counterScale}); transform-origin: center center;">
            <div class="flex-1 min-h-0 p-3 overflow-y-auto">
                <div style="margin-bottom: 16px;">
                    <h2 style="margin: 0; font-size: var(--font-size-lg); font-weight: 600;">Display Settings</h2>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 12px; font-size: var(--font-size-md); color: #ccc;">Zoom Level</label>

                    <div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
                        <${Button}
                            onClick=${handleZoomOut}
                            style="
                                width: 36px;
                                height: 36px;
                                border-radius: 50%;
                                border: 1px solid #555;
                                background: #333;
                                color: #fff;
                                font-size: var(--font-size-xl);
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
                            font-size: var(--font-size-2xl);
                            font-weight: 500;
                            color: #fff;
                        ">
                            ${zoomPercent}%
                        </div>

                        <${Button}
                            onClick=${handleZoomIn}
                            style="
                                width: 36px;
                                height: 36px;
                                border-radius: 50%;
                                border: 1px solid #555;
                                background: #333;
                                color: #fff;
                                font-size: var(--font-size-xl);
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
            </div>

            <div class="flex justify-center gap-3 p-3 flex-shrink-0">
                <${Button}
                    onClick=${handleReset}
                    style="
                        padding: 6px 16px;
                        border: 1px solid #555;
                        background: #333;
                        color: #fff;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: var(--font-size-md);
                    "
                >
                    Reset to 100%
                </button>
                <${Button}
                    onClick=${onClose}
                    style="
                        padding: 6px 16px;
                        border: 1px solid #555;
                        background: #333;
                        color: #fff;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: var(--font-size-md);
                    "
                >
                    Close
                </button>
            </div>
        <//>
    `;
}

export default DisplayModal;
