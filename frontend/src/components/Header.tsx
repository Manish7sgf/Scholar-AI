'use client';

import { Download, Save, Bot, Shield, Lightbulb } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Header() {
  const {
    showAIAssistant,
    showAIDetector,
    showBrainstorm,
    toggleAIAssistant,
    toggleAIDetector,
    toggleBrainstorm,
    toggleExport,
  } = usePaperStore();

  return (
    <header className="border-b border-secondary-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">ScholarAI</h1>
          </div>
          <span className="text-sm text-secondary-500">
            Ethical AI-Powered Research Writing Assistant
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Panel Toggles */}
          <button
            onClick={toggleBrainstorm}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors',
              showBrainstorm
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'border-secondary-300 text-secondary-700 hover:bg-secondary-50'
            )}
          >
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-medium">Brainstorm</span>
          </button>

          <button
            onClick={toggleAIAssistant}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors',
              showAIAssistant
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'border-secondary-300 text-secondary-700 hover:bg-secondary-50'
            )}
          >
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">AI Assistant</span>
          </button>

          <button
            onClick={toggleAIDetector}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors',
              showAIDetector
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'border-secondary-300 text-secondary-700 hover:bg-secondary-50'
            )}
          >
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">AI Detector</span>
          </button>

          <div className="w-px h-8 bg-secondary-300 mx-2" />

          {/* Action Buttons */}
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span className="text-sm font-medium">Save</span>
          </button>

          <button
            onClick={toggleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
}
