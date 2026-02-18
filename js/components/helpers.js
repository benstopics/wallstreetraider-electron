import { html, render, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { gameStore } from '../api.js';
import localeManager from '../locale/localeManager.js';
import { tabNumberLabel, bracketLabel, isHotkeysVisualDisabled } from '../hotkeys.js';
import { isEditableTarget } from '../keybinds.js';
import { useHotkey } from '../hooks/useHotkey.js';
import { PRIORITY, hotkeyManager } from '../hotkeyManager.js';

export const MILLION = 1000000;

// Letter hotkey button - listens for letter hotkey events and triggers onClick
export function LetterHotkeyButton({ class: className, onClick, label, letter, isLineSelected, lineNumber }) {
    const onClickRef = useRef(onClick);
    onClickRef.current = onClick;

    useEffect(() => {
        if (!letter || !isLineSelected) return;

        const handler = (e) => {
            if (e.detail?.lineNumber !== lineNumber) return;
            if (e.detail?.letter !== letter.toLowerCase()) return;
            if (onClickRef.current) onClickRef.current();
        };
        document.addEventListener('hotkey-extras-letter', handler);
        return () => document.removeEventListener('hotkey-extras-letter', handler);
    }, [letter, isLineSelected, lineNumber]);

    const displayLabel = isLineSelected && letter
        ? bracketLabel(label, letter)
        : label;

    return html`<button class=${className} onClick=${onClick}>${displayLabel}</button>`;
}

// Letter hotkey label - shows bracketed letter when line is selected
export function LetterHotkeyLabel({ label, letter, lineNumber }) {
    return bracketLabel(label, letter);
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

function renderLine({ text, link }, maxLength, onLink, renderExtras, hyperlinkRegex, extrasCounter, selOpts) {
    if (text === '') return html`<div>\u00A0</div>`;

    const idFound = link?.id > 0 || (link?.id && link?.id.includes('|'));

    // Selection mode — all lines inside SelectableLines get selOpts for consistent alignment
    if (selOpts) {
        const { lineNumber, isSelected, anySelected, onSelect, scopeActive, prefixWidth } = selOpts;
        const showNumbers = scopeActive && !isHotkeysVisualDisabled();
        const prefixStyle = showNumbers
            ? `display:inline-block;min-width:${prefixWidth};text-align:right;margin-right:2px;`
            : '';
        const gutterStyle = 'border-left: 2px solid transparent; padding-left: 4px;';

        // Non-selectable line (no lineNumber) — just render with blank gutter for alignment
        if (lineNumber == null) {
            return html`<div class="flex flex-row">
                <div class="fixed-width" style="${gutterStyle}">
                    <span style="${prefixStyle}"></span>${text}
                </div>
            </div>`;
        }

        if (isSelected) {
            // Selected line - highlighted, extras shown, click navigates
            const classes = idFound
                ? 'fixed-width cursor-pointer text-blue-400'
                : 'fixed-width';
            const handler = idFound ? () => {
                onLink && onLink(link);
                onSelect(null);
            } : null;
            const padded = text.padEnd(maxLength, ' ');
            const prefix = showNumbers
                ? html`<span style="${prefixStyle};opacity:0.7;">${lineNumber})</span>`
                : '';

            return html`<div class="flex flex-row" style="background:rgba(255,255,255,0.15);outline:1px solid rgba(255,255,255,0.3);border-radius:2px;">
                <div class=${classes} style="${gutterStyle}" onClick=${handler}>
                    ${prefix}${padded}
                </div>
                ${renderExtras && link && renderExtras({ ...link, text, extrasCounter, isLineSelected: true, lineNumber })}
            </div>`;
        } else {
            // Not selected - clickable to select, show number prefix
            const prefix = showNumbers
                ? html`<span style="${prefixStyle};opacity:0.45;">${lineNumber})</span>`
                : '';
            const extrasIdx = !anySelected ? lineNumber : null;
            const handler = () => onSelect(lineNumber);
            const padded = (renderExtras && link) ? text.padEnd(maxLength, ' ') : text;

            return html`<div class="flex flex-row">
                <div class="fixed-width cursor-pointer hover:bg-blue-900"
                     style="border-left: 2px solid rgba(96, 165, 250, 0.3); padding-left: 4px;"
                     onClick=${handler} data-extras-idx=${extrasIdx}>
                    ${prefix}${padded}
                </div>
                ${renderExtras && link && renderExtras({ ...link, text, extrasCounter, isLineSelected: false, lineNumber })}
            </div>`;
        }
    }

    // Original behavior (no selection mode)
    const classes = idFound && onLink
        ? 'fixed-width cursor-pointer hover:bg-blue-900 text-blue-400'
        : 'fixed-width';

    const handler = idFound ? () => onLink && onLink(link) : null;

    // If extras will be rendered, pad line with spaces
    const padded = (renderExtras && link)
        ? text.padEnd(maxLength, ' ')
        : idFound ? text : api.renderHyperlinks(text, ({ id, type }) => {
            if (type === 'C') api.setViewAsset(id);
            else if (type === 'I') api.viewIndustry(id);
        }, hyperlinkRegex);

    return html`<div class="flex flex-row">
            <div class=${classes} onClick=${handler}>
                ${padded}
            </div>
            ${renderExtras && link && renderExtras({ ...link, text, extrasCounter })}
        </div>`;
}

function SelectableLines({ cleanedLines, maxLength, onLink, renderExtras, hyperlinkRegex, extrasStartNumber, scopeActiveRef, additionalValidNumbers }) {
    const [selectedLineNum, setSelectedLineNum] = useState(null);
    const lineMapRef = useRef(new Map());
    const onLinkRef = useRef(onLink);
    const selectedRef = useRef(null);
    const validLinesRef = useRef(new Set());
    onLinkRef.current = onLink;

    // Assign line numbers to hyperlink lines and build validLines set
    lineMapRef.current = new Map();
    const validLines = new Set();
    let lineCounter = extrasStartNumber;
    const numberedLines = cleanedLines.map(line => {
        if (line.link) {
            const lineNumber = lineCounter++;
            lineMapRef.current.set(lineNumber, line);
            validLines.add(lineNumber);
            return { ...line, lineNumber };
        }
        return { ...line, lineNumber: null };
    });

    // Merge panel numbers (additionalValidNumbers) into validLines for digit routing
    const allValidLines = new Set(validLines);
    if (additionalValidNumbers) {
        for (const n of additionalValidNumbers) allValidLines.add(n);
    }

    // Check if validLines actually changed (compare contents, not reference)
    const validLinesChanged = allValidLines.size !== validLinesRef.current.size ||
        [...allValidLines].some(n => !validLinesRef.current.has(n));
    if (validLinesChanged) {
        validLinesRef.current = allValidLines;
    }

    // Check if selected line still exists in current data
    const anySelected = selectedLineNum != null && lineMapRef.current.has(selectedLineNum);
    const effectiveSelected = anySelected ? selectedLineNum : null;
    selectedRef.current = effectiveSelected;

    // Create extrasCounter only for the selected line
    const extrasCounter = anySelected ? { current: extrasStartNumber } : null;

    const immediateCount = extrasStartNumber - 1;

    // Update validLines in the centralized manager when they change
    useEffect(() => {
        if (validLinesChanged) {
            hotkeyManager.update(hotkeyIdRef.current, { meta: { validLines: validLinesRef.current } });
        }
    }, [validLinesChanged]);

    // Listen for hotkey-line-select events (immediate selection from app.js)
    useEffect(() => {
        const handler = (e) => {
            const lineNumber = e.detail?.lineNumber;
            if (typeof lineNumber !== 'number') return;
            if (lineMapRef.current.has(lineNumber)) {
                setSelectedLineNum(lineNumber);
            } else {
                // Number is not one of our lines (e.g. a panel) — deselect for mutual exclusion
                setSelectedLineNum(null);
            }
        };
        document.addEventListener('hotkey-line-select', handler);
        return () => document.removeEventListener('hotkey-line-select', handler);
    }, []);

    // Stable ID for hotkey registration
    const hotkeyIdRef = useRef(Symbol('selectable-lines-hotkey'));

    // Centralized hotkey handler for ESC, Enter, and letter keys when a line is selected.
    // Registered at PRIORITY.LINE_SELECTION so it takes precedence over TABS and GLOBAL.
    // meta.claimsLetters tells Tabs to show suppressed visual state.
    useHotkey(
        hotkeyIdRef.current,
        PRIORITY.LINE_SELECTION,
        (e) => {
            if (selectedRef.current === null) return false;
            // Don't intercept keys when user is typing in an input/textarea
            if (isEditableTarget(e.target)) return false;
            if (e.key === 'Escape' || e.key === 'Enter') return true;
            // Match unmodified letters (allow shift for capitals)
            if (!e.altKey && !e.ctrlKey && !e.metaKey && /^[a-z]$/i.test(e.key)) return true;
            return false;
        },
        (e) => {
            if (e.key === 'Escape') {
                e.stopImmediatePropagation();
                e.preventDefault();
                setSelectedLineNum(null);
                return true;
            }

            if (e.key === 'Enter') {
                const line = lineMapRef.current.get(selectedRef.current);
                if (line && onLinkRef.current) {
                    const lid = line.link?.id;
                    const hasId = lid > 0 || (lid && lid.includes?.('|'));
                    if (hasId) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        onLinkRef.current(line.link);
                        setSelectedLineNum(null);
                        return true;
                    }
                }
                return false;
            }

            // Letter keys → dispatch to extras buttons on the selected line
            const key = e.key.toLowerCase();
            if (/^[a-z]$/.test(key)) {
                e.stopImmediatePropagation();
                e.preventDefault();
                document.dispatchEvent(new CustomEvent('hotkey-extras-letter', {
                    detail: { letter: key, lineNumber: selectedRef.current }
                }));
                return true;
            }

            return false;
        },
        { active: validLinesRef.current.size > 0, meta: { claimsLetters: anySelected, lineSelectMode: validLinesRef.current.size > 0, validLines: validLinesRef.current, immediateCount } },
        [anySelected, immediateCount, validLinesRef.current.size]
    );

    const onSelect = (lineNum) => setSelectedLineNum(lineNum);

    // Always show active state (line numbers, prefixes) when mounted
    const showActive = true;

    // Compute consistent prefix width based on the max line number
    const maxLineNum = lineCounter - 1;
    const prefixWidth = (String(maxLineNum).length + 1) + 'ch'; // digits + paren

    return html`<div class="whitespace-pre-wrap flex flex-col">
        ${numberedLines.map(line => {
            const isLineSelected = line.lineNumber === effectiveSelected;
            const selOpts = {
                lineNumber: line.lineNumber,
                isSelected: isLineSelected,
                anySelected,
                onSelect,
                scopeActive: showActive,
                prefixWidth
            };

            return renderLine(
                line, maxLength, onLink,
                renderExtras,
                hyperlinkRegex,
                isLineSelected ? extrasCounter : null,
                selOpts
            );
        })}
    </div>`;
}

export function renderLines(lines, onLink, renderExtras, hyperlinkRegex, textMatch, extrasStartNumber, scopeActiveRef, additionalValidNumbers) {
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

    if ((!onLink && !renderExtras) || !hyperlinkRegex) {
        return html`<div class="whitespace-pre-wrap flex flex-col">
            ${cleanedLines.map(({ text }) => {
                if (text === '') return html`<div>\u00A0</div>`;
                return html`<div>${text}</div>`;
            })}
        </div>`;
    }

    // If renderExtras is provided with start number, use SelectableLines for selection behavior
    if (renderExtras && typeof extrasStartNumber === 'number') {
        return html`<${SelectableLines}
            cleanedLines=${cleanedLines}
            maxLength=${maxLength}
            onLink=${onLink}
            renderExtras=${renderExtras}
            hyperlinkRegex=${hyperlinkRegex}
            extrasStartNumber=${extrasStartNumber}
            scopeActiveRef=${scopeActiveRef}
            additionalValidNumbers=${additionalValidNumbers}
        />`;
    }

    const extrasCounter = typeof extrasStartNumber === 'number' ? { current: extrasStartNumber } : null;

    return html`<div class="whitespace-pre-wrap flex flex-col">
        ${cleanedLines.map(cleanedLine =>
            renderLine(cleanedLine, maxLength, onLink, renderExtras, hyperlinkRegex, extrasCounter)
        )}
    </div>`;
}

