import { $, $$, setFeedback } from '../../core/dom.js';
import { completeStage } from '../../core/progress.js';
import { STAGE1_QUIZ } from '../../data/stage1.js?v=20260729-3';

function renderQuestions() {
  $('#stage1QuizQuestions').innerHTML = STAGE1_QUIZ.map((item, index) => {
    const questionNumber = index + 1;
    const options = item.options.map((option, optionIndex) => {
      const value = String.fromCharCode(97 + optionIndex);
      return `<label><input type="radio" name="q${questionNumber}" value="${value}">${option}</label>`;
    }).join('');
    return `<fieldset data-answer="${item.answer}"><legend><span>${String(questionNumber).padStart(2, '0')}</span>${item.question}</legend>${options}</fieldset>`;
  }).join('');
}

export function initStage1Quiz() {
  renderQuestions();
  $('#stage1Quiz').addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = $$('fieldset', event.currentTarget);
    let score = 0;
    fields.forEach((field, index) => {
      const checked = $(`input[name="q${index + 1}"]:checked`, field);
      const correct = checked?.value === field.dataset.answer;
      field.style.borderColor = correct ? '#346f16' : '#7d1d17';
      if (correct) score += 1;
    });

    if (score === fields.length) {
      setFeedback($('#quizFeedback'), 'success', `${score} / ${fields.length} · 信号确认。第一阶段完成。`);
      completeStage(1);
      return;
    }
    setFeedback($('#quizFeedback'), 'error', `${score} / ${fields.length} · 还有信号噪声，回看标红题再试一次。`);
  });
}
