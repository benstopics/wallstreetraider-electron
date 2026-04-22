import { html, useRef, useState } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';
import { usePanelSelection } from '../hooks/usePanelSelection.js';


const Tab = Tabs.Tab;

function IndexPanel({ title, commodityId, panelNumber, isSelected = false }) {
    const buttonProps = useActionButtonProps();
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);

    const activeEntityNum = buttonProps.activeEntityNum;
    const isActiveEntityETF = buttonProps.isActiveEntityETF && activeEntityNum !== api.CMOD_ID;
    const isCrypto = [api.BITCOIN_ID, api.ETHEREUM_ID].includes(commodityId);

    const buy = isCrypto ? api.buyPhysicalCrypto : api.buyPhysicalCommodity;
    const buyFutures = isCrypto ? api.buyCryptoFutures : api.buyCommodityFutures;
    const shortFutures = isCrypto ? api.sellCryptoFutures : api.shortCommodityFutures;

    const showBuyButton = commodityId !== api.STOCK_INDEX_ID;

    const buyDisabledInfo = {
        message: isActiveEntityETF ? (isCrypto ? "ETFs cannot trade cryptocurrencies" : "ETFs cannot trade physical commodities")
            : actingAsIndustryId === api.BANK_IND ? "Banks cannot trade commodities, indexes or crypto."
            : false
    };

    const buyFuturesDisabledInfo = {
        message: isActiveEntityETF ? (isCrypto ? "ETFs cannot trade cryptocurrency futures" : "ETFs cannot trade commodity futures")
            : actingAsIndustryId === api.BANK_IND ? "Banks cannot trade futures."
            : actingAsIndustryId === api.INSURANCE_IND && commodityId !== api.STOCK_INDEX_ID ? "Insurance companies can only trade stock index futures."
            : false
    };

    const shortFuturesDisabledInfo = {
        message: isActiveEntityETF ? (isCrypto ? "ETFs cannot trade cryptocurrency futures" : "ETFs cannot short futures")
            : actingAsIndustryId === api.BANK_IND ? "Banks cannot trade futures."
            : actingAsIndustryId === api.INSURANCE_IND ? "Insurance companies can only buy (long) stock index futures, not short."
            : false
    };

    const borderStyle = isSelected
        ? 'outline: 2px solid rgba(96, 165, 250, 0.7); border-radius: 4px;'
        : '';

    const shiftBadge = panelNumber != null
        ? html`<span style="position:absolute;top:2px;left:4px;opacity:0.7;font-size:11px;z-index:1;">${panelNumber})</span>`
        : '';

    const chartActionButtons = [
        showBuyButton && {
            label: 'Buy',
            onClick: () => buy(commodityId),
            color: 'green',
            disabledMessage: buyDisabledInfo.message,
        },
        {
            label: 'Buy Futures',
            onClick: () => buyFutures(commodityId),
            color: 'green',
            disabledMessage: buyFuturesDisabledInfo.message,
        },
        {
            label: 'Short Futures',
            onClick: () => shortFutures(commodityId),
            color: 'red',
            disabledMessage: shortFuturesDisabledInfo.message,
        },
    ].filter(Boolean);

    return html`
        <div class="flex flex-col w-full" style="position:relative;${borderStyle}">
            ${shiftBadge}
            <div class="flex flex-col" style="height: 100px">
                <${AssetPriceChart} chartTitle=${title} assetId=${commodityId} actionButtons=${chartActionButtons} />
            </div>
            <div class="flex flex-row justify-around mt-2 w-full" style="height:25px">
                ${showBuyButton ? html`<${DisabledTooltipButton}
                    disabledMessage=${buyDisabledInfo.message}
                    onClick=${() => buy(commodityId)}
                    label="Buy"
                    color="green"
                    containerClass="flex-1"
                    buttonClass="w-full mx-1"
                    hotkeyLetter="b"
                    isLineSelected=${isSelected}
                    lineNumber=${panelNumber}
                />` : ''}
                <${DisabledTooltipButton}
                    disabledMessage=${buyFuturesDisabledInfo.message}
                    onClick=${() => buyFutures(commodityId)}
                    label="Buy Futures"
                    color="green"
                    containerClass="flex-1"
                    buttonClass="w-full mx-1"
                    hotkeyLetter="f"
                    isLineSelected=${isSelected}
                    lineNumber=${panelNumber}
                />
                <${DisabledTooltipButton}
                    disabledMessage=${shortFuturesDisabledInfo.message}
                    onClick=${() => shortFutures(commodityId)}
                    label="Short Futures"
                    color="red"
                    containerClass="flex-1"
                    buttonClass="w-full mx-1"
                    hotkeyLetter="s"
                    isLineSelected=${isSelected}
                    lineNumber=${panelNumber}
                />
            </div>
        </div>
    `;
}

