'use client';

import { X, TrendingUp, Clock, Zap, Edit, Award } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { cn, formatTime } from '@/lib/utils';

export function WritingAnalytics() {
  const { darkMode, writingSessions, sections, toggleAnalytics } = usePaperStore();

  // Calculate statistics
  const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);
  const totalSessions = writingSessions.length;
  const totalTime = writingSessions.reduce((sum, s) => sum + s.timeSpent, 0);
  const totalWordsWritten = writingSessions.reduce((sum, s) => sum + s.wordsWritten, 0);
  const avgWordsPerSession = totalSessions > 0 ? Math.round(totalWordsWritten / totalSessions) : 0;
  const aiUsageCount = writingSessions.reduce((sum, s) => sum + s.aiAssistanceUsed, 0);

  // Calculate writing streak
  const today = new Date().toISOString().split('T')[0];
  const dates = writingSessions.map(s => s.date).filter(d => d);
  const uniqueDates = [...new Set(dates)].sort().reverse();
  let streak = 0;
  let checkDate = new Date(today);
  
  for (const date of uniqueDates) {
    const sessionDate = new Date(date);
    if (sessionDate.toISOString().split('T')[0] === checkDate.toISOString().split('T')[0]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Most edited section
  const mostEditedSection = sections.reduce((max, s) => 
    s.wordCount > max.wordCount ? s : max, 
    sections[0] || { title: 'None', wordCount: 0 }
  );

  return (
    <div className={cn(
      'fixed right-0 top-16 bottom-0 w-96 backdrop-blur-xl shadow-2xl overflow-hidden transition-all z-40',
      darkMode
        ? 'bg-gray-900/95 border-l border-gray-700'
        : 'bg-white/95 border-l border-white/40'
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-4 border-b',
          darkMode ? 'border-gray-700' : 'border-white/20'
        )}>
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-primary-600" />
            <h2 className={cn(
              'text-lg font-semibold',
              darkMode ? 'text-white' : 'text-secondary-900'
            )}>
              Writing Analytics
            </h2>
          </div>
          <button
            onClick={toggleAnalytics}
            className={cn(
              'p-2 rounded-lg transition-colors',
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-white/60 text-secondary-600'
            )}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className={cn(
              'p-4 rounded-lg',
              darkMode ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-blue-100'
            )}>
              <div className="flex items-center space-x-2 mb-2">
                <Edit size={16} className="text-blue-500" />
                <span className={cn(
                  'text-xs font-medium',
                  darkMode ? 'text-gray-400' : 'text-secondary-600'
                )}>
                  Total Words
                </span>
              </div>
              <p className={cn(
                'text-2xl font-bold',
                darkMode ? 'text-white' : 'text-secondary-900'
              )}>
                {totalWords}
              </p>
            </div>

            <div className={cn(
              'p-4 rounded-lg',
              darkMode ? 'bg-gradient-to-br from-green-900/30 to-green-800/30' : 'bg-gradient-to-br from-green-50 to-green-100'
            )}>
              <div className="flex items-center space-x-2 mb-2">
                <Clock size={16} className="text-green-500" />
                <span className={cn(
                  'text-xs font-medium',
                  darkMode ? 'text-gray-400' : 'text-secondary-600'
                )}>
                  Time Spent
                </span>
              </div>
              <p className={cn(
                'text-2xl font-bold',
                darkMode ? 'text-white' : 'text-secondary-900'
              )}>
                {formatTime(totalTime)}
              </p>
            </div>

            <div className={cn(
              'p-4 rounded-lg',
              darkMode ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/30' : 'bg-gradient-to-br from-purple-50 to-purple-100'
            )}>
              <div className="flex items-center space-x-2 mb-2">
                <Zap size={16} className="text-purple-500" />
                <span className={cn(
                  'text-xs font-medium',
                  darkMode ? 'text-gray-400' : 'text-secondary-600'
                )}>
                  AI Assists
                </span>
              </div>
              <p className={cn(
                'text-2xl font-bold',
                darkMode ? 'text-white' : 'text-secondary-900'
              )}>
                {aiUsageCount}
              </p>
            </div>

            <div className={cn(
              'p-4 rounded-lg',
              darkMode ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/30' : 'bg-gradient-to-br from-yellow-50 to-yellow-100'
            )}>
              <div className="flex items-center space-x-2 mb-2">
                <Award size={16} className="text-yellow-500" />
                <span className={cn(
                  'text-xs font-medium',
                  darkMode ? 'text-gray-400' : 'text-secondary-600'
                )}>
                  Streak
                </span>
              </div>
              <p className={cn(
                'text-2xl font-bold',
                darkMode ? 'text-white' : 'text-secondary-900'
              )}>
                {streak} {streak === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>

          {/* Average Words per Session */}
          <div className={cn(
            'p-4 rounded-lg',
            darkMode ? 'bg-gray-800' : 'bg-white/60'
          )}>
            <h3 className={cn(
              'text-sm font-semibold mb-2',
              darkMode ? 'text-gray-200' : 'text-secondary-800'
            )}>
              Average Words per Session
            </h3>
            <p className={cn(
              'text-3xl font-bold',
              darkMode ? 'text-white' : 'text-secondary-900'
            )}>
              {avgWordsPerSession}
            </p>
          </div>

          {/* Most Edited Section */}
          <div className={cn(
            'p-4 rounded-lg',
            darkMode ? 'bg-gray-800' : 'bg-white/60'
          )}>
            <h3 className={cn(
              'text-sm font-semibold mb-2',
              darkMode ? 'text-gray-200' : 'text-secondary-800'
            )}>
              Most Edited Section
            </h3>
            <p className={cn(
              'text-lg font-bold',
              darkMode ? 'text-white' : 'text-secondary-900'
            )}>
              {mostEditedSection.title}
            </p>
            <p className={cn(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-secondary-600'
            )}>
              {mostEditedSection.wordCount} words
            </p>
          </div>

          {/* Recent Sessions */}
          <div className={cn(
            'p-4 rounded-lg',
            darkMode ? 'bg-gray-800' : 'bg-white/60'
          )}>
            <h3 className={cn(
              'text-sm font-semibold mb-3',
              darkMode ? 'text-gray-200' : 'text-secondary-800'
            )}>
              Recent Sessions
            </h3>
            <div className="space-y-2">
              {writingSessions.slice(0, 5).map((session, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 rounded-lg flex items-center justify-between',
                    darkMode ? 'bg-gray-700/50' : 'bg-white/50'
                  )}
                >
                  <div>
                    <p className={cn(
                      'text-sm font-medium',
                      darkMode ? 'text-gray-200' : 'text-secondary-800'
                    )}>
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className={cn(
                      'text-xs',
                      darkMode ? 'text-gray-400' : 'text-secondary-600'
                    )}>
                      {session.wordsWritten} words • {formatTime(session.timeSpent)}
                    </p>
                  </div>
                </div>
              ))}
              {writingSessions.length === 0 && (
                <p className={cn(
                  'text-center text-sm py-4',
                  darkMode ? 'text-gray-400' : 'text-secondary-500'
                )}>
                  No sessions recorded yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
