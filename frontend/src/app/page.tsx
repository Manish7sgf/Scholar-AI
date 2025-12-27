'use client';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Editor } from '@/components/Editor';
import { AIAssistantPanel } from '@/components/AIAssistantPanel';
import { AIDetectorPanel } from '@/components/AIDetectorPanel';
import { BrainstormPanel } from '@/components/BrainstormPanel';
import { ExportModal } from '@/components/ExportModal';
import { usePaperStore } from '@/lib/store';

export default function Home() {
  const { showAIAssistant, showAIDetector, showBrainstorm } = usePaperStore();

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Editor />
        {showBrainstorm && <BrainstormPanel />}
        {showAIAssistant && <AIAssistantPanel />}
        {showAIDetector && <AIDetectorPanel />}
      </div>

      <ExportModal />
    </div>
  );
}
