import { $, $$, setFeedback } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { GLOSSARY_TERMS } from '../../data/stage1.js';

const CATEGORY_NAMES = {
  media: '画面与声音',
  structure: '压缩与组织',
  network: '传输与体验'
};

function repeatMarkup(count, tag = 'i') {
  return Array.from({ length: count }, (_, index) => `<${tag} style="--i:${index}"></${tag}>`).join('');
}

function visualMarkup(type) {
  const samplePoints = Array.from({ length: 13 }, (_, index) => {
    const y = 42 - Math.sin(index / 12 * Math.PI * 4) * 28;
    return `<i style="--i:${index};--y:${y}px"></i>`;
  }).join('');
  const visuals = {
    pixel: `<div class="visual-pixels">${repeatMarkup(48)}</div><span class="visual-caption">一个格子 = 一个颜色样本</span>`,
    resolution: '<div class="visual-resolution"><div class="res-low"><i></i><span>低分辨率</span></div><div class="res-high"><i></i><span>高分辨率</span></div></div>',
    fps: `<div class="visual-fps">${repeatMarkup(8)}<span>一组静止画面 → 连续运动</span></div>`,
    bitrate: `<div class="visual-bitrate"><span>DATA</span><div class="bit-pipe">${repeatMarkup(7)}</div><b>4.2 Mbps</b></div>`,
    sample: `<div class="visual-sample"><div class="sample-wave"></div>${samplePoints}<span>每个点都是一次测量</span></div>`,
    codec: `<div class="visual-codec"><div class="raw-blocks">${repeatMarkup(16)}</div><b>压缩</b><div class="packed-blocks">${repeatMarkup(5)}</div></div>`,
    container: '<div class="visual-container"><div class="media-track video">V</div><div class="media-track audio">A</div><div class="media-track time">T</div><div class="media-box"><span>FLV</span></div></div>',
    protocol: '<div class="visual-protocol"><span>主播</span><i class="route-dot"></i><b>RTMP</b><span>服务器</span></div>',
    timestamp: '<div class="visual-timestamp"><div><span>VIDEO</span><i></i><b>PTS 3.20</b></div><div><span>AUDIO</span><i></i><b>PTS 3.20</b></div><em></em></div>',
    gop: '<div class="visual-gop"><b>I</b><span>P</span><span>P</span><span>B</span><span>P</span><b>I</b></div>',
    latency: '<div class="visual-latency"><span>主播<br><b>NOW</b></span><div><i></i></div><span>观众<br><b>+ 2.1s</b></span></div>',
    jitter: `<div class="visual-jitter"><div class="jitter-packets">${repeatMarkup(6)}</div><div class="jitter-buffer"><span></span><span></span><span></span><span></span></div><b>BUFFER</b></div>`
  };
  return visuals[type] || '';
}

function detailMarkup(term) {
  const memoryImage = term.image
    ? `<figure class="memory-image">
        <picture>
          <source srcset="${term.image}" type="image/webp">
          <img src="${term.fallbackImage}" alt="${term.imageAlt}" loading="lazy" decoding="async">
        </picture>
        <figcaption><span>MEMORY ANCHOR</span>${term.imageCaption}</figcaption>
      </figure>`
    : '';
  const motionPreview = term.visual
    ? `<div class="motion-preview" tabindex="0" title="悬停放大动态图解" aria-label="${term.term}动态图解，鼠标悬停或键盘聚焦可放大">
        <span class="motion-preview-label">动态图解</span>
        <span class="motion-preview-hint" aria-hidden="true">悬停放大</span>
        <div class="motion-preview-canvas"><div class="motion-preview-stage">${visualMarkup(term.visual)}</div></div>
      </div>`
    : '';
  return `
    <div class="glossary-visual glossary-visual--${term.id} ${term.image ? 'with-image' : ''}">${memoryImage}</div>
    <div class="glossary-copy">
      <div class="term-overview">
        <div class="term-intro">
          <span class="term-category">${iconMarkup(term.icon)}${CATEGORY_NAMES[term.category]}</span>
          <div class="term-title"><h4>${term.term}</h4><small>${term.en}</small></div>
          <p class="term-summary">${term.summary}</p>
        </div>
        ${motionPreview}
      </div>
      <div class="term-explain"><span>把它想成</span><p>${term.analogy}</p></div>
      <div class="term-facts">
        <div><span>为什么重要</span><p>${term.why}</p></div>
        <div><span>别踩这个坑</span><p>${term.misconception}</p></div>
      </div>
    </div>`;
}

export function initTerminologyLab() {
  let activeCategory = 'all';
  let activeTermId = GLOSSARY_TERMS[0].id;
  const visited = new Set();

  function renderGrid() {
    const terms = activeCategory === 'all'
      ? GLOSSARY_TERMS
      : GLOSSARY_TERMS.filter((term) => term.category === activeCategory);
    $('#glossaryGrid').innerHTML = terms.map((term) => `
      <button class="glossary-card ${term.id === activeTermId ? 'active' : ''} ${visited.has(term.id) ? 'visited' : ''}" data-term-id="${term.id}">
        <span class="glossary-card-icon">${iconMarkup(term.icon)}</span>
        <span class="glossary-card-en">${term.en}</span><b>${term.term}</b><i></i>
      </button>`).join('');
    $$('.glossary-card').forEach((card) => {
      card.addEventListener('click', () => selectTerm(card.dataset.termId));
    });
  }

  function selectTerm(termId) {
    const term = GLOSSARY_TERMS.find((item) => item.id === termId);
    if (!term) return;
    activeTermId = term.id;
    visited.add(term.id);
    $('#glossaryProgress').textContent = `已读 ${visited.size} / ${GLOSSARY_TERMS.length}`;
    $('#glossaryDetail').innerHTML = detailMarkup(term);
    renderGrid();
  }

  $$('#glossaryFilters button').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      $$('#glossaryFilters button').forEach((item) => item.classList.toggle('active', item === button));
      const visibleTerms = activeCategory === 'all'
        ? GLOSSARY_TERMS
        : GLOSSARY_TERMS.filter((term) => term.category === activeCategory);
      if (!visibleTerms.some((term) => term.id === activeTermId)) activeTermId = visibleTerms[0].id;
      renderGrid();
      selectTerm(activeTermId);
    });
  });

  renderGrid();
  selectTerm(activeTermId);
}
