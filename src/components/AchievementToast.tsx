import React from 'react';
import { Award, Sparkles } from 'lucide-react';

export interface ToastData {
  id: string;
  title: string;
  description: string;
  isSecret?: boolean;
}

interface AchievementToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div
      onClick={onDismiss}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1f4d] to-slate-900 border-2 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 cursor-pointer"
    >
      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center shrink-0">
        <Award className="w-5 h-5 text-amber-400" />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {toast.isSecret ? 'Secret Discovered!' : 'Achievement Unlocked!'}
          </span>
        </div>
        <h4 className="text-xs font-bold text-white truncate">{toast.title}</h4>
        <p className="text-[11px] text-slate-300 truncate">{toast.description}</p>
      </div>
    </div>
  );
};
