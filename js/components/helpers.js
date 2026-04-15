import { html, render, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { gameStore } from '../api.js';
import localeManager from '../locale/localeManager.js';

export const MILLION = 1000000;

// Letter hotkey button
export function LetterHotkeyButton({ class: className, onClick, label }) {
    return html`<button class=${className} onClick=${onClick}>${label}</button>`;
}

// Letter hotkey label - shows label
export function LetterHotkeyLabel({ label }) {
    return label;
}

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
    return localeManager.translate(text).split(regex).filter(Boolean);
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
    let result = localeManager.translate(text) || '';

    // Get currency symbols from game state
    const gameState = gameStore.getState()?.gameState || {};
    const dlrSign = gameState.dlrSign || '$';
    const euro = gameState.euro || '';
    const mil = gameState.mil || 'M';

    // Replace dynamic currency markers with actual values
    result = result.replaceAll('@DLRSIGN', dlrSign);
    result = result.replaceAll('@EURO', euro);
    result = result.replaceAll('@MIL', mil);
    // @DENOMINATION maps "M" -> "Millions", "B" -> "Billions"
    result = result.replaceAll('@DENOMINATION', mil === 'B' ? 'Billions' : 'Millions');

    // Replace static currency symbols (legacy support)
    Object.entries(CURRENCY_SYMBOLS).forEach(([key, symbol]) => {
        result = result.replaceAll(key, symbol);
    });
    return result;
};

const CLICKABLE_LINE_CLASSES = 'fixed-width cursor-pointer text-blue-400 hover:bg-blue-700 rounded px-1';

function renderLine({ text, link }, maxLength, onLink, renderExtras, hyperlinkRegex, extrasCounter, selOpts) {
    if (text === '') return html`<div style="min-height:1.2em">\u00A0</div>`;

    const idFound = link?.id > 0 || (link?.id && link?.id.includes('|'));

    // Selection mode — all lines inside SelectableLines get selOpts for consistent alignment
    if (selOpts) {
        const { lineNumber, prefixWidth } = selOpts;
        const showNumbers = false;
        const prefixStyle = showNumbers
            ? `display:inline-block;min-width:${prefixWidth};text-align:right;margin-right:2px;`
            : '';
        const gutterStyle = 'border-left: 2px solid rgba(96, 165, 250, 0.3); padding-left: 4px;';

        // Non-selectable line (no lineNumber) — just render with blank gutter for alignment
        if (lineNumber == null) {
            return html`<div class="flex flex-row">
                <div class="fixed-width" style="border-left: 2px solid transparent; padding-left: 4px;">
                    <span style="${prefixStyle}"></span>${text}
                </div>
            </div>`;
        }

        // Clickable line — always show active style, single click navigates
        const classes = idFound
            ? CLICKABLE_LINE_CLASSES
            : 'fixed-width';
        const handler = idFound ? () => { onLink && onLink(link); } : null;
        const padded = (renderExtras && link) ? text.padEnd(maxLength, ' ') : text;
        const prefix = showNumbers
            ? html`<span style="${prefixStyle};opacity:0.7;">${lineNumber})</span>`
            : '';

        return html`<div class="flex flex-row">
            <div class=${classes} style="${gutterStyle}" onClick=${handler}>
                ${prefix}${padded}
            </div>
            ${renderExtras && link && renderExtras({ ...link, text, extrasCounter, isLineSelected: true, lineNumber })}
        </div>`;
    }

    // Original behavior (no selection mode)
    const classes = idFound && onLink
        ? CLICKABLE_LINE_CLASSES
        : 'fixed-width';

    const handler = idFound ? () => onLink && onLink(link) : null;

    // If extras will be rendered, pad line with spaces
    const padded = (renderExtras && link)
        ? text.padEnd(maxLength, ' ')
        : idFound ? text : (hyperlinkRegex ? api.renderHyperlinks(text, ({ id, type }) => {
            if (type === 'C') api.setViewAsset(id);
            else if (type === 'I') api.viewIndustry(id);
        }, hyperlinkRegex) : text);

    return html`<div class="flex flex-row">
            <div class=${classes} onClick=${handler}>
                ${padded}
            </div>
            ${renderExtras && link && renderExtras({ ...link, text, extrasCounter })}
        </div>`;
}

function SelectableLines({ cleanedLines, maxLength, onLink, renderExtras, hyperlinkRegex, extrasStartNumber, scopeActiveRef }) {
    const lineMapRef = useRef(new Map());
    const onLinkRef = useRef(onLink);
    onLinkRef.current = onLink;

    // Assign line numbers to hyperlink lines
    lineMapRef.current = new Map();
    let lineCounter = extrasStartNumber;
    const numberedLines = cleanedLines.map(line => {
        if (line.link) {
            const lineNumber = lineCounter++;
            lineMapRef.current.set(lineNumber, line);
            return { ...line, lineNumber };
        }
        return { ...line, lineNumber: null };
    });

    // Compute consistent prefix width based on the max line number
    const maxLineNum = lineCounter - 1;
    const prefixWidth = (String(maxLineNum).length + 1) + 'ch'; // digits + paren

    return html`<div class="whitespace-pre-wrap flex flex-col">
        ${numberedLines.map(line => {
            const selOpts = {
                lineNumber: line.lineNumber,
                prefixWidth
            };

            return renderLine(
                line, maxLength, onLink,
                renderExtras,
                hyperlinkRegex,
                null,
                selOpts
            );
        })}
    </div>`;
}

export function renderLines(lines, onLink, renderExtras, hyperlinkRegex, textMatch, extrasStartNumber, scopeActiveRef) {
    if (!lines) return html``;

    // Step 1: Strip hyperlinks and get clean lines
    const cleanedLines = lines.map(line => {
        const link = parseHyperlink(localeManager.translate(line));
        let clean = line;
        clean = insertCurrencySymbols(clean);
        clean = link ? clean.slice(0, clean.indexOf('@')).trimEnd() : clean;
        // If no hyperlink found, check textMatch for synthetic link (enables renderExtras on text-matched lines)
        const effectiveLink = link || (textMatch && textMatch(clean));
        return { text: clean, link: effectiveLink };
    });

    // Step 2: Determine max clean line length
    const maxLength = Math.max(...cleanedLines.map(({ text }) => text.length));

    if (!onLink && !renderExtras && !hyperlinkRegex) {
        return html`<div class="whitespace-pre-wrap flex flex-col">
            ${cleanedLines.map(({ text }) => {
                if (text === '') return html`<div style="min-height:1.2em">\u00A0</div>`;
                return html`<div>${text}</div>`;
            })}
        </div>`;
    }

    // If start number is provided, use SelectableLines for number+ENTER selection behavior
    if (typeof extrasStartNumber === 'number') {
        return html`<${SelectableLines}
            cleanedLines=${cleanedLines}
            maxLength=${maxLength}
            onLink=${onLink}
            renderExtras=${renderExtras}
            hyperlinkRegex=${hyperlinkRegex}
            extrasStartNumber=${extrasStartNumber}
            scopeActiveRef=${scopeActiveRef}
        />`;
    }

    const extrasCounter = typeof extrasStartNumber === 'number' ? { current: extrasStartNumber } : null;

    return html`<div class="whitespace-pre-wrap flex flex-col">
        ${cleanedLines.map(cleanedLine =>
            renderLine(cleanedLine, maxLength, onLink, renderExtras, hyperlinkRegex, extrasCounter)
        )}
    </div>`;
}

