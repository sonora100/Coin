import React from 'react';

export default function Pill({ label, color }) {
  return (
    <span style={{
      fontSize:9,
      color,
      background:'rgba(0,0,0,.4)',
      border:`1px solid ${color}`,
      borderRadius:3,
      padding:'1px 4px',
      letterSpacing:'.06em',
      whiteSpace:'nowrap',
      marginLeft:4,
    }}>
      {label}
    </span>
  );
}
