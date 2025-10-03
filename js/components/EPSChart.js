import { html, useEffect, useRef } from '../lib/preact.standalone.module.js';
import '../lib/tailwind.module.js';

const EPSChart = ({
    epsData = [], // Array of { year: number, eps: number }
    yAxisTitle = undefined,
    theme = {
        background: 'rgb(0, 0, 0, .9)',
        barColor: '#ffffff', // not used anymore since bars use gradient
        gridColor: '#777',
        shadedAreaTopColor: '#00FF00',
        shadedAreaBottomColor: '#006400',
        negativeShadedAreaTopColor: '#A01A1A',
        negativeShadedAreaBottomColor: '#4B0202'
    }
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas || !epsData || epsData.length === 0) return;

            const ctx = canvas.getContext('2d');
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            const w = canvas.width;
            const h = canvas.height;
            const padL = 20;
            const padR = yAxisTitle ? 70 : 50; // right padding for y-axis title
            const padT = 40;
            const padB = 20;
            const chartW = w - padL - padR;
            const chartH = h - padT - padB;

            ctx.clearRect(0, 0, w, h);

            // Background
            ctx.fillStyle = theme.background;
            ctx.fillRect(0, 0, w, h);

            const maxVal = Math.max(...epsData.map(d => d.eps), 0);
            const minVal = Math.min(...epsData.map(d => d.eps), 0);

            const totalRange = maxVal - minVal || 1; // avoid divide by zero
            const zeroLine = padT + chartH * (maxVal / totalRange); // y pixel position for EPS=0 line

            // Removed unused barCount variable
            const barWidth = chartW / (4 * 1.5); // always plan for 4 slots
            const stepX = chartW / 4; // match AssetPriceChart spacing

            // Grid lines
            ctx.strokeStyle = theme.gridColor;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            for (let i = 0; i <= 4; i++) {
                const y = padT + chartH * i / 4;
                ctx.moveTo(padL, y);
                ctx.lineTo(padL + chartW, y);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Bars with gradient
            epsData.slice(0, 4).forEach((d, i) => {
                const x = padL + i * stepX + (stepX - barWidth) / 2;
                const barHeight = Math.abs(d.eps) / totalRange * chartH;

                let y;
                if (d.eps >= 0) {
                    y = zeroLine - barHeight;
                } else {
                    y = zeroLine;
                }

                const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
                if (d.eps >= 0) {
                    gradient.addColorStop(0, theme.shadedAreaTopColor);
                    gradient.addColorStop(1, theme.shadedAreaBottomColor);
                } else {
                    gradient.addColorStop(0, theme.negativeShadedAreaTopColor);
                    gradient.addColorStop(1, theme.negativeShadedAreaBottomColor);
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, barWidth, barHeight);
            });

            // Draw solid white zero line if minVal < 0 and maxVal > 0 OR always
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.setLineDash([]); // solid line
            ctx.beginPath();
            ctx.moveTo(padL, zeroLine);
            ctx.lineTo(padL + chartW, zeroLine);
            ctx.stroke();

            // X-axis labels (years)
            ctx.fillStyle = '#fff';
            ctx.font = '11px Helvetica, Arial, sans-serif';
            ctx.textAlign = 'center';
            epsData.slice(0, 4).forEach((d, i) => {
                const x = padL + i * stepX + stepX / 2;
                ctx.fillText(d.year.toString(), x, padT + chartH + 15);
            });

            // Y-axis labels (to the right of chart)
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'left';
            ctx.font = '11px Helvetica, Arial, sans-serif';
            for (let i = 0; i <= 4; i++) {
                const val = (maxVal - totalRange * i / 4).toFixed(2);
                const y = padT + chartH * i / 4;
                ctx.fillText(val, padL + chartW + 5, y + 3); // right of chart
            }

            if (yAxisTitle) {
                // Y-axis title (rotated on far right side of canvas)
                ctx.save();
                ctx.translate(w - 10, padT + chartH / 2); // near right edge
                ctx.rotate(-Math.PI / 2); // same as AssetPriceChart
                ctx.textAlign = 'center';
                ctx.fillText(yAxisTitle, 0, 0);
                ctx.restore();
            }

            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.font = '14px Helvetica, Arial, sans-serif';
            ctx.fillText("Earnings Per Share", w / 2, 25);
        };

        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [epsData]);

    return html`<canvas ref=${canvasRef} class="price-chart"></canvas>`;
};

export default EPSChart;
