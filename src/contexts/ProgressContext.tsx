import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useVocabulary } from './VocabularyContext';
import { useQuiz } from './QuizContext';
import { UserProgress } from '../types/vocabulary';

interface ProgressContextType {
  userProgress: UserProgress;
  loading: boolean;
  refreshProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalWords: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    accuracy: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { words } = useVocabulary();
  const { quizHistory } = useQuiz();

  useEffect(() => {
    calculateProgress();
  }, [user, words, quizHistory]);

  const calculateProgress = () => {
    if (!user) {
      setUserProgress({
        totalWords: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        accuracy: 0,
        streak: 0,
      });
      setLoading(false);
      return;
    }

    const totalWords = words.length;
    const correctAnswers = quizHistory.filter(result => result.correct).length;
    const totalAnswers = quizHistory.length;
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    // Calculate streak (consecutive days with activity)
    const streak = calculateStreak();

    setUserProgress({
      totalWords,
      correctAnswers,
      totalAnswers,
      accuracy,
      streak,
    });

    setLoading(false);
  };

  const calculateStreak = (): number => {
    if (quizHistory.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get unique dates from quiz history
    const uniqueDates = Array.from(new Set(
      quizHistory.map(result => {
        const date = new Date(result.timestamp);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    )).sort((a, b) => b - a); // Sort descending

    let streak = 0;
    let currentDate = today.getTime();

    // Check if there's activity today or yesterday
    const hasTodayActivity = uniqueDates.includes(today.getTime());
    const hasYesterdayActivity = uniqueDates.includes(yesterday.getTime());

    if (!hasTodayActivity && !hasYesterdayActivity) {
      return 0;
    }

    if (!hasTodayActivity && hasYesterdayActivity) {
      currentDate = yesterday.getTime();
    }

    // Count consecutive days
    for (const date of uniqueDates) {
      if (date === currentDate) {
        streak++;
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() - 1);
        currentDate = nextDay.getTime();
      } else if (date < currentDate) {
        break;
      }
    }

    return streak;
  };

  const refreshProgress = () => {
    setLoading(true);
    calculateProgress();
  };

  const value = {
    userProgress,
    loading,
    refreshProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
