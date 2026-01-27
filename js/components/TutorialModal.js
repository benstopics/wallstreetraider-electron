import { html, useEffect, useState, useRef, useCallback } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import Button from './Button.js';
import TutorialOverlay from './TutorialOverlay.js';
import { TUTORIAL_STEPS, shouldAdvanceOnAction, getStepIndexById } from './TutorialSteps.js';
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
    const { hideTutorial, showHelp } = api.useWSRContext();
    const tutorialStep = api.useGameStore(s => s.gameState.tutorialStep) || 0;
    const tutorialEnabled = api.useGameStore(s => s.gameState.tutorialEnabled);
    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);
    const modalType = api.useGameStore(s => s.gameState.modalType);

    const [panelStyle, setPanelStyle] = useState({});
    const [sidebarMode, setSidebarMode] = useState(false);
    const panelRef = useRef(null);
    const hasAutoShown = useRef(false);
    const wasTickerRunning = useRef(false);
    const prevGameStateRef = useRef(null);

    const step = TUTORIAL_STEPS[tutorialStep];
    const isFirst = tutorialStep === 0;
    const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;

    // Pause ticker when tutorial is shown
    useEffect(() => {
        if (tutorialEnabled) {
            // Remember if ticker was running when we opened
            wasTickerRunning.current = isTickerRunning;
            // Stop the ticker while tutorial is open
            if (isTickerRunning) {
                api.stopTicker();
            }
        }
    }, [tutorialEnabled]);

    // Reset auto-show flag when tutorial is disabled
    useEffect(() => {
        if (!tutorialEnabled) {
            hasAutoShown.current = false;
        }
    }, [tutorialEnabled]);

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

    // State-based auto-advancement
    useEffect(() => {
        if (!tutorialEnabled || !step?.advanceOn?.state) return;

        const gameState = api.gameStore.getState().gameState;
        const checkState = step.advanceOn.state;

        // Check if the state condition is met
        if (typeof checkState === 'function') {
            const prevState = prevGameStateRef.current;
            if (checkState(gameState, prevState)) {
                setTimeout(() => {
                    goNext();
                }, 100);
            }
        }

        prevGameStateRef.current = gameState;
    }, [tutorialEnabled, step, goNext]);

    // Keyboard navigation
    useEffect(() => {
        if (!tutorialEnabled) return;

        const handleKeyDown = (e) => {
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
    }, [tutorialEnabled, tutorialStep, goNext]);

    if (!tutorialEnabled || !step || showHelp) return null;

    // Determine if we should show the overlay (not in sidebar mode with active modal)
    const showOverlay = !sidebarMode || !step.sidebarMode;

    return html`
        ${showOverlay && html`
            <${TutorialOverlay}
                selector=${step.highlightSelector}
                enabled=${tutorialEnabled && !sidebarMode}
            />
        `}
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
                dangerouslySetInnerHTML=${{ __html: step.content }}
            ></div>
            ${step.helpId && html`
                <div class="tutorial-help-links">
                    <${Button}
                        class="tutorial-help-link"
                        onClick=${handleLearnMore}
                    >
                        ${insertCurrencySymbols("Learn more in Help")} →
                    </button>
                </div>
            `}
            <div class="tutorial-footer">
                <${Button} class="btn tutorial-skip" onClick=${skipTutorial}>
                    ${insertCurrencySymbols("Hide")}
                </button>
                <div class="tutorial-nav">
                    <${Button}
                        class="btn"
                        onClick=${goPrev}
                        disabled=${isFirst}
                    >
                        ${insertCurrencySymbols("Previous")}
                    </button>
                    <${Button}
                        class="btn tutorial-next"
                        onClick=${goNext}
                    >
                        ${isLast ? insertCurrencySymbols("Finish") : insertCurrencySymbols("Next")}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Export function to advance tutorial from API calls
export function advanceTutorialOnAction(actionName) {
    const gameState = api.gameStore.getState().gameState;
    if (!gameState.tutorialEnabled) return;

    const currentStep = TUTORIAL_STEPS[gameState.tutorialStep];
    if (!currentStep) return;

    if (shouldAdvanceOnAction(actionName, currentStep.id)) {
        // Advance to next step
        api.setTutorialStep(gameState.tutorialStep + 1);
    }
}
