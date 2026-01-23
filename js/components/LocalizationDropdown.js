import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import localeManager, { LANGUAGE_OPTIONS } from '../locale/localeManager.js';

// Convert LANGUAGE_OPTIONS to array format for dropdown
const LANGUAGES = Object.entries(LANGUAGE_OPTIONS).map(([code, config]) => ({
    code,
    label: config.name
}));

const STORAGE_KEY = 'wsr_locale';

const getStoredLocale = () => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
        console.error('Error reading locale from localStorage:', e);
        return null;
    }
};

const setStoredLocale = (value) => {
    try {
        localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
        console.error('Error saving locale to localStorage:', e);
    }
};

const LocalizationDropdown = ({ onChange = () => {} }) => {
    const [selectedLocale, setSelectedLocale] = useState('en-US');

    useEffect(() => {
        // Sync with localeManager's current locale
        const currentLocale = localeManager.getCurrentLocale();
        console.log('LocalizationDropdown mounted. Current locale from manager:', currentLocale);

        const savedLocale = getStoredLocale();
        console.log('LocalizationDropdown stored value:', savedLocale);

        if (savedLocale && LANGUAGES.some(lang => lang.code === savedLocale)) {
            setSelectedLocale(savedLocale);
            // Ensure localeManager is also set to this locale
            if (currentLocale !== savedLocale) {
                console.log('Syncing localeManager to stored value:', savedLocale);
                localeManager.setCurrentLocale(savedLocale);
            }
        } else if (currentLocale) {
            // Use localeManager's current locale if no valid stored value
            setSelectedLocale(currentLocale);
        }
    }, []);

    const handleChange = (event) => {
        const newLocale = event.target.value;
        console.log('Switching locale to:', newLocale);
        setSelectedLocale(newLocale);
        setStoredLocale(newLocale);

        // Verify storage was set
        const verifyLocale = getStoredLocale();
        console.log('Locale stored, verified value:', verifyLocale);

        localeManager.setCurrentLocale(newLocale);
        onChange(newLocale);

        // Use setTimeout to ensure storage is persisted before reload
        setTimeout(() => {
            console.log('Reloading page...');
            window.location.reload();
        }, 100);
    };

    return html`
        <select
            class="btn main-menu"
            value=${selectedLocale}
            onChange=${handleChange}
            style="cursor: pointer; padding: 0.5rem 0.75rem;"
        >
            ${LANGUAGES.map(lang => html`
                <option key=${lang.code} value=${lang.code}>
                    ${lang.label}
                </option>
            `)}
        </select>
    `;
};

export default LocalizationDropdown;
