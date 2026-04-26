import { html } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import localeManager, { LANGUAGE_OPTIONS } from '../locale/localeManager.js';

// Convert LANGUAGE_OPTIONS to array format for dropdown
const LANGUAGES = Object.entries(LANGUAGE_OPTIONS).map(([code, config]) => ({
    code,
    label: config.name
}));

const LocalizationDropdown = ({ onChange = () => {} }) => {
    // Source of truth is gameState.locale (broadcast from PB). Falls back to
    // 'en-US' until first broadcast arrives.
    const selectedLocale = api.useGameStore(s => s.gameState?.locale || 'en-US');

    const handleChange = (event) => {
        const newLocale = event.target.value;
        if (!LANGUAGE_OPTIONS[newLocale] || newLocale === selectedLocale) return;

        // Push to PB (which persists via WriteConfig). Reload after a brief
        // delay so the persisted value is in flight before module-level
        // translators re-init from a fresh import.
        localeManager.setCurrentLocale(newLocale);
        onChange(newLocale);
        setTimeout(() => window.location.reload(), 100);
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
