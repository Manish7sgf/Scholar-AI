import { useEffect, useRef } from 'react';
import { usePaperStore } from './store';
import { formatDate } from './utils';

export function useAutoSave(interval: number = 30000) {
  const { setLastSaved, setIsSaving, saveVersion } = usePaperStore();
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    const save = () => {
      setIsSaving(true);
      // Simulate save delay
      setTimeout(() => {
        saveVersion();
        setLastSaved(formatDate(new Date()));
        setIsSaving(false);
      }, 500);
    };
    
    timeoutRef.current = setInterval(save, interval);
    
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [interval, setLastSaved, setIsSaving, saveVersion]);
}

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const { saveVersion } = usePaperStore.getState();
        saveVersion();
      }
      
      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        const { toggleExport } = usePaperStore.getState();
        toggleExport();
      }
      
      // Ctrl/Cmd + /: Show shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const { toggleKeyboardShortcuts } = usePaperStore.getState();
        toggleKeyboardShortcuts();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

export function useBeforeUnload() {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const { lastSaved } = usePaperStore.getState();
      const timeSinceLastSave = Date.now() - new Date(lastSaved).getTime();
      
      // If more than 1 minute since last save, warn user
      if (timeSinceLastSave > 60000) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
}

export function useWritingSession() {
  const { startSession, endSession, updateSessionWords, sections } = usePaperStore();
  
  useEffect(() => {
    startSession();
    
    return () => {
      endSession();
    };
  }, []);
  
  useEffect(() => {
    const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);
    updateSessionWords(totalWords);
  }, [sections, updateSessionWords]);
}
