import { html, useEffect, useState, useRef } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import Button from './Button.js';
import TutorialOverlay from './TutorialOverlay.js';
import { TUTORIAL_STEPS } from './TutorialSteps.js';
import { insertCurrencySymbols } from './helpers.js';

// Calculate panel position based on step position and highlighted element
function calculatePanelStyle(step) {
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
    const { tutorialShown, hideTutorial, showHelp, showTutorial } = api.useWSRContext();
    const tutorialStep = api.useGameStore(s => s.gameState.tutorialStep) || 0;
    const tutorialEnabled = api.useGameStore(s => s.gameState.tutorialEnabled);
    const isTickerRunning = api.useGameStore(s => s.gameState.isTickerRunning);

    const [panelStyle, setPanelStyle] = useState({});
    const panelRef = useRef(null);
    const hasAutoShown = useRef(false);
    const wasTickerRunning = useRef(false);

    const step = TUTORIAL_STEPS[tutorialStep];
    const isFirst = tutorialStep === 0;
    const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;

    // Pause ticker when tutorial is shown
    useEffect(() => {
        if (tutorialShown) {
            // Remember if ticker was running when we opened
            wasTickerRunning.current = isTickerRunning;
            // Stop the ticker while tutorial is open
            if (isTickerRunning) {
                api.stopTicker();
            }
        }
    }, [tutorialShown]);

    // Auto-show tutorial when enabled and not already completed
    useEffect(() => {
        if (tutorialEnabled && !tutorialShown && tutorialStep < TUTORIAL_STEPS.length && !hasAutoShown.current) {
            hasAutoShown.current = true;
            // Small delay to let the game UI render first
            const timeoutId = setTimeout(() => {
                showTutorial();
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [tutorialEnabled, tutorialShown, tutorialStep, showTutorial]);

    // Reset auto-show flag when tutorial is disabled
    useEffect(() => {
        if (!tutorialEnabled) {
            hasAutoShown.current = false;
        }
    }, [tutorialEnabled]);

    // Update panel position when step changes
    useEffect(() => {
        if (!tutorialShown || !step) return;

        const updatePosition = () => {
            setPanelStyle(calculatePanelStyle(step));
        };

        // Small delay to allow DOM to update
        const timeoutId = setTimeout(updatePosition, 50);

        window.addEventListener('resize', updatePosition);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updatePosition);
        };
    }, [tutorialShown, tutorialStep, step]);

    // Navigation handlers
    const goNext = () => {
        if (isLast) {
            completeTutorial();
        } else {
            api.setTutorialStep(tutorialStep + 1);
        }
    };

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

    // Keyboard navigation
    useEffect(() => {
        if (!tutorialShown) return;

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
    }, [tutorialShown, tutorialStep]);

    if (!tutorialShown || !step) return null;

    return html`
        <${TutorialOverlay}
            selector=${step.highlightSelector}
            enabled=${tutorialShown}
        />
        <div class="tutorial-panel" style=${panelStyle} ref=${panelRef}>
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
            ${step.helpLinks?.length > 0 && html`
                <div class="tutorial-help-links">
                    <span>${insertCurrencySymbols("Learn more:")} </span>
                    ${step.helpLinks.map(link => html`
                        <${Button}
                            class="tutorial-help-link"
                            onClick=${() => showHelp()}
                        >
                            ${insertCurrencySymbols("Help")}
                        </button>
                    `)}
                </div>
            `}
            <div class="tutorial-footer">
                <${Button} class="btn tutorial-skip" onClick=${skipTutorial}>
                    ${insertCurrencySymbols("Skip Tutorial")}
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
