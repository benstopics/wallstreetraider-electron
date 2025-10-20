import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';


const Tabs = ({ children, activeTab: externalActiveTab, onTabChange }) => {
    const tabChildren = Array.isArray(children) ? children.filter(child => (child?.props?.label ?? false)) : [children];
    const tabLabels = tabChildren.map(child => child.props.label);
    const [activeTab, setActiveTab] = useState(externalActiveTab || tabLabels[0]);

    const changeTab = (newTab) => {
        setActiveTab(newTab);
        onTabChange?.(newTab);
    }

    useEffect(() => {
        if (!tabLabels.includes(activeTab)) {
            changeTab(tabLabels[0]);
        }
    }, [children])

    useEffect(() => {
        if (externalActiveTab !== activeTab && tabLabels.includes(externalActiveTab)) {
            changeTab(externalActiveTab);
        }
    }, [externalActiveTab]);

    return html`
    <div class="flex flex-col w-full h-full min-h-0">
        <!-- Tab Header Row -->
        <div class="flex flex-row flex-wrap items-center" style="gap: 5px;">
            ${tabLabels.map(label => html`
                <div
                    class=${`tab-button ${label === activeTab ? 'active' : ''}`}
                    onClick=${() => changeTab(label)}
                >
                    ${label}
                </div>
            `)}
        </div>

        <!-- Active Tab Content -->
        <div class="flex-1 overflow-auto h-full panel p-2 min-h-0">
            ${tabChildren.map(child =>
        child.props.label === activeTab ? html`<div class="h-full">${child.props.children}</div>` : null
    )}
        </div>
    </div>
    `;
};

export const Tab = ({ children }) => {
    return html`<div class="h-full">${children}</div>`;
};

export default Tabs;