// CoinVault — App Constants

export const STORAGE_KEY = 'coinvault_v6';

export const GRADES = [
  'P-1','F-2','AG-3','G-4','G-6','VG-8','VG-10','F-12','F-15',
  'VF-20','VF-25','VF-30','VF-35','EF-40','EF-45',
  'AU-50','AU-55','AU-58',
  'MS-60','MS-61','MS-62','MS-63','MS-64','MS-65','MS-66','MS-67','MS-68','MS-69','MS-70',
  'PR-60','PR-63','PR-65','PR-67','PR-70',
];

export const GRADE_KEYS = ['G-4','VG-8','F-12','VF-20','EF-40','AU-50','MS-60','MS-63','MS-65'];

export const GRADE_LBL = [
  'Poor (P-1)','Fair (F-2)','About Good (AG-3)','Good (G-4)','Good (G-6)',
  'Very Good (VG-8)','Very Good (VG-10)','Fine (F-12)','Fine (F-15)',
  'Very Fine (VF-20)','Very Fine (VF-25)','Very Fine (VF-30)','Very Fine (VF-35)',
  'Extremely Fine (EF-40)','Extremely Fine (EF-45)',
  'About Unc. (AU-50)','About Unc. (AU-55)','About Unc. (AU-58)',
  'Mint State (MS-60)','Mint State (MS-61)','Mint State (MS-62)','Mint State (MS-63)',
  'Mint State (MS-64)','Mint State (MS-65)','Mint State (MS-66)','Mint State (MS-67)',
  'Mint State (MS-68)','Mint State (MS-69)','Perfect (MS-70)',
  'Proof (PR-60)','Proof (PR-63)','Proof (PR-65)','Proof (PR-67)','Proof (PR-70)',
];

export const STATUS_OPT  = ['Own It','Want It','Sold It','On Loan'];
export const RARITY      = ['—','Common','Scarce','Semi-Key','Key Date','Rare','Ultra Rare'];
export const EYE_APP     = ['—','Poor','Fair','Average','Above Average','Exceptional'];
export const LUSTER_O    = ['—','Dull','Moderate','Bright','Frosty','Deep Mirror'];
export const STRIKE_O    = ['—','Weak','Average','Sharp','Full Strike'];
export const STORAGE_L   = ['Safe Deposit Box','Home Safe','Album – Dansco','Album – Whitman','2x2 Flip Box','Slab Box','Coin Cabinet','Display Case','Other'];
export const CERT_SVC    = ['PCGS','NGC','ANACS','ICG','CAC','Other'];
export const MINT_MARKS  = ['None (Philadelphia)','D – Denver','S – San Francisco','W – West Point','O – New Orleans','CC – Carson City','C – Charlotte','D – Dahlonega'];
export const DENOM_ORDER = ['1¢','5¢','10¢','25¢','50¢','$1','$5','$10','$25','$50','$100'];
export const DENOM_LIST  = ['1¢','2¢','3¢','5¢','10¢','20¢','25¢','50¢','$1','$2.50','$3','$5','$10','$20','$25','$50','$100'];
export const MINT_LIST   = ['P – Philadelphia','D – Denver','S – San Francisco','O – New Orleans','CC – Carson City','W – West Point','C – Charlotte','D – Dahlonega (pre-Denver)'];

export const ERROR_TYPES = [
  'Doubled Die Obverse (DDO)','Doubled Die Reverse (DDR)','Off-Center Strike',
  'Missing Clad Layer','Broadstrike (No Collar)','Rotated Die','Wrong Planchet / Off-Metal',
  'Repunched Mint Mark (RPM)','Die Crack / Die Break','Lamination Error',
  'Struck Through (Grease / Debris)','Clipped Planchet','Double Strike','Triple Strike',
  'Mule (Mismatched Dies)','Die Cap','Brockage','Partial Collar Strike',
  'Machine Doubling','Die Gouge / Scratch','Custom / Describe Below',
];

export const ERROR_SEV = ['Minor','Moderate','Major','Dramatic / Spectacular'];

export const STATUS_CLR = {
  'Own It':  { bg:'#1a3a2a', border:'#2d6b47', text:'#5dba82', dot:'#5dba82' },
  'Want It': { bg:'#1a2a3a', border:'#2d4b6b', text:'#5d9eba', dot:'#5d9eba' },
  'Sold It': { bg:'#3a2a1a', border:'#6b4b2d', text:'#ba8a5d', dot:'#ba8a5d' },
  'On Loan': { bg:'#2a1a3a', border:'#5b2d8a', text:'#b05dea', dot:'#b05dea' },
};

export const RARITY_CLR = {
  'Key Date':   '#e07a3a',
  'Semi-Key':   '#c8a84b',
  'Ultra Rare': '#ea5d5d',
  'Rare':       '#c05dba',
  'Scarce':     '#5d9eba',
  'Common':     '#5a6a4a',
};

export const COPPER_SERIES = [
  'Flying Eagle Cent','Indian Head Cent',
  'Lincoln Cent (Wheat)','Lincoln Cent (Memorial)','Lincoln Cent (Shield)',
];

