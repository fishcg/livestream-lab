import { $, $$ } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { responsivePicture } from '../../core/media.js';
import { TRIAGE_STOPS } from '../../data/stage4.js?v=20260729-1';

let currentStop = 0;
let tourTimer;

function stopAutoTour(label = '自动分诊') {
  window.clearInterval(tourTimer);
  tourTimer = undefined;
  const button = $('#stage4TourAuto');
  if (button) button.textContent = label;
}

function renderStops() {
  $('#stage4TourSteps').innerHTML = TRIAGE_STOPS.map((stop, index) => `
    <button type="button" class="stage4-tour-step${index === currentStop ? ' active' : ''}" data-index="${index}" aria-pressed="${index === currentStop}">
      <span>${iconMarkup(stop.icon)}</span><small>${String(index + 1).padStart(2, '0')}</small><b>${stop.name}</b>
    </button>${index < TRIAGE_STOPS.length - 1 ? '<i aria-hidden="true">→</i>' : ''}
  `).join('');
  $$('.stage4-tour-step', $('#stage4TourSteps')).forEach((button) => {
    button.addEventListener('click', () => {
      stopAutoTour();
      currentStop = Number(button.dataset.index);
      renderTour();
    });
  });
}

function renderTour() {
  const stop = TRIAGE_STOPS[currentStop];
  renderStops();
  $('#stage4TourCounter').textContent = `${String(currentStop + 1).padStart(2, '0')} / ${String(TRIAGE_STOPS.length).padStart(2, '0')}`;
  $('#stage4TourDetail').innerHTML = `
    <figure>${responsivePicture(`https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/stage4/journey/${stop.image}`, stop.alt || stop.role)}<figcaption><small>${stop.en} · ${String(currentStop + 1).padStart(2, '0')}</small><b>${stop.name}</b></figcaption></figure>
    <div class="stage4-tour-story"><span>急诊室旁白</span><h4>${stop.role}</h4><p>${stop.story}</p><div><small>技术真相</small><p>${stop.truth}</p></div></div>
    <aside><small>这一站交出什么</small><b>${stop.output}</b><small>分诊提醒</small><p>${stop.check}</p></aside>
  `;
  $('#stage4TourPrev').disabled = currentStop === 0;
  $('#stage4TourNext').textContent = currentStop === TRIAGE_STOPS.length - 1 ? '重新挂号' : '进入下一科';
  $('#stage4TourPractice').dataset.scroll = stop.target;
  $('#stage4TourPractice').textContent = stop.target === 'stage4-overview' ? '看当前讲解' : '去对应实操';
}

function moveStop(offset) {
  stopAutoTour();
  currentStop = (currentStop + offset + TRIAGE_STOPS.length) % TRIAGE_STOPS.length;
  renderTour();
}

function startAutoTour() {
  stopAutoTour();
  currentStop = 0;
  renderTour();
  $('#stage4TourAuto').textContent = '分诊进行中';
  tourTimer = window.setInterval(() => {
    if (currentStop === TRIAGE_STOPS.length - 1) {
      stopAutoTour('重新自动分诊');
      return;
    }
    currentStop += 1;
    renderTour();
  }, 3200);
}

export function initStage4Tour() {
  $('#stage4TourPrev')?.addEventListener('click', () => moveStop(-1));
  $('#stage4TourNext')?.addEventListener('click', () => moveStop(1));
  $('#stage4TourAuto')?.addEventListener('click', startAutoTour);
  $('#stage4TourPractice')?.addEventListener('click', (event) => {
    stopAutoTour();
    $(`#${event.currentTarget.dataset.scroll}`)?.scrollIntoView({ behavior: 'smooth' });
  });
  renderTour();
}
