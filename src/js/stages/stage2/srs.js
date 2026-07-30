import { $, $$ } from '../../core/dom.js';
import { SRS_CONFIG_LINES } from '../../data/stage2.js?v=20260729-8';

let configIndex = 0;

function renderConfigReader() {
  $('#stage2SrsConfigLines').innerHTML = SRS_CONFIG_LINES.map((line, index) => `
    <button type="button" data-index="${index}" aria-pressed="${index === configIndex}">
      <small>${String(index + 1).padStart(2, '0')}</small><code>${line.code}</code>
    </button>
  `).join('');
  const current = SRS_CONFIG_LINES[configIndex];
  $('#stage2SrsConfigDetail').innerHTML = `
    <span>${current.label}</span><h5>${current.code}</h5><p>${current.meaning}</p>
    <div><small>验证时看什么</small><b>${current.verify}</b></div>
  `;
  $$('#stage2SrsConfigLines button').forEach((button) => {
    button.addEventListener('click', () => {
      configIndex = Number(button.dataset.index);
      renderConfigReader();
    });
  });
}

function updateDistribution() {
  const enabled = $$('.stage2-srs-toggle:checked').map((input) => input.dataset.label);
  $$('.stage2-srs-route').forEach((route) => {
    route.classList.toggle('active', enabled.includes(route.dataset.label));
  });
  $('#stage2SrsSummary').textContent = enabled.length
    ? `一路输入已复制到：${enabled.join('、')}。主播仍只上传一路，分发压力由服务器承担。`
    : '所有下游都已关闭，但 SRS 仍可接住主播输入；没有消费者时不会产生这些分发出口。';
}

export function initSrsLesson() {
  renderConfigReader();
  $$('.stage2-srs-toggle').forEach((input) => input.addEventListener('change', updateDistribution));
  updateDistribution();
}
