import { $, $$, setFeedback, shuffle } from '../../core/dom.js';
import { MEDIA_TERMS } from '../../data/stage1.js';

export function initClassificationLab() {
  let currentTerm = null;
  const sortedTerms = new Set();

  function render() {
    const remaining = shuffle(MEDIA_TERMS.filter(([term]) => !sortedTerms.has(term)));
    $('#termPool').innerHTML = remaining.map(([term]) => `<button class="term-chip">${term}</button>`).join('');
    $$('.term-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        currentTerm = chip.textContent;
        $$('.term-chip').forEach((item) => item.classList.toggle('selected', item === chip));
        setFeedback($('#sortFeedback'), '', `已选择 ${currentTerm}，现在判断它所属的分类。`);
      });
    });
  }

  $$('.bucket').forEach((bucket) => {
    bucket.addEventListener('click', () => {
      if (!currentTerm) {
        setFeedback($('#sortFeedback'), '', '先从上面选择一个技术名词。');
        return;
      }
      const expected = MEDIA_TERMS.find(([term]) => term === currentTerm)[1];
      if (bucket.dataset.bucket !== expected) {
        setFeedback($('#sortFeedback'), 'error', `再想想：${currentTerm} 是压缩数据、组织数据，还是传输数据？`);
        return;
      }

      sortedTerms.add(currentTerm);
      bucket.classList.remove('good');
      void bucket.offsetWidth;
      bucket.classList.add('good');
      currentTerm = null;
      $('#sortScore').textContent = `${sortedTerms.size} / ${MEDIA_TERMS.length}`;
      render();
      const message = sortedTerms.size === MEDIA_TERMS.length
        ? 'PASS · 全部分对：编码压小、封装装好、协议送到。'
        : '分类正确，继续。';
      setFeedback($('#sortFeedback'), 'success', message);
    });
  });

  render();
}
