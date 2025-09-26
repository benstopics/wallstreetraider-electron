import { html } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { renderMultilineText, getMultilineTextLines } from './helpers.js';
import * as api from '../api.js';

const AdvisorySummary = ({ gameState }) => {
    const lines = getMultilineTextLines(gameState.advisorySummary);
    if (lines.length === 0)
        lines.push('No advisories available at this time.');

    return html`
        <div class="panel h-full w-full">
            <div class="panel-header">Advisory Summary</div>
            <div class="p-1 panel-body fixed-width">
                ${lines.filter(l => l.trim() !== '').map(line => html`<span>${api.renderHyperlinks(line, gameState, ({ id, type }) => {
                    if (type === 'C')  api.setViewAsset(id);
                    else if (type === 'I') api.viewIndustry(id);
                })}</span><br/><br/>`)}
            </div>
        </div>
    `;
};

export default AdvisorySummary;