const getCellValues = (line) => {
    return line.split(' ').filter(s => s.trim() !== '');
}

const isContractShort = (line) => {
    return getCellValues(line)?.[3].startsWith('-')
}

function CommoditiesTab() {

    const commodityList = api.useGameStore(s => s.gameState.commodityList);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    // Extras hotkey refs
    const extrasContainerRef = useRef(null);
    const scopeActiveRef = useRef(false);
    const [, setScopeRenderTick] = useState(0);

    // Panel selection: 8 panels starting at number 1
    const PANEL_COUNT = 8;
    const { selectedPanelNumber, shiftHeld, panelNumbers } =
        usePanelSelection({ panelCount: PANEL_COUNT, startNumber: 1 });

    // Holdings lines start after panels
    const extrasStartNumber = PANEL_COUNT + 1;

    return html`
        <div class="flex flex-col flex-[1] h-full min-h-0">
            <${HotkeyButtonBar} buttons=${[]}
                extrasContainerRef=${extrasContainerRef}
                scopeActiveRef=${scopeActiveRef}
                onScopeActiveChange=${() => setScopeRenderTick(n => n + 1)}
                panelCount=${PANEL_COUNT}
                class="" style="height:0;overflow:hidden" />
            <div class="flex flex-row w-full">
                <${IndexPanel} title="Gold" commodityId=${api.GOLD_ID} panelNumber=${1} isSelected=${selectedPanelNumber === 1} />
                <${IndexPanel} title="Silver" commodityId=${api.SILVER_ID} panelNumber=${2} isSelected=${selectedPanelNumber === 2} />
                <${IndexPanel} title="Oil" commodityId=${api.OIL_ID} panelNumber=${3} isSelected=${selectedPanelNumber === 3} />
                <${IndexPanel} title="Corn" commodityId=${api.CORN_ID} panelNumber=${4} isSelected=${selectedPanelNumber === 4} />
                <${IndexPanel} title="Wheat" commodityId=${api.WHEAT_ID} panelNumber=${5} isSelected=${selectedPanelNumber === 5} />
            </div>
            <div class="flex flex-row w-full">
                <${IndexPanel} title="Stock Index" commodityId=${api.STOCK_INDEX_ID} panelNumber=${6} isSelected=${selectedPanelNumber === 6} />
                <${IndexPanel} title="Bitcoin (BTC)" commodityId=${api.BITCOIN_ID} panelNumber=${7} isSelected=${selectedPanelNumber === 7} />
                <${IndexPanel} title="Ethereum (ETH)" commodityId=${api.ETHEREUM_ID} panelNumber=${8} isSelected=${selectedPanelNumber === 8} />
            </div>
            <div class="flex flex-col flex-[3] overflow-y-auto min-h-0">
                <div class="flex flex-row w-full">
                </div>
                <div ref=${extrasContainerRef} class="flex flex-row justify-center">
                ${renderLines(commodityList,
                    undefined,
                    ({ type, id, text, extrasCounter, isLineSelected, lineNumber }) => {
                        const idx = extrasCounter ? extrasCounter.current++ : null;
                        return html`<${DisabledTooltipButton}
                            onClick=${() => (type === "P" ? api.sellPhysicalCommodity
                                    : type === "PC" ? api.sellPhysicalCrypto
                                    : type === "F" ? isContractShort(text) ? api.coverShortCommodityFutures : api.sellCommodityFutures
                                    : type === "CF" ? isContractShort(text) ? api.buyCryptoFutures : api.sellCryptoFutures
                                    : () => {}
                                )(id)}
                            label=${type.includes('F') && isContractShort(text) ? 'Cover' : 'Sell'}
                            color="red"
                            buttonClass="flex-1 mx-1"
                            extrasIndex=${idx}
                            scopeActive=${scopeActiveRef.current}
                            hotkeyLetter="s"
                            isLineSelected=${isLineSelected}
                            lineNumber=${lineNumber}
                        />`;
                    }, hyperlinkRegex, undefined, extrasStartNumber, scopeActiveRef, panelNumbers)}
                </div>
            </div>
        </div>
    `;
}

export default CommoditiesTab;
