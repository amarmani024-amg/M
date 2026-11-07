import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Sparkles, HelpCircle, FastForward, CheckCircle2 } from 'lucide-react';
import { sound, triggerVibration } from '../utils/audio';

interface CipherCrackProps {
  isSolved: boolean;
  onSolve: () => void;
  onConfetti: () => void;
}

const TARGET_WORD = 'BUILD';
const ENCRYPTED_WORD = 'CVJME'; // Shifted by +1 (C->B, V->U, J->I, M->L, E->D)

export const CipherCrack: React.FC<CipherCrackProps> = ({ isSolved, onSolve, onConfetti }) => {
  // Start with encrypted letters
  const [letters, setLetters] = useState<string[]>(ENCRYPTED_WORD.split(''));
  const [attempts, setAttempts] = useState<number>(0);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [justSolved, setJustSolved] = useState<boolean>(false);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const shiftLetter = (index: number, delta: number) => {
    sound.playClick();
    const current = letters[index];
    const currentIndex = alphabet.indexOf(current);
    const nextIndex = (currentIndex + delta + 26) % 26;
    const newLetters = [...letters];
    newLetters[index] = alphabet[nextIndex];
    setLetters(newLetters);

    // Check if matching target
    if (newLetters.join('') === TARGET_WORD) {
      handleSuccess();
    }
  };

  const handleVerify = () => {
    sound.playClick();
    if (letters.join('') === TARGET_WORD) {
      handleSuccess();
    } else {
      setAttempts((prev) => prev + 1);
      triggerVibration(40);
    }
  };

  const handleAutoHint = () => {
    sound.playClick();
    // Find first letter that doesn't match TARGET_WORD and fix it
    const newLetters = [...letters];
    for (let i = 0; i < TARGET_WORD.length; i++) {
      if (newLetters[i] !== TARGET_WORD[i]) {
        newLetters[i] = TARGET_WORD[i];
        break;
      }
    }
    setLetters(newLetters);
    if (newLetters.join('') === TARGET_WORD) {
      handleSuccess();
    }
  };

  const handleSkip = () => {
    sound.playWin();
    setLetters(TARGET_WORD.split(''));
    handleSuccess();
  };

  const handleSuccess = () => {
    setJustSolved(true);
    sound.playWin();
    triggerVibration([50, 50, 100]);
    onConfetti();
    setTimeout(() => {
      onSolve();
    }, 400);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/20 p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono font-semibold tracking-wider text-cyan-400 uppercase">
            Seal I Calibration
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">Cipher Crack</h2>
        </div>
        {isSolved ? (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Solved
          </span>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              setShowTutorial((prev) => !prev);
            }}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Hint
          </button>
        )}
      </div>

      {/* One-line instruction */}
      <p className="mt-3 text-sm text-cyan-100 font-medium">
        Shift each letter back by 1 in the alphabet to reveal the word.
      </p>

      {/* Tutorial / Hint card */}
      {showTutorial && !isSolved && (
        <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed">
          <p className="font-semibold text-cyan-300 mb-0.5">Visible Hint:</p>
          The cipher is shifted forward by 1: <span className="font-mono text-amber-300">C → B</span>, <span className="font-mono text-amber-300">V → U</span>, and so on. Tap the down arrow to shift backward.
        </div>
      )}

      {/* Cipher Letter Wheels */}
      <div className="my-6">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {letters.map((char, idx) => {
            const isMatch = char === TARGET_WORD[idx];
            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Shift Up Button */}
                {!isSolved && (
                  <button
                    onClick={() => shiftLetter(idx, -1)}
                    disabled={isSolved}
                    aria-label={`Shift letter ${idx + 1} previous`}
                    className="w-11 h-9 sm:w-12 sm:h-10 rounded-t-lg bg-slate-800/80 hover:bg-slate-700 active:bg-cyan-900 border-t border-x border-slate-700 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                )}

                {/* Letter Display Box */}
                <div
                  className={`w-11 h-14 sm:w-14 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-extrabold font-mono transition-all ${
                    isSolved || isMatch
                      ? 'bg-cyan-950/90 text-cyan-300 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'bg-slate-950 text-white border-2 border-slate-700'
                  }`}
                >
                  {char}
                </div>

                {/* Shift Down Button */}
                {!isSolved && (
                  <button
                    onClick={() => shiftLetter(idx, 1)}
                    disabled={isSolved}
                    aria-label={`Shift letter ${idx + 1} next`}
                    className="w-11 h-9 sm:w-12 sm:h-10 rounded-b-lg bg-slate-800/80 hover:bg-slate-700 active:bg-cyan-900 border-b border-x border-slate-700 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                )}

                {/* Original cipher indicator */}
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  was {ENCRYPTED_WORD[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Controls */}
      {!isSolved ? (
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            onClick={handleVerify}
            className="w-full sm:flex-1 h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Check Word
          </button>

          <button
            onClick={handleAutoHint}
            className="w-full sm:w-auto px-4 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Auto-Hint
          </button>

          {/* Skip button after 2 failed tries or anytime requested */}
          {attempts >= 2 && (
            <button
              onClick={handleSkip}
              className="w-full sm:w-auto px-4 h-12 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-[0.98] text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FastForward className="w-4 h-4 text-amber-400" />
              Skip Seal
            </button>
          )}
        </div>
      ) : (
        /* Trait Unlocked Card */
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40 shadow-lg text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              Trait Unlocked (1 / 3)
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-1">A Researchful Mind</h3>
          <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
            "You don't just accept problems as they appear; you dig until you understand every layer of the mechanism."
          </p>
        </div>
      )}
    </div>
  );
};
