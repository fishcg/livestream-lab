import { initNavigation } from './core/navigation.js?v=20260729-1';
import { mountIcons } from './core/icons.js';
import { initProgress } from './core/progress.js';
import { initTermExplainers } from './core/term-explainer.js?v=20260730-1';
import { initStage1 } from './stages/stage1/index.js?v=20260729-3';
import { initStage2 } from './stages/stage2/index.js?v=20260729-8';
import { initStage3 } from './stages/stage3/index.js?v=20260730-6';
import { initStage4 } from './stages/stage4/index.js?v=20260729-2';
import { initStage5 } from './stages/stage5/index.js?v=20260730-3';

function bootstrap() {
  mountIcons();
  initProgress();
  initNavigation();
  initTermExplainers();
  initStage1();
  initStage2();
  initStage3();
  initStage4();
  initStage5();
}

bootstrap();
