export interface Word {
  id: string;
  original: string;
  translation: string;
  language: string;
  example: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
  correctCount: number;
}

export interface QuizResult {
  wordId: string;
  correct: boolean;
  timestamp: Date;
}

export interface UserProgress {
  totalWords: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  streak: number;
  lastStudyDate?: Date;
}
