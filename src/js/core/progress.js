import { $, $$ } from './dom.js';
import { getState, resetState, subscribe, updateState } from './store.js';
import { showToast } from './toast.js';

function renderProgress(state) {
  const completed = state.completedStages;
  $('#topProgressText').textContent = `${completed.length} / 5`;
  $('#topProgressBar').style.width = `${completed.length * 20}%`;
  $$('.nav-item').forEach((item) => {
    item.classList.toggle('completed', completed.includes(Number(item.dataset.stage)));
  });
}

export function completeStage(stage) {
  const completed = getState().completedStages;
  if (completed.includes(stage)) return;
  updateState((state) => ({
    ...state,
    completedStages: [...state.completedStages, stage].sort((a, b) => a - b)
  }));
  showToast(`阶段 ${String(stage).padStart(2, '0')} 已点亮 · SIGNAL LOCKED`);
}

export function initProgress() {
  subscribe(renderProgress);
  $('#resetProgress')?.addEventListener('click', () => {
    if (!window.confirm('确定重置全部学习进度吗？实验内容仍然保留。')) return;
    resetState();
    showToast('学习进度已重置');
  });
}
