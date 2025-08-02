import { html } from '../lib/preact.standalone.module.js';

const Tooltip = ({ text, children, containerClass = '' }) => html`
  <div class="relative group inline-block ${containerClass}" style="overflow: visible; position: relative;">
    ${children}
    <div class="absolute z-40 hidden group-hover:flex -top-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none">
      ${text}
    </div>
  </div>
`;

export default Tooltip;
