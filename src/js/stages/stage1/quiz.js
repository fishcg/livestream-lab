import { initQuiz } from '../../core/quiz.js?v=20260730-1';
import { STAGE1_QUIZ } from '../../data/stage1.js?v=20260730-4';

export function initStage1Quiz() {
  initQuiz({
    stage: 1, questions: STAGE1_QUIZ, containerSelector: '#stage1QuizQuestions', formSelector: '#stage1Quiz',
    feedbackSelector: '#quizFeedback', namePrefix: 'stage1q',
    successMessage: '信号确认。第一阶段完成。', retryMessage: '还有信号噪声，回看标红题再试一次。'
  });
}
