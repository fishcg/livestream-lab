import { TERMS, TERM_SETS } from '../data/term-dictionary.js?v=20260730-1';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderScene(scene, termName) {
  return `
    <div class="term-scene" role="img" aria-label="${escapeHtml(`${scene[0]}，经过 ${scene[1]}，到达 ${scene[2]}`)}">
      <div><small>进入</small><b>${escapeHtml(scene[0])}</b></div>
      <i aria-hidden="true"><span></span></i>
      <div class="active"><small>${escapeHtml(termName)}</small><b>${escapeHtml(scene[1])}</b></div>
      <i aria-hidden="true"><span></span></i>
      <div><small>交出</small><b>${escapeHtml(scene[2])}</b></div>
    </div>
  `;
}

function renderDetail(root, set, selectedIndex) {
  const key = set.terms[selectedIndex];
  const term = TERMS[key];
  const detail = root.querySelector('.term-explainer-detail');
  const buttons = root.querySelectorAll('.term-explainer-tab');

  buttons.forEach((button, index) => {
    const selected = index === selectedIndex;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
  });

  detail.innerHTML = `
    <div class="term-explainer-visual">
      <span>把名词放回链路</span>
      ${renderScene(term.scene, term.name)}
    </div>
    <div class="term-explainer-copy">
      <header><small>${escapeHtml(term.en)}</small><h5>${escapeHtml(term.name)}</h5><p>${escapeHtml(term.definition)}</p></header>
      <dl>
        <div><dt>把它想成</dt><dd>${escapeHtml(term.analogy)}</dd></div>
        <div><dt>在这条链路里</dt><dd>${escapeHtml(term.role)}</dd></div>
        <div><dt>别和它混淆</dt><dd>${escapeHtml(term.confusion)}</dd></div>
      </dl>
    </div>
  `;
}

function mountTermExplainer(root, index) {
  const set = TERM_SETS[root.dataset.termSet];
  if (!set) {
    root.hidden = true;
    return;
  }

  const detailId = `termExplainerDetail${index}`;
  root.innerHTML = `
    <div class="term-explainer-head">
      <div><span>知识讲解 · 名词拆解</span><h4>${escapeHtml(set.title)}</h4></div>
      <p>${escapeHtml(set.intro)}</p>
    </div>
    <div class="term-explainer-tabs" role="tablist" aria-label="${escapeHtml(set.title)}">
      ${set.terms.map((key, termIndex) => {
        const term = TERMS[key];
        return `<button type="button" class="term-explainer-tab${termIndex === 0 ? ' active' : ''}" role="tab" aria-selected="${termIndex === 0}" aria-controls="${detailId}" data-term-index="${termIndex}"><small>${String(termIndex + 1).padStart(2, '0')}</small><b>${escapeHtml(term.name)}</b></button>`;
      }).join('')}
    </div>
    <div class="term-explainer-detail" id="${detailId}" role="tabpanel" aria-live="polite"></div>
  `;

  root.addEventListener('click', (event) => {
    const button = event.target.closest('.term-explainer-tab');
    if (!button || !root.contains(button)) return;
    renderDetail(root, set, Number(button.dataset.termIndex));
  });
  renderDetail(root, set, 0);
}

export function initTermExplainers() {
  document.querySelectorAll('[data-term-set]').forEach(mountTermExplainer);
}
