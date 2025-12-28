'use client';

import { useState } from 'react';
import { Send, X, Sparkles, Loader2 } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { writingAPI, chatAPI } from '@/lib/api';

const quickActions = [
  { label: 'Improve Clarity', value: 'improve_clarity' },
  { label: 'Make Formal', value: 'make_formal' },
  { label: 'Simplify', value: 'simplify' },
  { label: 'Expand', value: 'expand' },
  { label: 'Summarize', value: 'summarize' },
  { label: 'Fix Grammar', value: 'fix_grammar' },
];

export function AIAssistantPanel() {
  const { showAIAssistant, toggleAIAssistant, sections, activeSection, updateSection } =
    usePaperStore();
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; message: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);

  const currentSection = sections.find((s) => s.id === activeSection);

  if (!showAIAssistant) return null;

  const handleQuickAction = async (action: string) => {
    if (!currentSection?.content) {
      alert('Please select a section with content first');
      return;
    }

    setLoading(true);
    try {
      const response = await writingAPI.improve(currentSection.content, action);
      updateSection(activeSection!, response.data.improved_text);
      setChatHistory([
        ...chatHistory,
        { role: 'user', message: `Applied: ${quickActions.find((a) => a.value === action)?.label}` },
        { role: 'ai', message: 'Content has been improved and updated in the editor.' },
      ]);
    } catch (error) {
      console.error('Error improving text:', error);
      alert('Failed to improve text. Please check your API configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatHistory([...chatHistory, { role: 'user', message: userMessage }]);

    setLoading(true);
    try {
      const context = currentSection
        ? `Current section: ${currentSection.name}\n\nContent: ${currentSection.content}`
        : undefined;
      const response = await chatAPI.send(userMessage, context);
      setChatHistory((prev) => [...prev, { role: 'ai', message: response.data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'ai',
          message: 'Sorry, I encountered an error. Please check your API configuration.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 border-l border-secondary-200 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-secondary-200 px-4 py-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-secondary-900">AI Assistant</h3>
        </div>
        <button
          onClick={toggleAIAssistant}
          className="p-1 hover:bg-secondary-100 rounded transition-colors"
        >
          <X className="h-5 w-5 text-secondary-500" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="border-b border-secondary-200 p-4">
        <p className="text-xs font-medium text-secondary-700 mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.value}
              onClick={() => handleQuickAction(action.value)}
              disabled={loading || !currentSection?.content}
              className="px-3 py-2 text-xs font-medium text-secondary-700 bg-secondary-50 hover:bg-secondary-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center text-secondary-500 text-sm mt-8">
            <p>Ask me anything about your research paper!</p>
            <p className="mt-2 text-xs">
              I can help with writing, structuring, and improving your content.
            </p>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  chat.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary-100 text-secondary-900 px-4 py-2 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-secondary-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !chatMessage.trim()}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
