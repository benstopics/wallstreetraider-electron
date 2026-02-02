import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';


function CashflowTab() {

    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const cashflowProjection = api.useGameStore(s => s.gameState.cashflowProjection);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    const hasCorporateAssets = financialProfile.some(asset => asset.includes('Business Assets/Equipment'));

    return html`
            <div class="flex flex-col w-full items-center h-full min-h-0">
                ${!buttonProps.isActiveEntityETF ? html`<div class="flex flex-row items-center gap-5">
                    ${activeIndustryId !== api.BANK_IND ? html`
                        <${DisabledTooltipButton} ...${buttonProps.buyCorporateAssets} />
                        ${hasCorporateAssets ? html`<${DisabledTooltipButton} ...${buttonProps.sellCorporateAssets} />` : ''}
                        ${hasCorporateAssets ? html`<${DisabledTooltipButton} ...${buttonProps.offerAssetsForSale} label="Offer Corporate Assets for Sale" />` : ''}
                    ` : ''}
                        <${DisabledTooltipButton} ...${buttonProps.browseForSaleItems} />
                        <${DisabledTooltipButton} ...${buttonProps.setDividend} />
                        <${DisabledTooltipButton} ...${buttonProps.setProductivity} />
                        <${DisabledTooltipButton} ...${buttonProps.setGrowthRate} />
                        <${DisabledTooltipButton} ...${buttonProps.changeManagers} label="Fire Managers" />
                </div>` : ''}
                <br />
                <div class="flex flex-col flex-[3] justify-center items-center overflow-y-auto min-h-0">
                    <div class="flex flex-col items-center w-full">
                        ${renderLines(cashflowProjection ?? [], ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                    </div>
                </div>
            </div>
    `;
}

export default CashflowTab;