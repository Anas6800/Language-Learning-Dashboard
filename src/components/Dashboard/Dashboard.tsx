import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { VocabularyProvider } from '../../contexts/VocabularyContext';
import { QuizProvider } from '../../contexts/QuizContext';
import { ProgressProvider } from '../../contexts/ProgressContext';
import { Moon, Sun, LogOut, BookOpen, Brain, TrendingUp, Settings } from 'lucide-react';
import VocabularyManager from '../Vocabulary/VocabularyManager';
import QuizManager from '../Quiz/QuizManager';
import ProgressTracker from '../Progress/ProgressTracker';

interface DashboardProps {
  onToggleMode: () => void;
  darkMode: boolean;
}

const DashboardContent: React.FC<DashboardProps> = ({ onToggleMode, darkMode }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('vocabulary');

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { icon: BookOpen, label: 'Vocabulary', id: 'vocabulary' },
    { icon: Brain, label: 'Quiz', id: 'quiz' },
    { icon: TrendingUp, label: 'Progress', id: 'progress' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'vocabulary':
        return <VocabularyManager darkMode={darkMode} />;
      case 'quiz':
        return <QuizManager darkMode={darkMode} />;
      case 'progress':
        return <ProgressTracker darkMode={darkMode} />;
      case 'settings':
        return (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Settings className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p>Coming soon! Customize your learning experience.</p>
          </div>
        );
      default:
        return <VocabularyManager darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-3`} />
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Language Learning Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Welcome, {user?.email}
              </span>
              
              <button
                onClick={onToggleMode}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-red-400 hover:bg-gray-600' : 'bg-gray-100 text-red-600 hover:bg-gray-200'}`}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-64 min-h-screen ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.id
                        ? darkMode 
                          ? 'bg-indigo-900 text-indigo-300' 
                          : 'bg-indigo-50 text-indigo-700'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = (props) => {
  return (
    <VocabularyProvider>
      <QuizProvider>
        <ProgressProvider>
          <DashboardContent {...props} />
        </ProgressProvider>
      </QuizProvider>
    </VocabularyProvider>
  );
};

export default Dashboard;
