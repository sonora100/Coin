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

export default function CollectiblesScreen(){
    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="Collectibles"/>
        <div style={{padding:"10px 14px"}}>
          {collectibleTypes.map(type=>{
            const items=collectibles.filter(c=>c.typeId===type.id);
            const expanded=expandedType===type.id;
            return(
              <div key={type.id} style={{...card,padding:0,overflow:"hidden",marginBottom:10}}>
                <div onClick={()=>setExpandedType(expanded?null:type.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer"}}>
                  <span style={{fontSize:22}}>{type.icon}</span>
                  <div style={{flex:1}}><div style={{fontSize:14,color:C.gold,fontWeight:"bold"}}>{type.name}</div><div style={{fontSize:11,color:C.textDim,marginTop:1}}>{items.length} item{items.length!==1?"s":""}</div></div>
                  <span style={{fontSize:20,color:C.textDim,transform:expanded?"rotate(90deg)":"rotate(0deg)",display:"inline-block",transition:"transform .2s"}}>›</span>
                </div>
                {expanded&&<div style={{borderTop:`1px solid ${C.border2}`,padding:"10px 14px"}}>
                  <button onClick={()=>openAddColl(type.id)} style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",color:"#fff8e7",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:"bold",fontFamily:"inherit",marginBottom:10}}>+ Add {type.name}</button>
                  {items.length===0?<div style={{fontSize:12,color:C.textFaint,textAlign:"center",padding:"12px 0"}}>No items yet</div>:items.map(item=>(
                    <div key={item.id} onClick={()=>{setCSelId(item.id);setView("collDetail");}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.surface2,borderRadius:8,marginBottom:6,cursor:"pointer",border:`1px solid ${C.border2}`}}>
                      {item.photos?.[0]?<img src={item.photos[0]} alt="" style={{width:42,height:42,borderRadius:6,objectFit:"cover",flexShrink:0}}/>:<div style={{width:42,height:42,borderRadius:6,background:C.border2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{type.icon}</div>}
                      <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,color:C.text,fontWeight:"bold",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div><div style={{fontSize:11,color:C.textDim}}>{item.year||""}{item.source?` · ${item.source}`:""}</div></div>
                      {item.estimatedValue&&<div style={{fontSize:13,color:C.gold,fontWeight:"bold",flexShrink:0}}>{$M(item.estimatedValue)}</div>}
                    </div>
                  ))}
                </div>}
              </div>
            );
          })}
          <div style={{...card,border:`1px dashed ${C.goldDim}`}}>
            <div style={secT}>Create New Category</div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:"0 0 56px",display:"flex",flexDirection:"column",gap:4}}><label style={lbl}>Icon</label><input style={{...inp,textAlign:"center",fontSize:22,padding:"8px 4px"}} value={newTypeIcon} onChange={e=>setNTI(e.target.value)} maxLength={2}/></div>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:4}}><label style={lbl}>Name *</label><input style={inp} placeholder="e.g. Presidential Medals" value={newTypeName} onChange={e=>setNTN(e.target.value)}/></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}><label style={lbl}>Custom Fields (comma-separated)</label><input style={inp} placeholder="e.g. President, Year, Mint, Material" value={newTypeFields} onChange={e=>setNTF(e.target.value)}/></div>
            <button onClick={saveNewType} style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",color:"#fff8e7",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:"bold",fontFamily:"inherit"}}>Create Category</button>
          </div>
        </div>
      </div>
    );
  }
