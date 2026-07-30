import { $, $$ } from '../../core/dom.js';

const COMPONENTS = [
  { id: 'stage4CaptureDelay', label: '采集', color: '#45d5e8' },
  { id: 'stage4EncodeDelay', label: '编码', color: '#a6ef67' },
  { id: 'stage4NetworkDelay', label: '传输', color: '#e272ff' },
  { id: 'stage4BufferDelay', label: '缓冲', color: '#ff6a2a' },
  { id: 'stage4RenderDelay', label: '解码渲染', color: '#ffb077' }
];

function renderLatency() {
  const values = COMPONENTS.map((item) => ({ ...item, value: Number($(`#${item.id}`).value) }));
  const total = values.reduce((sum, item) => sum + item.value, 0);
  const bottleneck = values.reduce((max, item) => item.value > max.value ? item : max, values[0]);
  const maxValue = Math.max(total, 1);
  const level = total <= 1500 ? '急诊绿灯' : total <= 3500 ? '需要观察' : '延迟红灯';
  values.forEach((item) => {
    $(`#${item.id}Out`).textContent = `${item.value} ms`;
  });
  $('#stage4LatencyTotal').textContent = `${(total / 1000).toFixed(2)} 秒`;
  $('#stage4LatencyLevel').textContent = level;
  $('#stage4LatencyLevel').className = total > 3500 ? 'danger' : total > 1500 ? 'warning' : 'safe';
  $('#stage4LatencyBars').innerHTML = values.map((item) => `
    <div style="--share:${Math.max(5, item.value / maxValue * 100)}%;--bar:${item.color}"><span>${item.label}</span><i></i><b>${item.value}ms</b></div>
  `).join('');
  $('#stage4LatencyHint').textContent = `${bottleneck.label}是当前最大预算项（${bottleneck.value}ms）。总延迟是每一站耗时累积的教学估算，真实链路还要结合时间戳和现场测量。`;
}

export function initLatencyLab() {
  COMPONENTS.forEach(({ id }) => $(`#${id}`)?.addEventListener('input', renderLatency));
  renderLatency();
}
