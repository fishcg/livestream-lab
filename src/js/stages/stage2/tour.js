import { $, $$ } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { PUSH_JOURNEY } from '../../data/stage2.js?v=20260729-8';

let currentStop = 0;
let tourTimer;

function stopPicture(stop) {
  const base = `https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/stage2/journey/${stop.image}`;
  return `<picture><source srcset="${base}.webp" type="image/webp"><img src="${base}-fallback.jpg" alt="${stop.alt}"></picture>`;
}

function renderStops() {
  $('#stage2JourneySteps').innerHTML = PUSH_JOURNEY.map((stop, index) => `
    <button type="button" class="stage2-journey-step${index === currentStop ? ' active' : ''}" data-index="${index}" aria-pressed="${index === currentStop}">
      <span>${iconMarkup(stop.icon)}</span><small>${String(index + 1).padStart(2, '0')}</small><b>${stop.name}</b>
    </button>${index < PUSH_JOURNEY.length - 1 ? '<i aria-hidden="true">→</i>' : ''}
  `).join('');
  $$('.stage2-journey-step', $('#stage2JourneySteps')).forEach((button) => {
    button.addEventListener('click', () => {
      window.clearInterval(tourTimer);
      currentStop = Number(button.dataset.index);
      renderTour();
    });
  });
}

function renderTour() {
  const stop = PUSH_JOURNEY[currentStop];
  renderStops();
  $('#stage2JourneyCounter').textContent = `${String(currentStop + 1).padStart(2, '0')} / ${String(PUSH_JOURNEY.length).padStart(2, '0')}`;
  $('#stage2JourneyDetail').innerHTML = `
    <figure>${stopPicture(stop)}<figcaption><small>${stop.en} · ${String(currentStop + 1).padStart(2, '0')}</small><b>${stop.name}</b></figcaption></figure>
    <div class="stage2-tour-story"><span>导游旁白</span><h4>${stop.role}</h4><p>${stop.story}</p><div><small>技术真相</small><p>${stop.truth}</p></div></div>
    <aside><small>这一站交出什么</small><b>${stop.output}</b><small>旅行安全提示</small><p>${stop.check}</p></aside>
  `;
  $('#stage2JourneyPrev').disabled = currentStop === 0;
  $('#stage2JourneyNext').textContent = currentStop === PUSH_JOURNEY.length - 1 ? '回到出发站' : '继续旅行';
  $('#stage2JourneyPractice').dataset.scroll = stop.target;
  $('#stage2JourneyPractice').textContent = stop.target === 'stage2-overview' ? '看当前讲解' : '去本站实操';
}

function moveStop(offset) {
  window.clearInterval(tourTimer);
  currentStop = (currentStop + offset + PUSH_JOURNEY.length) % PUSH_JOURNEY.length;
  renderTour();
}

function startAutoTour() {
  window.clearInterval(tourTimer);
  currentStop = 0;
  renderTour();
  tourTimer = window.setInterval(() => {
    if (currentStop === PUSH_JOURNEY.length - 1) {
      window.clearInterval(tourTimer);
      $('#stage2JourneyAuto').textContent = '重新自动导览';
      return;
    }
    currentStop += 1;
    renderTour();
  }, 3200);
}

export function initStage2Tour() {
  $('#stage2JourneyPrev')?.addEventListener('click', () => moveStop(-1));
  $('#stage2JourneyNext')?.addEventListener('click', () => moveStop(1));
  $('#stage2JourneyAuto')?.addEventListener('click', startAutoTour);
  $('#stage2JourneyPractice')?.addEventListener('click', (event) => {
    window.clearInterval(tourTimer);
    const target = $(`#${event.currentTarget.dataset.scroll}`);
    target?.scrollIntoView({ behavior: 'smooth' });
  });
  renderTour();
}
