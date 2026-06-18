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

export default function AddCollForm(){
    const type=collectibleTypes.find(t=>t.id===cForm.typeId);
    const photoRef=useRef(null);
    const addPhoto=async(file)=>{if(!file)return;const b64=await compressImage(file);setCForm(p=>({...p,photos:[...(p.photos||[]),b64].slice(0,4)}));};
    return(
      <div style={{paddingBottom:90}}>
        <PageHeader title={`${cEditId?"Edit":"Add"} ${type?.name||"Item"}`} back onBack={()=>setView(null)}/>
        <div style={{padding:"10px 14px"}}>
          <div style={card}>
            <div style={secT}>Photos</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {(cForm.photos||[]).map((p,i)=>(<div key={i} style={{position:"relative"}}><img src={p} alt="" style={{width:80,height:80,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`}}/><button onClick={()=>setCForm(f=>({...f,photos:f.photos.filter((_,j)=>j!==i)}))} style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,.8)",color:"#fff",border:"none",borderRadius:4,padding:"1px 5px",cursor:"pointer",fontSize:10}}>✕</button></div>))}
              {(cForm.photos||[]).length<4&&<button onClick={()=>photoRef.current?.click()} style={{width:80,height:80,background:C.surface2,border:`2px dashed ${C.border}`,borderRadius:8,color:C.textDim,cursor:"pointer",fontSize:22}}>📷</button>}
            </div>
            <input ref={photoRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>addPhoto(e.target.files?.[0])}/>
          </div>
          <div style={card}>
            <div style={secT}>Details</div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}><label style={lbl}>Name *</label><input style={inp} placeholder={`${type?.name} name`} value={cForm.name||""} onChange={e=>setCForm(p=>({...p,name:e.target.value}))}/></div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              <div style={{flex:1,minWidth:100,display:"flex",flexDirection:"column",gap:4}}><label style={lbl}>Year</label><input style={inp} type="number" placeholder="e.g. 1968" value={cForm.year||""} onChange={e=>setCForm(p=>({...p,year:e.target.value}))}/></div>
              <div style={{flex:2,minWidth:130,display:"flex",flexDirection:"column",gap:4}}><label style={lbl}>Source</label><input style={inp} placeholder="Where you got it" value={cForm.source||""} onChange={e=>setCForm(p=>({...p,source:e.target.value}))}/></div>
            </div>
            {type?.fields?.map(field=>(<div key={field} style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}><label style={lbl}>{field}</label><input style={inp} value={cForm[field]||""} onChange={e=>setCForm(p=>({...p,[field]:e.target.value}))}/></div>))}
          </div>
          <div style={card}>
            <div style={secT}>Status & Value</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{["Own It","Want It","Sold It"].map(s=><button key={s} onClick={()=>setCForm(p=>({...p,status:s}))} style={{padding:"8px 12px",fontFamily:"inherit",cursor:"pointer",fontSize:12,borderRadius:8,background:cForm.status===s?STATUS_CLR[s].bg:C.surface2,border:`1px solid ${cForm.status===s?STATUS_CLR[s].border:C.border}`,color:cForm.status===s?STATUS_CLR[s].text:C.textFaint}}>{s}</button>)}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:120,display:"flex",flexDirection:"column",gap:4}}><label style={lbl}>Est. Value ($)</label><input style={inp} type="number" step=".01" placeholder="0.00" value={cForm.estimatedValue||""} onChange={e=>setCForm(p=>({...p,estimatedValue:e.target.value}))}/></div>
              <div style={{flex:1,minWidth:120,display:"flex",flexDirection:"column",gap:4}}><label style={lbl}>Paid ($)</label><input style={inp} type="number" step=".01" placeholder="0.00" value={cForm.paidPrice||""} onChange={e=>setCForm(p=>({...p,paidPrice:e.target.value}))}/></div>
            </div>
          </div>
          <div style={card}><div style={secT}>Notes</div><textarea value={cForm.notes||""} onChange={e=>setCForm(p=>({...p,notes:e.target.value}))} placeholder="History, provenance, condition…" style={{...inp,resize:"vertical",minHeight:80}}/></div>
          <button onClick={saveColl} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",color:"#fff8e7",border:"none",borderRadius:12,cursor:"pointer",fontSize:16,fontWeight:"bold",fontFamily:"inherit",marginBottom:8}}>{cEditId?"Save Changes":"Add Item"}</button>
          <button onClick={()=>setView(null)} style={{width:"100%",padding:"12px",background:"transparent",color:C.textFaint,border:`1px solid ${C.border2}`,borderRadius:12,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>Cancel</button>
        </div>
      </div>
    );
  }

  // ── ERROR HUNTER SCREEN (FULL FEATURED) ───────────────────────────────────
