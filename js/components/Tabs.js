import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';


const Tabs = ({ children }) => {
    const tabChildren = Array.isArray(children) ? children : [children];
    const tabLabels = tabChildren.map(child => child.props.label);
    const [activeTab, setActiveTab] = useState(tabLabels[0]);

    return html`
    <div class="flex flex-col h-full min-h-0">
        <!-- Tab Header Row -->
        <div class="flex flex-row items-center" style="gap: 5px;">
            ${tabLabels.map(label => html`
                <div
                    class=${`tab-button ${label === activeTab ? 'active' : ''}`}
                    onClick=${() => setActiveTab(label)}
                >
                    ${label}
                </div>
            `)}
        </div>

        <!-- Active Tab Content -->
        <div class="flex-1 overflow-auto panel p-2 min-h-0">
            ${tabChildren.map(child =>
        child.props.label === activeTab ? html`<div>${child.props.children}</div>` : null
    )}
        </div>
    </div>
    `;
};

export const Tab = ({ children }) => {
    return html`<div>${children}</div>`;
};

export default Tabs;