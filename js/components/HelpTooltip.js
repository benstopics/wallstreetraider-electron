// HelpTooltip.js - Contextual help tooltip that appears on hover
import { html, useState, useRef, useEffect, useCallback } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';

/**
 * HelpTooltip - A tooltip component that shows a "Learn more" link on hover
 *
 * Usage:
 * <${HelpTooltip} helpId="chap06_VI(B)(1)">
 *   <${Button}>Buy Stock<//>
 * <//>
 *
 * Or use the data-help-id attribute directly on elements and wrap with HelpTooltipProvider
 */

const TOOLTIP_DELAY_SHOW = 500;  // ms before showing tooltip
const TOOLTIP_DELAY_HIDE = 300;  // ms before hiding tooltip (allows moving to tooltip)

export default function HelpTooltip({ children, helpId, helpLabel }) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef(null);
    const tooltipRef = useRef(null);
    const showTimeoutRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    const { showHelp } = api.useWSRContext();

    const clearTimeouts = useCallback(() => {
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
            showTimeoutRef.current = null;
        }
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    }, []);

    const calculatePosition = useCallback(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const tooltipWidth = 180; // Approximate tooltip width
        const tooltipHeight = 40; // Approximate tooltip height

        // Position above the element by default
        let top = rect.top - tooltipHeight - 8;
        let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);

        // If tooltip would go off the top, show below instead
        if (top < 10) {
            top = rect.bottom + 8;
        }

        // Keep tooltip within horizontal bounds
        if (left < 10) left = 10;
        if (left + tooltipWidth > window.innerWidth - 10) {
            left = window.innerWidth - tooltipWidth - 10;
        }

        setPosition({ top, left });
    }, []);

    const handleMouseEnter = useCallback(() => {
        clearTimeouts();
        showTimeoutRef.current = setTimeout(() => {
            calculatePosition();
            setIsVisible(true);
        }, TOOLTIP_DELAY_SHOW);
    }, [clearTimeouts, calculatePosition]);

    const handleMouseLeave = useCallback(() => {
        clearTimeouts();
        hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, TOOLTIP_DELAY_HIDE);
    }, [clearTimeouts]);

    const handleTooltipMouseEnter = useCallback(() => {
        clearTimeouts();
    }, [clearTimeouts]);

    const handleTooltipMouseLeave = useCallback(() => {
        clearTimeouts();
        hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, TOOLTIP_DELAY_HIDE);
    }, [clearTimeouts]);

    const handleLearnMoreClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(false);
        showHelp(helpId);
    }, [showHelp, helpId]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => clearTimeouts();
    }, [clearTimeouts]);

    if (!helpId) {
        // No help ID provided, just render children without tooltip
        return children;
    }

    return html`
        <span
            ref=${containerRef}
            class="help-tooltip-container"
            onMouseEnter=${handleMouseEnter}
            onMouseLeave=${handleMouseLeave}
            style="display: inline-block;"
        >
            ${children}
        </span>
        ${isVisible ? html`
            <div
                ref=${tooltipRef}
                class="help-tooltip"
                style=${{
                    position: 'fixed',
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    zIndex: 10000,
                }}
                onMouseEnter=${handleTooltipMouseEnter}
                onMouseLeave=${handleTooltipMouseLeave}
            >
                <a
                    href="#"
                    class="help-tooltip-link"
                    onClick=${handleLearnMoreClick}
                >
                    ${helpLabel || 'Learn more'} →
                </a>
            </div>
        ` : ''}
    `;
}

/**
 * CSS styles for the help tooltip (add to your stylesheet):
 *
 * .help-tooltip {
 *     background: rgba(13, 84, 115, 0.95);
 *     color: white;
 *     padding: 8px 12px;
 *     border-radius: 6px;
 *     font-size: 13px;
 *     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
 *     animation: helpTooltipFadeIn 0.15s ease-out;
 * }
 *
 * .help-tooltip-link {
 *     color: #7dd3fc;
 *     text-decoration: none;
 *     font-weight: 500;
 * }
 *
 * .help-tooltip-link:hover {
 *     color: #bae6fd;
 *     text-decoration: underline;
 * }
 *
 * @keyframes helpTooltipFadeIn {
 *     from { opacity: 0; transform: translateY(4px); }
 *     to { opacity: 1; transform: translateY(0); }
 * }
 */
