import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, RotateCcw, Award, Sparkles, X } from 'lucide-react';
import { sound, triggerVibration } from '../utils/audio';

interface FinaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
}

export const FinaleModal: React.FC<FinaleModalProps> = ({ isOpen, onClose, onReplay }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    sound.playClick();
    triggerVibration(40);
    navigator.clipboard?.writeText('MINDFORGE');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl my-auto bg-gradient-to-b from-[#0b1f4d] via-[#081536] to-[#050b1f] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.25)] text-center">
        {/* Close / Minimize Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          aria-label="Close finale modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vault Core Emitted Emblems */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          The Mind Vault // Fully Unlocked
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Some Minds Are Worth Unlocking
        </h2>

        {/* Golden Box with Secret Code: MINDFORGE */}
        <div className="mt-6 mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border-2 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-semibold block mb-1">
            Certified Master Key
          </span>

          <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 py-1">
            MINDFORGE
          </div>

          <p className="text-xs text-amber-200/80 mt-1 max-w-sm mx-auto">
            A mind forged in analytical precision, unwavering discipline, and quiet humility.
          </p>

          <button
            onClick={handleCopyCode}
            className="mt-4 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Code Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-950" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* The 3 Unlocked Trait Cards */}
        <div className="text-left mb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 block mb-3 text-center">
            Decrypted Architecture Attributes
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Trait 1 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Trait I</span>
                <h4 className="text-sm font-bold text-white mt-0.5 mb-1.5">A Researchful Mind</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You don't just accept problems as they appear; you dig until you understand every layer of the mechanism.
                </p>
              </div>
            </div>

            {/* Trait 2 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Trait II</span>
                <h4 className="text-sm font-bold text-white mt-0.5 mb-1.5">Quiet Maturity</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  At 23, your composure, self-discipline, and steady loyalty speak louder than any boast could.
                </p>
              </div>
            </div>

            {/* Trait 3 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Trait III</span>
                <h4 className="text-sm font-bold text-white mt-0.5 mb-1.5">Calm Under Pressure</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When unexpected bugs or life turbulence strike, your patience and engineering mindset turn chaos into order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sincere Deep Tribute Paragraph */}
        <div className="p-5 rounded-2xl bg-[#071333] border border-cyan-400/20 text-center mb-6">
          <p className="text-sm sm:text-base text-cyan-50 font-medium leading-relaxed italic max-w-lg mx-auto">
            "In an era where brilliance often shouts, your quiet mastery, genuine discipline, and willingness to help anyone without asking for applause are truly extraordinary. Never lose that balance."
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Inspect Vault In Depth
          </button>

          <button
            onClick={() => {
              sound.playClick();
              triggerVibration(50);
              onReplay();
            }}
            className="w-full sm:w-auto px-6 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 border border-slate-700 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            Relock Vault & Replay
          </button>
        </div>
      </div>
    </div>
  );
};
