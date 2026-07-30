import { $, $$ } from '../../core/dom.js';

let currentFault = 'normal';

function sharesForState(p2pBase, cdnARatio) {
  const centralized = 100 - p2pBase;
  const cdnABase = centralized * cdnARatio;
  const cdnBBase = centralized - cdnABase;
  if (currentFault === 'cdnA') return { cdnA: 0, cdnB: cdnBBase + cdnABase, p2p: p2pBase };
  if (currentFault === 'p2p') return { cdnA: cdnABase + p2pBase * cdnARatio, cdnB: cdnBBase + p2pBase * (1 - cdnARatio), p2p: 0 };
  return { cdnA: cdnABase, cdnB: cdnBBase, p2p: p2pBase };
}

function renderRouting() {
  const p2pBase = Number($('#stage5RoutingP2p').value);
  const cdnARatio = Number($('#stage5RoutingCdnA').value) / 100;
  const shares = sharesForState(p2pBase, cdnARatio);
  const aEnd = shares.cdnA;
  const bEnd = aEnd + shares.cdnB;

  $('#stage5RoutingP2pOut').textContent = `${p2pBase}%`;
  $('#stage5RoutingCdnAOut').textContent = `${Math.round(cdnARatio * 100)}%`;
  $('#stage5CdnAShare').textContent = `${Math.round(shares.cdnA)}%`;
  $('#stage5CdnBShare').textContent = `${Math.round(shares.cdnB)}%`;
  $('#stage5P2pShare').textContent = `${Math.round(shares.p2p)}%`;
  $('#stage5RoutingPie').style.background = `conic-gradient(#45d5e8 0 ${aEnd}%, #ff6a2a ${aEnd}% ${bEnd}%, #a6ef67 ${bEnd}% 100%)`;
  $('#stage5RoutingMap').className = `stage5-routing-map fault-${currentFault}`;
  $('#stage5RoutingHint').textContent = currentFault === 'cdnA'
    ? `CDN A 故障，它原本的 ${Math.round((100 - p2pBase) * cdnARatio)}% 流量全部切到 CDN B。切换成功的前提是 CDN B 还有容量余量。`
    : currentFault === 'p2p'
      ? `P2P 不可用，原本的 ${p2pBase}% 流量按中心调度比例回退到两个 CDN。播放可继续，但 CDN 成本会上升。`
      : '正常状态下同时保留 CDN A、CDN B 和 P2P。分配比例不是越平均越好，要结合质量、容量、地域和成本。';

  $$('#stage5RoutingFaults button').forEach((button) => {
    const active = button.dataset.fault === currentFault;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

export function initDistributionRouting() {
  $('#stage5RoutingP2p')?.addEventListener('input', renderRouting);
  $('#stage5RoutingCdnA')?.addEventListener('input', renderRouting);
  $$('#stage5RoutingFaults button').forEach((button) => button.addEventListener('click', () => {
    currentFault = button.dataset.fault;
    renderRouting();
  }));
  renderRouting();
}
