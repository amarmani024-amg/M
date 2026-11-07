import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Volume2,
  VolumeX,
  Award,
  Terminal as TerminalIcon,
  RotateCcw,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  Sparkles,
  ChevronRight,
  Brain,
  Compass,
  Cpu,
} from 'lucide-react';
import { sound, triggerVibration } from './utils/audio';
import {
  VaultState,
  INITIAL_STATE,
  loadVaultState,
  saveVaultState,
  clearVaultState,
} from './utils/storage';
import { ParticleCanvas } from './components/ParticleCanvas';
import { VaultCenterpiece } from './components/VaultCenterpiece';
import { CipherCrack } from './components/CipherCrack';
import { MemoryMatrix } from './components/MemoryMatrix';
import { LogicGatesLab } from './components/LogicGatesLab';
import { SecurityAlertModal } from './components/SecurityAlertModal';
import { TerminalDrawer } from './components/TerminalDrawer';
import { FinaleModal } from './components/FinaleModal';
import { AchievementsModal } from './components/AchievementsModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { AchievementToast, ToastData } from './components/AchievementToast';

export default function App() {
  const [vaultState, setVaultState] = useState<VaultState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<'cipher' | 'memory' | 'logic' | 'traits'>('cipher');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [confettiTrigger, setConfettiTrigger] = useState<number>(0);

  // Modals
  const [showSecurityAlert, setShowSecurityAlert] = useState<boolean>(false);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [showFinale, setShowFinale] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<ToastData | null>(null);

  // Hidden keyboard typing tracker for Easter Egg 2 ("hello")
  const typedKeysRef = useRef<string>('');

  // Load saved state on mount
  useEffect(() => {
    const saved = loadVaultState();
    setVaultState(saved);
    setIsMuted(sound.getMuted());
  }, []);

  // Save changes to storage
  const updateState = (updater: (prev: VaultState) => VaultState) => {
    setVaultState((prev) => {
      const next = updater(prev);
      saveVaultState(next);
      return next;
    });
  };

  // Toast trigger helper
  const triggerToast = (toast: ToastData) => {
    setActiveToast(toast);
    sound.playEasterEgg();
    triggerVibration([40, 60]);
    setTimeout(() => {
      setActiveToast((current) => (current?.id === toast.id ? null : current));
    }, 4000);
  };

  // Award an achievement if not already earned
  const awardAchievement = (id: string, title: string, description: string, isSecret = false) => {
    updateState((prev) => {
      if (prev.achievements.includes(id)) return prev;
      const nextAchievements = [...prev.achievements, id];
      triggerToast({ id, title, description, isSecret });
      return { ...prev, achievements: nextAchievements };
    });
  };

  // Mute toggle handler
  const handleToggleMute = () => {
    sound.playClick();
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Easter Egg 1: Keyhole tapped 5 times
  const handleKeyholeTap = () => {
    updateState((prev) => {
      const nextCount = prev.keyholeTapCount + 1;
      if (nextCount === 5 && !prev.easterEggs.keyhole) {
        awardAchievement(
          'secret_keyhole',
          'Secret Finder: The Vault Tapper',
          'You tested boundary conditions. A true engineer.',
          true
        );
        return {
          ...prev,
          keyholeTapCount: nextCount,
          easterEggs: { ...prev.easterEggs, keyhole: true },
        };
      }
      return { ...prev, keyholeTapCount: nextCount };
    });
  };

  // Easter Egg 2: Typed "hello"
  const handleHelloEasterEgg = () => {
    updateState((prev) => {
      if (!prev.easterEggs.hello) {
        awardAchievement(
          'secret_hello',
          'Secret Finder: Handshake Protocol',
          'System acknowledge: Hello, engineer. Privilege level: Absolute.',
          true
        );
        return {
          ...prev,
          easterEggs: { ...prev.easterEggs, hello: true },
        };
      }
      return prev;
    });
  };

  // Easter Egg 3: Corner Micro-Rivet Tapped
  const handleCornerRivetTap = () => {
    sound.playClick();
    updateState((prev) => {
      if (!prev.easterEggs.cornerRivet) {
        awardAchievement(
          'secret_rivet',
          'Secret Finder: Hawk Eye',
          'Easter Egg 3/3 found: You notice the subtle details others walk right past.',
          true
        );
        return {
          ...prev,
          easterEggs: { ...prev.easterEggs, cornerRivet: true },
        };
      }
      return prev;
    });
  };

  // Physical keyboard listener for "hello"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      typedKeysRef.current = (typedKeysRef.current + e.key.toLowerCase()).slice(-8);
      if (typedKeysRef.current.includes('hello')) {
        handleHelloEasterEgg();
        typedKeysRef.current = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Completion handlers for the 3 mini-games
  const handleCipherSolve = () => {
    updateState((prev) => {
      if (prev.cipherSolved) return prev;
      awardAchievement('cipher_cracker', 'Cryptographic Precision', 'Decoded the shifted engineering cipher.');
      if (!prev.memorySolved && !prev.logicSolved) {
        awardAchievement('first_unlock', 'First Calibration', 'Disengaged your first vault seal.');
      }
      const allDone = prev.memorySolved && prev.logicSolved;
      if (allDone) {
        awardAchievement('vault_breaker', 'Vault Breaker', 'Disengaged all 3 seals and opened The Mind Vault.');
      }
      return {
        ...prev,
        cipherSolved: true,
        vaultUnlocked: allDone ? true : prev.vaultUnlocked,
      };
    });
  };

  const handleMemorySolve = () => {
    updateState((prev) => {
      if (prev.memorySolved) return prev;
      awardAchievement('pattern_master', 'Cognitive Cache', 'Cleared all 4 rounds of the Memory Matrix.');
      if (!prev.cipherSolved && !prev.logicSolved) {
        awardAchievement('first_unlock', 'First Calibration', 'Disengaged your first vault seal.');
      }
      const allDone = prev.cipherSolved && prev.logicSolved;
      if (allDone) {
        awardAchievement('vault_breaker', 'Vault Breaker', 'Disengaged all 3 seals and opened The Mind Vault.');
      }
      return {
        ...prev,
        memorySolved: true,
        vaultUnlocked: allDone ? true : prev.vaultUnlocked,
      };
    });
  };

  const handleLogicSolve = () => {
    updateState((prev) => {
      if (prev.logicSolved) return prev;
      awardAchievement('logic_master', 'Circuit Architect', 'Routed power through all 3 logic gate relays.');
      if (!prev.cipherSolved && !prev.memorySolved) {
        awardAchievement('first_unlock', 'First Calibration', 'Disengaged your first vault seal.');
      }
      const allDone = prev.cipherSolved && prev.memorySolved;
      if (allDone) {
        awardAchievement('vault_breaker', 'Vault Breaker', 'Disengaged all 3 seals and opened The Mind Vault.');
      }
      return {
        ...prev,
        logicSolved: true,
        vaultUnlocked: allDone ? true : prev.vaultUnlocked,
      };
    });
  };

  // Reset progress completely
  const handleResetConfirm = () => {
    clearVaultState();
    setVaultState(INITIAL_STATE);
    setShowResetConfirm(false);
    setShowFinale(false);
    setActiveTab('cipher');
  };

  const solvedCount =
    (vaultState.cipherSolved ? 1 : 0) +
    (vaultState.memorySolved ? 1 : 0) +
    (vaultState.logicSolved ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#050b1f] text-[#ebf4ff] font-sans relative overflow-x-hidden pb-16 selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Background Particle Canvas */}
      <ParticleCanvas
        isFinale={showFinale || vaultState.vaultUnlocked}
        confettiTrigger={confettiTrigger}
      />

      {/* Easter Egg 3: Subtle Hidden Hardware Micro-Rivet */}
      <button
        type="button"
        onClick={handleCornerRivetTap}
        aria-label="System rivet"
        title="Hardware component"
        className="fixed bottom-3 right-3 z-30 w-3 h-3 rounded-full bg-cyan-400/20 hover:bg-cyan-400/80 hover:shadow-[0_0_12px_#00f0ff] border border-cyan-500/30 transition-all cursor-pointer"
      />

      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#050b1f]/85 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              The Mind Vault
            </span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Fake Security Alert Button */}
            <button
              onClick={() => {
                sound.playClick();
                setShowSecurityAlert(true);
              }}
              title="Integrity Audit Notice"
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-red-500/20"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span className="hidden sm:inline">Audit Alert</span>
            </button>

            {/* Terminal Button */}
            <button
              onClick={() => {
                sound.playClick();
                setShowTerminal(true);
              }}
              title="Open Cyber Terminal"
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Terminal</span>
            </button>

            {/* Achievements Modal Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setShowAchievements(true);
              }}
              title="View Achievements"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-xs">{vaultState.achievements.length}</span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label="Toggle Sound"
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 flex items-center justify-center transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Reset Progress Button */}
            <button
              onClick={() => {
                sound.playClick();
                setShowResetConfirm(true);
              }}
              title="Reset Vault Progress"
              aria-label="Reset Progress"
              className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-700 flex items-center justify-center transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-6 sm:pt-10 flex flex-col items-center">
        {/* Cinematic Intro Headline */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Calibration Protocol v23.0
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            Some minds are worth unlocking.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-lg mx-auto">
            A three-stage challenge built for an engineering mind that values precision, discipline, and quiet depth.
          </p>
        </div>

        {/* Central Glowing Vault Centerpiece */}
        <VaultCenterpiece
          cipherSolved={vaultState.cipherSolved}
          memorySolved={vaultState.memorySolved}
          logicSolved={vaultState.logicSolved}
          vaultUnlocked={vaultState.vaultUnlocked}
          onKeyholeTap={handleKeyholeTap}
          onOpenFinale={() => setShowFinale(true)}
          activeGame={activeTab === 'traits' ? null : activeTab}
          onSelectGame={(game) => setActiveTab(game)}
        />

        {/* Interactive Segmented Controls for Games & Unlocked Traits */}
        <section className="w-full max-w-lg mt-8">
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('cipher');
              }}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'cipher'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {vaultState.cipherSolved ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>I. Cipher</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('memory');
              }}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'memory'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {vaultState.memorySolved ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>II. Memory</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('logic');
              }}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'logic'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {vaultState.logicSolved ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>III. Logic</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('traits');
              }}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'traits'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Traits ({solvedCount})</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="w-full">
            {activeTab === 'cipher' && (
              <CipherCrack
                isSolved={vaultState.cipherSolved}
                onSolve={handleCipherSolve}
                onConfetti={() => setConfettiTrigger((prev) => prev + 1)}
              />
            )}

            {activeTab === 'memory' && (
              <MemoryMatrix
                isSolved={vaultState.memorySolved}
                onSolve={handleMemorySolve}
                onConfetti={() => setConfettiTrigger((prev) => prev + 1)}
              />
            )}

            {activeTab === 'logic' && (
              <LogicGatesLab
                isSolved={vaultState.logicSolved}
                onSolve={handleLogicSolve}
                onConfetti={() => setConfettiTrigger((prev) => prev + 1)}
              />
            )}

            {activeTab === 'traits' && (
              <div className="space-y-4">
                {/* Trait 1 */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    vaultState.cipherSolved
                      ? 'bg-slate-900/90 border-cyan-400/40 shadow-lg text-left'
                      : 'bg-slate-950/50 border-slate-800 text-slate-600 text-left'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      Trait I // Seal I
                    </span>
                    {vaultState.cipherSolved ? (
                      <span className="text-xs font-mono font-bold text-emerald-400">DECRYPTED</span>
                    ) : (
                      <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </div>
                  <h3 className={`text-base font-bold ${vaultState.cipherSolved ? 'text-white' : 'text-slate-500'}`}>
                    A Researchful Mind
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {vaultState.cipherSolved
                      ? `"You don't just accept problems as they appear; you dig until you understand every layer of the mechanism."`
                      : 'Calibrate the Cipher Crack seal to decrypt this attribute.'}
                  </p>
                </div>

                {/* Trait 2 */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    vaultState.memorySolved
                      ? 'bg-slate-900/90 border-cyan-400/40 shadow-lg text-left'
                      : 'bg-slate-950/50 border-slate-800 text-slate-600 text-left'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      Trait II // Seal II
                    </span>
                    {vaultState.memorySolved ? (
                      <span className="text-xs font-mono font-bold text-emerald-400">DECRYPTED</span>
                    ) : (
                      <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </div>
                  <h3 className={`text-base font-bold ${vaultState.memorySolved ? 'text-white' : 'text-slate-500'}`}>
                    Quiet Maturity
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {vaultState.memorySolved
                      ? `"At 23, your composure, self-discipline, and steady loyalty speak louder than any boast could."`
                      : 'Calibrate the Memory Matrix seal to decrypt this attribute.'}
                  </p>
                </div>

                {/* Trait 3 */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    vaultState.logicSolved
                      ? 'bg-slate-900/90 border-cyan-400/40 shadow-lg text-left'
                      : 'bg-slate-950/50 border-slate-800 text-slate-600 text-left'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      Trait III // Seal III
                    </span>
                    {vaultState.logicSolved ? (
                      <span className="text-xs font-mono font-bold text-emerald-400">DECRYPTED</span>
                    ) : (
                      <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </div>
                  <h3 className={`text-base font-bold ${vaultState.logicSolved ? 'text-white' : 'text-slate-500'}`}>
                    Calm Under Pressure
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {vaultState.logicSolved
                      ? `"When unexpected bugs or life turbulence strike, your patience and engineering mindset turn chaos into order."`
                      : 'Calibrate the Logic Gates seal to decrypt this attribute.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Easter Egg Discovery Tracker Strip */}
        <div className="w-full max-w-lg mt-8 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Hidden Easter Eggs:</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-cyan-300 text-xs font-semibold">
            <span>
              {(vaultState.easterEggs.keyhole ? 1 : 0) +
                (vaultState.easterEggs.hello ? 1 : 0) +
                (vaultState.easterEggs.cornerRivet ? 1 : 0)}{' '}
              / 3 Found
            </span>
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      <SecurityAlertModal
        isOpen={showSecurityAlert}
        onClose={() => setShowSecurityAlert(false)}
      />

      <TerminalDrawer
        isOpen={showTerminal}
        onClose={() => setShowTerminal(false)}
        onHelloEasterEgg={handleHelloEasterEgg}
      />

      <FinaleModal
        isOpen={showFinale}
        onClose={() => setShowFinale(false)}
        onReplay={handleResetConfirm}
      />

      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        unlockedList={vaultState.achievements}
      />

      <ResetConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetConfirm}
      />

      <AchievementToast
        toast={activeToast}
        onDismiss={() => setActiveToast(null)}
      />
    </div>
  );
}
