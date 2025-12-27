'use client';

import { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { exportAPI } from '@/lib/api';

export function ExportModal() {
  const {
    showExport,
    toggleExport,
    title,
    authors,
    abstract,
    keywords,
    sections,
    selectedTemplate,
  } = usePaperStore();
  const [loading, setLoading] = useState(false);
  const [aiDisclosure, setAiDisclosure] = useState('');
  const [includeDisclosure, setIncludeDisclosure] = useState(false);

  if (!showExport) return null;

  const handleExport = async () => {
    if (!title.trim()) {
      alert('Please add a title to your paper');
      return;
    }

    setLoading(true);
    try {
      const exportData = {
        title,
        authors,
        abstract,
        keywords,
        sections: sections.map((s) => ({ name: s.name, content: s.content })),
        template_format: selectedTemplate,
        ai_disclosure: includeDisclosure ? aiDisclosure : undefined,
      };

      const response = await exportAPI.toDocx(exportData);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_')}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      alert('Paper exported successfully!');
      toggleExport();
    } catch (error) {
      console.error('Error exporting paper:', error);
      alert('Failed to export paper. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-secondary-900">Export Paper</h2>
          <button
            onClick={toggleExport}
            className="p-1 hover:bg-secondary-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Paper Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Title
              </label>
              <p className="text-sm text-secondary-900 bg-secondary-50 px-4 py-3 rounded">
                {title || 'No title set'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Template Format
              </label>
              <p className="text-sm text-secondary-900 bg-secondary-50 px-4 py-3 rounded uppercase">
                {selectedTemplate}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Sections ({sections.length})
              </label>
              <div className="bg-secondary-50 rounded p-4">
                {sections.length === 0 ? (
                  <p className="text-sm text-secondary-500">No sections added</p>
                ) : (
                  <ul className="space-y-2">
                    {sections.map((section) => (
                      <li
                        key={section.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-secondary-900">{section.name}</span>
                        <span className="text-secondary-500">{section.wordCount} words</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* AI Disclosure */}
          <div className="border-t border-secondary-200 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="includeDisclosure"
                checked={includeDisclosure}
                onChange={(e) => setIncludeDisclosure(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label
                htmlFor="includeDisclosure"
                className="text-sm font-medium text-secondary-700"
              >
                Include AI Disclosure Statement
              </label>
            </div>

            {includeDisclosure && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  AI Disclosure Statement
                </label>
                <textarea
                  value={aiDisclosure}
                  onChange={(e) => setAiDisclosure(e.target.value)}
                  placeholder="Enter your AI disclosure statement..."
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  rows={6}
                />
                <p className="text-xs text-secondary-500 mt-2">
                  Use the AI Detector panel to generate a disclosure statement
                </p>
              </div>
            )}
          </div>

          {/* Export Info */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <p className="text-xs text-primary-900">
              <strong>Note:</strong> The exported document will be formatted according to the
              selected journal template with proper margins, fonts, and spacing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-secondary-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={toggleExport}
            className="px-6 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading || !title.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Export to DOCX</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
