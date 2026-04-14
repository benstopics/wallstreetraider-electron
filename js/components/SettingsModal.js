import { html, useState, useEffect, useRef, useMemo } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import DisplayModal from './DisplayModal.js';
import Modal from './Modal.js';
import Button from './Button.js';
import { insertCurrencySymbols } from './helpers.js';
import { HOTKEY_MAP, HOTKEY_CATEGORIES, formatHotkeyKey } from '../hotkeys.js';

function HotkeysModal({ show, onClose, disableHotkeysSetting }) {
    if (!show) return null;
    return html`<${Modal} show=${show} onClose=${onClose}>
        <div class="flex justify-between items-center mb-4">
            <div class="text-lg font-bold">Keyboard Shortcuts</div>
            <${Button} class="btn red" onClick=${onClose}>Close</button>
        </div>
        <div class="flex items-center justify-between mb-3 p-2" style="background: rgba(255,255,255,0.05); border-radius: 4px;">
            <span>Hotkeys</span>
            <${Button}
                class="btn ${disableHotkeysSetting ? 'red' : 'green'}"
                onClick=${() => api.disableHotkeysSelect()}
            >
                ${disableHotkeysSetting ? 'DISABLED' : 'ENABLED'}
            </button>
        </div>
        <div class="flex flex-col gap-4 max-h-[60vh] overflow-y-auto" style="${disableHotkeysSetting ? 'opacity: 0.4; pointer-events: none;' : ''}">
            ${HOTKEY_CATEGORIES.map(cat => {
                const entries = HOTKEY_MAP.filter(h => h.category === cat);
                if (!entries.length) return '';
                return html`
                    <div>
                        <div class="font-bold mb-1 text-blue-400">${cat}</div>
                        <table class="w-full" style="border-collapse: collapse;">
                            ${entries.map(h => html`
                                <tr style="border-bottom: 1px solid #333;">
                                    <td class="p-1 pr-4" style="white-space: nowrap;"><code>${formatHotkeyKey(h.key)}</code></td>
                                    <td class="p-1">${h.label}</td>
                                </tr>
                            `)}
                        </table>
                    </div>
                `;
            })}
            <div>
                <div class="font-bold mb-1 text-blue-400">Guide</div>
                <ul class="flex flex-col gap-2 text-sm" style="list-style: disc; padding-left: 1.25rem;">
                    <li><b>Hold Shift</b> — Hold <code>Shift</code> to reveal hotkey letters on toolbar and action bar buttons. The letter appears as an underlined <u>[b]</u>racket. Press <code>Shift</code>+<code>letter</code> to activate.</li>
                    <li><b>Action Bar menus</b> — Once a dropdown is open, type an item number to highlight it and press <code>Enter</code> to confirm. For two-digit items, type both digits quickly (e.g. <code>1</code><code>8</code> for item 18).</li>
                    <li><b>Tabs</b> — Number keys <code>1</code>–<code>9</code> and <code>0</code> switch between tabs (or select lines when in a portfolio view).</li>
                    <li><b>Bar Buttons</b> — <code>Shift</code>+<code>1</code>–<code>9</code> activate the numbered buttons in the action bar (shown as ⇧1, ⇧2, etc.).</li>
                    <li><b>Line Selection</b> — In portfolio-style tabs, number keys select lines immediately. Press <code>Enter</code> to navigate to the selected item, or press <code>Esc</code> to deselect and return to normal mode.</li>
                    <li><b>Line Actions</b> — When a line is selected, letter hotkeys activate buttons: <code>S</code>=Sell/Cover, <code>B</code>=Buy, <code>O</code>=Spin Off, <code>D</code>=Details, <code>T</code>=Terminate, <code>E</code>=Exercise, etc. The available letters are shown as <u>[S]</u>ell style brackets.</li>
                    <li><b>J/K Navigation</b> — <code>Alt</code>+<code>J</code>/<code>K</code> navigates back/forward in history (like browser). <code>Ctrl</code>+<code>J</code>/<code>K</code> cycles through controlled companies.</li>
                </ul>
            </div>
        </div>
    <//>`;
}

