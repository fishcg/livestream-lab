import { $, $$, setFeedback } from './dom.js';
import { completeStage } from './progress.js';

function shuffledOptions(item) {
  const options = item.options.map((label, index) => ({
    label,
    value: String.fromCharCode(97 + index)
  }));

  for (let index = options.length - 1; index > 0; index -= 1) {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const swapIndex = random[0] % (index + 1);
    [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
  }
  return options;
}

function renderQuestions(container, questions, namePrefix) {
  container.innerHTML = questions.map((item, index) => {
    const number = index + 1;
    const options = shuffledOptions(item).map(({ label, value }) => (
      `<label><input type="radio" name="${namePrefix}${number}" value="${value}">${label}</label>`
    )).join('');
    return `<fieldset data-answer="${item.answer}"><legend><span>${String(number).padStart(2, '0')}</span>${item.question}</legend>${options}</fieldset>`;
  }).join('');
}

export function initQuiz({
  stage,
  questions,
  containerSelector,
  formSelector,
  feedbackSelector,
  namePrefix,
  successMessage,
  retryMessage
}) {
  const container = $(containerSelector);
  const form = $(formSelector);
  if (!container || !form) return;

  renderQuestions(container, questions, namePrefix);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = $$('fieldset', form);
    let score = 0;

    fields.forEach((field) => {
      const checked = $('input:checked', field);
      const correct = checked?.value === field.dataset.answer;
      field.style.borderColor = correct ? '#346f16' : '#7d1d17';
      if (correct) score += 1;
    });

    const feedback = $(feedbackSelector);
    if (score === fields.length) {
      setFeedback(feedback, 'success', `${score} / ${fields.length} · ${successMessage}`);
      completeStage(stage);
      return;
    }
    setFeedback(feedback, 'error', `${score} / ${fields.length} · ${retryMessage}`);
  });
}
