import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Section {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  wordGoal?: number;
}

interface Citation {
  id: string;
  author: string;
  title: string;
  journal: string;
  year: string;
  doi?: string;
  type: 'ieee' | 'apa' | 'mla';
}

interface Version {
  id: string;
  timestamp: string;
  title: string;
  sections: Section[];
}

interface WritingSession {
  date: string;
  wordsWritten: number;
  timeSpent: number;
  aiAssistanceUsed: number;
}

interface PaperStore {
  // Paper content
  title: string;
  authors: string;
  keywords: string;
  abstract: string;
  sections: Section[];
  activeSection: string | null;
  
  // Template
  selectedTemplate: string;
  templateData: any;
  
  // Citations
  citations: Citation[];
  
  // AI features
  detectionResult: any;
  uploadedFile: File | null;
  fileAnalysis: any;
  
  // UI state
  showAIAssistant: boolean;
  showAIDetector: boolean;
  showBrainstorm: boolean;
  showExport: boolean;
  showFileUpload: boolean;
  showModelSettings: boolean;
  showSuggestions: boolean;
  showCitations: boolean;
  showAnalytics: boolean;
  showKeyboardShortcuts: boolean;
  
  // Theme & saving
  darkMode: boolean;
  lastSaved: string;
  isSaving: boolean;
  
  // AI Model settings
  selectedModel: string;
  smartModelSwitching: boolean;
  availableModels: any[];
  modelProvider: string;
  
  // Version history
  versions: Version[];
  
  // Writing analytics
  writingSessions: WritingSession[];
  currentSessionStart: number | null;
  currentSessionWords: number;
  
  // Paper ID for collaboration
  paperId: string;
  
  // Preferences
  dismissedTips: string[];
  
  // Actions
  setTitle: (title: string) => void;
  setAuthors: (authors: string) => void;
  setKeywords: (keywords: string) => void;
  setAbstract: (abstract: string) => void;
  setSections: (sections: Section[]) => void;
  setActiveSection: (id: string | null) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  addSection: (section: Section) => void;
  deleteSection: (id: string) => void;
  
  setSelectedTemplate: (template: string) => void;
  setTemplateData: (data: any) => void;
  
  // Citations
  addCitation: (citation: Citation) => void;
  updateCitation: (id: string, updates: Partial<Citation>) => void;
  deleteCitation: (id: string) => void;
  
  setDetectionResult: (result: any) => void;
  setUploadedFile: (file: File | null) => void;
  setFileAnalysis: (analysis: any) => void;
  
  toggleAIAssistant: () => void;
  toggleAIDetector: () => void;
  toggleBrainstorm: () => void;
  toggleExport: () => void;
  toggleFileUpload: () => void;
  toggleModelSettings: () => void;
  toggleSuggestions: () => void;
  toggleCitations: () => void;
  toggleAnalytics: () => void;
  toggleKeyboardShortcuts: () => void;
  
  toggleDarkMode: () => void;
  setLastSaved: (time: string) => void;
  setIsSaving: (saving: boolean) => void;
  
  setSelectedModel: (model: string) => void;
  setSmartModelSwitching: (enabled: boolean) => void;
  setAvailableModels: (models: any[]) => void;
  setModelProvider: (provider: string) => void;
  
  // Version history
  saveVersion: () => void;
  restoreVersion: (id: string) => void;
  
  // Analytics
  startSession: () => void;
  endSession: () => void;
  updateSessionWords: (words: number) => void;
  
  // Preferences
  dismissTip: (tipId: string) => void;
  resetTips: () => void;
}

