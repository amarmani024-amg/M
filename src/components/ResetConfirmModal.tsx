import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';
import { sound, triggerVibration } from '../utils/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#081536] border border-slate-700 rounded-2xl p-6 shadow-2xl text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Reset Vault Progress?
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close modal"
            className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-300 leading-relaxed">
          This will relock all 3 seals, reset achievements and easter eggs, allowing you to experience the calibration from scratch.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              sound.playClick();
              triggerVibration(50);
              onConfirm();
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-md shadow-red-600/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
};
