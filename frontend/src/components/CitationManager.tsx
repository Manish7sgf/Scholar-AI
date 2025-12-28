'use client';

import { useState } from 'react';
import { X, Plus, Search, ExternalLink } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { cn, formatCitation, generateId } from '@/lib/utils';
import { citationAPI } from '@/lib/api';
import { toast } from '@/lib/toast';

export function CitationManager() {
  const { darkMode, citations, selectedTemplate, addCitation, updateCitation, deleteCitation, toggleCitations } = usePaperStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    journal: '',
    year: '',
    doi: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchFromDOI = async () => {
    if (!formData.doi) {
      toast.show({ message: 'Please enter a DOI', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await citationAPI.fetchFromDOI(formData.doi);
      const data = response.data;
      setFormData({
        ...formData,
        author: data.author || '',
        title: data.title || '',
        journal: data.journal || '',
        year: data.year || '',
      });
      toast.show({ message: 'Citation details fetched successfully', type: 'success' });
    } catch (error) {
      toast.show({ message: 'Failed to fetch citation details', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.author || !formData.title || !formData.year) {
      toast.show({ message: 'Please fill in required fields', type: 'error' });
      return;
    }

    const citation = {
      id: generateId(),
      ...formData,
      type: selectedTemplate.toLowerCase() as 'ieee' | 'apa' | 'mla',
    };

    addCitation(citation);
    setFormData({ author: '', title: '', journal: '', year: '', doi: '' });
    setShowForm(false);
    toast.show({ message: 'Citation added successfully', type: 'success' });
  };

  const handleInsertCitation = (citation: any) => {
    const formatted = formatCitation(citation, selectedTemplate);
    // Copy to clipboard for now (in real app, would insert into editor)
    navigator.clipboard.writeText(formatted);
    toast.show({ message: 'Citation copied to clipboard', type: 'success' });
  };

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
          <h2 className={cn(
            'text-lg font-semibold',
            darkMode ? 'text-white' : 'text-secondary-900'
          )}>
            References
          </h2>
          <button
            onClick={toggleCitations}
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
          {/* Add Citation Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Citation</span>
            </button>
          )}

          {/* Add Citation Form */}
          {showForm && (
            <div className={cn(
              'p-4 rounded-lg space-y-3',
              darkMode ? 'bg-gray-800' : 'bg-white/60'
            )}>
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  'font-semibold',
                  darkMode ? 'text-white' : 'text-secondary-900'
                )}>
                  New Citation
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className={cn(
                    'p-1 rounded',
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-white text-secondary-600'
                  )}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-1',
                    darkMode ? 'text-gray-300' : 'text-secondary-700'
                  )}>
                    DOI (optional)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                      placeholder="10.1000/xyz123"
                      className={cn(
                        'flex-1 px-3 py-2 rounded-lg text-sm',
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-secondary-900'
                      )}
                    />
                    <button
                      type="button"
                      onClick={handleFetchFromDOI}
                      disabled={isLoading}
                      className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-1',
                    darkMode ? 'text-gray-300' : 'text-secondary-700'
                  )}>
                    Author(s) *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Smith, J. et al."
                    required
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-secondary-900'
                    )}
                  />
                </div>

                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-1',
                    darkMode ? 'text-gray-300' : 'text-secondary-700'
                  )}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Article title"
                    required
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-secondary-900'
                    )}
                  />
                </div>

                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-1',
                    darkMode ? 'text-gray-300' : 'text-secondary-700'
                  )}>
                    Journal/Conference
                  </label>
                  <input
                    type="text"
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    placeholder="IEEE Transactions..."
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-secondary-900'
                    )}
                  />
                </div>

                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-1',
                    darkMode ? 'text-gray-300' : 'text-secondary-700'
                  )}>
                    Year *
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                    required
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-secondary-900'
                    )}
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-lg',
                      darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-secondary-900 hover:bg-gray-300'
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Citations List */}
          <div className="space-y-2">
            {citations.length === 0 && !showForm && (
              <p className={cn(
                'text-center text-sm py-8',
                darkMode ? 'text-gray-400' : 'text-secondary-500'
              )}>
                No citations yet. Add your first reference above.
              </p>
            )}

            {citations.map((citation, index) => (
              <div
                key={citation.id}
                className={cn(
                  'p-3 rounded-lg space-y-2',
                  darkMode ? 'bg-gray-800' : 'bg-white/60'
                )}
              >
                <div className="flex items-start justify-between">
                  <span className={cn(
                    'text-xs font-semibold',
                    darkMode ? 'text-gray-400' : 'text-secondary-600'
                  )}>
                    [{index + 1}]
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleInsertCitation(citation)}
                      className={cn(
                        'p-1 rounded',
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-white text-secondary-600'
                      )}
                      title="Copy citation"
                    >
                      <ExternalLink size={14} />
                    </button>
                    <button
                      onClick={() => deleteCitation(citation.id)}
                      className={cn(
                        'p-1 rounded',
                        darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-white text-red-600'
                      )}
                      title="Delete"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <p className={cn(
                  'text-sm',
                  darkMode ? 'text-gray-300' : 'text-secondary-800'
                )}>
                  {formatCitation(citation, selectedTemplate)}
                </p>
              </div>
            ))}
          </div>

          {/* Generate Bibliography Button */}
          {citations.length > 0 && (
            <button
              onClick={() => {
                const bib = citations.map((c, i) => `[${i + 1}] ${formatCitation(c, selectedTemplate)}`).join('\n\n');
                navigator.clipboard.writeText(bib);
                toast.show({ message: 'Bibliography copied to clipboard', type: 'success' });
              }}
              className={cn(
                'w-full py-2 px-4 rounded-lg text-sm font-medium',
                darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white/60 text-secondary-900 hover:bg-white'
              )}
            >
              Copy Bibliography
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
