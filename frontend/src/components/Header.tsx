'use client';

import { Download, Save, Bot, Shield, Lightbulb, Upload, Moon, Sun, BookOpen, TrendingUp, Keyboard } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { cn, formatDate } from '@/lib/utils';
import { ModelSettings } from './ModelSettings';

export function Header() {
  const {
    showAIAssistant,
    showAIDetector,
    showBrainstorm,
    showFileUpload,
    showSuggestions,
    showCitations,
    showAnalytics,
    darkMode,
    lastSaved,
    isSaving,
    toggleAIAssistant,
    toggleAIDetector,
    toggleBrainstorm,
    toggleExport,
    toggleFileUpload,
    toggleDarkMode,
    toggleSuggestions,
    toggleCitations,
    toggleAnalytics,
    toggleKeyboardShortcuts,
  } = usePaperStore();

  return (
    <header className={cn(
      "border-b backdrop-blur-xl shadow-lg transition-colors",
      darkMode
        ? "border-gray-700 bg-gradient-to-r from-gray-900/90 to-gray-800/90"
        : "border-white/20 bg-gradient-to-r from-white/90 to-primary-50/30"
    )}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                ScholarAI
              </h1>
              <span className={cn(
                "text-xs",
                darkMode ? "text-gray-400" : "text-secondary-500"
              )}>
                Ethical AI-Powered Research Assistant
              </span>
            </div>
          </div>
          
          {/* Last Saved Indicator */}
          {lastSaved && (
            <div className={cn(
              "text-xs px-3 py-1 rounded-full",
              darkMode ? "bg-gray-800 text-gray-400" : "bg-white/60 text-secondary-600"
            )}>
              {isSaving ? (
                <span className="flex items-center space-x-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span>Saving...</span>
                </span>
              ) : (
                <span>Last saved: {lastSaved}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Model Settings */}
          <ModelSettings />
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={cn(
              'p-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              darkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Panel Toggles */}
          <button
            onClick={toggleFileUpload}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              showFileUpload
                ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500 text-primary-700'
                : darkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm font-medium">Upload</span>
          </button>

          <button
            onClick={toggleBrainstorm}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              showBrainstorm
                ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500 text-primary-700'
                : darkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
          >
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-medium">Brainstorm</span>
          </button>

          <button
            onClick={toggleAIAssistant}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              showAIAssistant
                ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500 text-primary-700'
                : darkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
          >
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">AI Assistant</span>
          </button>

          <button
            onClick={toggleAIDetector}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              showAIDetector
                ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500 text-primary-700'
                : darkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
          >
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">AI Detector</span>
          </button>

          <div className={cn(
            "w-px h-8 mx-2",
            darkMode ? "bg-gray-700" : "bg-white/30"
          )} />

          {/* New Panel Toggles */}
          <button
            onClick={toggleSuggestions}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              showSuggestions
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500 text-yellow-700'
                : darkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
            title="Smart Suggestions"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-medium">Tips</span>
          </button>

          <button
            onClick={toggleCitations}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              showCitations
                ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500 text-primary-700'
                : darkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
            title="Citations & References"
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">References</span>
          </button>

          <button
            onClick={toggleAnalytics}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              showAnalytics
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500 text-green-700'
                : darkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
            title="Writing Analytics"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Analytics</span>
          </button>

          <button
            onClick={toggleKeyboardShortcuts}
            className={cn(
              'p-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              darkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
            title="Keyboard Shortcuts"
          >
            <Keyboard className="h-4 w-4" />
          </button>

          <div className={cn(
            "w-px h-8 mx-2",
            darkMode ? "bg-gray-700" : "bg-white/30"
          )} />

          {/* Action Buttons */}
          <button
            className={cn(
              "flex items-center space-x-2 px-4 py-2 backdrop-blur-md rounded-lg hover:opacity-90 transition-all shadow-md",
              darkMode
                ? "bg-gray-800 border border-gray-700 text-gray-300"
                : "bg-white/60 border border-white/40 text-secondary-700"
            )}
          >
            <Save className="h-4 w-4" />
            <span className="text-sm font-medium">Save</span>
          </button>

          <button
            onClick={toggleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
}
