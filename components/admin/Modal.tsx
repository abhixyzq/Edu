'use client';

import React, { useEffect } from 'react';
import { playButtonClick } from '@/lib/soundEffects';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }: ModalProps) {
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
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playButtonClick();
          onClose();
        }}
      />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden text-slate-900`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="font-heading text-base sm:text-lg font-black text-slate-900 leading-tight">{title}</h2>
            {subtitle && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={() => {
              playButtonClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ── Shared form helpers ─────────────────────────────────── */
export function FormField({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800">
          {label} {required && <span className="text-rose-500 font-black">*</span>}
        </label>
        {hint && <span className="text-[10px] text-slate-400 font-medium">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export const inputCls =
  'w-full bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#7c3aed] focus:outline-none transition-all shadow-2xs font-medium';

export const selectCls = `${inputCls} cursor-pointer`;

export function PrimaryBtn({
  children,
  loading,
  type = 'button',
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  loading?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={() => {
        playButtonClick();
        if (onClick) onClick();
      }}
      disabled={loading || disabled}
      className="flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
      onClick={() => {
        playButtonClick();
        onClick();
      }}
      className="flex items-center gap-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs"
    >
      {children}
    </button>
  );
}
