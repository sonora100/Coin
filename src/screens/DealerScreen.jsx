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

export default function DealerScreen(){
    const [form,setForm]=useState({name:"",location:"",phone:"",website:"",specialty:"",rating:"5",notes:""});
    const [editing,setEditing]=useState(null);
    const f=(k,v)=>setForm(p=>({...p,[k]:v}));
    const inp={padding:"9px 11px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};

    function save(){
      if(!form.name.trim()){showToast("Enter a dealer name.");return;}
      if(editing!=null){
        setDealerNotes(p=>p.map((x,i)=>i===editing?{...form,id:x.id}:x));
        setEditing(null);
      }else{
        setDealerNotes(p=>[{...form,id:Date.now()},...p]);
      }
      setForm({name:"",location:"",phone:"",website:"",specialty:"",rating:"5",notes:""});
      showToast("Dealer saved!");
    }
    function remove(i){setDealerNotes(p=>p.filter((_,x)=>x!==i));}

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="🤝 Dealer Notes"/>
        <div style={{padding:"10px 14px"}}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:"bold",marginBottom:10}}>{editing!=null?"Edit Dealer":"Add a Dealer"}</div>
            <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Dealer Name</div><input style={inp} placeholder="Name or business" value={form.name} onChange={e=>f("name",e.target.value)}/></div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Location</div><input style={inp} placeholder="City, State or Online" value={form.location} onChange={e=>f("location",e.target.value)}/></div>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Phone</div><input style={inp} placeholder="555-1234" value={form.phone} onChange={e=>f("phone",e.target.value)}/></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:2}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Specialty</div><input style={inp} placeholder="Morgans, early gold, errors..." value={form.specialty} onChange={e=>f("specialty",e.target.value)}/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Rating</div>
                <div style={{display:"flex",gap:2}}>
                  {[1,2,3,4,5].map(n=><button key={n} onClick={()=>f("rating",String(n))} style={{flex:1,padding:"9px 2px",fontFamily:"inherit",fontSize:14,borderRadius:5,cursor:"pointer",background:"transparent",border:"none",color:parseInt(form.rating)>=n?"#e8c86a":C.border}}>★</button>)}
                </div>
              </div>
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Notes</div><textarea style={{...inp,height:60,resize:"none"}} placeholder="Prices fair/high, trustworthy, good inventory, shows attended..." value={form.notes} onChange={e=>f("notes",e.target.value)}/></div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={save} style={{flex:1,padding:"11px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",color:"#fff8e7",border:"none",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:"bold",fontFamily:"inherit"}}>{editing!=null?"Save Changes":"Add Dealer"}</button>
              {editing!=null&&<button onClick={()=>{setEditing(null);setForm({name:"",location:"",phone:"",website:"",specialty:"",rating:"5",notes:""});}} style={{padding:"11px 14px",background:C.surface2,color:C.textDim,border:`1px solid ${C.border}`,borderRadius:9,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>}
            </div>
          </div>

          {dealerNotes.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.textDim}}><div style={{fontSize:36,marginBottom:8}}>🤝</div><div>No dealers saved yet</div></div>}
          {dealerNotes.map((d,i)=>(
            <div key={d.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:7}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,color:C.text,fontWeight:"bold"}}>{d.name}</div>
                  <div style={{fontSize:11,color:C.textDim,marginTop:1}}>{[d.location,d.specialty].filter(Boolean).join(" · ")}</div>
                </div>
                <div style={{fontSize:14,color:"#e8c86a"}}>{"★".repeat(parseInt(d.rating||5))}</div>
              </div>
              {d.phone&&<div style={{fontSize:11,color:C.blue,marginBottom:4}}>📞 {d.phone}</div>}
              {d.notes&&<div style={{fontSize:12,color:C.textDim,marginBottom:8,fontStyle:"italic"}}>{d.notes}</div>}
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setForm(d);setEditing(i);}} style={{flex:1,padding:"7px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.textDim,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Edit</button>
                <button onClick={()=>remove(i)} style={{padding:"7px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.red,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── TRADE / SELL TRACKER ──────────────────────────────────────────────────
