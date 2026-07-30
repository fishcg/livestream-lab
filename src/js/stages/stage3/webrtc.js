import { $, $$ } from '../../core/dom.js';
import { WEBRTC_LATENCY_SCENARIOS, WEBRTC_STEPS } from '../../data/stage3.js?v=20260730-4';

let stepIndex = 0;
let routeMode = 'direct';
let networkCondition = 'stable';

function renderConnectionStep() {
  $$('.stage3-webrtc-step').forEach((button, index) => {
    button.classList.toggle('active', index === stepIndex);
    button.classList.toggle('passed', index < stepIndex);
    button.setAttribute('aria-pressed', String(index === stepIndex));
  });
  const current = WEBRTC_STEPS[stepIndex];
  $('#stage3WebrtcCounter').textContent = `${String(stepIndex + 1).padStart(2, '0')} / ${String(WEBRTC_STEPS.length).padStart(2, '0')}`;
  $('#stage3WebrtcName').textContent = current.name;
  $('#stage3WebrtcCode').textContent = current.code;
  $('#stage3WebrtcDetail').textContent = current.detail;
  $('#stage3WebrtcPrev').disabled = stepIndex === 0;
  $('#stage3WebrtcNext').textContent = stepIndex === WEBRTC_STEPS.length - 1 ? '重新开始' : '下一步';
}

function renderRoute() {
  const relay = routeMode === 'relay';
  $('#stage3WebrtcRoute').classList.toggle('relay', relay);
  $('#stage3WebrtcPath').textContent = relay ? 'TURN 中继路径' : 'ICE 选中直连路径';
  $('#stage3WebrtcLatency').textContent = relay ? '约 0.8～1.5 秒' : '约 0.2～0.8 秒';
  $('#stage3WebrtcCost').textContent = relay ? '中继服务器承担双向媒体带宽' : '媒体尽量直接传输，服务端带宽压力较小';
  $('#stage3WebrtcRouteHint').textContent = relay
    ? '严格 NAT 或防火墙让直连候选失败，TURN 提供可达性兜底；代价是额外跳数与带宽成本。'
    : '双方通过 STUN 获得外网映射，ICE 检查后选中可直达的候选对；这是理想路径，但并非所有网络都能做到。';
  $$('#stage3RouteModes button').forEach((button) => {
    const active = button.dataset.route === routeMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function renderLatencyRace() {
  const scenario = WEBRTC_LATENCY_SCENARIOS[networkCondition];
  const race = $('#stage3LatencyRace');
  race.className = `stage3-latency-race condition-${networkCondition}`;
  $('#stage3LatencyScenario').textContent = scenario.summary;
  $('#stage3LatencyTakeaway').textContent = scenario.takeaway;

  ['hls', 'flv', 'webrtc'].forEach((protocol) => {
    const result = scenario[protocol];
    $(`#stage3Latency-${protocol}-value`).textContent = result.latency;
    $(`#stage3Latency-${protocol}-wait`).textContent = result.wait;
    $(`#stage3Latency-${protocol}-outcome`).textContent = result.outcome;
    $(`#stage3Latency-${protocol}-bar`).style.setProperty('--latency-level', `${result.level}%`);
  });

  $$('#stage3LatencyModes button').forEach((button) => {
    const active = button.dataset.condition === networkCondition;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

export function initWebrtcLab() {
  $$('.stage3-webrtc-step').forEach((button, index) => button.addEventListener('click', () => {
    stepIndex = index;
    renderConnectionStep();
  }));
  $('#stage3WebrtcPrev')?.addEventListener('click', () => {
    stepIndex = Math.max(0, stepIndex - 1);
    renderConnectionStep();
  });
  $('#stage3WebrtcNext')?.addEventListener('click', () => {
    stepIndex = stepIndex === WEBRTC_STEPS.length - 1 ? 0 : stepIndex + 1;
    renderConnectionStep();
  });
  $$('#stage3RouteModes button').forEach((button) => button.addEventListener('click', () => {
    routeMode = button.dataset.route;
    renderRoute();
  }));
  $$('#stage3LatencyModes button').forEach((button) => button.addEventListener('click', () => {
    networkCondition = button.dataset.condition;
    renderLatencyRace();
  }));
  renderConnectionStep();
  renderLatencyRace();
  renderRoute();
}
