import { html, useEffect, useState } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import Tabs from './Tabs.js';


const Tab = Tabs.Tab;

export function squarify(width, height, items, getSizeValue) {

    if (!Array.isArray(items) || items.length === 0) {
        return {
            flexDirection: 'row',
            children: []
        }
    }

    if (items.length === 1) {
        return {
            flexDirection: 'row',
            children: [items[0]]
        };
    }

    // Ascending order
    const remaining = items
        .slice()
        .map(item => ({ ...item, _sizeValue: getSizeValue(item) }))
        .sort((a, b) => a._sizeValue - b._sizeValue);

    const totalValue = remaining.reduce((sum, item) => sum + item._sizeValue, 0);
    const totalAreaPxs = width * height;

    // Normalize values to total area
    remaining.forEach(item => {
        item._areaPct = item._sizeValue / totalValue;
    });

    let result = [];

    let lastAspect = Infinity;
    const stripWidth = Math.min(width, height); // Shortest side
    const parentFlexDirection = stripWidth == width ? 'col' : 'row'

    function worst(row) {
        // Total area of this row (in actual pixels)
        const rowArea = row.reduce((sum, item) => sum + item._areaPct, 0) * totalAreaPxs;

        // Thickness of the strip in the direction perpendicular to w
        // w is the length of the side along which we're laying the strip
        const stripHeight = rowArea / stripWidth;

        let worstAspect = 0;
        for (const item of row) {
            const itemArea = item._areaPct * totalAreaPxs;

            // Other side (along the strip's main axis)
            const itemStripWidth = itemArea / stripHeight;

            const aspect = Math.max(itemStripWidth / stripHeight, stripHeight / itemStripWidth);
            if (aspect > worstAspect) worstAspect = aspect;
        }

        return worstAspect;
    }

    while (remaining.length > 1) {
        const head = remaining[remaining.length - 1];
        const worstAspect = worst([...result, head], stripWidth);
        if (worstAspect > lastAspect) break;

        result.push(remaining.pop());
        lastAspect = worstAspect;
    }

    const totalUsedAreaPct = result.reduce((sum, item) => sum + item._areaPct, 0);

    const usedAreaPxs = totalAreaPxs * totalUsedAreaPct;
    const remAreaPxs = totalAreaPxs * (1 - totalUsedAreaPct)
    let usedWidth, usedHeight, remWidth, remHeight;
    if (parentFlexDirection === 'col') {
        // The remaining rectangle is the bottom half of the column. Same width, shorter height.
        usedWidth = width;
        usedHeight = usedAreaPxs / width;
        remWidth = width;
        remHeight = remAreaPxs / width;
    } else {
        // The remaining rectangle is the right half of the row. Same height, shorter width.
        usedWidth = usedAreaPxs / height;
        usedHeight = height;
        remWidth = remAreaPxs / height;
        remHeight = height;
    }

    const usedStripFlexDirection = parentFlexDirection === 'row' ? 'col' : 'row'

    result = result.map(item => {
        const sizePct = item._areaPct / totalUsedAreaPct;
        item._sizePct = sizePct;
        if (item.children) {
            const itemAreaPxs = totalAreaPxs * item._areaPct;
            let itemWidth, itemHeight;
            if (usedStripFlexDirection === 'col') {
                // The item is in a column strip. Same width as the strip, height based on area.
                itemWidth = usedWidth;
                itemHeight = itemAreaPxs / usedWidth;
            } else {
                // The item is in a row strip. Same height as the strip, width based on area.
                itemWidth = itemAreaPxs / usedHeight;
                itemHeight = usedHeight;
            }

            return {
                ...item,
                ...squarify(itemWidth, itemHeight, item.children, getSizeValue),
                type: 'group',
            };
        } else {
            item.children = [];
            return item;
        }
    });

    const children = [{
        flexDirection: usedStripFlexDirection, // The strip should go opposite direction to flex direction of parent strip
        _sizePct: totalUsedAreaPct,
        children: result
    }]

    if (remWidth > 0 && remHeight > 0)
        children.push(squarify(remWidth, remHeight, remaining, getSizeValue))

    return {
        flexDirection: parentFlexDirection,
        children
    };
}


