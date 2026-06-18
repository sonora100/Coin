import React from 'react';
import { useApp } from '../context/AppContext';
import { C } from '../config/colors';

export default function PageHeader({ title, back, onBack, right }) {
  const { setView } = useApp();

  return (
    <div style={{
      position:'sticky', top:0, zIndex:10,
      background:C.bg,
      borderBottom:`1px solid ${C.border2}`,
      padding:'14px 16px 12px',
      display:'flex', alignItems:'center', gap:10,
    }}>
      {back && (
        <button
          onClick={onBack || (() => setView(null))}
          style={{
            background:'transparent', border:'none',
            color:C.textDim, cursor:'pointer',
            fontSize:20, padding:0, lineHeight:1,
            fontFamily:'inherit',
          }}
        >
          ‹
        </button>
      )}
      <div style={{
        flex:1,
        fontSize:17, fontWeight:'bold',
        color:C.gold, letterSpacing:'.02em',
      }}>
        {title}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
