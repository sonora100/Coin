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

export default function WelcomeScreen({onDone}){
    const [step,setStep]=useState(0);
    const steps=[
      {icon:"🪙",title:"Welcome to CoinVault",body:"The complete US coin collecting companion. Track your collection, hunt for errors, look up values, calculate melt prices, and manage every aspect of your hobby — all in one place.",color:C.gold},
      {icon:"🔍",title:"Look Up Any US Coin",body:"Search any US coin by year, denomination, and mint mark. Get instant facts, key date alerts, grade-by-grade estimated values, and live links to PCGS, NGC, Heritage Auctions, and eBay sold prices.",color:C.blue},
      {icon:"⚠️",title:"Error Coin Hunter",body:"124 specific error coins with step-by-step spotting instructions. Spot guides for 12 error types, a denomination checklist, and authentication tips. Some of these coins are worth thousands.",color:C.orange},
      {icon:"🥈",title:"Live Metal Prices",body:"Real-time gold, silver, and platinum spot prices. Every US silver and gold coin listed with exact weight, purity, and live melt value calculated instantly. Add quantities to track your total melt value.",color:"#a0c8d4"},
      {icon:"⭐",title:"Full Collection Management",body:"Add coins to your vault with photos, grades, and values. Track your want list, log purchases and auctions, record sales and trades, save dealer notes, and track set completion.",color:C.green},
      {icon:"🔤",title:"Glossary & Reference",body:"140+ coin collecting terms decoded — every grade, slab label, auction term, die variety code, and certification abbreviation explained in plain English. Plus a complete quick-links reference to all major pricing sites.",color:C.purple},
    ];
    const s=steps[step];
    return(
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"#0a0c08",zIndex:100,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{fontSize:10,color:C.textFaint,letterSpacing:".2em",textTransform:"uppercase",marginBottom:24}}>CoinVault</div>
        <div style={{fontSize:72,marginBottom:20,lineHeight:1}}>{s.icon}</div>
        <div style={{fontSize:24,color:s.color,fontWeight:"bold",textAlign:"center",marginBottom:14,lineHeight:1.3}}>{s.title}</div>
        <div style={{fontSize:15,color:C.textDim,textAlign:"center",lineHeight:1.7,marginBottom:32,maxWidth:320}}>{s.body}</div>
        <div style={{display:"flex",gap:6,marginBottom:32}}>
          {steps.map((_,i)=><div key={i} style={{width:i===step?24:6,height:6,borderRadius:3,background:i===step?s.color:C.border,transition:"all .3s"}}/>)}
        </div>
        <button onClick={()=>{if(step<steps.length-1)setStep(step+1);else onDone();}}
          style={{width:"100%",maxWidth:280,padding:"16px",background:`linear-gradient(135deg,${s.color},${s.color}88)`,color:"#fff",border:"none",borderRadius:14,cursor:"pointer",fontSize:16,fontWeight:"bold",fontFamily:"inherit",marginBottom:12}}>
          {step<steps.length-1?"Next →":"Get Started"}
        </button>
        {step>0&&<button onClick={()=>setStep(step-1)} style={{background:"transparent",border:"none",color:C.textFaint,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>← Back</button>}
        {step===0&&<button onClick={onDone} style={{background:"transparent",border:"none",color:C.textFaint,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Skip intro</button>}
      </div>
    );
  }

  // ── HELP SCREEN ───────────────────────────────────────────────────────────
