import React from 'react';
import { TRENDS, TREND_CONFIG } from '../config/constants';

export default function TrendBadge({ series }) {
  const t   = TRENDS[series];
  if (!t) return null;
  const cfg = TREND_CONFIG[t.trend];
  return (
    <span style={{
      fontSize:9,
      color:cfg.color,
      background:cfg.bg,
      border:`1px solid ${cfg.color}44`,
      borderRadius:3,
      padding:'1px 5px',
      marginLeft:4,
      letterSpacing:'.04em',
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}
