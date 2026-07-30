import { initFfmpegCommandLab } from './command.js?v=20260729-8';
import { initStage2Diagnostics } from './diagnostics.js?v=20260729-8';
import { initPublishLesson } from './publish.js?v=20260730-9';
import { initStage2Quiz } from './quiz.js?v=20260729-8';
import { initSrsLesson } from './srs.js?v=20260729-8';
import { initStage2Tour } from './tour.js?v=20260729-8';
import { initRtmpUrlLab } from './url.js?v=20260729-8';

export function initStage2() {
  initStage2Tour();
  initRtmpUrlLab();
  initFfmpegCommandLab();
  initPublishLesson();
  initSrsLesson();
  initStage2Diagnostics();
  initStage2Quiz();
}
