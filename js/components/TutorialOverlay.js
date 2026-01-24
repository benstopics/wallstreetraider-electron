import { html, useEffect, useState, useRef } from '../lib/preact.standalone.module.js';

// TutorialOverlay creates a dark overlay with a "spotlight" cutout
// around the highlighted element using CSS box-shadow technique
export default function TutorialOverlay({ selector, enabled }) {
    const [spotlightStyle, setSpotlightStyle] = useState(null);
    const animFrameRef = useRef(null);

    useEffect(() => {
        if (!enabled || !selector) {
            setSpotlightStyle(null);
            return;
        }

        const updatePosition = () => {
            const element = document.querySelector(selector);
            if (!element) {
                setSpotlightStyle(null);
                return;
            }

            const rect = element.getBoundingClientRect();
            const padding = 8;

            setSpotlightStyle({
                top: `${rect.top - padding}px`,
                left: `${rect.left - padding}px`,
                width: `${rect.width + padding * 2}px`,
                height: `${rect.height + padding * 2}px`,
            });
        };

        // Initial position
        updatePosition();

        // Update on resize/scroll
        const handleResize = () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
            animFrameRef.current = requestAnimationFrame(updatePosition);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, true);

        // Poll for position changes (in case element moves due to content changes)
        const intervalId = setInterval(updatePosition, 200);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize, true);
            clearInterval(intervalId);
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [selector, enabled]);

    if (!enabled) return null;

    return html`
        <div class="tutorial-overlay">
            ${spotlightStyle && html`
                <div class="tutorial-spotlight" style=${spotlightStyle}></div>
            `}
        </div>
    `;
}
