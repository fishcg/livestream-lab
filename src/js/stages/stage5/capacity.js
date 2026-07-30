import { $ } from '../../core/dom.js';

function formatGbps(value) {
  return value < 1 ? `${Math.round(value * 1000)} Mbps` : `${value >= 100 ? Math.round(value) : value.toFixed(1)} Gbps`;
}

function renderCapacity() {
  const viewers = Number($('#stage5CapacityViewers').value);
  const bitrate = Number($('#stage5CapacityBitrate').value);
  const peak = Number($('#stage5CapacityPeak').value);
  const hitRate = Number($('#stage5CapacityHit').value);
  const egress = viewers * bitrate * peak / 1000;
  const hourlyTb = egress * 0.45;
  const origin = egress * (1 - hitRate / 100);

  $('#stage5CapacityViewersOut').textContent = `${viewers.toLocaleString('zh-CN')} 人`;
  $('#stage5CapacityBitrateOut').textContent = `${bitrate.toFixed(1)} Mbps`;
  $('#stage5CapacityPeakOut').textContent = `${peak.toFixed(1)}×`;
  $('#stage5CapacityHitOut').textContent = `${hitRate}%`;
  $('#stage5PeakEgress').textContent = formatGbps(egress);
  $('#stage5HourlyData').textContent = `${hourlyTb.toFixed(1)} TB`;
  $('#stage5OriginEgress').textContent = formatGbps(origin);
  $('#stage5CapacityBars').innerHTML = [
    { label: '观众峰值下行', value: egress, color: '#45d5e8' },
    { label: 'CDN 边缘承担', value: egress - origin, color: '#e272ff' },
    { label: '回源承担', value: origin, color: '#ff6a2a' }
  ].map((item) => `<div><span>${item.label}</span><i style="--width:${Math.max(1.5, item.value / egress * 100)}%;--color:${item.color}"></i><b>${formatGbps(item.value)}</b></div>`).join('');
  $('#stage5CapacityHint').textContent = hitRate < 96
    ? `命中率只有 ${hitRate}%，回源已经明显放大。先检查缓存规则、切片复用和区域热点，再决定是否单纯扩源站。`
    : `在 ${hitRate}% 命中率下，CDN 承担绝大多数观众下行；源站仍要按回源峰值和故障回切预留余量。`;
}

export function initCapacityLab() {
  ['#stage5CapacityViewers', '#stage5CapacityBitrate', '#stage5CapacityPeak', '#stage5CapacityHit'].forEach((selector) => $(selector)?.addEventListener('input', renderCapacity));
  renderCapacity();
}
