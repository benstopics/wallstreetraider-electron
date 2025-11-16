import { html } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import Tooltip from './Tooltip.js';
import SparkChart from './SparkChart.js';


const Tab = Tabs.Tab;

function IndexPanel({ title, commodityId }) {

    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const actingAsIndustryId = api.useGameStore(s => s.gameState.actingAsIndustryId);

    const buy = [api.BITCOIN_ID, api.ETHEREUM_ID].includes(commodityId) ? api.buyPhysicalCrypto : api.buyPhysicalCommodity;
    const buyFutures = [api.BITCOIN_ID, api.ETHEREUM_ID].includes(commodityId) ? api.buyCryptoFutures : api.buyCommodityFutures;
    const shortFutures = [api.BITCOIN_ID, api.ETHEREUM_ID].includes(commodityId) ? api.sellCryptoFutures : api.shortCommodityFutures;

    const showBuyButton = commodityId !== api.STOCK_INDEX_ID
    const buyDisabledMessage = !actingAs ? "Must be acting as this company"
        : actingAsIndustryId === api.BANK_IND
            ? "Banks cannot trade commodities, indexes or crypto."
            : false;

    const buyFuturesDisabledMessage = !actingAs
        ? "Must be acting as this company"
        : actingAsIndustryId === api.BANK_IND
            ? "Banks cannot trade futures."
            : actingAsIndustryId === api.INSURANCE_IND && commodityId !== api.STOCK_INDEX_ID
                ? "Insurance companies can only trade stock index futures."
                : false;

    const shortFuturesDisabledMessage = !actingAs
        ? "Must be acting as this company"
        : [api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
            ? "Banks and insurance companies cannot short futures."
            : false;

    return html`
        <div class="flex flex-col w-full">
            <div class="flex flex-col" style="height: 100px">
                ${html`<${AssetPriceChart} chartTitle=${title} assetId=${commodityId} />`}
            </div>
            <div class="flex flex-row justify-around mt-2 w-full" style="height:25px">
                ${showBuyButton ? (
            !buyDisabledMessage
                ? html`
                            <button class="btn green flex-1 mx-1" onclick=${() => buy(commodityId)}>Buy</button>
                        `
                : html`
                            <${Tooltip} text=${buyDisabledMessage}>
                                <button class="btn disabled w-full">Buy</button>
                            <//>
                        `
        ) : ''}

                ${!buyFuturesDisabledMessage
            ? html`
                        <button class="btn green flex-1 mx-1" onclick=${() => buyFutures(commodityId)}>Buy Futures</button>
                    `
            : html`
                        <${Tooltip} text=${buyFuturesDisabledMessage}>
                            <button class="btn disabled w-full">Buy Futures</button>
                        <//>
                    `
        }

            ${!shortFuturesDisabledMessage
            ? html`
                    <button class="btn red flex-1 mx-1" onclick=${() => shortFutures(commodityId)}>Short Futures</button>
                `
            : html`
                    <${Tooltip} text=${shortFuturesDisabledMessage}>
                        <div class="flex flex-row justify-between w-full">
                            <button class="btn disabled w-full">Short Futures</button>
                        </div>
                    <//>
                `}
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
    const actingAs = api.useGameStore(s => s.gameState.actingAs);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    return html`
        <div class="flex flex-col flex-[1]">
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
            <div class="flex flex-col flex-[3]">
                <div class="flex flex-row w-full">
                </div>
                <div class="flex flex-row justify-center">
                ${renderLines(commodityList,
                    undefined,
                    ({ type, id, text }) => actingAs ? html`
                    <button
                        class="btn red flex-1 mx-1"
                        onClick=${() => (type === "P" ? api.sellPhysicalCommodity
                                : type === "PC" ? api.sellPhysicalCrypto
                                : type === "F" ? isContractShort(text) ? api.coverShortCommodityFutures : api.sellCommodityFutures
                                : type === "CF" ? isContractShort(text) ? api.buyCryptoFutures : api.sellCryptoFutures
                                : () => {}
                            )(id)}>
                        ${type.includes('F') && isContractShort(text) ? 'Cover' : 'Sell'}
                    </button>` : html`
                    <${Tooltip} text="Must be acting as this company">
                        <button class="btn disabled w-full">Sell</button>
                    <//>`, hyperlinkRegex)}
                </div>
            </div>
        </div>
    `;
}

export default CommoditiesTab;