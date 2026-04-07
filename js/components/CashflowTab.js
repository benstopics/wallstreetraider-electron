import { html } from '../lib/preact.standalone.module.js';
import { renderLines } from './helpers.js';
import * as api from '../api.js';
import DisabledTooltipButton from './DisabledTooltipButton.js';
import HotkeyButtonBar from './HotkeyButtonBar.js';
import { useActionButtonProps } from '../hooks/useActionButtonProps.js';


function CashflowTab() {

    const cashflowProjection = api.useGameStore(s => s.gameState.cashflowProjection);
    const hyperlinkRegex = api.useGameStore(s => s.gameState.hyperlinkRegex);

    // Get centralized button props
    const buttonProps = useActionButtonProps();

    return html`
            <div class="flex flex-col w-full items-center h-full min-h-0">
                ${!buttonProps.isActiveEntityETF ? html`<${HotkeyButtonBar} buttons=${[
                    buttonProps.browseForSaleItems,
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