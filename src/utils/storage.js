import { STORAGE_KEY, DEFAULT_COLL_TYPES } from '../config/constants';

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    coins: [],
    collectibles: [],
    collectibleTypes: DEFAULT_COLL_TYPES,
    snapshots: [],
  };
}

export function persistData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('CoinVault: Could not save to localStorage', e);
  }
}

// Secondary stores for new feature modules
const stores = {
  wantlist:  'cv_wantlist',
  purchases: 'cv_purchases',
  auctions:  'cv_auctions',
  dealers:   'cv_dealers',
  trades:    'cv_trades',
  sets:      'cv_sets',
};

export function loadStore(key) {
  try {
    return JSON.parse(localStorage.getItem(stores[key]) || '[]');
  } catch { return []; }
}

export function saveStore(key, data) {
  try {
    localStorage.setItem(stores[key], JSON.stringify(data));
  } catch {}
}

export const hasSeenWelcome = () => !!localStorage.getItem('cv_welcomed');
export const markWelcomeSeen = () => localStorage.setItem('cv_welcomed', '1');
