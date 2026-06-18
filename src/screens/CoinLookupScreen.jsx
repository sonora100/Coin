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
import { COIN_DB, PRICE_DATA } from '../data/coinDb';
import { COIN_SERIES } from '../data/coinSeries';

export default function CoinLookupScreen(){
    const [year,setYear]=useState("");
    const [denom,setDenom]=useState("");
    const [mint,setMint]=useState("");
    const [grade,setGrade]=useState("VF-20");
    const [results,setResults]=useState([]);
    const [searched,setSearched]=useState(false);

    // Grade selector options matching COIN_REF keys
    const GRADE_OPTS=["G-4","VG-8","F-12","VF-20","EF-40","AU-50","MS-60","MS-63","MS-65"];

    // Build a unified price lookup from COIN_REF + extended estimates
    const PRICE_DATA = {
      // Flowing Hair / early cents - rough estimates
      "Flowing Hair / Liberty Cap Cent":   {grades:GRADE_OPTS, typical:[800,1200,2000,3500,6000,10000,20000,40000,null]},
      "Draped Bust Cent":                  {grades:GRADE_OPTS, typical:[100,175,300,600,1200,2500,5000,10000,null]},
      "Classic Head Cent":                 {grades:GRADE_OPTS, typical:[75,120,200,400,900,2000,4000,8000,null]},
      "Coronet / Matron Head Cent":        {grades:GRADE_OPTS, typical:[25,40,70,150,350,800,1800,4000,null]},
      "Braided Hair Cent":                 {grades:GRADE_OPTS, typical:[20,30,50,100,250,600,1500,3500,null]},
      "Flying Eagle Cent":                 {grades:GRADE_OPTS, typical:[20,30,50,90,200,450,900,2000,8000]},
      "Indian Head Cent (Copper-Nickel)":  {grades:GRADE_OPTS, typical:[10,18,30,60,150,350,700,1500,null]},
      "Indian Head Cent (Bronze)":         {grades:GRADE_OPTS, typical:[2,3,5,10,25,50,100,180,700]},
      "Lincoln Cent (Wheat)":              {grades:GRADE_OPTS, typical:[0.05,0.10,0.20,0.50,1.50,3,8,15,60]},
      "Lincoln Cent (Memorial)":           {grades:GRADE_OPTS, typical:[0.01,0.01,0.01,0.05,0.10,0.25,0.50,1,5]},
      "Lincoln Cent (Shield)":             {grades:GRADE_OPTS, typical:[0.01,0.01,0.01,0.01,0.05,0.10,0.25,0.50,2]},
      "Two-Cent Piece":                    {grades:GRADE_OPTS, typical:[20,30,50,90,180,350,700,1500,null]},
      "Three-Cent Silver (Trime)":         {grades:GRADE_OPTS, typical:[40,60,90,175,350,750,1500,3000,null]},
      "Three-Cent Nickel":                 {grades:GRADE_OPTS, typical:[10,15,25,50,120,250,500,1000,null]},
      "Shield Nickel":                     {grades:GRADE_OPTS, typical:[20,30,50,100,225,450,900,2000,null]},
      "Liberty Head Nickel":               {grades:GRADE_OPTS, typical:[3,5,8,15,35,70,150,300,1200]},
      "Buffalo Nickel":                    {grades:GRADE_OPTS, typical:[2,3,5,10,25,50,100,175,600]},
      "Jefferson Nickel":                  {grades:GRADE_OPTS, typical:[0.05,0.10,0.15,0.25,0.75,1.50,3,6,20]},
      "Flowing Hair Dime":                 {grades:GRADE_OPTS, typical:[3000,5000,9000,16000,30000,55000,null,null,null]},
      "Draped Bust Dime":                  {grades:GRADE_OPTS, typical:[400,700,1200,2500,5000,10000,null,null,null]},
      "Capped Bust Dime":                  {grades:GRADE_OPTS, typical:[40,70,120,250,550,1200,2500,5000,null]},
      "Seated Liberty Dime":               {grades:GRADE_OPTS, typical:[20,35,60,120,275,600,1200,2500,null]},
      "Barber Dime":                       {grades:GRADE_OPTS, typical:[4,6,10,20,50,100,175,350,1500]},
      "Mercury Dime":                      {grades:GRADE_OPTS, typical:[3,4,5,8,15,25,40,75,250]},
      "Roosevelt Dime (Silver)":           {grades:GRADE_OPTS, typical:[2,2.50,3,3.50,4,5,8,12,30]},
      "Roosevelt Dime (Clad)":             {grades:GRADE_OPTS, typical:[0.10,0.10,0.10,0.10,0.10,0.25,0.50,1,4]},
      "Twenty-Cent Piece":                 {grades:GRADE_OPTS, typical:[80,130,220,450,900,1800,3500,7000,null]},
      "Draped Bust Quarter":               {grades:GRADE_OPTS, typical:[500,900,1500,3000,6000,12000,null,null,null]},
      "Capped Bust Quarter":               {grades:GRADE_OPTS, typical:[40,65,110,225,500,1100,2200,5000,null]},
      "Seated Liberty Quarter":            {grades:GRADE_OPTS, typical:[25,40,70,140,325,700,1400,3000,null]},
      "Barber Quarter":                    {grades:GRADE_OPTS, typical:[10,16,28,55,130,280,550,1100,4000]},
      "Standing Liberty Quarter":          {grades:GRADE_OPTS, typical:[8,12,18,30,60,120,200,400,1800]},
      "Washington Quarter (Silver)":       {grades:GRADE_OPTS, typical:[5,6,7,8,12,20,35,60,175]},
      "Washington Quarter (Clad)":         {grades:GRADE_OPTS, typical:[0.25,0.25,0.25,0.25,0.50,0.75,1,2,8]},
      "State Quarter":                     {grades:GRADE_OPTS, typical:[0.25,0.25,0.25,0.25,0.50,0.75,1,2,8]},
      "District of Columbia & Territories Quarter":{grades:GRADE_OPTS,typical:[0.25,0.25,0.25,0.25,0.50,0.75,1,2,6]},
      "America the Beautiful Quarter":     {grades:GRADE_OPTS, typical:[0.25,0.25,0.25,0.25,0.50,1,2,4,12]},
      "American Women Quarter":            {grades:GRADE_OPTS, typical:[0.25,0.25,0.25,0.25,0.50,1,2,4,10]},
      "Flowing Hair Half Dollar":          {grades:GRADE_OPTS, typical:[2000,3500,6000,11000,22000,40000,null,null,null]},
      "Draped Bust Half Dollar":           {grades:GRADE_OPTS, typical:[300,500,900,1800,4000,8000,null,null,null]},
      "Capped Bust Half Dollar":           {grades:GRADE_OPTS, typical:[40,65,110,225,500,1100,2200,5000,null]},
      "Seated Liberty Half Dollar":        {grades:GRADE_OPTS, typical:[25,40,65,130,300,650,1300,2800,null]},
      "Barber Half Dollar":                {grades:GRADE_OPTS, typical:[15,20,30,50,100,200,350,700,3000]},
      "Walking Liberty Half Dollar":       {grades:GRADE_OPTS, typical:[12,14,16,20,30,50,80,130,500]},
      "Franklin Half Dollar":              {grades:GRADE_OPTS, typical:[10,11,12,13,15,18,25,40,120]},
      "Kennedy Half Dollar (Silver)":      {grades:GRADE_OPTS, typical:[8,9,10,11,12,14,18,25,60]},
      "Kennedy Half Dollar (40% Silver)":  {grades:GRADE_OPTS, typical:[3,3.50,4,4.50,5,6,8,12,35]},
      "Kennedy Half Dollar (Clad)":        {grades:GRADE_OPTS, typical:[0.50,0.50,0.50,0.50,0.75,1,2,4,15]},
      "Flowing Hair Dollar":               {grades:GRADE_OPTS, typical:[10000,18000,30000,55000,110000,null,null,null,null]},
      "Draped Bust Dollar":                {grades:GRADE_OPTS, typical:[1000,1800,3000,6000,12000,25000,null,null,null]},
      "Seated Liberty Dollar":             {grades:GRADE_OPTS, typical:[200,350,600,1200,2800,6000,null,null,null]},
      "Trade Dollar":                      {grades:GRADE_OPTS, typical:[60,90,140,275,600,1200,2500,5000,null]},
      "Morgan Dollar":                     {grades:GRADE_OPTS, typical:[25,28,32,38,50,75,110,175,600]},
      "Peace Dollar":                      {grades:GRADE_OPTS, typical:[25,28,30,35,45,65,100,160,500]},
      "Eisenhower Dollar":                 {grades:GRADE_OPTS, typical:[1,1.25,1.50,2,3,5,8,15,60]},
      "Susan B. Anthony Dollar":           {grades:GRADE_OPTS, typical:[1,1,1,1.25,1.50,2,3,6,25]},
      "Sacagawea Dollar":                  {grades:GRADE_OPTS, typical:[1,1,1,1,1,1.25,2,4,15]},
      "Presidential Dollar":              {grades:GRADE_OPTS, typical:[1,1,1,1,1,1.25,2,4,12]},
      "American Innovation Dollar":        {grades:GRADE_OPTS, typical:[1,1,1,1,1,1.25,2,4,10]},
      "American Silver Eagle":             {grades:GRADE_OPTS, typical:[null,null,null,null,null,null,32,38,50]},
      "Capped Bust Quarter Eagle":         {grades:GRADE_OPTS, typical:[2000,3500,6000,11000,22000,null,null,null,null]},
      "Liberty Head Quarter Eagle":        {grades:GRADE_OPTS, typical:[250,400,700,1400,2800,5500,null,null,null]},
      "Indian Head Quarter Eagle":         {grades:GRADE_OPTS, typical:[350,550,900,1700,3400,6500,null,null,null]},
      "Three-Dollar Gold Piece":           {grades:GRADE_OPTS, typical:[800,1300,2200,4500,9000,null,null,null,null]},
      "Liberty Head Half Eagle":           {grades:GRADE_OPTS, typical:[300,450,750,1400,2800,5500,null,null,null]},
      "Indian Head Half Eagle":            {grades:GRADE_OPTS, typical:[400,600,1000,2000,4000,8000,null,null,null]},
      "American Gold Eagle (1/10 oz)":     {grades:GRADE_OPTS, typical:[null,null,null,null,null,null,320,330,350]},
      "American Gold Eagle (1/4 oz)":      {grades:GRADE_OPTS, typical:[null,null,null,null,null,null,800,825,875]},
      "American Gold Eagle (1/2 oz)":      {grades:GRADE_OPTS, typical:[null,null,null,null,null,null,1600,1650,1750]},
      "Liberty Head Eagle":                {grades:GRADE_OPTS, typical:[700,1100,1800,3500,7000,null,null,null,null]},
      "Indian Head Eagle":                 {grades:GRADE_OPTS, typical:[800,1200,2000,3800,7500,null,null,null,null]},
      "American Gold Eagle (1 oz)":        {grades:GRADE_OPTS, typical:[null,null,null,null,null,null,3100,3200,3500]},
      "American Gold Buffalo":             {grades:GRADE_OPTS, typical:[null,null,null,null,null,null,3100,3200,3500]},
      "Liberty Head Double Eagle":         {grades:GRADE_OPTS, typical:[1400,2000,3000,5500,10000,20000,null,null,null]},
      "Saint-Gaudens Double Eagle":        {grades:GRADE_OPTS, typical:[1800,2200,2800,4000,7000,14000,null,null,null]},
      "American Platinum Eagle":           {grades:GRADE_OPTS, typical:[null,null,null,null,null,null,1000,1050,1100]},
    };

    function getEstimate(seriesName, gradeStr){
      const pd=PRICE_DATA[seriesName];
      if(!pd)return null;
      const gi=pd.grades.indexOf(gradeStr);
      if(gi<0)return null;
      return pd.typical[gi];
    }

    function formatVal(v){
      if(v==null)return "—";
      if(v<1)return Math.round(v*100)+"¢";
      if(v>=1000)return "$"+v.toLocaleString();
      return "$"+v.toFixed(2);
    }

    function doLookup(){
      if(!year&&!denom){showToast("Enter a year or denomination.");return;}
      const yr=parseInt(year);
      const mintCode=mint.split("–")[0].trim().split(" ")[0];

      let found=[];
      const searchDenoms=denom?[denom]:DENOM_LIST;

      searchDenoms.forEach(d=>{
        const series=COIN_DB[d]||[];
        series.forEach(s=>{
          // Parse year range
          let inRange=true;
          if(year){
            const ranges=s.years.split(",").map(r=>r.trim());
            inRange=ranges.some(r=>{
              const parts=r.split("–").map(p=>parseInt(p));
              if(parts.length===1)return yr===parts[0];
              return yr>=parts[0]&&yr<=(parts[1]||2030);
            });
          }
          if(!inRange)return;

          // Mint filter
          if(mint&&mint!==""){
            if(!s.mints.includes(mintCode))return;
          }

          // Check if it's a key date year
          const isKey=year?s.keys.some(k=>k.includes(year)):false;

          found.push({...s,denom:d,isKey,searchYear:year,searchMint:mintCode});
        });
      });

      setResults(found);
      setSearched(true);
    }

    function pcgsUrl(s){
      const q=encodeURIComponent(`${s.searchYear||""} ${s.series} ${s.searchMint&&s.searchMint!=="P"?s.searchMint:""}`).trim();
      return `https://www.pcgs.com/prices#q=${q}`;
    }
    function ngcUrl(s){
      const q=encodeURIComponent(`${s.searchYear||""} ${s.series}`);
      return `https://www.ngccoin.com/price-guide/united-states/?q=${q}`;
    }
    function heritageUrl(s){
      const q=encodeURIComponent(`${s.searchYear||""} ${s.series} ${s.searchMint&&s.searchMint!=="P"?s.searchMint:""}`).trim();
      return `https://coins.ha.com/c/search-results.zx?N=0+794+231&Nty=1&Ntt=${q}`;
    }
    function ebayUrl(s){
      const q=encodeURIComponent(`${s.searchYear||""} ${s.denom} ${s.searchMint&&s.searchMint!=="P"?s.searchMint+" mint":""} coin`).trim();
      return `https://www.ebay.com/sch/i.html?_nkw=${q}&LH_Complete=1&LH_Sold=1`;
    }

    const inp2={padding:"10px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="🔍 Coin Lookup"/>
        <div style={{padding:"10px 14px"}}>
          <div style={{fontSize:12,color:C.textDim,marginBottom:14}}>Look up any US coin by year, denomination, and mint. Get instant facts plus live pricing links.</div>

          {/* Search form */}
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px",marginBottom:12}}>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:C.textDim,letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>Year</div>
                <input
                  style={inp2}
                  type="number"
                  placeholder="e.g. 1921"
                  value={year}
                  onChange={e=>setYear(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&doLookup()}
                />
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:C.textDim,letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>Denomination</div>
                <select style={inp2} value={denom} onChange={e=>setDenom(e.target.value)}>
                  <option value="">All Denoms</option>
                  {DENOM_LIST.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.textDim,letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>Mint Mark (optional)</div>
              <select style={inp2} value={mint} onChange={e=>setMint(e.target.value)}>
                <option value="">Any Mint</option>
                {MINT_LIST.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.textDim,letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>Your Grade (for estimate)</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {GRADE_OPTS.map(g=>(
                  <button key={g} onClick={()=>setGrade(g)}
                    style={{padding:"7px 10px",fontFamily:"inherit",cursor:"pointer",fontSize:12,borderRadius:7,
                      background:grade===g?"#2a1f08":C.surface2,
                      border:`1px solid ${grade===g?C.gold:C.border2}`,
                      color:grade===g?C.gold:C.textDim,minWidth:48,textAlign:"center"}}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={doLookup}
              style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#b8942a,#8a6b1e)",color:"#fff8e7",border:"none",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:"bold",fontFamily:"inherit"}}
            >
              🔍 Look Up This Coin
            </button>
          </div>

          {/* Results */}
          {searched&&results.length===0&&(
            <div style={{textAlign:"center",padding:"30px 20px",color:C.textDim}}>
              <div style={{fontSize:36,marginBottom:8}}>🪙</div>
              <div style={{fontSize:15,marginBottom:4}}>No match found</div>
              <div style={{fontSize:12,color:C.textFaint}}>Try adjusting the year or denomination. Some early coins have limited date ranges.</div>
            </div>
          )}

          {results.map((r,i)=>(
            <div key={i} style={{background:C.surface,border:`2px solid ${r.isKey?"#e07a3a":C.border}`,borderRadius:12,marginBottom:12,overflow:"hidden"}}>
              {/* Header */}
              <div style={{background:r.isKey?"#1e0800":C.surface2,padding:"12px 14px",borderBottom:`1px solid ${C.border2}`}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,color:r.isKey?C.orange:C.gold,fontWeight:"bold",marginBottom:2}}>{r.series}</div>
                    <div style={{fontSize:12,color:C.textDim}}>{r.denom} · {r.metal} · {r.years}</div>
                  </div>
                  {r.isKey&&<span style={{fontSize:10,color:C.orange,background:"#2a0808",border:"1px solid #6b3a10",borderRadius:4,padding:"2px 8px",whiteSpace:"nowrap",flexShrink:0}}>🔥 KEY DATE</span>}
                </div>
              </div>

              {/* Info */}
              <div style={{padding:"12px 14px"}}>
                {/* Mints */}
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>Mints</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {r.mints.map(m=>(
                      <span key={m} style={{fontSize:12,color:m===r.searchMint||(!r.searchMint&&m==="P")?C.gold:C.textDim,background:C.surface2,border:`1px solid ${m===r.searchMint?C.gold:C.border2}`,borderRadius:6,padding:"3px 10px",fontWeight:m===r.searchMint?"bold":"normal"}}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div style={{background:C.surface2,borderRadius:8,padding:"10px 12px",marginBottom:10}}>
                  <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>About This Series</div>
                  <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{r.notes}</div>
                </div>

                {/* Key dates for this year */}
                {r.isKey&&r.year&&(
                  <div style={{background:"#1e0800",border:"1px solid #6b3a10",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
                    <div style={{fontSize:10,color:C.orange,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>⚠ Key Date / Variety Alert</div>
                    <div style={{fontSize:12,color:"#c87a3a",lineHeight:1.5}}>
                      {r.keys.filter(k=>k.includes(year)).join(" · ")} — Check the Error Hunter tab for detailed spotting tips.
                    </div>
                  </div>
                )}

                {/* Key dates for series */}
                {r.keys.length>0&&(
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Key Dates & Varieties in This Series</div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      {r.keys.map((k,ki)=>{
                        const isThisYear=year&&k.includes(year);
                        return(
                          <span key={ki} style={{fontSize:11,color:isThisYear?C.orange:C.textDim,background:isThisYear?"#2a0808":C.surface2,border:`1px solid ${isThisYear?"#6b3a10":C.border2}`,borderRadius:5,padding:"3px 8px"}}>{k}</span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Estimated value */}
                {(()=>{
                  const est=getEstimate(r.series,grade);
                  const gradeIdx=GRADE_OPTS.indexOf(grade);
                  return(
                    <div style={{background:"#1a1608",border:`1px solid ${est!=null?"rgba(200,168,75,.4)":C.border2}`,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                      <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Estimated Value at {grade}</div>
                      <div style={{display:"flex",alignItems:"baseline",gap:12,flexWrap:"wrap"}}>
                        <div style={{fontSize:32,color:est!=null?C.goldBright:C.textDim,fontWeight:"bold"}}>{formatVal(est)}</div>
                        {est!=null&&<div style={{fontSize:11,color:C.textDim}}>typical common date · verify with live links below</div>}
                        {est==null&&<div style={{fontSize:11,color:C.textDim}}>No estimate — check live links below</div>}
                      </div>
                      {est!=null&&gradeIdx>0&&gradeIdx<GRADE_OPTS.length-1&&(()=>{
                        const lo=getEstimate(r.series,GRADE_OPTS[gradeIdx-1]);
                        const hi=getEstimate(r.series,GRADE_OPTS[gradeIdx+1]);
                        return(
                          <div style={{display:"flex",gap:16,marginTop:6}}>
                            {lo!=null&&<span style={{fontSize:11,color:C.textDim}}>{GRADE_OPTS[gradeIdx-1]}: {formatVal(lo)}</span>}
                            {hi!=null&&<span style={{fontSize:11,color:C.textDim}}>{GRADE_OPTS[gradeIdx+1]}: {formatVal(hi)}</span>}
                          </div>
                        );
                      })()}
                      {r.isKey&&<div style={{fontSize:11,color:C.orange,marginTop:6}}>⚠ Key date — actual value may be 10–100x higher. Check live prices.</div>}
                    </div>
                  );
                })()}

                {/* Live pricing buttons */}
                <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Live Pricing — Tap to Open</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {[
                    {label:"PCGS Prices",url:pcgsUrl(r),color:"#5d9eba",bg:"#060e14",border:"#1e4a5a"},
                    {label:"NGC Prices",url:ngcUrl(r),color:"#5dba82",bg:"#060e14",border:"#1a3a1a"},
                    {label:"Heritage Sold",url:heritageUrl(r),color:"#c8a84b",bg:"#1a1608",border:"#3a2e0a"},
                    {label:"eBay Sold",url:ebayUrl(r),color:"#b05dea",bg:"#0e0814",border:"#3a1a5a"},
                  ].map(({label,url,color,bg,border})=>(
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                      style={{display:"block",padding:"10px 12px",background:bg,border:`1px solid ${border}`,borderRadius:8,textDecoration:"none",textAlign:"center"}}>
                      <div style={{fontSize:12,color,fontWeight:"bold"}}>{label}</div>
                      <div style={{fontSize:9,color:C.textDim,marginTop:2}}>Opens in browser</div>
                    </a>
                  ))}
                </div>

                {/* Add to vault shortcut */}
                <button
                  onClick={()=>{
                    const seriesMatch=Object.keys(COIN_SERIES).find(s=>s.includes(r.series.split("(")[0].trim().slice(0,15)));
                    openAddCoin("standard",seriesMatch?{series:seriesMatch,year:year}:{year:year});
                  }}
                  style={{marginTop:10,width:"100%",padding:"10px",background:"linear-gradient(135deg,#2a1f08,#1a1208)",color:C.gold,border:`1px solid ${C.border}`,borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}
                >
                  + Add This Coin to My Vault
                </button>
              </div>
            </div>
          ))}

          {/* Quick browse by denomination */}
          {!searched&&<>
            <div style={{fontSize:10,color:C.textDim,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10,marginTop:8}}>Or Browse by Denomination</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {DENOM_LIST.map(d=>(
                <button key={d} onClick={()=>{setDenom(d);setYear("");setMint("");}}
                  style={{padding:"10px 4px",background:denom===d?"#2a1f08":C.surface,border:`1px solid ${denom===d?C.gold:C.border}`,borderRadius:8,cursor:"pointer",color:denom===d?C.gold:C.textDim,fontSize:13,fontFamily:"inherit",fontWeight:denom===d?"bold":"normal"}}>
                  {d}
                </button>
              ))}
            </div>
            {denom&&<>
              <div style={{fontSize:11,color:C.textDim,marginTop:10,marginBottom:6}}>{(COIN_DB[denom]||[]).length} series — select a year above or tap Look Up to see all</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {(COIN_DB[denom]||[]).map((s,i)=>(
                  <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:13,color:C.gold,fontWeight:"bold"}}>{s.series}</div>
                    <div style={{fontSize:11,color:C.textDim,marginTop:1}}>{s.years} · {s.metal}</div>
                  </div>
                ))}
              </div>
            </>}
          </>}
        </div>
      </div>
    );
  }

  // ── SILVER / METALS SCREEN ────────────────────────────────────────────────
