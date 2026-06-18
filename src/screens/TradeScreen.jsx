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

export default function TradeScreen(){
    const [form,setForm]=useState({coin:"",type:"Sold",paidOriginal:"",soldFor:"",buyer:"",saleDate:"",notes:""});
    const [editing,setEditing]=useState(null);
    const f=(k,v)=>setForm(p=>({...p,[k]:v}));
    const inp={padding:"9px 11px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};

    function save(){
      if(!form.coin.trim()){showToast("Enter a coin name.");return;}
      if(editing!=null){
        setTrades(p=>p.map((x,i)=>i===editing?{...form,id:x.id}:x));
        setEditing(null);
      }else{
        setTrades(p=>[{...form,id:Date.now()},...p]);
      }
      setForm({coin:"",type:"Sold",paidOriginal:"",soldFor:"",buyer:"",saleDate:"",notes:""});
      showToast("Sale logged!");
    }
    function remove(i){setTrades(p=>p.filter((_,x)=>x!==i));}

    const totalReceived=trades.reduce((s,t)=>s+(parseFloat(t.soldFor)||0),0);
    const totalCost=trades.reduce((s,t)=>s+(parseFloat(t.paidOriginal)||0),0);
    const totalProfit=totalReceived-totalCost;

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="📤 Sales & Trades"/>
        <div style={{padding:"10px 14px"}}>
          {trades.length>0&&(
            <div style={{background:"#1a1608",border:`1px solid ${C.gold}`,borderRadius:12,padding:14,marginBottom:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center"}}>
                {[{label:"Total Received",val:`$${totalReceived.toFixed(2)}`,color:C.goldBright},{label:"Total Cost",val:`$${totalCost.toFixed(2)}`,color:C.textDim},{label:"Net Profit",val:`${totalProfit>=0?"+":""}$${totalProfit.toFixed(2)}`,color:totalProfit>=0?C.green:C.red}].map(({label,val,color})=>(
                  <div key={label}><div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>{label}</div><div style={{fontSize:14,color,fontWeight:"bold"}}>{val}</div></div>
                ))}
              </div>
            </div>
          )}

          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:"bold",marginBottom:10}}>{editing!=null?"Edit Entry":"Log a Sale or Trade"}</div>
            <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Coin</div><input style={inp} placeholder="e.g. 1886 Morgan Dollar MS-62" value={form.coin} onChange={e=>f("coin",e.target.value)}/></div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Type</div>
                <div style={{display:"flex",gap:4}}>
                  {["Sold","Traded","Gifted"].map(t=><button key={t} onClick={()=>f("type",t)} style={{flex:1,padding:"9px 2px",fontFamily:"inherit",fontSize:11,borderRadius:6,cursor:"pointer",background:form.type===t?"#1a1608":C.surface2,border:`1px solid ${form.type===t?C.gold:C.border2}`,color:form.type===t?C.gold:C.textDim}}>{t}</button>)}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Originally Paid</div><input style={inp} placeholder="$30" value={form.paidOriginal} onChange={e=>f("paidOriginal",e.target.value)}/></div>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Sold / Traded For</div><input style={inp} placeholder="$55" value={form.soldFor} onChange={e=>f("soldFor",e.target.value)}/></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Buyer / Traded To</div><input style={inp} placeholder="eBay, dealer, collector..." value={form.buyer} onChange={e=>f("buyer",e.target.value)}/></div>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Date</div><input style={inp} type="date" value={form.saleDate} onChange={e=>f("saleDate",e.target.value)}/></div>
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Notes</div><input style={inp} placeholder="Condition, story, etc." value={form.notes} onChange={e=>f("notes",e.target.value)}/></div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={save} style={{flex:1,padding:"11px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",color:"#fff8e7",border:"none",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:"bold",fontFamily:"inherit"}}>{editing!=null?"Save Changes":"Log Sale"}</button>
              {editing!=null&&<button onClick={()=>{setEditing(null);setForm({coin:"",type:"Sold",paidOriginal:"",soldFor:"",buyer:"",saleDate:"",notes:""});}} style={{padding:"11px 14px",background:C.surface2,color:C.textDim,border:`1px solid ${C.border}`,borderRadius:9,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>}
            </div>
          </div>

          {trades.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.textDim}}><div style={{fontSize:36,marginBottom:8}}>📤</div><div>No sales or trades logged yet</div></div>}
          {trades.map((t,i)=>{
            const profit=(parseFloat(t.soldFor)||0)-(parseFloat(t.paidOriginal)||0);
            return(
              <div key={t.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,color:C.text,fontWeight:"bold"}}>{t.coin}</div>
                    <div style={{fontSize:11,color:C.textDim,marginTop:1}}>{[t.type,t.buyer,t.saleDate].filter(Boolean).join(" · ")}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,color:C.goldBright,fontWeight:"bold"}}>{t.soldFor?`$${t.soldFor}`:t.type}</div>
                    {t.paidOriginal&&t.soldFor&&<div style={{fontSize:11,color:profit>=0?C.green:C.red}}>{profit>=0?"+":""}${profit.toFixed(2)}</div>}
                  </div>
                </div>
                {t.notes&&<div style={{fontSize:11,color:C.textDim,marginBottom:6,fontStyle:"italic"}}>{t.notes}</div>}
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{setForm(t);setEditing(i);}} style={{flex:1,padding:"7px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.textDim,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Edit</button>
                  <button onClick={()=>remove(i)} style={{padding:"7px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.red,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── SET REGISTRY TRACKER ──────────────────────────────────────────────────
