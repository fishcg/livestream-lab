import { initQuiz } from '../../core/quiz.js?v=20260730-1';
import { STAGE2_QUIZ } from '../../data/stage2.js?v=20260730-9';

export function initStage2Quiz() {
  initQuiz({
    stage: 2, questions: STAGE2_QUIZ, containerSelector: '#stage2QuizQuestions', formSelector: '#stage2Quiz',
    feedbackSelector: '#stage2QuizFeedback', namePrefix: 'stage2q',
    successMessage: '推流建立成功。第二阶段完成。', retryMessage: '标红题仍有链路断点，回看对应教学后再提交。'
  });
}
