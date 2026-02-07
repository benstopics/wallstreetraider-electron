import { html, useRef, useState } from '../lib/preact.standalone.module.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';


function IndexPanel({ title, bondId }) {
    const buttonProps = useActionButtonProps();
    const buyProps = bondId === api.TBOND_RATE_ID
        ? buttonProps.buyLongGovtBonds
        : buttonProps.buyShortGovtBonds;

    return html`
        <div class="flex flex-col w-full">
            <div class="flex flex-col" style="height: 100px">
                ${html`<${AssetPriceChart} chartTitle=${title} assetId=${bondId} />`}
            </div>
            <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                <${DisabledTooltipButton}
                    ...${buyProps}
                    label="Buy"
                    containerClass="flex-1"
                    buttonClass="mx-1 w-full"
                />
            </div>
        </div>
    `;
}

function InterestRateSwapsTab() {

    const swapsPortfolio = api.useGameStore(s => s.gameState.swapsPortfolio);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    // Get disabled message and click handler from hook for dynamic buttons
    const actingAsDisabledMessage = buttonProps.mustActAsCompanyMessage;
    const handleActAsClick = buttonProps.onMustActAsCompanyClick;

    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    // Hide company-only buttons when viewing a player (activeEntityNum < 10)
    const showCorpButtons = activeEntityNum >= 10 || buttonProps.isActiveEntityETF;

    // Extras hotkey refs
    const extrasContainerRef = useRef(null);
    const scopeActiveRef = useRef(false);
    const [, setScopeRenderTick] = useState(0);
    const barButtons = [
        showCorpButtons && !buttonProps.isActiveEntityETF && { ...buttonProps.interestRateSwaps, label: "Create New Swap" },
    ];
    const extrasStartNumber = barButtons.filter(Boolean).length + 1;

    return html`
            <div class="flex flex-col w-full h-full min-h-0">
                <${HotkeyButtonBar} buttons=${barButtons}
                    extrasContainerRef=${extrasContainerRef}
                    scopeActiveRef=${scopeActiveRef}
                    onScopeActiveChange=${() => setScopeRenderTick(n => n + 1)}
                    class="flex flex-row items-center justify-start gap-5" style="" />
                <div class="flex flex-row flex-[1]">
                    <${IndexPanel} title="Long Bond Rate" bondId=${api.TBOND_RATE_ID} />
                    <${IndexPanel} title="Short Bond Rate" bondId=${api.SBOND_RATE_ID} />
                    <${IndexPanel} title="Prime Rate" bondId=${api.PRIME_RATE_ID} />
                </div>
                <div ref=${extrasContainerRef} class="flex flex-col items-center flex-[3] overflow-y-auto min-h-0">
                    ${renderLines(swapsPortfolio,
                        ({ id }) => id && api.setViewAsset(id),
                        ({ id, extrasCounter, isLineSelected, lineNumber }) => {
                            const detailsIdx = extrasCounter ? extrasCounter.current++ : null;
                            const terminateIdx = extrasCounter ? extrasCounter.current++ : null;
                            return html`<div class="flex flex-row">
                            <${DisabledTooltipButton}
                                disabledMessage=${false}
                                onClick=${() => api.viewSwapDetails(id)}
                                label="Details"
                                color="blue"
                                extrasIndex=${detailsIdx}
                                scopeActive=${scopeActiveRef.current}
                                hotkeyLetter="d"
                                isLineSelected=${isLineSelected}
                                lineNumber=${lineNumber}
                            />
                            <${DisabledTooltipButton}
                                disabledMessage=${actingAsDisabledMessage}
                                onClick=${() => api.terminateSwap(id)}
                                onDisabledClick=${handleActAsClick}
                                label="Terminate"
                                color="red"
                                extrasIndex=${terminateIdx}
                                scopeActive=${scopeActiveRef.current}
                                hotkeyLetter="t"
                                isLineSelected=${isLineSelected}
                                lineNumber=${lineNumber}
                            />
                        </div>`;
                        }, hyperlinkRegex, undefined, extrasStartNumber, scopeActiveRef)}
                </div>
            </div>
    `;
}

export default InterestRateSwapsTab;
