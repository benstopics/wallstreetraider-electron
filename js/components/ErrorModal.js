import { html } from '../lib/preact.standalone.module.js';
import Modal from './Modal.js';
import Button from './Button.js';

export default function ErrorModal({ show, error, errorInfo, onDismiss, onReload }) {
    if (!show) return null;

    const errorMessage = error?.message || String(error);
    const errorStack = error?.stack || '';
    const componentStack = errorInfo?.componentStack || '';

    return html`<${Modal} show=${show} onClose=${onDismiss} style="display: flex; flex-direction: column; max-width: 800px; max-height: 80vh;">
        <div class="p-3 border-b border-gray-600">
            <h2 class="text-xl font-bold text-red-400">Rendering Error</h2>
        </div>
        <div class="flex-1 min-h-0 p-3 overflow-y-auto">
            <div class="mb-4">
                <h3 class="font-bold text-red-300 mb-1">Error Message:</h3>
                <pre class="bg-gray-900 p-2 rounded text-red-200 whitespace-pre-wrap break-words text-sm">${errorMessage}</pre>
            </div>
            ${errorStack && html`
                <div class="mb-4">
                    <h3 class="font-bold text-yellow-300 mb-1">Stack Trace:</h3>
                    <pre class="bg-gray-900 p-2 rounded text-gray-300 whitespace-pre-wrap break-words text-xs max-h-48 overflow-y-auto">${errorStack}</pre>
                </div>
            `}
            ${componentStack && html`
                <div class="mb-4">
                    <h3 class="font-bold text-blue-300 mb-1">Component Stack:</h3>
                    <pre class="bg-gray-900 p-2 rounded text-gray-300 whitespace-pre-wrap break-words text-xs max-h-48 overflow-y-auto">${componentStack}</pre>
                </div>
            `}
        </div>
        <div class="flex justify-end items-center gap-2 p-3 border-t border-gray-600 flex-shrink-0">
            <${Button} class="btn modal" onClick=${onDismiss}>Dismiss</button>
            <${Button} class="btn modal green" onClick=${onReload}>Reload Page</button>
        </div>
    <//>`;
}
