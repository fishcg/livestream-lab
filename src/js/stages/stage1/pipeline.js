import { $, $$, setFeedback, shuffle } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { PIPELINE_LESSONS, PIPELINE_STEPS } from '../../data/stage1.js';

const STEP_ICONS = Object.fromEntries(PIPELINE_LESSONS.map(({ step, icon }) => [step, icon]));

function stepMarkup(step) {
  return `${iconMarkup(STEP_ICONS[step])}<span>${step}</span>`;
}

export function initPipelineLab() {
  let selected = [];

  function render(randomize = false) {
    const slots = $('#pipelineSlots');
    slots.innerHTML = PIPELINE_STEPS.map((_, index) => (
      `<button class="pipeline-slot ${selected[index] ? 'filled' : ''}" data-index="${index}">${selected[index] ? stepMarkup(selected[index]) : String(index + 1).padStart(2, '0')}</button>`
    )).join('');

    $$('.pipeline-slot.filled', slots).forEach((slot) => {
      slot.addEventListener('click', () => {
        selected.splice(Number(slot.dataset.index), 1);
        render();
      });
    });

    const remaining = PIPELINE_STEPS.filter((item) => !selected.includes(item));
    const pool = randomize ? shuffle(remaining) : remaining;
    $('#pipelinePool').innerHTML = pool.map((item) => `<button class="module-chip">${stepMarkup(item)}</button>`).join('');
    $$('.module-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        selected.push(chip.querySelector('span').textContent);
        render();
      });
    });
    $('#pipelineScore').textContent = `${selected.length} / ${PIPELINE_STEPS.length}`;
  }

  $('#pipelineReset').addEventListener('click', () => {
    selected = [];
    render(true);
    setFeedback($('#pipelineFeedback'), '', '');
  });

  $('#pipelineCheck').addEventListener('click', () => {
    $$('.pipeline-slot').forEach((slot, index) => {
      slot.classList.toggle('correct', selected[index] === PIPELINE_STEPS[index]);
      slot.classList.toggle('wrong', Boolean(selected[index]) && selected[index] !== PIPELINE_STEPS[index]);
    });

    if (selected.length < PIPELINE_STEPS.length) {
      setFeedback($('#pipelineFeedback'), 'error', '链路还没接完，继续选择剩余模块。');
      return;
    }
    if (selected.every((item, index) => item === PIPELINE_STEPS[index])) {
      setFeedback($('#pipelineFeedback'), 'success', 'PASS · 信号贯通。主播端完成采集、编码、封装并推流，观众端再拉流播放。');
      return;
    }
    const firstWrong = selected.findIndex((item, index) => item !== PIPELINE_STEPS[index]);
    setFeedback($('#pipelineFeedback'), 'error', `第 ${firstWrong + 1} 个环节不对。媒体要先变小、装好，才适合在网络中推送。`);
  });

  render(true);
}
