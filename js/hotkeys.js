import { html } from './lib/preact.standalone.module.js';

let _hotkeysDisabled = false;

/** Called by app.js when the disable-hotkeys setting changes. */
export function setHotkeysVisualDisabled(disabled) {
    _hotkeysDisabled = disabled;
}

export function isHotkeysVisualDisabled() {
    return _hotkeysDisabled;
}

/**
 * Centralized hotkey map.
 *
 * Each entry defines a key combo → action binding.
 * Structured as a dictionary so future customization only needs
 * to swap key→action mappings (similar to useActionButtonProps pattern).
 *
 * Key format: plain character for single keys, "ALT+ArrowLeft" for combos.
 * Modifier prefixes: ALT+, CTRL+, SHIFT+, META+
 */

export const HOTKEY_CATEGORIES = ['Navigation', 'Action Bar', 'Tabs', 'Modals', 'General'];

export const HOTKEY_MAP = [
    // Navigation
    { key: 'ALT+ArrowLeft',  action: 'NAV_BACK',         label: 'Navigate Back',       category: 'Navigation' },
    { key: 'ALT+ArrowRight', action: 'NAV_FORWARD',      label: 'Navigate Forward',    category: 'Navigation' },
    { key: 'ALT+j',          action: 'NAV_BACK',         label: 'Navigate Back (J/K)', category: 'Navigation' },
    { key: 'ALT+k',          action: 'NAV_FORWARD',      label: 'Navigate Forward (J/K)', category: 'Navigation' },
    { key: '/',              action: 'FOCUS_COMMAND',     label: 'Focus Command Line',  category: 'Navigation' },
    { key: 'SHIFT+m',        action: 'MARKET_REPORTS',    label: 'Market Reports',      category: 'Navigation' },
    { key: 'SHIFT+d',        action: 'DATABASE_SEARCH',   label: 'Database Search',     category: 'Navigation' },
    { key: 'SHIFT+l',        action: 'CHANGE_LAW_FIRM',  label: 'Change Law Firm',     category: 'Navigation' },
    { key: 'a',              action: 'ACT_AS',          label: 'Act As Active Entity', category: 'Navigation' },
    { key: 'p',              action: 'VIEW_PLAYER',     label: 'View Player',          category: 'Navigation' },

    // Tabs (number keys: 1-9 for tabs 1-9, 0 for tab 10)
    { key: '1', action: 'TAB_1',  label: 'Tab 1 / Line 1',  category: 'Tabs' },
    { key: '2', action: 'TAB_2',  label: 'Tab 2 / Line 2',  category: 'Tabs' },
    { key: '3', action: 'TAB_3',  label: 'Tab 3 / Line 3',  category: 'Tabs' },
    { key: '4', action: 'TAB_4',  label: 'Tab 4 / Line 4',  category: 'Tabs' },
    { key: '5', action: 'TAB_5',  label: 'Tab 5 / Line 5',  category: 'Tabs' },
    { key: '6', action: 'TAB_6',  label: 'Tab 6 / Line 6',  category: 'Tabs' },
    { key: '7', action: 'TAB_7',  label: 'Tab 7 / Line 7',  category: 'Tabs' },
    { key: '8', action: 'TAB_8',  label: 'Tab 8 / Line 8',  category: 'Tabs' },
    { key: '9', action: 'TAB_9',  label: 'Tab 9 / Line 9',  category: 'Tabs' },
    { key: '0', action: 'TAB_10', label: 'Tab 10', category: 'Tabs' },

    // Bar buttons (SHIFT+number for action bar buttons)
    { key: 'SHIFT+1', action: 'BAR_1',  label: 'Bar Button 1',  category: 'Action Bar' },
    { key: 'SHIFT+2', action: 'BAR_2',  label: 'Bar Button 2',  category: 'Action Bar' },
    { key: 'SHIFT+3', action: 'BAR_3',  label: 'Bar Button 3',  category: 'Action Bar' },
    { key: 'SHIFT+4', action: 'BAR_4',  label: 'Bar Button 4',  category: 'Action Bar' },
    { key: 'SHIFT+5', action: 'BAR_5',  label: 'Bar Button 5',  category: 'Action Bar' },
    { key: 'SHIFT+6', action: 'BAR_6',  label: 'Bar Button 6',  category: 'Action Bar' },
    { key: 'SHIFT+7', action: 'BAR_7',  label: 'Bar Button 7',  category: 'Action Bar' },
    { key: 'SHIFT+8', action: 'BAR_8',  label: 'Bar Button 8',  category: 'Action Bar' },
    { key: 'SHIFT+9', action: 'BAR_9',  label: 'Bar Button 9',  category: 'Action Bar' },
    { key: 'SHIFT+0', action: 'BAR_10', label: 'Bar Button 10', category: 'Action Bar' },

    // Modals (only active when a modal is open)
    { key: 'y', action: 'MODAL_YES',    label: 'Yes (Confirm)',    category: 'Modals' },
    { key: 'n', action: 'MODAL_NO',     label: 'No (Confirm)',     category: 'Modals' },
    { key: 'c', action: 'MODAL_CANCEL', label: 'Cancel / Close',   category: 'Modals' },

    // Action Bar (Shift+letter to open dropdown, then 1-9 to select item)
    { key: 'SHIFT+t', action: 'DROPDOWN_TRADE',     label: 'Trade Menu',      category: 'Action Bar' },
    { key: 'SHIFT+f', action: 'DROPDOWN_FINANCE',   label: 'Finance Menu',    category: 'Action Bar' },
    { key: 'SHIFT+c', action: 'DROPDOWN_CORPORATE', label: 'Corporate Menu',  category: 'Action Bar' },
    { key: 'SHIFT+h', action: 'DROPDOWN_HOSTILE',   label: 'Hostile Menu',    category: 'Action Bar' },
    { key: 'SHIFT+b', action: 'DROPDOWN_BANKING',   label: 'Banking Menu',    category: 'Action Bar' },

    // General
    { key: ' ',              action: 'TOGGLE_TICKER',    label: 'Toggle Ticker',       category: 'General' },
    { key: 'CTRL+s',        action: 'SAVE_GAME',        label: 'Save Game',           category: 'General' },
    { key: 'CTRL+ArrowLeft', action: 'ACTING_AS_PREV',   label: 'Previous Acting As',  category: 'General' },
    { key: 'CTRL+ArrowRight',action: 'ACTING_AS_NEXT',   label: 'Next Acting As',      category: 'General' },
    { key: 'CTRL+j',        action: 'ACTING_AS_PREV',   label: 'Previous Acting As (J/K)', category: 'General' },
    { key: 'CTRL+k',        action: 'ACTING_AS_NEXT',   label: 'Next Acting As (J/K)', category: 'General' },
    { key: 'v',             action: 'VIEW_ACTING_AS',   label: 'View Acting As',      category: 'Navigation' },
];

