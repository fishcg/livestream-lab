import { $, $$ } from '../../core/dom.js';

const BITRATE_MBPS = 4;
const CDN_HIT_RATE = 0.98;

const MODES = {
  direct: {
    label: '源站直发', badge: '高负载',
    hint: '每位观众都直接连接源站。人数增长时，源站出口带宽和连接数会近似一起增长，故障也容易集中在一个出口。'
  },
  cdn: {
    label: 'CDN 分发', badge: '低负载',
    hint: '观众就近连接边缘节点。以可缓存 HLS 和 98% 边缘命中率估算，大部分下行由 CDN 承担，只有未命中或首次填充需要回源。'
  },
  p2p: {
    label: 'CDN + P2P', badge: '低负载',
    hint: 'CDN 负责首批数据、稳定供给和兜底；调度器再让部分观众交换已经拿到的切片。P2P 分担越高，对终端上传和调度质量的要求也越高。'
  }
};

let currentMode = 'cdn';

function formatTraffic(gbps) {
  if (gbps === 0) return '0 Gbps';
  if (gbps < 1) return `${Math.round(gbps * 1000)} Mbps`;
  return `${gbps >= 100 ? Math.round(gbps) : gbps.toFixed(1)} Gbps`;
}

function calculateTraffic(viewers, p2pShare) {
  const total = viewers * BITRATE_MBPS / 1000;
  if (currentMode === 'direct') return { total, origin: total, cdn: 0, peer: 0 };

  const peer = currentMode === 'p2p' ? total * p2pShare : 0;
  const centralized = total - peer;
  const origin = centralized * (1 - CDN_HIT_RATE);
  return { total, origin, cdn: centralized - origin, peer };
}

function renderRealtimeCdnCost(viewers) {
  $('#stage3RtcViewerCost').textContent = `${viewers.toLocaleString('zh-CN')} 位观众`;
  $('#stage3RtcEgressCost').textContent = formatTraffic(viewers * BITRATE_MBPS / 1000);
  $('#stage3RtcSessionCost').textContent = `${viewers.toLocaleString('zh-CN')} 条`;
}

function renderDistribution() {
  const viewers = Number($('#stage3ViewerCount').value);
  const p2pShare = Number($('#stage3P2pShare').value) / 100;
  const traffic = calculateTraffic(viewers, p2pShare);
  const mode = MODES[currentMode];
  const p2pEnabled = currentMode === 'p2p';

  $('#stage3DistributionMap').className = `stage3-distribution-map mode-${currentMode}`;
  $('#stage3OriginLoadBadge').textContent = mode.badge;
  $('#stage3ViewerCountOut').textContent = `${viewers.toLocaleString('zh-CN')} 人`;
  $('#stage3P2pShareOut').textContent = `${Math.round(p2pShare * 100)}%`;
  $('#stage3P2pShare').disabled = !p2pEnabled;
  $('#stage3P2pShareControl').classList.toggle('disabled', !p2pEnabled);
  $('#stage3TotalTraffic').textContent = formatTraffic(traffic.total);
  $('#stage3OriginTraffic').textContent = formatTraffic(traffic.origin);
  $('#stage3CdnTraffic').textContent = formatTraffic(traffic.cdn);
  $('#stage3PeerTraffic').textContent = formatTraffic(traffic.peer);
  $('#stage3DistributionHint').textContent = `${mode.label}：${mode.hint} 本实验忽略协议开销、地域和峰值，只用于理解流量由谁承担。`;
  renderRealtimeCdnCost(viewers);

  $$('#stage3DistributionModes button').forEach((button) => {
    const active = button.dataset.mode === currentMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

export function initDistributionLab() {
  $('#stage3ViewerCount')?.addEventListener('input', renderDistribution);
  $('#stage3P2pShare')?.addEventListener('input', renderDistribution);
  $$('#stage3DistributionModes button').forEach((button) => button.addEventListener('click', () => {
    currentMode = button.dataset.mode;
    renderDistribution();
  }));
  renderDistribution();
}
