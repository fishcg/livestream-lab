import { $, $$, setFeedback } from '../../core/dom.js';
import { INCIDENTS } from '../../data/stage4.js?v=20260729-1';

const solved = new Set();
let currentIncident = 0;

function renderIncidentList() {
  $('#stage4IncidentList').innerHTML = INCIDENTS.map((item, index) => `
    <button type="button" class="incident-button${index === currentIncident ? ' active' : ''}" data-index="${index}"><b>${String(index + 1).padStart(2, '0')} · ${item.title}</b><small>${item.scope}</small></button>
  `).join('');
  $$('#stage4IncidentList .incident-button').forEach((button) => button.addEventListener('click', () => {
    currentIncident = Number(button.dataset.index);
    renderIncidentList();
    renderEvidence();
  }));
}

function renderEvidence() {
  const item = INCIDENTS[currentIncident];
  $('#stage4EvidenceTitle').textContent = item.title;
  $('#stage4EvidenceScope').textContent = item.scope;
  $('#stage4EvidenceLog').textContent = item.evidence;
  $('#stage4EvidenceClue').textContent = item.clue;
  $('#stage4EvidenceOptions').innerHTML = item.options.map((option, index) => `
    <button type="button" data-index="${index}"${solved.has(item.id) ? ' disabled' : ''} class="${solved.has(item.id) && option.correct ? 'correct' : ''}">${option.label}</button>
  `).join('');
  setFeedback($('#stage4IncidentFeedback'), solved.has(item.id) ? 'success' : '', solved.has(item.id) ? '这份病历已经会诊完成，可以切换下一位。' : '先用范围和第一条异常证据缩小故障层，再选择动作。');
  $$('#stage4EvidenceOptions button').forEach((button) => button.addEventListener('click', () => {
    const option = item.options[Number(button.dataset.index)];
    button.classList.add(option.correct ? 'correct' : 'wrong');
    setFeedback($('#stage4IncidentFeedback'), option.correct ? 'success' : 'error', option.why);
    if (!option.correct) return;
    solved.add(item.id);
    $$('#stage4EvidenceOptions button').forEach((answerButton) => {
      answerButton.disabled = true;
      answerButton.classList.toggle('correct', item.options[Number(answerButton.dataset.index)].correct);
    });
    $('#stage4IncidentScore').textContent = `${solved.size} / ${INCIDENTS.length}`;
  }));
}

export function initStage4Incidents() {
  renderIncidentList();
  renderEvidence();
  $('#stage4IncidentScore').textContent = `0 / ${INCIDENTS.length}`;
}
