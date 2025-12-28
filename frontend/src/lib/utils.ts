import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return d.toLocaleDateString();
}

export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove dangerous elements
  const dangerousElements = div.querySelectorAll('script, iframe, object, embed');
  dangerousElements.forEach((el) => el.remove());
  
  // Remove dangerous attributes
  const allElements = div.querySelectorAll('*');
  allElements.forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('on') || attr.value.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return div.innerHTML;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function countCharacters(text: string): number {
  return text.length;
}

export function calculateProgress(current: number, target: number): number {
  if (!target) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

export function getProgressColor(progress: number): string {
  if (progress < 50) return 'text-red-500';
  if (progress < 80) return 'text-yellow-500';
  return 'text-green-500';
}

export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

export function checkSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const common = words1.filter((word) => words2.includes(word));
  const similarity = (common.length * 2) / (words1.length + words2.length);
  
  return Math.round(similarity * 100);
}

export function highlightProblematicPhrases(text: string): string[] {
  const problematicPatterns = [
    /\b(very|really|basically|actually|literally)\b/gi,
    /\b(thing|stuff|something|anything)\b/gi,
    /\b(good|bad|nice|great)\b(?!\s+(results?|performance|accuracy))/gi,
  ];
  
  const flagged: string[] = [];
  
  problematicPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      flagged.push(...matches);
    }
  });
  
  return [...new Set(flagged)];
}

export function formatCitation(citation: any, style: string): string {
  switch (style.toLowerCase()) {
    case 'ieee':
      return `[${citation.id}] ${citation.author}, "${citation.title}," ${citation.journal}, ${citation.year}.`;
    case 'apa':
      return `${citation.author} (${citation.year}). ${citation.title}. ${citation.journal}.`;
    case 'mla':
      return `${citation.author}. "${citation.title}." ${citation.journal}, ${citation.year}.`;
    default:
      return `${citation.author}, "${citation.title}," ${citation.journal}, ${citation.year}.`;
  }
}

export function exportToMarkdown(data: any): string {
  let markdown = `# ${data.title}\n\n`;
  markdown += `**Authors:** ${data.authors}\n\n`;
  markdown += `**Keywords:** ${data.keywords}\n\n`;
  markdown += `## Abstract\n\n${data.abstract}\n\n`;
  
  data.sections.forEach((section: any) => {
    markdown += `## ${section.title}\n\n${section.content}\n\n`;
  });
  
  return markdown;
}

export function exportToLatex(data: any): string {
  let latex = `\\documentclass{article}\n`;
  latex += `\\usepackage[utf8]{inputenc}\n\n`;
  latex += `\\title{${data.title}}\n`;
  latex += `\\author{${data.authors}}\n`;
  latex += `\\date{}\n\n`;
  latex += `\\begin{document}\n\n`;
  latex += `\\maketitle\n\n`;
  latex += `\\begin{abstract}\n${data.abstract}\n\\end{abstract}\n\n`;
  
  data.sections.forEach((section: any) => {
    latex += `\\section{${section.title}}\n${section.content}\n\n`;
  });
  
  latex += `\\end{document}`;
  
  return latex;
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
