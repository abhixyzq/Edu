'use client';

import React, { useRef, useState, useEffect } from 'react';

interface ScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ff8c42');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas resolution and resize listener
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas internal dimensions to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Save initial blank state
    saveState();
  }, [isOpen]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), imgData]);
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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? lineWidth * 4 : lineWidth;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-[#dde4e6]">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#f4fafd] border-b border-[#dde4e6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ffdbc9] text-[#9b4500] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">draw</span>
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[#161d1f] text-sm md:text-base">
                Scratchpad / Rough Sheet
              </h3>
              <p className="text-[10px] md:text-xs text-[#564338]">Calculate numericals, formulas, and diagrams</p>
            </div>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* Colors */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#dde4e6]">
              {['#161d1f', '#ff8c42', '#0060ac', '#3a6a00', '#ba1a1a'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setColor(c);
                    setIsEraser(false);
                  }}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                    color === c && !isEraser ? 'scale-110 ring-2 ring-offset-1 ring-[#9b4500]' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>

            {/* Eraser */}
            <button
              type="button"
              onClick={() => setIsEraser(!isEraser)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                isEraser ? 'bg-[#9b4500] text-white' : 'bg-white text-[#564338] border border-[#dde4e6] hover:bg-[#e8eff1]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">ink_eraser</span>
              <span className="hidden sm:inline">Eraser</span>
            </button>

            {/* Undo */}
            <button
              type="button"
              onClick={undo}
              className="p-2 rounded-xl bg-white border border-[#dde4e6] text-[#564338] hover:bg-[#e8eff1] transition-colors"
              title="Undo last stroke"
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
            </button>

            {/* Clear */}
            <button
              type="button"
              onClick={clearCanvas}
              className="p-2 rounded-xl bg-white border border-[#dde4e6] text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
              title="Clear all"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-[#564338] hover:bg-[#e8eff1] transition-colors ml-1"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Canvas Area with Graph/Grid Paper background */}
        <div className="flex-1 relative bg-white bg-[radial-gradient(#dde4e6_1px,transparent_1px)] [background-size:16px_16px] cursor-crosshair touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full block"
          />
        </div>
      </div>
    </div>
  );
};
