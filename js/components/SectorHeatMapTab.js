import { html, useEffect, useState } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import { squarify } from './MarketHeatMapTab.js';


function SectorHeatMapTab() {

    const [tabSize, setTabSize] = useState({ width: 600, height: 1200 });
    const [hoveredNode, setHoveredNode] = useState(null);

    const activeIndustryNum = api.useGameStore(s => s.gameState.activeIndustryNum);
    const allCompanies = api.useGameStore(s => s.gameState.allCompanies);
    const allIndustries = api.useGameStore(s => s.gameState.allIndustries);
    const activeIndustryCompanies = allCompanies.filter(c => c.industryId === activeIndustryNum);
    const allCompaniesBySector = JSON.parse(JSON.stringify(allIndustries));

    allCompaniesBySector.forEach(ind => {
        ind.children = allCompanies.filter(comp => comp.industryId === ind.id);
    });

    const controlledCompanies = api.useGameStore(s => s.gameState.controlledCompanies) || [];

    const industryMarketCapTree = squarify(tabSize.width, tabSize.height, activeIndustryCompanies, ind => ind.marketCap);

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
            const tabElement = document.getElementById('sector-heat-map-tab');
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

    return html`<div style="position: absolute; padding: 10px; font-size: 0.9em; background: rgba(20, 20, 20, 0.8); border: 1px solid rgba(100, 100, 100, 0.5); border-radius: 5px; margin: 10px; z-index: 10;">
            ${hoveredNode
    ? html`
                    ${hoveredNode.name}<br/>
                    Stock Price: ${typeof hoveredNode.price === 'number'
            ? '$' + (parseFloat(hoveredNode.price.toFixed(2))).toLocaleString() + ` (${hoveredNode.priceChange >= 0 ? '+' : ''}${(hoveredNode.priceChange / hoveredNode.price * 100).toFixed(2)}%)`
            : '\u00A0'}<br/>
                    Outstanding Shares: ${typeof hoveredNode.outstandingShares === 'number' ? (parseFloat(hoveredNode.outstandingShares.toFixed(2))).toLocaleString() : '\u00A0'} million<br/>
                    Market Cap: ${typeof hoveredNode.marketCap === 'number' ? '$' + (parseFloat(hoveredNode.marketCap.toFixed(0))).toLocaleString() : '\u00A0'}<br/>`
    : html`Hover over a company to see details<br/>${'\u00A0'}<br/>${'\u00A0'}<br/>${'\u00A0'}`}
        </div>
        <div class="flex w-full flex-${industryMarketCapTree.flexDirection}" style="height: ${tabSize.width}px">
            ${industryMarketCapTree.children.map((node, i) => renderNode(node,
                `root-${i}`,
                comp => value2RGBA(comp.priceChange, maxPriceChange),
                comp => comp.name,
                comp => api.setViewAsset(comp.id)))}
        </div>`;
}

export default SectorHeatMapTab;