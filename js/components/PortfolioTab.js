import { html, useMemo, useRef, useState } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
// Hedge Fund UI removed in this build (UI-only).
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import Modal from './Modal.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import { usePanelSelection } from '../hooks/usePanelSelection.js';

// Stop orders are managed centrally in api.js and checked on each gameState refresh.

function getCompanyPrice(company) {
    if (!company) return null;
    const keys = ['price', 'sharePrice', 'stockPrice', 'lastPrice', 'currentPrice', 'quotePrice'];
    for (const k of keys) {
        const v = company[k];
        if (typeof v === 'number' && Number.isFinite(v)) return v;
    }
    return null;
}


const Tab = Tabs.Tab;

function IndexPanel({ title, bondId, panelNumber, isSelected = false }) {
    const buttonProps = useActionButtonProps();
    const buyProps = bondId === api.TBOND_RATE_ID
        ? buttonProps.buyLongGovtBonds
        : buttonProps.buyShortGovtBonds;

    const borderStyle = isSelected
        ? 'outline: 2px solid rgba(96, 165, 250, 0.7); border-radius: 4px;'
        : '';

    const shiftBadge = panelNumber != null
        ? html`<span style="position:absolute;top:2px;left:4px;opacity:0.7;font-size:11px;z-index:1;">${panelNumber})</span>`
        : '';

    return html`
        <div class="flex flex-col w-full" style="position:relative;${borderStyle}">
            ${shiftBadge}
            <div class="flex flex-col" style="height: 100px">
                <${AssetPriceChart} chartTitle=${title} assetId=${bondId} />
            </div>
            <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                <${DisabledTooltipButton}
                    ...${buyProps}
                    label="Buy"
                    containerClass="flex-1"
                    buttonClass="mx-1 w-full"
                    hotkeyLetter="b"
                    isLineSelected=${isSelected}
                    lineNumber=${panelNumber}
                />
            </div>
        </div>
    `;
}

