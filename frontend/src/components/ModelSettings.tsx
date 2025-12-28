'use client';

import { useEffect, useState } from 'react';
import { Settings, X } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { modelAPI } from '@/lib/api';

export function ModelSettings() {
  const {
    selectedModel,
    smartModelSwitching,
    availableModels,
    modelProvider,
    setSelectedModel,
    setSmartModelSwitching,
    setAvailableModels,
    setModelProvider,
    darkMode,
  } = usePaperStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load model settings on mount
    loadModelSettings();
  }, []);

  const loadModelSettings = async () => {
    try {
      setLoading(true);
      const response = await modelAPI.getSettings();
      const data = response.data;
      
      setModelProvider(data.provider);
      setSelectedModel(data.default_model);
      setSmartModelSwitching(data.smart_switching);
      setAvailableModels(data.available_models);
    } catch (error) {
      console.error('Error loading model settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-lg transition-colors ${
          darkMode
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Model Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`rounded-2xl shadow-2xl max-w-md w-full mx-4 ${
          darkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white/90 backdrop-blur-xl border border-white/20'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-500" />
            <h2
              className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              AI Model Settings
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Provider Info */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Provider
            </label>
            <div
              className={`p-3 rounded-lg ${
                darkMode ? 'bg-gray-700/50' : 'bg-blue-50'
              }`}
            >
              <span
                className={`font-semibold ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                {modelProvider}
              </span>
              {modelProvider === 'OpenRouter' && (
                <span
                  className={`ml-2 text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  (4 free models available)
                </span>
              )}
            </div>
          </div>

          {/* Model Selection */}
          {availableModels.length > 0 && (
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Default Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.icon} {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Smart Switching */}
          {modelProvider === 'OpenRouter' && (
            <div>
              <label
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                  darkMode
                    ? 'bg-gray-700/50 hover:bg-gray-700'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex-1">
                  <div
                    className={`font-medium mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    🔄 Smart Model Switching
                  </div>
                  <div
                    className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Auto-select best model for each task
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={smartModelSwitching}
                  onChange={(e) => setSmartModelSwitching(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          )}

          {/* Model Mapping Info */}
          {smartModelSwitching && modelProvider === 'OpenRouter' && (
            <div
              className={`p-4 rounded-lg text-sm ${
                darkMode
                  ? 'bg-blue-900/20 border border-blue-800'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div
                className={`font-semibold mb-2 ${
                  darkMode ? 'text-blue-300' : 'text-blue-700'
                }`}
              >
                Smart Switching Active:
              </div>
              <ul
                className={`space-y-1 ${
                  darkMode ? 'text-blue-200' : 'text-blue-600'
                }`}
              >
                <li>✍️ Mistral 7B → Writing, grammar, clarity</li>
                <li>🎓 Gemma 2 9B → Academic, formal writing</li>
                <li>⚡ Llama 3.2 3B → Fast chat responses</li>
                <li>🧠 Qwen 2 7B → Brainstorming, reasoning</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