export const COPPER_COLORS = [
  { id:'RD', label:'Red (RD)',       desc:'Full original mint red — highest grade color', premium:'High' },
  { id:'RB', label:'Red-Brown (RB)', desc:'Mix of red and brown toning',                  premium:'Moderate' },
  { id:'BN', label:'Brown (BN)',     desc:'Fully toned brown — most circulated',           premium:'Standard' },
];

export const TRENDS = {
  'Lincoln Cent (Wheat)':          { trend:'rising',  note:'Key dates seeing strong demand' },
  'Lincoln Cent (Memorial)':       { trend:'stable',  note:'Common dates flat, errors rising' },
  'Indian Head Cent':              { trend:'rising',  note:'Classic series, steady collector demand' },
  'Flying Eagle Cent':             { trend:'stable',  note:'Limited dates, niche market' },
  'Buffalo Nickel':                { trend:'rising',  note:'Strong collector interest, key dates hot' },
  'Jefferson Nickel':              { trend:'stable',  note:'Full Steps examples rising' },
  'Jefferson Nickel (Wartime)':    { trend:'rising',  note:'Silver content + collector premium' },
  'Liberty Head Nickel':           { trend:'rising',  note:'Classic design, increasing demand' },
  'Mercury Dime':                  { trend:'hot',     note:'One of the most popular US series' },
  'Roosevelt Dime (Silver)':       { trend:'stable',  note:'Silver value drives floor price' },
  'Barber Dime':                   { trend:'rising',  note:'Scarce in high grade, growing demand' },
  'Standing Liberty Quarter':      { trend:'hot',     note:'Beautiful design, strong collector demand' },
  'Washington Quarter (Silver)':   { trend:'stable',  note:'Silver floor, common dates flat' },
  'State Quarter':                 { trend:'cooling', note:'Most dates worth face, errors only' },
  'America the Beautiful Quarter': { trend:'stable',  note:'Early issues gaining collector interest' },
  'Walking Liberty Half Dollar':   { trend:'hot',     note:'Most beloved US half dollar series' },
  'Franklin Half Dollar':          { trend:'rising',  note:'FBL examples commanding premiums' },
  'Barber Half Dollar':            { trend:'rising',  note:'Scarce series, growing appreciation' },
  'Kennedy Half Dollar (Silver)':  { trend:'stable',  note:'Silver value plus collector premium' },
  'Kennedy Half Dollar (40% Ag)':  { trend:'stable',  note:'40% silver, modest collector interest' },
  'Kennedy Half Dollar (Clad)':    { trend:'cooling', note:'Most dates common, low premium' },
  'Morgan Dollar':                 { trend:'hot',     note:'King of US coins, always strong demand' },
  'Peace Dollar':                  { trend:'hot',     note:'Beautiful design, rising collector base' },
  'Eisenhower Dollar':             { trend:'rising',  note:'Gaining appreciation, silver issues hot' },
  'Susan B. Anthony Dollar':       { trend:'stable',  note:'Wide Rim 1979 and 1999 in demand' },
  'Sacagawea Dollar':              { trend:'stable',  note:'Most dates common' },
  'American Silver Eagle':         { trend:'hot',     note:'Most popular bullion coin, strong premium' },
  'American Gold Eagle (1 oz)':    { trend:'hot',     note:'Gold near all-time highs 2025' },
  'American Gold Buffalo':         { trend:'hot',     note:'Pure gold, very strong demand' },
  'American Platinum Eagle':       { trend:'rising',  note:'Platinum gaining vs gold' },
};

export const TREND_CONFIG = {
  hot:     { icon:'🔥', label:'Hot',     color:'#ea5d5d', bg:'#2a0808' },
  rising:  { icon:'↑',  label:'Rising',  color:'#5dba82', bg:'#0a1e0a' },
  stable:  { icon:'→',  label:'Stable',  color:'#c8a84b', bg:'#1e1608' },
  cooling: { icon:'↓',  label:'Cooling', color:'#5d9eba', bg:'#081620' },
};

export const DEFAULT_COLL_TYPES = [
  { id:'ct1', name:'Military Challenge Coin', icon:'🪖', fields:['Unit/Organization','Branch','Year Issued','Campaign/Era','Material','Size'] },
  { id:'ct2', name:'Medal / Award',           icon:'🏅', fields:['Issuing Organization','Year','Recipient','Occasion','Material','Diameter'] },
  { id:'ct3', name:'Token',                   icon:'🎰', fields:['Issuer','Type','Year','Region','Material','Denomination'] },
  { id:'ct4', name:'Elongated Coin',          icon:'🔩', fields:['Base Coin','Machine Location','Year Rolled','Design Description'] },
  { id:'ct5', name:'Casino Chip',             icon:'♠️', fields:['Casino Name','Denomination','Year','City/State','Color','Condition'] },
  { id:'ct6', name:'Souvenir Medallion',      icon:'🗺️', fields:['Location/Event','Year','Material','Size','Theme'] },
];
