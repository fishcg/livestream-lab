import { $, $$, setFeedback } from '../../core/dom.js';
import { completeStage } from '../../core/progress.js';
import { STAGE4_QUIZ } from '../../data/stage4.js?v=20260729-1';

function renderQuestions() {
  $('#stage4QuizQuestions').innerHTML = STAGE4_QUIZ.map((item, index) => {
    const number = index + 1;
    const options = item.options.map((option, optionIndex) => {
      const value = String.fromCharCode(97 + optionIndex);
      return `<label><input type="radio" name="stage4q${number}" value="${value}">${option}</label>`;
    }).join('');
    return `<fieldset data-answer="${item.answer}"><legend><span>${String(number).padStart(2, '0')}</span>${item.question}</legend>${options}</fieldset>`;
  }).join('');
}

export function initStage4Quiz() {
  renderQuestions();
  $('#stage4Quiz')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = $$('fieldset', event.currentTarget);
    let score = 0;
    fields.forEach((field, index) => {
      const checked = $(`input[name="stage4q${index + 1}"]:checked`, field);
      const correct = checked?.value === field.dataset.answer;
      field.style.borderColor = correct ? '#346f16' : '#7d1d17';
      if (correct) score += 1;
    });
    if (score === fields.length) {
      setFeedback($('#stage4QuizFeedback'), 'success', `${score} / ${fields.length} · 会诊结论成立。第四阶段完成。`);
      completeStage(4);
      return;
    }
    setFeedback($('#stage4QuizFeedback'), 'error', `${score} / ${fields.length} · 标红题仍有诊断断点，回到对应科室复查。`);
  });
}
