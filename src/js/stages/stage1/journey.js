import { $, $$ } from '../../core/dom.js';
import { iconMarkup } from '../../core/icons.js';
import { PIPELINE_LESSONS } from '../../data/stage1.js';

export function initJourneyTutor() {
  let currentIndex = 0;

  function renderMap() {
    $('#journeyMap').innerHTML = PIPELINE_LESSONS.map((lesson, index) => `
      <button class="journey-stop ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'passed' : ''}" data-index="${index}">
        <span class="journey-stop-icon">${iconMarkup(lesson.icon)}</span><span>${lesson.step}</span>
      </button>${index < PIPELINE_LESSONS.length - 1 ? '<b>→</b>' : ''}`
    ).join('') + '<em class="journey-signal"></em>';
    $$('.journey-stop').forEach((button) => {
      button.addEventListener('click', () => {
        currentIndex = Number(button.dataset.index);
        render();
      });
    });
  }

  function render() {
    const lesson = PIPELINE_LESSONS[currentIndex];
    $('#journeyCounter').textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(PIPELINE_LESSONS.length).padStart(2, '0')}`;
    $('#journeyCopy').innerHTML = `
      <span class="journey-kicker">${iconMarkup(lesson.icon)}${lesson.en}</span>
      <h4>${lesson.step}<small>${lesson.role}</small></h4>
      <p>${lesson.explanation}</p>
      <div class="journey-analogy"><b>把它想成</b><p>${lesson.analogy}</p></div>`;
    $('#journeyNote').innerHTML = `
      <span>这一站的产物</span><b>${lesson.output}</b>
      <span>排障时记住</span><p>${lesson.checkpoint}</p>`;
    $('#journeyPrev').disabled = currentIndex === 0;
    $('#journeyNext').textContent = currentIndex === PIPELINE_LESSONS.length - 1 ? '重新讲一遍' : '下一站';
    $('#journeyDots').innerHTML = PIPELINE_LESSONS.map((_, index) => `<i class="${index === currentIndex ? 'active' : ''}"></i>`).join('');
    renderMap();
  }

  $('#journeyPrev').addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    render();
  });
  $('#journeyNext').addEventListener('click', () => {
    currentIndex = currentIndex === PIPELINE_LESSONS.length - 1 ? 0 : currentIndex + 1;
    render();
  });
  render();
}
