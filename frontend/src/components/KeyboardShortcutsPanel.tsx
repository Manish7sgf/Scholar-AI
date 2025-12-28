'use client';

import { X } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const KEYBOARD_SHORTCUTS = [
  { keys: ['Ctrl', 'B'], action: 'Bold text', category: 'Formatting' },
  { keys: ['Ctrl', 'I'], action: 'Italic text', category: 'Formatting' },
  { keys: ['Ctrl', 'U'], action: 'Underline text', category: 'Formatting' },
  { keys: ['Ctrl', 'Z'], action: 'Undo', category: 'Editing' },
  { keys: ['Ctrl', 'Y'], action: 'Redo', category: 'Editing' },
  { keys: ['Ctrl', 'S'], action: 'Save paper', category: 'File' },
  { keys: ['Ctrl', 'E'], action: 'Export paper', category: 'File' },
  { keys: ['Ctrl', '/'], action: 'Show shortcuts', category: 'Help' },
];

export function KeyboardShortcutsPanel() {
  const { darkMode, toggleKeyboardShortcuts } = usePaperStore();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={cn(
        'max-w-2xl w-full rounded-xl backdrop-blur-xl shadow-2xl overflow-hidden',
        darkMode ? 'bg-gray-900/95 border border-gray-700' : 'bg-white/95 border border-white/40'
      )}>
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-6 border-b',
          darkMode ? 'border-gray-700' : 'border-white/20'
        )}>
          <h2 className={cn(
            'text-2xl font-bold',
            darkMode ? 'text-white' : 'text-secondary-900'
          )}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={toggleKeyboardShortcuts}
            className={cn(
              'p-2 rounded-lg transition-colors',
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-white/60 text-secondary-600'
            )}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {['Formatting', 'Editing', 'File', 'Help'].map((category) => {
              const shortcuts = KEYBOARD_SHORTCUTS.filter(s => s.category === category);
              if (shortcuts.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className={cn(
                    'text-lg font-semibold mb-3',
                    darkMode ? 'text-gray-200' : 'text-secondary-800'
                  )}>
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg',
                          darkMode ? 'bg-gray-800' : 'bg-white/60'
                        )}
                      >
                        <span className={cn(
                          darkMode ? 'text-gray-300' : 'text-secondary-700'
                        )}>
                          {shortcut.action}
                        </span>
                        <div className="flex items-center space-x-1">
                          {shortcut.keys.map((key, i) => (
                            <span key={i} className="flex items-center">
                              <kbd className={cn(
                                'px-3 py-1 rounded text-sm font-semibold shadow-md',
                                darkMode
                                  ? 'bg-gray-700 text-white border border-gray-600'
                                  : 'bg-white text-secondary-900 border border-gray-300'
                              )}>
                                {key}
                              </kbd>
                              {i < shortcut.keys.length - 1 && (
                                <span className={cn(
                                  'mx-1',
                                  darkMode ? 'text-gray-500' : 'text-secondary-500'
                                )}>
                                  +
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          'px-6 py-4 border-t',
          darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-white/20 bg-white/30'
        )}>
          <p className={cn(
            'text-sm text-center',
            darkMode ? 'text-gray-400' : 'text-secondary-600'
          )}>
            Press <kbd className={cn(
              'px-2 py-1 rounded text-xs font-semibold',
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-secondary-900'
            )}>Ctrl</kbd> + <kbd className={cn(
              'px-2 py-1 rounded text-xs font-semibold',
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-secondary-900'
            )}>/</kbd> anytime to show this panel
          </p>
        </div>
      </div>
    </div>
  );
}
