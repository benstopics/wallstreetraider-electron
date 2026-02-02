import { html, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import Tooltip from './Tooltip.js';

/**
 * A dropdown menu component with support for nested submenus and multi-column layouts
 *
 * @param {string} label - Button label
 * @param {string} icon - Button icon
 * @param {Array} items - Single column of menu items (for backward compatibility)
 * @param {Array<Array>} columns - Multi-column layout: array of columns, each column is an array of items
 * @param {string} color - Button color variant
 * @param {boolean} disabled - Whether the dropdown is disabled
 */
export default function DropdownMenu({ label, icon, items = [], columns = null, color = '', disabled = false, dataTutorial = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);
    const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef(null);
    const menuRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setOpenSubmenuIndex(null);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                setOpenSubmenuIndex(null);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const clearCloseTimeout = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const handleItemClick = (item, e) => {
        if (item.submenu) {
            e.stopPropagation();
            return;
        }
        if (item.disabled) {
            // If there's an onDisabledClick handler, call it and close the menu
            if (item.onDisabledClick) {
                item.onDisabledClick();
                setIsOpen(false);
                setOpenSubmenuIndex(null);
            } else {
                e.stopPropagation();
            }
            return;
        }
        if (item.onClick) {
            item.onClick();
        }
        setIsOpen(false);
        setOpenSubmenuIndex(null);
    };

    const handleSubmenuTriggerEnter = (index, e) => {
        clearCloseTimeout();
        // Get the position of the hovered item relative to the container, and menu width for left offset
        const itemElement = e.currentTarget;
        const menuElement = menuRef.current;
        const containerElement = containerRef.current;
        if (itemElement && menuElement && containerElement) {
            const itemRect = itemElement.getBoundingClientRect();
            const menuRect = menuElement.getBoundingClientRect();
            const containerRect = containerElement.getBoundingClientRect();
            // Top: position relative to container top (accounting for menu offset from container)
            const top = itemRect.top - containerRect.top;
            // Left: full width of the menu plus a small gap
            const left = menuRect.width + 4;
            setSubmenuPosition({ top, left });
        }
        setOpenSubmenuIndex(index);
    };

    const handleSubmenuTriggerLeave = () => {
        // Delay closing to allow moving to submenu
        closeTimeoutRef.current = setTimeout(() => {
            setOpenSubmenuIndex(null);
        }, 200);
    };

    const handleSubmenuEnter = () => {
        clearCloseTimeout();
    };

    const handleSubmenuLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setOpenSubmenuIndex(null);
        }, 100);
    };

    const renderSubmenuItem = (item, index) => {
        if (item.divider) {
            return html`<div key=${index} class="dropdown-divider"></div>`;
        }

        if (item.header) {
            return html`<div key=${index} class="dropdown-header">${item.header}</div>`;
        }

        // When disabled with onDisabledClick: show as clickable (use color)
        // When disabled without onDisabledClick: show as truly disabled
        const hasClickHandler = !!item.onDisabledClick;
        const disabledClass = item.disabled ? (hasClickHandler ? '' : 'disabled') : '';
        const colorClass = item.disabled && hasClickHandler ? (item.color || '') : (item.color || '');

        const itemContent = html`
            <div
                key=${index}
                class="dropdown-item ${disabledClass} ${colorClass}"
                onClick=${(e) => handleItemClick(item, e)}
            >
                <span class="dropdown-item-label">${item.label}</span>
            </div>
        `;

        if (item.disabled && item.disabledMessage) {
            return html`
                <${Tooltip} key=${index} text=${item.disabledMessage}>
                    ${itemContent}
                <//>
            `;
        }

        return itemContent;
    };

    const renderMenuItem = (item, index) => {
        if (item.divider) {
            return html`<div key=${index} class="dropdown-divider"></div>`;
        }

        if (item.header) {
            return html`<div key=${index} class="dropdown-header">${item.header}</div>`;
        }

        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isSubmenuOpen = openSubmenuIndex === index;

        // When disabled with onDisabledClick: show as clickable (use color)
        // When disabled without onDisabledClick: show as truly disabled
        const hasClickHandler = !!item.onDisabledClick;
        const disabledClass = item.disabled ? (hasClickHandler ? '' : 'disabled') : '';
        const colorClass = item.disabled && hasClickHandler ? (item.color || '') : (item.color || '');

        const itemContent = html`
            <div
                key=${index}
                class="dropdown-item ${disabledClass} ${colorClass} ${hasSubmenu ? 'has-submenu' : ''} ${isSubmenuOpen ? 'submenu-open' : ''}"
                onClick=${(e) => handleItemClick(item, e)}
                onMouseEnter=${hasSubmenu ? (e) => handleSubmenuTriggerEnter(index, e) : null}
                onMouseLeave=${hasSubmenu ? handleSubmenuTriggerLeave : null}
            >
                <span class="dropdown-item-label">${item.label}</span>
                ${hasSubmenu ? html`<span class="dropdown-arrow">▶</span>` : ''}
            </div>
        `;

        if (item.disabled && item.disabledMessage) {
            return html`
                <${Tooltip} key=${index} text=${item.disabledMessage}>
                    ${itemContent}
                <//>
            `;
        }

        return itemContent;
    };

    // Get the currently open submenu's items
    const getOpenSubmenu = () => {
        if (openSubmenuIndex === null) return null;
        // For multi-column, we need to find the item by global index
        const allItems = columns ? columns.flat() : items;
        const item = allItems[openSubmenuIndex];
        if (!item || !item.submenu) return null;
        return item.submenu;
    };

    const openSubmenuItems = getOpenSubmenu();

    // Determine if we're using multi-column layout
    const isMultiColumn = columns && columns.length > 0;
    const effectiveItems = isMultiColumn ? columns.flat() : items;

    // For submenu positioning with multi-column, we need to track which column an item is in
    const getItemIndex = (colIndex, itemIndex) => {
        if (!isMultiColumn) return itemIndex;
        // Calculate global index for submenu tracking
        let globalIndex = 0;
        for (let c = 0; c < colIndex; c++) {
            globalIndex += columns[c].length;
        }
        return globalIndex + itemIndex;
    };

    return html`
        <div class="dropdown-container" ref=${containerRef}>
            <button
                class="btn dropdown-trigger ${color} ${isOpen ? 'active' : ''} ${disabled ? 'disabled' : ''}"
                data-tutorial=${dataTutorial || undefined}
                onClick=${() => !disabled && setIsOpen(!isOpen)}
            >
                ${icon ? html`<span class="dropdown-icon">${icon}</span>` : ''}
                <span>${label}</span>
                <span class="dropdown-caret">${isOpen ? '▲' : '▼'}</span>
            </button>

            ${isOpen ? html`
                <div class="dropdown-menu ${isMultiColumn ? 'multi-column' : ''}" ref=${menuRef}>
                    ${isMultiColumn ? html`
                        <div class="dropdown-columns">
                            ${columns.map((columnItems, colIndex) => html`
                                <div class="dropdown-column" key=${colIndex}>
                                    ${columnItems.map((item, itemIndex) => renderMenuItem(item, getItemIndex(colIndex, itemIndex)))}
                                </div>
                            `)}
                        </div>
                    ` : html`
                        ${items.map((item, index) => renderMenuItem(item, index))}
                    `}
                </div>
                ${openSubmenuItems ? html`
                    <div
                        class="dropdown-submenu"
                        style="top: ${submenuPosition.top}px; left: ${submenuPosition.left}px"
                        onMouseEnter=${handleSubmenuEnter}
                        onMouseLeave=${handleSubmenuLeave}
                    >
                        ${openSubmenuItems.map((subItem, subIndex) => renderSubmenuItem(subItem, subIndex))}
                    </div>
                ` : ''}
            ` : ''}
        </div>
    `;
}
