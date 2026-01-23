import { html } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols } from './helpers.js';

/**
 * Button component that processes children through insertCurrencySymbols
 * for currency symbol replacement and translation/localization.
 *
 * @param {Object} props - All props are passed through to the button element
 * @param {any} props.children - Button content to be processed
 */
export default function Button({ children, ...props }) {
    // Process children through insertCurrencySymbols
    const processChildren = (child) => {
        if (typeof child === 'string') {
            return insertCurrencySymbols(child);
        }
        if (Array.isArray(child)) {
            return child.map(processChildren);
        }
        // For non-string children (e.g., other elements), return as-is
        return child;
    };

    const processedChildren = processChildren(children);

    return html`<button ...${props}>${processedChildren}</button>`;
}