export const usePaperStore = create<PaperStore>()(
  persist(
    (set, get) => ({
      // Initial state
      title: '',
      authors: '',
      keywords: '',
      abstract: '',
      sections: [],
      activeSection: null,
      
      selectedTemplate: 'ieee',
      templateData: null,
      
      citations: [],
      
      detectionResult: null,
      uploadedFile: null,
      fileAnalysis: null,
      
      showAIAssistant: false,
      showAIDetector: false,
      showBrainstorm: false,
      showExport: false,
      showFileUpload: false,
      showModelSettings: false,
      showSuggestions: false,
      showCitations: false,
      showAnalytics: false,
      showKeyboardShortcuts: false,
      
      darkMode: false,
      lastSaved: '',
      isSaving: false,
      
      selectedModel: 'mistralai/mistral-7b-instruct:free',
      smartModelSwitching: true,
      availableModels: [],
      modelProvider: 'OpenRouter',
      
      versions: [],
      
      writingSessions: [],
      currentSessionStart: null,
      currentSessionWords: 0,
      
      paperId: `paper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      
      dismissedTips: [],
      
      // Actions
      setTitle: (title) => set({ title }),
      setAuthors: (authors) => set({ authors }),
      setKeywords: (keywords) => set({ keywords }),
      setAbstract: (abstract) => set({ abstract }),
      setSections: (sections) => set({ sections }),
      setActiveSection: (id) => set({ activeSection: id }),
      
      updateSection: (id, updates) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      
      addSection: (section) =>
        set((state) => ({ sections: [...state.sections, section] })),
      
      deleteSection: (id) =>
        set((state) => ({
          sections: state.sections.filter((s) => s.id !== id),
        })),
      
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      setTemplateData: (data) => set({ templateData: data }),
      
      addCitation: (citation) =>
        set((state) => ({ citations: [...state.citations, citation] })),
      
      updateCitation: (id, updates) =>
        set((state) => ({
          citations: state.citations.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      
      deleteCitation: (id) =>
        set((state) => ({
          citations: state.citations.filter((c) => c.id !== id),
        })),
      
      setDetectionResult: (result) => set({ detectionResult: result }),
      setUploadedFile: (file) => set({ uploadedFile: file }),
      setFileAnalysis: (analysis) => set({ fileAnalysis: analysis }),
      
      toggleAIAssistant: () => set((state) => ({ showAIAssistant: !state.showAIAssistant })),
      toggleAIDetector: () => set((state) => ({ showAIDetector: !state.showAIDetector })),
      toggleBrainstorm: () => set((state) => ({ showBrainstorm: !state.showBrainstorm })),
      toggleExport: () => set((state) => ({ showExport: !state.showExport })),
      toggleFileUpload: () => set((state) => ({ showFileUpload: !state.showFileUpload })),
      toggleModelSettings: () => set((state) => ({ showModelSettings: !state.showModelSettings })),
      toggleSuggestions: () => set((state) => ({ showSuggestions: !state.showSuggestions })),
      toggleCitations: () => set((state) => ({ showCitations: !state.showCitations })),
      toggleAnalytics: () => set((state) => ({ showAnalytics: !state.showAnalytics })),
      toggleKeyboardShortcuts: () => set((state) => ({ showKeyboardShortcuts: !state.showKeyboardShortcuts })),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setLastSaved: (time) => set({ lastSaved: time }),
      setIsSaving: (saving) => set({ isSaving: saving }),
      
      setSelectedModel: (model) => set({ selectedModel: model }),
      setSmartModelSwitching: (enabled) => set({ smartModelSwitching: enabled }),
      setAvailableModels: (models) => set({ availableModels: models }),
      setModelProvider: (provider) => set({ modelProvider: provider }),
      
      saveVersion: () => {
        const state = get();
        const version: Version = {
          id: `v-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: state.title,
          sections: state.sections,
        };
        set((state) => ({
          versions: [version, ...state.versions].slice(0, 5),
        }));
      },
      
      restoreVersion: (id) => {
        const state = get();
        const version = state.versions.find((v) => v.id === id);
        if (version) {
          set({
            title: version.title,
            sections: version.sections,
          });
        }
      },
      
      startSession: () => {
        set({
          currentSessionStart: Date.now(),
          currentSessionWords: 0,
        });
      },
      
      endSession: () => {
        const state = get();
        if (state.currentSessionStart) {
          const timeSpent = Date.now() - state.currentSessionStart;
          const session: WritingSession = {
            date: new Date().toISOString().split('T')[0],
            wordsWritten: state.currentSessionWords,
            timeSpent,
            aiAssistanceUsed: 0,
          };
          set((state) => ({
            writingSessions: [session, ...state.writingSessions],
            currentSessionStart: null,
            currentSessionWords: 0,
          }));
        }
      },
      
      updateSessionWords: (words) => {
        set({ currentSessionWords: words });
      },
      
      dismissTip: (tipId) =>
        set((state) => ({
          dismissedTips: [...state.dismissedTips, tipId],
        })),
      
      resetTips: () => set({ dismissedTips: [] }),
    }),
    {
      name: 'scholar-ai-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        title: state.title,
        authors: state.authors,
        keywords: state.keywords,
        abstract: state.abstract,
        sections: state.sections,
        selectedTemplate: state.selectedTemplate,
        citations: state.citations,
        darkMode: state.darkMode,
        lastSaved: state.lastSaved,
        selectedModel: state.selectedModel,
        smartModelSwitching: state.smartModelSwitching,
        versions: state.versions,
        writingSessions: state.writingSessions,
        paperId: state.paperId,
        dismissedTips: state.dismissedTips,
      }),
    }
  )
);
