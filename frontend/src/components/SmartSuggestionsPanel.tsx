'use client';

import { useState, useEffect } from 'react';
import { X, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const SECTION_TIPS: Record<string, string[]> = {
  introduction: [
    'Include background context and motivation',
    'Clearly state the problem you\'re addressing',
    'Define your research objectives',
    'Outline your main contributions',
    'End with a brief paper structure overview',
  ],
  'literature review': [
    'Organize by themes, not just chronologically',
    'Identify gaps in existing research',
    'Compare and contrast different approaches',
    'Cite recent works (last 3-5 years)',
  ],
  'related work': [
    'Organize by themes, not just chronologically',
    'Identify gaps in existing research',
    'Compare and contrast different approaches',
    'Cite recent works (last 3-5 years)',
  ],
  methodology: [
    'Describe methods in enough detail for reproducibility',
    'Justify your choice of methods',
    'Explain data collection procedures',
    'Address validity and reliability',
  ],
  results: [
    'Present findings objectively without interpretation',
    'Use tables and figures effectively',
    'Report statistical significance where applicable',
    'Organize by research questions',
  ],
  discussion: [
    'Interpret results in context of literature',
    'Discuss practical implications',
    'Acknowledge limitations honestly',
    'Suggest future research directions',
  ],
  conclusion: [
    'Summarize key findings concisely',
    'Restate main contributions',
    'Avoid introducing new information',
    'End with impact statement',
  ],
};

const COMMON_MISTAKES = [
  'Avoid first person (I/we) unless journal allows',
  'Don\'t use contractions (don\'t → do not)',
  'Avoid vague words: very, really, things, stuff',
  'Use active voice when possible',
  'Keep sentences concise (aim for 15-25 words)',
];

const DID_YOU_KNOW = [
  'Most journals require 150-300 word abstracts',
  'IEEE uses [1] format, APA uses (Author, Year)',
  'Always check journal\'s author guidelines first',
  'Methodology is often the longest section',
];

export function SmartSuggestionsPanel() {
  const {
    darkMode,
    activeSection,
    sections,
    dismissedTips,
    dismissTip,
    resetTips,
    toggleSuggestions,
  } = usePaperStore();
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['section-tips']));
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Get tips for active section
  const activeSectionData = sections.find(s => s.id === activeSection);
  const sectionName = activeSectionData?.title.toLowerCase() || '';
  const sectionTips = SECTION_TIPS[sectionName] || SECTION_TIPS['introduction'];

  // Rotate "Did You Know" tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % DID_YOU_KNOW.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleDismissTip = (tipId: string) => {
    dismissTip(tipId);
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
          <div className="flex items-center space-x-2">
            <Lightbulb size={20} className="text-yellow-500" />
            <h2 className={cn(
              'text-lg font-semibold',
              darkMode ? 'text-white' : 'text-secondary-900'
            )}>
              Smart Suggestions
            </h2>
          </div>
          <button
            onClick={toggleSuggestions}
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
          {/* Section-Specific Tips */}
          <div className={cn(
            'rounded-lg overflow-hidden',
            darkMode ? 'bg-gray-800' : 'bg-white/60'
          )}>
            <button
              onClick={() => toggleSection('section-tips')}
              className={cn(
                'w-full px-4 py-3 flex items-center justify-between',
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-white/80'
              )}
            >
              <span className={cn(
                'font-semibold',
                darkMode ? 'text-white' : 'text-secondary-900'
              )}>
                {activeSectionData?.title || 'Section'} Tips
              </span>
              {expandedSections.has('section-tips') ? (
                <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-secondary-600'} />
              ) : (
                <ChevronRight size={18} className={darkMode ? 'text-gray-400' : 'text-secondary-600'} />
              )}
            </button>
            
            {expandedSections.has('section-tips') && (
              <div className="px-4 pb-4 space-y-2">
                {sectionTips.map((tip, index) => {
                  const tipId = `section-${sectionName}-${index}`;
                  if (dismissedTips.includes(tipId)) return null;
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        'p-3 rounded-lg text-sm',
                        darkMode ? 'bg-gray-700/50' : 'bg-white/50'
                      )}
                    >
                      <p className={cn(
                        darkMode ? 'text-gray-200' : 'text-secondary-800'
                      )}>
                        • {tip}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <label className="flex items-center space-x-1 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={() => handleDismissTip(tipId)}
                            className="rounded"
                          />
                          <span className={cn(
                            darkMode ? 'text-gray-400' : 'text-secondary-600'
                          )}>
                            Don't show again
                          </span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Common Mistakes */}
          <div className={cn(
            'rounded-lg overflow-hidden',
            darkMode ? 'bg-gray-800' : 'bg-white/60'
          )}>
            <button
              onClick={() => toggleSection('mistakes')}
              className={cn(
                'w-full px-4 py-3 flex items-center justify-between',
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-white/80'
              )}
            >
              <span className={cn(
                'font-semibold',
                darkMode ? 'text-white' : 'text-secondary-900'
              )}>
                Common Mistakes
              </span>
              {expandedSections.has('mistakes') ? (
                <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-secondary-600'} />
              ) : (
                <ChevronRight size={18} className={darkMode ? 'text-gray-400' : 'text-secondary-600'} />
              )}
            </button>
            
            {expandedSections.has('mistakes') && (
              <div className="px-4 pb-4 space-y-2">
                {COMMON_MISTAKES.map((mistake, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-3 rounded-lg text-sm',
                      darkMode ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'
                    )}
                  >
                    <p className={cn(
                      darkMode ? 'text-red-300' : 'text-red-800'
                    )}>
                      ⚠️ {mistake}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Did You Know */}
          <div className={cn(
            'rounded-lg overflow-hidden',
            darkMode ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/30' : 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200'
          )}>
            <div className="px-4 py-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">💡</span>
                <span className={cn(
                  'font-semibold',
                  darkMode ? 'text-white' : 'text-secondary-900'
                )}>
                  Did You Know?
                </span>
              </div>
              <p className={cn(
                'text-sm',
                darkMode ? 'text-gray-200' : 'text-secondary-800'
              )}>
                {DID_YOU_KNOW[currentTipIndex]}
              </p>
            </div>
          </div>

          {/* Reset Tips Button */}
          {dismissedTips.length > 0 && (
            <button
              onClick={resetTips}
              className={cn(
                'w-full py-2 px-4 rounded-lg text-sm font-medium',
                darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white/60 text-secondary-900 hover:bg-white'
              )}
            >
              Reset All Tips
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
