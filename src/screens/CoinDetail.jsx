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

export default function CoinDetail(){
    const coin=selCoin;if(!coin)return null;
    const isErr=coin._mode==="error",isCus=coin._mode==="custom";
    const profit=coin.status==="Sold It"?(parseFloat(coin.salePrice)||0)-(parseFloat(coin.paidPrice)||0):null;
    const Field=({label,value,accent,wide})=>value&&value!=="—"?(<div style={{background:C.surface2,borderRadius:8,padding:"10px 12px",gridColumn:wide?"1 / -1":"auto"}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>{label}</div><div style={{fontSize:14,color:accent||C.text}}>{value}</div></div>):null;
    const refData=coin._mode==="standard"?COIN_REF[coin.series]:null;
    const gi=refData?GRADE_KEYS.indexOf(coin.grade.replace(/\s*\(.*\)/,"").trim()):-1;
    const tv=gi>=0&&refData?refData.typical[gi]:null;
    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="Coin Detail" back onBack={()=>setView(null)} right={<button onClick={()=>openEditCoin(coin)} style={{padding:"6px 14px",background:"#2a1f08",color:C.gold,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Edit</button>}/>
        <div style={{padding:"12px 14px"}}>
          {(coin.photoObverse||coin.photoReverse)&&<div style={{display:"flex",gap:8,marginBottom:12}}>{coin.photoObverse&&<img src={coin.photoObverse} alt="Obv" style={{flex:1,height:150,objectFit:"cover",borderRadius:10,border:`1px solid ${C.border}`}}/>}{coin.photoReverse&&<img src={coin.photoReverse} alt="Rev" style={{flex:1,height:150,objectFit:"cover",borderRadius:10,border:`1px solid ${C.border}`}}/>}</div>}
          <div style={{...card,border:`1px solid ${isErr?"#6b3a10":C.border}`}}>
            <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:4}}>
              <div style={{fontSize:20,color:isErr?C.orange:C.gold,fontWeight:"bold"}}>{coinName(coin)}</div>
              {coin.series&&<TrendBadge series={coin.series}/>}
            </div>
            <div style={{fontSize:12,color:C.textDim,marginBottom:10}}>{coin.year}{coin.mintMark?` · ${coin.mintMark}`:""} · {coin.grade}{!isErr&&!isCus&&COIN_SERIES[coin.series]?` · ${COIN_SERIES[coin.series].metal}`:""}{coin.copperColor?` · ${coin.copperColor}`:""}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,textTransform:"uppercase",letterSpacing:".07em",background:STATUS_CLR[coin.status]?.bg,border:`1px solid ${STATUS_CLR[coin.status]?.border}`,color:STATUS_CLR[coin.status]?.text}}>{coin.status}</span>
              {isErr&&<span style={{padding:"3px 10px",borderRadius:20,fontSize:11,background:"#2a1500",border:"1px solid #6b3a10",color:C.orange}}>⚠ Error</span>}
              {isCus&&<span style={{padding:"3px 10px",borderRadius:20,fontSize:11,background:"#081620",border:"1px solid #1e4a5a",color:C.blue}}>🌐 Custom</span>}
              {coin.rarity&&coin.rarity!=="—"&&<span style={{padding:"3px 10px",borderRadius:20,fontSize:11,background:C.surface2,border:`1px solid ${RARITY_CLR[coin.rarity]}`,color:RARITY_CLR[coin.rarity]}}>{coin.rarity}</span>}
            </div>
          </div>
          {tv!=null&&<div style={{...card,background:"#1a1608",border:"1px solid rgba(200,168,75,.3)"}}>
            <div style={secT}>📖 Reference Value at {coin.grade}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:24,color:C.goldBright,fontWeight:"bold"}}>{tv>=1000?"$"+tv.toLocaleString():tv<1?""+Math.round(tv*100)+"¢":"$"+tv.toFixed(2)}</div>
                <div style={{fontSize:11,color:C.textDim,marginTop:2}}>Typical market baseline</div>
              </div>
              <button onClick={()=>{setRefSeries(coin.series);setRefGrade(GRADE_KEYS[gi]||"VF-20");setNav("reference");setView(null);}} style={{padding:"8px 14px",background:"#2a1f08",color:C.gold,border:`1px solid ${C.border}`,borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Full Table →</button>
            </div>
          </div>}
          {isErr&&<div style={{...card,background:"#150800",border:"1px solid #6b3a10"}}>
            <div style={secT}>⚠ Error Details</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Field label="Error Type" value={coin.errorType} accent={C.orange} wide/>
              <Field label="Severity" value={coin.errorSeverity}/>
              <Field label="Error Premium" value={$M(coin.errorPremium)} accent={C.green}/>
            </div>
            {coin.errorDesc&&<div style={{marginTop:8,fontSize:13,color:C.orange,lineHeight:1.5}}>{coin.errorDesc}</div>}
          </div>}
          {isCus&&<div style={{...card,background:"#060e14",border:"1px solid #1e4a5a"}}>
            <div style={secT}>🌐 Custom Details</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Field label="Denomination" value={coin.customDenom}/><Field label="Metal" value={coin.customMetal}/>
              <Field label="Country" value={coin.customCountry}/><Field label="Years" value={coin.customYears}/>
            </div>
          </div>}
          <div style={card}>
            <div style={secT}>Value</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Field label="Est. Value" value={$M(coin.estimatedValue)} accent={C.gold}/>
              <Field label="Paid" value={$M(coin.paidPrice)}/>
              {coin.status==="Sold It"&&<><Field label="Sale Price" value={$M(coin.salePrice)} accent={C.green}/><Field label="Profit/Loss" value={profit!=null?`${profit>=0?"+":""}${$M(profit)}`:null} accent={profit>=0?C.green:C.red}/><Field label="Sale Date" value={coin.saleDate}/></>}
            </div>
          </div>
          {(coin.purchaseDate||coin.source||coin.storageLocation)&&<div style={card}><div style={secT}>Provenance</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Field label="Purchased" value={coin.purchaseDate}/><Field label="Source" value={coin.source}/><Field label="Storage" value={coin.storageLocation} wide/></div></div>}
          {coin.status==="On Loan"&&<div style={{...card,border:"1px solid #5b2d8a"}}><div style={secT}>Loan Info</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Field label="Loaned To" value={coin.loanedTo} accent={C.purple}/><Field label="Since" value={coin.loanDate}/></div></div>}
          {coin.certified&&<div style={{...card,background:"#060e14",border:"1px solid #1e4a5a"}}><div style={secT}>Certification</div><div style={{fontSize:15,color:"#a0c8d4"}}>{coin.certService} #{coin.certNumber}</div></div>}
          {coin.notes&&<div style={card}><div style={secT}>Notes</div><div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{coin.notes}</div></div>}
          <button onClick={()=>{if(window.confirm("Remove this coin?"))deleteCoin(coin.id);}} style={{width:"100%",padding:"12px",background:"transparent",color:C.red,border:"1px solid #5a2020",borderRadius:10,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginTop:4}}>Remove Coin</button>
        </div>
      </div>
    );
  }

  // ── ADD COIN FORM ──────────────────────────────────────────────────────────
