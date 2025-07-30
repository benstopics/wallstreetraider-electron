import { html } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { renderMultilineText } from './helpers.js';

const AdvisorySummary = ({ text }) => {
    const content = text && text.trim().length > 0
        ? renderMultilineText(text)
        : html`<p>No advisories available at this time.</p>`;

    return html`
        <div class="panel h-full w-full">
            <div class="panel-header">Advisory Summary</div>
            <div class="p-1 panel-body fixed-width">
                ${content}
            </div>
        </div>
    `;
};

export default AdvisorySummary;