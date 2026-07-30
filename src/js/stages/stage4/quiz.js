import { initQuiz } from '../../core/quiz.js?v=20260730-1';
import { STAGE4_QUIZ } from '../../data/stage4.js?v=20260730-2';

export function initStage4Quiz() {
  initQuiz({
    stage: 4, questions: STAGE4_QUIZ, containerSelector: '#stage4QuizQuestions', formSelector: '#stage4Quiz',
    feedbackSelector: '#stage4QuizFeedback', namePrefix: 'stage4q',
    successMessage: '会诊结论成立。第四阶段完成。', retryMessage: '标红题仍有诊断断点，回到对应科室复查。'
  });
}
