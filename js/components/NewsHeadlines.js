import { html, render, useState, useEffect } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';

const NewsHeadlines = ({ headlines }) => html`
    <div class="panel w-1/2">
        <div class="panel-header">News Headlines</div>
        <div class="p-1 panel-body">
            ${headlines.map(item => html`
                <div class="">
                    <span class="headline-text">${item.headline}</span>
                </div>
            `)}
        </div>
    </div>
`;

export default NewsHeadlines;