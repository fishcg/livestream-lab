import { $, $$ } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { METRIC_REPORTS } from '../../data/stage4.js?v=20260729-1';

let currentMetric = 0;

function renderMetric() {
  const item = METRIC_REPORTS[currentMetric];
  $('#stage4MetricCards').innerHTML = METRIC_REPORTS.map((metric, index) => `
    <button type="button" class="stage4-metric-card${index === currentMetric ? ' active' : ''}" data-index="${index}" aria-pressed="${index === currentMetric}">
      <span>${iconMarkup(metric.icon)}</span><small>${String(index + 1).padStart(2, '0')}</small><b>${metric.name}</b><em>${metric.unit}</em>
    </button>
  `).join('');
  $('#stage4MetricDetail').innerHTML = `
    <div><span>指标读片</span><h4>${item.name}</h4><p>${item.story}</p></div>
    <dl><div><dt>健康直觉</dt><dd>${item.normal}</dd></div><div><dt>危险形态</dt><dd>${item.warning}</dd></div></dl>
    <aside><small>第一检查动作</small><p>${item.first}</p></aside>
  `;
  $$('.stage4-metric-card', $('#stage4MetricCards')).forEach((button) => button.addEventListener('click', () => {
    currentMetric = Number(button.dataset.index);
    renderMetric();
  }));
}

export function initMetricReader() {
  renderMetric();
}
