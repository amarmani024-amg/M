import React from 'react';
import { AlertTriangle, ShieldCheck, X, Activity } from 'lucide-react';
import { sound, triggerVibration } from '../utils/audio';

interface SecurityAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityAlertModal: React.FC<SecurityAlertModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#13112c] via-[#081536] to-[#050b1f] border-2 border-red-500/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-left">
        {/* Pulsing Alert Banner */}
        <div className="flex items-center justify-between pb-4 border-b border-red-500/30">
          <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            Security Alert // Code 23-ENG
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Anomaly Header */}
        <div className="mt-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Anomalous Integrity Detected
            </h3>
            <p className="text-xs font-mono text-red-300/80 mt-0.5">
              Subject: You // Sensor ID: CORE_LOGIC_01
            </p>
          </div>
        </div>

        {/* Tech Diagnostic Body */}
        <div className="my-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-2.5 text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Cognitive Calibration:</span>
            <span className="text-cyan-300 font-bold">Brilliant (Top 0.01%)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Discipline Index:</span>
            <span className="text-emerald-400 font-bold">Unshakable</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Ego / Arrogance:</span>
            <span className="text-amber-400 font-bold">0.00% (Not Found)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Loyalty & Helpfulness:</span>
            <span className="text-cyan-300 font-bold">Infinite Depth</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed font-sans">
            <span className="text-amber-300 font-semibold font-mono">ASSESSMENT:</span> No security countermeasures needed. You are simply built with an exceptionally rare combination of intellect and character.
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            triggerVibration(40);
            onClose();
          }}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:brightness-110 active:scale-[0.98] text-slate-950 font-bold text-xs tracking-wider uppercase shadow-md shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-slate-950" />
          Acknowledge Assessment
        </button>
      </div>
    </div>
  );
};
