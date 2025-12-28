'use client';

import { useState } from 'react';
import { X, Lightbulb, Loader2 } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { brainstormAPI } from '@/lib/api';

interface BrainstormResult {
  title_suggestions: string[];
  structure: Array<{ name: string; description: string }>;
  key_points: string[];
  methodology_suggestions: string[];
  reference_topics: string[];
}

export function BrainstormPanel() {
  const { showBrainstorm, toggleBrainstorm, setTitle, addSection, setActiveSection } = usePaperStore();
  const [topic, setTopic] = useState('');
  const [field, setField] = useState('');
  const [researchType, setResearchType] = useState('experimental');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BrainstormResult | null>(null);

  if (!showBrainstorm) return null;

  const handleGenerate = async () => {
    if (!topic.trim() || !field.trim()) {
      alert('Please fill in topic and field');
      return;
    }

    setLoading(true);
    try {
      const response = await brainstormAPI.generate(topic, researchType, field);
      setResult(response.data);
    } catch (error) {
      console.error('Error generating outline:', error);
      alert('Failed to generate outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseTitle = (title: string) => {
    setTitle(title);
    alert('Title applied!');
  };

  const handleAddSection = (sectionName: string) => {
    const newSection = {
      id: `section-${Date.now()}`,
      name: sectionName,
      content: '',
      wordCount: 0,
    };
    addSection(newSection);
    setActiveSection(newSection.id);
  };

  return (
    <div className="w-96 border-l border-secondary-200 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-secondary-200 px-4 py-3">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-secondary-900">Brainstorm</h3>
        </div>
        <button
          onClick={toggleBrainstorm}
          className="p-1 hover:bg-secondary-100 rounded transition-colors"
        >
          <X className="h-5 w-5 text-secondary-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Input Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-secondary-700 mb-1">
              Research Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Machine Learning in Healthcare"
              className="w-full px-3 py-2 border border-secondary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary-700 mb-1">
              Academic Field
            </label>
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="e.g., Computer Science"
              className="w-full px-3 py-2 border border-secondary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary-700 mb-1">
              Research Type
            </label>
            <select
              value={researchType}
              onChange={(e) => setResearchType(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="experimental">Experimental</option>
              <option value="review">Review</option>
              <option value="case_study">Case Study</option>
              <option value="theoretical">Theoretical</option>
              <option value="survey">Survey</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Lightbulb className="h-5 w-5" />
                <span>Generate Outline</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 border-t border-secondary-200 pt-4">
            {/* Title Suggestions */}
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">
                Title Suggestions
              </h4>
              <div className="space-y-2">
                {result.title_suggestions.map((title, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseTitle(title)}
                    className="w-full text-left px-3 py-2 bg-secondary-50 hover:bg-secondary-100 rounded text-sm text-secondary-700 transition-colors"
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>

            {/* Structure */}
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">
                Recommended Structure
              </h4>
              <div className="space-y-2">
                {result.structure.map((section, index) => (
                  <div
                    key={index}
                    className="border border-secondary-200 rounded p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-900">
                        {section.name}
                      </span>
                      <button
                        onClick={() => handleAddSection(section.name)}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        + Add
                      </button>
                    </div>
                    <p className="text-xs text-secondary-600">{section.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Key Points</h4>
              <ul className="space-y-1">
                {result.key_points.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-xs text-secondary-700 flex-1">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Methodology Suggestions */}
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">
                Methodology Suggestions
              </h4>
              <ul className="space-y-1">
                {result.methodology_suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-xs text-secondary-700 flex-1">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reference Topics */}
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">
                Reference Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.reference_topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
