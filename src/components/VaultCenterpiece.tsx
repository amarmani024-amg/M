import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, ShieldCheck, Zap } from 'lucide-react';
import { sound, triggerVibration } from '../utils/audio';

interface VaultCenterpieceProps {
  cipherSolved: boolean;
  memorySolved: boolean;
  logicSolved: boolean;
  vaultUnlocked: boolean;
  onKeyholeTap: () => void;
  onOpenFinale: () => void;
  activeGame: 'cipher' | 'memory' | 'logic' | null;
  onSelectGame: (game: 'cipher' | 'memory' | 'logic') => void;
}

export const VaultCenterpiece: React.FC<VaultCenterpieceProps> = ({
  cipherSolved,
  memorySolved,
  logicSolved,
  vaultUnlocked,
  onKeyholeTap,
  onOpenFinale,
  activeGame,
  onSelectGame,
}) => {
  const [tapEffect, setTapEffect] = useState(false);
  const solvedCount = (cipherSolved ? 1 : 0) + (memorySolved ? 1 : 0) + (logicSolved ? 1 : 0);
  const allSolved = solvedCount === 3;

  const handleCenterKeyhole = () => {
    sound.playClick();
    setTapEffect(true);
    setTimeout(() => setTapEffect(false), 200);
    onKeyholeTap();
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-6 px-4 w-full max-w-md mx-auto">
      {/* Outer ambient glow */}
      <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Main Vault Housing */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full flex items-center justify-center p-3 bg-gradient-to-b from-[#0e2a66] to-[#061230] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
        {/* Outer Rivet Dial Ring */}
        <div className="absolute inset-2 rounded-full border border-cyan-400/20 border-dashed animate-[spin_60s_linear_infinite]" />

        {/* Concentric Gold Accent Ring */}
        <div className="absolute inset-6 rounded-full border border-amber-400/20" />

        {/* 3 Seal Status Nodes positioned symmetrically at 120-degree intervals */}
        {/* Top: Cipher Crack */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectGame('cipher');
          }}
          className={`absolute -top-3 sm:-top-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer ${
            cipherSolved
              ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400 shadow-cyan-500/30'
              : activeGame === 'cipher'
              ? 'bg-amber-950/90 text-amber-300 border border-amber-400 ring-2 ring-amber-400/40'
              : 'bg-slate-900/90 text-slate-400 border border-slate-700 hover:border-slate-500'
          }`}
          title="Seal I: Cipher Crack"
        >
          {cipherSolved ? <Unlock className="w-3.5 h-3.5 text-cyan-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
          <span>Seal I: Cipher</span>
        </button>

        {/* Bottom Left: Memory Matrix */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectGame('memory');
          }}
          className={`absolute -bottom-2 -left-2 sm:-left-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer ${
            memorySolved
              ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400 shadow-cyan-500/30'
              : activeGame === 'memory'
              ? 'bg-amber-950/90 text-amber-300 border border-amber-400 ring-2 ring-amber-400/40'
              : 'bg-slate-900/90 text-slate-400 border border-slate-700 hover:border-slate-500'
          }`}
          title="Seal II: Memory Matrix"
        >
          {memorySolved ? <Unlock className="w-3.5 h-3.5 text-cyan-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
          <span>Seal II: Memory</span>
        </button>

        {/* Bottom Right: Logic Gates */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectGame('logic');
          }}
          className={`absolute -bottom-2 -right-2 sm:-right-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer ${
            logicSolved
              ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400 shadow-cyan-500/30'
              : activeGame === 'logic'
              ? 'bg-amber-950/90 text-amber-300 border border-amber-400 ring-2 ring-amber-400/40'
              : 'bg-slate-900/90 text-slate-400 border border-slate-700 hover:border-slate-500'
          }`}
          title="Seal III: Logic Gates"
        >
          {logicSolved ? <Unlock className="w-3.5 h-3.5 text-cyan-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
          <span>Seal III: Logic</span>
        </button>

        {/* Inner Mechanical Core & Keyhole (Easter Egg 1 Trigger) */}
        <button
          type="button"
          onClick={handleCenterKeyhole}
          aria-label="Vault Center Keyhole"
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center p-2 transition-transform duration-150 cursor-pointer ${
            tapEffect ? 'scale-90' : 'hover:scale-105 active:scale-95'
          } ${
            allSolved
              ? 'bg-gradient-to-br from-cyan-900 via-indigo-950 to-amber-900 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
              : 'bg-gradient-to-b from-[#112a5e] to-[#071333] border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
          }`}
        >
          {allSolved ? (
            <div className="flex flex-col items-center text-center animate-pulse">
              <Zap className="w-8 h-8 text-amber-400 mb-1" />
              <span className="text-[10px] tracking-wider font-bold text-amber-300 uppercase">Unlocked</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <KeyRound className="w-7 h-7 text-cyan-300 mb-1" />
              <div className="w-3 h-5 bg-[#050b1f] border border-cyan-500/40 rounded-full mt-0.5" />
            </div>
          )}
        </button>
      </div>

      {/* Status & Unlocking Call-To-Action */}
      <div className="mt-8 text-center w-full">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-300 mb-2">
          <span>Seals Disengaged:</span>
          <span className="font-mono text-cyan-300 font-bold text-sm">{solvedCount} / 3</span>
        </div>

        {/* Progress Bar */}
        <div className="w-56 h-1.5 mx-auto bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 mb-4">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 transition-all duration-500"
            style={{ width: `${(solvedCount / 3) * 100}%` }}
          />
        </div>

        {allSolved ? (
          <button
            onClick={() => {
              sound.playUnlock();
              triggerVibration([80, 50, 150]);
              onOpenFinale();
            }}
            className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-500 text-slate-950 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-slate-950" />
            <span>OPEN THE VAULT</span>
          </button>
        ) : (
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Select a seal above or choose a game below to begin calibration.
          </p>
        )}
      </div>
    </div>
  );
};
