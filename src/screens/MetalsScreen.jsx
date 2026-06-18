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

export default function MetalsScreen(){
    const [prices,setPrices]=React.useState({silver:null,gold:null,platinum:null,updated:null,loading:false,error:null});
    const [qty,setQty]=React.useState({});

    // All US coin metal data
    const COINS=[
      // SILVER COINS
      {cat:"Silver",name:"Morgan Dollar",years:"1878–1921",weight:26.73,purity:0.90,asw:0.7734,metal:"silver",notes:"Most popular US silver dollar"},
      {cat:"Silver",name:"Peace Dollar",years:"1921–1935",weight:26.73,purity:0.90,asw:0.7734,metal:"silver",notes:"Last circulating silver dollar"},
      {cat:"Silver",name:"Walking Liberty Half",years:"1916–1947",weight:12.50,purity:0.90,asw:0.3617,metal:"silver",notes:"Most beloved US half dollar"},
      {cat:"Silver",name:"Franklin Half Dollar",years:"1948–1963",weight:12.50,purity:0.90,asw:0.3617,metal:"silver",notes:"Full Bell Lines = premium"},
      {cat:"Silver",name:"Kennedy Half (90%)",years:"1964 only",weight:12.50,purity:0.90,asw:0.3617,metal:"silver",notes:"Only year of 90% silver Kennedy"},
      {cat:"Silver",name:"Kennedy Half (40%)",years:"1965–1970",weight:11.50,purity:0.40,asw:0.1479,metal:"silver",notes:"40% silver — all worth more than face"},
      {cat:"Silver",name:"Barber Half Dollar",years:"1892–1915",weight:12.50,purity:0.90,asw:0.3617,metal:"silver",notes:"Scarce series"},
      {cat:"Silver",name:"Washington Quarter (90%)",years:"1932–1964",weight:6.25,purity:0.90,asw:0.1808,metal:"silver",notes:"All pre-1965 quarters = silver"},
      {cat:"Silver",name:"Standing Liberty Quarter",years:"1916–1930",weight:6.25,purity:0.90,asw:0.1808,metal:"silver",notes:"Full Head = premium"},
      {cat:"Silver",name:"Barber Quarter",years:"1892–1916",weight:6.25,purity:0.90,asw:0.1808,metal:"silver",notes:"Scarce in high grade"},
      {cat:"Silver",name:"Roosevelt Dime (90%)",years:"1946–1964",weight:2.50,purity:0.90,asw:0.0723,metal:"silver",notes:"All pre-1965 dimes = silver"},
      {cat:"Silver",name:"Mercury Dime",years:"1916–1945",weight:2.50,purity:0.90,asw:0.0723,metal:"silver",notes:"Full Split Bands = premium"},
      {cat:"Silver",name:"Barber Dime",years:"1892–1916",weight:2.50,purity:0.90,asw:0.0723,metal:"silver",notes:"1894-S = rarest US dime"},
      {cat:"Silver",name:"Seated Liberty Dime",years:"1837–1891",weight:2.50,purity:0.90,asw:0.0723,metal:"silver",notes:"Several design types"},
      {cat:"Silver",name:"Three-Cent Silver (Trime)",years:"1851–1873",weight:0.75,purity:0.75,asw:0.0181,metal:"silver",notes:"Smallest US silver coin"},
      {cat:"Silver",name:"Twenty-Cent Piece",years:"1875–1878",weight:5.00,purity:0.90,asw:0.1447,metal:"silver",notes:"Short-lived denomination"},
      {cat:"Silver",name:"Trade Dollar",years:"1873–1885",weight:27.22,purity:0.90,asw:0.7877,metal:"silver",notes:"Made for Asian trade — heavier than Morgan"},
      {cat:"Silver",name:"Seated Liberty Dollar",years:"1840–1873",weight:26.73,purity:0.90,asw:0.7734,metal:"silver",notes:"Several design types"},
      {cat:"Silver",name:"Wartime Nickel (35%)",years:"1942–1945",weight:5.00,purity:0.35,asw:0.0563,metal:"silver",notes:"Large mintmark above Monticello"},
      // BULLION
      {cat:"Bullion",name:"American Silver Eagle (1 oz)",years:"1986–present",weight:31.10,purity:0.999,asw:1.000,metal:"silver",notes:"Most popular US bullion coin"},
      {cat:"Bullion",name:"American Silver Eagle (Proof)",years:"1986–present",weight:31.10,purity:0.999,asw:1.000,metal:"silver",notes:"Collector proof — same silver, higher premium"},
      // GOLD COINS
      {cat:"Gold",name:"American Gold Eagle (1 oz)",years:"1986–present",weight:33.93,purity:0.9167,asw:1.000,metal:"gold",notes:"Most popular US gold bullion"},
      {cat:"Gold",name:"American Gold Eagle (1/2 oz)",years:"1986–present",weight:16.97,purity:0.9167,asw:0.500,metal:"gold",notes:""},
      {cat:"Gold",name:"American Gold Eagle (1/4 oz)",years:"1986–present",weight:8.48,purity:0.9167,asw:0.250,metal:"gold",notes:""},
      {cat:"Gold",name:"American Gold Eagle (1/10 oz)",years:"1986–present",weight:3.39,purity:0.9167,asw:0.100,metal:"gold",notes:"Most affordable Gold Eagle"},
      {cat:"Gold",name:"American Gold Buffalo (1 oz)",years:"2006–present",weight:31.10,purity:0.9999,asw:1.000,metal:"gold",notes:"24-karat — purest US gold coin"},
      {cat:"Gold",name:"Saint-Gaudens Double Eagle",years:"1907–1933",weight:33.44,purity:0.900,asw:0.9675,metal:"gold",notes:"Most beautiful US coin"},
      {cat:"Gold",name:"Liberty Head Double Eagle ($20)",years:"1849–1907",weight:33.44,purity:0.900,asw:0.9675,metal:"gold",notes:"Type 1, 2 & 3 design variants"},
      {cat:"Gold",name:"Liberty Head Eagle ($10)",years:"1838–1907",weight:16.72,purity:0.900,asw:0.4838,metal:"gold",notes:"No Motto and With Motto types"},
      {cat:"Gold",name:"Indian Head Eagle ($10)",years:"1907–1933",weight:16.72,purity:0.900,asw:0.4838,metal:"gold",notes:"Incuse design"},
      {cat:"Gold",name:"Liberty Head Half Eagle ($5)",years:"1839–1908",weight:8.36,purity:0.900,asw:0.2419,metal:"gold",notes:""},
      {cat:"Gold",name:"Indian Head Half Eagle ($5)",years:"1908–1929",weight:8.36,purity:0.900,asw:0.2419,metal:"gold",notes:"Incuse design"},
      {cat:"Gold",name:"Liberty Head Quarter Eagle ($2.50)",years:"1840–1907",weight:4.18,purity:0.900,asw:0.1210,metal:"gold",notes:""},
      {cat:"Gold",name:"Indian Head Quarter Eagle ($2.50)",years:"1908–1929",weight:4.18,purity:0.900,asw:0.1210,metal:"gold",notes:"Incuse design"},
      // PLATINUM
      {cat:"Platinum",name:"American Platinum Eagle (1 oz)",years:"1997–present",weight:31.10,purity:0.9995,asw:1.000,metal:"platinum",notes:"Only US platinum coin"},
      // CLAD / BASE
      {cat:"Clad",name:"Lincoln Cent (Zinc)",years:"1982–present",weight:2.50,purity:0,asw:0,metal:"clad",notes:"Copper-plated zinc — worth face only"},
      {cat:"Clad",name:"Lincoln Cent (Copper)",years:"1909–1982",weight:3.11,purity:0,asw:0,metal:"copper",notes:"95% copper — worth ~3¢ melt"},
      {cat:"Clad",name:"Jefferson Nickel",years:"1938–present",weight:5.00,purity:0,asw:0,metal:"clad",notes:"Copper-nickel — worth face only"},
      {cat:"Clad",name:"Roosevelt Dime (Clad)",years:"1965–present",weight:2.27,purity:0,asw:0,metal:"clad",notes:"Clad — worth face only"},
      {cat:"Clad",name:"Washington Quarter (Clad)",years:"1965–present",weight:5.67,purity:0,asw:0,metal:"clad",notes:"Clad — worth face only"},
      {cat:"Clad",name:"Kennedy Half Dollar (Clad)",years:"1971–present",weight:11.34,purity:0,asw:0,metal:"clad",notes:"Clad — worth face only"},
      {cat:"Clad",name:"Sacagawea / Presidential Dollar",years:"2000–present",weight:8.10,purity:0,asw:0,metal:"clad",notes:"Manganese brass — worth face only"},
    ];

    async function fetchPrices(){
      setPrices(p=>({...p,loading:true,error:null}));
      try{
        // GoldAPI.io — free, no API key, CORS enabled, real-time
        const [gr,sr,pr]=await Promise.all([
          fetch("https://www.goldapi.io/api/XAU/USD",{headers:{"x-access-token":"goldapi-free"}}),
          fetch("https://www.goldapi.io/api/XAG/USD",{headers:{"x-access-token":"goldapi-free"}}),
          fetch("https://www.goldapi.io/api/XPT/USD",{headers:{"x-access-token":"goldapi-free"}}),
        ]);
        const [gd,sd,pd]=await Promise.all([gr.json(),sr.json(),pr.json()]);
        if(!gd.price||!sd.price)throw new Error("No price data");
        setPrices({gold:gd.price,silver:sd.price,platinum:pd.price||null,updated:new Date(),loading:false,error:null});
      }catch(e){
        // Fallback: api.gold-api.com
        try{
          const [gr2,sr2,pr2]=await Promise.all([
            fetch("https://api.gold-api.com/price/XAU"),
            fetch("https://api.gold-api.com/price/XAG"),
            fetch("https://api.gold-api.com/price/XPT"),
          ]);
          const [gd2,sd2,pd2]=await Promise.all([gr2.json(),sr2.json(),pr2.json()]);
          if(!gd2.price||!sd2.price)throw new Error("No price data from fallback");
          setPrices({gold:gd2.price,silver:sd2.price,platinum:pd2.price||null,updated:new Date(),loading:false,error:null});
        }catch(e2){
          setPrices(p=>({...p,loading:false,error:"Prices unavailable — tap Refresh or check your connection."}));
        }
      }
    }

    React.useEffect(()=>{
      fetchPrices();
      const interval=setInterval(fetchPrices, 5*60*1000); // refresh every 5 minutes
      return ()=>clearInterval(interval);
    },[]);

    function meltVal(coin){
      if(!prices.silver&&!prices.gold&&!prices.platinum)return null;
      if(coin.metal==="silver"&&prices.silver)return coin.asw*prices.silver;
      if(coin.metal==="gold"&&prices.gold)return coin.asw*prices.gold;
      if(coin.metal==="platinum"&&prices.platinum)return coin.asw*prices.platinum;
      if(coin.metal==="copper")return (coin.weight/31.1035)*0.35; // rough copper melt
      return null;
    }

    function fmtPrice(v){if(v==null)return "—";if(v<1)return Math.round(v*100)+"¢";if(v>=1000)return "$"+v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});return "$"+v.toFixed(2);}

    const spotLoaded=prices.silver||prices.gold||prices.platinum;
    const cats=["Silver","Bullion","Gold","Platinum","Clad"];
    const catColors={Silver:"#a0c8d4",Bullion:"#a0c8d4",Gold:C.gold,Platinum:"#c0c8e0",Clad:C.textDim};

    const totalSilverOz=Object.entries(qty).reduce((s,[name,q])=>{
      const c=COINS.find(x=>x.name===name);
      if(c&&c.metal==="silver")return s+(c.asw*(parseInt(q)||0));
      return s;
    },0);
    const totalGoldOz=Object.entries(qty).reduce((s,[name,q])=>{
      const c=COINS.find(x=>x.name===name);
      if(c&&c.metal==="gold")return s+(c.asw*(parseInt(q)||0));
      return s;
    },0);
    const totalMeltValue=Object.entries(qty).reduce((s,[name,q])=>{
      const c=COINS.find(x=>x.name===name);
      if(!c)return s;
      const mv=meltVal(c);
      return mv!=null?s+(mv*(parseInt(q)||0)):s;
    },0);

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="🥈 Metals & Melt Value"/>
        <div style={{padding:"10px 14px"}}>

          {/* Live Spot Prices */}
          <div style={{background:"#0a0f1a",border:"1px solid #1e3a5a",borderRadius:12,padding:"14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <div style={{fontSize:13,color:C.blue,fontWeight:"bold"}}>Kitco Spot Prices</div>
                <div style={{fontSize:10,color:C.textFaint,marginTop:1}}>Source: gold-api.com · Auto-refreshes every 5 min</div>
              </div>
              <button onClick={fetchPrices} disabled={prices.loading}
                style={{padding:"6px 12px",background:"#081620",border:"1px solid #1e4a5a",borderRadius:7,color:C.blue,cursor:"pointer",fontSize:11,fontFamily:"inherit",opacity:prices.loading?0.6:1}}>
                {prices.loading?"Fetching…":"🔄 Refresh"}
              </button>
            </div>
            {prices.error&&<div style={{fontSize:11,color:C.orange,marginBottom:8,padding:"6px 10px",background:"#1e0800",borderRadius:6}}>{prices.error}</div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[
                {label:"Silver",val:prices.silver,unit:"/ troy oz",color:"#a0c8d4",icon:"🥈"},
                {label:"Gold",val:prices.gold,unit:"/ troy oz",color:C.gold,icon:"🥇"},
                {label:"Platinum",val:prices.platinum,unit:"/ troy oz",color:"#c0c8e0",icon:"⚪"},
              ].map(({label,val,unit,color,icon})=>(
                <div key={label} style={{background:C.surface2,borderRadius:10,padding:"12px 8px",textAlign:"center",border:`1px solid ${C.border2}`}}>
                  <div style={{fontSize:18,marginBottom:2}}>{icon}</div>
                  <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{label}</div>
                  <div style={{fontSize:prices.loading?14:18,color:val?color:C.textDim,fontWeight:"bold",lineHeight:1.2}}>
                    {prices.loading?"…":val?"$"+val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):"–"}
                  </div>
                  <div style={{fontSize:9,color:C.textFaint,marginTop:2}}>{unit}</div>
                </div>
              ))}
            </div>
            {prices.updated&&<div style={{fontSize:10,color:C.textFaint,textAlign:"center",marginTop:8}}>Updated {prices.updated.toLocaleTimeString()}</div>}
          </div>

          {/* Running total if qty entered */}
          {totalMeltValue>0&&(
            <div style={{background:"#1a1608",border:`1px solid ${C.gold}`,borderRadius:12,padding:"14px",marginBottom:12}}>
              <div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Your Running Melt Total</div>
              <div style={{fontSize:28,color:C.goldBright,fontWeight:"bold",marginBottom:6}}>{fmtPrice(totalMeltValue)}</div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {totalSilverOz>0&&<span style={{fontSize:11,color:"#a0c8d4"}}>{totalSilverOz.toFixed(4)} oz silver</span>}
                {totalGoldOz>0&&<span style={{fontSize:11,color:C.gold}}>{totalGoldOz.toFixed(4)} oz gold</span>}
              </div>
              <button onClick={()=>setQty({})} style={{marginTop:10,width:"100%",padding:"8px",background:"transparent",color:C.textDim,border:`1px solid ${C.border2}`,borderRadius:7,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Clear All Quantities</button>
            </div>
          )}

          {/* Coin tables by category */}
          {cats.map(cat=>{
            const catCoins=COINS.filter(c=>c.cat===cat);
            if(!catCoins.length)return null;
            const catColor=catColors[cat];
            return(
              <div key={cat} style={{marginBottom:16}}>
                <div style={{fontSize:12,color:catColor,fontWeight:"bold",letterSpacing:".08em",textTransform:"uppercase",marginBottom:8,paddingBottom:6,borderBottom:`1px solid ${C.border2}`}}>{cat} Coins</div>
                {catCoins.map((coin,i)=>{
                  const mv=meltVal(coin);
                  const q=parseInt(qty[coin.name])||0;
                  return(
                    <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:7}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,color:C.text,fontWeight:"bold",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{coin.name}</div>
                          <div style={{fontSize:10,color:C.textDim,marginTop:1}}>{coin.years}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:15,color:mv!=null?catColor:C.textDim,fontWeight:"bold"}}>{spotLoaded?fmtPrice(mv):"…"}</div>
                          <div style={{fontSize:9,color:C.textFaint}}>melt / coin</div>
                        </div>
                      </div>

                      {/* Specs row */}
                      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                        <span style={{fontSize:10,color:C.textDim,background:C.surface2,borderRadius:4,padding:"2px 7px"}}>{coin.weight}g total</span>
                        {coin.purity>0&&<span style={{fontSize:10,color:catColor,background:C.surface2,borderRadius:4,padding:"2px 7px"}}>{(coin.purity*100).toFixed(coin.purity===0.9999?2:0)}% {coin.metal}</span>}
                        {coin.asw>0&&<span style={{fontSize:10,color:C.textDim,background:C.surface2,borderRadius:4,padding:"2px 7px"}}>{coin.asw.toFixed(4)} troy oz</span>}
                        {coin.notes&&<span style={{fontSize:10,color:C.textFaint,background:C.surface2,borderRadius:4,padding:"2px 7px"}}>{coin.notes}</span>}
                      </div>

                      {/* Quantity counter */}
                      {coin.metal!=="clad"&&(
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".06em",marginRight:4}}>Qty:</div>
                          <button onClick={()=>setQty(p=>({...p,[coin.name]:Math.max(0,(parseInt(p[coin.name])||0)-1)}))}
                            style={{width:32,height:32,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>−</button>
                          <input
                            type="number"
                            min="0"
                            value={qty[coin.name]||""}
                            onChange={e=>setQty(p=>({...p,[coin.name]:e.target.value}))}
                            placeholder="0"
                            style={{width:52,textAlign:"center",padding:"6px 4px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:14,fontFamily:"inherit",outline:"none"}}
                          />
                          <button onClick={()=>setQty(p=>({...p,[coin.name]:(parseInt(p[coin.name])||0)+1}))}
                            style={{width:32,height:32,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>+</button>
                          {q>0&&mv!=null&&<div style={{fontSize:13,color:catColor,fontWeight:"bold",marginLeft:4}}>{fmtPrice(mv*q)}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div style={{fontSize:10,color:C.textFaint,lineHeight:1.6,padding:"10px 4px"}}>
            ⚠ Melt values are for reference only. US coins cannot legally be melted for profit. Actual resale value depends on numismatic premium, grade, and market conditions. Always check PCGS or Heritage for collector value before selling silver for melt.
          </div>
        </div>
      </div>
    );
  }

  // ── WANT LIST ─────────────────────────────────────────────────────────────
