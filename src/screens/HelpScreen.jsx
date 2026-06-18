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

export default function HelpScreen(){
    const [openSection,setOpenSection]=useState(null);
    const HELP=[
      {
        icon:"🪙",title:"Adding Coins to Your Vault",color:C.gold,
        sections:[
          {q:"How do I add a coin?",a:"Tap the 🪙 Coins tab, then tap + Add Coin at the top. Select US Coin, Error Coin, or Custom/Foreign. Fill in the details — year, denomination, mint mark, grade, status, and estimated value. Tap Save."},
          {q:"What do the status options mean?",a:"Owned = you have it. Wanted = on your want list. Sold = you sold it. Error = a coin with a mint error. Choose the one that matches where the coin is right now."},
          {q:"Can I add a photo?",a:"Yes — when adding or editing a coin, tap the camera icon to take a photo or choose from your library. Photos are stored with the coin record."},
          {q:"What is Bulk Add?",a:"Tap Bulk Add Coins on the home screen to add multiple coins quickly without filling out full details each time. Great for cataloging a large collection fast."},
          {q:"How do I edit or delete a coin?",a:"In the Coins tab, tap any coin to open it. Tap Edit to change details or Delete to remove it. Deletions cannot be undone."},
          {q:"What grades should I use?",a:"Use standard Sheldon scale grades: P-1 through MS-70 for circulated and uncirculated coins, PR-70 for proofs. When in doubt, use 'VG-8' for a worn coin, 'EF-40' for lightly worn, 'MS-63' for uncirculated with some marks. Check the Glossary tab for full grade descriptions."},
        ]
      },
      {
        icon:"🔍",title:"Coin Lookup",color:C.blue,
        sections:[
          {q:"How do I look up a coin's value?",a:"Tap the 🔍 Lookup tab. Enter the year, select the denomination from the dropdown, and optionally select a mint mark. Select your coin's grade using the grade buttons, then tap Look Up This Coin."},
          {q:"What does the estimated value mean?",a:"It's a baseline typical value for a common date in that series at your selected grade. Key dates and rare varieties are worth much more — always tap the PCGS Prices or Heritage Sold buttons to verify the specific date you have."},
          {q:"What are key dates?",a:"Key dates are the rarest, most valuable dates in a coin series. When you search a year that's a known key date, a 🔥 KEY DATE alert appears. Examples: 1916-D Mercury Dime, 1877 Indian Head Cent, 1893-S Morgan Dollar."},
          {q:"What do the pricing buttons do?",a:"PCGS Prices opens PCGS's price guide for that coin. NGC Prices opens NGC's guide. Heritage Sold opens Heritage Auctions showing what that coin actually sold for at auction. eBay Sold shows recently completed eBay sales. Always check Heritage and eBay for real market prices."},
          {q:"Can I browse without entering a year?",a:"Yes — tap any denomination button at the bottom of the Lookup screen to see all coin series for that denomination without entering a year."},
        ]
      },
      {
        icon:"⚠️",title:"Error Coin Hunter",color:C.orange,
        sections:[
          {q:"What is an error coin?",a:"An error coin has a mistake made at the mint during production — wrong metal, doubled die, repunched mint mark, off-center strike, wrong planchet, and more. Many are extremely valuable."},
          {q:"How do I use the Most Wanted list?",a:"Tap ⚠️ Errors, then 🎯 Most Wanted. Browse 124 specific error coins. Each entry has exactly how to spot it and what to look for. Tap Log to add it to your error coin records when you find one."},
          {q:"What is a Doubled Die?",a:"A doubled die (DDO = obverse, DDR = reverse) occurs when the die used to strike coins received two misaligned hub impressions. The result is visible doubling on letters, numbers, or design elements. The 1955 Lincoln DDO is the most famous — worth $1,000+ even worn."},
          {q:"How do I use the Spot Guide?",a:"Tap 📋 Spot Guide in the Errors tab. It covers 12 error types with diagnostic steps, required tools, quick field tests, and warnings. Start here to learn what to look for before examining your coins."},
          {q:"What tools do I need to find errors?",a:"Minimum: a 10x loupe. Better: a 16x-30x stereo microscope. A 0.01g digital scale is essential for finding wrong planchet errors. A magnet helps test 1943/1944 steel and copper cents. Good raking light (single point source) is critical."},
          {q:"How do I use the Checklist?",a:"Tap ✅ Checklist in the Errors tab. It gives you specific things to check on every denomination. Work through it whenever you have a pile of coins to examine."},
        ]
      },
      {
        icon:"🥈",title:"Metals & Melt Value",color:"#a0c8d4",
        sections:[
          {q:"How are metal prices updated?",a:"Prices are fetched automatically from a live precious metals data feed when you open the Metals tab, and refresh every 5 minutes. Tap 🔄 Refresh at any time to get the latest price. Note: prices load in a real browser (Safari, Chrome) — not inside the Claude.ai viewer."},
          {q:"What is melt value?",a:"Melt value is what the raw metal in a coin is worth if melted down. A Morgan dollar contains 0.7734 troy oz of silver — multiply by current silver spot price for the melt value. Numismatic (collector) value is almost always higher than melt."},
          {q:"How do I calculate total melt for my collection?",a:"Use the + and - buttons on each coin row to enter how many you have. The melt value per coin times your quantity appears instantly. A running total at the top shows your combined melt value and total troy ounces."},
          {q:"Should I sell my silver coins for melt?",a:"Usually no — most silver coins are worth more than melt to collectors. Always check Heritage Auctions or PCGS prices before selling for melt. Even common date Morgan dollars often sell for $5-10 above melt. Key dates can be worth 100x melt."},
          {q:"Which coins have silver in them?",a:"Any US dime, quarter, or half dollar dated 1964 or earlier is 90% silver. Kennedy halves 1965-1970 are 40% silver. Wartime nickels 1942-1945 with large mintmark over Monticello are 35% silver. All dollar coins through 1935 are 90% silver."},
        ]
      },
      {
        icon:"⭐",title:"Want List & Tracking",color:C.green,
        sections:[
          {q:"How does the Want List work?",a:"Tap Want List from the home screen. Add coins you're hunting with a priority (High/Medium/Low), target grade, maximum price you'll pay, and notes on where to find them. When you get the coin, tap Found It! to remove it."},
          {q:"How do I track purchases?",a:"Tap 💰 Purchases from the home screen. Log every coin you buy with what you paid and current estimated value. The screen shows your running profit/loss across your entire collection."},
          {q:"How do I log auctions?",a:"Tap 🔨 Auction Log. Record every auction you participate in — the house (Heritage, Stack's Bowers, etc.), lot number, your bid, the final price, and whether you Won, Lost, or withdrew. Tracks your total spending and win rate."},
          {q:"How do I record a sale?",a:"Tap 📤 Sales & Trades. Enter what you sold, what you originally paid, and what you sold it for. The app calculates your profit or loss automatically and keeps a running total."},
          {q:"How do I save dealer information?",a:"Tap 🤝 Dealer Notes. Save any dealer with their name, location, phone, specialty (Morgans, early gold, errors, etc.), star rating, and personal notes about pricing and inventory."},
        ]
      },
      {
        icon:"🏆",title:"Set Registry",color:C.purple,
        sections:[
          {q:"What is the Set Registry?",a:"The Set Registry lets you track completion of a full coin series. Choose a series (Morgan dollars, Mercury dimes, Walking Liberty halves, Buffalo nickels, Lincoln Wheat cents, Peace dollars), then check off each date as you acquire it."},
          {q:"How do I start tracking a set?",a:"Tap 🏆 Set Registry from the home screen. Tap any series template to start tracking it. A progress bar shows your completion percentage. Tap Track Dates to check off individual dates."},
          {q:"Can I track multiple sets?",a:"Yes — start as many sets as you want. Each one shows independently on the Set Registry screen with its own progress bar."},
          {q:"How do I mark a date as owned?",a:"Tap Track Dates on any set, then tap any date button to toggle it between owned (green checkmark) and not yet owned. Changes save automatically."},
        ]
      },
      {
        icon:"🔤",title:"Glossary & Reference",color:C.purple,
        sections:[
          {q:"How do I look up a term?",a:"Tap 🔤 Glossary from the home screen. Type any term, abbreviation, or word in the search box at the top — it searches all 140+ terms instantly across all 8 categories."},
          {q:"What categories are covered?",a:"Grading Scale (P-1 through MS-70), Slab & Certification Labels (PCGS, NGC, CAC, CAMEO, DCAM, FH, FB, etc.), Die Variety & Error Codes (DDO, DDR, RPM, VAM, FS numbers), Auction & Pricing Terms, Strike & Surface designations, Mint & History terms, Toning & Eye Appeal, and Coin Specifications."},
          {q:"Where are the pricing website links?",a:"Tap 📖 Values in the bottom navigation. The Quick Reference Links section at the top has 20+ direct links organized by category — price guides, actual sold prices, lookup & verify tools, spot prices, and error resources."},
          {q:"What is the Greysheet?",a:"The CDN Greysheet (greysheet.com) is the wholesale price guide — what dealers actually pay each other for coins. It's the online equivalent of the Blue Book. Use it to understand what you'd realistically get when selling. The PCGS Price Guide shows retail — what dealers ask."},
        ]
      },
      {
        icon:"💡",title:"Tips for New Collectors",color:C.gold,
        sections:[
          {q:"Where should I start?",a:"Start with a complete series you find interesting — Lincoln Wheat cents are affordable and fun. Morgan dollars are the most popular. Pick one series and learn it deeply before branching out."},
          {q:"Should I clean my coins?",a:"NEVER clean a coin. Even light cleaning destroys the coin's luster and can cut its value by 50-80%. A 'cleaned' designation from PCGS or NGC means the coin gets a Details grade instead of a clean number grade and is worth much less."},
          {q:"How do I store coins safely?",a:"Use hard plastic coin flips or PCGS/NGC slabs for valuable coins. Never use PVC soft plastic — it destroys coins over time with green corrosion. Store in a cool, dry place away from humidity. Cardboard 2x2 holders work for common coins."},
          {q:"Should I get my coins graded?",a:"Grade coins worth $100+ with PCGS or NGC. The fee is typically $25-50 per coin. Grading adds liquidity (easier to sell), authentication, and often increases realized price at auction. Don't grade common coins — it's not cost-effective."},
          {q:"What's the difference between PCGS and NGC?",a:"Both are equally respected. PCGS tends to be slightly more conservative (grades a bit tighter). NGC has more variety attributions on labels. For Morgan dollars, both are equally accepted. Buy the coin, not the holder."},
          {q:"How do I know if a coin is authentic?",a:"For high-value coins, submit to PCGS or NGC. At home: check weight on a 0.01g scale, check dimensions, look for tooling or smoothed fields, check luster under a light. Counterfeit detection is covered in the Error Hunter's Auth Tips section."},
          {q:"What is cherrypicking?",a:"Cherrypicking means finding a coin that's undervalued because the seller didn't recognize a variety or error. Example: buying a coin labeled '1974-D Kennedy Half' that is actually the rare DDO variety. Use the Error Hunter and the Coin Lookup key dates to spot opportunities."},
        ]
      },
    ];

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="❓ Help & Guide"/>
        <div style={{padding:"10px 14px"}}>
          <div style={{background:"#0a0f1a",border:"1px solid #1e3a5a",borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{fontSize:13,color:C.blue,fontWeight:"bold",marginBottom:4}}>How to use this guide</div>
            <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>Tap any section to expand it. Tap any question to see the answer. Use this guide to learn every feature of CoinVault.</div>
          </div>
          {HELP.map((section,si)=>{
            const isOpen=openSection===si;
            const [openQ,setOpenQ]=useState(null);
            return(
              <div key={si} style={{background:C.surface,border:`1px solid ${isOpen?section.color:C.border}`,borderRadius:12,marginBottom:8,overflow:"hidden"}}>
                <div onClick={()=>setOpenSection(isOpen?null:si)} style={{padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:22}}>{section.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,color:section.color,fontWeight:"bold"}}>{section.title}</div>
                    <div style={{fontSize:11,color:C.textDim,marginTop:1}}>{section.sections.length} topics</div>
                  </div>
                  <span style={{fontSize:20,color:C.textDim,transform:isOpen?"rotate(90deg)":"none",display:"inline-block",transition:"transform .2s"}}>›</span>
                </div>
                {isOpen&&<div style={{borderTop:`1px solid ${C.border2}`,padding:"10px 14px"}}>
                  {section.sections.map((item,qi)=>{
                    const qOpen=openQ===qi;
                    return(
                      <div key={qi} style={{marginBottom:6,borderRadius:8,overflow:"hidden",border:`1px solid ${C.border2}`}}>
                        <div onClick={()=>setOpenQ(qOpen?null:qi)} style={{padding:"11px 13px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:qOpen?C.surface2:"transparent"}}>
                          <div style={{fontSize:13,color:qOpen?section.color:C.text,flex:1,paddingRight:8}}>{item.q}</div>
                          <span style={{fontSize:16,color:C.textDim,flexShrink:0}}>{qOpen?"▾":"▸"}</span>
                        </div>
                        {qOpen&&<div style={{padding:"10px 13px 13px",background:C.surface2,fontSize:13,color:C.textDim,lineHeight:1.7}}>{item.a}</div>}
                      </div>
                    );
                  })}
                </div>}
              </div>
            );
          })}
          <div style={{textAlign:"center",padding:"20px 0 10px",fontSize:11,color:C.textFaint}}>CoinVault · Built for serious collectors</div>
        </div>
      </div>
    );
  }