/**
 * Match a keyboard event to a hotkey map entry.
 * Returns the matching entry or null.
 */
export function matchHotkey(e) {
    for (const entry of HOTKEY_MAP) {
        const parts = entry.key.split('+');
        const mainKey = parts[parts.length - 1];
        const needsAlt = parts.includes('ALT');
        const needsCtrl = parts.includes('CTRL');
        const needsShift = parts.includes('SHIFT');
        const needsMeta = parts.includes('META');

        if (e.altKey !== needsAlt) continue;
        if (e.ctrlKey !== needsCtrl) continue;
        if (e.shiftKey !== needsShift) continue;
        if (e.metaKey !== needsMeta) continue;

        // Match by e.key (case-insensitive for letters, exact for special keys)
        if (e.key === mainKey) return entry;
        if (e.key.toLowerCase() === mainKey.toLowerCase()) return entry;

        // For digit keys with SHIFT, e.key becomes symbol (!@#$%^&*())
        // Use e.code (Digit1, Digit2, etc.) to match
        if (needsShift && /^[0-9]$/.test(mainKey)) {
            const expectedCode = mainKey === '0' ? 'Digit0' : `Digit${mainKey}`;
            if (e.code === expectedCode) return entry;
        }
    }
    return null;
}

/**
 * Render a label with the hotkey letter wrapped in brackets and underlined.
 * e.g., bracketLabel("Yes", "Y") → html`<u>[Y]</u>es`
 *       bracketLabel("Cancel", "C") → html`<u>[C]</u>ancel`
 *       bracketLabel("Close", "C") → html`<u>[C]</u>lose`
 * If the key letter is not found in the label, renders as "K) Label"
 */
export function bracketLabel(label, key, skipWords = 0) {
    if (_hotkeysDisabled) return label;
    let startFrom = 0;
    if (skipWords > 0) {
        let wordsSkipped = 0;
        for (let i = 0; i < label.length; i++) {
            if (label[i] === ' ' && i > 0 && label[i - 1] !== ' ') {
                wordsSkipped++;
                if (wordsSkipped >= skipWords) {
                    startFrom = i + 1;
                    break;
                }
            }
        }
    }
    const idx = label.toLowerCase().indexOf(key.toLowerCase(), startFrom);
    if (idx === -1) {
        // Key not found in label, prepend with paren format
        return html`<u>${key.toUpperCase()}</u>) ${label}`;
    }
    const before = label.slice(0, idx);
    const letter = label[idx];
    const after = label.slice(idx + 1);
    return html`${before}<u>[${letter}]</u>${after}`;
}

/**
 * Render a tab number label with consistent styling.
 * e.g., tabNumberLabel(1) → html`<span style="...">1.</span>`
 */
export function tabNumberLabel(number) {
    if (_hotkeysDisabled) return '';
    const numStr = String(number);
    const minWidth = numStr.length > 1 ? '1.4em' : '';
    const widthStyle = minWidth ? `min-width:${minWidth};display:inline-block;text-align:right;` : '';
    return html`<span style="opacity:0.45;margin-right:2px;${widthStyle}">${number})</span>`;
}

/**
 * Get the display string for a hotkey key combo.
 * e.g., "ALT+ArrowLeft" → "Alt+←"
 */
export function formatHotkeyKey(key) {
    return key
        .replace('ALT+', 'Alt+')
        .replace('CTRL+', 'Ctrl+')
        .replace('SHIFT+', 'Shift+')
        .replace('META+', 'Meta+')
        .replace('ArrowLeft', '←')
        .replace('ArrowRight', '→')
        .replace('ArrowUp', '↑')
        .replace('ArrowDown', '↓')
        .replace(' ', 'Space');
}
