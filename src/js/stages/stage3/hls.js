import { $, $$ } from '../../core/dom.js';
import { HLS_MANIFEST_LINES } from '../../data/stage3.js?v=20260729-3';

let manifestIndex = 0;

function displayManifestCode(code, duration) {
  if (code.startsWith('#EXT-X-TARGETDURATION')) return `#EXT-X-TARGETDURATION:${Math.ceil(duration)}`;
  if (code.startsWith('#EXTINF')) return `#EXTINF:${duration.toFixed(3)},`;
  return code;
}

function renderManifest() {
  const duration = Number($('#stage3SegmentDuration').value);
  $('#stage3ManifestLines').innerHTML = HLS_MANIFEST_LINES.map((line, index) => `
    <button type="button" data-index="${index}" aria-pressed="${index === manifestIndex}"><small>${String(index + 1).padStart(2, '0')}</small><code>${displayManifestCode(line.code, duration)}</code></button>
  `).join('');
  const current = HLS_MANIFEST_LINES[manifestIndex];
  $('#stage3ManifestDetail').innerHTML = `<span>${current.label}</span><h5>${displayManifestCode(current.code, duration)}</h5><p>${current.detail}</p>`;
  $$('#stage3ManifestLines button').forEach((button) => {
    button.addEventListener('click', () => {
      manifestIndex = Number(button.dataset.index);
      renderManifest();
    });
  });
}

function renderHlsLab() {
  const duration = Number($('#stage3SegmentDuration').value);
  const startup = Number($('#stage3StartupSegments').value);
  const estimatedDelay = duration * (startup + 0.8);
  const requestsPerMinute = Math.round(60 / duration);
  $('#stage3SegmentDurationOut').textContent = `${duration.toFixed(1)} 秒`;
  $('#stage3StartupSegmentsOut').textContent = `${startup} 片`;
  $('#stage3HlsDelay').textContent = `约 ${estimatedDelay.toFixed(1)} 秒`;
  $('#stage3HlsRequests').textContent = `约 ${requestsPerMinute} 次/分钟`;
  $('#stage3HlsTimeline').innerHTML = Array.from({ length: 9 }, (_, index) => {
    const distanceFromLive = 8 - index;
    const buffered = distanceFromLive > 0 && distanceFromLive <= startup;
    const playing = distanceFromLive === startup;
    return `<div class="stage3-segment${buffered ? ' buffered' : ''}${playing ? ' playing' : ''}${index === 8 ? ' live' : ''}"><small>${120 + index}</small><b>${duration.toFixed(1)}s</b></div>`;
  }).join('');
  const hint = duration <= 2
    ? '短切片能更快出现新内容，但清单刷新和 HTTP 请求更频繁，服务端与 CDN 压力会上升。'
    : '切片较长，请求次数更少、传输更稳，但播放器往往要等更久才拿到完整的新片。';
  $('#stage3HlsHint').textContent = `${hint} 这是教学估算，真实延迟还会叠加编码、发布、CDN 和播放器策略。`;
  renderManifest();
}

export function initHlsLab() {
  ['stage3SegmentDuration', 'stage3StartupSegments'].forEach((id) => {
    $(`#${id}`)?.addEventListener('input', renderHlsLab);
  });
  renderHlsLab();
}
