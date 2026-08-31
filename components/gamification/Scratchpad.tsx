'use client';

import React, { useRef, useState, useEffect } from 'react';

interface ScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1e293b');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas resolution and resize listener
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas internal dimensions to match display size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Save initial blank state
      saveState();
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(-10), imgData]);
    } catch {
      // Ignore if canvas isn't ready
    }
  };

  const undo = () => {
    if (history.length <= 1) {
      clearCanvas();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextHistory = [...history];
    nextHistory.pop(); // Remove current state
    const previousState = nextHistory[nextHistory.length - 1];
    setHistory(nextHistory);

    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? 16 : lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/75 backdrop-blur-sm sm:p-4 md:p-6 animate-in fade-in duration-150 select-none">
      <div className="bg-white w-full h-full sm:max-w-4xl sm:h-[90vh] sm:mx-auto sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* ─── Top Header Bar ─── */}
        <div className="shrink-0 flex items-center justify-between px-3 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">draw</span>
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-800 text-xs sm:text-sm leading-tight">
                Rough Sheet
              </h3>
              <p className="text-[10px] text-slate-500 hidden sm:block">Calculations & Formulas</p>
            </div>
          </div>

          {/* Action Utilities (Undo, Clear, Close) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={undo}
              className="p-1.5 sm:p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
              title="Undo last stroke"
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
            </button>

            <button
              type="button"
              onClick={clearCanvas}
              className="p-1.5 sm:p-2 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors active:scale-95 cursor-pointer"
              title="Clear all"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors active:scale-95 cursor-pointer ml-1"
              title="Close rough sheet"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* ─── Drawing Canvas (Grid Math Sheet) ─── */}
        <div className="flex-1 relative bg-white bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:18px_18px] cursor-crosshair touch-none overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
            className="w-full h-full block touch-none"
          />
        </div>

        {/* ─── Bottom Floating Drawing Toolbar (Colors & Tools) ─── */}
        <div className="shrink-0 px-3 py-2 bg-slate-50/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-between gap-2 pb-safe">
          {/* Color Palette */}
          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-2xl border border-slate-200 shadow-2xs">
            {[
              { hex: '#1e293b', label: 'Black' },
              { hex: '#7c3aed', label: 'Purple' },
              { hex: '#2563eb', label: 'Blue' },
              { hex: '#059669', label: 'Green' },
              { hex: '#dc2626', label: 'Red' },
            ].map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => {
                  setColor(c.hex);
                  setIsEraser(false);
                }}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full cursor-pointer transition-transform ${
                  color === c.hex && !isEraser
                    ? 'scale-115 ring-2 ring-offset-2 ring-purple-600 shadow-xs'
                    : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                aria-label={`Select ${c.label}`}
              />
            ))}
          </div>

          {/* Tool Modes: Pen / Eraser & Thickness */}
          <div className="flex items-center gap-1.5">
            {/* Pen Button */}
            <button
              type="button"
              onClick={() => setIsEraser(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                !isEraser
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Pen</span>
            </button>

            {/* Eraser Button */}
            <button
              type="button"
              onClick={() => setIsEraser(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                isEraser
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">ink_eraser</span>
              <span>Eraser</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
