/**
 * Locale Manager - Manages multiple translator instances and switches between them dynamically.
 *
 * Persistence lives in PB (LocaleStr global, persisted to CFIG.WSR via
 * WriteConfig). Frontend reads gameState.locale and writes via /set_locale.
 *
 * Module init defaults to 'en-US' because translators are constructed before
 * the first gameState broadcast arrives. Once the WS connects and gameState
 * provides the persisted locale, syncFromGameState() switches the translator.
 * Non-English users will see ~50ms of English on app launch — acceptable
 * tradeoff vs adding sync-IPC bootstrap plumbing.
 */

import { createTranslator } from './translator.js';
import { zhCN } from './zh-CN.js';
import * as api from '../api.js';

// Sync IPC bootstrap: ask main.js to read CFIG.WSR before the first render.
// Falls back to 'en-US' if Electron IPC is unavailable (e.g., browser tests).
const ipcRenderer = (typeof require !== 'undefined') ? require('electron').ipcRenderer : null;
function bootstrapLocale() {
    try {
        if (!ipcRenderer || typeof ipcRenderer.sendSync !== 'function') return 'en-US';
        const v = ipcRenderer.sendSync('prefs:get-locale');
        return (typeof v === 'string' && v) ? v : 'en-US';
    } catch (e) {
        return 'en-US';
    }
}

// Define all supported languages
const LANGUAGE_OPTIONS = {
    'en-US': {
        name: 'English (US)',
        dictionary: {} // English is the base language, no translation needed
    },
    'zh-CN': {
        name: '简体中文',
        dictionary: zhCN,
        warning: "由于过去40年间文本量巨大，中文翻译仍在进行中。用户可能会遇到不完整或不准确的翻译。请在Discord或Reddit上报告任何问题，帮助我们改进本地化。感谢您的理解。"
    }
};

// Initialize translator instances for each language
const translators = {};
for (const [locale, config] of Object.entries(LANGUAGE_OPTIONS)) {
    translators[locale] = createTranslator(config.dictionary, {
        enabled: locale !== 'en-US',
        cacheSize: 5000
    });
}

let currentLocale = bootstrapLocale();
if (!LANGUAGE_OPTIONS[currentLocale]) currentLocale = 'en-US';

const localeManager = {
    getCurrentLocale() {
        return currentLocale;
    },

    /**
     * Set the active locale. Pushes the change to PB via REST so it persists
     * to CFIG.WSR. Use this for user-initiated changes from the dropdown.
     */
    setCurrentLocale(locale) {
        if (!LANGUAGE_OPTIONS[locale]) {
            console.warn(`Unsupported locale: ${locale}. Keeping current locale: ${currentLocale}`);
            return;
        }
        currentLocale = locale;
        api.setLocale(locale).catch((e) => {
            console.error('Failed to persist locale to PB:', e);
        });
    },

    /**
     * Sync local state from gameState.locale without round-tripping through PB.
     * Called by the gameState subscriber when the broadcast value changes —
     * avoids feedback loops where setCurrentLocale → REST → broadcast → sync.
     */
    syncFromGameState(locale) {
        if (!locale || !LANGUAGE_OPTIONS[locale]) return;
        if (currentLocale === locale) return;
        currentLocale = locale;
    },

    translate(text) {
        const translator = translators[currentLocale];
        if (!translator) {
            console.warn(`No translator found for locale: ${currentLocale}`);
            return text;
        }
        return translator.translate(text);
    },

    getLanguageOptions() {
        return LANGUAGE_OPTIONS;
    },

    getLanguageName(locale) {
        return LANGUAGE_OPTIONS[locale]?.name || locale;
    },

    clearAllCaches() {
        Object.values(translators).forEach(translator => translator.clearCache());
    },

    getWarningForLocale(locale) {
        return LANGUAGE_OPTIONS[locale]?.warning || null;
    }
};

export default localeManager;
export { LANGUAGE_OPTIONS };
