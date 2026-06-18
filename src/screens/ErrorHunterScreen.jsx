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
import { MOST_WANTED, ERROR_GUIDE, CHECKLIST_BY_DENOM } from '../data/errorData';

export default function ErrorHunterScreen(){
    const [hunterTab,setHunterTab]=useState("mostwanted");
    const [checkedItems,setCheckedItems]=useState({});
    const [expandedGuide,setExpandedGuide]=useState(null);
    const [expandedWanted,setExpandedWanted]=useState(null);
    const [denomF,setDenomF]=useState("All");

    const denomFilter=["All","1¢","5¢","10¢","25¢","50¢","$1","Any"];
    const filteredWanted=MOST_WANTED.filter(c=>denomF==="All"||c.denomination===denomF);

    const allCheckIds=Object.values(CHECKLIST_BY_DENOM).flat().map(i=>i.id);
    const checkedCount=allCheckIds.filter(id=>checkedItems[id]).length;
    const toggleCheck=(id)=>setCheckedItems(p=>({...p,[id]:!p[id]}));

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="⚠️ Error Hunter"/>
        <div style={{padding:"10px 14px"}}>
          <div style={{background:"#1e0800",border:"1px solid #6b3a10",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
            <div style={{fontSize:13,color:C.orange,fontWeight:"bold",marginBottom:4}}>Your Pocket Change Could Be Worth Thousands</div>
            <div style={{fontSize:12,color:"#c87a3a",lineHeight:1.6}}>Error coins are mint mistakes that slipped past quality control. This guide covers what to look for, how to spot it, and which specific coins are worth hunting — right at the coin show or roll hunting session.</div>
          </div>

          <div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
            {[["mostwanted","🎯 Most Wanted"],["guide","📋 Spot Guide"],["checklist","✅ Checklist"],["tips","💡 Auth Tips"]].map(([t,l])=>(
              <button key={t} onClick={()=>setHunterTab(t)} style={{padding:"8px 12px",fontFamily:"inherit",fontSize:11,cursor:"pointer",borderRadius:8,background:hunterTab===t?"#2a0808":"transparent",color:hunterTab===t?C.orange:C.textDim,border:hunterTab===t?"1px solid #6b3a10":"1px solid transparent",whiteSpace:"nowrap",flexShrink:0}}>{l}</button>
            ))}
          </div>

          {/* ── MOST WANTED ── */}
          {hunterTab==="mostwanted"&&<>
            <div style={{fontSize:12,color:C.textDim,marginBottom:10}}>Specific error coins worth hunting — by date, mint mark, and what to look for.</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
              {denomFilter.map(d=>(
                <button key={d} onClick={()=>setDenomF(d)} style={{padding:"6px 10px",fontFamily:"inherit",fontSize:11,cursor:"pointer",borderRadius:6,background:denomF===d?"#2a1f08":C.surface2,color:denomF===d?C.gold:C.textDim,border:`1px solid ${denomF===d?C.border:C.border2}`}}>{d}</button>
              ))}
            </div>
            {filteredWanted.map((coin,i)=>{
              const isOpen=expandedWanted===i;
              return(
                <div key={i} style={{background:C.surface,border:`1px solid ${coin.hot?"#6b3a10":C.border}`,borderRadius:10,marginBottom:8,overflow:"hidden"}}>
                  <div onClick={()=>setExpandedWanted(isOpen?null:i)} style={{padding:"12px 14px",cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{fontSize:13,color:coin.hot?C.orange:C.gold,fontWeight:"bold"}}>{coin.coin}</span>
                          {coin.hot&&<span style={{fontSize:9,color:C.orange,background:"#2a0808",border:"1px solid #6b3a10",borderRadius:4,padding:"1px 5px"}}>🔥 HOT</span>}
                        </div>
                        <div style={{fontSize:11,color:C.textDim,marginTop:2}}>{coin.type} · {coin.denomination}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:12,color:C.green,fontWeight:"bold"}}>{coin.value}</div>
                        <div style={{fontSize:9,color:RARITY_CLR[coin.rarity]||C.textDim}}>{coin.rarity}</div>
                      </div>
                    </div>
                  </div>
                  {isOpen&&<div style={{borderTop:`1px solid ${C.border2}`,padding:"10px 14px 12px"}}>
                    <div style={{background:C.surface2,borderRadius:6,padding:"8px 10px",marginBottom:8}}>
                      <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>How to Spot It</div>
                      <div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{coin.howToSpot}</div>
                    </div>
                    {coin.tips&&<div style={{background:"#1a0e00",border:"1px solid #5a3a10",borderRadius:6,padding:"8px 10px",marginBottom:10}}>
                      <div style={{fontSize:10,color:C.orange,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>💡 Pro Tips</div>
                      <div style={{fontSize:12,color:"#c87a3a",lineHeight:1.5}}>{coin.tips}</div>
                    </div>}
                    <button onClick={()=>openAddCoin("error",{errorBaseCoin:coin.coin,errorType:coin.type})} style={{width:"100%",padding:"9px",background:"#1e0800",color:C.orange,border:"1px solid #6b3a10",borderRadius:7,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>+ Log This Error Coin</button>
                  </div>}
                </div>
              );
            })}
            <div style={{...card,background:"#080808",border:`1px solid ${C.border2}`,marginTop:8}}>
              <div style={{fontSize:11,color:C.textFaint,lineHeight:1.6}}>Values are ranges from auction records and dealer prices. Actual value depends heavily on grade and authentication. Always verify with PCGS.com or NGC.com before buying/selling.</div>
            </div>
          </>}

          {/* ── SPOT GUIDE ── */}
          {hunterTab==="guide"&&<>
            <div style={{fontSize:12,color:C.textDim,marginBottom:14}}>How to identify each error type. Tap any error to expand the full spotting guide.</div>
            {ERROR_GUIDE.map((err,i)=>{
              const isOpen=expandedGuide===i;
              return(
                <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:8,overflow:"hidden"}}>
                  <div onClick={()=>setExpandedGuide(isOpen?null:i)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:22,flexShrink:0}}>{err.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:C.orange,fontWeight:"bold"}}>{err.type}</div>
                      <div style={{fontSize:11,color:C.green}}>{err.value}</div>
                    </div>
                    <span style={{fontSize:18,color:C.textDim,transform:isOpen?"rotate(90deg)":"rotate(0deg)",display:"inline-block",transition:"transform .2s",flexShrink:0}}>›</span>
                  </div>
                  {isOpen&&<div style={{borderTop:`1px solid ${C.border2}`,padding:"12px 14px"}}>
                    <div style={{background:C.surface2,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
                      <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}}>How to Spot It</div>
                      <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{err.howToSpot}</div>
                    </div>
                    <div style={{background:"#0a1408",border:"1px solid #1a3a1a",borderRadius:6,padding:"8px 10px",marginBottom:10}}>
                      <div style={{fontSize:10,color:C.green,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>🔧 Tools Needed</div>
                      <div style={{fontSize:12,color:C.text}}>{err.tools}</div>
                    </div>
                    {err.quickTest&&<div style={{background:"#0a0f1a",border:"1px solid #1a2a4a",borderRadius:6,padding:"8px 10px",marginBottom:10}}>
                      <div style={{fontSize:10,color:C.blue,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>⚡ Quick Field Test</div>
                      <div style={{fontSize:12,color:C.text}}>{err.quickTest}</div>
                    </div>}
                    <div style={{background:"#1e0800",border:"1px solid #6b1a00",borderRadius:6,padding:"8px 10px"}}>
                      <div style={{fontSize:10,color:C.orange,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>⚠ Watch Out For</div>
                      <div style={{fontSize:12,color:"#c87a3a",lineHeight:1.5}}>{err.warning}</div>
                    </div>
                  </div>}
                </div>
              );
            })}
          </>}

          {/* ── CHECKLIST ── */}
          {hunterTab==="checklist"&&<>
            <div style={{...card,background:"#1a1608",border:`1px solid ${C.gold}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:13,color:C.gold,fontWeight:"bold"}}>Coin Roll Hunting Checklist</div>
                <div style={{fontSize:12,color:checkedCount===allCheckIds.length?C.green:C.gold}}>{checkedCount}/{allCheckIds.length}</div>
              </div>
              <div style={{height:4,background:C.border2,borderRadius:2,overflow:"hidden",marginTop:8}}>
                <div style={{width:`${allCheckIds.length?(checkedCount/allCheckIds.length)*100:0}%`,height:"100%",background:checkedCount===allCheckIds.length?C.green:C.gold,borderRadius:2,transition:"width .3s"}}/>
              </div>
              <div style={{fontSize:11,color:C.textDim,marginTop:6}}>Tap each item as you check it. Organized by denomination.</div>
            </div>

            {Object.entries(CHECKLIST_BY_DENOM).map(([section,items])=>{
              const sectionChecked=items.filter(i=>checkedItems[i.id]).length;
              return(
                <div key={section} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,paddingBottom:6,borderBottom:`1px solid ${C.border2}`}}>
                    <div style={{fontSize:12,color:C.gold,fontWeight:"bold"}}>{section}</div>
                    <div style={{fontSize:11,color:sectionChecked===items.length?C.green:C.textDim}}>{sectionChecked}/{items.length}</div>
                  </div>
                  {items.map(item=>(
                    <div key={item.id} onClick={()=>toggleCheck(item.id)} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"11px 12px",background:checkedItems[item.id]?"#0a1808":C.surface,border:`1px solid ${checkedItems[item.id]?"#2d4d2d":C.border}`,borderRadius:10,marginBottom:6,cursor:"pointer"}}>
                      <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${checkedItems[item.id]?C.green:C.border}`,background:checkedItems[item.id]?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                        {checkedItems[item.id]&&<span style={{fontSize:13,color:"#0a1808",fontWeight:"bold"}}>✓</span>}
                      </div>
                      <div style={{fontSize:12,color:checkedItems[item.id]?C.textDim:C.text,lineHeight:1.5,textDecoration:checkedItems[item.id]?"line-through":"none"}}>{item.text}</div>
                    </div>
                  ))}
                </div>
              );
            })}
            <button onClick={()=>setCheckedItems({})} style={{width:"100%",padding:"11px",background:"transparent",color:C.textFaint,border:`1px solid ${C.border2}`,borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"inherit",marginTop:4}}>Reset Checklist</button>
          </>}

          {/* ── AUTH TIPS ── */}
          {hunterTab==="tips"&&<>
            <div style={{fontSize:12,color:C.textDim,marginBottom:14}}>Authentication and submission tips — how to go from finding a possible error to getting it certified and sold.</div>
            {[
              {icon:"🔍",title:"Loupe & Microscope",body:"A 10x loupe is the minimum. For subtle doubled dies and RPMs, a 16x–30x stereo microscope is ideal. Use a single point light source — not diffused overhead lighting. Rotate the coin slowly under the light."},
              {icon:"⚖️",title:"Always Weigh First",body:"A 0.01g digital scale is the single most useful tool for identifying wrong planchet errors. Wrong weights catch errors that look completely normal. Compare to published standard weights for each denomination."},
              {icon:"🧲",title:"Magnet Test for 1943–1944",body:"Before anything else: test every 1943 and 1944 cent with a strong magnet. Copper sticks to nothing; steel sticks to a magnet. This is a 2-second test that could reveal a coin worth $100,000+."},
              {icon:"📸",title:"Photograph Before Handling",body:"Before doing anything else with a suspected error, photograph both sides in good natural light. This protects you and establishes condition. Use a flat surface with a neutral background."},
              {icon:"🚫",title:"Never Clean Error Coins",body:"Cleaning destroys value — period. Don't dip, polish, rub, or use any cleaner on a suspected error coin. Even 'cleaning' to see it better will drop the value dramatically. Original surfaces are everything."},
              {icon:"📬",title:"When to Submit to PCGS/NGC",body:"Submit any error coin potentially worth $50+. Submission fees run $30–$100 per coin depending on service level. For very valuable suspected errors ($500+), use the Express or Walk-Through service. Both services authenticate AND grade."},
              {icon:"🤔",title:"Machine Doubling vs True DDO",body:"The #1 false alarm in error hunting. Machine doubling (MD) has a flat, shelf-like secondary image and is worth nothing. True doubled dies show two rounded, equal-depth images with split serifs. When in doubt, post to CONECA or CoinTalk forums before submitting."},
              {icon:"📖",title:"Resources to Bookmark",body:"PCGS.com/prices — current market values. NGC.com/coin/search — population reports. VarietyVista.com — doubled die photography. CONECA.net — error coin community and resources. CoinTalk.com — free expert identification help."},
              {icon:"💰",title:"Where to Sell Error Coins",body:"Heritage Auctions and Stack's Bowers for high-value errors ($500+). eBay works well for mid-range errors with clear photos and honest descriptions. Always sell slabbed (certified) for anything worth $100+. Raw error coins sell for 20–40% less than slabbed."},
            ].map((tip,i)=>(
              <div key={i} style={{...card,border:`1px solid ${C.border}`}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{fontSize:24,flexShrink:0}}>{tip.icon}</span>
                  <div>
                    <div style={{fontSize:13,color:C.gold,fontWeight:"bold",marginBottom:6}}>{tip.title}</div>
                    <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{tip.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </>}
        </div>
      </div>
    );
  }

  // ── STATS ──────────────────────────────────────────────────────────────────
