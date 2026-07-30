import { initStage4Tour } from './tour.js?v=20260729-1';
import { initLatencyLab } from './latency.js?v=20260729-1';
import { initStutterLab } from './stutter.js?v=20260729-2';
import { initMetricReader } from './metrics.js?v=20260729-1';
import { initSyncLab } from './sync.js?v=20260729-1';
import { initStage4Incidents } from './incidents.js?v=20260729-1';
import { initStage4Quiz } from './quiz.js?v=20260730-2';

export function initStage4() {
  initStage4Tour();
  initLatencyLab();
  initStutterLab();
  initMetricReader();
  initSyncLab();
  initStage4Incidents();
  initStage4Quiz();
}
