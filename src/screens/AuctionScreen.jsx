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

export default function AuctionScreen(){
    const [form,setForm]=useState({coin:"",house:"",bidAmount:"",result:"Pending",finalPrice:"",auctionDate:"",lotNumber:"",notes:""});
    const [editing,setEditing]=useState(null);
    const f=(k,v)=>setForm(p=>({...p,[k]:v}));
    const inp={padding:"9px 11px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};
    const results=["Pending","Won","Lost","Withdrew"];
    const resultColor={Pending:C.gold,Won:C.green,Lost:C.red,Withdrew:C.textDim};
    const houses=["Heritage","Stack's Bowers","GreatCollections","eBay","PCGS","NGC","Other"];

    function save(){
      if(!form.coin.trim()){showToast("Enter a coin name.");return;}
      if(editing!=null){
        setAuctions(p=>p.map((x,i)=>i===editing?{...form,id:x.id}:x));
        setEditing(null);
      }else{
        setAuctions(p=>[{...form,id:Date.now()},...p]);
      }
      setForm({coin:"",house:"",bidAmount:"",result:"Pending",finalPrice:"",auctionDate:"",lotNumber:"",notes:""});
      showToast("Auction logged!");
    }
    function remove(i){setAuctions(p=>p.filter((_,x)=>x!==i));}

    const won=auctions.filter(a=>a.result==="Won");
    const totalSpent=won.reduce((s,a)=>s+(parseFloat(a.finalPrice||a.bidAmount)||0),0);

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="🔨 Auction Log"/>
        <div style={{padding:"10px 14px"}}>
          {auctions.length>0&&(
            <div style={{background:"#1a1608",border:`1px solid ${C.gold}`,borderRadius:12,padding:14,marginBottom:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,textAlign:"center"}}>
                {[{label:"Total",val:auctions.length,color:C.textDim},{label:"Won",val:auctions.filter(a=>a.result==="Won").length,color:C.green},{label:"Lost",val:auctions.filter(a=>a.result==="Lost").length,color:C.red},{label:"Spent",val:`$${totalSpent.toFixed(0)}`,color:C.goldBright}].map(({label,val,color})=>(
                  <div key={label}><div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{label}</div><div style={{fontSize:15,color,fontWeight:"bold"}}>{val}</div></div>
                ))}
              </div>
            </div>
          )}

          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:"bold",marginBottom:10}}>{editing!=null?"Edit Auction":"Log an Auction"}</div>
            <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Coin / Lot Description</div><input style={inp} placeholder="e.g. 1893-S Morgan Dollar VG-8" value={form.coin} onChange={e=>f("coin",e.target.value)}/></div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Auction House</div>
                <select style={inp} value={form.house} onChange={e=>f("house",e.target.value)}>
                  <option value="">Select...</option>
                  {houses.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Lot #</div><input style={inp} placeholder="12345" value={form.lotNumber} onChange={e=>f("lotNumber",e.target.value)}/></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>My Bid</div><input style={inp} placeholder="$500" value={form.bidAmount} onChange={e=>f("bidAmount",e.target.value)}/></div>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Final Price</div><input style={inp} placeholder="$480" value={form.finalPrice} onChange={e=>f("finalPrice",e.target.value)}/></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Date</div><input style={inp} type="date" value={form.auctionDate} onChange={e=>f("auctionDate",e.target.value)}/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Result</div>
                <div style={{display:"flex",gap:4}}>
                  {results.map(r=><button key={r} onClick={()=>f("result",r)} style={{flex:1,padding:"9px 2px",fontFamily:"inherit",fontSize:10,borderRadius:6,cursor:"pointer",background:form.result===r?"#1a1608":C.surface2,border:`1px solid ${form.result===r?resultColor[r]:C.border2}`,color:form.result===r?resultColor[r]:C.textDim}}>{r}</button>)}
                </div>
              </div>
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Notes</div><input style={inp} placeholder="Condition, competition notes, etc." value={form.notes} onChange={e=>f("notes",e.target.value)}/></div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={save} style={{flex:1,padding:"11px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",color:"#fff8e7",border:"none",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:"bold",fontFamily:"inherit"}}>{editing!=null?"Save Changes":"Log Auction"}</button>
              {editing!=null&&<button onClick={()=>{setEditing(null);setForm({coin:"",house:"",bidAmount:"",result:"Pending",finalPrice:"",auctionDate:"",lotNumber:"",notes:""});}} style={{padding:"11px 14px",background:C.surface2,color:C.textDim,border:`1px solid ${C.border}`,borderRadius:9,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>}
            </div>
          </div>

          {auctions.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.textDim}}><div style={{fontSize:36,marginBottom:8}}>🔨</div><div>No auctions logged yet</div></div>}
          {auctions.map((a,i)=>(
            <div key={a.id} style={{background:C.surface,border:`2px solid ${a.result==="Won"?"#2a6a2a":a.result==="Lost"?"#6a2a2a":C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:7}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div style={{flex:1}}><div style={{fontSize:14,color:C.text,fontWeight:"bold"}}>{a.coin}</div><div style={{fontSize:11,color:C.textDim,marginTop:1}}>{[a.house,a.lotNumber&&`Lot ${a.lotNumber}`,a.auctionDate].filter(Boolean).join(" · ")}</div></div>
                <div style={{textAlign:"right"}}>
                  <span style={{fontSize:10,color:resultColor[a.result],background:C.surface2,border:`1px solid ${resultColor[a.result]}`,borderRadius:4,padding:"2px 7px"}}>{a.result}</span>
                  <div style={{fontSize:13,color:C.goldBright,fontWeight:"bold",marginTop:3}}>{a.finalPrice?`$${a.finalPrice}`:a.bidAmount?`Bid: $${a.bidAmount}`:""}</div>
                </div>
              </div>
              {a.notes&&<div style={{fontSize:11,color:C.textDim,marginBottom:6,fontStyle:"italic"}}>{a.notes}</div>}
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setForm(a);setEditing(i);}} style={{flex:1,padding:"7px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.textDim,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Edit</button>
                <button onClick={()=>remove(i)} style={{padding:"7px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.red,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── DEALER NOTES ──────────────────────────────────────────────────────────
