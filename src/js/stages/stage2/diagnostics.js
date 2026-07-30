import { $, $$, setFeedback } from '../../core/dom.js';
import { DIAGNOSTIC_CASES } from '../../data/stage2.js?v=20260729-8';

const solved = new Set();
let currentCase = 0;

function renderCaseList() {
  $('#stage2IncidentList').innerHTML = DIAGNOSTIC_CASES.map((item, index) => `
    <button class="incident-button${index === currentCase ? ' active' : ''}" data-index="${index}">
      <b>${String(index + 1).padStart(2, '0')} · ${item.title}</b><small>${item.symptom}</small>
    </button>
  `).join('');
  $$('.incident-button', $('#stage2IncidentList')).forEach((button) => {
    button.addEventListener('click', () => {
      currentCase = Number(button.dataset.index);
      renderCaseList();
      renderEvidence();
    });
  });
}

function renderEvidence() {
  const item = DIAGNOSTIC_CASES[currentCase];
  $('#stage2EvidenceTitle').textContent = item.title;
  $('#stage2EvidenceSymptom').textContent = item.symptom;
  $('#stage2EvidenceLog').textContent = item.log;
  $('#stage2EvidenceClue').textContent = item.clue;
  $('#stage2EvidenceOptions').innerHTML = item.options.map((option, index) => `
    <button data-index="${index}"${solved.has(item.id) ? ' disabled' : ''} class="${solved.has(item.id) && option.correct ? 'correct' : ''}">${option.label}</button>
  `).join('');
  setFeedback($('#stage2DiagnosticFeedback'), solved.has(item.id) ? 'success' : '', solved.has(item.id) ? '这道故障已定位正确，可以继续挑战其他案例。' : '先判断故障发生在哪一层，再选动作。');
  $$('#stage2EvidenceOptions button').forEach((button) => {
    button.addEventListener('click', () => {
      const option = item.options[Number(button.dataset.index)];
      button.classList.add(option.correct ? 'correct' : 'wrong');
      setFeedback($('#stage2DiagnosticFeedback'), option.correct ? 'success' : 'error', option.why);
      if (option.correct) {
        solved.add(item.id);
        $$('#stage2EvidenceOptions button').forEach((answerButton) => {
          answerButton.disabled = true;
          const answer = item.options[Number(answerButton.dataset.index)];
          answerButton.classList.toggle('correct', answer.correct);
        });
        $('#stage2DiagnosticScore').textContent = `${solved.size} / ${DIAGNOSTIC_CASES.length}`;
      }
    });
  });
}

export function initStage2Diagnostics() {
  renderCaseList();
  renderEvidence();
  $('#stage2DiagnosticScore').textContent = `0 / ${DIAGNOSTIC_CASES.length}`;
}
