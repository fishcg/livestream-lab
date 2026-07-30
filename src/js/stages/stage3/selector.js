import { $, $$, setFeedback } from '../../core/dom.js';
import { PROTOCOL_SCENARIOS } from '../../data/stage3.js?v=20260729-3';

const answered = new Set();

function renderScenarios() {
  $('#stage3ScenarioGrid').innerHTML = PROTOCOL_SCENARIOS.map((scenario, index) => `
    <section class="stage3-scenario-card" data-id="${scenario.id}">
      <small>${String(index + 1).padStart(2, '0')} · SCENARIO</small><h4>${scenario.title}</h4><p>${scenario.detail}</p>
      <div>
        <button type="button" data-choice="hls">HLS</button>
        <button type="button" data-choice="flv">HTTP-FLV</button>
        <button type="button" data-choice="webrtc">WebRTC</button>
      </div>
      <span role="status"></span>
    </section>
  `).join('');
  $$('.stage3-scenario-card button').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.stage3-scenario-card');
      const scenario = PROTOCOL_SCENARIOS.find((item) => item.id === card.dataset.id);
      const correct = button.dataset.choice === scenario.answer;
      card.querySelectorAll('button').forEach((choice) => {
        choice.classList.toggle('correct', choice.dataset.choice === scenario.answer && correct);
        choice.classList.toggle('wrong', choice === button && !correct);
      });
      const feedback = card.querySelector('[role="status"]');
      feedback.textContent = correct ? scenario.why : '这个选择没有命中核心约束，再看一眼场景中的延迟、互动和兼容要求。';
      feedback.className = correct ? 'success' : 'error';
      if (correct) {
        answered.add(scenario.id);
        card.querySelectorAll('button').forEach((choice) => { choice.disabled = true; });
        $('#stage3ScenarioScore').textContent = `${answered.size} / ${PROTOCOL_SCENARIOS.length}`;
      }
    });
  });
}

export function initProtocolSelector() {
  renderScenarios();
  setFeedback($('#stage3SelectorFeedback'), '', '先找场景里的硬约束：是规模、兼容、低延迟，还是双向互动？');
}
