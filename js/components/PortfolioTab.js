import { html, useMemo, useState } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
// Hedge Fund UI removed in this build (UI-only).
import Tooltip from './Tooltip.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import Modal from './Modal.js';
import Button from './Button.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';

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

function IndexPanel({ title, bondId }) {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies);
    const playerName = api.useGameStore(s => s.gameState.playerName) || 'Player';

    const buy = bondId === api.TBOND_RATE_ID ? api.buyLongGovtBonds : api.buyShortGovtBonds;

    const controlsActiveEntity = (controlledCompanies || []).some(c => c.id === activeEntityNum);

    const getDisabledInfo = () => {
        if (!actingAs) {
            return {
                message: controlsActiveEntity
                    ? `Must be acting as this company. Click to act as ${activeEntitySymbol}`
                    : "Must be acting as this company",
                onClick: controlsActiveEntity ? () => api.changeActingAs(activeEntityNum) : null
            };
        }
        if (![api.PLAYER_IND, api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)) {
            return {
                message: `Only players, banks, and insurance companies can trade government bonds. Click to act as ${playerName}`,
                onClick: () => api.changeActingAs(api.HUMAN1_ID)
            };
        }
        return { message: false, onClick: null };
    };

    const disabledInfo = getDisabledInfo();

    return html`
        <div class="flex flex-col w-full">
            <div class="flex flex-col" style="height: 100px">
                ${html`<${AssetPriceChart} chartTitle=${title} assetId=${bondId} />`}
            </div>
            ${!disabledInfo.message
                ? html`
                <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                    <${Button} class="btn green flex-1 mx-1" onclick=${() => buy(bondId)}>Buy</button>
                </div>`
                : html`
                <${Tooltip} text=${disabledInfo.message}>
                    <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                        <${Button} class="btn disabled flex-1 mx-1" onclick=${disabledInfo.onClick}>Buy</button>
                    </div>
                <//>
            `}
        </div>
    `;
}

function PortfolioTab() {

    const portfolio = api.useGameStore(s => s.gameState.portfolio);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies) || [];

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    const companyById = useMemo(() => {
        const m = new Map();
        for (const c of allCompanies) if (c && c.id != null) m.set(Number(c.id), c);
        return m;
    }, [allCompanies]);

    return html`
            <div class="flex flex-col w-full h-full min-h-0">
                <div class="flex flex-row items-center justify-start gap-2 mb-2">
                    <${DisabledTooltipButton} ...${buttonProps.buyStock} />
                    <${DisabledTooltipButton} ...${buttonProps.shortStock} />
                    ${!buttonProps.isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.buyCorpBond} label="Buy Bonds" />` : ''}
                    ${!buttonProps.isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.merger} label="Merge With" />` : ''}
                    ${!buttonProps.isActiveEntityETF ? html`<${DisabledTooltipButton} ...${buttonProps.sellSubsidiaryStock} label="Offer Stock for Sale" />` : ''}
                </div>
                <div class="flex flex-row flex-[1]">
                    <${IndexPanel} title="Long Bond" bondId=${api.TBOND_RATE_ID} />
                    <${IndexPanel} title="Short Bond" bondId=${api.SBOND_RATE_ID} />
                </div>
                <div class="flex flex-col items-center flex-[3] overflow-y-auto min-h-0">
                    ${renderLines(portfolio,
                        ({ id }) => id && api.setViewAsset(id),
                        ({ type, id, text }) => {
                            // Select appropriate button props based on type, override onClick with specific id
                            const sellButtonBase = type === "S" ? buttonProps.coverShort
                                : type === "J" ? buttonProps.sellCorpBond
                                : type === "GS" ? buttonProps.sellShortGovtBonds
                                : type === "GL" ? buttonProps.sellLongGovtBonds
                                : buttonProps.sellStock;

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
                                />
                                ${!buttonProps.isActiveEntityETF && !text.includes('GOVERNMENT') ? html`<${DisabledTooltipButton}
                                    ...${buttonProps.spinOff}
                                    onClick=${() => api.spinOff(id)}
                                />` : ''}
                            </div>`
                        }, hyperlinkRegex)}
                </div>
            </div>
    `;
}

export default PortfolioTab;