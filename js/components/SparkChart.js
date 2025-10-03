import { html, useEffect, useRef, useState } from '../lib/preact.standalone.module.js';
import useInterval from '../hooks/useInterval.js';
import '../lib/tailwind.module.js';
import * as api from '../api.js';

const SparkChart = ({
  assetId,
  chartTitle = undefined,
  transformValue = undefined,
  theme = {
    background: 'rgb(0, 0, 0, .9)',
    lineColor: '#ffffff',
    shadedAreaTopColor: '#0D596A',
    shadedAreaBottomColor: '#01042B'
  }
}) => {
  const canvasRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  const refreshData = () => {
    let active = true;
    api.getAssetChart(assetId)
      .then(data => { if (active) setChartData(data); })
      .catch(console.error);
    return () => { active = false; };
  };

  useEffect(() => { refreshData(); }, [assetId]);
  useInterval(refreshData, 5000);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas || !chartData) return;
      const ctx = canvas.getContext('2d');

      // Size to CSS box
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const { prices: originalPrices } = chartData;
      let prices = [...originalPrices];
      if (transformValue !== undefined) prices = prices.map(v => transformValue(v));

      const { background, lineColor, shadedAreaTopColor, shadedAreaBottomColor } = theme;

      const w = canvas.width;
      const h = canvas.height;

      // Tight pads for spark: >90% area for data
      const padT = chartTitle ? 28 : 6;
      const padB = 6;
      const padL = 6;
      const padR = 6;

      const chartW = Math.max(1, w - padL - padR);
      const chartH = Math.max(1, h - padT - padB);

      const minVal = Math.min(...prices);
      const maxVal = Math.max(...prices);
      const range = maxVal - minVal || 1;
      const stepX = chartW / Math.max(1, prices.length - 1);

      // Background
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);

      // Path for line + area
      ctx.beginPath();
      for (let i = 0; i < prices.length; i++) {
        const x = padL + stepX * i;
        const y = padT + chartH - ((prices[i] - minVal) / range) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Close to baseline for area fill
      ctx.lineTo(padL + chartW, padT + chartH);
      ctx.lineTo(padL, padT + chartH);
      ctx.closePath();

      // Gradient area (optional)
      if (shadedAreaTopColor && shadedAreaBottomColor) {
        const g = ctx.createLinearGradient(0, padT, 0, padT + chartH);
        g.addColorStop(0, shadedAreaTopColor);
        g.addColorStop(1, shadedAreaBottomColor);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // Stroke line on top
      ctx.beginPath();
      for (let i = 0; i < prices.length; i++) {
        const x = padL + stepX * i;
        const y = padT + chartH - ((prices[i] - minVal) / range) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Title only
      if (chartTitle) {
        const title = typeof chartTitle === 'function' ? chartTitle(chartData) : chartTitle;
        if (title) {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = lineColor;
          ctx.font = '13px Helvetica, Arial, sans-serif';
          ctx.fillText(title, w / 2, 14);
        }
      }
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [chartData]);

  return html`<canvas ref=${canvasRef} class="price-chart"></canvas>`;
};

export default SparkChart;
