'use client';

import { useToastStore } from '@/lib/toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
  };

  const styles = {
    success: 'bg-green-50 border-green-500 text-green-900',
    error: 'bg-red-50 border-red-500 text-red-900',
    info: 'bg-blue-50 border-blue-500 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center space-x-3 p-4 rounded-lg border-l-4 shadow-lg min-w-80 animate-slide-in ${
            styles[toast.type]
          }`}
        >
          <div className="flex-shrink-0">{icons[toast.type]}</div>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
