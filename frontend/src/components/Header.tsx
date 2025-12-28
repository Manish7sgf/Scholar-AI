'use client';

import { Download, Save, Bot, Shield, Lightbulb, Upload } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Header() {
  const {
    showAIAssistant,
    showAIDetector,
    showBrainstorm,
    showFileUpload,
    toggleAIAssistant,
    toggleAIDetector,
    toggleBrainstorm,
    toggleExport,
    toggleFileUpload,
  } = usePaperStore();

  return (
    <header className="border-b border-white/20 backdrop-blur-xl bg-gradient-to-r from-white/90 to-primary-50/30 shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">ScholarAI</h1>
              <span className="text-xs text-secondary-500">
                Ethical AI-Powered Research Assistant
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Panel Toggles */}
          <button
            onClick={toggleFileUpload}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-md',
              showFileUpload
                ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500 text-primary-700'
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
                : 'bg-white/60 border border-white/40 text-secondary-700 hover:bg-white/80'
            )}
          >
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">AI Detector</span>
          </button>

          <div className="w-px h-8 bg-white/30 mx-2" />

          {/* Action Buttons */}
          <button
            className="flex items-center space-x-2 px-4 py-2 backdrop-blur-md bg-white/60 text-secondary-700 rounded-lg hover:bg-white/80 transition-all shadow-md border border-white/40"
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
