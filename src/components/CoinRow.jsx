import React from 'react';
import { C } from '../config/colors';
import { STATUS_CLR, RARITY_CLR } from '../config/constants';
import { coinName, $M } from '../utils/helpers';
import TrendBadge from './TrendBadge';

export default function CoinRow({ coin, onTap }) {
  const sc  = STATUS_CLR[coin.status] || STATUS_CLR['Own It'];
  const rc  = coin.rarity !== '—' ? RARITY_CLR[coin.rarity] : null;

  return (
    <div
      onClick={onTap}
      style={{
        background:C.surface,
        border:`1px solid ${C.border}`,
        borderRadius:12,
        padding:'12px 14px',
        marginBottom:8,
        cursor:'pointer',
        display:'flex',
        alignItems:'center',
        gap:12,
      }}
    >
      {coin.photoObverse
        ? <img src={coin.photoObverse} style={{ width:44, height:44, borderRadius:22, objectFit:'cover', flexShrink:0 }} alt="coin"/>
        : <div style={{ width:44, height:44, borderRadius:22, background:C.surface2, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:22 }}>🪙</div>
      }
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:0 }}>
          <span style={{ fontSize:14, color:C.text, fontWeight:'bold' }}>{coinName(coin)}</span>
          {coin._mode !== 'custom' && <TrendBadge series={coin.series}/>}
          {rc && <span style={{ fontSize:9, color:rc, background:'rgba(0,0,0,.3)', border:`1px solid ${rc}`, borderRadius:3, padding:'1px 4px', marginLeft:4, letterSpacing:'.06em' }}>{coin.rarity}</span>}
        </div>
        <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>
          {[coin.year, (coin.mintMark || '').replace('None (Philadelphia)', 'P').split('–')[0].trim(), coin.grade].filter(Boolean).join(' · ')}
        </div>
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <div style={{ fontSize:13, color:C.goldBright, fontWeight:'bold' }}>
          {coin.estimatedValue ? '$' + Number(coin.estimatedValue).toLocaleString() : '—'}
        </div>
        <span style={{ fontSize:9, color:sc.text, background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:4, padding:'1px 6px' }}>
          {coin.status}
        </span>
      </div>
    </div>
  );
}
