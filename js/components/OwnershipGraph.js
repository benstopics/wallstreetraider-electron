import { html, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';
import { useHotkey } from '../hooks/useHotkey.js';
import { PRIORITY } from '../hotkeyManager.js';
import { isEditableTarget } from '../keybinds.js';

// Node dimensions
const NODE_WIDTH = 180;
const NODE_HEIGHT = 50;  // Compact 2-row height
const NODE_HEIGHT_TALL = 70;  // 3-row height for nodes with CEO/PLAYER indicator
const NODE_PADDING = 15;
const CENTER_GAP = 120;

// Determine if a node needs the tall height (has 3rd row content)
const needsTallHeight = (node, isCenter) => {
    const isChair = node.isPlayerChair;
    const isPlayer = node.entityId >= 1 && node.entityId <= 5;
    // Center with CEO, non-center with CEO, or non-center player
    return (isCenter && isChair) || (!isCenter && isChair) || (isPlayer && !isCenter && !isChair);
};

// Format price with currency symbols
const formatPrice = (price, dlrSign = '$', euro = '') => {
    if (price === 0 || price === undefined) return '';
    return `${dlrSign}${price.toFixed(2)}${euro}`;
};

// Format percentage
const formatPercent = (pct) => `${pct}%`;

// Truncate name if too long
const truncateName = (name, maxLen = 20) => {
    if (!name) return '';
    return name.length > maxLen ? name.substring(0, maxLen - 2) + '...' : name;
};

// Single node component
const GraphNode = ({ node, x, y, isCenter, onClick, dlrSign = '$', euro = '', numberLabel = null }) => {
    const isChair = node.isPlayerChair;
    const isPlayer = node.entityId >= 1 && node.entityId <= 5;
    const hasTallContent = needsTallHeight(node, isCenter);
    const nodeHeight = hasTallContent ? NODE_HEIGHT_TALL : NODE_HEIGHT;

    // Colors matching the theme
    const bgColor = isCenter
        ? 'rgba(59, 130, 246, 0.25)' // Blue for center
        : isChair
            ? 'rgba(234, 179, 8, 0.2)' // Gold/yellow for chair
            : 'rgba(255, 255, 255, 0.06)';

    const borderColor = isCenter
        ? 'rgba(59, 130, 246, 0.6)'
        : isChair
            ? 'rgba(234, 179, 8, 0.6)'
            : 'rgba(255, 255, 255, 0.15)';

    const handleClick = () => {
        if (onClick && node.entityId > 10) {
            onClick(node.entityId);
        }
    };

    return html`
        <g transform="translate(${x}, ${y})"
           style="cursor: ${node.entityId > 10 ? 'pointer' : 'default'}"
           onclick=${handleClick}>
            <!-- Background rect -->
            <rect
                width=${NODE_WIDTH}
                height=${nodeHeight}
                rx="8"
                ry="8"
                fill=${bgColor}
                stroke=${borderColor}
                stroke-width=${isCenter ? 2 : 1}
            />

            <!-- Company name -->
            <text
                x=${NODE_WIDTH / 2}
                y="20"
                text-anchor="middle"
                fill="#e6ebf5"
                font-size="12"
                font-weight="600">
                ${truncateName(node.name)}
            </text>

            <!-- Symbol and Price (left) -->
            <text
                x="10"
                y="38"
                text-anchor="start"
                fill="rgba(230, 235, 245, 0.7)"
                font-size="11">
                ${node.symbol}${node.price ? ` \u2022 ${formatPrice(node.price, dlrSign, euro)}` : ''}
            </text>

            <!-- Ownership percentage (right, shown for all non-center nodes) -->
            ${!isCenter && node.percentOwned ? html`
                <text
                    x=${NODE_WIDTH - 10}
                    y="38"
                    text-anchor="end"
                    fill=${isChair ? '#eab308' : '#22c55e'}
                    font-size="11"
                    font-weight="600">
                    ${formatPercent(node.percentOwned)}
                </text>
            ` : ''}

            <!-- CEO indicator for center node -->
            ${isCenter && isChair ? html`
                <text
                    x=${NODE_WIDTH / 2}
                    y="55"
                    text-anchor="middle"
                    fill="#eab308"
                    font-size="11"
                    font-weight="600">
                    \u2605 You are CEO
                </text>
            ` : ''}

            <!-- CEO indicator for non-center node -->
            ${!isCenter && isChair ? html`
                <text
                    x=${NODE_WIDTH / 2}
                    y="55"
                    text-anchor="middle"
                    fill="#eab308"
                    font-size="11"
                    font-weight="600">
                    \u2605 CEO
                </text>
            ` : ''}

            <!-- Player indicator -->
            ${isPlayer && !isCenter && !isChair ? html`
                <text
                    x=${NODE_WIDTH / 2}
                    y="55"
                    text-anchor="middle"
                    fill="#a855f7"
                    font-size="10"
                    font-weight="500">
                    PLAYER
                </text>
            ` : ''}

            <!-- Number badge for hotkey -->
            ${numberLabel != null ? html`
                <circle
                    cx="-4"
                    cy="-4"
                    r="10"
                    fill="rgba(59, 130, 246, 0.8)"
                    stroke="rgba(255,255,255,0.3)"
                    stroke-width="1"
                />
                <text
                    x="-4"
                    y="0"
                    text-anchor="middle"
                    fill="#ffffff"
                    font-size="11"
                    font-weight="700">
                    ${numberLabel}
                </text>
            ` : ''}
        </g>
    `;
};

// Connection line between nodes
const ConnectionLine = ({ x1, y1, x2, y2, percent, isLeft }) => {
    // Calculate control points for bezier curve
    const midX = (x1 + x2) / 2;
    const cp1x = isLeft ? x1 + 40 : x1 - 40;
    const cp2x = isLeft ? x2 - 40 : x2 + 40;

    const path = `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;

    // Color based on ownership percentage
    const opacity = Math.min(0.3 + (percent / 100) * 0.5, 0.8);

    return html`
        <g>
            <path
                d=${path}
                fill="none"
                stroke="rgba(59, 130, 246, ${opacity})"
                stroke-width="2"
            />
            <!-- Percentage label on line -->
            <text
                x=${midX}
                y=${(y1 + y2) / 2 - 5}
                text-anchor="middle"
                fill="rgba(230, 235, 245, 0.6)"
                font-size="10"
                font-weight="500">
                ${percent}%
            </text>
        </g>
    `;
};

// Flatten tree to get only direct children (first level)
const getDirectChildren = (tree) => {
    if (!tree || !tree.owners) return [];
    return tree.owners;
};

const OwnershipGraph = ({ showOwners = true, showSubsidiaries = true, startNumber = 1 }) => {
    const [ownershipData, setOwnershipData] = useState(null);
    const [subsidiariesData, setSubsidiariesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const dlrSign = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro = api.useGameStore(s => s.gameState.euro) || '';

    // Fetch data when active entity changes
    useEffect(() => {
        const fetchData = async () => {
            if (!activeEntityNum) return;

            setLoading(true);
            setError(null);

            try {
                const [ownership, subsidiaries] = await Promise.all([
                    showOwners ? api.getOwnershipTree() : Promise.resolve(null),
                    showSubsidiaries ? api.getSubsidiariesTree() : Promise.resolve(null)
                ]);

                setOwnershipData(ownership);
                setSubsidiariesData(subsidiaries);
            } catch (err) {
                console.error('Failed to fetch ownership data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeEntityNum, showOwners, showSubsidiaries]);

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: Math.max(rect.width, 600),
                    height: Math.max(rect.height, 300)
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const handleNodeClick = (entityId) => {
        api.setViewAsset(entityId);
    };

    if (loading) {
        return html`
            <div ref=${containerRef} class="ownership-graph-container" style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted);">
                Loading ownership data...
            </div>
        `;
    }

    if (error) {
        return html`
            <div ref=${containerRef} class="ownership-graph-container" style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ef4444;">
                Error: ${error}
            </div>
        `;
    }

    // Get direct owners and subsidiaries
    const owners = showOwners && ownershipData ? getDirectChildren(ownershipData) : [];
    const subsidiaries = showSubsidiaries && subsidiariesData ? getDirectChildren(subsidiariesData) : [];

    // Build numbered node map for hotkeys (only clickable nodes with entityId > 10)
    const numberedNodesRef = useRef([]);
    const numberedNodes = [];
    let nodeNum = startNumber;
    for (const owner of owners) {
        if (owner.entityId > 10) {
            numberedNodes.push({ num: nodeNum++, entityId: owner.entityId, side: 'owner' });
        }
    }
    for (const sub of subsidiaries) {
        if (sub.entityId > 10) {
            numberedNodes.push({ num: nodeNum++, entityId: sub.entityId, side: 'sub' });
        }
    }
    numberedNodesRef.current = numberedNodes;

    // Build lookup: node entityId → number label
    const nodeNumberMap = new Map();
    for (const n of numberedNodes) {
        nodeNumberMap.set(n.entityId, n.num);
    }

    // Hotkey handler for digit keys → navigate to numbered node
    const hotkeyIdRef = useRef(Symbol('ownership-graph-hotkey'));
    useHotkey(
        hotkeyIdRef.current,
        PRIORITY.TABS - 1,  // Just below TABS so tabs still work
        (e) => {
            if (isEditableTarget(e.target)) return false;
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return false;
            return /^[1-9]$/.test(e.key);
        },
        (e) => {
            const digit = parseInt(e.key, 10);
            const node = numberedNodesRef.current.find(n => n.num === digit);
            if (node) {
                e.stopImmediatePropagation();
                e.preventDefault();
                api.setViewAsset(node.entityId);
                return true;
            }
            return false;
        },
        {},
        [numberedNodes.length]
    );

    // Use ownership data for center node info (it has the root entity)
    const centerEntity = ownershipData || subsidiariesData;

    if (!centerEntity) {
        return html`
            <div ref=${containerRef} class="ownership-graph-container" style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted);">
                No ownership data available
            </div>
        `;
    }

    const { width, height } = dimensions;

    // Use tall height for layout spacing to ensure nodes don't overlap
    const layoutHeight = NODE_HEIGHT_TALL;

    // Calculate center node height
    const centerNodeHeight = needsTallHeight(centerEntity, true) ? NODE_HEIGHT_TALL : NODE_HEIGHT;

    // Calculate required height based on content
    const maxNodes = Math.max(owners.length, subsidiaries.length, 1);
    const requiredContentHeight = maxNodes * (layoutHeight + NODE_PADDING) + 60; // 60 for top/bottom padding
    const svgHeight = Math.max(height, requiredContentHeight);

    // Calculate positions
    const centerX = width / 2 - NODE_WIDTH / 2;
    const centerY = svgHeight / 2 - centerNodeHeight / 2;

    // Calculate owner positions (left side)
    const ownerStartY = Math.max(30, centerY + centerNodeHeight / 2 - ((owners.length) * (layoutHeight + NODE_PADDING)) / 2 + NODE_PADDING / 2);
    const ownerX = centerX - CENTER_GAP - NODE_WIDTH;

    // Calculate subsidiary positions (right side)
    const subStartY = Math.max(30, centerY + centerNodeHeight / 2 - ((subsidiaries.length) * (layoutHeight + NODE_PADDING)) / 2 + NODE_PADDING / 2);
    const subX = centerX + NODE_WIDTH + CENTER_GAP;

    return html`
        <div ref=${containerRef} class="ownership-graph-container" style="width: 100%; height: 100%; overflow: auto;">
            <svg width=${width} height=${svgHeight} style="display: block;">
                <!-- Background -->
                <rect width=${width} height=${svgHeight} fill="transparent" />

                <!-- Connection lines from owners to center -->
                ${owners.map((owner, i) => {
                    const ownerY = ownerStartY + i * (layoutHeight + NODE_PADDING);
                    const ownerNodeHeight = needsTallHeight(owner, false) ? NODE_HEIGHT_TALL : NODE_HEIGHT;
                    return html`
                        <${ConnectionLine}
                            x1=${ownerX + NODE_WIDTH}
                            y1=${ownerY + ownerNodeHeight / 2}
                            x2=${centerX}
                            y2=${centerY + centerNodeHeight / 2}
                            percent=${owner.percentOwned}
                            isLeft=${true}
                        />
                    `;
                })}

                <!-- Connection lines from center to subsidiaries -->
                ${subsidiaries.map((sub, i) => {
                    const subY = subStartY + i * (layoutHeight + NODE_PADDING);
                    const subNodeHeight = needsTallHeight(sub, false) ? NODE_HEIGHT_TALL : NODE_HEIGHT;
                    return html`
                        <${ConnectionLine}
                            x1=${centerX + NODE_WIDTH}
                            y1=${centerY + centerNodeHeight / 2}
                            x2=${subX}
                            y2=${subY + subNodeHeight / 2}
                            percent=${sub.percentOwned}
                            isLeft=${false}
                        />
                    `;
                })}

                <!-- Owner nodes (left) -->
                ${owners.map((owner, i) => {
                    const ownerY = ownerStartY + i * (layoutHeight + NODE_PADDING);
                    return html`
                        <${GraphNode}
                            node=${owner}
                            x=${ownerX}
                            y=${ownerY}
                            isCenter=${false}
                            onClick=${handleNodeClick}
                            dlrSign=${dlrSign}
                            euro=${euro}
                            numberLabel=${nodeNumberMap.get(owner.entityId) || null}
                        />
                    `;
                })}

                <!-- Center node -->
                <${GraphNode}
                    node=${centerEntity}
                    x=${centerX}
                    y=${centerY}
                    isCenter=${true}
                    onClick=${null}
                    dlrSign=${dlrSign}
                    euro=${euro}
                />

                <!-- Subsidiary nodes (right) -->
                ${subsidiaries.map((sub, i) => {
                    const subY = subStartY + i * (layoutHeight + NODE_PADDING);
                    return html`
                        <${GraphNode}
                            node=${sub}
                            x=${subX}
                            y=${subY}
                            isCenter=${false}
                            onClick=${handleNodeClick}
                            dlrSign=${dlrSign}
                            euro=${euro}
                            numberLabel=${nodeNumberMap.get(sub.entityId) || null}
                        />
                    `;
                })}

                <!-- Column labels -->
                <!--${owners.length > 0 ? html`
                    <text
                        x=${ownerX + NODE_WIDTH / 2}
                        y="15"
                        text-anchor="middle"
                        fill="rgba(230, 235, 245, 0.5)"
                        font-size="11"
                        font-weight="600"
                        text-transform="uppercase">
                        OWNERS
                    </text>
                ` : ''}-->

                <!--${subsidiaries.length > 0 ? html`
                    <text
                        x=${subX + NODE_WIDTH / 2}
                        y="15"
                        text-anchor="middle"
                        fill="rgba(230, 235, 245, 0.5)"
                        font-size="11"
                        font-weight="600"
                        text-transform="uppercase">
                        HOLDINGS
                    </text>
                ` : ''}-->

                <!-- Empty state messages -->
                ${showOwners && owners.length === 0 ? html`
                    <text
                        x=${ownerX + NODE_WIDTH / 2}
                        y=${centerY + centerNodeHeight / 2}
                        text-anchor="middle"
                        fill="rgba(230, 235, 245, 0.3)"
                        font-size="11"
                        font-style="italic">
                        No shareholders
                    </text>
                ` : ''}

                ${showSubsidiaries && subsidiaries.length === 0 ? html`
                    <text
                        x=${subX + NODE_WIDTH / 2}
                        y=${centerY + centerNodeHeight / 2}
                        text-anchor="middle"
                        fill="rgba(230, 235, 245, 0.3)"
                        font-size="11"
                        font-style="italic">
                        No holdings
                    </text>
                ` : ''}
            </svg>
        </div>
    `;
};

export default OwnershipGraph;
