'use client';

import { useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { templateAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const {
    selectedTemplate,
    templateData,
    sections,
    activeSection,
    setSelectedTemplate,
    setTemplateData,
    setActiveSection,
    addSection,
  } = usePaperStore();

  useEffect(() => {
    // Load template data when selected template changes
    const loadTemplate = async () => {
      try {
        const response = await templateAPI.getByFormat(selectedTemplate);
        setTemplateData(response.data);
      } catch (error) {
        console.error('Failed to load template:', error);
      }
    };

    loadTemplate();
  }, [selectedTemplate, setTemplateData]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
  };

  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      name: 'New Section',
      content: '',
      wordCount: 0,
    };
    addSection(newSection);
    setActiveSection(newSection.id);
  };

  return (
    <aside className="w-80 border-r border-secondary-200 bg-white overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Template Selector */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Journal Format
          </label>
          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ieee">IEEE</option>
            <option value="springer">Springer Nature</option>
            <option value="elsevier">Elsevier</option>
            <option value="acm">ACM</option>
            <option value="apa7">APA 7th Edition</option>
            <option value="mla9">MLA 9th Edition</option>
          </select>
        </div>

        {/* Template Info */}
        {templateData && (
          <div className="bg-secondary-50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-secondary-900">
              {templateData.display_name}
            </h3>
            <div className="space-y-1 text-xs text-secondary-600">
              <p>Citation: {templateData.citation_style}</p>
              <p>
                Font: {templateData.font_family} {templateData.font_size}pt
              </p>
              {templateData.word_limit && (
                <p>Word Limit: {templateData.word_limit.toLocaleString()}</p>
              )}
            </div>
          </div>
        )}

        {/* Sections List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-secondary-900">
              Sections
            </h3>
            <button
              onClick={handleAddSection}
              className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
              title="Add section"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {sections.length === 0 ? (
              <p className="text-sm text-secondary-500 text-center py-8">
                No sections yet. Click + to add a section.
              </p>
            ) : (
              sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors',
                    activeSection === section.id
                      ? 'bg-primary-50 border border-primary-500'
                      : 'border border-transparent hover:bg-secondary-50'
                  )}
                >
                  <FileText className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        activeSection === section.id
                          ? 'text-primary-900'
                          : 'text-secondary-900'
                      )}
                    >
                      {section.name}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {section.wordCount} words
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Template Sections */}
        {templateData && templateData.sections.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 mb-3">
              Recommended Sections
            </h3>
            <div className="space-y-1">
              {templateData.sections.map((sectionName) => (
                <button
                  key={sectionName}
                  onClick={() => {
                    const newSection = {
                      id: `section-${Date.now()}`,
                      name: sectionName,
                      content: '',
                      wordCount: 0,
                    };
                    addSection(newSection);
                    setActiveSection(newSection.id);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded transition-colors"
                >
                  + {sectionName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
