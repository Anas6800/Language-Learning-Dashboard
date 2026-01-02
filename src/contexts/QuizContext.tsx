import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { Word, QuizResult } from '../types/vocabulary';
import { useAuth } from './AuthContext';
import { useVocabulary } from './VocabularyContext';

interface QuizContextType {
  startQuiz: (language?: string, difficulty?: string, count?: number) => Promise<void>;
  submitAnswer: (wordId: string, answer: string) => Promise<boolean>;
  nextQuestion: () => void;
  currentQuestion: Word | null;
  quizResults: QuizResult[];
  isQuizActive: boolean;
  quizScore: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  quizHistory: QuizResult[];
  loading: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Word | null>(null);
  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { words, updateWord } = useVocabulary();

  useEffect(() => {
    if (user) {
      fetchQuizHistory();
    } else {
      setQuizHistory([]);
    }
  }, [user]);

  const fetchQuizHistory = async () => {
    if (!user) return;
    
    try {
      const resultsRef = collection(db, 'users', user.uid, 'quizResults');
      const q = query(resultsRef, orderBy('timestamp', 'desc'), limit(100));
      const querySnapshot = await getDocs(q);
      
      const history: QuizResult[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          wordId: data.wordId,
          correct: data.correct,
          timestamp: data.timestamp.toDate(),
        });
      });
      
      setQuizHistory(history);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    }
  };

  const startQuiz = async (language?: string, difficulty?: string, count: number = 10) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      let availableWords = [...words];
      
      // Filter by language if specified
      if (language) {
        availableWords = availableWords.filter(word => word.language === language);
      }
      
      // Filter by difficulty if specified
      if (difficulty) {
        availableWords = availableWords.filter(word => word.difficulty === difficulty);
      }
      
      // Randomly select words for the quiz
      const shuffled = availableWords.sort(() => 0.5 - Math.random());
      const selectedWords = shuffled.slice(0, Math.min(count, availableWords.length));
      
      if (selectedWords.length === 0) {
        alert('No words available for quiz. Please add some words first!');
        setLoading(false);
        return;
      }
      
      setQuizWords(selectedWords);
      setQuizResults([]);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(selectedWords[0]);
      setIsQuizActive(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Error starting quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (wordId: string, answer: string): Promise<boolean> => {
    if (!user || !currentQuestion) return false;
    
    const isCorrect = answer.toLowerCase().trim() === 
                     currentQuestion.translation.toLowerCase().trim();
    
    const result: QuizResult = {
      wordId,
      correct: isCorrect,
      timestamp: new Date(),
    };
    
    setQuizResults([...quizResults, result]);
    
    // Update word statistics
    try {
      const word = words.find(w => w.id === wordId);
      if (word) {
        await updateWord(wordId, {
          reviewCount: word.reviewCount + 1,
          correctCount: word.correctCount + (isCorrect ? 1 : 0),
          lastReviewed: new Date(),
        });
      }
      
      // Save quiz result to Firestore
      const resultsRef = collection(db, 'users', user.uid, 'quizResults');
      await addDoc(resultsRef, {
        wordId,
        correct: isCorrect,
        timestamp: new Date(),
      });
      
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
    
    return isCorrect;
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < quizWords.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(quizWords[nextIndex]);
    } else {
      // Quiz completed
      setIsQuizActive(false);
      setCurrentQuestion(null);
    }
  };

  const quizScore = quizResults.length > 0 
    ? Math.round((quizResults.filter(r => r.correct).length / quizResults.length) * 100)
    : 0;

  const value = {
    startQuiz,
    submitAnswer,
    nextQuestion,
    currentQuestion,
    quizResults,
    isQuizActive,
    quizScore,
    currentQuestionIndex,
    totalQuestions: quizWords.length,
    quizHistory,
    loading,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};
