import { $ } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { PLAYBACK_PROTOCOLS } from '../../data/stage3.js?v=20260729-3';

function renderProtocols() {
  $('#stage3ProtocolCards').innerHTML = PLAYBACK_PROTOCOLS.map((item) => `
    <article class="stage3-protocol-card ${item.id}">
      <header><span>${iconMarkup(item.icon)}</span><div><small>${item.en}</small><h4>${item.name}</h4></div></header>
      <blockquote>${item.memory}</blockquote>
      <dl>
        <div><dt>怎么送</dt><dd>${item.transport}</dd></div>
        <div><dt>延迟直觉</dt><dd>${item.typicalLatency}</dd></div>
        <div><dt>擅长</dt><dd>${item.strength}</dd></div>
        <div><dt>代价</dt><dd>${item.tradeoff}</dd></div>
      </dl>
      <p><b>适合：</b>${item.fit}</p>
    </article>
  `).join('');
}

export function initPlaybackOverview() {
  renderProtocols();
}
