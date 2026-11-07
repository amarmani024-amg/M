import React, { useState } from 'react';
import { Lightbulb, FastForward, CheckCircle2, Zap, Sparkles, HelpCircle } from 'lucide-react';
import { sound, triggerVibration } from '../utils/audio';

interface LogicGatesLabProps {
  isSolved: boolean;
  onSolve: () => void;
  onConfetti: () => void;
}

interface LevelConfig {
  name: string;
  switchesCount: number;
  labels: string[];
  targetStates: boolean[];
  hint: string;
  evaluator: (states: boolean[]) => boolean;
}

const LEVELS: LevelConfig[] = [
  {
    name: 'Level 1: AND Relay',
    switchesCount: 2,
    labels: ['Switch A', 'Switch B'],
    targetStates: [true, true],
    hint: 'Both Switch A and Switch B must be closed (1) to complete the circuit.',
    evaluator: (s) => s[0] && s[1],
  },
  {
    name: 'Level 2: Dual Branch',
    switchesCount: 2,
    labels: ['Main Bus', 'Ground Shunt'],
    targetStates: [true, false],
    hint: 'Energize Main Bus (1) while keeping Ground Shunt open (0) to prevent power drain.',
    evaluator: (s) => s[0] && !s[1],
  },
  {
    name: 'Level 3: Tri-Core Grid',
    switchesCount: 3,
    labels: ['Primary', 'Inverter', 'Capacitor'],
    targetStates: [true, false, true],
    hint: 'Set Primary to 1, Inverter to 0, and Capacitor to 1 to reach core resonance.',
    evaluator: (s) => s[0] && !s[1] && s[2],
  },
];

export const LogicGatesLab: React.FC<LogicGatesLabProps> = ({ isSolved, onSolve, onConfetti }) => {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [switches, setSwitches] = useState<boolean[]>([false, false, false]);
  const [attempts, setAttempts] = useState<number>(0);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);

  const level = LEVELS[currentLevel];
  const isCircuitPowered = level.evaluator(switches.slice(0, level.switchesCount));

  const toggleSwitch = (index: number) => {
    const newState = !switches[index];
    sound.playSwitch(newState);
    triggerVibration(20);

    const nextSwitches = [...switches];
    nextSwitches[index] = newState;
    setSwitches(nextSwitches);

    // Check if this solves current level
    if (level.evaluator(nextSwitches.slice(0, level.switchesCount))) {
      triggerVibration([40, 60]);
      if (currentLevel + 1 < LEVELS.length) {
        setTimeout(() => {
          setCurrentLevel((prev) => prev + 1);
          setSwitches([false, false, false]);
        }, 700);
      } else {
        // Solved all 3 levels
        handleSuccess();
      }
    } else {
      setAttempts((prev) => prev + 1);
    }
  };

  const handleAutoRoute = () => {
    sound.playClick();
    const nextSwitches = [...switches];
    // Find first switch that differs from target
    for (let i = 0; i < level.switchesCount; i++) {
      if (nextSwitches[i] !== level.targetStates[i]) {
        nextSwitches[i] = level.targetStates[i];
        break;
      }
    }
    setSwitches(nextSwitches);

    if (level.evaluator(nextSwitches.slice(0, level.switchesCount))) {
      triggerVibration([40, 60]);
      if (currentLevel + 1 < LEVELS.length) {
        setTimeout(() => {
          setCurrentLevel((prev) => prev + 1);
          setSwitches([false, false, false]);
        }, 700);
      } else {
        handleSuccess();
      }
    }
  };

  const handleSkip = () => {
    sound.playWin();
    handleSuccess();
  };

  const handleSuccess = () => {
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
            Seal III Calibration
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">Logic Gates Lab</h2>
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
        Toggle the switches to route power and illuminate the core bulb.
      </p>

      {/* Tutorial / Hint */}
      {showTutorial && !isSolved && (
        <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed">
          <p className="font-semibold text-cyan-300 mb-0.5">{level.name}:</p>
          {level.hint}
        </div>
      )}

      {/* Circuit Schematic & Bulb View */}
      <div className="my-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-center">
        {/* Bulb Indicator */}
        <div className="relative mb-6 flex flex-col items-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isCircuitPowered || isSolved
                ? 'bg-amber-400/20 text-amber-300 border-2 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.8)] scale-110'
                : 'bg-slate-900 text-slate-600 border border-slate-800'
            }`}
          >
            <Lightbulb
              className={`w-10 h-10 transition-all ${
                isCircuitPowered || isSolved
                  ? 'fill-amber-400 text-amber-300 stroke-[1.5]'
                  : 'text-slate-600'
              }`}
            />
          </div>
          <span
            className={`mt-2 text-xs font-mono font-bold tracking-wider uppercase transition-colors ${
              isCircuitPowered || isSolved ? 'text-amber-300' : 'text-slate-500'
            }`}
          >
            {isCircuitPowered || isSolved ? 'CORE ILLUMINATED' : 'CIRCUIT OPEN'}
          </span>
        </div>

        {/* Dynamic Electric Traces (SVG) */}
        <svg className="w-full h-8 mb-4 overflow-visible" viewBox="0 0 300 24">
          <path
            d="M 10 12 L 290 12"
            fill="none"
            stroke={isCircuitPowered || isSolved ? '#00f0ff' : '#1e293b'}
            strokeWidth="3"
            strokeDasharray={isCircuitPowered || isSolved ? '6 4' : 'none'}
            className={isCircuitPowered || isSolved ? 'animate-pulse' : ''}
          />
          <circle
            cx="150"
            cy="12"
            r="4"
            fill={isCircuitPowered || isSolved ? '#f59e0b' : '#334155'}
          />
        </svg>

        {/* Switch Toggles */}
        {!isSolved && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
            {level.labels.map((label, idx) => {
              const isOn = switches[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleSwitch(idx)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isOn
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-[11px] font-medium text-slate-300">{label}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isOn ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]' : 'bg-slate-600'
                      }`}
                    />
                    <span className="font-mono text-sm font-bold">{isOn ? '1 (ON)' : '0 (OFF)'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Controls */}
      {!isSolved ? (
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            onClick={handleAutoRoute}
            className="w-full sm:flex-1 h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Auto-Route Switch
          </button>

          {/* Skip button after 2 failed tries or manual toggles */}
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
              Trait Unlocked (3 / 3)
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-1">Calm Under Pressure</h3>
          <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
            "When unexpected bugs or life turbulence strike, your patience and engineering mindset turn chaos into order."
          </p>
        </div>
      )}
    </div>
  );
};
