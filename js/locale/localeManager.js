/**
 * Locale Manager - Manages multiple translator instances and switches between them dynamically
 * Supports runtime language switching without page reload
 */

import { createTranslator } from './translator.js';
import { zhCN } from './zh-CN.js';

// Define all supported languages
const LANGUAGE_OPTIONS = {
    'en-US': {
        name: 'English (US)',
        dictionary: {} // English is the base language, no translation needed
    },
    'zh-CN': {
        name: '简体中文',
        dictionary: zhCN,
        // Note: Due to the volume of text written over the past 40 years, the Chinese translation is a work in progress.
        // Users may encounter incomplete translations or inaccuracies. Please report any issues on Discord or Reddit to help us improve the localization.
        // We appreciate your understanding.
        warning: "由于过去40年间文本量巨大，中文翻译仍在进行中。用户可能会遇到不完整或不准确的翻译。请在Discord或Reddit上报告任何问题，帮助我们改进本地化。感谢您的理解。"
    }
    // Future languages can be added here:
    // 'es-ES': { name: 'Español', dictionary: esES },
    // 'fr-FR': { name: 'Français', dictionary: frFR },
};

const STORAGE_KEY = 'wsr_locale';

// Helper to get stored locale value (using localStorage for Electron reliability)
function getStoredLocale() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
        console.error('Error reading locale from localStorage:', e);
        return null;
    }
}

// Helper to set stored locale value
function setStoredLocale(locale) {
    try {
        localStorage.setItem(STORAGE_KEY, locale);
        console.log('Locale saved to localStorage:', locale);
    } catch (e) {
        console.error('Error saving locale to localStorage:', e);
    }
}

// Initialize translator instances for each language
const translators = {};
for (const [locale, config] of Object.entries(LANGUAGE_OPTIONS)) {
    translators[locale] = createTranslator(config.dictionary, {
        enabled: locale !== 'en-US', // English doesn't need translation
        cacheSize: 5000
    });
}

// Get initial locale from localStorage or default to en-US
let currentLocale = getStoredLocale() || 'en-US';
console.log('LocaleManager initialized. Stored locale:', getStoredLocale());
console.log('Initial locale set to:', currentLocale);
if (!LANGUAGE_OPTIONS[currentLocale]) {
    console.warn('Invalid locale in storage, defaulting to en-US');
    currentLocale = 'en-US';
}

// Locale Manager API
const localeManager = {
    /**
     * Get the current locale code
     * @returns {string} Current locale (e.g., 'en-US', 'zh-CN')
     */
    getCurrentLocale() {
        return currentLocale;
    },

    /**
     * Set the current locale and switch translator
     * @param {string} locale - Locale code (e.g., 'en-US', 'zh-CN')
     */
    setCurrentLocale(locale) {
        if (!LANGUAGE_OPTIONS[locale]) {
            console.warn(`Unsupported locale: ${locale}. Keeping current locale: ${currentLocale}`);
            return;
        }
        currentLocale = locale;
        setStoredLocale(locale);
        console.log(`Locale switched to: ${locale}`);
    },

    /**
     * Translate text using the current locale's translator
     * @param {string} text - Text to translate
     * @returns {string} Translated text
     */
    translate(text) {
        const translator = translators[currentLocale];
        if (!translator) {
            console.warn(`No translator found for locale: ${currentLocale}`);
            return text;
        }
        const result = translator.translate(text);
        // Debug: log first translation to verify it's working
        if (!this._hasLoggedTranslation) {
            console.log(`Translation test (locale: ${currentLocale}):`, text, '->', result);
            this._hasLoggedTranslation = true;
        }
        return result;
    },

    /**
     * Get all supported language options
     * @returns {Object} Object with locale codes as keys
     */
    getLanguageOptions() {
        return LANGUAGE_OPTIONS;
    },

    /**
     * Get the display name for a locale
     * @param {string} locale - Locale code
     * @returns {string} Display name
     */
    getLanguageName(locale) {
        return LANGUAGE_OPTIONS[locale]?.name || locale;
    },

    /**
     * Clear translation caches for all locales
     */
    clearAllCaches() {
        Object.values(translators).forEach(translator => translator.clearCache());
    },

    getWarningForLocale(locale) {
        return LANGUAGE_OPTIONS[locale]?.warning || null;
    }
};

export default localeManager;
export { LANGUAGE_OPTIONS };
