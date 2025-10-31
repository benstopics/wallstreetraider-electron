import { html } from '../lib/preact.standalone.module.js';
import PlayerView from './PlayerView.js';
import IndustrialView from './IndustrialView.js';
import * as api from '../api.js';
import IndustryView from './IndustryView.js';

const View = () => {

    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);

    if (activeIndustryNum >= 0) {
        return html`<${IndustryView} />`;
    }

    const id = activeEntityNum || 0;
    if (id > 1 && id <= 5) {
        return html`<${PlayerView} />`;
    } else if (id > 10 && id <= 1600) {
        return html`<${IndustrialView} />`;
    }
    return html``;
};

export default View;
