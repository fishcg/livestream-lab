import { $, $$ } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { responsivePicture } from '../../core/media.js';
import { PLAYBACK_STEPS } from '../../data/stage3.js?v=20260729-4';

let currentStop = 0;
let tourTimer;

function stopAutoTour(label = '自动导览') {
  window.clearInterval(tourTimer);
  tourTimer = undefined;
  const button = $('#stage3JourneyAuto');
  if (button) button.textContent = label;
}

function renderStops() {
  $('#stage3PlaybackSteps').innerHTML = PLAYBACK_STEPS.map((stop, index) => `
    <button type="button" class="stage3-playback-step${index === currentStop ? ' active' : ''}" data-index="${index}" aria-pressed="${index === currentStop}">
      <span>${iconMarkup(stop.icon)}</span><small>${String(index + 1).padStart(2, '0')}</small><b>${stop.name}</b>
    </button>${index < PLAYBACK_STEPS.length - 1 ? '<i aria-hidden="true">→</i>' : ''}
  `).join('');
  $$('.stage3-playback-step', $('#stage3PlaybackSteps')).forEach((button) => {
    button.addEventListener('click', () => {
      stopAutoTour();
      currentStop = Number(button.dataset.index);
      renderTour();
    });
  });
}

function renderTour() {
  const stop = PLAYBACK_STEPS[currentStop];
  renderStops();
  $('#stage3JourneyCounter').textContent = `${String(currentStop + 1).padStart(2, '0')} / ${String(PLAYBACK_STEPS.length).padStart(2, '0')}`;
  $('#stage3PlaybackDetail').innerHTML = `
    <figure>${responsivePicture(`https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/stage3/journey/${stop.image}`, stop.alt)}<figcaption><small>${stop.en} · ${String(currentStop + 1).padStart(2, '0')}</small><b>${stop.name}</b></figcaption></figure>
    <div class="stage3-tour-story"><span>观众旅行旁白</span><h4>${stop.role}</h4><p>${stop.story}</p><div><small>技术真相</small><p>${stop.truth}</p></div></div>
    <aside><small>这一站交出什么</small><b>${stop.output}</b><small>排查提醒</small><p>${stop.check}</p></aside>
  `;
  $('#stage3JourneyPrev').disabled = currentStop === 0;
  $('#stage3JourneyNext').textContent = currentStop === PLAYBACK_STEPS.length - 1 ? '回到播放入口' : '继续旅行';
  $('#stage3JourneyPractice').dataset.scroll = stop.target;
  $('#stage3JourneyPractice').textContent = stop.target === 'stage3-overview' ? '看当前讲解' : '去本站实操';
}

function moveStop(offset) {
  stopAutoTour();
  currentStop = (currentStop + offset + PLAYBACK_STEPS.length) % PLAYBACK_STEPS.length;
  renderTour();
}

function startAutoTour() {
  stopAutoTour();
  currentStop = 0;
  renderTour();
  $('#stage3JourneyAuto').textContent = '导览进行中';
  tourTimer = window.setInterval(() => {
    if (currentStop === PLAYBACK_STEPS.length - 1) {
      stopAutoTour('重新自动导览');
      return;
    }
    currentStop += 1;
    renderTour();
  }, 3200);
}

export function initStage3Tour() {
  $('#stage3JourneyPrev')?.addEventListener('click', () => moveStop(-1));
  $('#stage3JourneyNext')?.addEventListener('click', () => moveStop(1));
  $('#stage3JourneyAuto')?.addEventListener('click', startAutoTour);
  $('#stage3JourneyPractice')?.addEventListener('click', (event) => {
    stopAutoTour();
    $(`#${event.currentTarget.dataset.scroll}`)?.scrollIntoView({ behavior: 'smooth' });
  });
  renderTour();
}
