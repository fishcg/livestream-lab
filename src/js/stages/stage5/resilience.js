import { $, $$, setFeedback } from '../../core/dom.js';
import { FAILURE_CASES, PROTECTIONS } from '../../data/stage5.js?v=20260729-1';

const enabledProtections = new Set(PROTECTIONS.filter((item) => item.default).map((item) => item.id));
const solvedFailures = new Set();
let currentFailure = FAILURE_CASES[0].id;

function renderProtections() {
  $('#stage5ProtectionSwitches').innerHTML = PROTECTIONS.map((item) => `
    <button type="button" data-id="${item.id}" aria-pressed="${enabledProtections.has(item.id)}" class="${enabledProtections.has(item.id) ? 'active' : ''}">
      <i></i><span><b>${item.name}</b><small>${item.detail}</small></span>
    </button>
  `).join('');
  $$('#stage5ProtectionSwitches button').forEach((button) => button.addEventListener('click', () => {
    if (enabledProtections.has(button.dataset.id)) enabledProtections.delete(button.dataset.id);
    else enabledProtections.add(button.dataset.id);
    renderProtections();
    renderFailure();
  }));
}

function renderFailure() {
  const failure = FAILURE_CASES.find((item) => item.id === currentFailure);
  const protection = PROTECTIONS.find((item) => item.id === failure.required);
  $('#stage5FailureList').innerHTML = FAILURE_CASES.map((item, index) => `
    <button type="button" class="${item.id === currentFailure ? 'active' : ''}${solvedFailures.has(item.id) ? ' solved' : ''}" data-id="${item.id}"><small>${String(index + 1).padStart(2, '0')}</small><b>${item.name}</b></button>
  `).join('');
  $('#stage5FailureTitle').textContent = failure.name;
  $('#stage5FailureStory').textContent = failure.story;
  $('#stage5FailureRequired').innerHTML = `<small>需要的保护</small><b>${protection.name}</b><p>${protection.detail}</p>`;
  $('#stage5ResilienceScore').textContent = `${solvedFailures.size} / ${FAILURE_CASES.length}`;
  setFeedback($('#stage5FailureFeedback'), '', enabledProtections.has(failure.required) ? '保护已配置，可以运行演练。' : '当前缺少对应保护，运行后会看到故障影响。');
  $$('#stage5FailureList button').forEach((button) => button.addEventListener('click', () => {
    currentFailure = button.dataset.id;
    renderFailure();
  }));
}

function runDrill() {
  const failure = FAILURE_CASES.find((item) => item.id === currentFailure);
  const protectedNow = enabledProtections.has(failure.required);
  if (protectedNow) solvedFailures.add(failure.id);
  setFeedback($('#stage5FailureFeedback'), protectedNow ? 'success' : 'error', protectedNow ? `切换成功：${failure.success}` : `演练失败：${failure.fail}`);
  $('#stage5ResilienceScore').textContent = `${solvedFailures.size} / ${FAILURE_CASES.length}`;
  renderFailureListOnly();
}

function renderFailureListOnly() {
  $$('#stage5FailureList button').forEach((button) => button.classList.toggle('solved', solvedFailures.has(button.dataset.id)));
}

export function initResilienceLab() {
  renderProtections();
  renderFailure();
  $('#stage5RunDrill')?.addEventListener('click', runDrill);
}
