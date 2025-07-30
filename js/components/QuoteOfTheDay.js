import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import { renderMultilineText } from './helpers.js';

function QuoteOfTheDay() {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await api.getQuoteOfTheDay();
                if (data && data.quote) {
                    setQuote(data.quote);
                }
            } catch (err) {
                console.error('Error fetching quote of the day:', err);
            }
        })();
    }, []);

    return html`
        <div class="quote-overlay">
            <blockquote class="flex flex-col">
                ${renderMultilineText(quote, { additionalDelimiters: ['--.*'] })}
            </blockquote>
        </div>
    `;
}

export default QuoteOfTheDay;