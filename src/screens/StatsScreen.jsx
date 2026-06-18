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

export default function StatsScreen(){
    const MC={Silver:"#a0c8d4",Gold:C.gold,Platinum:"#c0c8e0","Clad/Base":C.textDim};
    const getCoinMetal=c=>{if(c._mode==="custom")return getMetal(c.customMetal||"");return getMetal(COIN_SERIES[c.series]?.metal||"");};
    const metalBDN=["Silver","Gold","Platinum","Clad/Base"].map(m=>({label:m,count:owned.filter(c=>getCoinMetal(c)===m).length,value:owned.filter(c=>getCoinMetal(c)===m).reduce((s,c)=>s+(parseFloat(c.estimatedValue)||0),0)}));
    const copperBDN=COPPER_COLORS.map(cc=>({...cc,count:owned.filter(c=>c.copperColor===cc.id).length,value:owned.filter(c=>c.copperColor===cc.id).reduce((s,c)=>s+(parseFloat(c.estimatedValue)||0),0)}));
    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="Statistics"/>
        <div style={{padding:"10px 14px"}}>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {["overview","metals","copper","errors","history","insurance"].map(t=><button key={t} onClick={()=>setSTab(t)} style={{padding:"7px 10px",fontFamily:"inherit",fontSize:11,cursor:"pointer",borderRadius:8,textTransform:"capitalize",background:statsTab===t?"#2a1f08":"transparent",color:statsTab===t?C.gold:C.textDim,border:statsTab===t?`1px solid ${C.border}`:"1px solid transparent"}}>{t}</button>)}
          </div>
          {statsTab==="overview"&&<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[{l:"Portfolio Value",v:$M(totalEst),a:C.green},{l:"Total Invested",v:$M(totalPaid),a:C.gold},{l:"Unrealized Gain",v:`${totalEst-totalPaid>=0?"+":""}${$M(totalEst-totalPaid)}`,a:totalEst-totalPaid>=0?C.gold:C.red},{l:"Realized P/L",v:`${soldPL>=0?"+":""}${$M(soldPL)}`,a:soldPL>=0?C.green:C.red},{l:"Owned",v:owned.length,a:C.green},{l:"Wanted",v:wanted.length,a:C.blue},{l:"Sold",v:sold.length,a:C.orange},{l:"On Loan",v:loaned.length,a:C.purple},{l:"Error Coins",v:errorCoins.length,a:C.orange},{l:"Collectibles",v:collectibles.length,a:C.goldDim}].map(({l,v,a})=>(<div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}><div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}}>{l}</div><div style={{fontSize:20,color:a,fontWeight:"bold"}}>{v}</div></div>))}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
              <button onClick={takeSnapshot} style={{flex:1,padding:"11px",background:"#2a1f08",color:C.gold,border:`1px solid ${C.border}`,borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>📸 Snapshot</button>
              <button onClick={exportCSV} style={{flex:1,padding:"11px",background:"#0a180a",color:C.green,border:"1px solid #2d4d2d",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>⬇ CSV</button>
            </div>
            <button onClick={()=>generatePDFReport(coins,collectibles,snapshots)} style={{width:"100%",padding:"11px",background:"#0a0a1a",color:"#8a8ada",border:"1px solid #2a2a5a",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>📄 Generate PDF Report</button>
          </>}
          {statsTab==="metals"&&<>{metalBDN.map(({label,count,value})=>(<div key={label} style={card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{fontSize:15,color:MC[label]||C.text}}>{label}</div><div style={{textAlign:"right"}}><div style={{fontSize:15,color:C.gold,fontWeight:"bold"}}>{$M(value)}</div><div style={{fontSize:11,color:C.textFaint}}>{count} coin{count!==1?"s":""}</div></div></div><div style={{height:6,background:C.border2,borderRadius:3,overflow:"hidden"}}><div style={{width:owned.length?`${(count/owned.length)*100}%`:0,height:"100%",background:MC[label]||C.gold,borderRadius:3}}/></div></div>))}</>}
          {statsTab==="copper"&&<>
            <div style={{fontSize:12,color:C.textDim,marginBottom:14}}>Copper color grade breakdown for cent coins. Red (RD) commands the highest premiums.</div>
            {copperBDN.map(cc=>(<div key={cc.id} style={card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div><div style={{fontSize:14,color:"#c87a3a",fontWeight:"bold"}}>{cc.label}</div><div style={{fontSize:11,color:C.textDim,marginTop:2}}>{cc.desc}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:15,color:C.gold,fontWeight:"bold"}}>{$M(cc.value)}</div><div style={{fontSize:11,color:C.textFaint}}>{cc.count} coin{cc.count!==1?"s":""}</div></div></div><div style={{height:6,background:C.border2,borderRadius:3,overflow:"hidden",marginTop:8}}><div style={{width:owned.filter(c=>c.copperColor).length?`${(cc.count/Math.max(1,owned.filter(c=>c.copperColor).length))*100}%`:0,height:"100%",background:"#c87a3a",borderRadius:3}}/></div></div>))}
          </>}
          {statsTab==="errors"&&<>
            {errorCoins.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:C.textFaint}}><div style={{fontSize:36,marginBottom:8}}>⚠️</div><div>No error coins yet.</div><div style={{fontSize:12,marginTop:4}}>Tap ⚠️ Error Coin on the home screen.</div></div>:<>
              <div style={{...card,border:"1px solid #6b3a10"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.textDim}}>Total Error Coins</span><span style={{color:C.orange,fontWeight:"bold"}}>{errorCoins.length}</span></div><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:13,color:C.textDim}}>Est. Total Value</span><span style={{color:C.orange,fontWeight:"bold"}}>{$M(errorCoins.reduce((s,c)=>s+(parseFloat(c.estimatedValue)||0),0))}</span></div></div>
              {errorCoins.sort((a,b)=>(parseFloat(b.estimatedValue)||0)-(parseFloat(a.estimatedValue)||0)).map(c=>(<div key={c.id} onClick={()=>{setSelId(c.id);setView("coinDetail");}} style={{...card,border:"1px solid #6b3a10",cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:13,color:C.orange,fontWeight:"bold"}}>{c.errorBaseCoin||"Error Coin"}</div><div style={{fontSize:12,color:C.textDim,marginTop:2}}>{c.errorType} · {c.errorSeverity}</div></div><div style={{fontSize:14,color:C.orange,fontWeight:"bold"}}>{$M(c.estimatedValue)}</div></div></div>))}
            </>}
          </>}
          {statsTab==="history"&&<>{snapshots.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:C.textFaint}}>No snapshots yet.<br/><span style={{fontSize:12}}>Go to Overview → Save Snapshot.</span></div>:<div style={card}>{[...snapshots].reverse().map((s,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<snapshots.length-1?`1px solid ${C.border2}`:"none"}}><div><div style={{fontSize:13,color:C.text}}>{new Date(s.date).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</div><div style={{fontSize:11,color:C.textFaint}}>{s.count} coins</div></div><div style={{fontSize:16,color:C.gold,fontWeight:"bold"}}>{$M(s.value)}</div></div>))}</div>}</>}
          {statsTab==="insurance"&&<>
            <div style={{...card,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.textDim}}>Total Insurable Value</span><span style={{fontSize:16,color:C.gold,fontWeight:"bold"}}>{$M(totalEst)}</span></div>
            {owned.sort((a,b)=>(parseFloat(b.estimatedValue)||0)-(parseFloat(a.estimatedValue)||0)).map(c=>(<div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 4px",borderBottom:`1px solid ${C.border2}`}}><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,color:c._mode==="error"?C.orange:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{coinName(c)}</div><div style={{fontSize:10,color:C.textDim}}>{c.year} · {c.grade}{c.copperColor?` · ${c.copperColor}`:""}{c.certified?` · ${c.certService} #${c.certNumber}`:""}</div></div><div style={{fontSize:14,color:C.gold,fontWeight:"bold",flexShrink:0}}>{$M(c.estimatedValue)}</div></div>))}
            <button onClick={()=>generatePDFReport(coins,collectibles,snapshots)} style={{marginTop:14,width:"100%",padding:"11px",background:"#0a0a1a",color:"#8a8ada",border:"1px solid #2a2a5a",borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>📄 Generate PDF Report</button>
          </>}
        </div>
      </div>
    );
  }

  // ── BOTTOM NAV (with Error Hunter) ─────────────────────────────────────────
  // ── GLOSSARY SCREEN ────────────────────────────────────────────────────────
