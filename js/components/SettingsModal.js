import { html, useState, useEffect, useRef, useMemo } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';
import DisplayModal from './DisplayModal.js';
import Button from './Button.js';
import { insertCurrencySymbols } from './helpers.js';

function SettingsModal({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDisplayModal, setShowDisplayModal] = useState(false);
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

    return html`
        <div class="settings-modal-container" style="position: relative; display: inline-block;">
            <${DisplayModal} show=${showDisplayModal} onClose=${() => setShowDisplayModal(false)} />
            <div ref=${triggerRef} onClick=${toggleOpen}>
                ${children}
            </div>
            ${isOpen && html`
                <div ref=${popoverRef} class="toolbar-menu-popover" style="position: absolute; top: 100%; right: 0; z-index: 1000;">
                    <${Button} class="toolbar-menu-item" data-tutorial="display-button" onClick=${handleDisplayClick}>${insertCurrencySymbols("Display")}</button>
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
                </div>
            `}
        </div>
    `;
}

export default SettingsModal;
