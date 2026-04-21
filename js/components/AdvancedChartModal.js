import { html } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import AdvancedChart from './AdvancedChart.js';

const AdvancedChartModal = ({
    assetId,
    chartTitle,
    baseMultiplier = 1,
    theme,
    forceLineOnly = false,
    onClose,
}) => {
    return html`
        <${Modal}
            show=${true}
            onClose=${onClose}
            class="modal-card modal-wide"
            style="width: 82vw; height: 82vh; max-width: 82vw; max-height: 82vh; min-width: 720px; min-height: 480px;"
        >
            <div style="width: 100%; height: 100%;">
                <${AdvancedChart}
                    assetId=${assetId}
                    chartTitle=${chartTitle}
                    baseMultiplier=${baseMultiplier}
                    theme=${theme}
                    forceLineOnly=${forceLineOnly}
                />
            </div>
        <//>
    `;
};

export default AdvancedChartModal;
