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

export default function WantListScreen(){
    const [form,setForm]=useState({coin:"",denom:"",grade:"",maxPrice:"",notes:"",priority:"Medium"});
    const [editing,setEditing]=useState(null);
    const f=(k,v)=>setForm(p=>({...p,[k]:v}));
    const inp={padding:"9px 11px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};
    const priorities=["High","Medium","Low"];
    const priorityColor={High:C.red,Medium:C.orange,Low:C.textDim};

    function save(){
      if(!form.coin.trim()){showToast("Enter a coin name.");return;}
      if(editing!=null){
        setWantList(p=>p.map((w,i)=>i===editing?{...form,id:w.id}:w));
        setEditing(null);
      }else{
        setWantList(p=>[{...form,id:Date.now(),added:new Date().toLocaleDateString(),...form},...p]);
      }
      setForm({coin:"",denom:"",grade:"",maxPrice:"",notes:"",priority:"Medium"});
      showToast(editing!=null?"Updated!":"Added to Want List!");
    }
    function startEdit(i){setForm(wantList[i]);setEditing(i);}
    function remove(i){setWantList(p=>p.filter((_,x)=>x!==i));showToast("Removed.");}
    function markFound(i){
      const w=wantList[i];
      setWantList(p=>p.filter((_,x)=>x!==i));
      showToast(`${w.coin} marked as found! Add it to your vault.`);
    }

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="⭐ Want List"/>
        <div style={{padding:"10px 14px"}}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:"bold",marginBottom:10}}>{editing!=null?"Edit Want":"Add to Want List"}</div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:2}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Coin</div><input style={inp} placeholder="e.g. 1921 Morgan Dollar" value={form.coin} onChange={e=>f("coin",e.target.value)}/></div>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Grade</div><input style={inp} placeholder="VF-20" value={form.grade} onChange={e=>f("grade",e.target.value)}/></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Max Price</div><input style={inp} placeholder="$50" value={form.maxPrice} onChange={e=>f("maxPrice",e.target.value)}/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Priority</div>
                <div style={{display:"flex",gap:4}}>
                  {priorities.map(p=><button key={p} onClick={()=>f("priority",p)} style={{flex:1,padding:"9px 4px",fontFamily:"inherit",fontSize:11,borderRadius:7,cursor:"pointer",background:form.priority===p?"#1a1608":C.surface2,border:`1px solid ${form.priority===p?priorityColor[p]:C.border2}`,color:form.priority===p?priorityColor[p]:C.textDim}}>{p}</button>)}
                </div>
              </div>
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Notes</div><input style={inp} placeholder="Where to find, special variety, etc." value={form.notes} onChange={e=>f("notes",e.target.value)}/></div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={save} style={{flex:1,padding:"11px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",color:"#fff8e7",border:"none",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:"bold",fontFamily:"inherit"}}>{editing!=null?"Save Changes":"+ Add to Want List"}</button>
              {editing!=null&&<button onClick={()=>{setEditing(null);setForm({coin:"",denom:"",grade:"",maxPrice:"",notes:"",priority:"Medium"});}} style={{padding:"11px 14px",background:C.surface2,color:C.textDim,border:`1px solid ${C.border}`,borderRadius:9,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>}
            </div>
          </div>

          {wantList.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.textDim}}><div style={{fontSize:36,marginBottom:8}}>⭐</div><div>Your want list is empty</div></div>}
          {["High","Medium","Low"].map(pri=>{
            const group=wantList.filter(w=>w.priority===pri);
            if(!group.length)return null;
            return(
              <div key={pri} style={{marginBottom:14}}>
                <div style={{fontSize:10,color:priorityColor[pri],fontWeight:"bold",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>{pri} Priority · {group.length}</div>
                {group.map((w,i)=>{
                  const realIdx=wantList.indexOf(w);
                  return(
                    <div key={w.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:7}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,color:C.text,fontWeight:"bold"}}>{w.coin}</div>
                          <div style={{fontSize:11,color:C.textDim,marginTop:1}}>{[w.grade,w.maxPrice&&`Max: ${w.maxPrice}`].filter(Boolean).join(" · ")}</div>
                        </div>
                        <span style={{fontSize:10,color:priorityColor[pri],background:C.surface2,border:`1px solid ${priorityColor[pri]}`,borderRadius:4,padding:"2px 7px"}}>{pri}</span>
                      </div>
                      {w.notes&&<div style={{fontSize:12,color:C.textDim,marginBottom:8,fontStyle:"italic"}}>{w.notes}</div>}
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>markFound(realIdx)} style={{flex:1,padding:"8px",background:"#0a1f0a",border:"1px solid #2a6a2a",borderRadius:7,color:C.green,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✓ Found It!</button>
                        <button onClick={()=>startEdit(realIdx)} style={{padding:"8px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.textDim,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Edit</button>
                        <button onClick={()=>remove(realIdx)} style={{padding:"8px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.red,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── PURCHASE TRACKER ──────────────────────────────────────────────────────
