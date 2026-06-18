import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadData, persistData, loadStore, saveStore, hasSeenWelcome, markWelcomeSeen } from '../utils/storage';
import { blankCoin, coinName, uid } from '../utils/helpers';
import { generatePDFReport } from '../utils/pdfReport';
import { exportCSV } from '../utils/helpers';
import { DEFAULT_COLL_TYPES } from '../config/constants';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Core Data ─────────────────────────────────────────────
  const [data, setData]         = useState(loadData);
  const [nav, setNav]           = useState('home');
  const [view, setView]         = useState(null);
  const [firstRun, setFirstRun] = useState(() => !hasSeenWelcome());
  const [toast, setToast]       = useState('');
  const toastRef                = useRef(null);

  // ── Coin Form State ────────────────────────────────────────
  const [form, setForm]         = useState(blankCoin());
  const [editId, setEditId]     = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkCount, setBulkCount] = useState(0);
  const [selId, setSelId]       = useState(null);

  // ── Collectibles State ─────────────────────────────────────
  const [cSelId, setCSelId]     = useState(null);
  const [cForm, setCForm]       = useState({});
  const [cEditId, setCEditId]   = useState(null);
  const [newTypeName, setNTN]   = useState('');
  const [newTypeIcon, setNTI]   = useState('⭐');
  const [newTypeFields, setNTF] = useState('');
  const [expandedType, setExpandedType] = useState(null);

  // ── Filter / Search State ──────────────────────────────────
  const [filterStatus, setFS]   = useState('All');
  const [filterDenom, setFD]    = useState('All');
  const [search, setSearch]     = useState('');
  const [sortBy, setSort]       = useState('dateAdded');

  // ── Reference Screen State ─────────────────────────────────
  const [refSeries, setRefSeries]   = useState('');
  const [refGrade, setRefGrade]     = useState('VF-20');
  const [refKeyDate, setRefKeyDate] = useState('');
  const [statsTab, setSTab]         = useState('overview');

  // ── Lookup State ───────────────────────────────────────────
  const [lookupYear, setLookupYear]   = useState('');
  const [lookupDenom, setLookupDenom] = useState('');
  const [lookupMint, setLookupMint]   = useState('');

  // ── New Module State (localStorage) ───────────────────────
  const [wantList, setWantList]     = useState(() => loadStore('wantlist'));
  const [purchases, setPurchases]   = useState(() => loadStore('purchases'));
  const [auctions, setAuctions]     = useState(() => loadStore('auctions'));
  const [dealerNotes, setDealerNotes] = useState(() => loadStore('dealers'));
  const [trades, setTrades]         = useState(() => loadStore('trades'));
  const [sets, setSets]             = useState(() => loadStore('sets'));

  // ── Persist Core Data ──────────────────────────────────────
  useEffect(() => { persistData(data); }, [data]);

  // ── Persist Module Stores ──────────────────────────────────
  useEffect(() => { saveStore('wantlist',  wantList);    }, [wantList]);
  useEffect(() => { saveStore('purchases', purchases);   }, [purchases]);
  useEffect(() => { saveStore('auctions',  auctions);    }, [auctions]);
  useEffect(() => { saveStore('dealers',   dealerNotes); }, [dealerNotes]);
  useEffect(() => { saveStore('trades',    trades);      }, [trades]);
  useEffect(() => { saveStore('sets',      sets);        }, [sets]);

  // ── Derived Data ───────────────────────────────────────────
  const coins            = data.coins           || [];
  const collectibles     = data.collectibles    || [];
  const collectibleTypes = data.collectibleTypes || DEFAULT_COLL_TYPES;
  const snapshots        = data.snapshots        || [];

  // ── Helpers ────────────────────────────────────────────────
  const patch    = fn => setData(d => ({ ...d, ...fn(d) }));
  const setCoins = fn => patch(d => ({ coins: typeof fn === 'function' ? fn(d.coins) : fn }));
  const f        = (field, val) => setForm(p => ({ ...p, [field]: val }));

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 2600);
  }

  // ── Navigation ─────────────────────────────────────────────
  function navigate(screen) {
    setNav(screen);
    setView(null);
  }

  function dismissWelcome() {
    markWelcomeSeen();
    setFirstRun(false);
  }

  // ── Coin Actions ───────────────────────────────────────────
  function openAddCoin(mode = 'standard', prefill = {}) {
    setForm(blankCoin(mode, prefill));
    setEditId(null);
    setBulkMode(false);
    setBulkCount(0);
    setView('addCoin');
  }

  function openBulkAdd() {
    setForm(blankCoin('standard'));
    setEditId(null);
    setBulkMode(true);
    setBulkCount(0);
    setView('addCoin');
  }

  function openEditCoin(coin) {
    setForm({ ...blankCoin(coin._mode || 'standard'), ...coin });
    setEditId(coin.id);
    setBulkMode(false);
    setView('addCoin');
  }

  function saveCoin() {
    const now = new Date().toISOString();
    if (bulkMode) {
      const count = parseInt(bulkCount) || 1;
      const newCoins = Array.from({ length: count }, () => ({ ...form, id: uid(), dateAdded: now }));
      setCoins(cs => [...newCoins, ...cs]);
      showToast(`Added ${count} coin${count > 1 ? 's' : ''}!`);
      setForm(blankCoin());
      setBulkCount(0);
    } else if (editId) {
      setCoins(cs => cs.map(c => c.id === editId ? { ...form, id: editId, dateAdded: c.dateAdded } : c));
      showToast('Updated!');
      setView(null);
      setEditId(null);
    } else {
      setCoins(cs => [{ ...form, id: uid(), dateAdded: now }, ...cs]);
      showToast('Coin added!');
      setView(null);
    }
  }

  function deleteCoin(id) {
    setCoins(cs => cs.filter(c => c.id !== id));
    setView(null);
    showToast('Removed.');
  }

  // ── Collectible Actions ────────────────────────────────────
  function openAddColl(typeId) {
    setCForm({ typeId, status: 'Own It', photos: [] });
    setCEditId(null);
    setView('addColl');
  }

  function openEditColl(item) {
    setCForm({ ...item });
    setCEditId(item.id);
    setView('addColl');
  }

  function saveColl() {
    if (!cForm.name) return showToast('Name required.');
    if (cEditId) {
      patch(d => ({ collectibles: d.collectibles.map(c => c.id === cEditId ? { ...c, ...cForm, id: cEditId } : c) }));
    } else {
      patch(d => ({ collectibles: [...d.collectibles, { ...cForm, id: uid(), dateAdded: new Date().toISOString() }] }));
    }
    showToast('Saved.');
    setView(null);
    setCEditId(null);
  }

  function deleteColl(id) {
    patch(d => ({ collectibles: d.collectibles.filter(c => c.id !== id) }));
    setView(null);
    showToast('Removed.');
  }

  function saveNewType() {
    if (!newTypeName.trim()) return showToast('Name required.');
    const fields = newTypeFields.split(',').map(s => s.trim()).filter(Boolean);
    patch(d => ({ collectibleTypes: [...d.collectibleTypes, { id: uid(), name: newTypeName.trim(), icon: newTypeIcon || '⭐', fields }] }));
    setNTN(''); setNTI('⭐'); setNTF('');
    showToast('Category created.');
  }

  function deleteType(id) {
    patch(d => ({
      collectibleTypes: d.collectibleTypes.filter(t => t.id !== id),
      collectibles:     d.collectibles.filter(c => c.typeId !== id),
    }));
    showToast('Deleted.');
  }

  // ── Snapshot / Export ──────────────────────────────────────
  function takeSnapshot() {
    const owned = coins.filter(c => c.status === 'Own It');
    const val   = owned.reduce((s, c) => s + (parseFloat(c.estimatedValue) || 0), 0);
    patch(d => ({ snapshots: [...(d.snapshots || []), { date: new Date().toISOString(), value: val, count: owned.length }].slice(-30) }));
    showToast('Snapshot saved!');
  }

  function handleExportCSV() {
    exportCSV(coins);
    showToast('Exported!');
  }

  function handlePDFReport() {
    generatePDFReport(coins);
  }

  // ── Context Value ──────────────────────────────────────────
  const ctx = {
    // Data
    coins, collectibles, collectibleTypes, snapshots,
    // Nav
    nav, setNav: navigate, view, setView,
    firstRun, dismissWelcome,
    // Toast
    toast, showToast,
    // Coin form
    form, setForm, f, editId, bulkMode, bulkCount, setBulkCount,
    selId, setSelId,
    openAddCoin, openBulkAdd, openEditCoin, saveCoin, deleteCoin,
    // Collectibles
    cSelId, setCSelId, cForm, setCForm, cEditId,
    openAddColl, openEditColl, saveColl, deleteColl,
    newTypeName, setNTN, newTypeIcon, setNTI, newTypeFields, setNTF,
    expandedType, setExpandedType,
    saveNewType, deleteType,
    // Filters
    filterStatus, setFS, filterDenom, setFD, search, setSearch, sortBy, setSort,
    // Reference
    refSeries, setRefSeries, refGrade, setRefGrade, refKeyDate, setRefKeyDate,
    statsTab, setSTab,
    // Lookup
    lookupYear, setLookupYear, lookupDenom, setLookupDenom, lookupMint, setLookupMint,
    // Modules
    wantList, setWantList,
    purchases, setPurchases,
    auctions, setAuctions,
    dealerNotes, setDealerNotes,
    trades, setTrades,
    sets, setSets,
    // Actions
    takeSnapshot, handleExportCSV, handlePDFReport,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

// Hook for screens to consume context
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
