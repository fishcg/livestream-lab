import { $, $$, setFeedback } from '../../core/dom.js';
import { CAPSTONE_SCENARIOS } from '../../data/stage5.js?v=20260729-1';

const solvedScenarios = new Set();

function renderCapstone() {
  $('#stage5CapstoneGrid').innerHTML = CAPSTONE_SCENARIOS.map((scenario, index) => `
    <section class="stage5-capstone-card" data-id="${scenario.id}"><small>${String(index + 1).padStart(2, '0')} · REQUIREMENT</small><h4>${scenario.title}</h4><p>${scenario.detail}</p><div>${scenario.options.map((option, optionIndex) => `<button type="button" data-index="${optionIndex}">${option.label}</button>`).join('')}</div><span role="status"></span></section>
  `).join('');
  $$('.stage5-capstone-card button').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('.stage5-capstone-card');
    const scenario = CAPSTONE_SCENARIOS.find((item) => item.id === card.dataset.id);
    const option = scenario.options[Number(button.dataset.index)];
    card.querySelectorAll('button').forEach((choice, index) => {
      choice.classList.toggle('correct', option.correct && index === Number(button.dataset.index));
      choice.classList.toggle('wrong', !option.correct && choice === button);
    });
    card.querySelector('[role="status"]').textContent = option.why;
    card.querySelector('[role="status"]').className = option.correct ? 'success' : 'error';
    if (option.correct) solvedScenarios.add(scenario.id);
    $('#stage5CapstoneScore').textContent = `${solvedScenarios.size} / ${CAPSTONE_SCENARIOS.length}`;
    setFeedback($('#stage5CapstoneFeedback'), solvedScenarios.size === CAPSTONE_SCENARIOS.length ? 'success' : '', solvedScenarios.size === CAPSTONE_SCENARIOS.length ? '五张需求单全部交付，可以进入最终考试。' : '先抓规模、延迟、互动、兼容与回看这些硬约束。');
  }));
  setFeedback($('#stage5CapstoneFeedback'), '', '先抓规模、延迟、互动、兼容与回看这些硬约束。');
}

export function initCapstone() {
  renderCapstone();
}
