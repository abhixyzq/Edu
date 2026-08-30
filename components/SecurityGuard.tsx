'use client';

import { useEffect } from 'react';

export function SecurityGuard() {
  useEffect(() => {
    // 1. Prevent Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Prevent Keyboard Copy / Inspect / Print Hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Block F12, PrintScreen, Ctrl+C, Ctrl+X, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+Shift+I/J/C
      if (
        e.key === 'F12' ||
        e.key === 'PrintScreen' ||
        (e.ctrlKey && (key === 'c' || key === 'x' || key === 'u' || key === 's' || key === 'a' || key === 'p')) ||
        (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Prevent Copy / Cut Clipboard events
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCopy);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCopy);
    };
  }, []);

  return null;
}
