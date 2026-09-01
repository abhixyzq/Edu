'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Modal, PrimaryBtn } from '@/components/admin/Modal';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

interface ParsedQuestion {
  question_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
  explanation?: string;
  isValid: boolean;
  error?: string;
}

interface BulkQuestionImportModalProps {
  testId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  startingNumber?: number;
}

export function BulkQuestionImportModal({
  testId,
  open,
  onClose,
  onSuccess,
  startingNumber = 1,
}: BulkQuestionImportModalProps) {
  const [tab, setTab] = useState<'paste' | 'file'>('paste');
  const [pasteText, setPasteText] = useState('');
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample CSV Template
  function downloadCsvTemplate() {
    playButtonClick();
    const csvHeader = 'Question,Option A,Option B,Option C,Option D,Correct Answer (0-3 or A-D),Explanation\n';
    const sampleRows = [
      '"What is the SI unit of electric flux?","N m^2 C^-1","V m","Both A and B","Weber","2","Electric flux is measured in N m^2 C^-1 or V m."',
      '"Which law is used to find magnetic force on a moving charge?","Gauss Law","Lorentz Force Law","Faraday Law","Ampere Law","1","F = q(E + v x B) is the Lorentz force."',
      '"What is the dimensional formula of capacitance?","[M^-1 L^-2 T^4 A^2]","[M L^2 T^-3 A^-1]","[M^-1 L^2 T^3 A]","[M L T^-2]","0","Capacitance C = Q/V has dimension M^-1 L^-2 T^4 A^2."',
    ].join('\n');

    const blob = new Blob([csvHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sample_questions_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Sample JSON Template
  function downloadJsonTemplate() {
    playButtonClick();
    const sampleJson = [
      {
        question_text: "What is the SI unit of electric flux?",
        option_a: "N m^2 C^-1",
        option_b: "V m",
        option_c: "Both A and B",
        option_d: "Weber",
        correct_answer: 2,
        explanation: "Electric flux is measured in N m^2 C^-1 or V m."
      },
      {
        question_text: "Which law is used to find magnetic force on a moving charge?",
        option_a: "Gauss Law",
        option_b: "Lorentz Force Law",
        option_c: "Faraday Law",
        option_d: "Ampere Law",
        correct_answer: 1,
        explanation: "F = q(E + v x B) is the Lorentz force."
      }
    ];

    const blob = new Blob([JSON.stringify(sampleJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sample_questions_template.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Normalizes correct answer to 0..3
  function parseCorrectAnswer(val: string | number): number {
    if (typeof val === 'number') return Math.min(Math.max(val, 0), 3);
    const s = String(val).trim().toUpperCase();
    if (s === 'A' || s === '0') return 0;
    if (s === 'B' || s === '1') return 1;
    if (s === 'C' || s === '2') return 2;
    if (s === 'D' || s === '3') return 3;
    return 0;
  }

  // Parses raw text (CSV, TSV, or JSON)
  function parseInput(raw: string) {
    setErrorMsg('');
    const trimmed = raw.trim();
    if (!trimmed) {
      setParsed([]);
      return;
    }

    // Try JSON first
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const json = JSON.parse(trimmed);
        if (Array.isArray(json)) {
          const items: ParsedQuestion[] = json.map((q: any, i: number) => {
            const qText = q.question_text || q.question || q.Question || '';
            const opA = q.option_a || q.optionA || q.OptionA || q.a || '';
            const opB = q.option_b || q.optionB || q.OptionB || q.b || '';
            const opC = q.option_c || q.optionC || q.OptionC || q.c || '';
            const opD = q.option_d || q.optionD || q.OptionD || q.d || '';
            const ans = parseCorrectAnswer(q.correct_answer ?? q.correctAnswer ?? q.answer ?? 0);
            const exp = q.explanation || q.solution || '';

            const isValid = Boolean(qText && opA && opB);
            return {
              question_number: startingNumber + i,
              question_text: qText,
              option_a: opA,
              option_b: opB,
              option_c: opC,
              option_d: opD,
              correct_answer: ans,
              explanation: exp,
              isValid,
              error: !isValid ? 'Missing Question Text or Options A/B' : undefined,
            };
          });
          setParsed(items);
          return;
        }
      } catch (err: any) {
        // Fall through to CSV/TSV
      }
    }

    // Try CSV / TSV Parsing
    const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const result: ParsedQuestion[] = [];

    // Check if line 0 is a header row
    const firstLineLower = lines[0].toLowerCase();
    const isHeader = firstLineLower.includes('question') || firstLineLower.includes('option');
    const dataLines = isHeader ? lines.slice(1) : lines;

    dataLines.forEach((line, idx) => {
      // Parse CSV or TSV line respecting quotes
      const delimiter = line.includes('\t') ? '\t' : ',';
      const cols: string[] = [];
      let inQuote = false;
      let buffer = '';

      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === delimiter && !inQuote) {
          cols.push(buffer.trim().replace(/^"|"$/g, ''));
          buffer = '';
        } else {
          buffer += char;
        }
      }
      cols.push(buffer.trim().replace(/^"|"$/g, ''));

      if (cols.length >= 2) {
        const qText = cols[0] || '';
        const opA = cols[1] || '';
        const opB = cols[2] || '';
        const opC = cols[3] || '';
        const opD = cols[4] || '';
        const ans = parseCorrectAnswer(cols[5] || '0');
        const exp = cols[6] || '';

        const isValid = Boolean(qText && opA && opB);
        result.push({
          question_number: startingNumber + idx,
          question_text: qText,
          option_a: opA,
          option_b: opB,
          option_c: opC,
          option_d: opD,
          correct_answer: ans,
          explanation: exp,
          isValid,
          error: !isValid ? 'Question Text or Options missing' : undefined,
        });
      }
    });

    setParsed(result);
  }

  // Handle File Drop / Select
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || '');
      setPasteText(content);
      parseInput(content);
    };
    reader.readAsText(file);
  }

  // Batch Insert to Database
  async function submitBatch() {
    const validQuestions = parsed.filter((q) => q.isValid);
    if (validQuestions.length === 0) {
      setErrorMsg('No valid questions found to upload.');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    const records = validQuestions.map((q, idx) => ({
      test_id: testId,
      question_number: startingNumber + idx,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c || 'None of these',
      option_d: q.option_d || 'All of the above',
      correct_answer: q.correct_answer,
      explanation: q.explanation || '',
    }));

    const { error } = await supabase.from('questions').insert(records);

    if (error) {
      setErrorMsg(error.message);
      setUploading(false);
      return;
    }

    playGemDing();
    setUploading(false);
    onSuccess();
    onClose();
  }

  const validCount = parsed.filter((p) => p.isValid).length;
  const invalidCount = parsed.length - validCount;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bulk Import Questions 📥"
      subtitle="Upload Excel, CSV, or paste multiple MCQs at once into Supabase"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs font-sans">
        
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">
            {errorMsg}
          </div>
        )}

        {/* Template Downloads & Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setTab('paste');
              }}
              className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                tab === 'paste'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Direct Paste / JSON
            </button>

            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setTab('file');
              }}
              className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                tab === 'file'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Upload File (.csv / .json)
            </button>
          </div>

          {/* Template Download Links */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadCsvTemplate}
              className="text-[11px] font-black text-[#7c3aed] hover:underline flex items-center gap-1 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>CSV Template</span>
            </button>

            <button
              type="button"
              onClick={downloadJsonTemplate}
              className="text-[11px] font-black text-emerald-700 hover:underline flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>JSON Template</span>
            </button>
          </div>
        </div>

        {/* Tab 1: File Uploader */}
        {tab === 'file' && (
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-violet-400 transition-colors bg-slate-50/50 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-[36px] text-slate-400 mb-1">
              upload_file
            </span>
            <p className="font-bold text-slate-700">Choose CSV, Excel text, or JSON file</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Supports comma-separated or tab-separated question spreadsheets
            </p>
            <input
              type="file"
              accept=".csv,.json,.txt,.tsv"
              onChange={handleFile}
              className="mt-3 text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-violet-600 file:text-white hover:file:bg-violet-700 cursor-pointer"
            />
          </div>
        )}

        {/* Tab 2: Direct Paste Area */}
        {tab === 'paste' && (
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Paste CSV, TSV rows (from Excel) or JSON Array:
            </label>
            <textarea
              rows={5}
              placeholder={`"Question","Option A","Option B","Option C","Option D","Correct (0-3)","Explanation"\n"What is electric flux?","N m^2/C","V m","Both A and B","Weber","2","Measured in V m."`}
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                parseInput(e.target.value);
              }}
              className="w-full p-3 rounded-2xl border-2 border-slate-200 font-mono text-xs outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsed.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-xs">
                  Detected: {parsed.length} Questions
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                  {validCount} Ready
                </span>
                {invalidCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[10px]">
                    {invalidCount} Invalid
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Mini Preview */}
            <div className="max-h-52 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-white">
              {parsed.map((q, i) => (
                <div key={i} className="p-2.5 flex items-start justify-between gap-3 text-[11px]">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-100 font-black flex items-center justify-center shrink-0 text-slate-600 text-[10px]">
                      Q{q.question_number}
                    </span>
                    <div className="min-w-0">
                      <p className="font-black text-slate-800 truncate">{q.question_text}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        A: {q.option_a} | B: {q.option_b} | C: {q.option_c} | D: {q.option_d}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 font-black text-[10px] border border-violet-200">
                      Ans: {['A', 'B', 'C', 'D'][q.correct_answer] || 'A'}
                    </span>
                    {!q.isValid && (
                      <span className="text-rose-500 font-black text-[10px]">⚠️ Error</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <PrimaryBtn
            onClick={submitBatch}
            loading={uploading}
            disabled={validCount === 0}
          >
            🚀 Upload {validCount} Questions to Database
          </PrimaryBtn>
        </div>

      </div>
    </Modal>
  );
}
