import { html, render, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { insertCurrencySymbols } from './helpers.js';
import { tabNumberLabel, bracketLabel } from '../hotkeys.js';
import { isEditableTarget } from '../keybinds.js';
import { useHotkey, useIsKeyClaimed } from '../hooks/useHotkey.js';
import { PRIORITY } from '../hotkeyManager.js';


const Tabs = ({ children, activeTab: externalActiveTab, onTabChange }) => {
    const tabChildren = Array.isArray(children) ? children.filter(child => (child?.props?.label ?? false)) : [children];
    const tabLabels = tabChildren.map(child => child.props.label);
    const tabHotkeys = tabChildren.map(child => child.props.hotkey || null);
    const hasLetterHotkeys = tabHotkeys.some(h => h);
    const [activeTab, setActiveTab] = useState(externalActiveTab || tabLabels[0]);

    const hotkeyIdRef = useRef(Symbol('tabs-hotkey'));

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

    // Check if a dropdown is open (suppress letter hotkeys when dropdown is active)
    const dropdownOpen = useIsKeyClaimed(
        (handler) => handler.priority === PRIORITY.DROPDOWN,
        PRIORITY.TABS,
        []
    );

    // Letter-based hotkey handler via centralized HotkeyManager (PRIORITY.TABS).
    useHotkey(
        hotkeyIdRef.current,
        PRIORITY.TABS,
        (e) => {
            if (!hasLetterHotkeys) return false;
            if (dropdownOpen) return false;
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return false;
            if (isEditableTarget(e.target)) return false;
            const modalType = api.gameStore?.getState()?.gameState?.modalType;
            if (modalType > 0) return false;
            const key = e.key.toLowerCase();
            return tabHotkeys.some(h => h && h.toLowerCase() === key);
        },
        (e) => {
            const key = e.key.toLowerCase();
            const idx = tabHotkeys.findIndex(h => h && h.toLowerCase() === key);
            if (idx === -1) return false;

            e.preventDefault();
            e.stopImmediatePropagation();

            if (tabLabels[idx] !== activeTab) {
                changeTab(tabLabels[idx]);
            }
            return true;
        },
        { active: hasLetterHotkeys },
        [tabHotkeys, tabLabels, activeTab, hasLetterHotkeys, dropdownOpen]
    );

    // Check if letter hotkeys are suppressed by a higher-priority handler
    // (e.g., SelectableLines at PRIORITY.LINE_SELECTION claims letters when a line is selected)
    const lettersAreClaimed = useIsKeyClaimed(
        (handler) => handler.active && handler.meta?.claimsLetters === true,
        PRIORITY.TABS,
        [hasLetterHotkeys]
    );

    // Check if a HotkeyButtonBar is active (suppress number-based tab switching when bar is present)
    const barIsPresent = useIsKeyClaimed(
        (handler) => handler.priority === PRIORITY.BUTTON_BAR,
        PRIORITY.TABS,
        []
    );

    // Listen for hotkey-tab events to switch tabs by index (only when no button bar is present)
    useEffect(() => {
        if (hasLetterHotkeys) return; // Skip number-based handler when using letter hotkeys
        if (barIsPresent) return; // Button bar handles number keys instead
        const handler = (e) => {
            const idx = e.detail?.index;
            if (typeof idx === 'number' && idx >= 0 && idx < tabLabels.length) {
                if (tabLabels[idx] !== activeTab) {
                    changeTab(tabLabels[idx]);
                }
            }
        };
        document.addEventListener('hotkey-tab', handler);
        return () => document.removeEventListener('hotkey-tab', handler);
    }, [tabLabels, activeTab, hasLetterHotkeys, barIsPresent]);

    return html`
    <div class="flex flex-col w-full h-full min-h-0">
        <!-- Tab Header Row -->
        <div class="flex flex-row flex-wrap items-center" data-tutorial="tab-row" style="gap: 5px;">
            ${tabLabels.map((label, i) => {
                const hotkey = tabHotkeys[i];
                const tabNum = i < 9 ? `${i + 1}` : i === 9 ? '0' : null;
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
                    ${hotkey
                        ? (lettersAreClaimed
                            ? html`<span style="opacity:0.3;margin-right:2px;text-decoration:line-through;">${hotkey})</span>${insertCurrencySymbols(label)}`
                            : bracketLabel(insertCurrencySymbols(label), hotkey))
                        : html`${tabNum !== null ? tabNumberLabel(tabNum) : ''}${insertCurrencySymbols(label)}`
                    }
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
