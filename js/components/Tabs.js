import { html, render, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { insertCurrencySymbols } from './helpers.js';


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

    useEffect(() => {
        const tab = tabChildren.find(child => child.props.label === activeTab);
        if (tab?.props.id !== undefined) {
            api.setActiveUIReport(tab.props.id);
        }
    }, [activeTab]);

    return html`
    <div class="flex flex-col w-full h-full min-h-0">
        <!-- Tab Header Row -->
        <div class="flex flex-row flex-wrap items-center" data-tutorial="tab-row" style="gap: 5px;">
            ${tabLabels.map((label, i) => {
                return html`
                <div
                    class=${`tab-button ${label === activeTab ? 'active' : ''}`}
                    data-tutorial=${`tab-${label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick=${() => {
                        if (label !== activeTab) {
                            changeTab(label);
                        }
                    }}
                >
                    ${insertCurrencySymbols(label)}
                </div>
            `})}
        </div>

        <!-- Active Tab Content -->
        <div class="flex-1 overflow-y-auto h-full panel p-2 min-h-0">
            ${tabChildren.map(child =>
        child.props.label === activeTab ? html`<div class="h-full">${child.props.children}</div>` : ''
    )}
        </div>
    </div>
    `;
};

export const Tab = ({ children }) => {
    return html`<div class="h-full">${children}</div>`;
};

export default Tabs;
