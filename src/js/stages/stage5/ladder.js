import { $, $$ } from '../../core/dom.js';
import { AUDIENCE_NETWORKS, LADDER_PROFILES } from '../../data/stage5.js?v=20260729-1';

const selectedProfiles = new Set(LADDER_PROFILES.filter((profile) => profile.default).map((profile) => profile.id));

function coveredAudienceIds() {
  const covered = new Set();
  LADDER_PROFILES.filter((profile) => selectedProfiles.has(profile.id)).forEach((profile) => {
    profile.audiences.forEach((audience) => covered.add(audience));
  });
  return covered;
}

function renderLadder() {
  const covered = coveredAudienceIds();
  const selected = LADDER_PROFILES.filter((profile) => selectedProfiles.has(profile.id));
  const aggregate = selected.reduce((sum, profile) => sum + profile.bitrate, 0);

  $('#stage5ProfileGrid').innerHTML = LADDER_PROFILES.map((profile) => `
    <button type="button" class="stage5-profile${selectedProfiles.has(profile.id) ? ' active' : ''}" data-id="${profile.id}" aria-pressed="${selectedProfiles.has(profile.id)}">
      <small>${profile.id === 'audio' ? 'AUDIO' : 'VIDEO'}</small><b>${profile.name}</b><span>${profile.detail}</span><i style="--level:${Math.max(8, profile.bitrate / 6 * 100)}%"></i>
    </button>
  `).join('');
  $('#stage5AudienceGrid').innerHTML = AUDIENCE_NETWORKS.map((audience) => `
    <div class="${covered.has(audience.id) ? 'covered' : 'missing'}"><small>${covered.has(audience.id) ? '已覆盖' : '没有合适档位'}</small><b>${audience.name}</b><p>${audience.detail}</p></div>
  `).join('');
  $('#stage5ProfileCount').textContent = `${selected.length} 档`;
  $('#stage5AggregateBitrate').textContent = `${aggregate.toFixed(1)} Mbps`;
  $('#stage5Coverage').textContent = `${covered.size} / ${AUDIENCE_NETWORKS.length} 类网络`;
  const missing = AUDIENCE_NETWORKS.filter((audience) => !covered.has(audience.id)).map((audience) => audience.name);
  $('#stage5LadderHint').textContent = missing.length
    ? `当前还没有覆盖：${missing.join('、')}。继续补档，但也要留意每增加一档都会增加转码与分发复杂度。`
    : '所有网络层级都有退路。接下来要用真实播放数据验证这些档位是否值得长期保留。';

  $$('.stage5-profile').forEach((button) => button.addEventListener('click', () => {
    if (selectedProfiles.has(button.dataset.id)) selectedProfiles.delete(button.dataset.id);
    else selectedProfiles.add(button.dataset.id);
    renderLadder();
  }));
}

export function initLadderLab() {
  renderLadder();
}
