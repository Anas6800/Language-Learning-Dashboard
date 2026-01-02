import React, { useState, useMemo } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useVocabulary } from '../../contexts/VocabularyContext';
import { useQuiz } from '../../contexts/QuizContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  BookOpen, 
  Brain, 
  Trophy, 
  Calendar,
  Target,
  Award
} from 'lucide-react';

interface ProgressTrackerProps {
  darkMode: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ darkMode }) => {
  const { userProgress, loading } = useProgress();
  const { words } = useVocabulary();
  const { quizHistory } = useQuiz();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Prepare data for charts
  const chartData = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    
    if (timeRange === 'week') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setDate(endDate.getDate() - 30);
    } else {
      startDate.setDate(endDate.getDate() - 365);
    }

    // Filter quiz history by time range
    const filteredHistory = quizHistory.filter(result => 
      new Date(result.timestamp) >= startDate
    );

    // Group by date
    const groupedData = filteredHistory.reduce((acc, result) => {
      const date = new Date(result.timestamp);
      const dateKey = date.toLocaleDateString();
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          correct: 0,
          total: 0,
          wordsLearned: 0,
        };
      }
      
      acc[dateKey].total++;
      if (result.correct) {
        acc[dateKey].correct++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by date
    return Object.values(groupedData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [quizHistory, timeRange]);

  // Language distribution data
  const languageData = useMemo(() => {
    const distribution = words.reduce((acc, word) => {
      acc[word.language] = (acc[word.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([language, count]) => ({
      name: language,
      value: count,
    }));
  }, [words]);

  // Difficulty distribution data
  const difficultyData = useMemo(() => {
    const distribution = words.reduce((acc, word) => {
      acc[word.difficulty] = (acc[word.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Easy', value: distribution.easy || 0 },
      { name: 'Medium', value: distribution.medium || 0 },
      { name: 'Hard', value: distribution.hard || 0 },
    ];
  }, [words]);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading progress...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Progress Tracker
        </h2>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'all')}
          className={`px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <BookOpen className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-3`} />
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Words</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProgress.totalWords}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <Brain className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`} />
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quiz Accuracy</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProgress.accuracy}%</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <Calendar className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} mr-3`} />
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProgress.streak}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <Trophy className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Quizzes</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProgress.totalAnswers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Performance Over Time */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Quiz Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Line 
                type="monotone" 
                dataKey="correct" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Correct Answers"
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total Questions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Language Distribution */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Language Distribution
          </h3>
          {languageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <BookOpen className="mx-auto h-12 w-12 mb-4" />
              <p>No language data available</p>
            </div>
          )}
        </div>

        {/* Difficulty Distribution */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Difficulty Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="name" 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Achievements */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Achievements
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <Target className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">First Steps</p>
                  <p className="text-sm text-green-600">Add your first word</p>
                </div>
              </div>
              {userProgress.totalWords > 0 && (
                <Award className="h-6 w-6 text-green-600" />
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-blue-800">Quiz Master</p>
                  <p className="text-sm text-blue-600">Complete 10 quizzes</p>
                </div>
              </div>
              {userProgress.totalAnswers >= 10 && (
                <Award className="h-6 w-6 text-blue-600" />
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center">
                <Trophy className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-purple-800">Week Warrior</p>
                  <p className="text-sm text-purple-600">7-day streak</p>
                </div>
              </div>
              {userProgress.streak >= 7 && (
                <Award className="h-6 w-6 text-purple-600" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
