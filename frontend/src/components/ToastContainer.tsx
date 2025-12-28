'use client';

// Toast container is now handled by the toast.ts utility
// This component is kept for backward compatibility but doesn't render anything
// Toasts are displayed via the showToast() function which creates its own container

export function ToastContainer() {
  // The toast system is now functional and doesn't use React state
  // Toasts are created dynamically by the showToast() function in @/lib/toast
  return null;
}
