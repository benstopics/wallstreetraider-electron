import { html, useState, useEffect } from '../lib/preact.standalone.module.js';
import { insertCurrencySymbols } from './helpers.js';
import Modal from './Modal.js';
import Button from './Button.js';
import ConfirmModal from './ConfirmModal.js';
import InputStringModal from './InputStringModal.js';
import * as api from '../api.js';

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function SaveLoadModal({ show, onClose, mode = 'load' }) {
    const [saves, setSaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSave, setSelectedSave] = useState(null);

    // Delete confirmation state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveToDelete, setSaveToDelete] = useState(null);

    // Save As state
    const [showSaveAs, setShowSaveAs] = useState(false);
    const [saveAsError, setSaveAsError] = useState(null);

    // Fetch saves when modal opens
    useEffect(() => {
        if (show) {
            fetchSaves();
        }
    }, [show]);

    const fetchSaves = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.listSaves();
            // Sort by date (newest first)
            const sorted = (data || []).sort((a, b) => {
                return new Date(b.modifiedDate) - new Date(a.modifiedDate);
            });
            setSaves(sorted);
        } catch (err) {
            setError('Failed to load saves: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoad = async (filename) => {
        try {
            await api.loadSpecificSave(filename);
            onClose();
        } catch (err) {
            setError('Failed to load game: ' + err.message);
        }
    };

    const handleDeleteClick = (save) => {
        setSaveToDelete(save);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!saveToDelete) return;

        try {
            const result = await api.deleteSave(saveToDelete.filename);
            if (result && result.success === false) {
                setError('Failed to delete: ' + (result.error || 'Unknown error'));
            } else {
                // Refresh the list
                await fetchSaves();
            }
        } catch (err) {
            setError('Failed to delete: ' + err.message);
        } finally {
            setShowDeleteConfirm(false);
            setSaveToDelete(null);
        }
    };

    const handleSaveAs = async (filename) => {
        setSaveAsError(null);

        // Validate filename
        if (!api.isValidWindowsFilename(filename)) {
            setSaveAsError('Invalid filename. Avoid characters: \\ / : * ? " < > |');
            return;
        }

        // Add .DAT extension if not present
        let finalFilename = filename;
        if (!finalFilename.toUpperCase().endsWith('.DAT')) {
            finalFilename += '.DAT';
        }

        try {
            await api.saveGameAs(finalFilename);
            setShowSaveAs(false);
            // Refresh the list to show the new save
            await fetchSaves();
        } catch (err) {
            setSaveAsError('Failed to save: ' + err.message);
        }
    };

    const title = mode === 'save' ? 'Save Game' : 'Load Game';

    return html`
        <${Modal} show=${show} onClose=${onClose} style="display: flex; flex-direction: column; min-width: 500px; max-width: 700px;">
            <div class="flex-1 min-h-0 p-3 overflow-y-auto">
                <div class="text-lg font-bold text-center mb-4">${insertCurrencySymbols(title)}</div>

                ${error ? html`
                    <div class="bg-red-900 text-white p-2 rounded mb-4">${error}</div>
                ` : ''}

                ${loading ? html`
                    <div class="text-center py-8">Loading saves...</div>
                ` : saves.length === 0 ? html`
                    <div class="text-center py-8 text-gray-400">No save files found</div>
                ` : html`
                    <div>
                        <table class="w-full text-sm">
                            <thead class="sticky top-0 bg-gray-800">
                                <tr>
                                    <th class="text-left p-2">Filename</th>
                                    <th class="text-left p-2">Date Modified</th>
                                    <th class="text-right p-2">Size</th>
                                    <th class="text-center p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${saves.map(save => html`
                                    <tr
                                        key=${save.filename}
                                        class="hover:bg-gray-700 cursor-pointer ${selectedSave === save.filename ? 'bg-gray-600' : ''}"
                                        onClick=${() => setSelectedSave(save.filename)}
                                        onDblClick=${() => handleLoad(save.filename)}
                                    >
                                        <td class="p-2">${save.filename}</td>
                                        <td class="p-2">${save.modifiedDate}</td>
                                        <td class="p-2 text-right">${formatFileSize(save.size)}</td>
                                        <td class="p-2 text-center">
                                            <${Button}
                                                class="btn green text-xs px-2 py-1 mr-1"
                                                onClick=${(e) => { e.stopPropagation(); handleLoad(save.filename); }}
                                            >Load<//>
                                            <${Button}
                                                class="btn red text-xs px-2 py-1"
                                                onClick=${(e) => { e.stopPropagation(); handleDeleteClick(save); }}
                                            >Delete<//>
                                        </td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>

            <div class="flex justify-between items-center p-3 border-t border-gray-600 flex-shrink-0">
                ${mode !== 'load' ? html`
                    <${Button} class="btn green" onClick=${() => setShowSaveAs(true)}>
                        ${insertCurrencySymbols("Save As...")}
                    <//>
                ` : ''}
                <${Button} class="btn" onClick=${onClose}>
                    ${insertCurrencySymbols("Close")}
                <//>
            </div>

            <!-- Delete Confirmation Modal -->
            <${ConfirmModal}
                show=${showDeleteConfirm}
                title="Delete Save"
                text=${"Are you sure you want to delete '" + (saveToDelete?.filename || '') + "'?\r\rThis action cannot be undone."}
                onYes=${handleDeleteConfirm}
                onNo=${() => { setShowDeleteConfirm(false); setSaveToDelete(null); }}
            />

            <!-- Save As Modal -->
            <${InputStringModal}
                show=${showSaveAs}
                title="Save Game As"
                text=${saveAsError ? "Error: " + saveAsError + "\r\rEnter a filename for your save:" : "Enter a filename for your save:\r(.DAT extension will be added automatically)"}
                defaultValue=""
                onSubmit=${handleSaveAs}
                onCancel=${() => { setShowSaveAs(false); setSaveAsError(null); }}
            />
        <//>
    `;
}
