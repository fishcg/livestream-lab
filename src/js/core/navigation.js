import { $, $$ } from './dom.js';

function normalizeStage(stage) {
  return Math.min(5, Math.max(1, Number(stage) || 1));
}

export function showStage(stage, options = {}) {
  const current = normalizeStage(stage);
  $$('.stage').forEach((element) => {
    element.classList.toggle('active', Number(element.dataset.stage) === current);
  });
  $$('.nav-item').forEach((element) => {
    element.classList.toggle('active', Number(element.dataset.stage) === current);
  });
  $('#sidebar')?.classList.remove('open');
  $('#menuToggle')?.setAttribute('aria-expanded', 'false');
  history.replaceState(null, '', `#stage-${current}`);
  if (options.scroll !== false) window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function initNavigation() {
  $$('.nav-item').forEach((item) => {
    item.addEventListener('click', () => showStage(item.dataset.stage));
  });
  $$('[data-stage-jump]').forEach((item) => {
    item.addEventListener('click', () => showStage(item.dataset.stageJump));
  });
  $$('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      $(`#${button.dataset.scroll}`)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  $('#menuToggle')?.addEventListener('click', () => {
    const open = $('#sidebar')?.classList.toggle('open');
    $('#menuToggle')?.setAttribute('aria-expanded', String(Boolean(open)));
  });

  window.addEventListener('hashchange', () => {
    const stageFromHash = location.hash.match(/^#stage-(\d)$/)?.[1];
    if (stageFromHash) showStage(stageFromHash, { scroll: false });
  });

  const stageFromHash = location.hash.match(/^#stage-(\d)$/)?.[1];
  showStage(stageFromHash || 1, { scroll: false });
}
