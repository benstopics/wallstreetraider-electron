import { html, useMemo } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import { insertCurrencySymbols } from './helpers.js';
import { TUTORIAL_STEPS } from './TutorialSteps.js';

// Helper to get current step ID from step index
function getCurrentStepId(tutorialStep) {
    const step = TUTORIAL_STEPS[tutorialStep];
    return step ? step.id : null;
}

// Define tooltip conditions and content
// Each tooltip has:
// - condition: function(gameState) - returns true if tooltip should show
// - title: tooltip title
// - content: static HTML content
// - tutorialStepId: (optional) step ID where tutorial-specific advice applies
// - tutorialAdvice: (optional) tutorial-specific advice shown only when on that step
const TUTORIAL_TOOLTIPS = [
    {
        id: 'buy-from-related-entity',
        condition: (gameState) => {
            return gameState.modalTitle && gameState.modalType > 0 &&
                   gameState.modalTitle.includes('Buy from Related or Uncontrolled Entity');
        },
        title: 'Buying from Institutional Shareholders',
        content: `
            <p>This dialog appears because <strong>other companies own shares</strong> in the stock you're trying to buy.</p>
            <p style="margin-top: 10px;"><strong>Click "Yes"</strong> if you want to buy shares directly from these institutional shareholders instead of on the open market. Reasons to do this:</p>
            <ul style="margin: 8px 0 8px 20px; list-style-type: disc;">
                <li>Hostile takeover - you need to acquire shares from resistant owners</li>
                <li>Gaining control - you need their shares to reach majority ownership</li>
                <li>Getting institutions out of the picture</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Click "No"</strong> to buy shares on the open market instead.</p>
            <p style="margin-top: 10px;"><em>Note: Institutional shareholders typically demand a premium above market price, which may be cost-prohibitive.</em></p>
        `,
        tutorialStepId: 'buy-stock-confirm',
        tutorialAdvice: `Click <strong>"No"</strong> to buy shares on the open market.`
    }
];

// Hook to check if a tooltip is active (for use by TutorialModal)
// Tooltips show when tooltipsSetting is enabled OR when tutorial is enabled
export function useActiveTooltip() {
    const gameState = api.useGameStore(s => s.gameState);
    const tooltipsSetting = gameState.tooltipsSetting;
    const tutorialEnabled = gameState.tutorialEnabled;

    return useMemo(() => {
        // Show tooltips if either tooltips setting is on OR tutorial is enabled
        if (!tooltipsSetting && !tutorialEnabled) return null;
        return TUTORIAL_TOOLTIPS.find(tooltip => tooltip.condition(gameState));
    }, [gameState, tooltipsSetting, tutorialEnabled]);
}

export default function TutorialTooltip() {
    const gameState = api.useGameStore(s => s.gameState);
    const activeTooltip = useActiveTooltip();

    if (!activeTooltip) return null;

    // Check if we should show tutorial-specific advice
    const currentStepId = getCurrentStepId(gameState.tutorialStep || 0);
    const showTutorialAdvice = gameState.tutorialEnabled &&
                               activeTooltip.tutorialStepId &&
                               currentStepId === activeTooltip.tutorialStepId;

    return html`
        <div class="tutorial-tooltip-container">
            <div class="tutorial-tooltip-header">
                <span class="tutorial-tooltip-icon">💡</span>
                <h4 class="tutorial-tooltip-title">${insertCurrencySymbols(activeTooltip.title)}</h4>
            </div>
            <div
                class="tutorial-tooltip-content"
                dangerouslySetInnerHTML=${{ __html: activeTooltip.content }}
            ></div>
            ${showTutorialAdvice && html`
                <div class="tutorial-action" style="margin-top: 14px;">
                    <strong>For this tutorial:</strong> <span dangerouslySetInnerHTML=${{ __html: activeTooltip.tutorialAdvice }}></span>
                </div>
            `}
            <div class="tutorial-tooltip-hint">
                To disable these tips, go to Settings and turn off "Tooltips"
            </div>
        </div>
    `;
}

// Export tooltips array for external use if needed
export { TUTORIAL_TOOLTIPS };
