import { COPPER_SERIES } from '../config/constants';

// Unique ID generator
export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Money formatter
export const $M = (v) => (v === '' || v == null) ? '—' : '$' + Number(v).toFixed(2);

// Extract numeric grade value
export const gNum = (g) => {
  const m = (g || '').match(/\d+/);
  return m ? parseInt(m[0]) : 0;
};

// Determine metal type from description
export const getMetal = (m = '') => {
  const s = m.toLowerCase();
  if (s.includes('gold'))     return 'Gold';
  if (s.includes('platinum')) return 'Platinum';
  if (s.includes('silver') || s.includes('90%') || s.includes('40%') || s.includes('35%') || s.includes('99.9%'))
    return 'Silver';
  return 'Clad/Base';
};

// Blank coin factory
export const blankCoin = (mode = 'standard', prefill = {}) => ({
  _mode: mode,
  series: '', year: '', mintMark: 'None (Philadelphia)',
  grade: 'VF-20', status: 'Own It', rarity: '—',
  copperColor: '',
  customName: '', customDenom: '', customMetal: '', customYears: '', customCountry: 'US',
  errorType: '', errorSeverity: 'Moderate', errorDesc: '', errorBaseCoin: '', errorPremium: '',
  paidPrice: '', estimatedValue: '', salePrice: '', saleDate: '', purchaseDate: '',
  source: '', storageLocation: '', notes: '',
  eyeAppeal: '—', luster: '—', strike: '—',
  certified: false, certNumber: '', certService: 'PCGS',
  loanedTo: '', loanDate: '',
  photoObverse: null, photoReverse: null,
  ...prefill,
});

// Coin display name
export const coinName = (c) => {
  if (c._mode === 'error')  return c.errorBaseCoin || 'Error Coin';
  if (c._mode === 'custom') return c.customName    || 'Custom Coin';
  return c.series || 'Unknown';
};

// Coin subtitle
export const coinSub = (c, COIN_SERIES) => {
  if (c._mode === 'error')  return c.errorType || 'Unknown Error';
  if (c._mode === 'custom') return [c.customDenom, c.customMetal, c.customCountry !== 'US' ? c.customCountry : ''].filter(Boolean).join(' · ');
  const metal = COIN_SERIES[c.series]?.metal || '';
  return c.copperColor ? `${metal} · ${c.copperColor}` : metal;
};

// Image compression
export async function compressImage(file, maxW = 800) {
  return new Promise((res) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const sc = Math.min(1, maxW / img.width);
      const c  = document.createElement('canvas');
      c.width  = img.width  * sc;
      c.height = img.height * sc;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      res(c.toDataURL('image/jpeg', 0.75));
    };
    img.src = url;
  });
}

// CSV export
export function exportCSV(coins) {
  const headers = ['Name','Year','Mint','Grade','Copper Color','Status','Rarity','Est Value','Paid','Sale Price','Sale Date','Source','Storage','Cert','Cert#','Service','Error Type','Notes'];
  const rows = coins.map(c => [
    coinName(c), c.year, c.mintMark, c.grade, c.copperColor || '',
    c.status, c.rarity, c.estimatedValue, c.paidPrice, c.salePrice,
    c.saleDate, c.source, c.storageLocation,
    c.certified ? 'Yes' : 'No', c.certNumber, c.certService,
    c.errorType, (c.notes || '').replace(/,/g, ';'),
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'CoinVault.csv';
  a.click();
}
