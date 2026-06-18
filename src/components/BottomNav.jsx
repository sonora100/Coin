import React from 'react';
import { useApp } from '../context/AppContext';
import { C } from '../config/colors';

const TABS = [
  { id:'home',   icon:'⚡', label:'Home'   },
  { id:'coins',  icon:'🪙', label:'Coins'  },
  { id:'errors', icon:'⚠️', label:'Errors' },
  { id:'lookup', icon:'🔍', label:'Lookup' },
  { id:'silver', icon:'🥈', label:'Metals' },
];

export default function BottomNav() {
  const { nav, setNav } = useApp();

  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0,
      background:'#0a0804',
      borderTop:`1px solid ${C.border}`,
      display:'flex', zIndex:50,
      paddingBottom:'env(safe-area-inset-bottom,0px)',
    }}>
      {TABS.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => setNav(id)}
          style={{
            flex:1, padding:'10px 0 8px',
            background:'transparent', border:'none',
            cursor:'pointer', display:'flex',
            flexDirection:'column', alignItems:'center', gap:2,
          }}
        >
          <span style={{ fontSize:18, lineHeight:1 }}>{icon}</span>
          <span style={{
            fontSize:8,
            color: nav === id ? C.gold : C.textDim,
            letterSpacing:'.05em',
            textTransform:'uppercase',
            fontFamily:'inherit',
          }}>
            {label}
          </span>
          {nav === id && (
            <div style={{ width:18, height:2, background:C.gold, borderRadius:1, marginTop:1 }}/>
          )}
        </button>
      ))}
    </div>
  );
}
