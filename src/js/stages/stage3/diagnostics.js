import { $, $$, setFeedback } from '../../core/dom.js';
import { PLAYBACK_INCIDENTS } from '../../data/stage3.js?v=20260729-3';

const solved = new Set();
let incidentIndex = 0;

function renderIncidentList() {
  $('#stage3IncidentList').innerHTML = PLAYBACK_INCIDENTS.map((item, index) => `
    <button type="button" class="incident-button${index === incidentIndex ? ' active' : ''}" data-index="${index}"><b>${String(index + 1).padStart(2, '0')} · ${item.title}</b><small>${item.symptom}</small></button>
  `).join('');
  $$('#stage3IncidentList .incident-button').forEach((button) => {
    button.addEventListener('click', () => {
      incidentIndex = Number(button.dataset.index);
      renderIncidentList();
      renderEvidence();
    });
  });
}

function renderEvidence() {
  const item = PLAYBACK_INCIDENTS[incidentIndex];
  $('#stage3EvidenceTitle').textContent = item.title;
  $('#stage3EvidenceSymptom').textContent = item.symptom;
  $('#stage3EvidenceLog').textContent = item.log;
  $('#stage3EvidenceClue').textContent = item.clue;
  $('#stage3EvidenceOptions').innerHTML = item.options.map((option, index) => `
    <button type="button" data-index="${index}"${solved.has(item.id) ? ' disabled' : ''} class="${solved.has(item.id) && option.correct ? 'correct' : ''}">${option.label}</button>
  `).join('');
  setFeedback($('#stage3DiagnosticFeedback'), solved.has(item.id) ? 'success' : '', solved.has(item.id) ? '这起故障已经定位，可以切换到下一起。' : '先判断失败发生在资源、浏览器策略、缓冲，还是网络建连。');
  $$('#stage3EvidenceOptions button').forEach((button) => {
    button.addEventListener('click', () => {
      const option = item.options[Number(button.dataset.index)];
      button.classList.add(option.correct ? 'correct' : 'wrong');
      setFeedback($('#stage3DiagnosticFeedback'), option.correct ? 'success' : 'error', option.why);
      if (option.correct) {
        solved.add(item.id);
        $$('#stage3EvidenceOptions button').forEach((answerButton) => {
          answerButton.disabled = true;
          answerButton.classList.toggle('correct', item.options[Number(answerButton.dataset.index)].correct);
        });
        $('#stage3DiagnosticScore').textContent = `${solved.size} / ${PLAYBACK_INCIDENTS.length}`;
      }
    });
  });
}

export function initStage3Diagnostics() {
  renderIncidentList();
  renderEvidence();
  $('#stage3DiagnosticScore').textContent = `0 / ${PLAYBACK_INCIDENTS.length}`;
}
