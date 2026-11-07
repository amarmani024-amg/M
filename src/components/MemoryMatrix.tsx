import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, FastForward, CheckCircle2, Play, HelpCircle } from 'lucide-react';
import { sound, triggerVibration } from '../utils/audio';

interface MemoryMatrixProps {
  isSolved: boolean;
  onSolve: () => void;
  onConfetti: () => void;
}

const TILE_FREQUENCIES = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.0,  // G4
  440.0,  // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
];

export const MemoryMatrix: React.FC<MemoryMatrixProps> = ({ isSolved, onSolve, onConfetti }) => {
  // 4 rounds: lengths 3, 3, 4, 4
  const ROUND_LENGTHS = [3, 3, 4, 4];
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [misses, setMisses] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Tap "Start Pattern" to watch the sequence.');
  const [showTutorial, setShowTutorial] = useState<boolean>(true);

  const timeoutRefs = useRef<number[]>([]);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((id) => clearTimeout(id));
    timeoutRefs.current = [];
  };

  // Generate sequence for current round
  const generateSequence = (length: number) => {
    const seq: number[] = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * 9));
    }
    return seq;
  };

  const playSequence = (seq: number[]) => {
    clearAllTimeouts();
    setIsPlayingSeq(true);
    setPlayerInput([]);
    setStatusMessage('Memorize the pattern...');

    seq.forEach((tileIdx, step) => {
      const id = window.setTimeout(() => {
        setActiveTile(tileIdx);
        sound.playTile(TILE_FREQUENCIES[tileIdx]);

        const offId = window.setTimeout(() => {
          setActiveTile(null);
          if (step === seq.length - 1) {
            setIsPlayingSeq(false);
            setStatusMessage('Now tap the tiles in order.');
          }
        }, 360);
        timeoutRefs.current.push(offId);
      }, (step + 1) * 550);

      timeoutRefs.current.push(id);
    });
  };

  const startRound = (roundIdx: number) => {
    const seq = generateSequence(ROUND_LENGTHS[roundIdx]);
    setSequence(seq);
    playSequence(seq);
  };

  const handleTileClick = (index: number) => {
    if (isPlayingSeq || isSolved) return;

    sound.playTile(TILE_FREQUENCIES[index]);
    triggerVibration(25);
    setActiveTile(index);
    setTimeout(() => setActiveTile(null), 180);

    const nextInput = [...playerInput, index];
    setPlayerInput(nextInput);

    const step = nextInput.length - 1;
    if (sequence[step] !== index) {
      // Forgiving miss
      setMisses((prev) => prev + 1);
      triggerVibration([50, 50]);
      setStatusMessage('Pattern refreshed — watching again!');
      setIsPlayingSeq(true);
      setTimeout(() => {
        playSequence(sequence);
      }, 700);
      return;
    }

    // Correct so far
    if (nextInput.length === sequence.length) {
      // Completed current round!
      sound.playClick();
      if (currentRound + 1 < ROUND_LENGTHS.length) {
        setStatusMessage(`Round ${currentRound + 1} Cleared! Next pattern...`);
        setCurrentRound((prev) => prev + 1);
        setTimeout(() => {
          startRound(currentRound + 1);
        }, 800);
      } else {
        // All 4 rounds complete!
        handleSuccess();
      }
    }
  };

  const handleSkip = () => {
    sound.playWin();
    handleSuccess();
  };

  const handleSuccess = () => {
    setStatusMessage('Seal II Disengaged!');
    sound.playWin();
    triggerVibration([50, 50, 100]);
    onConfetti();
    setTimeout(() => {
      onSolve();
    }, 400);
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/20 p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono font-semibold tracking-wider text-cyan-400 uppercase">
            Seal II Calibration
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">Memory Matrix</h2>
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
        Watch the glowing sequence, then tap the tiles in order.
      </p>

      {/* Tutorial Hint */}
      {showTutorial && !isSolved && (
        <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed">
          <p className="font-semibold text-cyan-300 mb-0.5">Forgiving Matrix:</p>
          4 quick rounds (3 to 4 tiles). If you miss, the pattern automatically replays so you never lose progress.
        </div>
      )}

      {/* Round & Status Indicators */}
      {!isSolved && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Round:</span>
            <span className="font-mono text-cyan-300 font-bold">{currentRound + 1} / 4</span>
          </div>
          <span className="text-xs text-cyan-200/80 truncate max-w-[200px]">{statusMessage}</span>
        </div>
      )}

      {/* 3x3 Tile Grid */}
      <div className="my-5 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-3 w-64 h-64 sm:w-72 sm:h-72 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isActive = activeTile === idx;
            return (
              <button
                key={idx}
                type="button"
                disabled={isPlayingSeq || isSolved}
                onClick={() => handleTileClick(idx)}
                aria-label={`Matrix tile ${idx + 1}`}
                className={`w-full h-full rounded-xl transition-all duration-150 flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-cyan-400 border-2 border-white shadow-[0_0_25px_rgba(0,240,255,0.8)] scale-95'
                    : isSolved
                    ? 'bg-cyan-950/50 border border-cyan-500/30 text-cyan-400'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 active:scale-95'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/30" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      {!isSolved ? (
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          {sequence.length === 0 ? (
            <button
              onClick={() => startRound(0)}
              className="w-full h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Start Pattern
            </button>
          ) : (
            <>
              <button
                onClick={() => playSequence(sequence)}
                disabled={isPlayingSeq}
                className="w-full sm:flex-1 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Replay Sequence
              </button>

              {/* Skip button after 2 misses */}
              {misses >= 2 && (
                <button
                  onClick={handleSkip}
                  className="w-full sm:w-auto px-4 h-12 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-[0.98] text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FastForward className="w-4 h-4 text-amber-400" />
                  Skip Seal
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        /* Trait Unlocked Card */
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40 shadow-lg text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              Trait Unlocked (2 / 3)
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-1">Quiet Maturity</h3>
          <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
            "At 23, your composure, self-discipline, and steady loyalty speak louder than any boast could."
          </p>
        </div>
      )}
    </div>
  );
};
