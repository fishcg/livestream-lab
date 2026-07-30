import { $, $$ } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { REAL_CHAIN_MISSION, REAL_CHAIN_STEPS } from '../../data/real-chain.js?v=20260730-1';

let currentStep = 0;
let stepSolved = false;
let attempts = 0;
let lastWrongChoice = '';
let finished = false;

function renderRoute() {
  $('#stage5ChainRoute').innerHTML = REAL_CHAIN_STEPS.map((step, index) => {
    const state = finished || index < currentStep ? 'done' : index === currentStep ? 'current' : 'locked';
    return `
      <div class="stage5-chain-node ${state}" aria-current="${state === 'current' ? 'step' : 'false'}">
        <span>${iconMarkup(step.icon)}</span><small>${String(index + 1).padStart(2, '0')} · ${step.phase}</small><b>${step.name}</b>
      </div>${index < REAL_CHAIN_STEPS.length - 1 ? '<i aria-hidden="true">→</i>' : ''}
    `;
  }).join('');
}

function renderMission() {
  $('#stage5ChainMission').innerHTML = `
    <div><small>你的任务</small><b>${REAL_CHAIN_MISSION.title}</b></div>
    <p>${REAL_CHAIN_MISSION.constraints}</p>
    <p>${REAL_CHAIN_MISSION.goal}</p>
  `;
}

function renderCurrentStep() {
  const step = REAL_CHAIN_STEPS[currentStep];
  const correctChoice = step.choices.find((choice) => choice.id === step.correct);
  $('#stage5ChainProgress').textContent = `${String(currentStep).padStart(2, '0')} / ${String(REAL_CHAIN_STEPS.length).padStart(2, '0')} 已接通`;
  $('#stage5ChainCurrent').innerHTML = `
    <div class="stage5-chain-station">
      <span>${iconMarkup(step.icon)}</span><small>${step.phase} · ${String(currentStep + 1).padStart(2, '0')}</small><h4>${step.name}</h4><b>${step.en}</b>
      <div class="stage5-chain-io" role="img" aria-label="${step.input}，经过${step.action}，输出${step.output}">
        <div><small>输入</small><p>${step.input}</p></div><i aria-hidden="true">→</i>
        <div class="active"><small>这一站做什么</small><p>${step.action}</p></div><i aria-hidden="true">→</i>
        <div><small>交给下一站</small><p>${step.output}</p></div>
      </div>
    </div>
    <div class="stage5-chain-task">
      <small>现场讲解</small><p>${step.story}</p>
      <div class="stage5-chain-question"><b>你会怎样接通这一站？</b><span>选错可继续尝试，第 3 次会给出明确提示。</span></div>
      <div class="stage5-chain-options">
        ${step.choices.map((choice) => `<button type="button" data-choice="${choice.id}" class="${stepSolved && choice.id === step.correct ? 'correct' : lastWrongChoice === choice.id ? 'wrong' : ''}" ${stepSolved ? 'disabled' : ''}><b>${choice.label}</b><small>${choice.note}</small></button>`).join('')}
      </div>
      <div class="stage5-chain-feedback ${stepSolved ? 'success' : lastWrongChoice ? 'error' : ''}" role="status">
        ${stepSolved ? `接通成功。验证时看：${step.evidence}` : lastWrongChoice ? `${attempts >= 3 ? `明确提示：应选择“${correctChoice.label}”。` : step.hint} 已尝试 ${attempts} 次。` : step.hint}
      </div>
    </div>
  `;

  $$('.stage5-chain-options button').forEach((button) => button.addEventListener('click', () => chooseOption(button.dataset.choice)));
  $('#stage5ChainNext').disabled = !stepSolved;
  $('#stage5ChainNext').textContent = currentStep === REAL_CHAIN_STEPS.length - 1 ? '完成整条链路' : '接通下一站';
}

function renderFinished() {
  $('#stage5ChainProgress').textContent = `${REAL_CHAIN_STEPS.length} / ${REAL_CHAIN_STEPS.length} 全线接通`;
  $('#stage5ChainCurrent').innerHTML = `
    <div class="stage5-chain-finished">
      <span>${iconMarkup('playback')}</span><small>END-TO-END LIVE · COMPLETE</small><h4>观众已经看到直播，证据也回到了控制室</h4>
      <p>${REAL_CHAIN_STEPS.map((step) => step.name).join(' → ')}</p>
      <div>
        <section><small>主播侧</small><b>身份、场次、采集、编码与推流均可验证</b></section>
        <section><small>服务端</small><b>接入、转码、播放产品与源站职责分离</b></section>
        <section><small>分发侧</small><b>CDN 主干、P2P 协助，并保留故障退路</b></section>
        <section><small>观众侧</small><b>拉流、缓冲、解封装、解码、PTS 同步与 QoE 闭环</b></section>
      </div>
    </div>
  `;
  $('#stage5ChainNext').disabled = true;
  $('#stage5ChainNext').textContent = '全线已接通';
}

function chooseOption(choiceId) {
  if (stepSolved || finished) return;
  const step = REAL_CHAIN_STEPS[currentStep];
  if (choiceId === step.correct) {
    stepSolved = true;
    lastWrongChoice = '';
  } else {
    attempts += 1;
    lastWrongChoice = choiceId;
  }
  renderCurrentStep();
}

function moveNext() {
  if (!stepSolved || finished) return;
  if (currentStep === REAL_CHAIN_STEPS.length - 1) {
    finished = true;
    renderRoute();
    renderFinished();
    return;
  }
  currentStep += 1;
  stepSolved = false;
  attempts = 0;
  lastWrongChoice = '';
  renderRoute();
  renderCurrentStep();
  const currentNode = $('#stage5ChainRoute').querySelector('.current');
  currentNode?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function resetChain() {
  currentStep = 0;
  stepSolved = false;
  attempts = 0;
  lastWrongChoice = '';
  finished = false;
  renderRoute();
  renderCurrentStep();
}

export function initRealChainBuilder() {
  if (!$('#stage5ChainBuilder')) return;
  renderMission();
  renderRoute();
  renderCurrentStep();
  $('#stage5ChainNext')?.addEventListener('click', moveNext);
  $('#stage5ChainReset')?.addEventListener('click', resetChain);
}
