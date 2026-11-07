/**
 * Storage utility for The Mind Vault.
 * Persists puzzle completion states, trait cards, and discovered easter eggs in localStorage.
 */

export interface VaultState {
  cipherSolved: boolean;
  memorySolved: boolean;
  logicSolved: boolean;
  vaultUnlocked: boolean;
  easterEggs: {
    keyhole: boolean;
    hello: boolean;
    cornerRivet: boolean;
  };
  keyholeTapCount: number;
  achievements: string[];
  alertSeen: boolean;
}

const STORAGE_KEY = 'mind_vault_progress_v1';

export const INITIAL_STATE: VaultState = {
  cipherSolved: false,
  memorySolved: false,
  logicSolved: false,
  vaultUnlocked: false,
  easterEggs: {
    keyhole: false,
    hello: false,
    cornerRivet: false,
  },
  keyholeTapCount: 0,
  achievements: [],
  alertSeen: false,
};

export function loadVaultState(): VaultState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
      easterEggs: {
        ...INITIAL_STATE.easterEggs,
        ...(parsed.easterEggs || {}),
      },
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveVaultState(state: VaultState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // LocalStorage quota or access denied
  }
}

export function clearVaultState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
