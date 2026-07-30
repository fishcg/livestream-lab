import { $, $$ } from '../../core/dom.js';

let networkMode = 'stable';

const MODES = {
  stable: { label: '网络稳定', jitter: 0.25, outage: 0, note: '数据到达均匀，较小缓冲也能连续播放。' },
  jitter: { label: '明显抖动', jitter: 1.6, outage: 0, note: '数据时快时慢，需要更大缓冲吸收波动。' },
  outage: { label: '中断 2 秒', jitter: 0.8, outage: 2, note: '连接短暂停顿，缓冲存量决定是否会卡住。' }
};

function renderPackets() {
  $('#stage3FlvPackets').innerHTML = Array.from(
    { length: 16 },
    (_, index) => `<i style="--i:${index};--speed:${1.4 + (index % 4) * 0.45}s"></i>`
  ).join('');
}

function renderFlvLab() {
  const buffer = Number($('#stage3FlvBuffer').value);
  const mode = MODES[networkMode];
  const required = Math.max(0.6, mode.jitter + mode.outage);
  const safe = buffer >= required;
  const latency = buffer + 0.7;
  $('#stage3FlvBufferOut').textContent = `${buffer.toFixed(1)} 秒`;
  $('#stage3FlvLatency').textContent = `约 ${latency.toFixed(1)} 秒`;
  $('#stage3FlvRisk').textContent = safe ? '较低' : '较高';
  $('#stage3FlvRisk').classList.toggle('danger', !safe);
  $('#stage3FlvHint').textContent = `${mode.note}${safe ? ' 当前缓冲足以覆盖这次波动。' : ` 当前只有 ${buffer.toFixed(1)} 秒存量，可能来不及等到数据恢复。`}`;
  $('#stage3FlvStream').className = `stage3-flv-stream mode-${networkMode}${safe ? ' safe' : ' danger'}`;
  $$('#stage3FlvModes button').forEach((button) => {
    const active = button.dataset.mode === networkMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

export function initFlvLab() {
  renderPackets();
  $('#stage3FlvBuffer')?.addEventListener('input', renderFlvLab);
  $$('#stage3FlvModes button').forEach((button) => {
    button.addEventListener('click', () => {
      networkMode = button.dataset.mode;
      renderFlvLab();
    });
  });
  renderFlvLab();
}
