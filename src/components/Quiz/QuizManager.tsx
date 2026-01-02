import React, { useState } from 'react';
import { useQuiz } from '../../contexts/QuizContext';
import { useVocabulary } from '../../contexts/VocabularyContext';
import { Brain, Play, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';

interface QuizManagerProps {
  darkMode: boolean;
}

const QuizManager: React.FC<QuizManagerProps> = ({ darkMode }) => {
  const { 
    startQuiz, 
    submitAnswer, 
    nextQuestion, 
    currentQuestion, 
    quizResults, 
    isQuizActive, 
    quizScore, 
    currentQuestionIndex, 
    totalQuestions,
    quizHistory,
    loading 
  } = useQuiz();
  
  const { words } = useVocabulary();
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [quizCount, setQuizCount] = useState(10);

  const languages = Array.from(new Set(words.map(word => word.language)));

  const handleStartQuiz = () => {
    startQuiz(selectedLanguage || undefined, selectedDifficulty || undefined, quizCount);
    setAnswer('');
    setShowResult(false);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !answer.trim()) return;
    
    const correct = await submitAnswer(currentQuestion.id, answer);
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    nextQuestion();
    setAnswer('');
    setShowResult(false);
  };

  const handleRestartQuiz = () => {
    window.location.reload();
  };

  const calculateStats = () => {
    const total = quizHistory.length;
    const correct = quizHistory.filter(r => r.correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return { total, correct, accuracy };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading quiz...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Quiz System
        </h2>
      </div>

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <Brain className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-3`} />
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Questions</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <CheckCircle className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`} />
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Correct Answers</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.correct}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <Trophy className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} mr-3`} />
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Accuracy</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.accuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      {!isQuizActive ? (
        /* Quiz Setup */
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Start New Quiz
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Language (Optional)
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="">All Languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Difficulty (Optional)
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quizCount}
                  onChange={(e) => setQuizCount(parseInt(e.target.value) || 10)}
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
            </div>
            
            <button
              onClick={handleStartQuiz}
              disabled={words.length === 0}
              className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Quiz
            </button>
            
            {words.length === 0 && (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add some words to your vocabulary first to start practicing!
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Active Quiz */
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          {/* Quiz Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Score: {quizScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {currentQuestion && (
            <div className="space-y-6">
              {/* Question */}
              <div className="text-center">
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Translate this word:
                </h3>
                <div className={`text-3xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mb-4`}>
                  {currentQuestion.original}
                </div>
                {currentQuestion.example && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                    Example: {currentQuestion.example}
                  </p>
                )}
              </div>

              {/* Answer Input */}
              {!showResult ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                    placeholder="Enter your translation..."
                    className={`w-full px-4 py-3 text-lg border rounded-lg text-center ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    autoFocus
                  />
                  
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim()}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answer
                  </button>
                </div>
              ) : (
                /* Result */
                <div className="space-y-4">
                  <div className={`text-center p-4 rounded-lg ${
                    isCorrect 
                      ? 'bg-green-100 border border-green-400' 
                      : 'bg-red-100 border border-red-400'
                  }`}>
                    <div className="flex items-center justify-center mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-600" />
                      )}
                    </div>
                    <p className={`text-lg font-semibold ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect ? 'Correct!' : 'Incorrect!'}
                    </p>
                    {!isCorrect && (
                      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-700' : 'text-gray-600'}`}>
                        Correct answer: <span className="font-semibold">{currentQuestion.translation}</span>
                      </p>
                    )}
                  </div>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Next Question
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                        <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Quiz Completed!
                        </h4>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                          Final Score: {quizScore}%
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          {quizResults.filter(r => r.correct).length} out of {quizResults.length} correct
                        </p>
                      </div>
                      
                      <button
                        onClick={handleRestartQuiz}
                        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Start New Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizManager;
