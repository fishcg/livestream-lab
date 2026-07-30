import { $, $$, setFeedback } from '../../core/dom.js';
import { completeStage } from '../../core/progress.js';
import { STAGE3_QUIZ } from '../../data/stage3.js?v=20260730-5';

function renderQuestions() {
  $('#stage3QuizQuestions').innerHTML = STAGE3_QUIZ.map((item, index) => {
    const number = index + 1;
    const options = item.options.map((option, optionIndex) => {
      const value = String.fromCharCode(97 + optionIndex);
      return `<label><input type="radio" name="stage3q${number}" value="${value}">${option}</label>`;
    }).join('');
    return `<fieldset data-answer="${item.answer}"><legend><span>${String(number).padStart(2, '0')}</span>${item.question}</legend>${options}</fieldset>`;
  }).join('');
}

export function initStage3Quiz() {
  renderQuestions();
  $('#stage3Quiz')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = $$('fieldset', event.currentTarget);
    let score = 0;
    fields.forEach((field, index) => {
      const checked = $(`input[name="stage3q${index + 1}"]:checked`, field);
      const correct = checked?.value === field.dataset.answer;
      field.style.borderColor = correct ? '#346f16' : '#7d1d17';
      if (correct) score += 1;
    });
    if (score === fields.length) {
      setFeedback($('#stage3QuizFeedback'), 'success', `${score} / ${fields.length} · 播放链路稳定。第三阶段完成。`);
      completeStage(3);
      return;
    }
    setFeedback($('#stage3QuizFeedback'), 'error', `${score} / ${fields.length} · 标红题还有播放断点，回到对应协议再看一次。`);
  });
}
