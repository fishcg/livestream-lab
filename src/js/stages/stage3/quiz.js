import { initQuiz } from '../../core/quiz.js?v=20260730-1';
import { STAGE3_QUIZ } from '../../data/stage3.js?v=20260730-6';

export function initStage3Quiz() {
  initQuiz({
    stage: 3, questions: STAGE3_QUIZ, containerSelector: '#stage3QuizQuestions', formSelector: '#stage3Quiz',
    feedbackSelector: '#stage3QuizFeedback', namePrefix: 'stage3q',
    successMessage: '播放链路稳定。第三阶段完成。', retryMessage: '标红题还有播放断点，回到对应协议再看一次。'
  });
}
