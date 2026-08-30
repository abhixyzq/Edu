'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-[#e8eff1] animate-in zoom-in-95 fade-in duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eff1]">
          <h2 className="font-heading text-lg font-bold text-[#161d1f]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#564338] hover:bg-[#e8eff1] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Shared form helpers ─────────────────────────────────── */
export function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[#161d1f]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputCls = 'w-full border border-[#dde4e6] rounded-xl px-3.5 py-2.5 text-sm text-[#161d1f] placeholder:text-[#897266] focus:outline-none focus:ring-2 focus:ring-[#ff8c42]/40 focus:border-[#ff8c42] transition-all bg-white';
export const selectCls = `${inputCls} cursor-pointer appearance-none`;

export function PrimaryBtn({ children, loading, type = 'button', onClick, disabled }: {
  children: React.ReactNode; loading?: boolean; type?: 'button' | 'submit'; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center justify-center gap-2 bg-[#9b4500] hover:bg-[#ff8c42] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-md"
    >
      {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

export function DangerBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-[#ba1a1a] border border-[#ba1a1a]/40 hover:bg-[#ffdad6] font-bold text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}
