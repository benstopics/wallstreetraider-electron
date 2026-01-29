import { html } from '../lib/preact.standalone.module.js';

const OwnershipViewToggle = ({ showGraph, onToggle }) => {
    return html`
        <div class="flex justify-start mb-2">
            <button
                class="btn btn-sm"
                onClick=${onToggle}
            >
                ${showGraph ? 'Show Text Report' : 'Show Graph'}
            </button>
        </div>
    `;
};

export default OwnershipViewToggle;
