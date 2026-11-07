import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Send, CornerDownLeft, RotateCcw } from 'lucide-react';
import { sound, triggerVibration } from '../utils/audio';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onHelloEasterEgg: () => void;
}

interface CommandLog {
  sender: 'user' | 'system';
  text: string;
  isCode?: boolean;
}

const INITIAL_LOGS: CommandLog[] = [
  { sender: 'system', text: 'MindOS v23.0.4 initialized [architecture: x86_64_human_intellect]' },
  { sender: 'system', text: 'Target node: 23-year-old engineering powerhouse.' },
  { sender: 'system', text: 'Type a command or tap a shortcut below to run diagnostics.' },
];

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  isOpen,
  onClose,
  onHelloEasterEgg,
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [logs, setLogs] = useState<CommandLog[]>(INITIAL_LOGS);

  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    sound.playClick();
    triggerVibration(25);

    const newLogs: CommandLog[] = [...logs, { sender: 'user', text: cmd }];

    switch (trimmed) {
      case 'help':
        newLogs.push({
          sender: 'system',
          text: 'Available routines:\n- scan: Run full cognitive diagnostics\n- specs: Inspect engineering profile\n- traits: Review unlocked vault traits\n- integrity: Test stress tolerance\n- coffee: Check fuel reserves\n- hello: Transmission handshake\n- easter-eggs: Check discovery status\n- sudo: Request elevated root access\n- clear: Clear terminal buffer\n- reset: Reset terminal to initial state',
        });
        break;

      case 'scan':
        newLogs.push({
          sender: 'system',
          text: '[+] Scanning neural architecture...\nResult: High-order abstraction capacity detected.\nCognitive efficiency: 99.4%\nDefect count: 0 (built to last).',
        });
        break;

      case 'specs':
        newLogs.push({
          sender: 'system',
          text: 'PROFILE: 23-year-old engineering student\nSTATUS: Disciplined. Loyal. Sharp.\nOPERATING SYSTEM: Principled Action v1.0\nCORE VALUE: Elevating others without seeking the spotlight.',
        });
        break;

      case 'traits':
        newLogs.push({
          sender: 'system',
          text: 'VAULT ATTRIBUTES:\n1. A Researchful Mind (Root-cause solver)\n2. Quiet Maturity (Actions over posturing)\n3. Calm Under Pressure (Patience under high load)',
        });
        break;

      case 'integrity':
        newLogs.push({
          sender: 'system',
          text: 'STRESS ANALYSIS:\nTensile strength: Maximum.\nUnder heavy coursework, complex problems, or life challenges: you stay calm, level-headed, and dependable.',
        });
        break;

      case 'coffee':
        newLogs.push({
          sender: 'system',
          text: 'WARNING: Caffeine increases throughput, but your discipline is already hardware-level. Keep hydrated, engineer.',
        });
        break;

      case 'hello':
      case 'hi':
      case 'hey':
        sound.playEasterEgg();
        onHelloEasterEgg();
        newLogs.push({
          sender: 'system',
          text: '>>> HANDSHAKE ACKNOWLEDGED <<<\n"System acknowledge: Hello, engineer. Privilege level: Absolute."\n[Easter Egg Unlocked: Secret Finder - Handshake Protocol!]',
        });
        break;

      case 'easter-eggs':
        newLogs.push({
          sender: 'system',
          text: 'EASTER EGG HINTS:\n1. Tap the vault keyhole 5 times.\n2. Say "hello" in the terminal (Already done if you see this!).\n3. Look for the tiny glowing nano-rivet in the screen corner.',
        });
        break;

      case 'sudo':
      case 'sudo su':
        newLogs.push({
          sender: 'system',
          text: 'ACCESS GRANTED.\nYou already operate with the highest moral and intellectual credentials. No password required.',
        });
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'reset':
      case 'reset terminal':
      case 'reboot':
        setLogs(INITIAL_LOGS);
        setInputVal('');
        return;

      default:
        newLogs.push({
          sender: 'system',
          text: `Command not recognized: "${cmd}". Type "help" or select a shortcut below.`,
        });
        break;
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleResetTerminal = () => {
    sound.playClick();
    triggerVibration(20);
    setLogs(INITIAL_LOGS);
    setInputVal('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const SHORTCUTS = ['scan', 'specs', 'traits', 'coffee', 'hello', 'sudo', 'help', 'clear', 'reset'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full sm:max-w-xl h-[85vh] sm:h-[600px] bg-[#050b1f] border-t sm:border border-cyan-500/30 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#081536] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300">
              MindOS Cyber Terminal
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetTerminal}
              title="Reset Terminal"
              aria-label="Reset Terminal"
              className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              aria-label="Close terminal"
              className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Console Log Area */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2.5 text-slate-300 bg-[#050b1f]">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed whitespace-pre-wrap">
              {log.sender === 'user' ? (
                <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="text-slate-500">engineer@mindvault:~$</span>
                  <span>{log.text}</span>
                </div>
              ) : (
                <div className="text-slate-300 pl-3 border-l-2 border-cyan-500/30 py-0.5">
                  {log.text}
                </div>
              )}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* Quick Tap Command Chips (Mobile-First Ergonomics) */}
        <div className="px-3 py-2 bg-[#081536]/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {SHORTCUTS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => executeCommand(cmd)}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-slate-700/80 hover:border-cyan-500/50 whitespace-nowrap cursor-pointer transition-colors shrink-0"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleFormSubmit} className="p-3 bg-[#081536] border-t border-slate-800 flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 pl-1">{'>'}</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type command (e.g. scan, hello)..."
            className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            aria-label="Send command"
            className="w-10 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 flex items-center justify-center font-bold transition-all cursor-pointer"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
