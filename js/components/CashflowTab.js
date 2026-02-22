import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';


function CashflowTab() {

    const activeIndustryId = api.useGameStore(s => s.gameState.activeIndustryId);
    const cashflowProjection = api.useGameStore(s => s.gameState.cashflowProjection);
    const financialProfile = api.useGameStore(s => s.gameState.financialProfile);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    const hasCorporateAssets = (financialProfile || []).some(asset => asset.includes('Business Assets/Equipment'));

    return html`
            <div class="flex flex-col w-full items-center h-full min-h-0">
                ${!buttonProps.isActiveEntityETF ? html`<${HotkeyButtonBar} buttons=${[
                    activeIndustryId !== api.BANK_IND && buttonProps.buyCorporateAssets,
                    activeIndustryId !== api.BANK_IND && hasCorporateAssets && buttonProps.sellCorporateAssets,
                    activeIndustryId !== api.BANK_IND && hasCorporateAssets && { ...buttonProps.offerAssetsForSale, label: "Offer Corporate Assets for Sale" },
                    buttonProps.browseForSaleItems,
                    buttonProps.setDividend,
                    buttonProps.setProductivity,
                    buttonProps.setGrowthRate,
                    { ...buttonProps.changeManagers, label: "Fire Managers" },
                ]} class="flex flex-row items-center gap-5" />` : ''}
                <br />
                <div class="flex flex-col flex-[3] items-center overflow-y-auto overflow-x-auto min-h-0 w-full">
                    <div class="flex flex-col items-center w-full">
                        ${renderLines(cashflowProjection ?? [], ({ id }) => api.setViewAsset(id), null, hyperlinkRegex)}
                    </div>
                </div>
            </div>
    `;
}

export default CashflowTab;