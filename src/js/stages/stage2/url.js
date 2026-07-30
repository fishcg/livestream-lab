import { $, setFeedback } from '../../core/dom.js';
import { RTMP_PARTS } from '../../data/stage2.js?v=20260729-8';

function renderAddressParts() {
  $('#stage2AddressParts').innerHTML = RTMP_PARTS.map((part) => `
    <div><i></i><small>${part.label}</small><b>${part.meaning}</b></div>
  `).join('');
}

function cleanHost(value) {
  return value.trim().replace(/^rtmps?:\/\//i, '').replace(/\/+$/, '') || 'localhost:1935';
}

function cleanPath(value, fallback) {
  const cleaned = value.trim().replace(/^\/+|\/+$/g, '');
  return encodeURIComponent(cleaned || fallback);
}

function buildUrl() {
  const host = cleanHost($('#stage2RtmpHost').value);
  const app = cleanPath($('#stage2RtmpApp').value, 'live');
  const stream = cleanPath($('#stage2RtmpStream').value, 'demo');
  const token = $('#stage2RtmpToken').value.trim();
  const query = token ? `?token=${encodeURIComponent(token)}` : '';
  return `rtmp://${host}/${app}/${stream}${query}`;
}

function buildPlaybackExamples() {
  const host = cleanHost($('#stage2RtmpHost').value).replace(/:\d+$/, '');
  const app = cleanPath($('#stage2RtmpApp').value, 'live');
  const stream = cleanPath($('#stage2RtmpStream').value, 'demo');
  return {
    flv: `http://${host}:8080/${app}/${stream}.flv`,
    hls: `http://${host}:8080/${app}/${stream}.m3u8`
  };
}

function render() {
  const url = buildUrl();
  $('#stage2RtmpOutput').textContent = url;
  $('#stage2RtmpPreview').textContent = url.replace(/([?&]token=)[^&]+/, '$1••••••');
  const playback = buildPlaybackExamples();
  $('#stage2FlvExample').textContent = playback.flv;
  $('#stage2HlsExample').textContent = playback.hls;
}

export function initRtmpUrlLab() {
  renderAddressParts();
  const fields = ['stage2RtmpHost', 'stage2RtmpApp', 'stage2RtmpStream', 'stage2RtmpToken'];
  fields.forEach((id) => $(`#${id}`)?.addEventListener('input', render));
  $('#stage2RtmpCheck')?.addEventListener('click', () => {
    const host = cleanHost($('#stage2RtmpHost').value);
    const hasPort = /:\d+$/.test(host);
    const hasStream = $('#stage2RtmpStream').value.trim().length > 0;
    if (!hasStream) {
      setFeedback($('#stage2RtmpFeedback'), 'error', '流名不能为空：服务器接住了连接，也不知道你要发布哪一路。');
      return;
    }
    setFeedback(
      $('#stage2RtmpFeedback'),
      'success',
      hasPort ? '地址结构完整：协议、主机端口、应用名、流名与可选凭证都已就位。' : '地址可用；未显式写端口时，RTMP 客户端通常尝试默认端口 1935。'
    );
  });
  render();
}
