import { $, $$, setFeedback } from '../../core/dom.js';
import { completeStage } from '../../core/progress.js';
import { STAGE5_QUIZ } from '../../data/stage5.js?v=20260729-1';

function renderQuestions() {
  $('#stage5QuizQuestions').innerHTML = STAGE5_QUIZ.map((item, index) => {
    const number = index + 1;
    const options = item.options.map((option, optionIndex) => {
      const value = String.fromCharCode(97 + optionIndex);
      return `<label><input type="radio" name="stage5q${number}" value="${value}">${option}</label>`;
    }).join('');
    return `<fieldset data-answer="${item.answer}"><legend><span>${String(number).padStart(2, '0')}</span>${item.question}</legend>${options}</fieldset>`;
  }).join('');
}

export function initStage5Quiz() {
  renderQuestions();
  $('#stage5Quiz')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = $$('fieldset', event.currentTarget);
    let score = 0;
    fields.forEach((field, index) => {
      const checked = $(`input[name="stage5q${index + 1}"]:checked`, field);
      const correct = checked?.value === field.dataset.answer;
      field.style.borderColor = correct ? '#346f16' : '#7d1d17';
      if (correct) score += 1;
    });
    if (score === fields.length) {
      setFeedback($('#stage5QuizFeedback'), 'success', `${score} / ${fields.length} · 第五阶段完成，直播架构总装通过。`);
      completeStage(5);
      return;
    }
    setFeedback($('#stage5QuizFeedback'), 'error', `${score} / ${fields.length} · 标红题还有架构缺口，回到对应实验再验证一次。`);
  });
}
