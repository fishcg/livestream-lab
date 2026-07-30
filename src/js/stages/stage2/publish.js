import { $, $$ } from '../../core/dom.js';
import {
  TERM_EXPLAINER_CHANGE_EVENT,
  setTermExplainerSelection
} from '../../core/term-explainer.js?v=20260730-2';
import { PUBLISH_STEPS } from '../../data/stage2.js?v=20260729-8';

let publishIndex = 0;
let publishTimer;

function renderPublish({ syncExplainer = true } = {}) {
  $$('.stage2-publish-step').forEach((button, index) => {
    button.classList.toggle('active', index === publishIndex);
    button.classList.toggle('passed', index < publishIndex);
    button.setAttribute('aria-pressed', String(index === publishIndex));
  });
  const item = PUBLISH_STEPS[publishIndex];
  $('#stage2PublishCounter').textContent = `${String(publishIndex + 1).padStart(2, '0')} / ${String(PUBLISH_STEPS.length).padStart(2, '0')}`;
  $('#stage2PublishName').textContent = item.name;
  $('#stage2PublishCode').textContent = item.code;
  $('#stage2PublishDetail').textContent = item.detail;
  $('#stage2PublishPrev').disabled = publishIndex === 0;
  $('#stage2PublishNext').textContent = publishIndex === PUBLISH_STEPS.length - 1 ? '重新开始' : '下一步';
  if (syncExplainer) setTermExplainerSelection('stage2-rtmp', publishIndex);
}

function startPublishReplay() {
  window.clearInterval(publishTimer);
  publishIndex = 0;
  renderPublish();
  publishTimer = window.setInterval(() => {
    if (publishIndex === PUBLISH_STEPS.length - 1) {
      window.clearInterval(publishTimer);
      return;
    }
    publishIndex += 1;
    renderPublish();
  }, 900);
}

export function initPublishLesson() {
  const termExplainer = document.querySelector('[data-term-set="stage2-rtmp"]');
  termExplainer?.addEventListener(TERM_EXPLAINER_CHANGE_EVENT, (event) => {
    if (event.detail?.termSet !== 'stage2-rtmp') return;
    window.clearInterval(publishTimer);
    publishIndex = event.detail.index;
    renderPublish({ syncExplainer: false });
  });
  $$('.stage2-publish-step').forEach((button, index) => {
    button.addEventListener('click', () => {
      window.clearInterval(publishTimer);
      publishIndex = index;
      renderPublish();
    });
  });
  $('#stage2PublishPrev')?.addEventListener('click', () => {
    window.clearInterval(publishTimer);
    publishIndex = Math.max(0, publishIndex - 1);
    renderPublish();
  });
  $('#stage2PublishNext')?.addEventListener('click', () => {
    window.clearInterval(publishTimer);
    publishIndex = publishIndex === PUBLISH_STEPS.length - 1 ? 0 : publishIndex + 1;
    renderPublish();
  });
  $('#stage2PublishReplay')?.addEventListener('click', startPublishReplay);
  renderPublish();
}
