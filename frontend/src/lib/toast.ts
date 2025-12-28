type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

class ToastManager {
  private toasts: Map<string, HTMLDivElement> = new Map();
  
  show(options: ToastOptions) {
    const { message, type = 'info', duration = 3000 } = options;
    const id = `toast-${Date.now()}`;
    
    const toast = document.createElement('div');
    toast.id = id;
    toast.className = this.getToastClasses(type);
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      max-width: 500px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    this.toasts.set(id, toast);
    
    setTimeout(() => {
      this.hide(id);
    }, duration);
  }
  
  private hide(id: string) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(toast);
        this.toasts.delete(id);
      }, 300);
    }
  }
  
  private getToastClasses(type: ToastType): string {
    const base = 'text-white font-medium';
    switch (type) {
      case 'success':
        return `${base} bg-green-500/90`;
      case 'error':
        return `${base} bg-red-500/90`;
      case 'warning':
        return `${base} bg-yellow-500/90`;
      default:
        return `${base} bg-blue-500/90`;
    }
  }
}

export const toast = new ToastManager();
