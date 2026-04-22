import { html, useState, useEffect, useRef, useCallback, useMemo } from '../lib/preact.standalone.module.js';
import * as api from '../api.js';

// Node dimensions
const NODE_WIDTH = 180;
const NODE_HEIGHT = 50;  // Compact 2-row height
const NODE_HEIGHT_TALL = 70;  // 3-row height for nodes with CEO/PLAYER indicator
const NODE_PADDING = 15;
const CENTER_GAP = 120;
const HORIZONTAL_PADDING = 40;
const VERTICAL_PADDING = 30;

// Max depth to render on each side. Circular ownership is prevented by the
// backend via a visited set, but deep trees can still exist — cap to avoid
// runaway layouts.
const MAX_DEPTH = 6;

// Zoom bounds and step
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_STEP = 1.15;

// Determine if a node needs the tall height (has 3rd row content)
const needsTallHeight = (node, isCenter) => {
    const isChair = node.isPlayerChair;
    const isPlayer = node.entityId >= 1 && node.entityId <= 5;
    return (isCenter && isChair) || (!isCenter && isChair) || (isPlayer && !isCenter && !isChair);
};

const getNodeHeight = (node, isCenter) =>
    needsTallHeight(node, isCenter) ? NODE_HEIGHT_TALL : NODE_HEIGHT;

// Format price with currency symbols
const formatPrice = (price, dlrSign = '$', euro = '') => {
    if (price === 0 || price === undefined) return '';
    return `${dlrSign}${price.toFixed(2)}${euro}`;
};

const formatPercent = (pct) => `${pct}%`;

const truncateName = (name, maxLen = 20) => {
    if (!name) return '';
    return name.length > maxLen ? name.substring(0, maxLen - 2) + '...' : name;
};

// Compute the full height needed for a subtree (for stacking siblings)
const computeSubtreeHeight = (node, depth, limit) => {
    const self = getNodeHeight(node, false);
    if (!node.owners || node.owners.length === 0 || depth >= limit) return self;
    let childH = 0;
    for (let i = 0; i < node.owners.length; i++) {
        childH += computeSubtreeHeight(node.owners[i], depth + 1, limit);
        if (i < node.owners.length - 1) childH += NODE_PADDING;
    }
    return Math.max(self, childH);
};

// Compute max depth reached in a subtree
const computeMaxDepth = (node, depth, limit) => {
    if (!node.owners || node.owners.length === 0 || depth >= limit) return depth;
    let m = depth;
    for (const child of node.owners) {
        const d = computeMaxDepth(child, depth + 1, limit);
        if (d > m) m = d;
    }
    return m;
};

// Single node component
const GraphNode = ({ node, x, y, isCenter, onClick, dlrSign = '$', euro = '', numberLabel = null, onNodeMouseDown }) => {
    const isChair = node.isPlayerChair;
    const isPlayer = node.entityId >= 1 && node.entityId <= 5;
    const nodeHeight = getNodeHeight(node, isCenter);
    const clickable = !!onClick && node.entityId > 10;

    const bgColor = isCenter
        ? 'rgba(59, 130, 246, 0.25)'
        : isChair
            ? 'rgba(234, 179, 8, 0.2)'
            : 'rgba(255, 255, 255, 0.06)';

    const borderColor = isCenter
        ? 'rgba(59, 130, 246, 0.6)'
        : isChair
            ? 'rgba(234, 179, 8, 0.6)'
            : 'rgba(255, 255, 255, 0.15)';

    const handleClick = (e) => {
        if (clickable) {
            e.stopPropagation();
            onClick(node.entityId);
        }
    };

    const handleMouseDown = (e) => {
        if (clickable && onNodeMouseDown) {
            onNodeMouseDown(e);
        }
    };

    return html`
        <g transform="translate(${x}, ${y})"
           style="cursor: ${clickable ? 'pointer' : 'default'}"
           onclick=${handleClick}
           onmousedown=${handleMouseDown}>
            <rect
                width=${NODE_WIDTH}
                height=${nodeHeight}
                rx="8"
                ry="8"
                fill=${bgColor}
                stroke=${borderColor}
                stroke-width=${isCenter ? 2 : 1}
            />
            <text x=${NODE_WIDTH / 2} y="20" text-anchor="middle" fill="#e6ebf5" font-size="12" font-weight="600">
                ${truncateName(node.name)}
            </text>
            <text x="10" y="38" text-anchor="start" fill="rgba(230, 235, 245, 0.7)" font-size="11">
                ${node.symbol}${node.price ? ` • ${formatPrice(node.price, dlrSign, euro)}` : ''}
            </text>
            ${!isCenter && node.percentOwned ? html`
                <text x=${NODE_WIDTH - 10} y="38" text-anchor="end"
                    fill=${isChair ? '#eab308' : '#22c55e'} font-size="11" font-weight="600">
                    ${formatPercent(node.percentOwned)}
                </text>
            ` : ''}
            ${isCenter && isChair ? html`
                <text x=${NODE_WIDTH / 2} y="55" text-anchor="middle" fill="#eab308" font-size="11" font-weight="600">
                    ★ You are CEO
                </text>
            ` : ''}
            ${!isCenter && isChair ? html`
                <text x=${NODE_WIDTH / 2} y="55" text-anchor="middle" fill="#eab308" font-size="11" font-weight="600">
                    ★ CEO
                </text>
            ` : ''}
            ${isPlayer && !isCenter && !isChair ? html`
                <text x=${NODE_WIDTH / 2} y="55" text-anchor="middle" fill="#a855f7" font-size="10" font-weight="500">
                    PLAYER
                </text>
            ` : ''}
            ${numberLabel != null ? html`
                <circle cx="-4" cy="-4" r="10"
                    fill="rgba(59, 130, 246, 0.8)"
                    stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                <text x="-4" y="0" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">
                    ${numberLabel}
                </text>
            ` : ''}
        </g>
    `;
};

