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
import { COIN_REF, GRADE_KEYS } from '../data/coinSeries';

export default function ReferenceScreen(){
    const refData=refSeries?COIN_REF[refSeries]:null;
    const gradeIdx=GRADE_KEYS.indexOf(refGrade);
    const keyDates=refData?Object.keys(refData.keyDates||{}):[];
    const typVal=refData&&gradeIdx>=0?refData.typical[gradeIdx]:null;
    const kdVal=refKeyDate&&refData&&gradeIdx>=0?refData.keyDates[refKeyDate]?.[gradeIdx]:null;
    const trend=refSeries?TRENDS[refSeries]:null;
    const trendCfg=trend?TREND_CONFIG[trend.trend]:null;

    const LINKS = [
      {
        section:"📕 Price Guides (Retail & Wholesale)",
        items:[
          {label:"PCGS Price Guide",desc:"Retail — what dealers ask. Most widely used US coin price guide.",url:"https://www.pcgs.com/prices",badge:"RETAIL"},
          {label:"NGC Price Guide",desc:"Retail — NGC's equivalent. Good second opinion on values.",url:"https://www.ngccoin.com/price-guide/united-states/",badge:"RETAIL"},
          {label:"CDN Greysheet — Wholesale",desc:"The online Blue Book. What dealers pay each other — real wholesale bid/ask prices updated daily. Closest to what you'll actually get when selling.",url:"https://www.greysheet.com/coin-prices",badge:"WHOLESALE"},
          {label:"Blue Book on Amazon",desc:"Official Blue Book (Handbook of US Coins) — $10 paperback. Whitman's printed wholesale guide used by dealers. No free online version exists.",url:"https://www.amazon.com/s?k=official+blue+book+handbook+united+states+coins+whitman",badge:"WHOLESALE"},
          {label:"Red Book on Amazon",desc:"Official Red Book (Guide Book of US Coins) — $18 book. No free website — redbook.com is a women's magazine, not coins. Buy the actual book here.",url:"https://www.amazon.com/s?k=official+red+book+guide+book+united+states+coins+whitman",badge:"RETAIL"},
          {label:"USA CoinBook",desc:"Free online retail price guide — best free substitute for Red Book prices. Covers most US coins by date and grade.",url:"https://www.usacoinbook.com",badge:"RETAIL"},
        ]
      },
      {
        section:"🔨 Actual Sold Prices (Best for Real Value)",
        items:[
          {label:"Heritage Auctions",desc:"Largest US coin auction house. Search past sales to see REAL prices coins actually sold for — the most accurate value source.",url:"https://coins.ha.com",badge:"AUCTION"},
          {label:"Stack's Bowers",desc:"Major auction house. Excellent for Morgan/Peace dollars, bust coins, gold.",url:"https://www.stacksbowers.com",badge:"AUCTION"},
          {label:"GreatCollections",desc:"Online auction — great for certified coins. Shows real sold prices.",url:"https://www.greatcollections.com",badge:"AUCTION"},
          {label:"eBay Sold Listings",desc:"Search any coin + 'sold' to see what buyers ACTUALLY paid in the last 90 days. Filter: Completed Items → Sold.",url:"https://www.ebay.com/sch/i.html?_nkw=coin&LH_Complete=1&LH_Sold=1",badge:"SOLD"},
        ]
      },
      {
        section:"🔍 Lookup & Verify",
        items:[
          {label:"PCGS CoinFacts",desc:"Population reports, auction history, variety info, photos. Essential for any coin you think might be valuable.",url:"https://www.pcgs.com/coinfacts",badge:"LOOKUP"},
          {label:"NGC Coin Explorer",desc:"NGC's equivalent to CoinFacts — population data, auction prices, variety attribution.",url:"https://www.ngccoin.com/coin-explorer/",badge:"LOOKUP"},
          {label:"PCGS Verify",desc:"Verify any PCGS-slabbed coin is genuine by cert number.",url:"https://www.pcgs.com/cert",badge:"VERIFY"},
          {label:"NGC Verify",desc:"Verify any NGC-slabbed coin is genuine by cert number.",url:"https://www.ngccoin.com/certlookup/",badge:"VERIFY"},
          {label:"VarietyVista",desc:"Best resource for doubled die and RPM variety identification with photos.",url:"https://varietyvista.com",badge:"VARIETY"},
          {label:"VAMworld (Morgans)",desc:"Complete Morgan & Peace dollar VAM variety database. Essential for silver dollar collectors.",url:"https://www.vamworld.com",badge:"VARIETY"},
        ]
      },
      {
        section:"🥈 Silver & Gold Spot Prices",
        items:[
          {label:"Kitco — Silver Spot",desc:"Live silver spot price. Multiply by 0.7234 for Morgan/Peace dollar silver value, 0.0723 for dimes, 0.1808 for quarters.",url:"https://www.kitco.com/charts/livesilver.html",badge:"SPOT"},
          {label:"Kitco — Gold Spot",desc:"Live gold spot price. American Gold Eagle (1oz) = spot + ~5% premium.",url:"https://www.kitco.com/charts/livegold.html",badge:"SPOT"},
          {label:"CoinTrackers — Melt Value",desc:"Calculates melt value for any US coin based on live spot prices.",url:"https://www.cointrackers.com/melt/",badge:"MELT"},
        ]
      },
      {
        section:"📚 Error & Variety Resources",
        items:[
          {label:"CONECA — Error Coins",desc:"The authority on error and variety coins. Lists, attribution, education.",url:"https://conecaonline.org",badge:"ERRORS"},
          {label:"Wexler Doubled Dies",desc:"Complete doubled die reference database for Lincoln cents and other series.",url:"https://doubleddie.com",badge:"DDO/DDR"},
          {label:"Cherrypickers' Guide",desc:"The book for die varieties. Look up FS numbers for attribution.",url:"https://www.pcgs.com/coinfacts/vam/1",badge:"VARIETY"},
          {label:"PCGS — Top 100 Morgan VAMs",desc:"The 100 most important Morgan dollar varieties with photos and values.",url:"https://www.pcgs.com/coinfacts/vam/1",badge:"VAMS"},
        ]
      },
    ];

    const badgeColor={RETAIL:"#5dba82",WHOLESALE:"#e07a3a",AUCTION:"#c8a84b",SOLD:"#5d9eba",LOOKUP:"#b05dea",VERIFY:"#5d9eba",VARIETY:"#c05dba",SPOT:"#c8a84b",MELT:"#7a6a44",ERRORS:"#ea5d5d","DDO/DDR":"#ea5d5d",VAMS:"#c8a84b"};

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="📖 Coin Reference"/>
        <div style={{padding:"12px 14px"}}>
          <div style={{fontSize:12,color:C.textDim,marginBottom:14}}>Baseline values by series and grade. Always verify at PCGS.com.</div>

          {/* QUICK LINKS SECTION */}
          <div style={{...card,background:"#0a0f1a",border:"1px solid #1e3a5a",marginBottom:12}}>
            <div style={{...secT,color:"#5d9eba"}}>🔗 Quick Reference Links</div>
            <div style={{fontSize:11,color:C.textDim,marginBottom:10}}>Tap any link to open in browser. Your personal pricing toolkit.</div>
            {LINKS.map((group,gi)=>(
              <div key={gi} style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.gold,fontWeight:"bold",marginBottom:6,letterSpacing:".06em"}}>{group.section}</div>
                {group.items.map((item,ii)=>(
                  <a key={ii} href={item.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 10px",background:C.surface2,borderRadius:8,marginBottom:5,textDecoration:"none",border:`1px solid ${C.border2}`}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,color:C.text,fontWeight:"bold",marginBottom:2}}>{item.label}</div>
                      <div style={{fontSize:11,color:C.textDim,lineHeight:1.4}}>{item.desc}</div>
                    </div>
                    <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                      <span style={{fontSize:9,color:badgeColor[item.badge]||C.textDim,background:"rgba(0,0,0,.4)",border:`1px solid ${badgeColor[item.badge]||C.border}`,borderRadius:3,padding:"1px 5px",letterSpacing:".06em",whiteSpace:"nowrap"}}>{item.badge}</span>
                      <span style={{fontSize:16,color:C.textDim}}>›</span>
                    </div>
                  </a>
                ))}
              </div>
            ))}
            <div style={{fontSize:10,color:C.textFaint,marginTop:8,lineHeight:1.5}}>
              💡 <strong style={{color:C.textDim}}>Red Book vs Blue Book:</strong> Neither has a free website — both are physical books ($10–$18 on Amazon). The Red Book = retail (what you'd pay to buy). The Blue Book = wholesale (what dealers pay you). Online, <strong style={{color:C.textDim}}>Greysheet = Blue Book equivalent</strong> updated daily. For free retail lookups, use USA CoinBook or PCGS Price Guide.
            </div>
          </div>

          <div style={card}>
            <div style={secT}>Select Series</div>
            <select style={inp} value={refSeries} onChange={e=>{setRefSeries(e.target.value);setRefKeyDate("");}}>
              <option value="">Choose a series…</option>
              {DENOM_ORDER.map(d=>{const entries=Object.entries(COIN_REF).filter(([,v])=>v.denom===d);return entries.length?<optgroup key={d} label={`── ${d} ──`}>{entries.map(([n])=><option key={n} value={n}>{n}</option>)}</optgroup>:null;})}
            </select>
            {refData&&<div style={{marginTop:10,background:C.bg,border:`1px solid ${C.border2}`,borderRadius:8,padding:"10px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                <div style={{fontSize:13,color:C.gold,fontWeight:"bold"}}>{refSeries}</div>
                {trendCfg&&<span style={{fontSize:10,color:trendCfg.color,background:trendCfg.bg,border:`1px solid ${trendCfg.color}44`,borderRadius:4,padding:"2px 6px"}}>{trendCfg.icon} {trendCfg.label}</span>}
              </div>
              <div style={{fontSize:11,color:C.textDim}}>{refData.denom} · {refData.metal} · {refData.years}</div>
              {trend&&<div style={{fontSize:11,color:trendCfg.color,marginTop:4}}>{trend.note}</div>}
              <div style={{fontSize:11,color:C.orange,marginTop:4}}>⚠ Key dates: {refData.note}</div>
            </div>}
          </div>
          {refData&&<>
            <div style={card}>
              <div style={secT}>Select Grade</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {GRADE_KEYS.map(g=>(
                  <button key={g} onClick={()=>setRefGrade(g)} style={{padding:"8px 10px",fontFamily:"inherit",cursor:"pointer",fontSize:12,borderRadius:8,background:refGrade===g?"#2a1f08":C.surface2,border:`1px solid ${refGrade===g?C.gold:C.border}`,color:refGrade===g?C.gold:C.textDim,minWidth:52,textAlign:"center"}}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{...card,background:"#1a1608",border:`1px solid ${C.gold}`}}>
              <div style={secT}>Typical Date at {refGrade}</div>
              <div style={{fontSize:36,color:C.goldBright,fontWeight:"bold",marginBottom:4}}>
                {typVal==null?"N/A":typVal<1?""+Math.round(typVal*100)+"¢":typVal>=1000?"$"+typVal.toLocaleString():"$"+typVal.toFixed(2)}
              </div>
              <div style={{fontSize:11,color:C.textDim}}>General market average for common dates</div>
            </div>
            {keyDates.length>0&&<div style={card}>
              <div style={secT}>Key Date Lookup</div>
              <select style={inp} value={refKeyDate} onChange={e=>setRefKeyDate(e.target.value)}>
                <option value="">Select a key date…</option>
                {keyDates.map(kd=><option key={kd} value={kd}>{kd}</option>)}
              </select>
              {refKeyDate&&<div style={{marginTop:12,background:"#1e0800",border:"1px solid #6b3a10",borderRadius:10,padding:"14px"}}>
                <div style={{fontSize:14,color:C.orange,fontWeight:"bold",marginBottom:4}}>{refKeyDate}</div>
                <div style={{fontSize:11,color:C.textDim,marginBottom:10}}>at {refGrade}</div>
                <div style={{fontSize:32,color:C.orange,fontWeight:"bold"}}>{kdVal==null?"Not graded at this level":kdVal>=1000?"$"+kdVal.toLocaleString():"$"+kdVal.toFixed(2)}</div>
              </div>}
            </div>}
            <div style={card}>
              <div style={secT}>Full Value Table — {refSeries}</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr>
                    <th style={{textAlign:"left",padding:"6px 8px",color:C.textDim,fontSize:10,borderBottom:`1px solid ${C.border2}`,fontWeight:"normal",letterSpacing:".08em"}}>GRADE</th>
                    <th style={{textAlign:"right",padding:"6px 8px",color:C.textDim,fontSize:10,borderBottom:`1px solid ${C.border2}`,fontWeight:"normal",letterSpacing:".08em"}}>TYPICAL</th>
                    {refKeyDate&&<th style={{textAlign:"right",padding:"6px 8px",color:C.orange,fontSize:10,borderBottom:`1px solid ${C.border2}`,fontWeight:"normal",letterSpacing:".08em"}}>{refKeyDate}</th>}
                  </tr></thead>
                  <tbody>
                    {GRADE_KEYS.map((g,i)=>{
                      const tv=refData.typical[i];const kv=refKeyDate?refData.keyDates[refKeyDate]?.[i]:null;const isSel=g===refGrade;
                      return(<tr key={g} onClick={()=>setRefGrade(g)} style={{cursor:"pointer",background:isSel?"rgba(200,168,75,.08)":"transparent"}}>
                        <td style={{padding:"8px",color:isSel?C.gold:C.textDim,fontWeight:isSel?"bold":"normal",borderBottom:`1px solid ${C.border2}`}}>{g}</td>
                        <td style={{padding:"8px",textAlign:"right",color:isSel?C.goldBright:C.text,fontWeight:isSel?"bold":"normal",borderBottom:`1px solid ${C.border2}`}}>{tv==null?"—":tv>=1000?"$"+tv.toLocaleString():tv<1?""+Math.round(tv*100)+"¢":"$"+tv.toFixed(2)}</td>
                        {refKeyDate&&<td style={{padding:"8px",textAlign:"right",color:isSel?C.orange:C.orange+"99",fontWeight:isSel?"bold":"normal",borderBottom:`1px solid ${C.border2}`}}>{kv==null?"—":kv>=1000?"$"+kv.toLocaleString():"$"+kv.toFixed(2)}</td>}
                      </tr>);
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>}
          {!refSeries&&<div style={card}>
            <div style={secT}>Market Trends</div>
            {Object.entries(TREND_CONFIG).map(([key,cfg])=>{
              const inTrend=Object.entries(TRENDS).filter(([,v])=>v.trend===key);
              if(!inTrend.length)return null;
              return(<div key={key} style={{marginBottom:14}}>
                <div style={{fontSize:12,color:cfg.color,fontWeight:"bold",marginBottom:6}}>{cfg.icon} {cfg.label} ({inTrend.length} series)</div>
                {inTrend.map(([series,data])=>(
                  <div key={series} onClick={()=>setRefSeries(series)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border2}`,cursor:"pointer"}}>
                    <span style={{fontSize:12,color:C.text}}>{series}</span>
                    <span style={{fontSize:10,color:C.textFaint,maxWidth:140,textAlign:"right"}}>{data.note}</span>
                  </div>
                ))}
              </div>);
            })}
          </div>}
        </div>
      </div>
    );
  }

  // ── COLLECTIBLES ───────────────────────────────────────────────────────────