function PortfolioTab() {

    const portfolio = api.useGameStore(s => s.gameState.portfolio);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    const companyById = useMemo(() => {
        const m = new Map();
        for (const c of allCompanies) if (c && c.id != null) m.set(Number(c.id), c);
        return m;
    }, [allCompanies]);

    // Synthetic link matching for portfolio lines without @hyperlink markers.
    // Stock lines: known symbol followed by integer percentage (e.g. "ACME  10%")
    // Bond lines: "N.NN% of YYYY" pattern with issuer name at start
    const portfolioTextMatch = useMemo(() => {
        if (!allCompanies?.length) return undefined;
        const bySymbol = new Map();
        const byName = new Map();
        for (const c of allCompanies) {
            if (c?.symbol) bySymbol.set(c.symbol.trim(), c.id);
            if (c?.name) byName.set(c.name.trim(), c.id);
        }
        return (text) => {
            const stockMatch = text.match(/\b([A-Z]{1,5})\s+(-?\d+)%\s/);
            if (stockMatch) {
                const id = bySymbol.get(stockMatch[1]);
                if (id != null) return { type: parseInt(stockMatch[2]) < 0 ? 'S' : 'C', id };
            }
            if (/\d+\.\d+%\s+of\s+\d{4}/.test(text)) {
                const nameSection = text.substring(0, 26).trimEnd();
                const id = byName.get(nameSection);
                if (id != null) return { type: 'J', id };
                for (const [name, cId] of byName) {
                    if (nameSection.startsWith(name) || name.startsWith(nameSection)) return { type: 'J', id: cId };
                }
            }
            return null;
        };
    }, [allCompanies]);

    // Extras hotkey refs
    const extrasContainerRef = useRef(null);
    const scopeActiveRef = useRef(false);
    const [, setScopeRenderTick] = useState(0);
    // Hide company-only buttons when viewing a player (players are IDs 1-10, companies are 11-1600)
    const showCorpButtons = activeEntityNum > 10 || buttonProps.isActiveEntityETF;
    const barButtons = [
        buttonProps.buyStock,
        !showCorpButtons && buttonProps.sellStock,
        !showCorpButtons && buttonProps.shortStock,
        showCorpButtons && !buttonProps.isActiveEntityETF && { ...buttonProps.buyCorpBond, label: "Buy Bonds" },
        showCorpButtons && !buttonProps.isActiveEntityETF && { ...buttonProps.sellSubsidiaryStock, label: "Offer Stock for Sale" },
    ];
    const barCount = barButtons.filter(Boolean).length;

    // Panel selection: 2 bond panels after bar buttons
    const PANEL_COUNT = 2;
    const panelStartNumber = barCount + 1;
    const { selectedPanelNumber, shiftHeld, panelNumbers } =
        usePanelSelection({ panelCount: PANEL_COUNT, startNumber: panelStartNumber });

    // Holdings lines start after bar buttons + panels
    const extrasStartNumber = barCount + PANEL_COUNT + 1;

    return html`
            <div class="flex flex-col w-full h-full min-h-0">
                <${HotkeyButtonBar} buttons=${barButtons}
                    extrasContainerRef=${extrasContainerRef}
                    scopeActiveRef=${scopeActiveRef}
                    onScopeActiveChange=${() => setScopeRenderTick(n => n + 1)}
                    panelCount=${PANEL_COUNT}
                    class="flex flex-row items-center justify-start gap-2 mb-2" />
                <div class="flex flex-row flex-[1]">
                    <${IndexPanel} title="Long Bond" bondId=${api.TBOND_RATE_ID}
                        panelNumber=${panelStartNumber} isSelected=${selectedPanelNumber === panelStartNumber} />
                    <${IndexPanel} title="Short Bond" bondId=${api.SBOND_RATE_ID}
                        panelNumber=${panelStartNumber + 1} isSelected=${selectedPanelNumber === panelStartNumber + 1} />
                </div>
                <div ref=${extrasContainerRef} class="flex flex-col items-center flex-[3] overflow-y-auto min-h-0">
                    ${renderLines(portfolio,
                        ({ id }) => id && api.setViewAsset(id),
                        ({ type, id, text, extrasCounter, isLineSelected, lineNumber }) => {
                            // Select appropriate button props based on type, override onClick with specific id
                            const sellButtonBase = type === "S" ? buttonProps.coverShort
                                : type === "J" ? buttonProps.sellCorpBond
                                : type === "GS" ? buttonProps.sellShortGovtBonds
                                : type === "GL" ? buttonProps.sellLongGovtBonds
                                : buttonProps.sellStock;

                            const sellIdx = extrasCounter ? extrasCounter.current++ : null;
                            const isStockType = !['J', 'GL', 'GS', 'S'].includes(type);
                            const showSpinOff = showCorpButtons && !buttonProps.isActiveEntityETF && isStockType;
                            const showBuyMore = !showCorpButtons && isStockType;
                            const extraBtnIdx = (showSpinOff || showBuyMore) && extrasCounter ? extrasCounter.current++ : null;

                            return html`<div class="flex flex-row stop-btn-row">
                                <${DisabledTooltipButton}
                                    ...${sellButtonBase}
                                    onClick=${() => (type === "S" ? api.coverShortStock
                                        : type === "J" ? api.sellCorporateBond
                                        : type === "GS" ? api.sellShortGovtBonds
                                        : type === "GL" ? api.sellLongGovtBonds
                                        : api.sellStock
                                    )(id)}
                                    label="${type === "S" ? "Cover" : "Sell"}"
                                    extrasIndex=${sellIdx}
                                    scopeActive=${scopeActiveRef.current}
                                    hotkeyLetter="s"
                                    isLineSelected=${isLineSelected}
                                    lineNumber=${lineNumber}
                                />
                                ${showSpinOff ? html`<${DisabledTooltipButton}
                                    ...${buttonProps.spinOff}
                                    onClick=${() => api.spinOff(id)}
                                    extrasIndex=${extraBtnIdx}
                                    scopeActive=${scopeActiveRef.current}
                                    hotkeyLetter="o"
                                    isLineSelected=${isLineSelected}
                                    lineNumber=${lineNumber}
                                />` : ''}
                                ${showBuyMore ? html`<${DisabledTooltipButton}
                                    ...${buttonProps.buyStock}
                                    onClick=${() => api.buyStock(id)}
                                    label="Buy More"
                                    extrasIndex=${extraBtnIdx}
                                    scopeActive=${scopeActiveRef.current}
                                    hotkeyLetter="b"
                                    isLineSelected=${isLineSelected}
                                    lineNumber=${lineNumber}
                                />` : ''}
                            </div>`
                        }, hyperlinkRegex, portfolioTextMatch, extrasStartNumber, scopeActiveRef, panelNumbers)}
                </div>
            </div>
    `;
}

export default PortfolioTab;