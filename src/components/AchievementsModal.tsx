import React from 'react';
import { Award, CheckCircle2, Lock, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedList: string[];
}

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  isSecret?: boolean;
}

const ALL_ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_unlock',
    title: 'First Calibration',
    description: 'Disengaged your first vault seal.',
  },
  {
    id: 'cipher_cracker',
    title: 'Cryptographic Precision',
    description: 'Decoded the shifted engineering cipher.',
  },
  {
    id: 'pattern_master',
    title: 'Cognitive Cache',
    description: 'Cleared all 4 rounds of the Memory Matrix.',
  },
  {
    id: 'logic_master',
    title: 'Circuit Architect',
    description: 'Routed power through all 3 logic gate relays.',
  },
  {
    id: 'vault_breaker',
    title: 'Vault Breaker',
    description: 'Disengaged all 3 seals and opened The Mind Vault.',
  },
  {
    id: 'secret_keyhole',
    title: 'Secret Finder: The Vault Tapper',
    description: 'Tapped the center vault keyhole 5 times.',
    isSecret: true,
  },
  {
    id: 'secret_hello',
    title: 'Secret Finder: Handshake Protocol',
    description: 'Transmitted "hello" to the cyber terminal.',
    isSecret: true,
  },
  {
    id: 'secret_rivet',
    title: 'Secret Finder: Hawk Eye',
    description: 'Discovered the hidden hardware micro-rivet in the screen corner.',
    isSecret: true,
  },
];

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  unlockedList,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#081536] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl text-left max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Achievements</h3>
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

        {/* Progress summary */}
        <div className="py-2.5 flex items-center justify-between text-xs text-slate-400">
          <span>Unlocked:</span>
          <span className="font-mono text-cyan-300 font-bold">
            {unlockedList.length} / {ALL_ACHIEVEMENTS.length}
          </span>
        </div>

        {/* List of achievements */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-2">
          {ALL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedList.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                  isUnlocked
                    ? 'bg-slate-900/90 border-cyan-500/40 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isUnlocked
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4
                      className={`text-xs font-bold truncate ${
                        isUnlocked ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {ach.title}
                    </h4>
                    {ach.isSecret && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Secret
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
