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
import { SET_TEMPLATES } from '../data/setsData';

export default function SetRegistryScreen(){
    const SET_TEMPLATES=[
      {name:"Morgan Dollar Set (P,D,S,O,CC)",dates:["1878","1879","1879-S","1879-O","1879-CC","1880","1880-S","1880-O","1880-CC","1881","1881-S","1881-O","1881-CC","1882","1882-S","1882-O","1882-CC","1883","1883-S","1883-O","1883-CC","1884","1884-S","1884-O","1884-CC","1885","1885-S","1885-O","1885-CC","1886","1886-S","1886-O","1887","1887-S","1887-O","1888","1888-S","1888-O","1889","1889-S","1889-O","1889-CC","1890","1890-S","1890-O","1890-CC","1891","1891-S","1891-O","1891-CC","1892","1892-S","1892-O","1892-CC","1893","1893-S","1893-O","1893-CC","1894","1894-S","1894-O","1895 Proof","1895-S","1895-O","1896","1896-S","1896-O","1897","1897-S","1897-O","1898","1898-S","1898-O","1899","1899-S","1899-O","1900","1900-S","1900-O","1901","1901-S","1901-O","1902","1902-S","1902-O","1903","1903-S","1903-O","1904","1904-S","1904-O","1921","1921-D","1921-S"]},
      {name:"Peace Dollar Set",dates:["1921","1922","1922-D","1922-S","1923","1923-D","1923-S","1924","1924-S","1925","1925-S","1926","1926-D","1926-S","1927","1927-D","1927-S","1928","1928-S","1934","1934-D","1934-S","1935","1935-S"]},
      {name:"Mercury Dime Set",dates:["1916","1916-D","1916-S","1917","1917-D","1917-S","1918","1918-D","1918-S","1919","1919-D","1919-S","1920","1920-D","1920-S","1921","1921-D","1923","1923-S","1924","1924-D","1924-S","1925","1925-D","1925-S","1926","1926-D","1926-S","1927","1927-D","1927-S","1928","1928-D","1928-S","1929","1929-D","1929-S","1930","1930-S","1931","1931-D","1931-S","1934","1934-D","1934-S","1935","1935-D","1935-S","1936","1936-D","1936-S","1937","1937-D","1937-S","1938","1938-D","1939","1939-D","1939-S","1940","1940-D","1940-S","1941","1941-D","1941-S","1942","1942-D","1942/1","1942/1-D","1942-S","1943","1943-D","1943-S","1944","1944-D","1944-S","1945","1945-D","1945-S","1945-S Micro S"]},
      {name:"Walking Liberty Half Set",dates:["1916","1916-D","1916-S","1917","1917-D","1917-S","1918","1918-D","1918-S","1919","1919-D","1919-S","1920","1920-D","1920-S","1921","1921-D","1921-S","1923-S","1927-S","1928-S","1929-D","1929-S","1933-S","1934","1934-D","1934-S","1935","1935-D","1935-S","1936","1936-D","1936-S","1937","1937-D","1937-S","1938","1938-D","1939","1939-D","1940","1940-S","1941","1941-D","1941-S","1942","1942-D","1942-S","1943","1943-D","1943-S","1944","1944-D","1944-S","1945","1945-D","1945-S","1946","1946-D","1946-S","1947","1947-D"]},
      {name:"Lincoln Wheat Cent Set",dates:["1909","1909-S","1909-S VDB","1909 VDB","1910","1910-S","1911","1911-D","1911-S","1912","1912-D","1912-S","1913","1913-D","1913-S","1914","1914-D","1914-S","1915","1915-D","1915-S","1916","1916-D","1916-S","1917","1917-D","1917-S","1918","1918-D","1918-S","1919","1919-D","1919-S","1920","1920-D","1920-S","1921","1921-S","1922 Plain","1922-D","1923","1923-S","1924","1924-D","1924-S","1925","1925-D","1925-S","1926","1926-D","1926-S","1927","1927-D","1927-S","1928","1928-D","1928-S","1929","1929-D","1929-S","1930","1930-D","1930-S","1931","1931-D","1931-S","1932","1932-D","1933","1933-D","1934","1934-D","1935","1935-D","1935-S","1936","1936-D","1936-S","1937","1937-D","1937-S","1938","1938-D","1938-S","1939","1939-D","1939-S","1940","1940-D","1940-S","1941","1941-D","1941-S","1942","1942-D","1942-S","1943","1943-D","1943-S","1944","1944-D","1944-S","1945","1945-D","1945-S","1946","1946-D","1946-S","1947","1947-D","1947-S","1948","1948-D","1948-S","1949","1949-D","1949-S","1950","1950-D","1950-S","1951","1951-D","1951-S","1952","1952-D","1952-S","1953","1953-D","1953-S","1954","1954-D","1954-S","1955","1955-D","1955-S","1956","1956-D","1957","1957-D","1958","1958-D"]},
      {name:"Buffalo Nickel Set",dates:["1913 T1","1913-D T1","1913-S T1","1913 T2","1913-D T2","1913-S T2","1914","1914-D","1914-S","1915","1915-D","1915-S","1916","1916-D","1916-S","1917","1917-D","1917-S","1918","1918-D","1918-S","1919","1919-D","1919-S","1920","1920-D","1920-S","1921","1921-S","1923","1923-S","1924","1924-D","1924-S","1925","1925-D","1925-S","1926","1926-D","1926-S","1927","1927-D","1927-S","1928","1928-D","1928-S","1929","1929-D","1929-S","1930","1930-S","1931-S","1934","1934-D","1935","1935-D","1935-S","1936","1936-D","1936-S","1937","1937-D","1937-S","1938-D"]},
    ];

    const [activeSet,setActiveSet]=useState(null);
    const [newSetName,setNewSetName]=useState("");
    const [showNew,setShowNew]=useState(false);

    function startSet(template){
      const newSet={id:Date.now(),name:template.name,dates:template.dates,have:{}};
      setSets(p=>[...p,newSet]);
      setActiveSet(newSet.id);
      showToast("Set started!");
    }
    function toggleDate(setId,date){
      setSets(p=>p.map(s=>s.id===setId?{...s,have:{...s.have,[date]:!s.have[date]}}:s));
    }
    function removeSet(setId){setSets(p=>p.filter(s=>s.id!==setId));if(activeSet===setId)setActiveSet(null);}

    const currentSet=sets.find(s=>s.id===activeSet);
    const haveCount=currentSet?Object.values(currentSet.have).filter(Boolean).length:0;
    const pct=currentSet?Math.round(haveCount/currentSet.dates.length*100):0;

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="🏆 Set Registry"/>
        <div style={{padding:"10px 14px"}}>
          {!activeSet&&<>
            {sets.length>0&&<>
              <div style={{fontSize:11,color:C.textDim,marginBottom:8}}>Your Sets</div>
              {sets.map(s=>{
                const have=Object.values(s.have).filter(Boolean).length;
                const p=Math.round(have/s.dates.length*100);
                return(
                  <div key={s.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{fontSize:13,color:C.gold,fontWeight:"bold",flex:1}}>{s.name}</div>
                      <span style={{fontSize:13,color:p===100?C.green:C.textDim,fontWeight:"bold"}}>{p}%</span>
                    </div>
                    <div style={{background:C.surface2,borderRadius:4,height:6,marginBottom:8,overflow:"hidden"}}><div style={{height:"100%",background:p===100?C.green:C.gold,width:`${p}%`,borderRadius:4,transition:"width .3s"}}/></div>
                    <div style={{fontSize:11,color:C.textDim,marginBottom:8}}>{have} of {s.dates.length} dates</div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>setActiveSet(s.id)} style={{flex:1,padding:"8px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.gold,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Track Dates →</button>
                      <button onClick={()=>removeSet(s.id)} style={{padding:"8px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:7,color:C.red,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✕</button>
                    </div>
                  </div>
                );
              })}
            </>}

            <div style={{fontSize:11,color:C.textDim,marginBottom:8,marginTop:12}}>Start a New Set</div>
            {SET_TEMPLATES.map(t=>(
              <button key={t.name} onClick={()=>startSet(t)} style={{display:"block",width:"100%",textAlign:"left",padding:"12px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:7,cursor:"pointer",fontFamily:"inherit"}}>
                <div style={{fontSize:13,color:C.gold,fontWeight:"bold"}}>{t.name}</div>
                <div style={{fontSize:11,color:C.textDim,marginTop:2}}>{t.dates.length} dates to complete</div>
              </button>
            ))}
          </>}

          {activeSet&&currentSet&&<>
            <button onClick={()=>setActiveSet(null)} style={{marginBottom:12,padding:"8px 14px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,color:C.textDim,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>← Back to Sets</button>
            <div style={{background:"#1a1608",border:`1px solid ${C.gold}`,borderRadius:12,padding:14,marginBottom:12}}>
              <div style={{fontSize:14,color:C.gold,fontWeight:"bold",marginBottom:6}}>{currentSet.name}</div>
              <div style={{background:C.surface2,borderRadius:4,height:8,marginBottom:6,overflow:"hidden"}}><div style={{height:"100%",background:pct===100?C.green:C.gold,width:`${pct}%`,borderRadius:4,transition:"width .3s"}}/></div>
              <div style={{fontSize:12,color:C.textDim}}>{haveCount} of {currentSet.dates.length} · {pct}% complete</div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {currentSet.dates.map(date=>{
                const have=currentSet.have[date];
                return(
                  <button key={date} onClick={()=>toggleDate(currentSet.id,date)}
                    style={{padding:"7px 10px",fontFamily:"inherit",fontSize:12,borderRadius:7,cursor:"pointer",
                      background:have?"#0a1f0a":"#1a1208",
                      border:`1px solid ${have?C.green:C.border}`,
                      color:have?C.green:C.textDim,
                      textDecoration:have?"none":"none",
                      minWidth:60,textAlign:"center"}}>
                    {have?"✓ ":""}{date}
                  </button>
                );
              })}
            </div>
          </>}
        </div>
      </div>
    );
  }

  // ── WELCOME / ONBOARDING ─────────────────────────────────────────────────