function MarketHeatMapTab() {

    const [tabSize, setTabSize] = useState({ width: 600, height: 1200 });
    const [hoveredNode, setHoveredNode] = useState(null);

    const allCompanies = api.useGameStore(s => s.gameState.allCompanies);
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);
    const allCompaniesBySector = JSON.parse(JSON.stringify(allIndustries));

    allCompaniesBySector.forEach(ind => {
        ind.children = allCompanies.filter(comp => comp.industryId === ind.id);
    });

    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];

    const industriesMarketCapTree = squarify(tabSize.width, tabSize.height, allIndustries, ind => ind.totalMarketCap);
    const companyTree = squarify(tabSize.width, tabSize.height, allCompaniesBySector, x => x.totalMarketCap ?? x.marketCap);

    const renderNode = (node, key, getColor, getText, onClick) => {
        // Leaf node (no children)
        if (!node.children || node.children.length === 0) {
            return html`
                <div
                    key=${key}
                    class="flex items-center text-center justify-center font-semibold text-slate-50 border border-slate-900 overflow-hidden"
                    style=${{
                    flex: node._sizePct ?? 1,
                    background: getColor ? getColor(node) : 'rgba(100, 100, 100, 0.5)',
                    cursor: 'pointer',
                    border: api.isPlayerControlled(controlledCompanies, node.id) ? '3px dashed gold' : undefined,
                }}
                    onClick=${() => onClick(node)}
                    onMouseEnter=${() => setHoveredNode(node)}
                    onMouseLeave=${() => setHoveredNode(null)}
                >
                    <span style="pointer-events: none; font-size: 0.75em">${getText(node)}</span>
                </div>
    `;
        }

        if (node.type !== 'group')
            return html`
                <div
                    key=${key}
                    class=${`flex flex-${node.flexDirection} overflow-hidden`}
                    style=${{ flex: node._sizePct ?? 1, border: node.type === 'group' ? '1px solid cyan' : undefined }}
                >
                    ${node.children.map((child, i) => renderNode(child, `${key}-${i}`, getColor, getText, onClick))}
                </div>
            `;

        return html`
        <div
            class="flex flex-col overflow-hidden"
            style=${{
                flex: node._sizePct ?? 1,
                ...(node.type === 'group' ? {
                    border: '2px solid var(--border)',
                    backgroundColor: 'var(--border)',
                } : {})
            }}
        >
            <div
                style="cursor: pointer; color: white;"
                onClick=${() => onClick(node)}
                onMouseEnter=${() => setHoveredNode(node)}
                onMouseLeave=${() => setHoveredNode(null)}
            >
                ${getText(node)}
            </div>
            ${node.children.map((child, i) => renderNode(child, `${key}-${i}`, getColor, getText, onClick))}
        </div>`;
    };

    useEffect(() => {
        const handleResize = () => {
            const tabElement = document.getElementById('market-heat-map-tab');
            if (tabElement) {
                setTabSize({ width: tabElement.clientWidth, height: tabElement.clientHeight });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const value2RGBA = (value, maxValue = 20) => {
        // Helper: clamp between 0–255
        const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));

        if (value > 0) {
            // Base green: rgb(34, 197, 94)
            const scale = Math.max(value / maxValue, 0.2); // scale toward full intensity
            const r = clamp(34 * scale);
            const g = clamp(197 * scale);
            const b = clamp(94 * scale);
            return `rgb(${r}, ${g}, ${b})`;
        }

        else if (value < 0) {
            // Base red: rgb(239, 68, 68)
            const scale = Math.min(-value / maxValue, 0.2);
            const r = clamp(239 * scale);
            const g = clamp(68 * scale);
            const b = clamp(68 * scale);
            return `rgb(${r}, ${g}, ${b})`;
        }

        // Neutral gray (unchanged)
        return 'rgb(0, 0, 0)';
    };

    const maxPriceChange = Math.max(...allCompanies.map(c => Math.abs(c.priceChange || 0)), 1);
    const maxDemandGrowth = Math.max(...allIndustries.map(i => Math.abs(i.demandGrowth || 0)), 1);

    return html`
        <div id="market-heat-map-tab" class="w-full h-auto">
            <${Tabs}>
                <${Tab} label="All Sectors" id=${api.UI_INDUSTRIES_HEATMAP}>
                    <div style="position: absolute; padding: 10px; font-size: 0.9em; background: rgba(20, 20, 20, 0.8); border: 1px solid rgba(100, 100, 100, 0.5); border-radius: 5px; margin: 10px; z-index: 10;">
                        ${hoveredNode
            ? html`
                                ${hoveredNode.name}<br/>
                                Demand Growth: ${typeof hoveredNode.demandGrowth === 'number' ? hoveredNode.demandGrowth.toFixed(2) + '%' : '\u00A0'}<br/>
                                Long-Term Growth: ${typeof hoveredNode.permDemandGrowth === 'number' ? hoveredNode.permDemandGrowth.toFixed(2) + '%' : '\u00A0'}<br/>
                                Total Market Cap: ${typeof hoveredNode.totalMarketCap === 'number' ? '$' + (parseFloat(hoveredNode.totalMarketCap.toFixed(0))).toLocaleString() : '\u00A0'}
                            `
            : html`Hover over a sector to see details<br/>${'\u00A0'}<br/>${'\u00A0'}<br/>${'\u00A0'}`}
                    </div>
                    <div class="flex w-full flex-${industriesMarketCapTree.flexDirection}" style="height: ${tabSize.width}px">
                        ${industriesMarketCapTree.children.map((node, i) => renderNode(node,
                            `root-${i}`, ind => value2RGBA(ind.demandGrowth, maxDemandGrowth),
                            ind => ind.name,
                            ind => api.viewIndustry(ind.id)))}
                    </div>
                <//>
                <${Tab} label="Companies by Sector" id=${api.UI_COMPANIES_HEATMAP}>
                    <div style="position: absolute; padding: 10px; font-size: 0.9em; background: rgba(20, 20, 20, 0.8); border: 1px solid rgba(100, 100, 100, 0.5); border-radius: 5px; margin: 10px; z-index: 10;">
                        ${hoveredNode
                            ? hoveredNode.type === 'group'
                            ? html`
                                ${hoveredNode.name}<br/>
                                Demand Growth: ${typeof hoveredNode.demandGrowth === 'number' ? hoveredNode.demandGrowth.toFixed(2) + '%' : '\u00A0'}<br/>
                                Long-Term Growth: ${typeof hoveredNode.permDemandGrowth === 'number' ? hoveredNode.permDemandGrowth.toFixed(2) + '%' : '\u00A0'}<br/>
                                Total Market Cap: ${typeof hoveredNode.totalMarketCap === 'number' ? '$' + (parseFloat(hoveredNode.totalMarketCap.toFixed(0))).toLocaleString() : '\u00A0'}
                            `
            : html`
                                ${hoveredNode.name}<br/>
                                Stock Price: ${typeof hoveredNode.price === 'number'
                    ? '$' + (parseFloat(hoveredNode.price.toFixed(2))).toLocaleString() + ` (${hoveredNode.priceChange >= 0 ? '+' : ''}${(hoveredNode.priceChange / hoveredNode.price * 100).toFixed(2)}%)`
                    : '\u00A0'}<br/>
                                Outstanding Shares: ${typeof hoveredNode.outstandingShares === 'number' ? (parseFloat(hoveredNode.outstandingShares.toFixed(2))).toLocaleString() : '\u00A0'} million<br/>
                                Market Cap: ${typeof hoveredNode.marketCap === 'number' ? '$' + (parseFloat(hoveredNode.marketCap.toFixed(0))).toLocaleString() : '\u00A0'}<br/>`
            : html`Hover over a company to see details<br/>${'\u00A0'}<br/>${'\u00A0'}<br/>${'\u00A0'}`}
                    </div>
                    <div class="flex w-full flex-${companyTree.flexDirection}" style="height: 2000px">
                        ${companyTree.children.map((node, i) => renderNode(node,
                            `root-${i}`,
                            comp => value2RGBA(comp.priceChange, maxPriceChange),
                            x => x.symbol ?? x.name,
                            x => x.symbol ? api.setViewAsset(x.id) : api.viewIndustry(x.id)))}
                    </div>
                <//>
            <//>
        </div>
    `;
}

export default MarketHeatMapTab;