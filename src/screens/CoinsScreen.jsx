import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { C } from '../config/colors';
import { GRADES, GRADE_LBL, STATUS_OPT, RARITY, EYE_APP, LUSTER_O, STRIKE_O, STORAGE_L, CERT_SVC, MINT_MARKS, DENOM_ORDER, DENOM_LIST, MINT_LIST, ERROR_TYPES, ERROR_SEV, STATUS_CLR, RARITY_CLR, COPPER_SERIES, COPPER_COLORS, TRENDS, TREND_CONFIG, DEFAULT_COLL_TYPES } from '../config/constants';
import { uid, $M, gNum, getMetal, blankCoin, coinName, coinSub, compressImage, exportCSV } from '../utils/helpers';
import { useVoiceNote } from '../utils/hooks';
import { generatePDFReport } from '../utils/pdfReport';
import PageHeader from '../components/PageHeader';
import CoinRow from '../components/CoinRow';
import Pill from '../components/Pill';
import TrendBadge from '../components/TrendBadge';

export default function CoinsScreen(){
    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="My Coins" right={
          <div style={{display:"flex",gap:5}}>
            <button onClick={()=>openAddCoin("error")} style={{padding:"6px 9px",background:"#1e0800",border:"1px solid #6b3a10",borderRadius:7,color:C.orange,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>⚠️</button>
            <button onClick={()=>openAddCoin("custom")} style={{padding:"6px 9px",background:"#081620",border:"1px solid #1e4a5a",borderRadius:7,color:C.blue,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>🌐</button>
            <button onClick={openBulkAdd} style={{padding:"6px 9px",background:"#0a1808",border:"1px solid #2d4d2d",borderRadius:7,color:C.green,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>⚡Bulk</button>
            <button onClick={()=>openAddCoin("standard")} style={{padding:"6px 11px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",border:"none",borderRadius:7,color:"#fff8e7",cursor:"pointer",fontSize:11,fontWeight:"bold",fontFamily:"inherit"}}>+ Add</button>
          </div>
        }/>
        <div style={{padding:"10px 14px"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search coins, year, error type…" style={{...inp,marginBottom:8}}/>
          <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
            <select value={filterStatus} onChange={e=>setFS(e.target.value)} style={{...inp,width:"auto",flex:1,padding:"8px 10px",fontSize:12}}>{["All",...STATUS_OPT].map(o=><option key={o}>{o==="All"?"All Status":o}</option>)}</select>
            <select value={filterDenom} onChange={e=>setFD(e.target.value)} style={{...inp,width:"auto",flex:1,padding:"8px 10px",fontSize:12}}><option value="All">All Denoms</option>{DENOM_ORDER.map(d=><option key={d} value={d}>{d}</option>)}</select>
            <select value={sortBy} onChange={e=>setSort(e.target.value)} style={{...inp,width:"auto",flex:1,padding:"8px 10px",fontSize:12}}>{[["dateAdded","Recent"],["year","Year"],["grade","Grade"],["value","Value"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
          </div>
          <div style={{fontSize:11,color:C.textDim,marginBottom:8}}>{filtered.length} coin{filtered.length!==1?"s":""} · <span style={{color:C.gold}}>{$M(filtered.reduce((s,c)=>s+(parseFloat(c.estimatedValue)||0),0))}</span></div>
          {filtered.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:C.textFaint}}><div style={{fontSize:36,marginBottom:8}}>🪙</div><div>{coins.length===0?"No coins yet":"No coins match"}</div></div>:filtered.map(coin=><CoinRow key={coin.id} coin={coin} onTap={()=>{setSelId(coin.id);setView("coinDetail");}}/>)}
        </div>
      </div>
    );
  }

  // ── COIN DETAIL ────────────────────────────────────────────────────────────
