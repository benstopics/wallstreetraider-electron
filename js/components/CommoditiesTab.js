import { html } from '../lib/preact.standalone.module.js';
import Tabs from './Tabs.js';
import AssetPriceChart from './AssetPriceChart.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import Tooltip from './Tooltip.js';


const Tab = Tabs.Tab;

function IndexPanel({ title, commodityId, gameState }) {

    const { actingAs, actingAsIndustryId } = gameState;

    const buy = [api.BITCOIN_ID, api.ETHEREUM_ID].includes(commodityId) ? api.buyPhysicalCrypto : api.buyPhysicalCommodity;
    const buyFutures = [api.BITCOIN_ID, api.ETHEREUM_ID].includes(commodityId) ? api.buyCryptoFutures : api.buyCommodityFutures;
    const shortFutures = [api.BITCOIN_ID, api.ETHEREUM_ID].includes(commodityId) ? api.sellCryptoFutures : api.shortCommodityFutures;

    const showBuyButton = commodityId !== api.STOCK_INDEX_ID
    const buyDisabledMessage = !actingAs ? "Must be acting as"
        : actingAsIndustryId === api.BANK_IND
            ? "Banks cannot trade commodities, indexes or crypto."
            : false;

    const buyFuturesDisabledMessage = !actingAs
        ? "Must be acting as"
        : actingAsIndustryId === api.BANK_IND
            ? "Banks cannot trade futures."
            : actingAsIndustryId === api.INSURANCE_IND && commodityId !== api.STOCK_INDEX_ID
                ? "Insurance companies can only trade stock index futures."
                : false;

    const shortFuturesDisabledMessage = !actingAs
        ? "Must be acting as"
        : [api.BANK_IND, api.INSURANCE_IND].includes(actingAsIndustryId)
            ? "Banks and insurance companies cannot short futures."
            : false;

    return html`
        <div class="flex flex-col w-full">
            <div class="flex flex-col" style="height: 100px">
                ${html`<${AssetPriceChart} chartTitle=${title} assetId=${commodityId} />`}
            </div>
            <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                ${showBuyButton && (
            !buyDisabledMessage
                ? html`
                            <button class="btn green flex-1 mx-1" onclick=${() => buy(commodityId)}>Buy</button>
                        `
                : html`
                            <${Tooltip} text=${buyDisabledMessage}>
                                <button class="btn disabled w-full">Buy</button>
                            <//>
                        `
        )}

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
                        <div class="flex flex-row justify-between mt-2 w-full" style="height:25px">
                            <button class="btn disabled w-full">Short Futures</button>
                        </div>
                    <//>
                `}
            </div>
        </div>
    `;
}

function CommoditiesTab({ gameState }) {

    const { commodityList, actingAs } = gameState;

    return html`
        <div class="flex flex-row w-full">
            <div class="flex flex-col flex-[1]">
                <${IndexPanel} title="Stock Index" commodityId=${api.STOCK_INDEX_ID} gameState=${gameState} />
                <${IndexPanel} title="Gold" commodityId=${api.GOLD_ID} gameState=${gameState} />
                <${IndexPanel} title="Silver" commodityId=${api.SILVER_ID} gameState=${gameState} />
                <${IndexPanel} title="Bitcoin (BTC)" commodityId=${api.BITCOIN_ID} gameState=${gameState} />
                <${IndexPanel} title="Ethereum (ETH)" commodityId=${api.ETHEREUM_ID} gameState=${gameState} />
            </div>
            <div class="flex flex-col flex-[3]">
                <div class="flex flex-row w-full">
                    <${IndexPanel} title="Oil" commodityId=${api.OIL_ID} gameState=${gameState} />
                    <${IndexPanel} title="Corn" commodityId=${api.CORN_ID} gameState=${gameState} />
                    <${IndexPanel} title="Wheat" commodityId=${api.WHEAT_ID} gameState=${gameState} />
                </div>
                <div class="flex flex-row justify-center">
                ${renderLines(commodityList,
                    undefined,
                    ({ type, id }) => actingAs ? html`
                    <button
                        class="btn red flex-1 mx-1"
                        onClick=${() => (type === "P" ? api.sellPhysicalCommodity
                                : type === "PC" ? api.sellPhysicalCrypto
                                : type === "F" ? api.sellCommodityFutures
                                : type === "CF" ? api.sellCryptoFutures
                                : () => {}
                            )(id)}>
                        Sell
                    </button>` : html`
                    <${Tooltip} text="Must be acting as">
                        <button class="btn disabled w-full">Sell</button>
                    <//>`)}
                </div>
            </div>
        </div>
    `;
}

export default CommoditiesTab;