// Connection line between nodes
const ConnectionLine = ({ x1, y1, x2, y2, percent, isLeft }) => {
    const midX = (x1 + x2) / 2;
    const cp1x = isLeft ? x1 + 40 : x1 - 40;
    const cp2x = isLeft ? x2 - 40 : x2 + 40;
    const path = `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;
    const opacity = Math.min(0.3 + (percent / 100) * 0.5, 0.8);

    return html`
        <g>
            <path d=${path} fill="none" stroke="rgba(59, 130, 246, ${opacity})" stroke-width="2"/>
            ${percent ? html`
                <text x=${midX} y=${(y1 + y2) / 2 - 5} text-anchor="middle"
                    fill="rgba(230, 235, 245, 0.6)" font-size="10" font-weight="500">
                    ${percent}%
                </text>
            ` : ''}
        </g>
    `;
};

// Recursively place a branch into `placements` and `edges`.
// side = -1 (owners, leftward) or +1 (subsidiaries, rightward).
const layoutBranch = (node, x, yTop, side, depth, limit, placements, edges, parentEdge) => {
    const selfHeight = getNodeHeight(node, false);
    const subtreeH = computeSubtreeHeight(node, depth, limit);
    const nodeY = yTop + (subtreeH - selfHeight) / 2;

    placements.push({ node, x, y: nodeY, height: selfHeight, depth });

    if (parentEdge) {
        edges.push({
            key: `${parentEdge.key}->${node.entityId}-${depth}`,
            x1: parentEdge.x,
            y1: parentEdge.y,
            x2: side < 0 ? x + NODE_WIDTH : x,
            y2: nodeY + selfHeight / 2,
            percent: node.percentOwned,
            isLeft: side < 0,
        });
    }

    if (depth >= limit || !node.owners || node.owners.length === 0) return;

    const childX = x + side * (NODE_WIDTH + CENTER_GAP);
    const edgeSource = {
        key: `${node.entityId}-${depth}`,
        x: side < 0 ? x : x + NODE_WIDTH,
        y: nodeY + selfHeight / 2,
    };

    let curYTop = yTop;
    for (const child of node.owners) {
        const childH = computeSubtreeHeight(child, depth + 1, limit);
        layoutBranch(child, childX, curYTop, side, depth + 1, limit, placements, edges, edgeSource);
        curYTop += childH + NODE_PADDING;
    }
};

const getDirectChildren = (tree) => {
    if (!tree || !tree.owners) return [];
    return tree.owners;
};

const OwnershipGraph = ({ showOwners = true, showSubsidiaries = true, startNumber = 1 }) => {
    const [ownershipData, setOwnershipData] = useState(null);
    const [subsidiariesData, setSubsidiariesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTick, setRefreshTick] = useState(0);
    const [viewport, setViewport] = useState({ panX: 0, panY: 0, zoom: 1 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const dragStateRef = useRef(null);
    const layoutSigRef = useRef(null);

    const activeEntityNum = api.useGameStore(s => s.gameState.activeEntityNum);
    const dlrSign = api.useGameStore(s => s.gameState.dlrSign) || '$';
    const euro = api.useGameStore(s => s.gameState.euro) || '';

    // Fetch ownership/subsidiary trees for the active entity.
    //
    // setViewAsset updates activeEntityNum optimistically in the store, but the
    // PowerBASIC engine processes the navigation event asynchronously on its
    // game loop. The backend's /ownership_tree reads its own activeEntityNum,
    // so a fetch issued right after the optimistic update can return the
    // PREVIOUS entity's tree. Worse, when the engine later catches up and the
    // WS pushes activeEntityNum=B, the store already had B (optimistic), so
    // useGameStore's Object.is check sees no change → no re-render → stale.
    //
    // Fix: poll with retry. Each response carries the engine's actual root
    // entityId; if it doesn't match the entity we asked for, wait briefly and
    // try again until the engine catches up (or we time out).
    useEffect(() => {
        let cancelled = false;
        const expectedEntity = activeEntityNum;

        const fetchData = async () => {
            if (!expectedEntity) return;

            setLoading(true);
            setError(null);

            const maxAttempts = 20;
            const delayMs = 50;

            try {
                for (let attempt = 0; attempt < maxAttempts; attempt++) {
                    const [ownership, subsidiaries] = await Promise.all([
                        showOwners ? api.getOwnershipTree() : Promise.resolve(null),
                        showSubsidiaries ? api.getSubsidiariesTree() : Promise.resolve(null)
                    ]);

                    if (cancelled) return;

                    const rootEntity = ownership?.entityId ?? subsidiaries?.entityId;
                    if (rootEntity == null || rootEntity === expectedEntity) {
                        setOwnershipData(ownership);
                        setSubsidiariesData(subsidiaries);
                        return;
                    }

                    await new Promise(r => setTimeout(r, delayMs));
                    if (cancelled) return;
                }

                console.warn('OwnershipGraph: backend never confirmed entity', expectedEntity);
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to fetch ownership data:', err);
                setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [activeEntityNum, refreshTick, showOwners, showSubsidiaries]);

    // Observe container size for fit-to-view calculations
    useEffect(() => {
        if (!containerRef.current) return;
        const update = () => {
            const r = containerRef.current?.getBoundingClientRect();
            if (r) setContainerSize({ width: r.width, height: r.height });
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(containerRef.current);
        window.addEventListener('resize', update);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', update);
        };
    }, []);

    // Compute the full layout from the tree data
    const layout = useMemo(() => {
        const centerEntity = ownershipData || subsidiariesData;
        if (!centerEntity) return null;

        const owners = showOwners && ownershipData ? getDirectChildren(ownershipData) : [];
        const subs = showSubsidiaries && subsidiariesData ? getDirectChildren(subsidiariesData) : [];

        const ownerHeights = owners.map(o => computeSubtreeHeight(o, 1, MAX_DEPTH));
        const subHeights = subs.map(s => computeSubtreeHeight(s, 1, MAX_DEPTH));

        const ownerTotalH = ownerHeights.reduce((a, b) => a + b, 0)
            + Math.max(0, owners.length - 1) * NODE_PADDING;
        const subTotalH = subHeights.reduce((a, b) => a + b, 0)
            + Math.max(0, subs.length - 1) * NODE_PADDING;

        const centerH = getNodeHeight(centerEntity, true);
        const contentH = Math.max(centerH, ownerTotalH, subTotalH, 200);

        const maxOwnerDepth = owners.length
            ? Math.max(...owners.map(o => computeMaxDepth(o, 1, MAX_DEPTH)))
            : 0;
        const maxSubDepth = subs.length
            ? Math.max(...subs.map(s => computeMaxDepth(s, 1, MAX_DEPTH)))
            : 0;

        const leftWidth = maxOwnerDepth * (NODE_WIDTH + CENTER_GAP);
        const rightWidth = maxSubDepth * (NODE_WIDTH + CENTER_GAP);

        const centerX = HORIZONTAL_PADDING + leftWidth;
        const contentW = leftWidth + NODE_WIDTH + rightWidth;
        const svgW = contentW + HORIZONTAL_PADDING * 2;
        const svgH = contentH + VERTICAL_PADDING * 2;

        const placements = [];
        const edges = [];

        const centerY = VERTICAL_PADDING + (contentH - centerH) / 2;
        placements.push({
            node: centerEntity, x: centerX, y: centerY,
            height: centerH, depth: 0, isCenter: true,
        });

        if (owners.length > 0) {
            const ownerTopY = VERTICAL_PADDING + (contentH - ownerTotalH) / 2;
            const centerEdgeLeft = {
                key: `center-${centerEntity.entityId}`,
                x: centerX,
                y: centerY + centerH / 2,
            };
            let curY = ownerTopY;
            for (let i = 0; i < owners.length; i++) {
                const ownerX = centerX - (NODE_WIDTH + CENTER_GAP);
                layoutBranch(owners[i], ownerX, curY, -1, 1, MAX_DEPTH, placements, edges, centerEdgeLeft);
                curY += ownerHeights[i] + NODE_PADDING;
            }
        }

        if (subs.length > 0) {
            const subTopY = VERTICAL_PADDING + (contentH - subTotalH) / 2;
            const centerEdgeRight = {
                key: `center-${centerEntity.entityId}`,
                x: centerX + NODE_WIDTH,
                y: centerY + centerH / 2,
            };
            let curY = subTopY;
            for (let i = 0; i < subs.length; i++) {
                const subX = centerX + NODE_WIDTH + CENTER_GAP;
                layoutBranch(subs[i], subX, curY, +1, 1, MAX_DEPTH, placements, edges, centerEdgeRight);
                curY += subHeights[i] + NODE_PADDING;
            }
        }

        // Numbered hotkey labels: only for top-level (depth 1) nodes, matching
        // what the text report shows.
        const numbered = new Map();
        let num = startNumber;
        for (const p of placements) {
            if (p.isCenter || p.depth !== 1) continue;
            if (p.node.entityId > 10 && !numbered.has(p.node.entityId)) {
                numbered.set(p.node.entityId, num++);
            }
        }

        return {
            placements, edges, svgW, svgH, centerX, centerY, centerH,
            centerEntity, numbered, owners, subs,
        };
    }, [ownershipData, subsidiariesData, showOwners, showSubsidiaries, startNumber]);

    // Fit-to-view whenever a new tree (different entity or shape) loads.
    // Preserves user zoom/pan across re-renders of the same tree.
    useEffect(() => {
        if (!layout || !containerSize.width) return;
        const sig = `${layout.centerEntity?.entityId}-${layout.svgW}-${layout.svgH}`;
        if (layoutSigRef.current === sig) return;
        layoutSigRef.current = sig;

        const fitZoomX = containerSize.width / layout.svgW;
        const fitZoomY = containerSize.height / layout.svgH;
        const fitZoom = Math.min(fitZoomX, fitZoomY, 1);
        const clampedZoom = Math.max(MIN_ZOOM, fitZoom);

        const scaledW = layout.svgW * clampedZoom;
        const scaledH = layout.svgH * clampedZoom;
        setViewport({
            zoom: clampedZoom,
            panX: (containerSize.width - scaledW) / 2,
            panY: (containerSize.height - scaledH) / 2,
        });
    }, [layout, containerSize]);

    // Wheel zoom — Preact attaches listeners non-passively via addEventListener
    // without options, so preventDefault() works from a regular onwheel prop.
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;

        setViewport(v => {
            const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
            if (newZoom === v.zoom) return v;
            const actualFactor = newZoom / v.zoom;
            return {
                zoom: newZoom,
                panX: mouseX - (mouseX - v.panX) * actualFactor,
                panY: mouseY - (mouseY - v.panY) * actualFactor,
            };
        });
    }, []);

    // Global mousemove/up while dragging — so the drag continues even if the
    // mouse leaves the SVG.
    useEffect(() => {
        if (!isDragging) return;

        const onMove = (e) => {
            const s = dragStateRef.current;
            if (!s) return;
            const dx = e.clientX - s.startX;
            const dy = e.clientY - s.startY;
            setViewport(v => ({
                ...v,
                panX: s.initPanX + dx,
                panY: s.initPanY + dy,
            }));
        };
        const onUp = () => {
            dragStateRef.current = null;
            setIsDragging(false);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [isDragging]);

    const handleSvgMouseDown = useCallback((e) => {
        if (e.button !== 0) return;
        dragStateRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initPanX: viewport.panX,
            initPanY: viewport.panY,
        };
        setIsDragging(true);
    }, [viewport.panX, viewport.panY]);

    // Node mousedown stops propagation so clicking a node doesn't start a drag.
    const handleNodeMouseDown = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const handleReset = useCallback(() => {
        if (!layout || !containerSize.width) return;
        const fitZoomX = containerSize.width / layout.svgW;
        const fitZoomY = containerSize.height / layout.svgH;
        const fitZoom = Math.min(fitZoomX, fitZoomY, 1);
        const clampedZoom = Math.max(MIN_ZOOM, fitZoom);
        const scaledW = layout.svgW * clampedZoom;
        const scaledH = layout.svgH * clampedZoom;
        setViewport({
            zoom: clampedZoom,
            panX: (containerSize.width - scaledW) / 2,
            panY: (containerSize.height - scaledH) / 2,
        });
    }, [layout, containerSize]);

    const zoomBy = useCallback((factor) => {
        setViewport(v => {
            const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
            if (newZoom === v.zoom) return v;
            // Zoom around container center
            const cx = containerSize.width / 2;
            const cy = containerSize.height / 2;
            const actualFactor = newZoom / v.zoom;
            return {
                zoom: newZoom,
                panX: cx - (cx - v.panX) * actualFactor,
                panY: cy - (cy - v.panY) * actualFactor,
            };
        });
    }, [containerSize.width, containerSize.height]);

    const handleNodeClick = async (entityId) => {
        await api.setViewAsset(entityId);
        setRefreshTick(t => t + 1);
    };

    if (loading) {
        return html`
            <div ref=${containerRef} class="ownership-graph-container"
                 style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted);">
                Loading ownership data...
            </div>
        `;
    }

    if (error) {
        return html`
            <div ref=${containerRef} class="ownership-graph-container"
                 style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ef4444;">
                Error: ${error}
            </div>
        `;
    }

    if (!layout) {
        return html`
            <div ref=${containerRef} class="ownership-graph-container"
                 style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted);">
                No ownership data available
            </div>
        `;
    }

    const { placements, edges, centerX, centerY, centerH, numbered, owners, subs } = layout;

    const btnStyle = 'background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #e6ebf5; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; line-height: 1; min-width: 28px;';

    return html`
        <div ref=${containerRef} class="ownership-graph-container"
             style="width: 100%; height: 100%; overflow: hidden; position: relative; user-select: none;">
            <svg
                ref=${svgRef}
                width="100%"
                height="100%"
                style="display: block; cursor: ${isDragging ? 'grabbing' : 'grab'}; touch-action: none; overscroll-behavior: contain;"
                onwheel=${handleWheel}
                onmousedown=${handleSvgMouseDown}>
                <g transform="translate(${viewport.panX}, ${viewport.panY}) scale(${viewport.zoom})">
                    <!-- Edges first so nodes paint on top -->
                    ${edges.map(e => html`
                        <${ConnectionLine} key=${e.key}
                            x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}
                            percent=${e.percent} isLeft=${e.isLeft} />
                    `)}

                    <!-- Nodes -->
                    ${placements.map(p => html`
                        <${GraphNode}
                            key=${`${p.node.entityId}-${p.depth}-${p.x}-${p.y}`}
                            node=${p.node}
                            x=${p.x}
                            y=${p.y}
                            isCenter=${!!p.isCenter}
                            onClick=${p.isCenter ? null : handleNodeClick}
                            dlrSign=${dlrSign}
                            euro=${euro}
                            numberLabel=${numbered.get(p.node.entityId) || null}
                            onNodeMouseDown=${handleNodeMouseDown}
                        />
                    `)}

                    ${showOwners && owners.length === 0 ? html`
                        <text
                            x=${centerX - 30}
                            y=${centerY + centerH / 2}
                            text-anchor="end"
                            fill="rgba(230, 235, 245, 0.3)"
                            font-size="11"
                            font-style="italic">
                            No shareholders
                        </text>
                    ` : ''}

                    ${showSubsidiaries && subs.length === 0 ? html`
                        <text
                            x=${centerX + NODE_WIDTH + 30}
                            y=${centerY + centerH / 2}
                            text-anchor="start"
                            fill="rgba(230, 235, 245, 0.3)"
                            font-size="11"
                            font-style="italic">
                            No holdings
                        </text>
                    ` : ''}
                </g>
            </svg>

            <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; background: rgba(0,0,0,0.35); padding: 4px; border-radius: 6px;">
                <button title="Zoom in" style=${btnStyle} onclick=${() => zoomBy(ZOOM_STEP)}>+</button>
                <button title="Zoom out" style=${btnStyle} onclick=${() => zoomBy(1 / ZOOM_STEP)}>−</button>
                <button title="Fit to view" style=${btnStyle} onclick=${handleReset}>Reset</button>
            </div>

            <div style="position: absolute; bottom: 6px; left: 10px; color: rgba(230,235,245,0.45); font-size: 10px; pointer-events: none;">
                Scroll to zoom • Drag to pan • Click a node to navigate
            </div>
        </div>
    `;
};

export default OwnershipGraph;
