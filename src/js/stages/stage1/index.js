import { $ } from '../../core/dom.js';
import { initBitrateLab } from './bitrate.js';
import { initClassificationLab } from './classification.js';
import { initGopLab } from './gop.js';
import { initJourneyTutor } from './journey.js';
import { initPipelineLab } from './pipeline.js';
import { initStage1Quiz } from './quiz.js?v=20260729-3';
import { initTerminologyLab } from './terminology.js?v=20260729-3';

function initWaveform() {
  const waveform = $('#waveform');
  if (!waveform) return;
  for (let index = 0; index < 40; index += 1) {
    const bar = document.createElement('i');
    bar.style.animationDelay = `${(index % 7) * -0.09}s`;
    bar.style.height = `${6 + (index * 13 % 21)}px`;
    waveform.appendChild(bar);
  }
}

export function initStage1() {
  initWaveform();
  initPipelineLab();
  initJourneyTutor();
  initTerminologyLab();
  initClassificationLab();
  initBitrateLab();
  initGopLab();
  initStage1Quiz();
}
