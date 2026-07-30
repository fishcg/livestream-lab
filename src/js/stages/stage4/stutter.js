import { $, $$ } from '../../core/dom.js';

const MODES = {
  stable: {
    label: '稳定送达', required: 0.8, arrival: '均匀', dropped: 0,
    states: ['均匀到达', '水位稳定', '及时处理', '连续播放'],
    cause: '链路正常', badge: '流畅',
    story: '包裹均匀送到，缓冲仓库保持水位，解码工位也能及时处理。',
    note: '数据到达节奏稳定，小缓冲也能保持连续播放。',
    packetDurations: [2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8],
    arrivalSeries: [42, 45, 43, 46, 44, 42, 45, 43, 44, 46, 43, 45],
    bufferSeries: [66, 68, 67, 69, 68, 70, 69, 68, 70, 69, 68, 70],
    dropSeries: [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4],
    shapes: ['间隔均匀', '水位稳定', '几乎不变']
  },
  jitter: {
    label: '网络抖动', required: 2.2, arrival: '忽快忽慢', dropped: 2,
    states: ['忽快忽慢', '反复涨落', '时等时忙', '偶尔停顿'],
    cause: '网络送货节奏', badge: '时走时停',
    story: '包裹没有持续丢失，但有时扎堆、有时很久不来。缓冲仓库便会反复涨落。',
    note: '平均带宽可能足够，但长短不一的到达间隔会冲击缓冲水位。',
    packetDurations: [1.15, 3.5, 1.25, 4.1, 1.35, 2.9, 1.1, 3.8],
    arrivalSeries: [20, 82, 25, 91, 18, 72, 28, 96, 22, 78, 30, 88],
    bufferSeries: [72, 60, 74, 48, 67, 39, 62, 31, 57, 38, 64, 42],
    dropSeries: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
    shapes: ['高低交替', '上下波动', '偶尔增加']
  },
  loss: {
    label: '连续丢包', required: 3.2, arrival: '出现缺口', dropped: 7,
    states: ['包裹连续消失', '快速见底', '等不到数据', '画面冻结'],
    cause: '网络连续丢包', badge: '冻结',
    story: '一批包裹在路上连续消失，缓冲仓库得不到补货，很快见底，画面只能停住等待。',
    note: '重传或恢复数据需要时间，缓冲不够时会直接见底。',
    packetDurations: [2.7, 2.8, 2.7, 2.8, 2.7, 2.8, 2.7, 2.8],
    lostPackets: [2, 3, 4],
    arrivalSeries: [44, 46, 48, 4, 4, 4, 57, 49, 45, 46, 47, 44],
    bufferSeries: [76, 68, 57, 43, 27, 12, 6, 18, 31, 45, 56, 63],
    dropSeries: [2, 3, 4, 8, 13, 19, 25, 28, 30, 31, 32, 33],
    shapes: ['连续空档', '快速下探', '阶梯上涨']
  },
  decode: {
    label: '解码过载', required: 1.1, arrival: '网络正常', dropped: 14,
    states: ['均匀到达', '仓库有货', '处理不完', '不断跳帧'],
    cause: '设备解码工位', badge: '掉帧',
    story: '包裹按时送到，缓冲仓库里也有货，但解码工位速度太慢，只能丢掉部分画面。',
    note: '数据已经到达，但设备消费不完；盲目加缓冲会增加延迟，不能治好掉帧。',
    packetDurations: [2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8],
    arrivalSeries: [43, 45, 44, 46, 42, 44, 45, 43, 46, 44, 43, 45],
    bufferSeries: [62, 66, 69, 72, 76, 80, 82, 84, 86, 88, 89, 90],
    dropSeries: [3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 92],
    shapes: ['间隔均匀', '有货且上涨', '持续陡升']
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
let currentMode = 'stable';

function renderPackets(mode) {
  const road = $('#stage4PacketRoad');
  if (!road) return;
  road.innerHTML = mode.packetDurations.map((duration, index) => {
    const lost = mode.lostPackets?.includes(index);
    const className = lost ? ' class="lost"' : '';
    return `<i${className} style="--delay:${index * -0.43}s;--duration:${duration}s"><span>${lost ? '×' : index + 1}</span></i>`;
  }).join('');
}

function renderChart(selector, values, offset = 0) {
  const chart = $(selector);
  if (!chart) return;
  chart.innerHTML = values.map((value) => {
    const adjusted = clamp(value + offset, 3, 100);
    return `<i style="--value:${adjusted}%"></i>`;
  }).join('');
}

function renderSignalShapes(mode, buffer) {
  const bufferOffset = Math.round((buffer - 2) * 9);
  renderChart('#stage4ArrivalWave', mode.arrivalSeries);
  renderChart('#stage4BufferWave', mode.bufferSeries, bufferOffset);
  renderChart('#stage4DropWave', mode.dropSeries);
  $('#stage4ArrivalShape').textContent = mode.shapes[0];
  $('#stage4BufferShape').textContent = mode.shapes[1];
  $('#stage4DropShape').textContent = mode.shapes[2];
}

function updateStory(mode) {
  const stateIds = ['#stage4NetworkState', '#stage4BufferState', '#stage4DecoderState', '#stage4ScreenState'];
  stateIds.forEach((selector, index) => { $(selector).textContent = mode.states[index]; });
  $('#stage4CauseTitle').textContent = mode.cause;
  $('#stage4CauseStory').textContent = mode.story;
  $('#stage4ScreenBadge').textContent = mode.badge;
}

function renderStutter() {
  const mode = MODES[currentMode];
  const buffer = Number($('#stage4StutterBuffer').value);
  const safe = currentMode !== 'decode' && buffer >= mode.required;
  const waterLevel = clamp(Math.round(28 + buffer / 5 * 62), 20, 92);
  const waterLow = currentMode === 'loss'
    ? clamp(waterLevel - 52, 4, 45)
    : currentMode === 'jitter'
      ? clamp(waterLevel - 27, 8, 65)
      : currentMode === 'decode'
        ? clamp(waterLevel + 8, 25, 96)
        : clamp(waterLevel - 5, 16, 90);

  $('#stage4StutterMonitor').dataset.mode = currentMode;
  $('#stage4StutterBufferOut').textContent = `${buffer.toFixed(1)} 秒`;
  $('#stage4StutterArrival').textContent = mode.arrival;
  $('#stage4StutterRisk').textContent = safe ? '较低' : '较高';
  $('#stage4StutterRisk').className = safe ? 'safe' : 'danger';
  $('#stage4DroppedFrames').textContent = currentMode === 'decode'
    ? `${mode.dropped} 帧/分钟并持续增长`
    : `${safe ? Math.max(0, mode.dropped - 2) : mode.dropped} 帧/分钟`;
  $('#stage4BufferWater').style.setProperty('--water-level', `${waterLevel}%`);
  $('#stage4BufferWater').style.setProperty('--water-low', `${waterLow}%`);
  $('#stage4BufferTank').className = `stage4-buffer-tank${safe ? ' safe' : ' danger'}`;
  $('#stage4DecoderWorker').classList.toggle('overloaded', currentMode === 'decode');
  $('#stage4ViewerScreen').className = `stage4-viewer-screen mode-${currentMode}${safe ? ' safe' : ' danger'}`;
  $('#stage4StutterHint').textContent = `${mode.note}${currentMode === 'decode'
    ? ' 当前应检查解码耗时与设备能力。'
    : safe
      ? ' 当前缓冲余量能覆盖这类波动。'
      : ` 当前缓冲偏小；约 ${mode.required.toFixed(1)} 秒余量会更稳。`}`;

  $$('#stage4StutterModes button').forEach((button) => {
    const active = button.dataset.mode === currentMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  renderPackets(mode);
  renderSignalShapes(mode, buffer);
  updateStory(mode);
}

export function initStutterLab() {
  $('#stage4StutterBuffer')?.addEventListener('input', renderStutter);
  $$('#stage4StutterModes button').forEach((button) => button.addEventListener('click', () => {
    currentMode = button.dataset.mode;
    renderStutter();
  }));
  renderStutter();
}
