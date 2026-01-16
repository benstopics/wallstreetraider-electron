import { html, useEffect, useRef, useMemo } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';
import { DEFAULT_ASSET_PRICE_CHART_THEME } from '../../css/chart-styles.js';

/**
 * InTheMoneyChart
 *
 * Render a simple P/L-at-expiration curve for a multi-leg options position.
 *
 * Props:
 *  - contracts: Array<{
 *      type: 'PUT'|'CALL',
 *      bs: 'B'|'S'|''|null,
 *      strike: number|string,
 *      pct: number|string,          // contract size as % of company stock (1..10)
 *      pricePerPct: number|string,  // premium per 1% contract, in MILLIONS
 *    }>
 *  - totalShares: number             // total company shares outstanding for 100%
 *  - currentPrice?: number           // optional marker + range anchoring
 *  - chartTitle?: string
 *  - theme?: DEFAULT_ASSET_PRICE_CHART_THEME-compatible object
 *  - profitColor?: string            // defaults to a green
 *  - lossColor?: string              // defaults to a red
 *  - breakevenLineColor?: string     // defaults to theme.gridColor (or gray)
 *  - points?: number                 // x-samples (default 120)
 *
 * Units:
 *  - Y axis is "Profit / Loss" in MILLIONS.
 */

function toNum(v) {
    if (v == null) return null;
    const s = String(v).trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

function clamp(n, a, b) {
    return Math.min(b, Math.max(a, n));
}

function formatMillions(v) {
    const sign = v < 0 ? '-' : '';
    const abs = Math.abs(v);
    const rounded = abs >= 100 ? abs.toFixed(0) : abs >= 10 ? abs.toFixed(1) : abs.toFixed(2);
    return `${sign}${rounded}M`;
}

let printed = 0

function payoffMillionsAtPrice(S, contracts, totalSharesM) {
    let total = 0; // millions
    const sharesPerPct = totalSharesM / 100.0;

    for (const c of contracts || []) {
        const type = (c.type || '').toUpperCase();
        const bs = (c.bs || '').toUpperCase();
        const strike = toNum(c.strike);
        const pct = toNum(c.pct);
        const pricePerPct = toNum(c.pricePerPct);

        if (!strike || !pct || !pricePerPct || (bs !== 'B' && bs !== 'S') || (type !== 'PUT' && type !== 'CALL')) {
            continue; // ignore incomplete legs
        }

        const shares = sharesPerPct * pct;
        const premiumM = pricePerPct * pct; // millions

        let intrinsicDollars = 0;
        if (type === 'CALL') intrinsicDollars = Math.max(0, S - strike) * shares;
        if (type === 'PUT') intrinsicDollars = Math.max(0, strike - S) * shares;

        const intrinsicM = intrinsicDollars / 1_000_000.0;
        const payoff = bs === 'B' ? intrinsicM - premiumM : premiumM - intrinsicM;

        if (printed < 8 && S > 19 && S < 31) {
            printed++;
            console.log({ S, type, bs, strike, pct, pricePerPct, shares, premiumM, intrinsicDollars, intrinsicM, payoff });
        }

        total += payoff;
    }

    return total;
}

const InTheMoneyChart = ({
    contracts = [],
    totalSharesM,
    currentPrice = undefined,
    chartTitle = 'In-The-Money (Expiration P/L)',
    theme = DEFAULT_ASSET_PRICE_CHART_THEME,
    profitColor = '#16a34a',
    lossColor = '#dc2626',
    breakevenLineColor = undefined,
    points = 120,
}) => {
    const canvasRef = useRef(null);

    const computed = useMemo(() => {
        const validStrikes = (contracts || [])
            .map((c) => toNum(c.strike))
            .filter((n) => Number.isFinite(n));

        const minStrike = validStrikes.length ? Math.min(...validStrikes) : null;
        const maxStrike = validStrikes.length ? Math.max(...validStrikes) : null;

        const cp = toNum(currentPrice);

        let xMin;
        let xMax;

        if (minStrike != null && maxStrike != null) {
            const mid = (minStrike + maxStrike) / 2;
            const spread = (maxStrike - minStrike) || (mid || 1);
            xMin = Math.max(0.01, minStrike - 0.5 * spread);
            xMax = Math.max(xMin + 0.01, maxStrike + 0.5 * spread);
        } else if (cp != null) {
            xMin = Math.max(0.01, cp * 0.5);
            xMax = Math.max(xMin + 0.01, cp * 1.5);
        } else {
            xMin = 1;
            xMax = 100;
        }

        if (cp != null) {
            xMin = 0;//Math.min(xMin, cp * 0.9);
            xMax = Math.max(xMax, cp * 2.0);
        }

        const nPts = clamp(points, 40, 400);
        const xs = [];
        const ys = [];

        if (!totalSharesM || !Number.isFinite(totalSharesM) || totalSharesM <= 0) {
            for (let i = 0; i < nPts; i++) {
                const x = xMin + (xMax - xMin) * (i / (nPts - 1));
                xs.push(x);
                ys.push(0);
            }
            return { xs, ys, xMin, xMax, yMin: -1, yMax: 1, cp };
        }

        for (let i = 0; i < nPts; i++) {
            const x = xMin + (xMax - xMin) * (i / (nPts - 1));
            xs.push(x);
            ys.push(payoffMillionsAtPrice(x, contracts, totalSharesM));
        }

        let yMin = Math.min(...ys, 0);
        let yMax = Math.max(...ys, 0);
        const yRange = yMax - yMin || 1;

        yMin -= yRange * 0.1;
        yMax += yRange * 0.1;

        return { xs, ys, xMin, xMax, yMin, yMax, cp };
    }, [contracts, totalSharesM, currentPrice, points]);

    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            const w = canvas.width;
            const h = canvas.height;

            const { background, lineColor, gridColor } = theme;
            const beColor = breakevenLineColor || gridColor || '#888';

            const padL = 44;
            const padT = chartTitle ? 34 : 18;
            const padR = 14;
            const padB = 30;

            const chartW = w - padL - padR;
            const chartH = h - padT - padB;

            ctx.clearRect(0, 0, w, h);

            ctx.fillStyle = background || '#0b1220';
            ctx.fillRect(0, 0, w, h);

            if (!totalSharesM || !Number.isFinite(totalSharesM) || totalSharesM <= 0) {
                ctx.fillStyle = lineColor || '#e5e7eb';
                ctx.font = '12px Helvetica, Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Provide totalShares to render P/L.', w / 2, h / 2);
                return;
            }

            const { xs, ys, xMin, xMax, yMin, yMax, cp } = computed;
            const xRange = xMax - xMin || 1;
            const yRange = yMax - yMin || 1;

            const xToPx = (x) => padL + ((x - xMin) / xRange) * chartW;
            const yToPx = (y) => padT + chartH - ((y - yMin) / yRange) * chartH;

            if (gridColor) {
                ctx.setLineDash([2, 2]);
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;

                for (let i = 0; i <= 4; i++) {
                    const y = padT + (chartH * i) / 4;
                    ctx.beginPath();
                    ctx.moveTo(padL, y);
                    ctx.lineTo(padL + chartW, y);
                    ctx.stroke();
                }

                for (let i = 0; i <= 4; i++) {
                    const x = padL + (chartW * i) / 4;
                    ctx.beginPath();
                    ctx.moveTo(x, padT);
                    ctx.lineTo(x, padT + chartH);
                    ctx.stroke();
                }

                ctx.setLineDash([]);
            }

            const y0 = yToPx(0);
            ctx.strokeStyle = beColor;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(padL, y0);
            ctx.lineTo(padL + chartW, y0);
            ctx.stroke();
            ctx.setLineDash([]);

            const pts = xs.map((x, i) => ({ x: xToPx(x), y: yToPx(ys[i]) }));

            const fillArea = (clipAbove) => {
                ctx.save();
                ctx.beginPath();
                if (clipAbove) {
                    ctx.rect(padL, padT, chartW, y0 - padT);
                    ctx.fillStyle = profitColor;
                    ctx.globalAlpha = 0.18;
                } else {
                    ctx.rect(padL, y0, chartW, padT + chartH - y0);
                    ctx.fillStyle = lossColor;
                    ctx.globalAlpha = 0.18;
                }
                ctx.clip();

                ctx.beginPath();
                ctx.moveTo(pts[0].x, y0);
                for (const p of pts) ctx.lineTo(p.x, p.y);
                ctx.lineTo(pts[pts.length - 1].x, y0);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
                ctx.globalAlpha = 1;
            };

            fillArea(true);
            fillArea(false);

            ctx.strokeStyle = lineColor || '#e5e7eb';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < pts.length; i++) {
                if (i === 0) ctx.moveTo(pts[i].x, pts[i].y);
                else ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.stroke();

            ctx.fillStyle = lineColor || '#e5e7eb';
            ctx.font = '11px Helvetica, Arial, sans-serif';

            ctx.textAlign = 'left';
            for (let i = 0; i <= 4; i++) {
                const v = yMax - (yRange * i) / 4;
                const y = padT + (chartH * i) / 4;
                ctx.fillText(formatMillions(v), 6, y + 3);
            }

            ctx.textAlign = 'center';
            const steps = 4;
            const skipOdd = w < 260;
            for (let i = 0; i <= steps; i++) {
                if (skipOdd && i % 2 !== 0) continue;
                const x = padL + (chartW * i) / steps;
                const v = xMin + (xRange * i) / steps;
                ctx.fillText(v.toFixed(2), x, padT + chartH + 18);

                ctx.beginPath();
                ctx.moveTo(x, padT + chartH);
                ctx.lineTo(x, padT + chartH + 3);
                ctx.strokeStyle = lineColor || '#e5e7eb';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            if (chartTitle) {
                ctx.textAlign = 'center';
                ctx.fillStyle = lineColor || '#e5e7eb';
                ctx.font = '14px Helvetica, Arial, sans-serif';
                ctx.fillText(chartTitle, w / 2, 22);
            }
        };

        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [computed, contracts, totalSharesM, currentPrice, chartTitle, theme, profitColor, lossColor, breakevenLineColor]);

    return html`<canvas ref=${canvasRef} class="price-chart"></canvas>`;
};

export default InTheMoneyChart;
