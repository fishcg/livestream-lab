import { $, $$ } from '../../core/dom.js';

const SYNC_CASES = {
  soundFirst: { diff: 240, name: '声音抢跑', note: '音频比视频早约 240ms。可以先用音频延迟补偿验证固定偏差。', drift: false },
  videoFirst: { diff: -320, name: '画面抢跑', note: '视频比音频早约 320ms。负向音频补偿代表让音频调度更早。', drift: false },
  drift: { diff: 430, name: '持续漂移', note: '此刻可以对齐，但偏差仍会继续增长。静态补偿只能止痛，根因在时钟或 PTS。', drift: true }
};

let currentCase = 'soundFirst';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function renderSync() {
  const item = SYNC_CASES[currentCase];
  const correction = Number($('#stage4SyncCorrection').value);
  const effective = item.diff - correction;
  const aligned = Math.abs(effective) <= 80;
  $('#stage4SyncCorrectionOut').textContent = `${correction > 0 ? '+' : ''}${correction} ms`;
  $('#stage4SyncDiff').textContent = `${effective > 0 ? '+' : ''}${effective} ms`;
  $('#stage4SyncDiagnosis').textContent = item.drift ? '暂时对齐也要追查漂移' : aligned ? '音画进入可接受窗口' : effective > 0 ? '声音仍然领先' : '画面仍然领先';
  $('#stage4SyncDiagnosis').className = aligned && !item.drift ? 'safe' : item.drift ? 'warning' : 'danger';
  $('#stage4VideoMarker').style.left = '50%';
  $('#stage4AudioMarker').style.left = `${clamp(50 - effective / 12, 12, 88)}%`;
  $('#stage4SyncHint').textContent = `${item.name}：${item.note}${aligned ? ' 当前补偿已把两条轨道拉进 ±80ms 教学窗口。' : ' 继续调整补偿，观察两条轨道如何靠近。'}`;
  $('#stage4SyncStage').classList.toggle('drifting', item.drift);
  $$('#stage4SyncModes button').forEach((button) => {
    const active = button.dataset.case === currentCase;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

export function initSyncLab() {
  $('#stage4SyncCorrection')?.addEventListener('input', renderSync);
  $$('#stage4SyncModes button').forEach((button) => button.addEventListener('click', () => {
    currentCase = button.dataset.case;
    $('#stage4SyncCorrection').value = '0';
    renderSync();
  }));
  renderSync();
}
