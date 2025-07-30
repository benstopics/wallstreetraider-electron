import { html } from '../lib/preact.standalone.module.js';
import PlayerView from './PlayerView.js';
import IndustrialView from './IndustrialView.js';

const View = ({ gameState }) => {
    const id = gameState.activeEntityNum || 0;
    if (id > 1 && id <= 5) {
        return html`<${PlayerView} gameState=${gameState} />`;
    } else if (id > 10 && id <= 1600) {
        return html`<${IndustrialView} gameState=${gameState} />`;
    }
    return html``;
};

export default View;
