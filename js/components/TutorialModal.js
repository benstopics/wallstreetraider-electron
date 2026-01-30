import { html, useEffect, useState, useRef, useCallback } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import Button from './Button.js';
import TutorialOverlay from './TutorialOverlay.js';
import TutorialTooltip, { useActiveTooltip } from './TutorialTooltip.js';
import { TUTORIAL_STEPS } from './TutorialSteps.js';
import { insertCurrencySymbols } from './helpers.js';

// Calculate panel position based on step position and highlighted element
function calculatePanelStyle(step, sidebarMode = false) {
    // In sidebar mode, always position on the left side
    if (sidebarMode || step?.sidebarMode) {
        return {
            position: 'fixed',
            top: '100px',
            left: '20px',
            maxWidth: '350px',
            maxHeight: 'calc(100vh - 140px)'
        };
    }

    if (!step?.highlightSelector || step.position === 'center') {
        return {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        };
    }

    const element = document.querySelector(step.highlightSelector);
    if (!element) {
        return {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        };
    }

    const rect = element.getBoundingClientRect();
    const padding = 20;
    const panelWidth = 400;
    const panelHeight = 400; // Approximate

    // Calculate available space in each direction
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    const spaceBottom = window.innerHeight - rect.bottom;
    const spaceTop = rect.top;

    let style = { position: 'fixed' };

    switch (step.position) {
        case 'right':
            if (spaceRight >= panelWidth + padding) {
                style.top = `${Math.max(20, Math.min(rect.top, window.innerHeight - panelHeight - 20))}px`;
                style.left = `${rect.right + padding}px`;
            } else {
                // Fall back to center
                style = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
            }
            break;
        case 'left':
            if (spaceLeft >= panelWidth + padding) {
                style.top = `${Math.max(20, Math.min(rect.top, window.innerHeight - panelHeight - 20))}px`;
                style.right = `${window.innerWidth - rect.left + padding}px`;
            } else {
                style = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
            }
            break;
        case 'bottom':
            if (spaceBottom >= panelHeight + padding) {
                style.top = `${rect.bottom + padding}px`;
                style.left = `${Math.max(20, Math.min(rect.left, window.innerWidth - panelWidth - 20))}px`;
            } else {
                style = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
            }
            break;
        case 'top':
            if (spaceTop >= panelHeight + padding) {
                style.bottom = `${window.innerHeight - rect.top + padding}px`;
                style.left = `${Math.max(20, Math.min(rect.left, window.innerWidth - panelWidth - 20))}px`;
            } else {
                style = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
            }
            break;
        default:
            style = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    return style;
}

export default function TutorialModal() {
    const { hideTutorial, showHelp, helpShown } = api.useWSRContext();
    const gameState = api.useGameStore(s => s.gameState);
    const gameLoaded = gameState.gameLoaded;
    const tutorialStep = gameState.tutorialStep || 0;
    const tutorialEnabled = gameState.tutorialEnabled;
    const isTickerRunning = gameState.isTickerRunning;
    const modalType = gameState.modalType;

    const [panelStyle, setPanelStyle] = useState({});
    const [sidebarMode, setSidebarMode] = useState(false);
    const panelRef = useRef(null);

    const step = TUTORIAL_STEPS[tutorialStep];
    const isFirst = tutorialStep === 0;
    const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;

    // Check if a tooltip is active (replaces regular tutorial content)
    const activeTooltip = useActiveTooltip();

    // Check if a modal is open and switch to sidebar mode
    useEffect(() => {
        const hasActiveModal = modalType > 0;
        const stepWantsSidebar = step?.sidebarMode === true;
        setSidebarMode(hasActiveModal || stepWantsSidebar);
    }, [modalType, step]);

    // Update panel position when step changes or sidebar mode changes
    useEffect(() => {
        if (!tutorialEnabled || !step) return;
        const updatePosition = () => {
            setPanelStyle(calculatePanelStyle(step, sidebarMode));
        };

        // Small delay to allow DOM to update
        const timeoutId = setTimeout(updatePosition, 50);

        window.addEventListener('resize', updatePosition);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updatePosition);
        };
    }, [tutorialEnabled, tutorialStep, step, sidebarMode]);

    // Navigation handlers
    const goNext = useCallback(() => {
        if (isLast) {
            completeTutorial();
        } else {
            api.setTutorialStep(tutorialStep + 1);
        }
    }, [isLast, tutorialStep]);

    const goPrev = () => {
        if (!isFirst) {
            api.setTutorialStep(tutorialStep - 1);
        }
    };

    const skipTutorial = () => {
        api.setTutorialEnabled(false);
        hideTutorial();
    };

    const completeTutorial = () => {
        api.setTutorialStep(TUTORIAL_STEPS.length);
        api.setTutorialEnabled(false);
        hideTutorial();
    };

    // Handle "Learn more" click - opens help without closing tutorial
    const handleLearnMore = useCallback(() => {
        if (step?.helpId) {
            showHelp(step.helpId);
        } else {
            showHelp();
        }
    }, [step, showHelp]);

    // Auto-advance when user clicks on highlighted element or performs action
    useEffect(() => {
        if (!tutorialEnabled || !step?.advanceOn) return;

        const advanceOn = step.advanceOn;

        // Click-based advancement
        if (advanceOn.click) {
            const handleClick = (e) => {
                const target = e.target;
                const selector = advanceOn.click;

                // Check if clicked element matches the selector or is a child of it
                if (target.matches(selector) || target.closest(selector)) {
                    // Small delay to let the action complete
                    setTimeout(() => {
                        goNext();
                    }, 100);
                }
            };

            document.addEventListener('click', handleClick, true);
            return () => document.removeEventListener('click', handleClick, true);
        }
    }, [tutorialEnabled, step, goNext]);

    // Action-based auto-advancement
    // Register a listener that fires when advanceTutorialOnAction is called from api.js
    useEffect(() => {
        if (!tutorialEnabled) return;

        const handleAction = (actionName) => {
            // Check if this step should advance on this action
            if (step?.advanceOn?.action !== actionName) {
                return;
            }

            // Check state condition if present
            // Use a small delay to allow gameState to update first (async from backend)
            const checkStateAndAdvance = () => {
                const currentGameState = api.gameStore.getState().gameState;

                if (step.advanceOn.state) {
                    if (typeof step.advanceOn.state === 'function') {
                        if (!step.advanceOn.state(currentGameState)) {
                            return; // State condition not met
                        }
                    }
                }

                // Both action and state (if present) match - advance
                goNext();
            };

            // Delay to allow gameState to update from backend
            setTimeout(checkStateAndAdvance, 500);
        };

        // Register the listener
        api.setTutorialActionListener(handleAction);

        // Don't set listener to null in cleanup - this causes timing issues
        // where actions fire between cleanup and re-registration.
        // The listener will simply be overwritten on re-registration.
    }, [tutorialEnabled, step, goNext]);

    // Keyboard navigation
    useEffect(() => {
        if (!tutorialEnabled) return;

        const handleKeyDown = (e) => {
            // Don't handle keys if Help modal is open - let it handle its own Escape
            if (helpShown) return;

            if (e.key === 'Escape') {
                hideTutorial();
            } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
                goNext();
            } else if (e.key === 'ArrowLeft') {
                goPrev();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [tutorialEnabled, tutorialStep, goNext, helpShown]);

    // If there's an active tooltip, render just the tooltip modal (regardless of tutorial state)
    if (activeTooltip) {
        return html`
            <div class="tutorial-tooltip-modal">
                <${TutorialTooltip} />
            </div>
        `;
    }

    // For the regular tutorial modal, check if tutorial is enabled
    if (!tutorialEnabled || !step || helpShown || !gameLoaded) return null;

    // Determine if we should show the overlay (not in sidebar mode with active modal)
    const showOverlay = !sidebarMode || !step.sidebarMode;

    return html`
        ${showOverlay ? html`
            <${TutorialOverlay}
                selector=${step.highlightSelector}
                enabled=${tutorialEnabled && !sidebarMode}
            />
        ` : ''}
        <div
            class=${`tutorial-panel ${sidebarMode ? 'tutorial-sidebar' : ''}`}
            style=${panelStyle}
            ref=${panelRef}
        >
            <div class="tutorial-header">
                <span class="tutorial-step-indicator">
                    ${insertCurrencySymbols(`Step ${tutorialStep + 1} of ${TUTORIAL_STEPS.length}`)}
                </span>
                <h3 class="tutorial-title">${insertCurrencySymbols(step.title)}</h3>
            </div>
            <div class="tutorial-progress">
                <div
                    class="tutorial-progress-bar"
                    style=${{ width: `${((tutorialStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
                ></div>
            </div>
            <div
                class="tutorial-content"
                dangerouslySetInnerHTML=${{ __html: step.contentFn ? step.contentFn(gameState) : step.content }}
            ></div>
            ${step.helpId ? html`
                <div class="tutorial-help-links">
                    <${Button}
                        class="tutorial-help-link"
                        tabindex="-1"
                        onClick=${handleLearnMore}
                    >
                        ${insertCurrencySymbols("Learn more in Help")} →
                    </button>
                </div>
            ` : ''}
            <div class="tutorial-footer">
                <${Button} class="btn tutorial-skip" tabindex="-1" onClick=${skipTutorial}>
                    ${insertCurrencySymbols("Hide")}
                </button>
                <div class="tutorial-nav">
                    <${Button}
                        class="btn"
                        tabindex="-1"
                        onClick=${goPrev}
                        disabled=${isFirst}
                    >
                        ${insertCurrencySymbols("Previous")}
                    </button>
                    <${Button}
                        class="btn tutorial-next"
                        tabindex="-1"
                        onClick=${goNext}
                    >
                        ${isLast ? insertCurrencySymbols("Finish") : insertCurrencySymbols("Next")}
                    </button>
                </div>
            </div>
        </div>
    `;
}
