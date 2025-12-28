'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Editor } from '@/components/Editor';
import { AIAssistantPanel } from '@/components/AIAssistantPanel';
import { AIDetectorPanel } from '@/components/AIDetectorPanel';
import { BrainstormPanel } from '@/components/BrainstormPanel';
import { FileUploadPanel } from '@/components/FileUploadPanel';
import { ExportModal } from '@/components/ExportModal';
import { ToastContainer } from '@/components/ToastContainer';
import { usePaperStore } from '@/lib/store';
import { useAutoSave } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export default function Home() {
  const { showAIAssistant, showAIDetector, showBrainstorm, showFileUpload, darkMode } = usePaperStore();
  
  // Enable auto-save
  useAutoSave();
  
  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={cn(
      "h-screen flex flex-col transition-colors",
      darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 to-purple-50"
    )}>
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Editor />
        {showFileUpload && <FileUploadPanel />}
        {showBrainstorm && <BrainstormPanel />}
        {showAIAssistant && <AIAssistantPanel />}
        {showAIDetector && <AIDetectorPanel />}
      </div>

      <ExportModal />
      <ToastContainer />
    </div>
  );
}
