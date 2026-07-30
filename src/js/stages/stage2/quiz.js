import { $, $$, setFeedback } from '../../core/dom.js';
import { completeStage } from '../../core/progress.js';
import { STAGE2_QUIZ } from '../../data/stage2.js?v=20260729-8';

function renderQuestions() {
  $('#stage2QuizQuestions').innerHTML = STAGE2_QUIZ.map((item, index) => {
    const number = index + 1;
    const options = item.options.map((option, optionIndex) => {
      const value = String.fromCharCode(97 + optionIndex);
      return `<label><input type="radio" name="stage2q${number}" value="${value}">${option}</label>`;
    }).join('');
    return `<fieldset data-answer="${item.answer}"><legend><span>${String(number).padStart(2, '0')}</span>${item.question}</legend>${options}</fieldset>`;
  }).join('');
}

export function initStage2Quiz() {
  renderQuestions();
  $('#stage2Quiz')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = $$('fieldset', event.currentTarget);
    let score = 0;
    fields.forEach((field, index) => {
      const checked = $(`input[name="stage2q${index + 1}"]:checked`, field);
      const correct = checked?.value === field.dataset.answer;
      field.style.borderColor = correct ? '#346f16' : '#7d1d17';
      if (correct) score += 1;
    });
    if (score === fields.length) {
      setFeedback($('#stage2QuizFeedback'), 'success', `${score} / ${fields.length} · 推流建立成功。第二阶段完成。`);
      completeStage(2);
      return;
    }
    setFeedback($('#stage2QuizFeedback'), 'error', `${score} / ${fields.length} · 标红题仍有链路断点，回看对应教学后再提交。`);
  });
}
