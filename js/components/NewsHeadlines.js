import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';

const NewsHeadlines = ({ headlines }) => {
    
    const [command, setCommand] = useState('');
    const inputRef = useRef(null);

    const onInput = (e) => {
        const el = e.currentTarget;
        const next = el.value;
        setCommand(next);
        setOpen(true);
    }

    return html`


    <div class="panel w-1/2">
        <div class="panel-header">News Headlines</div>
        <input
            ref=${inputRef}
            class="command-line"
            type="text"
            placeholder="Enter text to highlight..."
            value=${command}
            onInput=${onInput}
            onBlur=${() => setTimeout(() => setOpen(false), 100)}
            autocomplete="off"
            spellcheck="false"
        />
        <div class="p-1 panel-body">
            ${headlines.map(item => html`
                <div class="">
                    <span class="headline-text">${item.headline}</span>
                </div>
            `)}
        </div>
    </div>
`;
};

export default NewsHeadlines;