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
import { COIN_SERIES } from '../data/coinSeries';

export default function AddCoinForm(){
    const mode=form._mode,isErr=mode==="error",isCus=mode==="custom";
    const modeLabel=bulkMode?"⚡ Bulk Add Mode":isErr?"⚠️ Error Coin":isCus?"🌐 Custom / Foreign Coin":"🪙 US Coin";
    const modeColor=bulkMode?C.green:isErr?C.orange:isCus?C.blue:C.gold;
    const showCopper=isCopperSeries(form.series);
    return(
      <div style={{paddingBottom:90}}>
        <PageHeader title={editId?"Edit Coin":"Add Coin"} back onBack={()=>{setView(null);setBulkMode(false);setBulkCount(0);}}/>
        <div style={{padding:"10px 14px"}}>
          <div style={{background:bulkMode?"#0a1808":isErr?"#150800":isCus?"#060e14":C.surface,border:`1px solid ${bulkMode?"#2d4d2d":isErr?"#6b3a10":isCus?"#1e4a5a":C.border}`,borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:modeColor,fontWeight:"bold"}}>{modeLabel}</span>
            {bulkMode&&bulkCount>0&&<span style={{fontSize:12,color:C.green,background:"#0a1808",border:"1px solid #2d4d2d",borderRadius:6,padding:"3px 10px"}}>{bulkCount} added</span>}
          </div>
          {bulkMode&&<div style={{...card,background:"#0a1808",border:"1px solid #2d4d2d",marginBottom:12}}>
            <div style={{fontSize:12,color:C.green,lineHeight:1.6}}>⚡ <strong>Bulk Mode:</strong> After each save, the form stays open with the same series, grade, and status pre-filled. Just change the year and mint mark for each coin.</div>
            <button onClick={()=>{setView(null);setBulkMode(false);setBulkCount(0);showToast(`Done — ${bulkCount} coins added.`);}} style={{marginTop:10,width:"100%",padding:"10px",background:"transparent",color:C.green,border:"1px solid #2d4d2d",borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>✓ Done Adding ({bulkCount} added)</button>
          </div>}
          {!bulkMode&&<div style={card}>
            <div style={secT}>Photos (Optional)</div>
            <div style={{display:"flex",gap:10}}>
              {[["obs","Obverse (Front)",form.photoObverse,obsRef],["rev","Reverse (Back)",form.photoReverse,revRef]].map(([side,label,val,ref])=>(
                <div key={side} style={{flex:1}}>
                  <div style={lbl}>{label}</div>
                  {val?(<div style={{position:"relative"}}><img src={val} alt="" style={{width:"100%",height:110,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`}}/><button onClick={()=>f(side==="obs"?"photoObverse":"photoReverse",null)} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,.75)",color:"#fff",border:"none",borderRadius:4,padding:"2px 7px",cursor:"pointer",fontSize:11}}>✕</button></div>):(<button onClick={()=>ref.current?.click()} style={{width:"100%",height:80,background:C.surface2,border:`2px dashed ${C.border}`,borderRadius:8,color:C.textDim,cursor:"pointer",fontSize:22}}>📷</button>)}
                  <input ref={ref} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handlePhoto(side,e.target.files?.[0])}/>
                </div>
              ))}
            </div>
          </div>}
          {isErr&&<div style={{...card,background:"#150800",border:"1px solid #6b3a10"}}>
            <div style={secT}>⚠ Error Details</div>
            <FG label="Base Coin *" flex={1} min={200}><input style={inp} placeholder="e.g. 1972 Lincoln Cent" value={form.errorBaseCoin} onChange={e=>f("errorBaseCoin",e.target.value)}/></FG>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <FG label="Error Type" flex={2} min={180}><select style={inp} value={form.errorType} onChange={e=>f("errorType",e.target.value)}><option value="">Select error type…</option>{ERROR_TYPES.map(t=><option key={t}>{t}</option>)}</select></FG>
              <FG label="Severity" min={130}><select style={inp} value={form.errorSeverity} onChange={e=>f("errorSeverity",e.target.value)}>{ERROR_SEV.map(s=><option key={s}>{s}</option>)}</select></FG>
            </div>
            {(form.errorType==="Custom / Describe Below"||form.errorDesc)&&<FG label="Describe the Error" flex={1} min={200}><input style={inp} placeholder="Describe what you see…" value={form.errorDesc} onChange={e=>f("errorDesc",e.target.value)}/></FG>}
            <FG label="Est. Error Premium ($)" min={180}><input style={inp} type="number" step=".01" placeholder="Premium above normal value" value={form.errorPremium} onChange={e=>f("errorPremium",e.target.value)}/></FG>
          </div>}
          {isCus&&<div style={{...card,background:"#060e14",border:"1px solid #1e4a5a"}}>
            <div style={secT}>🌐 Custom Details</div>
            <FG label="Coin Name *" flex={1} min={200}><input style={inp} placeholder="e.g. 1971 Eisenhower Dollar" value={form.customName} onChange={e=>f("customName",e.target.value)}/></FG>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <FG label="Denomination" min={100}><input style={inp} placeholder="$1…" value={form.customDenom} onChange={e=>f("customDenom",e.target.value)}/></FG>
              <FG label="Country" min={120}><input style={inp} placeholder="US, Canada…" value={form.customCountry} onChange={e=>f("customCountry",e.target.value)}/></FG>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <FG label="Metal" min={140}><input style={inp} placeholder="90% Silver…" value={form.customMetal} onChange={e=>f("customMetal",e.target.value)}/></FG>
              <FG label="Years Minted" min={100}><input style={inp} placeholder="1971–1978" value={form.customYears} onChange={e=>f("customYears",e.target.value)}/></FG>
            </div>
          </div>}
          <div style={card}>
            <div style={secT}>Coin Details</div>
            {!isErr&&!isCus&&<FG label="Series" flex={1} min={200}>
              <select style={inp} value={form.series} onChange={e=>f("series",e.target.value)}>
                <option value="">Select a series…</option>
                {DENOM_ORDER.map(d=>{const e=Object.entries(COIN_SERIES).filter(([,v])=>v.denom===d);return e.length?<optgroup key={d} label={`── ${d} ──`}>{e.map(([n])=><option key={n} value={n}>{n}</option>)}</optgroup>:null;})}
              </select>
            </FG>}
            {seriesInfo&&<div style={{background:C.bg,border:`1px solid ${C.border2}`,borderRadius:6,padding:"8px 12px",fontSize:12,color:C.textDim,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
              <span>{seriesInfo.denom} · {seriesInfo.metal} · {seriesInfo.years}</span>
              {form.series&&<TrendBadge series={form.series}/>}
            </div>}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <FG label="Year *" min={90}><input style={inp} type="number" placeholder="e.g. 1921" value={form.year} onChange={e=>f("year",e.target.value)}/></FG>
              <FG label="Mint Mark" min={130}><select style={inp} value={form.mintMark} onChange={e=>f("mintMark",e.target.value)}>{MINT_MARKS.map(m=><option key={m}>{m}</option>)}</select></FG>
            </div>
            {showCopper&&<div style={{marginTop:4}}>
              <div style={{...lbl,color:"#c87a3a"}}>Copper Color Grade</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {COPPER_COLORS.map(cc=>(
                  <button key={cc.id} onClick={()=>f("copperColor",form.copperColor===cc.id?"":cc.id)} style={{padding:"8px 12px",fontFamily:"inherit",cursor:"pointer",fontSize:12,borderRadius:8,background:form.copperColor===cc.id?"#2a1500":C.surface2,border:`1px solid ${form.copperColor===cc.id?"#c87a3a":C.border}`,color:form.copperColor===cc.id?"#e07a3a":C.textDim,flex:1,textAlign:"center"}}>
                    <div style={{fontWeight:"bold"}}>{cc.id}</div>
                    <div style={{fontSize:10,marginTop:2}}>{cc.premium}</div>
                  </button>
                ))}
              </div>
              {form.copperColor&&<div style={{fontSize:11,color:C.textDim,marginTop:6,padding:"6px 10px",background:C.bg,borderRadius:6,border:`1px solid ${C.border2}`}}>{COPPER_COLORS.find(c=>c.id===form.copperColor)?.desc}</div>}
            </div>}
          </div>
          <div style={card}>
            <div style={secT}>Grade & Status</div>
            <FG label="Grade (Sheldon Scale)" flex={1} min={200}><select style={inp} value={form.grade} onChange={e=>f("grade",e.target.value)}>{GRADES.map((g,i)=><option key={g} value={g}>{GRADE_LBL[i]}</option>)}</select></FG>
            <FG label="Rarity" flex={1} min={200}><select style={inp} value={form.rarity} onChange={e=>f("rarity",e.target.value)}>{RARITY.map(r=><option key={r}>{r}</option>)}</select></FG>
            <div style={{marginTop:4}}><label style={lbl}>Status</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{STATUS_OPT.map(s=><button key={s} onClick={()=>f("status",s)} style={{padding:"8px 12px",fontFamily:"inherit",cursor:"pointer",fontSize:12,borderRadius:8,background:form.status===s?STATUS_CLR[s].bg:C.surface2,border:`1px solid ${form.status===s?STATUS_CLR[s].border:C.border}`,color:form.status===s?STATUS_CLR[s].text:C.textFaint}}>{s}</button>)}</div></div>
            {form.status==="On Loan"&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}><FG label="Loaned To" min={130}><input style={inp} placeholder="Name" value={form.loanedTo} onChange={e=>f("loanedTo",e.target.value)}/></FG><FG label="Loan Date" min={130}><input style={inp} type="date" value={form.loanDate} onChange={e=>f("loanDate",e.target.value)}/></FG></div>}
          </div>
          <div style={card}>
            <div style={secT}>Value & Pricing</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><FG label="Est. Value ($)" min={130}><input style={inp} type="number" step=".01" placeholder="0.00" value={form.estimatedValue} onChange={e=>f("estimatedValue",e.target.value)}/></FG><FG label="Paid ($)" min={130}><input style={inp} type="number" step=".01" placeholder="0.00" value={form.paidPrice} onChange={e=>f("paidPrice",e.target.value)}/></FG></div>
            {form.status==="Sold It"&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}><FG label="Sale Price ($)" min={130}><input style={inp} type="number" step=".01" placeholder="0.00" value={form.salePrice} onChange={e=>f("salePrice",e.target.value)}/></FG><FG label="Sale Date" min={130}><input style={inp} type="date" value={form.saleDate} onChange={e=>f("saleDate",e.target.value)}/></FG></div>}
          </div>
          {!bulkMode&&<div style={card}>
            <div style={secT}>Provenance & Storage</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><FG label="Purchase Date" min={130}><input style={inp} type="date" value={form.purchaseDate} onChange={e=>f("purchaseDate",e.target.value)}/></FG><FG label="Source / Dealer" min={130}><input style={inp} placeholder="e.g. Heritage, Coin Show" value={form.source} onChange={e=>f("source",e.target.value)}/></FG></div>
            <FG label="Storage Location" flex={1} min={200}><select style={inp} value={form.storageLocation} onChange={e=>f("storageLocation",e.target.value)}><option value="">Select…</option>{STORAGE_L.map(l=><option key={l}>{l}</option>)}</select></FG>
          </div>}
          {!bulkMode&&<div style={card}>
            <div style={secT}>Certification</div>
            <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:10}}><input type="checkbox" checked={form.certified} onChange={e=>f("certified",e.target.checked)} style={{width:18,height:18}}/><span style={{fontSize:13,color:C.textDim}}>Professionally graded / slabbed</span></label>
            {form.certified&&<div style={{display:"flex",gap:8,flexWrap:"wrap"}}><FG label="Service" min={100}><select style={inp} value={form.certService} onChange={e=>f("certService",e.target.value)}>{CERT_SVC.map(s=><option key={s}>{s}</option>)}</select></FG><FG label="Cert Number" flex={2} min={140}><input style={inp} placeholder="12345678" value={form.certNumber} onChange={e=>f("certNumber",e.target.value)}/></FG></div>}
          </div>}
          <div style={card}>
            <div style={secT}>Notes</div>
            <textarea value={form.notes} onChange={e=>f("notes",e.target.value)} placeholder="Condition details, provenance, history…" style={{...inp,resize:"vertical",minHeight:80,marginBottom:8}}/>
            <button onClick={voiceNote.listening?voiceNote.stop:voiceNote.start} style={{width:"100%",padding:"10px",background:voiceNote.listening?"#2a0808":"#1a1508",color:voiceNote.listening?C.red:C.gold,border:`1px solid ${voiceNote.listening?"#5a2020":C.border}`,borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {voiceNote.listening?<><span style={{fontSize:16}}>⏹</span> Tap to Stop Recording</>:<><span style={{fontSize:16}}>🎤</span> Voice Note</>}
            </button>
            {voiceNote.listening&&<div style={{fontSize:11,color:C.red,textAlign:"center",marginTop:6,letterSpacing:".06em"}}>🔴 LISTENING… speak now</div>}
          </div>
          <button onClick={saveCoin} style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,#b8942a,#8a6b1e)`,color:"#fff8e7",border:"none",borderRadius:12,cursor:"pointer",fontSize:16,fontWeight:"bold",fontFamily:"inherit",marginBottom:8}}>
            {bulkMode?`Save & Add Next`:(editId?"Save Changes":"Add to Vault")}
          </button>
          <button onClick={()=>{setView(null);setBulkMode(false);setBulkCount(0);}} style={{width:"100%",padding:"12px",background:"transparent",color:C.textFaint,border:`1px solid ${C.border2}`,borderRadius:12,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>{bulkMode&&bulkCount>0?"Done Adding":"Cancel"}</button>
        </div>
      </div>
    );
  }

  // ── REFERENCE SCREEN ───────────────────────────────────────────────────────
