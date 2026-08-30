'use client';

import { useEffect } from 'react';

export function SecurityGuard() {
  useEffect(() => {
    // 1. Prevent Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Prevent Keyboard Copy / Inspect / Print / Zoom Hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = (e.key ?? '').toLowerCase();
      
      // Block F12, PrintScreen, Ctrl+C, Ctrl+X, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+P, Ctrl++, Ctrl+-, Ctrl+0
      if (
        e.key === 'F12' ||
        e.key === 'PrintScreen' ||
        (e.ctrlKey && (key === 'c' || key === 'x' || key === 'u' || key === 's' || key === 'a' || key === 'p' || key === '=' || key === '-' || key === '+' || key === '0')) ||
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

    // 4. Prevent Ctrl + Mouse Wheel Zooming
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // 5. Prevent Multi-touch Pinch to Zoom on mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCopy);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCopy);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return null;
}
