import { html } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';


const Tab = Tabs.Tab;

function IndexPanel({ title, commodityId }) {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);
    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const activeEntitySymbol = api.useGameStore(s => s.gameState.activeEntitySymbol);
    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies);

    const isActiveEntityETF = activeIndustryId === api.ETF_IND;
    const isCrypto = [api.BITCOIN_ID, api.ETHEREUM_ID].includes(commodityId);

    const buy = isCrypto ? api.buyPhysicalCrypto : api.buyPhysicalCommodity;
    const buyFutures = isCrypto ? api.buyCryptoFutures : api.buyCommodityFutures;
    const shortFutures = isCrypto ? api.sellCryptoFutures : api.shortCommodityFutures;

    // Check if user controls the active entity for click-to-act-as functionality
    const controlsActiveEntity = (controlledCompanies || []).some(c => c.id === activeEntityNum);
    const handleActAsClick = controlsActiveEntity ? () => api.changeActingAs(activeEntityNum) : null;

    const showBuyButton = commodityId !== api.STOCK_INDEX_ID;

    // Helper to build disabled message with click-to-act-as when appropriate
    const getDisabledInfo = (baseMessages) => {
        for (const check of baseMessages) {
            if (check.condition) {
                const isActingAsIssue = check.message === "Must be acting as this company";
                return {
                    message: isActingAsIssue && controlsActiveEntity
                        ? `Must be acting as this company. Click to act as ${activeEntitySymbol}`
                        : check.message,
                    onClick: isActingAsIssue ? handleActAsClick : null
                };
            }
        }
        return { message: false, onClick: null };
    };

    const buyDisabledInfo = getDisabledInfo([
        { condition: isActiveEntityETF, message: isCrypto ? "ETFs cannot trade cryptocurrencies" : "ETFs cannot trade physical commodities" },
        { condition: !actingAs, message: "Must be acting as this company" },
        { condition: actingAsIndustryId === api.BANK_IND, message: "Banks cannot trade commodities, indexes or crypto." }
    ]);

    const buyFuturesDisabledInfo = getDisabledInfo([
        { condition: isActiveEntityETF, message: isCrypto ? "ETFs cannot trade cryptocurrency futures" : "ETFs cannot trade commodity futures" },
        { condition: !actingAs, message: "Must be acting as this company" },
        { condition: actingAsIndustryId === api.BANK_IND, message: "Banks cannot trade futures." },
        { condition: actingAsIndustryId === api.INSURANCE_IND && commodityId !== api.STOCK_INDEX_ID, message: "Insurance companies can only trade stock index futures." }
    ]);

    const shortFuturesDisabledInfo = getDisabledInfo([
        { condition: isActiveEntityETF, message: isCrypto ? "ETFs cannot trade cryptocurrency futures" : "ETFs cannot short futures" },
        { condition: !actingAs, message: "Must be acting as this company" },
        { condition: [api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId), message: "Banks and insurance companies cannot short futures." }
    ]);

    return html`
        <div class="flex flex-col w-full">
            <div class="flex flex-col" style="height: 100px">
                ${html`<${AssetPriceChart} chartTitle=${title} assetId=${commodityId} />`}
            </div>
            <div class="flex flex-row justify-around mt-2 w-full" style="height:25px">
                ${showBuyButton ? html`<${DisabledTooltipButton}
                    disabledMessage=${buyDisabledInfo.message}
                    onClick=${() => buy(commodityId)}
                    onDisabledClick=${buyDisabledInfo.onClick}
                    label="Buy"
                    color="green"
                    containerClass="flex-1"
                    buttonClass="w-full mx-1"
                />` : ''}
                <${DisabledTooltipButton}
                    disabledMessage=${buyFuturesDisabledInfo.message}
                    onClick=${() => buyFutures(commodityId)}
                    onDisabledClick=${buyFuturesDisabledInfo.onClick}
                    label="Buy Futures"
                    color="green"
                    containerClass="flex-1"
                    buttonClass="w-full mx-1"
                />
                <${DisabledTooltipButton}
                    disabledMessage=${shortFuturesDisabledInfo.message}
                    onClick=${() => shortFutures(commodityId)}
                    onDisabledClick=${shortFuturesDisabledInfo.onClick}
                    label="Short Futures"
                    color="red"
                    containerClass="flex-1"
                    buttonClass="w-full mx-1"
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

    // Get disabled message and click handler from hook for dynamic buttons
    const actingAsDisabledMessage = buttonProps.mustActAsCompanyMessage;
    const handleActAsClick = buttonProps.onMustActAsCompanyClick;

    return html`
        <div class="flex flex-col flex-[1] h-full min-h-0">
            <div class="flex flex-row w-full">
                <${IndexPanel} title="Gold" commodityId=${api.GOLD_ID} />
                <${IndexPanel} title="Silver" commodityId=${api.SILVER_ID} />
                <${IndexPanel} title="Oil" commodityId=${api.OIL_ID} />
                <${IndexPanel} title="Corn" commodityId=${api.CORN_ID} />
                <${IndexPanel} title="Wheat" commodityId=${api.WHEAT_ID} />
            </div>
            <div class="flex flex-row w-full">
                <${IndexPanel} title="Stock Index" commodityId=${api.STOCK_INDEX_ID} />
                <${IndexPanel} title="Bitcoin (BTC)" commodityId=${api.BITCOIN_ID} />
                <${IndexPanel} title="Ethereum (ETH)" commodityId=${api.ETHEREUM_ID} />
            </div>
            <div class="flex flex-col flex-[3] overflow-y-auto min-h-0">
                <div class="flex flex-row w-full">
                </div>
                <div class="flex flex-row justify-center">
                ${renderLines(commodityList,
                    undefined,
                    ({ type, id, text }) => html`<${DisabledTooltipButton}
                        disabledMessage=${actingAsDisabledMessage}
                        onClick=${() => (type === "P" ? api.sellPhysicalCommodity
                                : type === "PC" ? api.sellPhysicalCrypto
                                : type === "F" ? isContractShort(text) ? api.coverShortCommodityFutures : api.sellCommodityFutures
                                : type === "CF" ? isContractShort(text) ? api.buyCryptoFutures : api.sellCryptoFutures
                                : () => {}
                            )(id)}
                        onDisabledClick=${handleActAsClick}
                        label=${type.includes('F') && isContractShort(text) ? 'Cover' : 'Sell'}
                        color="red"
                        buttonClass="flex-1 mx-1"
                    />`, hyperlinkRegex)}
                </div>
            </div>
        </div>
    `;
}

export default CommoditiesTab;