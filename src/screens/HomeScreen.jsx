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
import { COIN_SERIES } from '../data/coinSeries';

export default function HomeScreen(){
    const recent=[...coins].sort((a,b)=>new Date(b.dateAdded||0)-new Date(a.dateAdded||0)).slice(0,3);
    return(
      <div style={{paddingBottom:80}}>
        <div style={{background:"linear-gradient(160deg,#1e1608 0%,#0e0c09 100%)",padding:"20px 16px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,#c8a84b,#7a5c1e)",border:"2px solid #8a6b2e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚡</div>
            <div><div style={{fontSize:20,fontWeight:"bold",color:C.gold}}>CoinVault</div><div style={{fontSize:10,color:C.goldDim,letterSpacing:".14em",textTransform:"uppercase"}}>US Coin & Collectibles Tracker</div></div>
          </div>
          <div style={{background:"rgba(200,168,75,.07)",border:"1px solid rgba(200,168,75,.2)",borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontSize:11,color:C.textDim,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Portfolio Value</div>
            <div style={{fontSize:32,color:C.goldBright,fontWeight:"bold"}}>{$M(totalEst)}</div>
            <div style={{display:"flex",gap:16,marginTop:6}}>
              <span style={{fontSize:11,color:C.textDim}}>{coins.length} coins total</span>
              <span style={{fontSize:11,color:C.green}}>{owned.length} owned</span>
              {loaned.length>0&&<span style={{fontSize:11,color:C.purple}}>⚠ {loaned.length} on loan</span>}
            </div>
          </div>
        </div>
        <div style={{padding:"14px 16px"}}>
          <div style={{fontSize:10,color:C.textDim,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>Add a Coin</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {[
              {label:"US Coin",icon:"🪙",color:C.gold,border:"#5a4520",bg:"#1e1608",mode:"standard"},
              {label:"Error Coin",icon:"⚠️",color:C.orange,border:"#6b3a10",bg:"#1e0800",mode:"error"},
              {label:"Custom /\nForeign",icon:"🌐",color:C.blue,border:"#1e4a5a",bg:"#081620",mode:"custom"},
            ].map(({label,icon,color,border,bg,mode})=>(
              <button key={mode} onClick={()=>openAddCoin(mode)} style={{padding:"14px 8px",background:bg,border:`1px solid ${border}`,borderRadius:12,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,minHeight:76}}>
                <span style={{fontSize:24}}>{icon}</span>
                <span style={{fontSize:10,color,fontFamily:"inherit",letterSpacing:".04em",textAlign:"center",lineHeight:1.3,whiteSpace:"pre-line"}}>{label}</span>
              </button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            <button onClick={openBulkAdd} style={{padding:"11px",background:"#0a1808",border:"1px solid #2a4a1a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>⚡</span><span style={{fontSize:12,color:C.green,fontFamily:"inherit"}}>Bulk Add Coins</span>
            </button>
            <button onClick={()=>generatePDFReport(coins,collectibles,snapshots)} style={{padding:"11px",background:"#0a0a1a",border:"1px solid #2a2a5a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>📄</span><span style={{fontSize:12,color:"#8a8ada",fontFamily:"inherit"}}>PDF Report</span>
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <button onClick={()=>setNav("collectibles")} style={{padding:"11px",background:"#120820",border:"1px solid #4a2a6a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>🎖️</span><span style={{fontSize:12,color:C.purple,fontFamily:"inherit"}}>Add Collectible</span>
            </button>
            <button onClick={()=>setNav("errors")} style={{padding:"11px",background:"#1e0800",border:"1px solid #6b3a10",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>⚠️</span><span style={{fontSize:12,color:C.orange,fontFamily:"inherit"}}>Error Hunter</span>
            </button>
            <button onClick={()=>setNav("lookup")} style={{padding:"11px",background:"#060e14",border:"1px solid #1e4a5a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>🔍</span><span style={{fontSize:12,color:C.blue,fontFamily:"inherit"}}>Coin Lookup</span>
            </button>
            <button onClick={()=>setNav("glossary")} style={{padding:"11px",background:"#0a1808",border:"1px solid #2a4a1a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>🔤</span><span style={{fontSize:12,color:C.green,fontFamily:"inherit"}}>Glossary</span>
            </button>
            <button onClick={()=>setNav("wantlist")} style={{padding:"11px",background:"#1a1608",border:`1px solid ${C.gold}`,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>⭐</span><span style={{fontSize:12,color:C.gold,fontFamily:"inherit"}}>Want List</span>
            </button>
            <button onClick={()=>setNav("purchases")} style={{padding:"11px",background:"#0a140a",border:"1px solid #2a5a2a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>💰</span><span style={{fontSize:12,color:C.green,fontFamily:"inherit"}}>Purchases</span>
            </button>
            <button onClick={()=>setNav("auctions")} style={{padding:"11px",background:"#14080a",border:"1px solid #5a2a30",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>🔨</span><span style={{fontSize:12,color:"#e07a8a",fontFamily:"inherit"}}>Auction Log</span>
            </button>
            <button onClick={()=>setNav("trades")} style={{padding:"11px",background:"#080a14",border:"1px solid #2a305a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>📤</span><span style={{fontSize:12,color:"#7a8ae0",fontFamily:"inherit"}}>Sales & Trades</span>
            </button>
            <button onClick={()=>setNav("dealers")} style={{padding:"11px",background:"#0a0e18",border:"1px solid #2a3a5a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>🤝</span><span style={{fontSize:12,color:C.blue,fontFamily:"inherit"}}>Dealer Notes</span>
            </button>
            <button onClick={()=>setNav("sets")} style={{padding:"11px",background:"#100a1a",border:"1px solid #4a2a6a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>🏆</span><span style={{fontSize:12,color:C.purple,fontFamily:"inherit"}}>Set Registry</span>
            </button>
            <button onClick={()=>setNav("help")} style={{padding:"11px",background:"#0a1414",border:"1px solid #1a4a4a",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>❓</span><span style={{fontSize:12,color:"#5adada",fontFamily:"inherit"}}>Help & Guide</span>
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:16}}>
            {[{l:"Owned",v:owned.length,a:C.green},{l:"Wanted",v:wanted.length,a:C.blue},{l:"Sold",v:sold.length,a:C.orange},{l:"Errors",v:errorCoins.length,a:C.orange}].map(({l,v,a})=>(
              <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 6px",textAlign:"center"}}>
                <div style={{fontSize:18,color:a,fontWeight:"bold"}}>{v}</div>
                <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:".07em",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          {recent.length>0&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:10,color:C.textDim,letterSpacing:".12em",textTransform:"uppercase"}}>Recent</div>
              <button onClick={()=>setNav("coins")} style={{fontSize:11,color:C.gold,background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit"}}>See all →</button>
            </div>
            {recent.map(coin=><CoinRow key={coin.id} coin={coin} onTap={()=>{setSelId(coin.id);setView("coinDetail");}}/>)}
          </>}
          {coins.length===0&&<div style={{textAlign:"center",padding:"30px 20px",color:C.textFaint}}>
            <div style={{fontSize:48,marginBottom:12}}>🪙</div>
            <div style={{fontSize:15,color:C.textDim,marginBottom:6}}>Your vault is empty</div>
            <div style={{fontSize:12}}>Tap a button above to add your first coin</div>
          </div>}
        </div>
      </div>
    );
  }

  // ── COINS SCREEN ───────────────────────────────────────────────────────────
