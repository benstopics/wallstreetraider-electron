import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';

export const MILLION = 1000000;

export function formatCurrency(number) {
    return number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Function to return Preact string of string replace \n with <br />
export function renderMultilineText(text, options = { additionalDelimiters: [], render: null }) {
    if (!text) return '';

    const { additionalDelimiters, render } = options;

    // Combine newlines and additional delimiters into a single regex
    const regex = new RegExp(`(\\n${(additionalDelimiters ?? []).length > 0 ? '|' : ''}${(additionalDelimiters ?? []).join('|')})`, 'g');

    // Split the text while preserving delimiters and join with <br />
    const parts = text.split(regex).filter(Boolean);

    return parts.map(part => {
        if (render) {
            return render(part);
        }
        return part === '\n' ? html`<br />` : html`<span>${part}</span>`;
    })
}

export function parseHyperlink(line) {
    const match = line && line.match(/@(C|I|O|S)(\d{4})$/);
    if (!match) return null;
    return { type: match[1], id: parseInt(match[2], 10) };
}

export function renderLines(lines, onLink, renderExtras) {
    if (!lines) return html``;

    // Step 1: Strip hyperlinks and get clean lines
    const cleanedLines = lines.map(line => {
        const link = parseHyperlink(line);
        const clean = link ? line.slice(0, -7).trimEnd() : line;
        return { raw: line, clean, link };
    });

    // Step 2: Determine max clean line length
    const maxLength = Math.max(...cleanedLines.map(({ clean }) => clean.length));

    return html`<div class="whitespace-pre-wrap">
        ${cleanedLines.map(({ raw, clean, link }) => {
            if (clean === '') return ' ';

            const classes = link
                ? 'fixed-width cursor-pointer hover:bg-blue-900 text-blue-400'
                : 'fixed-width';

            const handler = link ? () => onLink && onLink(link) : null;

            // If extras will be rendered, pad line with spaces
            const padded = (renderExtras && link)
                ? clean.padEnd(maxLength, ' ')
                : clean;

            return html`<div class="flex flex-row">
                <div class=${classes} onClick=${handler}>
                    ${padded}
                </div>
                ${renderExtras && link && renderExtras(link)}
            </div>`;
        })}
    </div>`;
}

