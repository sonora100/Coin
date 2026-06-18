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

export default function CollDetail(){
    const item=selColl;if(!item)return null;
    const type=collectibleTypes.find(t=>t.id===item.typeId);
    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title={type?.name||"Item"} back onBack={()=>setView(null)} right={<button onClick={()=>openEditColl(item)} style={{padding:"6px 14px",background:"#2a1f08",color:C.gold,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Edit</button>}/>
        <div style={{padding:"12px 14px"}}>
          {item.photos?.length>0&&<div style={{display:"flex",gap:8,marginBottom:12}}>{item.photos.map((p,i)=><img key={i} src={p} alt="" style={{flex:1,height:140,objectFit:"cover",borderRadius:10,border:`1px solid ${C.border}`}}/>)}</div>}
          <div style={card}><div style={{fontSize:20,color:C.gold,fontWeight:"bold",marginBottom:4}}>{type?.icon} {item.name}</div>{item.year&&<div style={{fontSize:12,color:C.textDim}}>{item.year}{item.source?` · ${item.source}`:""}</div>}</div>
          {(item.estimatedValue||item.paidPrice)&&<div style={card}><div style={secT}>Value</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{item.estimatedValue&&<div style={{background:C.surface2,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Est. Value</div><div style={{fontSize:14,color:C.gold}}>{$M(item.estimatedValue)}</div></div>}{item.paidPrice&&<div style={{background:C.surface2,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Paid</div><div style={{fontSize:14,color:C.text}}>{$M(item.paidPrice)}</div></div>}</div></div>}
          {type?.fields?.filter(field=>item[field]).length>0&&<div style={card}><div style={secT}>Details</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{type.fields.filter(field=>item[field]).map(field=>(<div key={field} style={{background:C.surface2,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>{field}</div><div style={{fontSize:13,color:C.text}}>{item[field]}</div></div>))}</div></div>}
          {item.notes&&<div style={card}><div style={secT}>Notes</div><div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{item.notes}</div></div>}
          <button onClick={()=>{if(window.confirm("Remove?"))deleteColl(item.id);}} style={{width:"100%",padding:"12px",background:"transparent",color:C.red,border:"1px solid #5a2020",borderRadius:10,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginTop:4}}>Remove Item</button>
        </div>
      </div>
    );
  }
