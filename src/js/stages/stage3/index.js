import { initFlvLab } from './flv.js?v=20260729-3';
import { initHlsLab } from './hls.js?v=20260729-3';
import { initPlaybackOverview } from './overview.js?v=20260729-3';
import { initStage3Diagnostics } from './diagnostics.js?v=20260729-3';
import { initStage3Quiz } from './quiz.js?v=20260730-5';
import { initProtocolSelector } from './selector.js?v=20260729-3';
import { initStage3Tour } from './tour.js?v=20260729-5';
import { initWebrtcLab } from './webrtc.js?v=20260730-4';
import { initDistributionLab } from './distribution.js?v=20260730-2';

export function initStage3() {
  initPlaybackOverview();
  initStage3Tour();
  initHlsLab();
  initFlvLab();
  initWebrtcLab();
  initDistributionLab();
  initProtocolSelector();
  initStage3Diagnostics();
  initStage3Quiz();
}
