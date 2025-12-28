'use client';

import { useState } from 'react';
import { X, Upload, FileText, Loader2, Sparkles, Download } from 'lucide-react';
import { usePaperStore } from '@/lib/store';
import { fileAPI } from '@/lib/api';
import { useToastStore } from '@/lib/toast';

export function FileUploadPanel() {
  const { showFileUpload, toggleFileUpload, setFileAnalysis, fileAnalysis } = usePaperStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [humanizing, setHumanizing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [humanizedText, setHumanizedText] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<'docx' | 'pdf' | 'txt'>('docx');

  if (!showFileUpload) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'text/plain',
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(docx|pdf|txt)$/i)) {
      addToast('Please upload a .docx, .pdf, or .txt file', 'error');
      return;
    }

    setUploadedFile(file);
    setLoading(true);

    try {
      const response = await fileAPI.analyze(file);
      setFileAnalysis(response.data);
      addToast('File analyzed successfully!', 'success');
    } catch (error) {
      console.error('Error analyzing file:', error);
      addToast('Failed to analyze file. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleHumanize = async () => {
    if (!fileAnalysis) return;

    setHumanizing(true);
    try {
      // For now, we'll humanize the entire detected text
      // In a real app, you'd extract the full text from the analysis
      const textToHumanize = fileAnalysis.structure_analysis.word_count > 0
        ? "Sample text from your document..." // This would be the actual text
        : "";
      
      const response = await fileAPI.humanize(textToHumanize, 'academic');
      setHumanizedText(response.data.humanized_text);
      addToast(`Text humanized! ${response.data.changes_made.length} improvements made.`, 'success');
    } catch (error) {
      console.error('Error humanizing text:', error);
      addToast('Failed to humanize text. Please check your API configuration.', 'error');
    } finally {
      setHumanizing(false);
    }
  };

  const handleExport = async () => {
    if (!humanizedText && !fileAnalysis) return;

    try {
      const content = humanizedText || "Original content";
      const title = uploadedFile?.name.replace(/\.[^/.]+$/, '') || 'Document';
      
      const response = await fileAPI.exportFile(title, content, exportFormat);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      addToast(`File exported as ${exportFormat.toUpperCase()}!`, 'success');
    } catch (error) {
      console.error('Error exporting file:', error);
      addToast('Failed to export file. Please try again.', 'error');
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

  return (
    <div className="w-96 border-l border-white/20 backdrop-blur-xl bg-white/80 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/20 px-4 py-3 bg-gradient-to-r from-primary-500/10 to-purple-500/10">
        <div className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-secondary-900">File Upload & Analysis</h3>
        </div>
        <button
          onClick={toggleFileUpload}
          className="p-1 hover:bg-white/50 rounded transition-colors"
        >
          <X className="h-5 w-5 text-secondary-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Upload Section */}
        <div className="backdrop-blur-lg bg-gradient-to-br from-white/90 to-primary-50/30 rounded-xl p-4 border border-white/40 shadow-lg">
          <h4 className="text-sm font-semibold text-secondary-900 mb-3">Upload Document</h4>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary-300 rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileText className="h-8 w-8 text-primary-500 mb-2" />
              <p className="mb-2 text-sm text-secondary-700">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-secondary-500">DOCX, PDF, or TXT files</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".docx,.pdf,.txt"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>
          
          {uploadedFile && (
            <div className="mt-3 p-2 bg-white/60 rounded flex items-center space-x-2">
              <FileText className="h-4 w-4 text-primary-600" />
              <span className="text-sm text-secondary-700 flex-1 truncate">{uploadedFile.name}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Analysis Results */}
        {fileAnalysis && (
          <div className="space-y-4">
            {/* AI Detection Score */}
            <div className={`backdrop-blur-lg rounded-xl p-4 border shadow-lg ${getLevelColor(fileAnalysis.ai_detection.level)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm uppercase">{fileAnalysis.ai_detection.level} AI Detection</span>
                <span className="text-2xl font-bold">{fileAnalysis.ai_detection.score}%</span>
              </div>
              <p className="text-xs">Word Count: {fileAnalysis.word_count}</p>
            </div>

            {/* Structure Analysis */}
            <div className="backdrop-blur-lg bg-white/90 rounded-xl p-4 border border-white/40 shadow-lg">
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Structure Analysis</h4>
              <div className="space-y-1 text-xs text-secondary-700">
                <p>Paragraphs: {fileAnalysis.structure_analysis.total_paragraphs}</p>
                <p>Avg Sentence Length: {fileAnalysis.structure_analysis.avg_sentence_length} words</p>
                <p>Detected Sections: {fileAnalysis.structure_analysis.estimated_sections.length}</p>
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="backdrop-blur-lg bg-gradient-to-br from-purple-50/90 to-white/90 rounded-xl p-4 border border-white/40 shadow-lg">
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Suggestions</h4>
              <ul className="space-y-2">
                {fileAnalysis.improvement_suggestions.slice(0, 5).map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-xs text-secondary-700 flex-1">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleHumanize}
                disabled={humanizing}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {humanizing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Humanizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Humanize Entire File</span>
                  </>
                )}
              </button>

              {humanizedText && (
                <div className="backdrop-blur-lg bg-green-50/90 rounded-xl p-4 border border-green-200 shadow-lg">
                  <p className="text-xs text-green-900 mb-2">✓ Text humanized successfully!</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <label className="text-xs text-secondary-700">Export as:</label>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as any)}
                      className="flex-1 px-2 py-1 text-xs border border-secondary-300 rounded bg-white/80"
                    >
                      <option value="docx">Word (.docx)</option>
                      <option value="pdf">PDF (.pdf)</option>
                      <option value="txt">Text (.txt)</option>
                    </select>
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-white/80 text-secondary-700 rounded hover:bg-white transition-all text-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Improved File</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
