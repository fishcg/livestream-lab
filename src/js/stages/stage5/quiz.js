import { initQuiz } from '../../core/quiz.js?v=20260730-1';
import { STAGE5_QUIZ } from '../../data/stage5.js?v=20260730-2';

export function initStage5Quiz() {
  initQuiz({
    stage: 5, questions: STAGE5_QUIZ, containerSelector: '#stage5QuizQuestions', formSelector: '#stage5Quiz',
    feedbackSelector: '#stage5QuizFeedback', namePrefix: 'stage5q',
    successMessage: '第五阶段完成，直播架构总装通过。', retryMessage: '标红题还有架构缺口，回到对应实验再验证一次。'
  });
}
