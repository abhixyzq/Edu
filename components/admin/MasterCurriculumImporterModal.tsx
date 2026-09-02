'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Modal, PrimaryBtn } from '@/components/admin/Modal';
import { playButtonClick, playGemDing } from '@/lib/soundEffects';

interface MasterRow {
  classLevel: string;
  subjectName: string;
  chapterName: string;
  testTitle: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: number;
  explanation: string;
  isValid: boolean;
  error?: string;
}

interface MasterCurriculumImporterModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MasterCurriculumImporterModal({
  open,
  onClose,
  onSuccess,
}: MasterCurriculumImporterModalProps) {
  const [tab, setTab] = useState<'paste' | 'file'>('paste');
  const [pasteText, setPasteText] = useState('');
  const [parsedRows, setParsedRows] = useState<MasterRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [importStats, setImportStats] = useState<{ subjects: number; tests: number; questions: number } | null>(null);

  // Helper: Download Master Template
  function downloadMasterCsvTemplate() {
    playButtonClick();
    const header = 'Class_Board,Subject,Chapter_Topic,Test_Title,Question_Text,Option_A,Option_B,Option_C,Option_D,Correct_Answer_A_to_D,Explanation\n';
    const sample = [
      '"Class 12","Physics","Electrostatics","Electrostatics Mock Drill 1","What is the SI unit of electric flux?","N m^2 C^-1","V m","Both A and B","Weber","C","Electric flux is measured in N m^2 C^-1 or V m."',
      '"Class 12","Physics","Electrostatics","Electrostatics Mock Drill 1","The electrostatic force between two stationary charges obeys:","Ohm Law","Coulomb Law","Biot-Savart Law","Ampere Law","B","Coulomb law states F = k*q1*q2/r^2."',
      '"Class 12","Chemistry","Solutions","Physical Solutions Quiz 1","Which of the following is a colligative property?","Osmotic Pressure","Viscosity","Surface Tension","Refractive Index","A","Colligative properties depend only on number of solute particles."',
      '"JEE Main","Mathematics","Matrices","Matrices & Determinants Booster","If A is a 3x3 identity matrix, then det(A) is:","1","0","3","-1","A","Determinant of identity matrix is always 1."',
      '"NEET UG","Biology","Genetics","Principles of Inheritance Drill","Mendel conducted hybridization experiments on:","Pisum sativum","Drosophila","Neurospora","Oenothera","A","Garden pea (Pisum sativum) was used by Gregor Mendel."',
    ].join('\n');

    const blob = new Blob([header + sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `master_curriculum_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadMasterJsonTemplate() {
    playButtonClick();
    const sampleJson = [
      {
        class_board: "Class 12",
        subject: "Physics",
        chapter: "Electrostatics",
        test_title: "Electrostatics Mock Drill 1",
        question_text: "What is the SI unit of electric flux?",
        option_a: "N m^2 C^-1",
        option_b: "V m",
        option_c: "Both A and B",
        option_d: "Weber",
        correct_answer: "C",
        explanation: "Electric flux is measured in N m^2 C^-1 or V m."
      },
      {
        class_board: "Class 12",
        subject: "Chemistry",
        chapter: "Solutions",
        test_title: "Physical Solutions Quiz 1",
        question_text: "Which of the following is a colligative property?",
        option_a: "Osmotic Pressure",
        option_b: "Viscosity",
        option_c: "Surface Tension",
        option_d: "Refractive Index",
        correct_answer: "A",
        explanation: "Colligative properties depend on particle numbers."
      }
    ];

    const blob = new Blob([JSON.stringify(sampleJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `master_curriculum_template.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function normalizeAnswer(ans: any): number {
    if (typeof ans === 'number') return Math.min(Math.max(ans, 0), 3);
    const s = String(ans).trim().toUpperCase();
    if (s === 'A' || s === '0') return 0;
    if (s === 'B' || s === '1') return 1;
    if (s === 'C' || s === '2') return 2;
    if (s === 'D' || s === '3') return 3;
    return 0;
  }

  function parseText(raw: string) {
    setErrorMsg('');
    setImportStats(null);
    const trimmed = raw.trim();
    if (!trimmed) {
      setParsedRows([]);
      return;
    }

    // Try JSON format
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const json = JSON.parse(trimmed);
        if (Array.isArray(json)) {
          const rows: MasterRow[] = json.map((r: any) => {
            const classLevel = r.class_board || r.class || r.Class || 'Class 12';
            const subjectName = r.subject || r.Subject || 'Physics';
            const chapterName = r.chapter || r.chapter_topic || r.Topic || 'General Unit';
            const testTitle = r.test_title || r.test || r.Test || `${subjectName} Assessment`;
            const qText = r.question_text || r.question || r.Question || '';
            const opA = r.option_a || r.optionA || r.a || '';
            const opB = r.option_b || r.optionB || r.b || '';
            const opC = r.option_c || r.optionC || r.c || 'None of these';
            const opD = r.option_d || r.optionD || r.d || 'All of the above';
            const ans = normalizeAnswer(r.correct_answer ?? r.answer ?? 0);
            const exp = r.explanation || r.solution || '';

            const isValid = Boolean(qText && opA && opB);
            return {
              classLevel,
              subjectName,
              chapterName,
              testTitle,
              questionText: qText,
              optionA: opA,
              optionB: opB,
              optionC: opC,
              optionD: opD,
              correctAnswer: ans,
              explanation: exp,
              isValid,
              error: !isValid ? 'Missing Question Text or Options' : undefined,
            };
          });

          setParsedRows(rows);
          return;
        }
      } catch {
        // Fallback to CSV/TSV
      }
    }

    // CSV / TSV Parsing
    const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const rows: MasterRow[] = [];

    const isHeader = lines[0].toLowerCase().includes('subject') || lines[0].toLowerCase().includes('question');
    const dataLines = isHeader ? lines.slice(1) : lines;

    dataLines.forEach((line) => {
      const delimiter = line.includes('\t') ? '\t' : ',';
      const cols: string[] = [];
      let inQuote = false;
      let buffer = '';

      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') inQuote = !inQuote;
        else if (c === delimiter && !inQuote) {
          cols.push(buffer.trim().replace(/^"|"$/g, ''));
          buffer = '';
        } else {
          buffer += c;
        }
      }
      cols.push(buffer.trim().replace(/^"|"$/g, ''));

      if (cols.length >= 5) {
        const classLevel = cols[0] || 'Class 12';
        const subjectName = cols[1] || 'Physics';
        const chapterName = cols[2] || 'Unit 1';
        const testTitle = cols[3] || `${subjectName} Test`;
        const qText = cols[4] || '';
        const opA = cols[5] || '';
        const opB = cols[6] || '';
        const opC = cols[7] || 'None of these';
        const opD = cols[8] || 'All of the above';
        const ans = normalizeAnswer(cols[9] || '0');
        const exp = cols[10] || '';

        const isValid = Boolean(qText && opA && opB);
        rows.push({
          classLevel,
          subjectName,
          chapterName,
          testTitle,
          questionText: qText,
          optionA: opA,
          optionB: opB,
          optionC: opC,
          optionD: opD,
          correctAnswer: ans,
          explanation: exp,
          isValid,
          error: !isValid ? 'Question or options missing' : undefined,
        });
      }
    });

    setParsedRows(rows);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || '');
      setPasteText(content);
      parseText(content);
    };
    reader.readAsText(file);
  }

  // Master Ingestion Pipeline into Supabase
  async function executeMasterImport() {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setErrorMsg('No valid curriculum rows detected.');
      return;
    }

    setImporting(true);
    setErrorMsg('');
    setProgressMsg('Analyzing subjects, chapters & tests...');

    try {
      // 1. Group by Subject, Chapter, and Test
      const subjectMap = new Map<string, { id: string; title: string; category: string }>();
      const chapterMap = new Map<string, { subject_id: string; title: string; count: number }>();
      const testMap = new Map<string, { id: string; title: string; subject_id: string; questions: any[] }>();

      validRows.forEach((row) => {
        const subId = row.subjectName.toLowerCase().replace(/[^a-z0-9]/g, '_').trim() || 'general';
        if (!subjectMap.has(subId)) {
          subjectMap.set(subId, {
            id: subId,
            title: row.subjectName.trim(),
            category: row.classLevel.trim() || 'Class 12',
          });
        }

        // Chapter Key
        const chapTitle = row.chapterName.trim() || 'General Unit';
        const chapKey = `${subId}:::${chapTitle.toLowerCase()}`;
        if (!chapterMap.has(chapKey)) {
          chapterMap.set(chapKey, {
            subject_id: subId,
            title: chapTitle,
            count: 0,
          });
        }
        chapterMap.get(chapKey)!.count += 1;

        // Test Unique Key
        const testSlug = `${subId}-${row.testTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').trim()}`;
        if (!testMap.has(testSlug)) {
          testMap.set(testSlug, {
            id: testSlug,
            title: row.testTitle.trim(),
            subject_id: subId,
            questions: [],
          });
        }

        testMap.get(testSlug)!.questions.push({
          question_text: row.questionText,
          option_a: row.optionA,
          option_b: row.optionB,
          option_c: row.optionC,
          option_d: row.optionD,
          correct_answer: row.correctAnswer,
          explanation: row.explanation,
        });
      });

      // 2. Upsert Subjects
      setProgressMsg(`Syncing ${subjectMap.size} subjects to database...`);
      for (const [, sub] of subjectMap) {
        // Count chapters for this subject
        const chapCount = Array.from(chapterMap.values()).filter((c) => c.subject_id === sub.id).length || 1;
        const { error: subErr } = await supabase.from('subjects').upsert({
          id: sub.id,
          title: sub.title,
          category: sub.category,
          icon: 'menu_book',
          color: 'text-[#7c3aed]',
          bg_color: 'bg-[#7c3aed]/10',
          total_chapters: chapCount,
        }, { onConflict: 'id' });
        if (subErr) throw subErr;
      }

      // 3. Upsert Chapters
      setProgressMsg(`Configuring ${chapterMap.size} chapters...`);
      // Fetch existing chapters for numbering
      const { data: existingChapters } = await supabase.from('chapters').select('subject_id, title, chapter_number');
      const existingMap = new Map<string, number>();
      (existingChapters || []).forEach((ec: any) => {
        existingMap.set(`${ec.subject_id}:::${ec.title.toLowerCase()}`, ec.chapter_number);
      });

      let chapterIdx = 1;
      for (const [key, chap] of chapterMap) {
        const existingNum = existingMap.get(key);
        const chapterNum = existingNum ?? chapterIdx++;
        
        // Check if chapter already exists to update or insert
        const { data: foundChap } = await supabase
          .from('chapters')
          .select('id')
          .eq('subject_id', chap.subject_id)
          .ilike('title', chap.title)
          .maybeSingle();

        if (foundChap) {
          await supabase.from('chapters').update({
            question_count: chap.count,
          }).eq('id', foundChap.id);
        } else {
          const { error: chapErr } = await supabase.from('chapters').insert({
            subject_id: chap.subject_id,
            chapter_number: chapterNum,
            title: chap.title,
            question_count: chap.count,
          });
          if (chapErr) throw chapErr;
        }
      }

      // 4. Upsert Tests
      setProgressMsg(`Configuring ${testMap.size} test papers...`);
      let totalQuestionsImported = 0;

      for (const [, test] of testMap) {
        const qCount = test.questions.length;
        const { error: testErr } = await supabase.from('tests').upsert({
          id: test.id,
          title: test.title,
          subject_id: test.subject_id,
          total_questions: qCount,
          total_marks: qCount * 4,
          passing_marks: Math.ceil(qCount * 4 * 0.35),
          duration_minutes: Math.max(qCount * 2, 15),
        }, { onConflict: 'id' });

        if (testErr) throw testErr;

        // 5. Clean prior questions for this test and batch insert new questions
        await supabase.from('questions').delete().eq('test_id', test.id);

        const qPayload = test.questions.map((q, idx) => ({
          test_id: test.id,
          question_number: idx + 1,
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c || 'None of these',
          option_d: q.option_d || 'All of the above',
          correct_answer: q.correct_answer,
          explanation: q.explanation || '',
          admin_notes: 'Master CSV Import',
        }));

        const { error: qErr } = await supabase.from('questions').insert(qPayload);
        if (qErr) throw qErr;

        totalQuestionsImported += qPayload.length;
      }

      playGemDing();
      setImportStats({
        subjects: subjectMap.size,
        tests: testMap.size,
        questions: totalQuestionsImported,
      });
      setProgressMsg('Import Complete! 🎉');
      setImporting(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Import failed. Please check database connection or permissions.');
      setImporting(false);
    }
  }

  // Summary counts
  const distinctSubjects = new Set(parsedRows.map((r) => r.subjectName.toLowerCase())).size;
  const distinctTests = new Set(parsedRows.map((r) => `${r.subjectName}-${r.testTitle}`.toLowerCase())).size;
  const validCount = parsedRows.filter((r) => r.isValid).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="⚡ Master All-in-One CSV Importer"
      subtitle="1-Click upload entire curriculum: Subjects, Tests, and 100+ MCQs in one sheet"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs font-sans">

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">
            {errorMsg}
          </div>
        )}

        {/* Success Banner */}
        {importStats && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
            <h4 className="font-black text-sm flex items-center gap-1.5">
              <span>🎉 Successfully Ingested to Database!</span>
            </h4>
            <p className="text-xs font-medium">
              Created/Updated <span className="font-black">{importStats.subjects} Subjects</span>, <span className="font-black">{importStats.tests} Tests</span>, and <span className="font-black">{importStats.questions} Questions</span> in Supabase.
            </p>
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
              Direct Paste (Excel/Sheets)
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
              Upload CSV File
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadMasterCsvTemplate}
              className="text-[11px] font-black text-[#7c3aed] hover:underline flex items-center gap-1 bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-200 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Master CSV Sheet</span>
            </button>

            <button
              type="button"
              onClick={downloadMasterJsonTemplate}
              className="text-[11px] font-black text-emerald-700 hover:underline flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>JSON Schema</span>
            </button>
          </div>
        </div>

        {/* Tab 1: File Uploader */}
        {tab === 'file' && (
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-violet-400 transition-colors bg-slate-50/50 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-[36px] text-slate-400 mb-1">
              table_chart
            </span>
            <p className="font-bold text-slate-800">Select Master Curriculum CSV / TSV / JSON</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              1-Sheet handles Subjects, Topics, Tests, and all Questions at once
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
              Paste rows copied directly from Excel / Google Sheets or JSON Array:
            </label>
            <textarea
              rows={5}
              placeholder={`"Class 12"\t"Physics"\t"Electrostatics"\t"Electrostatics Mock 1"\t"What is SI unit of flux?"\t"N m^2 C^-1"\t"V m"\t"Both A and B"\t"Weber"\t"C"\t"Explanation note"`}
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                parseText(e.target.value);
              }}
              className="w-full p-3 rounded-2xl border-2 border-slate-200 font-mono text-xs outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        )}

        {/* Auto Summary Breakdown Badges */}
        {parsedRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-xl bg-violet-100 text-[#6d28d9] font-black text-xs border border-violet-200">
                  📚 {distinctSubjects} Subjects
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-blue-100 text-blue-900 font-black text-xs border border-blue-200">
                  📝 {distinctTests} Tests
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-200">
                  ❓ {validCount} MCQs Ready
                </span>
              </div>
            </div>

            {/* Mini Preview Deck */}
            <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-white">
              {parsedRows.map((r, i) => (
                <div key={i} className="p-2.5 flex items-start justify-between gap-2 text-[11px]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-black text-violet-700 bg-violet-50 px-1.5 py-0.2 rounded-md text-[9px] border border-violet-200">
                        {r.classLevel}
                      </span>
                      <span className="font-bold text-slate-700">{r.subjectName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-900 truncate">{r.testTitle}</span>
                    </div>
                    <p className="font-black text-slate-800 truncate">{r.questionText}</p>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-200 shrink-0">
                    Ans: {['A', 'B', 'C', 'D'][r.correctAnswer]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Text */}
        {importing && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <span>{progressMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>

          <PrimaryBtn
            onClick={executeMasterImport}
            loading={importing}
            disabled={validCount === 0 || importing}
          >
            ⚡ Ingest All ({validCount} Questions, {distinctTests} Tests)
          </PrimaryBtn>
        </div>

      </div>
    </Modal>
  );
}