function SettingsModal({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDisplayModal, setShowDisplayModal] = useState(false);
    const [showHotkeysModal, setShowHotkeysModal] = useState(false);
    const popoverRef = useRef(null);
    const triggerRef = useRef(null);

    // Settings state
    const suppEarnSetting = api.useGameStore(s => s.gameState.suppEarnSetting);
    const suppWarnSetting = api.useGameStore(s => s.gameState.suppWarnSetting);
    const supPopupSetting = api.useGameStore(s => s.gameState.supPopupSetting);
    const autosaveSetting = api.useGameStore(s => s.gameState.autosaveSetting);
    const exerciseItSetting = api.useGameStore(s => s.gameState.exerciseItSetting);
    const sweepSetting = api.useGameStore(s => s.gameState.sweepSetting);
    const makeDeliverySetting = api.useGameStore(s => s.gameState.makeDeliverySetting);
    const takeDeliverySetting = api.useGameStore(s => s.gameState.takeDeliverySetting);
    const tooltipsSetting = api.useGameStore(s => s.gameState.tooltipsSetting);
    const shareholderGraphSetting = api.useGameStore(s => s.gameState.shareholderGraphSetting);
    const disableHotkeysSetting = api.useGameStore(s => s.gameState.disableHotkeysSetting);
    const autoAddSetting = api.useGameStore(s => s.gameState.autoAddSetting);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const onDocMouseDown = (e) => {
            if (!popoverRef.current) return;
            // Don't close if clicking inside popover or on trigger
            if (popoverRef.current.contains(e.target)) return;
            if (triggerRef.current && triggerRef.current.contains(e.target)) return;
            setIsOpen(false);
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, [isOpen]);

    const toggleOpen = () => setIsOpen(prev => !prev);

    const SettingItem = useMemo(() => ({ label, isOn, onToggle }) => {
        return html`
            <${Button} class="toolbar-menu-item" onClick=${() => onToggle()}>
                ${insertCurrencySymbols(label)}: ${isOn ? insertCurrencySymbols('ON') : insertCurrencySymbols('OFF')}
            </button>
        `;
    }, []);

    const handleDisplayClick = () => {
        setIsOpen(false);
        setShowDisplayModal(true);
    };

    const handleHotkeysClick = () => {
        setIsOpen(false);
        setShowHotkeysModal(true);
    };

    return html`
        <div class="settings-modal-container" style="position: relative; display: inline-block;">
            <${DisplayModal} show=${showDisplayModal} onClose=${() => setShowDisplayModal(false)} />
            <${HotkeysModal} show=${showHotkeysModal} onClose=${() => setShowHotkeysModal(false)} disableHotkeysSetting=${disableHotkeysSetting} />
            <div ref=${triggerRef} onClick=${toggleOpen}>
                ${children}
            </div>
            ${isOpen ? html`
                <div ref=${popoverRef} class="toolbar-menu-popover" style="position: absolute; top: 100%; right: 0; z-index: 99999999 !important;">
                    <${Button} class="toolbar-menu-item" data-tutorial="display-button" onClick=${handleDisplayClick}>${insertCurrencySymbols("Display")}</button>
                    {/* <${Button} class="toolbar-menu-item" onClick=${handleHotkeysClick}>${insertCurrencySymbols("Hotkeys")}</button> */}
                    <div class="toolbar-menu-sep"></div>
                    <${SettingItem} label="${insertCurrencySymbols("Suppress Earnings")}" isOn=${suppEarnSetting} onToggle=${() => api.suppEarnSelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("Suppress Warnings")}" isOn=${suppWarnSetting} onToggle=${() => api.suppWarnSelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("Suppress Popups")}" isOn=${supPopupSetting} onToggle=${() => api.suppressSelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("Autosave")}" isOn=${autosaveSetting} onToggle=${() => api.autosaveSelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("Exercise Options")}" isOn=${exerciseItSetting} onToggle=${() => api.exerciseSelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("Sweep")}" isOn=${sweepSetting} onToggle=${() => api.sweepSelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("Make Delivery")}" isOn=${makeDeliverySetting} onToggle=${() => api.makedeliverySelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("Take Delivery")}" isOn=${takeDeliverySetting} onToggle=${() => api.takedeliverySelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("Tooltips")}" isOn=${tooltipsSetting} onToggle=${() => api.tooltipsSelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("Shareholder Graph")}" isOn=${shareholderGraphSetting} onToggle=${() => api.shareholderGraphSelect()} />
                    <${SettingItem} label="${insertCurrencySymbols("AutoAdd to Quotes")}" isOn=${autoAddSetting} onToggle=${() => api.autoAddSelect()} />
                </div>
            ` : ''}
        </div>
    `;
}

export default SettingsModal;
