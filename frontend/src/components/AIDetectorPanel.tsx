'use client';

import { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { detectionAPI } from '@/lib/api';

export function AIDetectorPanel() {
  const { showAIDetector, toggleAIDetector, sections, activeSection, detectionResult, setDetectionResult } =
    usePaperStore();
  const [loading, setLoading] = useState(false);
  const [disclosureText, setDisclosureText] = useState('');
  const [showDisclosureForm, setShowDisclosureForm] = useState(false);
  const [aiTools, setAiTools] = useState('');
  const [purpose, setPurpose] = useState('');

  const currentSection = sections.find((s) => s.id === activeSection);

  if (!showAIDetector) return null;

  const handleDetect = async () => {
    if (!currentSection?.content) {
      alert('Please select a section with content first');
      return;
    }

    setLoading(true);
    try {
      const response = await detectionAPI.detect(currentSection.content);
      setDetectionResult(response.data);
    } catch (error) {
      console.error('Error detecting AI content:', error);
      alert('Failed to analyze content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDisclosure = async () => {
    if (!aiTools.trim() || !purpose.trim()) {
      alert('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      const toolsList = aiTools.split(',').map((t) => t.trim());
      const response = await detectionAPI.generateDisclosure(toolsList);
      setDisclosureText(response.data.disclosure_statement);
      setShowDisclosureForm(false);
    } catch (error) {
      console.error('Error generating disclosure:', error);
      alert('Failed to generate disclosure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-secondary-600 bg-secondary-50 border-secondary-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-96 border-l border-secondary-200 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-secondary-200 px-4 py-3">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-secondary-900">AI Detector</h3>
        </div>
        <button
          onClick={toggleAIDetector}
          className="p-1 hover:bg-secondary-100 rounded transition-colors"
        >
          <X className="h-5 w-5 text-secondary-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Info Banner */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <p className="text-xs text-primary-900">
            <strong>Ethical Tool:</strong> This detector helps you identify AI-generated content for
            proper disclosure in journal submissions, maintaining academic integrity.
          </p>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleDetect}
          disabled={loading || !currentSection?.content}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Shield className="h-5 w-5" />
              <span>Analyze Current Section</span>
            </>
          )}
        </button>

        {/* Detection Results */}
        {detectionResult && (
          <div className="space-y-4">
            {/* Score */}
            <div className={`border rounded-lg p-4 ${getLevelColor(detectionResult.level)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getLevelIcon(detectionResult.level)}
                  <span className="font-semibold text-sm uppercase">
                    {detectionResult.level} Detection
                  </span>
                </div>
                <span className="text-2xl font-bold">{detectionResult.score}%</span>
              </div>
              <p className="text-xs">AI content likelihood score</p>
            </div>

            {/* Flagged Sections */}
            {detectionResult.flagged_sections.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-secondary-900 mb-2">
                  Flagged Sections ({detectionResult.flagged_sections.length})
                </h4>
                <div className="space-y-2">
                  {detectionResult.flagged_sections.map((section, index) => (
                    <div
                      key={index}
                      className="bg-yellow-50 border border-yellow-200 rounded p-3"
                    >
                      <p className="text-xs text-secondary-700">{section}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Suggestions</h4>
              <ul className="space-y-2">
                {detectionResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-sm text-secondary-700 flex-1">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Disclosure Generator */}
        <div className="border-t border-secondary-200 pt-4 mt-4">
          <h4 className="text-sm font-semibold text-secondary-900 mb-3">
            Generate AI Disclosure Statement
          </h4>

          {!showDisclosureForm && !disclosureText && (
            <button
              onClick={() => setShowDisclosureForm(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Create Disclosure</span>
            </button>
          )}

          {showDisclosureForm && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-1">
                  AI Tools Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={aiTools}
                  onChange={(e) => setAiTools(e.target.value)}
                  placeholder="e.g., ChatGPT, Claude, Grammarly"
                  className="w-full px-3 py-2 border border-secondary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-1">
                  Purpose
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., improving clarity, fixing grammar"
                  className="w-full px-3 py-2 border border-secondary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleGenerateDisclosure}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  Generate
                </button>
                <button
                  onClick={() => setShowDisclosureForm(false)}
                  className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded hover:bg-secondary-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {disclosureText && (
            <div className="space-y-2">
              <div className="bg-secondary-50 border border-secondary-200 rounded p-3">
                <p className="text-xs text-secondary-700 whitespace-pre-wrap">{disclosureText}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(disclosureText);
                  alert('Disclosure copied to clipboard!');
                }}
                className="w-full px-4 py-2 text-sm bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200 transition-colors"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => {
                  setDisclosureText('');
                  setShowDisclosureForm(true);
                }}
                className="w-full px-4 py-2 text-sm text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Generate New
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
