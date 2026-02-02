import { html, useRef, useEffect } from '../lib/preact.standalone.module.js';

// Tooltip component using vanilla DOM for portal-like behavior
const Tooltip = ({ text, children, containerClass = '' }) => {
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'pointer-events-none whitespace-nowrap bg-gray-700 border border-white text-white text-xs px-2 py-1 rounded';
    tooltip.style.cssText = 'position: fixed; z-index: 9999999999; display: none; transform: translate(-50%, -100%);';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;

    const updatePosition = () => {
      const wrapper = wrapperRef.current;
      const tip = tooltipRef.current;
      if (!wrapper || !tip) return;

      const rect = wrapper.getBoundingClientRect();
      tip.style.left = `${rect.left + rect.width / 2}px`;
      tip.style.top = `${rect.top - 8}px`;
      tip.style.display = 'block';
    };

    const handleLeave = () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    };

    const wrapper = wrapperRef.current;
    wrapper.addEventListener('mouseenter', updatePosition);
    wrapper.addEventListener('mouseleave', handleLeave);

    return () => {
      wrapper.removeEventListener('mouseenter', updatePosition);
      wrapper.removeEventListener('mouseleave', handleLeave);
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    };
  }, [text]);

  return html`
    <span ref=${wrapperRef} class=${containerClass}>
      ${children}
    </span>
  `;
};

export default Tooltip;
