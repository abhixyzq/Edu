'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ParticleSphere } from './ParticleSphere';
import { playButtonClick } from '@/lib/soundEffects';

type VoiceMode = 'chipmunk' | 'parrot' | 'robot';

export function VoiceCosmos() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastRepeated, setLastRepeated] = useState('');
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('chipmunk');
  const [supported, setSupported] = useState(true);
  const [audioEnergy, setAudioEnergy] = useState(0);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN'; // Works for Hindi & English mixed

    recognition.onstart = () => {
      setIsListening(true);
      startAudioVisualizer();
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      stopAudioVisualizer();
      speakCuteVoice(text);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      stopAudioVisualizer();
    };

    recognition.onend = () => {
      setIsListening(false);
      stopAudioVisualizer();
    };

    recognitionRef.current = recognition;

    return () => {
      stopAudioVisualizer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [voiceMode]);

  // Audio Visualizer to make the sphere react to mic sound
  const startAudioVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateEnergy = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1, avg / 80);
        setAudioEnergy(normalized);
        animFrameRef.current = requestAnimationFrame(updateEnergy);
      };

      updateEnergy();
    } catch (err) {
      console.warn('Microphone stream error:', err);
    }
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioEnergy(0);
  };

  // Cute Voice Repeat
  const speakCuteVoice = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Voice Pitch Settings
    if (voiceMode === 'chipmunk') {
      utterance.pitch = 1.9; // Super cute high pitch
      utterance.rate = 1.25; // Playful and energetic
    } else if (voiceMode === 'parrot') {
      utterance.pitch = 1.65;
      utterance.rate = 1.1;
    } else {
      utterance.pitch = 1.4;
      utterance.rate = 0.95;
    }

    // Attempt to pick a smooth female or child voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.lang.includes('hi') || v.lang.includes('en')) &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setLastRepeated(text);
      // Simulate speaking animation energy
      const interval = setInterval(() => {
        setAudioEnergy(Math.random() * 0.7 + 0.3);
      }, 100);
      (utterance as any)._interval = interval;
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAudioEnergy(0);
      if ((utterance as any)._interval) {
        clearInterval((utterance as any)._interval);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setAudioEnergy(0);
      if ((utterance as any)._interval) {
        clearInterval((utterance as any)._interval);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleListen = () => {
    playButtonClick();

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setAudioEnergy(0);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn('Recognition start failed:', e);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 relative select-none">
      
      {/* ─── Top Header Badge ─── */}
      <div className="w-full max-w-sm flex items-center justify-between z-30 pt-2">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-sm">🦜</span>
          <span className="text-[11px] font-black tracking-wider text-white">
            Cute Mimic Parrot AI
          </span>
        </div>

        {/* Voice Mode Selector */}
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-1 rounded-full text-[10px]">
          <button
            type="button"
            onClick={() => setVoiceMode('chipmunk')}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              voiceMode === 'chipmunk'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🐿️ Cute
          </button>
          <button
            type="button"
            onClick={() => setVoiceMode('parrot')}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              voiceMode === 'parrot'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🦜 Parrot
          </button>
        </div>
      </div>

      {/* ─── Center: Reacting 3D Particle Sphere ─── */}
      <div className="relative flex items-center justify-center my-auto w-full max-w-[340px] sm:max-w-[420px] aspect-square">
        
        {/* Ambient Halo Pulse during speaking/listening */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl pointer-events-none transition-all duration-300 ${
            isListening
              ? 'bg-emerald-500/30 scale-110'
              : isSpeaking
              ? 'bg-pink-500/35 scale-120'
              : 'bg-blue-600/15 scale-90'
          }`}
        />

        {/* 3D Particle Sphere with audio-reactive radius and particle count */}
        <ParticleSphere
          particleCount={4200}
          radius={135 + audioEnergy * 35}
          className="w-full h-full"
        />

        {/* Floating Live Speech Bubble */}
        {(transcript || isListening || isSpeaking) && (
          <div className="absolute top-4 sm:top-6 inset-x-4 flex justify-center z-30 pointer-events-none animate-fade-in">
            <div
              className={`max-w-[280px] sm:max-w-[320px] px-4 py-2.5 rounded-2xl backdrop-blur-xl border text-center shadow-2xl transition-all ${
                isListening
                  ? 'bg-emerald-950/80 border-emerald-400/50 text-emerald-200'
                  : isSpeaking
                  ? 'bg-pink-950/80 border-pink-400/50 text-pink-100'
                  : 'bg-black/70 border-white/20 text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="text-xs">
                  {isListening ? '🎧' : isSpeaking ? '🗣️' : '✨'}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {isListening ? 'Listening...' : isSpeaking ? 'Repeating...' : 'Echo'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold leading-snug break-words">
                &ldquo;{transcript || lastRepeated || 'Speak anything...'}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom: Interactive Controls ─── */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3 z-30 pb-4">
        
        {/* Mic Action Button */}
        {supported ? (
          <button
            type="button"
            onClick={handleToggleListen}
            className={`w-full py-4 px-6 rounded-full font-heading font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all active:scale-95 cursor-pointer border ${
              isListening
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300 animate-pulse'
                : isSpeaking
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-300'
                : 'bg-white hover:bg-slate-100 text-[#09111e] border-white/80'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isListening ? 'mic' : isSpeaking ? 'volume_up' : 'mic_none'}
            </span>
            <span>
              {isListening
                ? 'Listening... (Speak Now!)'
                : isSpeaking
                ? 'Speaking in Cute Voice 🦜'
                : 'Tap & Speak (Echo Mimic)'}
            </span>
          </button>
        ) : (
          <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-500/40 px-4 py-2 rounded-full text-center">
            Speech Recognition is not supported in this browser. Try Chrome / Edge.
          </div>
        )}

        <p className="text-[11px] text-slate-400 text-center font-medium">
          Zero Brain • 100% Cute • Repeats whatever you say! 🦜✨
        </p>
      </div>

    </div>
  );
}
