import { initBlueprint } from './blueprint.js?v=20260729-1';
import { initLadderLab } from './ladder.js?v=20260729-1';
import { initDistributionRouting } from './distribution.js?v=20260729-1';
import { initCapacityLab } from './capacity.js?v=20260729-1';
import { initResilienceLab } from './resilience.js?v=20260729-1';
import { initCapstone } from './capstone.js?v=20260729-1';
import { initStage5Quiz } from './quiz.js?v=20260730-3';
import { initRealChainBuilder } from './real-chain.js?v=20260730-1';

export function initStage5() {
  initBlueprint();
  initLadderLab();
  initDistributionRouting();
  initCapacityLab();
  initResilienceLab();
  initRealChainBuilder();
  initCapstone();
  initStage5Quiz();
}
