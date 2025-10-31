import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';

export const MILLION = 1000000;

export function formatCurrency(number) {
    return number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Function to return Preact string of string replace \n with <br />
export function getMultilineTextLines(text, additionalDelimiters = []) {
    // Combine newlines and additional delimiters into a single regex
    const regex = new RegExp(`(\\n${additionalDelimiters.length > 0 ? '|' : ''}${additionalDelimiters.join('|')})`, 'g');

    // Split the text while preserving delimiters
    return text.split(regex).filter(Boolean);
}

export function renderMultilineText(text, options = { additionalDelimiters: [], render: null }) {
    if (!text) return '';

    const { additionalDelimiters, render } = options;

    // Get multiline text lines using the helper function
    const parts = getMultilineTextLines(text, additionalDelimiters);

    return parts.map(part => {
        if (render) {
            return render(part);
        }
        return part === '\n' ? html`<br />` : html`<span>${part}</span>`;
    });
}

export function parseHyperlink(line) {
    const match = line && line.match(/@([A-Z]+)(\d*(\|\d+)*)$/);
    if (!match) return null;
    const value = match[2];
    return { type: match[1], id: value.includes('|') ? value : parseInt(value, 10) };
}

const CURRENCY_SYMBOLS = {
    "@UK": "£",
    "@EUR": "€",
    "@JAP": "¥",
    "@KOR": "₩",
    "@IND": "₹",
    "@CNY": "¥",
    "@ISR": "₪",
    "@EGY": "E£"
};

export const insertCurrencySymbols = (text) => {
    let result = text || '';
    Object.entries(CURRENCY_SYMBOLS).forEach(([key, symbol]) => {
        result = result.replaceAll(key, symbol);
    });
    return result;
};

export function renderLines(allCompanies, allIndustries, lines, onLink, renderExtras) {
    if (!lines) return html``;

    // Step 1: Strip hyperlinks and get clean lines
    const cleanedLines = lines.map(line => {
        const link = parseHyperlink(line);
        let clean = line;
        clean = insertCurrencySymbols(clean);
        clean = link ? clean.slice(0, clean.indexOf('@')).trimEnd() : clean;
        return { raw: line, text: clean, link };
    });

    // Step 2: Determine max clean line length
    const maxLength = Math.max(...cleanedLines.map(({ text }) => text.length));

    return html`<div class="whitespace-pre-wrap">
        ${cleanedLines.map(({ raw, text, link }) => {
        if (text === '') return ' ';

        const idFound = link?.id > 0 || (link?.id && link?.id.includes('|'));

        const classes = idFound && onLink
            ? 'fixed-width cursor-pointer hover:bg-blue-900 text-blue-400'
            : 'fixed-width';

        const handler = idFound ? () => onLink && onLink(link) : null;

        // If extras will be rendered, pad line with spaces
        const padded = (renderExtras && link)
            ? text.padEnd(maxLength, ' ')
            : idFound ? text : api.renderHyperlinks(text, allCompanies, allIndustries, ({ id, type }) => {
                if (type === 'C') api.setViewAsset(id);
                else if (type === 'I') api.viewIndustry(id);
            });

        return html`<div class="flex flex-row">
                <div class=${classes} onClick=${handler}>
                    ${padded}
                </div>
                ${renderExtras && link && renderExtras({ ...link, text })}
            </div>`;
    })}
    </div>`;
}

