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

export default function PurchaseScreen(){
    const [form,setForm]=useState({coin:"",paidPrice:"",currentValue:"",grade:"",purchaseDate:"",seller:"",notes:""});
    const [editing,setEditing]=useState(null);
    const f=(k,v)=>setForm(p=>({...p,[k]:v}));
    const inp={padding:"9px 11px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};

    function save(){
      if(!form.coin.trim()){showToast("Enter a coin name.");return;}
      if(editing!=null){
        setPurchases(p=>p.map((x,i)=>i===editing?{...form,id:x.id}:x));
        setEditing(null);
      }else{
        setPurchases(p=>[{...form,id:Date.now()},...p]);
      }
      setForm({coin:"",paidPrice:"",currentValue:"",grade:"",purchaseDate:"",seller:"",notes:""});
      showToast("Purchase saved!");
    }
    function remove(i){setPurchases(p=>p.filter((_,x)=>x!==i));}

    const totalPaid=purchases.reduce((s,p)=>s+(parseFloat(p.paidPrice)||0),0);
    const totalValue=purchases.reduce((s,p)=>s+(parseFloat(p.currentValue)||0),0);
    const totalProfit=totalValue-totalPaid;

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="💰 Purchase Tracker"/>
        <div style={{padding:"10px 14px"}}>
          {purchases.length>0&&(
            <div style={{background:"#1a1608",border:`1px solid ${C.gold}`,borderRadius:12,padding:14,marginBottom:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center"}}>
                {[{label:"Total Paid",val:`$${totalPaid.toFixed(2)}`,color:C.textDim},{label:"Current Value",val:`$${totalValue.toFixed(2)}`,color:C.goldBright},{label:"Profit/Loss",val:`${totalProfit>=0?"+":""}$${totalProfit.toFixed(2)}`,color:totalProfit>=0?C.green:C.red}].map(({label,val,color})=>(
                  <div key={label}><div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>{label}</div><div style={{fontSize:16,color,fontWeight:"bold"}}>{val}</div></div>
                ))}
              </div>
            </div>
          )}

          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:"bold",marginBottom:10}}>{editing!=null?"Edit Purchase":"Log a Purchase"}</div>
            <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Coin</div><input style={inp} placeholder="e.g. 1881-S Morgan Dollar MS-63" value={form.coin} onChange={e=>f("coin",e.target.value)}/></div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Paid</div><input style={inp} placeholder="$45.00" value={form.paidPrice} onChange={e=>f("paidPrice",e.target.value)}/></div>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Current Value</div><input style={inp} placeholder="$60.00" value={form.currentValue} onChange={e=>f("currentValue",e.target.value)}/></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Date</div><input style={inp} type="date" value={form.purchaseDate} onChange={e=>f("purchaseDate",e.target.value)}/></div>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Grade</div><input style={inp} placeholder="MS-63" value={form.grade} onChange={e=>f("grade",e.target.value)}/></div>
            </div>
            <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Seller / Source</div><input style={inp} placeholder="Heritage, eBay, coin show, dealer..." value={form.seller} onChange={e=>f("seller",e.target.value)}/></div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Notes</div><input style={inp} placeholder="Condition details, variety, etc." value={form.notes} onChange={e=>f("notes",e.target.value)}/></div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={save} style={{flex:1,padding:"11px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",color:"#fff8e7",border:"none",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:"bold",fontFamily:"inherit"}}>{editing!=null?"Save Changes":"Log Purchase"}</button>
              {editing!=null&&<button onClick={()=>{setEditing(null);setForm({coin:"",paidPrice:"",currentValue:"",grade:"",purchaseDate:"",seller:"",notes:""});}} style={{padding:"11px 14px",background:C.surface2,color:C.textDim,border:`1px solid ${C.border}`,borderRadius:9,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>}
            </div>
          </div>

          {purchases.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.textDim}}><div style={{fontSize:36,marginBottom:8}}>💰</div><div>No purchases logged yet</div></div>}
          {purchases.map((p,i)=>{
            const profit=(parseFloat(p.currentValue)||0)-(parseFloat(p.paidPrice)||0);
            return(
              <div key={p.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div style={{flex:1}}><div style={{fontSize:14,color:C.text,fontWeight:"bold"}}>{p.coin}</div><div style={{fontSize:11,color:C.textDim,marginTop:1}}>{[p.grade,p.purchaseDate,p.seller].filter(Boolean).join(" · ")}</div></div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,color:C.goldBright,fontWeight:"bold"}}>${parseFloat(p.paidPrice||0).toFixed(2)}</div>
                    {p.currentValue&&<div style={{fontSize:11,color:profit>=0?C.green:C.red}}>{profit>=0?"+":""}${profit.toFixed(2)}</div>}
                  </div>
                </div>
                {p.notes&&<div style={{fontSize:11,color:C.textDim,marginBottom:6,fontStyle:"italic"}}>{p.notes}</div>}
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{setForm(p);setEditing(i);}} style={{flex:1,padding:"7px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.textDim,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Edit</button>
                  <button onClick={()=>remove(i)} style={{padding:"7px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.red,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── AUCTION LOG ───────────────────────────────────────────────────────────
