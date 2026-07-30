import { $, $$ } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { ARCHITECTURE_STOPS } from '../../data/stage5.js?v=20260729-1';

let currentStop = 0;
let autoTimer;

function stopAuto(label = '自动巡检') {
  window.clearInterval(autoTimer);
  autoTimer = undefined;
  const button = $('#stage5BlueprintAuto');
  if (button) button.textContent = label;
}

function renderSteps() {
  $('#stage5BlueprintSteps').innerHTML = ARCHITECTURE_STOPS.map((stop, index) => `
    <button type="button" class="stage5-blueprint-step${index === currentStop ? ' active' : ''}" data-index="${index}" aria-pressed="${index === currentStop}">
      <span>${iconMarkup(stop.icon)}</span><small>${String(index + 1).padStart(2, '0')} · ${stop.en}</small><b>${stop.name}</b>
    </button>${index < ARCHITECTURE_STOPS.length - 1 ? '<i aria-hidden="true">→</i>' : ''}
  `).join('');
  $$('.stage5-blueprint-step').forEach((button) => button.addEventListener('click', () => {
    stopAuto();
    currentStop = Number(button.dataset.index);
    renderBlueprint();
  }));
}

function renderBlueprint() {
  const stop = ARCHITECTURE_STOPS[currentStop];
  renderSteps();
  $('#stage5BlueprintCounter').textContent = `${String(currentStop + 1).padStart(2, '0')} / ${String(ARCHITECTURE_STOPS.length).padStart(2, '0')}`;
  $('#stage5BlueprintDetail').innerHTML = `
    <div class="stage5-blueprint-visual"><span>${iconMarkup(stop.icon)}</span><small>${stop.en}</small><b>${stop.name}</b><i></i><i></i><i></i></div>
    <div class="stage5-blueprint-story"><small>总装厂讲解</small><h4>${stop.role}</h4><p>${stop.story}</p><div><b>技术真相</b><p>${stop.truth}</p></div></div>
    <aside><small>这一层交出什么</small><b>${stop.output}</b><small>上线后看什么</small><p>${stop.check}</p></aside>
  `;
  $('#stage5BlueprintPrev').disabled = currentStop === 0;
  $('#stage5BlueprintNext').textContent = currentStop === ARCHITECTURE_STOPS.length - 1 ? '回到入口' : '下一站';
}

function moveStop(offset) {
  stopAuto();
  currentStop = (currentStop + offset + ARCHITECTURE_STOPS.length) % ARCHITECTURE_STOPS.length;
  renderBlueprint();
}

function startAuto() {
  stopAuto();
  currentStop = 0;
  renderBlueprint();
  $('#stage5BlueprintAuto').textContent = '巡检进行中';
  autoTimer = window.setInterval(() => {
    if (currentStop === ARCHITECTURE_STOPS.length - 1) {
      stopAuto('重新自动巡检');
      return;
    }
    currentStop += 1;
    renderBlueprint();
  }, 3200);
}

export function initBlueprint() {
  $('#stage5BlueprintPrev')?.addEventListener('click', () => moveStop(-1));
  $('#stage5BlueprintNext')?.addEventListener('click', () => moveStop(1));
  $('#stage5BlueprintAuto')?.addEventListener('click', startAuto);
  renderBlueprint();
}
