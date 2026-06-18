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
import { GLOSSARY } from '../data/glossaryData';

export default function GlossaryScreen(){
    const [gSearch,setGSearch]=useState("");
    const [openSection,setOpenSection]=useState(null);

    const GLOSSARY = [
      {
        section:"📊 Grading Scale (Sheldon Scale)",
        color:"#c8a84b",
        intro:"Every US coin is graded 1–70. The grade determines value more than almost anything else. Learn this scale and you speak fluent coin.",
        terms:[
          {term:"P-1",full:"Poor",def:"Barely identifiable as a coin. Date may not be readable. Extremely worn."},
          {term:"FR-2",full:"Fair",def:"Mostly flat but major design elements visible. Date barely legible."},
          {term:"AG-3",full:"About Good",def:"Heavily worn, design outlined but details flat. Date visible."},
          {term:"G-4 / G-6",full:"Good",def:"Major design elements clear but flat. No fine detail. Rims may be worn into lettering."},
          {term:"VG-8 / VG-10",full:"Very Good",def:"Design clear with some detail. Rims complete. Main features distinct."},
          {term:"F-12 / F-15",full:"Fine",def:"Moderate to considerable even wear. All lettering visible. Main features sharp."},
          {term:"VF-20 to VF-35",full:"Very Fine",def:"Light to moderate wear on high points. All major details clear. Hair strands beginning to show."},
          {term:"EF-40 / EF-45",full:"Extremely Fine",def:"Light wear on highest points only. All design details sharp and clear. Slight wear on high relief areas."},
          {term:"AU-50 to AU-58",full:"About Uncirculated",def:"Trace wear on highest points. At least half of original mint luster remains. AU-58 is 'slider' — nearly mint."},
          {term:"MS-60",full:"Mint State Basal",def:"No wear but many heavy bag marks, scratches, and contact marks. Dull or impaired luster."},
          {term:"MS-61",full:"Mint State",def:"No wear. Heavily marked with contact marks and bag marks."},
          {term:"MS-62",full:"Mint State",def:"No wear. Noticeable contact marks and blemishes but better than MS-61."},
          {term:"MS-63",full:"Mint State Choice",def:"No wear. Moderate distracting contact marks. Above average strike and luster."},
          {term:"MS-64",full:"Mint State Choice",def:"No wear. Few noticeable marks. Above average eye appeal. Where most collectors aim."},
          {term:"MS-65",full:"Gem Mint State",def:"No wear. Strong luster. Few contact marks, none in focal areas. Excellent eye appeal. The quality benchmark."},
          {term:"MS-66",full:"Gem Mint State",def:"No wear. Very few minor marks. Above average strike. Strong luster. Premium gem."},
          {term:"MS-67",full:"Superb Gem",def:"No wear. Virtually perfect. Only the most minor imperfections. Extremely rare for most dates."},
          {term:"MS-68",full:"Superb Gem",def:"Nearly perfect. Almost no marks visible even under magnification. Very few coins reach this grade."},
          {term:"MS-69",full:"Near Perfect",def:"Virtually flawless. Extraordinarily rare. A handful of coins per year reach this level."},
          {term:"MS-70",full:"Perfect Uncirculated",def:"Absolutely perfect under 5x magnification. No marks, no weaknesses. The highest possible grade. Extremely rare."},
          {term:"PR / PF",full:"Proof",def:"Specially struck coins made for collectors — not for circulation. Mirror-like fields, frosted raised devices. Struck at least twice with polished dies."},
          {term:"PR-60 to PR-70",full:"Proof Grades",def:"Same 1–70 scale as MS but for proof coins. PR-70 DCAM is the ultimate — perfect surfaces with deep cameo contrast."},
          {term:"SP",full:"Specimen Strike",def:"Better than business strike but not full proof. Special presentation quality. Used for early US coins and some modern issues."},
          {term:"+",full:"Plus Grade",def:"A plus sign after a grade (MS-64+) means the coin is at the high end of that grade — nearly qualifies for the next level. Worth more than a standard example."},
          {term:"★",full:"Star Designation",def:"NGC uses a star (★) to designate exceptional eye appeal within a grade. An MS-65★ is better than a standard MS-65."},
        ]
      },
      {
        section:"🏷️ Slab & Certification Labels",
        color:"#5d9eba",
        intro:"When PCGS or NGC grades a coin, it goes in a sealed plastic holder (slab) with a label. Here's what every word and abbreviation on that label means.",
        terms:[
          {term:"PCGS",full:"Professional Coin Grading Service",def:"Founded 1986. One of the two most respected US coin grading services. Blue label. Their grades are industry standard."},
          {term:"NGC",full:"Numismatic Guaranty Company",def:"Founded 1987. The other top grading service. Green label. Equally respected to PCGS. Some series have more NGC submissions."},
          {term:"CAC",full:"Certified Acceptance Corporation",def:"Not a grading service — a quality verification service. Puts a green bean sticker on coins that meet the high end of their stated grade. A CAC-stickered MS-65 is a premium MS-65."},
          {term:"ANACS",full:"American Numismatic Association Certification Service",def:"Older, less prestigious than PCGS/NGC but legitimate. Some early certified coins are ANACS."},
          {term:"ICG",full:"Independent Coin Graders",def:"Legitimate but lower-tier grading service. Coins worth less in ICG holders vs PCGS/NGC for same grade."},
          {term:"RAW",full:"Ungraded / Uncertified",def:"A coin not in a grading service holder. 'Raw' coins have no guarantee of grade or authenticity. Buying raw = buyer beware."},
          {term:"SLAB",full:"Grading Service Holder",def:"The sealed tamper-evident plastic holder that contains a certified coin. Opening a slab ('cracking out') destroys the certification."},
          {term:"CAMEO / CAM",full:"Cameo",def:"On proof coins — frosted raised devices (portrait, eagle) contrasting against mirror-like fields. Adds significant value."},
          {term:"DCAM / DC",full:"Deep Cameo",def:"Maximum cameo contrast. Devices are heavily frosted, fields are deeply mirrored. The most desirable proof finish. Adds major value."},
          {term:"DMPL",full:"Deep Mirror Prooflike",def:"On business strike coins (Morgans especially) — fields are mirror-like like a proof but the coin was made for circulation. Very desirable. DMPL Morgans command huge premiums."},
          {term:"PL",full:"Prooflike",def:"Business strike coin with mirror-like fields but less dramatic than DMPL. Still commands a premium."},
          {term:"FH",full:"Full Head",def:"Standing Liberty Quarter designation. Liberty's head shows complete detail including the three leaves and helmet. Commands major premium."},
          {term:"FB / FSB",full:"Full Bands / Full Split Bands",def:"Mercury Dime designation. The horizontal bands on the fasces (bundle of rods) are fully struck and clearly separated. Premium designation."},
          {term:"FBL",full:"Full Bell Lines",def:"Franklin Half Dollar designation. The horizontal lines at the bottom of the Liberty Bell are complete and unbroken. Major premium."},
          {term:"FT / FB",full:"Full Torch / Full Bands",def:"Roosevelt Dime designation. The torch on the reverse shows complete, unbroken horizontal bands. Premium grade."},
          {term:"FS",full:"Full Steps",def:"Jefferson Nickel designation. The steps of Monticello show 5 or 6 complete, unbroken steps. 6FS is rarer and more valuable than 5FS."},
          {term:"FG",full:"Frank Gasparro initials",def:"Designer initials on Kennedy Half Dollar reverse near eagle. 'No FG' varieties (where initials are polished away) are collectible errors."},
          {term:"RD",full:"Red",def:"Copper coin color designation. 95%+ original mint red luster intact. Highest premium for Lincoln cents and other copper coins."},
          {term:"RB",full:"Red-Brown",def:"Copper coin color. Mix of original red and brown toning. Less premium than RD."},
          {term:"BN",full:"Brown",def:"Copper coin color. Fully toned brown. Most common for circulated copper coins. Lowest premium."},
          {term:"Details",full:"Details Grade",def:"Coin has a problem — cleaning, damage, environmental issues, tooling, or artificial toning. Graded Details instead of a clean number. Worth much less. 'Cleaned' is the most common Details designation."},
          {term:"Genuine",full:"Authentic but Ungradable",def:"Coin is real but has issues too severe to grade. Still authentic — just not gradable."},
          {term:"Net Grade",full:"Net or Adjusted Grade",def:"ANACS sometimes assigns a net grade — a reduced grade reflecting problems. MS-60 Net on a coin that would otherwise be MS-64."},
        ]
      },
      {
        section:"🔍 Die Variety & Error Codes",
        color:"#e07a3a",
        intro:"These codes appear in auction listings, on slab labels, and in dealer inventory. They tell you exactly which variety or error a coin has.",
        terms:[
          {term:"DDO",full:"Doubled Die Obverse",def:"The front (obverse) die received two misaligned hub impressions. Creates visible doubling on date, LIBERTY, IN GOD WE TRUST, or portrait."},
          {term:"DDR",full:"Doubled Die Reverse",def:"Same as DDO but on the reverse side. Doubling appears on E PLURIBUS UNUM, ONE CENT, eagle, etc."},
          {term:"RPM",full:"Repunched Mint Mark",def:"The mintmark was punched into the die more than once at slightly different positions. Secondary mintmark impression visible nearby."},
          {term:"OMM",full:"Over Mint Mark",def:"A different mintmark was punched over the original. Example: D/S means D was punched over an S."},
          {term:"MPD",full:"Misplaced Date",def:"A date digit was accidentally punched into the wrong area of the die — in the denticles (edge teeth), in the field, or elsewhere it shouldn't be."},
          {term:"OD / Overdate",full:"Overdate",def:"A new date was punched over an old date on the die. The earlier date shows through. Written as 1918/7-D (1918 over 1917, Denver mint)."},
          {term:"VAM",full:"Van Allen & Mallis",def:"System for cataloging Morgan and Peace dollar die varieties, named after the authors Leroy Van Allen and A. George Mallis. VAM-1, VAM-2, etc. Top 100 VAMs are the most valuable."},
          {term:"FS",full:"Fivaz-Stanton",def:"Die variety numbering system from the Cherrypickers' Guide by Bill Fivaz and J.T. Stanton. FS-101 means the most significant (first significant) variety for that date. Seen on PCGS/NGC labels."},
          {term:"WDDO",full:"Wexler Doubled Die Obverse",def:"Variety number from John Wexler's doubled die reference. WDDO-001 is the strongest/most significant DDO for a given date."},
          {term:"CONECA",full:"Combined Organizations of Numismatic Error Collectors of America",def:"The main error coin organization. They catalog and number error varieties. Their attribution numbers appear on some slab labels."},
          {term:"TF",full:"Tail Feathers",def:"Used for Morgan dollar reverse varieties. 7TF = 7 tail feathers (standard). 8TF = 8 tail feathers (first 1878 design, rarer). 7/8TF = transitional overdate."},
          {term:"PMD",full:"Post-Mint Damage",def:"Damage that happened AFTER the coin left the mint. Scratches, dents, cleaning, corrosion. PMD has zero numismatic value — do not confuse with genuine mint errors."},
          {term:"MD",full:"Machine Doubling",def:"Worthless striking artifact that mimics doubled dies. Die bounces slightly during striking, creating flat shelf-like secondary images. NOT a true doubled die. Worth face value only."},
          {term:"Die State",full:"Die State",def:"The condition of the die when a coin was struck. Early Die State (EDS) = fresh die, sharp details. Late Die State (LDS) = worn die, weaker details, more die cracks. EDS coins often command premiums."},
          {term:"EDS",full:"Early Die State",def:"Coin struck from a fresh, unworn die. Sharpest possible detail. Premium for some varieties."},
          {term:"LDS",full:"Late Die State",def:"Coin struck from a heavily used die. Weaker strike, more die cracks, sometimes more dramatic die errors."},
        ]
      },
      {
        section:"💰 Auction & Pricing Terms",
        color:"#5dba82",
        intro:"Terms you'll see on Heritage, Stack's Bowers, GreatCollections, and eBay listings.",
        terms:[
          {term:"Bid",full:"Bid Price",def:"What a buyer is willing to pay. Greysheet 'Bid' = wholesale — what dealers will pay you for the coin."},
          {term:"Ask",full:"Ask Price",def:"What a seller wants. Greysheet 'Ask' = what dealers sell coins to each other for. Retail (PCGS Price Guide) = what collectors pay."},
          {term:"Realized",full:"Hammer Price / Realized Price",def:"What a coin actually SOLD for at auction. The most accurate value indicator. Always look at realized prices, not asking prices."},
          {term:"CPG",full:"Collector's Price Guide",def:"Whitman/CDN retail price guide. Now incorporated into the Red Book. Based on actual market data."},
          {term:"CDN",full:"Coin Dealer Newsletter",def:"Publisher of the Greysheet (wholesale) and Greensheet (paper money wholesale). The industry standard for dealer-to-dealer pricing."},
          {term:"Melt Value",full:"Metal Melt Value",def:"What the metal in a coin is worth if melted down. Silver dime melt ~$2. Silver quarter melt ~$4. Morgan dollar melt ~$18 at $25/oz silver. A coin is almost always worth MORE than melt."},
          {term:"Premium",full:"Numismatic Premium",def:"The amount above melt or face value that a coin commands due to rarity, grade, or demand. A $18 Morgan with a $25 price tag has a $7 numismatic premium."},
          {term:"Spot",full:"Spot Price",def:"Current live market price for silver or gold per troy ounce. Coin values with silver/gold content move with spot."},
          {term:"Pop",full:"Population Report",def:"How many coins PCGS or NGC has certified at each grade. 'Pop 3' means only 3 known in that grade. Low pop = more valuable."},
          {term:"Registry",full:"Registry Set",def:"PCGS and NGC allow collectors to compete for the highest-graded set of a series. Registry competition drives demand for top-pop coins."},
          {term:"Condition Census",full:"Condition Census",def:"The list of the finest known examples of a given coin. Being on the CC (usually top 5–10) adds significant value and prestige."},
          {term:"Finest Known",full:"Finest Known",def:"The single highest-graded example of a coin. 'Finest Known' coins command extraordinary premiums."},
          {term:"Key Date",full:"Key Date",def:"The rarest date/mintmark combination in a series. Required to complete a set. Commands the highest prices. Example: 1916-D Mercury dime."},
          {term:"Semi-Key",full:"Semi-Key Date",def:"A scarcer-than-average date but not the rarest in the series. Still worth a premium over common dates."},
          {term:"Type Coin",full:"Type Coin",def:"A single representative example of a design type, regardless of date. Collecting one Morgan dollar = type collecting. Cheaper than date collecting."},
          {term:"Junk Silver",full:"Junk Silver",def:"Pre-1965 US dimes, quarters, and halves sold for their silver content, not numismatic value. Common dates traded near melt. 90% silver."},
          {term:"Toned",full:"Naturally Toned",def:"Original patina from age and chemical exposure. Natural toning is desirable and adds value. Rainbow toning on Morgan dollars = premium."},
          {term:"AT",full:"Artificially Toned",def:"Toning intentionally induced with chemicals to fake natural toning. Graders can usually detect it. Artificially toned coins receive Details grades or are straight-graded lower."},
          {term:"OGH",full:"Original Green Holder",def:"Old PCGS holders from before 2000 with green inserts. Some collectors prefer coins in original older holders, especially for registry sets."},
          {term:"Crackout",full:"Cracking Out",def:"Opening a certified slab to resubmit the coin hoping for a higher grade. A cracked-out coin loses its certification and must be resubmitted."},
          {term:"Cherrypick",full:"Cherrypicking",def:"Finding an undervalued coin — usually a die variety or error that the seller didn't recognize. Example: buying a coin labeled '1974-D Kennedy Half' that is actually the rare DDO variety."},
          {term:"PQ",full:"Premium Quality",def:"A coin at the high end of its grade. A PQ MS-64 is nearly MS-65. Dealers use this informally. CAC sticker is the official version."},
        ]
      },
      {
        section:"🪙 Strike & Surface Designations",
        color:"#b05dea",
        intro:"Terms describing how a coin was struck and what its surfaces look like.",
        terms:[
          {term:"Business Strike",full:"Business Strike / Circulation Strike",def:"Regular coins made for everyday use. Most coins are business strikes. Abbreviated BU (Brilliant Uncirculated) when uncirculated."},
          {term:"Proof Strike",full:"Proof",def:"Specially made collector coins struck at least twice with polished dies and hand-selected planchets. Mirror-like fields, frosted devices. Never released to circulation."},
          {term:"SMS",full:"Special Mint Set",def:"1965–1967 coins struck with extra care but not full proof quality. No mintmarks. Better than business strikes but below proof. Collectible in high grades."},
          {term:"BU",full:"Brilliant Uncirculated",def:"Uncirculated coin with full luster. Not a Sheldon grade — more of a quality description. Generally MS-60 to MS-63 range."},
          {term:"Gem",full:"Gem Uncirculated",def:"High-quality uncirculated coin. Generally MS-65 or better."},
          {term:"Superb Gem",full:"Superb Gem",def:"MS-67 or better. Exceptionally high quality."},
          {term:"Weak Strike",full:"Weak Strike",def:"Coin struck with insufficient pressure or worn dies. Design details are soft or missing. Common on Buffalo nickels (date) and Standing Liberty quarters (head). Not an error — reduces value."},
          {term:"Sharp Strike",full:"Sharp / Full Strike",def:"All design details fully defined with crisp, complete detail. Adds premium especially on series known for weak strikes."},
          {term:"Luster",full:"Luster",def:"The cartwheel-like sheen of an uncirculated coin from its raised flow lines. Descriptions: Frosty, Satiny, Blazing, Cartwheel. Lost instantly from any wear."},
          {term:"Hairlines",full:"Hairlines",def:"Fine parallel scratches usually from cleaning. Kill a coin's grade. Even one visible hairline drops a proof from PR-65 to Details."},
          {term:"Bag Marks",full:"Bag Marks / Contact Marks",def:"Marks from coins banging against each other in mint bags during shipping. Not cleaning — part of normal MS grading. More = lower MS grade."},
          {term:"Planchet",full:"Planchet",def:"The blank metal disc before it's struck into a coin. 'Planchet errors' happen before or during striking."},
          {term:"Die",full:"Die",def:"The steel stamp used to strike coins. Obverse die (heads) and reverse die (tails). Dies wear out and are replaced. All errors ultimately come from die or planchet problems."},
          {term:"Hub",full:"Hub",def:"The master positive image used to make working dies. Hub is pressed into die steel to transfer the design. Doubled dies happen when hub impressions are misaligned."},
          {term:"Collar",full:"Collar / Retaining Collar",def:"The ring that holds the planchet in place during striking and adds the edge (reeding or smooth). Broadstrikes happen when the collar is missing."},
          {term:"Reeding",full:"Reeding",def:"The serrated edge design on dimes, quarters, halves, and dollars. Smooth edge = nickels, cents. Added by the collar during striking."},
          {term:"Denticles",full:"Denticles",def:"The small tooth-like bumps around the inner rim of older coins. Modern coins use a plain rim. Misplaced dates often appear in the denticles."},
        ]
      },
      {
        section:"🏛️ Mint & History Terms",
        color:"#c8a84b",
        intro:"Understanding where coins came from and what those mintmarks mean.",
        terms:[
          {term:"P",full:"Philadelphia Mint",def:"The main US Mint. No mintmark on most coins until 1980 (P added then). Still no P on Lincoln cents. Located in Philadelphia, PA. Oldest US mint (1792)."},
          {term:"D",full:"Denver Mint",def:"D mintmark. Opened 1906. Second highest output mint. D mintmark appears on reverse of most pre-1968 coins, obverse after that."},
          {term:"S",full:"San Francisco Mint",def:"S mintmark. Major mint 1854–1955. Now primarily proof coins for collectors. S mint coins from the 19th century are often scarcer and more valuable."},
          {term:"W",full:"West Point Mint",def:"W mintmark. Opens 1984 for gold/silver bullion. Some collector coins. W mint American Silver Eagles are key dates."},
          {term:"O",full:"New Orleans Mint",def:"O mintmark. Operated 1838–1909. Famous for Morgan dollars. New Orleans Morgans are among the most collected. Closed after 1909."},
          {term:"CC",full:"Carson City Mint",def:"CC mintmark. Operated 1870–1893. Located near Nevada silver mines. Carson City coins are the most prized of all mintmarks — every CC coin commands a premium."},
          {term:"C",full:"Charlotte Mint",def:"C mintmark. 1838–1861. Gold coins only. Confederate connection — closed at start of Civil War. Very collectible."},
          {term:"D (Dahlonega)",full:"Dahlonega Mint",def:"D mintmark pre-Denver. 1838–1861. Gold coins only. Pre-Civil War Georgia gold mint. Very rare — same D mintmark as Denver but much earlier."},
          {term:"GSA",full:"General Services Administration",def:"US government agency that sold Treasury-stored Carson City Morgans in the 1970s in special black holders. Coins in original GSA holders carry a premium."},
          {term:"Assay",full:"Assay Commission",def:"Annual testing of coin metal content. Some early coins have 'Assay' on edge. Coins with assay errors are extremely rare."},
          {term:"Type",full:"Coin Type",def:"A specific design period. 'Type 1' vs 'Type 2' Buffalo nickel (1913 only — different reverse). '1878 8TF' vs '1878 7TF' Morgan. Same date but different design = different type."},
          {term:"Obverse",full:"Obverse",def:"The front of the coin. Usually contains the portrait (Lincoln, Jefferson, Washington, etc.) and date. The 'heads' side."},
          {term:"Reverse",full:"Reverse",def:"The back of the coin. Usually the denomination, E PLURIBUS UNUM, and main reverse design (eagle, memorial, etc.). The 'tails' side."},
          {term:"Legend",full:"Legend",def:"The words on a coin — UNITED STATES OF AMERICA, E PLURIBUS UNUM, IN GOD WE TRUST, LIBERTY, etc."},
          {term:"Device",full:"Device",def:"Any raised design element — portrait, eagle, torch, etc. 'Devices' are the frosted elements on proof coins."},
          {term:"Field",full:"Field",def:"The flat background area of a coin surrounding the devices. Mirror-like on proofs. Marks in the field are most damaging to grade."},
          {term:"Exergue",full:"Exergue",def:"The lower portion of a coin's reverse below the main design, usually containing the date or denomination."},
          {term:"Edge",full:"Edge",def:"The rim/side of the coin. Can be reeded (serrated), plain (smooth), lettered (Presidential dollars), or decorated. Some errors affect the edge."},
        ]
      },
      {
        section:"🎨 Toning & Eye Appeal",
        color:"#5dba82",
        intro:"Toning is one of the most subjective — and important — factors in a coin's desirability and price.",
        terms:[
          {term:"OT / Original Toning",full:"Original Toning",def:"Natural color change from aging — chemical reactions with the environment over decades. Considered desirable. Original toning proves a coin hasn't been cleaned."},
          {term:"AT / Artificial Toning",full:"Artificial Toning",def:"Toning induced chemically by a coin doctor to fake natural aging, hide problems, or create rainbow effects. Graders can usually detect it. Results in Details grade."},
          {term:"Rainbow Toning",full:"Rainbow Toning",def:"Multi-color natural toning showing reds, blues, greens, purples in bands. Common on Morgan dollars stored in albums or bank bags. Genuine rainbow toning adds 20–100% premium."},
          {term:"Album Toning",full:"Album Toning",def:"Toning from chemicals in old paper/cardboard coin albums. Creates distinctive patterns, often from album pages pressing against coins. Desirable if original."},
          {term:"Carbon Spot",full:"Carbon Spot",def:"Black spot on a coin's surface from oxidation or environmental contamination. Reduces grade and value significantly. Cannot be removed without damaging the coin."},
          {term:"Milk Spots",full:"Milk Spots",def:"White hazy spots appearing on modern proof and bullion coins (especially Silver Eagles). Caused by contamination during minting. Reduces grade."},
          {term:"PVC Damage",full:"PVC Damage",def:"Green slime-like residue from storing coins in old soft plastic (PVC) flips. Chemical reaction destroys surfaces. Never store coins in PVC holders."},
          {term:"Environmental Damage",full:"Environmental Damage",def:"Damage from exposure to moisture, chemicals, or air. Corrosion, verdigris (green patina on copper), or etching. Results in Details grade."},
          {term:"Eye Appeal",full:"Eye Appeal",def:"Subjective overall visual attractiveness. Graders consider it — a coin with great eye appeal can grade higher than one with more marks but dull appearance. CAC sticker = exceptional eye appeal."},
          {term:"Cartwheel Effect",full:"Cartwheel Luster",def:"The spinning, cartwheel-like luster visible when you rotate an uncirculated coin under a light. Created by flow lines in the metal during striking. Disappears with wear."},
          {term:"Blazing",full:"Blazing Luster",def:"Exceptionally strong, bright luster. Premium descriptor for uncirculated coins with full original mint bloom."},
          {term:"Cleaned",full:"Cleaned",def:"Coin has been polished, dipped, or otherwise treated to alter its surface. Destroys luster. Most common reason for a Details grade. Never clean a coin."},
          {term:"Dipped",full:"Dipped",def:"Coin briefly treated with chemical coin dip (dilute acid) to remove toning. Can be acceptable if lightly done, but over-dipping strips the coin. Experienced graders can often detect."},
          {term:"Whizzed",full:"Whizzed",def:"Coin's surface rapidly wire-brushed to create fake luster. Obvious to any experienced eye under magnification. Severe damage — always gets Details grade."},
        ]
      },
      {
        section:"📐 Coin Specifications",
        color:"#5d9eba",
        intro:"Quick reference for weights, sizes, and compositions — essential for detecting wrong planchet errors.",
        terms:[
          {term:"Lincoln Cent",full:"1¢ — Lincoln Cent",def:"Copper 1909–1982: 3.11g, 19mm. Zinc 1982–present: 2.50g, 19mm. Steel 1943: 2.70g, 19mm. Any cent that weighs differently is worth investigating."},
          {term:"Jefferson Nickel",full:"5¢ — Jefferson Nickel",def:"Copper-nickel 1938–present: 5.00g, 21.2mm. Wartime silver 1942–1945: 5.00g, 21.2mm (same weight, 35% silver — ID by large mintmark above Monticello)."},
          {term:"Roosevelt Dime",full:"10¢ — Dime",def:"Silver 1946–1964: 2.50g, 17.9mm. Clad 1965–present: 2.27g, 17.9mm. Any 1965+ dime weighing 2.50g = silver transitional error. Worth $3,000–$9,000."},
          {term:"Washington Quarter",full:"25¢ — Quarter",def:"Silver 1932–1964: 6.25g, 24.3mm. Clad 1965–present: 5.67g, 24.3mm. Any 1965+ quarter at 6.25g = silver transitional. Worth $5,000–$12,000+."},
          {term:"Kennedy Half",full:"50¢ — Half Dollar",def:"Silver 1964: 12.50g. 40% silver 1965–1970: 11.50g. Clad 1971–present: 11.34g. 1971 half at 11.50g = transitional silver error, worth $6,000–$13,000."},
          {term:"Morgan Dollar",full:"$1 — Morgan Dollar",def:"90% silver 1878–1921: 26.73g, 38.1mm. 0.7734 troy oz pure silver. Heavy and substantial. Weight is very consistent — any deviation means a problem."},
          {term:"Sacagawea Dollar",full:"$1 — Sacagawea/Presidential Dollar",def:"Manganese brass 2000–present: 8.1g, 26.5mm. Wrong planchet Sacagaweas (on cent, nickel, or dime planchet) are dramatic rarities worth $3,000–$8,000+."},
          {term:"Troy Ounce",full:"Troy Ounce",def:"The unit for precious metals. 1 troy oz = 31.1 grams (vs 28.35g for a regular ounce). Silver Eagles contain exactly 1 troy oz. Morgan dollars contain 0.7734 troy oz."},
          {term:"ASW",full:"Actual Silver Weight",def:"The amount of pure silver in a coin. Dime: 0.0723 troy oz. Quarter: 0.1808 troy oz. Half: 0.3617 troy oz. Morgan/Peace Dollar: 0.7734 troy oz. Multiply by silver spot price for melt value."},
          {term:"AGW",full:"Actual Gold Weight",def:"Pure gold in a coin. American Gold Eagle (1oz): 0.9167 troy oz gold. Gold Buffalo: 1.0000 troy oz. Multiply by gold spot price for melt value."},
          {term:"Alloy",full:"Alloy",def:"Metal mixture. US clad coins = copper core + nickel/copper outer layers. 90% silver coins = 90% silver, 10% copper. Wartime nickels = 35% silver, 56% copper, 9% manganese."},
        ]
      },
    ];

    const allTerms = GLOSSARY.flatMap(s=>s.terms.map(t=>({...t,section:s.section,sectionColor:s.color})));
    const filtered = gSearch ? allTerms.filter(t=>
      t.term.toLowerCase().includes(gSearch.toLowerCase()) ||
      t.full.toLowerCase().includes(gSearch.toLowerCase()) ||
      t.def.toLowerCase().includes(gSearch.toLowerCase())
    ) : null;

    return(
      <div style={{paddingBottom:80}}>
        <PageHeader title="🔤 Coin Glossary"/>
        <div style={{padding:"10px 14px"}}>
          <div style={{fontSize:12,color:C.textDim,marginBottom:10}}>Every abbreviation, grade, designation, and term used in coin collecting — decoded in plain English.</div>
          <input
            value={gSearch}
            onChange={e=>setGSearch(e.target.value)}
            placeholder="🔍  Search any term, abbreviation, or word…"
            style={{...{padding:"10px 12px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"},marginBottom:12}}
          />

          {/* SEARCH RESULTS */}
          {filtered&&<>
            <div style={{fontSize:11,color:C.textDim,marginBottom:8}}>{filtered.length} result{filtered.length!==1?"s":""} for "{gSearch}"</div>
            {filtered.length===0&&<div style={{textAlign:"center",padding:"30px",color:C.textDim}}>No terms found. Try a different search.</div>}
            {filtered.map((t,i)=>(
              <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:4}}>
                  <span style={{fontSize:15,color:t.sectionColor,fontWeight:"bold",fontFamily:"monospace",minWidth:60,flexShrink:0}}>{t.term}</span>
                  <span style={{fontSize:12,color:C.textDim,fontStyle:"italic",paddingTop:2}}>{t.full}</span>
                </div>
                <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{t.def}</div>
                <div style={{fontSize:9,color:t.sectionColor,marginTop:6,opacity:0.7}}>{t.section}</div>
              </div>
            ))}
          </>}

          {/* SECTION BROWSE */}
          {!filtered&&GLOSSARY.map((sec,si)=>{
            const isOpen=openSection===si;
            return(
              <div key={si} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,marginBottom:10,overflow:"hidden"}}>
                <div onClick={()=>setOpenSection(isOpen?null:si)} style={{padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,color:sec.color,fontWeight:"bold"}}>{sec.section}</div>
                    <div style={{fontSize:11,color:C.textDim,marginTop:2}}>{sec.terms.length} terms</div>
                  </div>
                  <span style={{fontSize:20,color:C.textDim,transform:isOpen?"rotate(90deg)":"rotate(0deg)",display:"inline-block",transition:"transform .2s"}}>›</span>
                </div>
                {isOpen&&<div style={{borderTop:`1px solid ${C.border2}`,padding:"10px 14px"}}>
                  <div style={{fontSize:11,color:sec.color,marginBottom:10,lineHeight:1.5}}>{sec.intro}</div>
                  {sec.terms.map((t,ti)=>(
                    <div key={ti} style={{marginBottom:12,paddingBottom:12,borderBottom:ti<sec.terms.length-1?`1px solid ${C.border2}`:"none"}}>
                      <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap",marginBottom:4}}>
                        <span style={{fontSize:14,color:sec.color,fontWeight:"bold",fontFamily:"monospace"}}>{t.term}</span>
                        <span style={{fontSize:11,color:C.textDim,fontStyle:"italic"}}>{t.full}</span>
                      </div>
                      <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{t.def}</div>
                    </div>
                  ))}
                </div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── COIN LOOKUP DATABASE ──────────────────────────────────────────────────
  const COIN_DB = {
    // Format: "DENOM|YEAR_START-YEAR_END|MINTS" → {series, metal, notes, keyDates, pcgsId}
    // Indexed by denomination for fast filtering

    "1¢": [
      {series:"Flowing Hair / Liberty Cap Cent",years:"1793–1796",metal:"Copper",mints:["P"],notes:"First US cents. Extremely rare in any grade. 1793 Chain type is the rarest.",keys:["1793 Chain","1793 Wreath","1793 Liberty Cap","1795"]},
      {series:"Draped Bust Cent",years:"1796–1807",metal:"Copper",mints:["P"],notes:"Large cents. Popular early type. 1799 is the key date.",keys:["1799","1804"]},
      {series:"Classic Head Cent",years:"1808–1814",metal:"Copper",mints:["P"],notes:"Short series, all dates scarce. Low mintages throughout.",keys:["1809","1811"]},
      {series:"Coronet / Matron Head Cent",years:"1816–1839",metal:"Copper",mints:["P"],notes:"Many varieties. 1823 is key date.",keys:["1821","1823","1839"]},
      {series:"Braided Hair Cent",years:"1839–1857",metal:"Copper",mints:["P"],notes:"Last large cents. 1849–1857 common. 1841–1848 semi-keys.",keys:["1841","1848","1857"]},
      {series:"Flying Eagle Cent",years:"1856–1858",metal:"Copper-Nickel",mints:["P"],notes:"Short 3-year series. 1856 is a proof-only rarity (~2,000 struck).",keys:["1856","1858 Double Die Obverse"]},
      {series:"Indian Head Cent (Copper-Nickel)",years:"1859–1864",metal:"Copper-Nickel",mints:["P"],notes:"'White cents.' 1859 reverse has no shield — one-year type.",keys:["1859","1860 Pointed Bust","1863","1864 CN"]},
      {series:"Indian Head Cent (Bronze)",years:"1864–1909",metal:"Bronze",mints:["P","S"],notes:"1864-L = Longacre initial on ribbon (loupe required). 1877 = key date. 1908-S/1909-S = first branch mint cents.",keys:["1864-L","1873 DDO","1877","1878","1888/7","1894 Doubled Date","1908-S","1909-S"]},
      {series:"Lincoln Cent (Wheat)",years:"1909–1958",metal:"Copper",mints:["P","D","S"],notes:"1909-S VDB = most famous wheat cent. 1943 = steel (magnet test). 1955 DDO = most famous DDO.",keys:["1909-S VDB","1909-S","1914-D","1922 Plain","1931-S","1943 Copper","1944 Steel","1955 DDO","1969-S DDO","1972 DDO"]},
      {series:"Lincoln Cent (Memorial)",years:"1959–2008",metal:"Copper/Zinc",mints:["P","D","S"],notes:"Most dates worth face. 1969-S DDO, 1972 DDO, 1992 Close AM are key errors. 1982 transition year (7 varieties).",keys:["1969-S DDO","1972 DDO","1982-D Copper Small Date","1983 Copper","1984 DDO","1992 Close AM","1995 DDO","1999 Wide AM"]},
      {series:"Lincoln Cent (Shield)",years:"2010–2025",metal:"Copper-Plated Zinc",mints:["P","D","S","W"],notes:"Modern cents. Most worth face value. Look for doubled dies and die varieties.",keys:["2019-W","2020-W","2024 Omega Privy"]},
    ],
    "2¢": [
      {series:"Two-Cent Piece",years:"1864–1873",metal:"Bronze",mints:["P"],notes:"First US coin to bear IN GOD WE TRUST. 1864 Small Motto is the key variety.",keys:["1864 Small Motto","1872","1873 Proof Only"]},
    ],
    "3¢": [
      {series:"Three-Cent Silver (Trime)",years:"1851–1873",metal:"90% Silver",mints:["P","O"],notes:"Smallest silver coin ever. 1851-O is the only branch mint issue.",keys:["1851-O","1862","1863","1872","1873 Proof Only"]},
      {series:"Three-Cent Nickel",years:"1865–1889",metal:"Copper-Nickel",mints:["P"],notes:"1877 and 1878 are proof-only. 1887/6 overdate is key variety.",keys:["1877 Proof","1878 Proof","1887/6"]},
    ],
    "5¢": [
      {series:"Shield Nickel",years:"1866–1883",metal:"Copper-Nickel",mints:["P"],notes:"First 5¢ nickel coins. With Rays (1866–1867) and Without Rays (1867–1883) varieties.",keys:["1866 Rays","1867 Rays","1880","1881","1882","1883/2"]},
      {series:"Liberty Head Nickel",years:"1883–1912",metal:"Copper-Nickel",mints:["P","D","S"],notes:"1883 No CENTS (first year) vs With CENTS varieties. 1885, 1886, 1912-S = key dates. Only 5 known 1913s.",keys:["1883 No Cents","1885","1886","1912-S","1913 (5 known)"]},
      {series:"Buffalo Nickel",years:"1913–1938",metal:"Copper-Nickel",mints:["P","D","S"],notes:"1913 Type 1 (raised ground) vs Type 2 (recessed). 1916 DDO, 1918/7-D overdate, 1926-S, 1936-D 3½-Leg, 1937-D 3-Leg = major varieties.",keys:["1913-S T2","1916 DDO","1918/7-D","1921-S","1924-S","1926-S","1936-D 3.5 Leg","1937-D 3 Leg","1938-D/S"]},
      {series:"Jefferson Nickel",years:"1938–present",metal:"Copper-Nickel / 35% Silver",mints:["P","D","S","W"],notes:"1942–1945 = 35% silver wartime (large mintmark above Monticello). 1950-D = key date. Full Steps (FS) premium.",keys:["1939-D","1942-D Horiz D","1943/2-P","1950-D","2004 Peace Medal DDO","2005-D Speared Bison","2005-P Detached Leg"]},
    ],
    "10¢": [
      {series:"Flowing Hair Dime",years:"1796–1797",metal:"89.25% Silver",mints:["P"],notes:"Extremely rare. One of the first US dimes ever struck.",keys:["1796","1797"]},
      {series:"Draped Bust Dime",years:"1796–1807",metal:"89.25% Silver",mints:["P"],notes:"Small Eagle reverse (1796–1797) and Heraldic Eagle (1798–1807). Very scarce.",keys:["1796","1797","1804","1807"]},
      {series:"Capped Bust Dime",years:"1809–1837",metal:"89.25% Silver",mints:["P"],notes:"Many varieties. 1822 = key date. Large and Small size types.",keys:["1822","1829 Curl Base 2","1837"]},
      {series:"Seated Liberty Dime",years:"1837–1891",metal:"90% Silver",mints:["P","O","S","CC"],notes:"Many design varieties. No Stars (1837–1838), Stars, Legend types. 1894-S Barber (wrong series but near) — actually CC dates are the rarities here.",keys:["1838-O No Stars","1844","1846","1853-O No Arrows","1860-O","1871-CC","1872-CC","1873-CC No Arrows"]},
      {series:"Barber Dime",years:"1892–1916",metal:"90% Silver",mints:["P","O","S"],notes:"1894-S = 9 known, most valuable dime ever. 1895-O, 1896-S, 1901-S = key dates.",keys:["1894-S","1895-O","1896-S","1901-S","1903-S"]},
      {series:"Mercury Dime",years:"1916–1945",metal:"90% Silver",mints:["P","D","S"],notes:"Full Split Bands (FSB) = major premium. 1916-D = key date (264,000 minted). 1942/1 overdate = most valuable Mercury variety.",keys:["1916-D","1921","1921-D","1926-S","1931-D","1931-S","1942/1","1942/1-D"]},
      {series:"Roosevelt Dime (Silver)",years:"1946–1964",metal:"90% Silver",mints:["P","D","S"],notes:"Full Bands (FB/FT) premium. 1949-S = key semi-date. 1955 DDR, 1946 DDO = major varieties. All worth silver melt minimum.",keys:["1946 DDO","1949-S","1950-S","1951-S","1955 DDR","1982 No-P"]},
      {series:"Roosevelt Dime (Clad)",years:"1965–present",metal:"Clad",mints:["P","D","S","W"],notes:"Most worth face value. 1965 silver transitional error = $3,000–$9,000. No-S proofs (1968, 1970, 1975, 1983) = ultra rare. 1982 No-P = most findable error.",keys:["1965 Silver Error","1968 No-S Proof","1970 No-S Proof","1975 No-S Proof","1982 No-P","1983 No-S Proof"]},
    ],
    "20¢": [
      {series:"Twenty-Cent Piece",years:"1875–1878",metal:"90% Silver",mints:["P","S","CC"],notes:"Short-lived denomination. 1875-S = most common. 1876-CC = key date. 1877 and 1878 = proof only.",keys:["1875-CC","1876-CC","1877 Proof","1878 Proof"]},
    ],
    "25¢": [
      {series:"Draped Bust Quarter",years:"1796–1807",metal:"89.25% Silver",mints:["P"],notes:"Very rare series. 1796 = first quarter, Small Eagle reverse. No quarters struck 1797–1803.",keys:["1796","1804","1805","1807"]},
      {series:"Capped Bust Quarter",years:"1815–1838",metal:"89.25% Silver",mints:["P"],notes:"Large and Small size. 1827/3/2 overdate = rarest. Many varieties.",keys:["1823/2","1827/3/2","1832","1836"]},
      {series:"Seated Liberty Quarter",years:"1838–1891",metal:"90% Silver",mints:["P","O","S","CC"],notes:"Many design types. Arrows (1853–1855, 1873–1874), Rays, Motto varieties. CC dates = premium.",keys:["1842-O Small Date","1850-O","1853-O No Arrows","1855-S","1871-CC","1872-CC","1873-CC Arrows"]},
      {series:"Barber Quarter",years:"1892–1916",metal:"90% Silver",mints:["P","O","S"],notes:"1896-S, 1901-S = major key dates. 1913-S = low mintage. Most dates very scarce in high grade.",keys:["1896-S","1901-S","1913-S"]},
      {series:"Standing Liberty Quarter",years:"1916–1930",metal:"90% Silver",mints:["P","D","S"],notes:"Type 1 (1916–1917, bare breast) and Type 2 (1917+, chainmail). Full Head (FH) = premium. 1916 = king of the series.",keys:["1916","1917-D T1","1917-S T1","1918/7-S","1919-D","1921","1923-S","1926-S"]},
      {series:"Washington Quarter (Silver)",years:"1932–1964",metal:"90% Silver",mints:["P","D","S"],notes:"1932-D and 1932-S = only two key dates. Most dates common. All worth silver melt minimum.",keys:["1932-D","1932-S","1936-D","1950-D/S","1950-S/D"]},
      {series:"Washington Quarter (Clad)",years:"1965–1998",metal:"Clad",mints:["P","D","S"],notes:"1965 silver transitional = $5,000+. Most dates worth face. 1970-D only in mint sets.",keys:["1965 Silver Error","1970-D Mint Set Only"]},
      {series:"State Quarter",years:"1999–2008",metal:"Clad",mints:["P","D","S"],notes:"50 states. Most worth face. 2004-D Wisconsin Extra Leaf (High & Low) = key errors. 1999-P Delaware missing 'E' = filled die error.",keys:["1999-P Delaware Missing E","2004-D Wisconsin EL High","2004-D Wisconsin EL Low"]},
      {series:"District of Columbia & Territories Quarter",years:"2009",metal:"Clad",mints:["P","D","S"],notes:"6 designs: DC, Puerto Rico, Guam, USVI, American Samoa, N. Mariana Islands. All common.",keys:[]},
      {series:"America the Beautiful Quarter",years:"2010–2021",metal:"Clad",mints:["P","D","S","W"],notes:"56 designs. W mint quarters (2019–2021) = first circulating W mint quarters, worth $5–$10+ each. Check W mintmark.",keys:["2019-W Lowell","2019-W American Memorial","2019-W River of No Return","2019-W War in the Pacific","2019-W Frank Church"]},
      {series:"American Women Quarter",years:"2022–2025",metal:"Clad",mints:["P","D","S","W"],notes:"5 designs per year. Modern series. Look for doubled dies and die varieties as they develop.",keys:["2022 Maya Angelou DDO","2023 Bessie Coleman DDO"]},
    ],
    "50¢": [
      {series:"Flowing Hair Half Dollar",years:"1794–1795",metal:"89.25% Silver",mints:["P"],notes:"First US half dollars. Extremely rare. 15-leaf and 13-leaf reverse varieties.",keys:["1794","1795"]},
      {series:"Draped Bust Half Dollar",years:"1796–1807",metal:"89.25% Silver",mints:["P"],notes:"Very rare series. 1796 = only 3,918 minted.",keys:["1796","1797","1805/4","1806/5"]},
      {series:"Capped Bust Half Dollar",years:"1807–1839",metal:"89.25% Silver",mints:["P"],notes:"Large series with many varieties. First O-mint halves in 1838. Lettered edge.",keys:["1815/2","1817/4","1838-O","1839-O"]},
      {series:"Seated Liberty Half Dollar",years:"1839–1891",metal:"90% Silver",mints:["P","O","S","CC"],notes:"Many design types. Arrows, Rays, Motto varieties. CC dates = premium.",keys:["1853-O No Arrows","1855-S","1866-S No Motto","1870-CC","1871-CC","1878-S"]},
      {series:"Barber Half Dollar",years:"1892–1915",metal:"90% Silver",mints:["P","O","S"],notes:"1892-O Micro O = major variety. 1897-S, 1904-S = key dates. Most dates scarce in high grade.",keys:["1892-O Micro O","1897-O","1897-S","1904-S"]},
      {series:"Walking Liberty Half Dollar",years:"1916–1947",metal:"90% Silver",mints:["P","D","S"],notes:"Most beloved US half. 1916 & 1917 obverse mintmark = rare varieties. 1921, 1921-D, 1921-S = key dates. 1938-D = last year key.",keys:["1916-S Obv MM","1917-D Obv MM","1917-S Obv MM","1921","1921-D","1921-S","1938-D"]},
      {series:"Franklin Half Dollar",years:"1948–1963",metal:"90% Silver",mints:["P","D","S"],notes:"Full Bell Lines (FBL) = major premium. 1949-S, 1955 = semi-keys. 1955-1956 Bugs Bunny = die clash variety.",keys:["1949-S","1953-S","1955","1955 Bugs Bunny","1956 Bugs Bunny"]},
      {series:"Kennedy Half Dollar (Silver)",years:"1964",metal:"90% Silver",mints:["P"]  ,notes:"Only year of 90% silver. Accented Hair proof = earlier die variety. High grade MS coins = key collectibles.",keys:["1964 Accented Hair Proof"]},
      {series:"Kennedy Half Dollar (40% Silver)",years:"1965–1970",metal:"40% Silver",mints:["P","D"],notes:"All worth more than face for silver content. 1970-D = only in mint sets, no circulation release.",keys:["1970-D Mint Set Only"]},
      {series:"Kennedy Half Dollar (Clad)",years:"1971–present",metal:"Clad",mints:["P","D","S","W"],notes:"No FG varieties (1972-D, 1982-P) = collectible. 1974-D DDO = major variety. 1998-S Matte Proof = lowest mintage clad half.",keys:["1971-D Silver Planchet Error","1972-D No FG","1974-D DDO","1982-P No FG","1998-S Matte Proof"]},
    ],
    "$1": [
      {series:"Flowing Hair Dollar",years:"1794–1795",metal:"89.25% Silver",mints:["P"],notes:"First US dollars. 1794 = most valuable US coin ever sold ($10M+). Only ~130 known.",keys:["1794","1795"]},
      {series:"Draped Bust Dollar",years:"1795–1804",metal:"89.25% Silver",mints:["P"],notes:"Small Eagle (1795–1798) and Heraldic Eagle (1798–1804). 1804 = phantom date, 15 known, worth millions.",keys:["1795 Flowing Hair","1798","1799","1804 (15 known)"]},
      {series:"Gobrecht Dollar",years:"1836–1839",metal:"90% Silver",mints:["P"],notes:"Pattern/proof coins. Very few struck. Transition between Draped Bust and Seated Liberty.",keys:["1836","1838","1839"]},
      {series:"Seated Liberty Dollar",years:"1840–1873",metal:"90% Silver",mints:["P","O","S","CC"],notes:"With Motto (1866+) and Without Motto types. CC dates = premium. 1870-S = 9–12 known.",keys:["1851","1852","1858 Proof","1866 No Motto","1870-S","1871-CC","1872-CC","1873-CC"]},
      {series:"Trade Dollar",years:"1873–1885",metal:"90% Silver",mints:["P","S","CC"],notes:"Made for Asian trade. 420 grains vs standard 412.5. 1885 = proof only, extremely rare. Many chopmarked.",keys:["1878-CC","1878-S","1884 Proof","1885 Proof"]},
      {series:"Morgan Dollar",years:"1878–1904,1921",metal:"90% Silver",mints:["P","O","S","CC","D"],notes:"King of US coins. 1878 8TF, 7/8TF varieties. CC = premium. Key: 1893-S, 1895, 1889-CC. VAM varieties = 2,000+ documented.",keys:["1878 8TF","1878 7/8TF","1879-CC","1880/79","1880-S VAM-9","1882-O/S","1884-S","1888-O Hot Lips","1888-O Scarface","1889-CC","1891-CC Spitting Eagle","1893-S","1895 Proof","1900-O/CC","1901 Shifted Eagle","1903-S","1904-S"]},
      {series:"Peace Dollar",years:"1921–1928,1934–1935",metal:"90% Silver",mints:["P","D","S"],notes:"1921 = high relief first year. 1928 = lowest mintage. 1934-S, 1935-S = semi-keys.",keys:["1921","1928","1934-D","1934-S","1935-S"]},
      {series:"Eisenhower Dollar",years:"1971–1978",metal:"Clad / 40% Silver",mints:["P","D","S"],notes:"Silver versions from San Francisco. 1972 Type 2 reverse = scarce variety. Most clad dates common.",keys:["1972 Type 2","1973-S Silver","1974-S Silver"]},
      {series:"Susan B. Anthony Dollar",years:"1979–1981,1999",metal:"Clad",mints:["P","D","S"],notes:"1979-P Wide Rim = near date. 1981-S Type 2 proof = rarer proof variety. 1999 = scarce reissue year.",keys:["1979-P Wide Rim","1979-S Type 2 Proof","1981-S Type 2 Proof","1999-P"]},
      {series:"Sacagawea Dollar",years:"2000–present",metal:"Manganese Brass",mints:["P","D","S","W"],notes:"2000-P Cheerios = prototype reverse, $500–$30,000. 2000-P Mule (Washington obverse) = ultra rare. Most dates common.",keys:["2000-P Cheerios Prototype","2000-P Washington Mule","2008-W Reverse of 2007"]},
      {series:"Presidential Dollar",years:"2007–2016",metal:"Manganese Brass",mints:["P","D","S","W"],notes:"Edge lettering errors = most famous variety. Missing edge lettering = $50–$500. 2007-P Washington = most common edge error date.",keys:["2007-P Washington Missing Edge","2007-D Washington Missing Edge","Any Missing Edge Lettering"]},
      {series:"American Innovation Dollar",years:"2018–present",metal:"Manganese Brass",mints:["P","D","S","W"],notes:"Modern series. Look for die varieties as they develop. W mint = collector only.",keys:[]},
      {series:"American Silver Eagle",years:"1986–present",metal:"99.9% Silver",mints:["P","S","W"],notes:"Most popular US bullion coin. 1986 = first year. 1995-W Proof = ultra rare (~30,000). 1996 = lowest circulation year. 2019-S Enhanced Reverse Proof = modern key.",keys:["1986","1994","1995-W Proof","1996","2019-S Enhanced Reverse Proof","2021 Type 1/Type 2"]},
    ],
    "$2.50": [
      {series:"Capped Bust Quarter Eagle",years:"1796–1807",metal:"91.67% Gold",mints:["P"],notes:"Very rare early gold. 1796 No Stars = one-year type.",keys:["1796 No Stars","1797","1804","1808"]},
      {series:"Capped Head Quarter Eagle",years:"1821–1834",metal:"91.67% Gold",mints:["P"],notes:"Various design changes. 1826/5 overdate = key.",keys:["1826/5","1834"]},
      {series:"Classic Head Quarter Eagle",years:"1834–1839",metal:"91.67% Gold",mints:["P","D","C","O"],notes:"First branch mint quarter eagles. C and D mint = premium.",keys:["1839-C","1839-D"]},
      {series:"Liberty Head Quarter Eagle",years:"1840–1907",metal:"91.67% Gold",mints:["P","O","S","D","C"],notes:"Long series. Many branch mint dates scarce. 1854-S = only one known.",keys:["1854-S","1863","1865","1875"]},
      {series:"Indian Head Quarter Eagle",years:"1908–1929",metal:"91.67% Gold",mints:["P","D"],notes:"Incuse (recessed) design — unique in US coinage. 1911-D, 1914-D = key dates.",keys:["1911-D","1914-D","1925-D","1926","1929"]},
    ],
    "$3": [
      {series:"Three-Dollar Gold Piece",years:"1854–1889",metal:"90% Gold",mints:["P","S","D","O"],notes:"Unusual denomination made to purchase 3-cent stamps. 1870-S = 1 known. 1875 and 1876 = proof only.",keys:["1854-D","1854-O","1870-S","1875 Proof","1876 Proof","1878","1885","1886","1887","1888","1889"]},
    ],
    "$5": [
      {series:"Capped Bust Half Eagle",years:"1795–1807",metal:"91.67% Gold",mints:["P"],notes:"First US gold coins. Many varieties. Small and Heraldic Eagle reverses.",keys:["1795 Small Eagle","1798 Large Eagle","1799","1803"]},
      {series:"Capped Head Half Eagle",years:"1807–1834",metal:"91.67% Gold",mints:["P"],notes:"Many design changes over long run. 1815 = rare.",keys:["1815","1819","1822"]},
      {series:"Classic Head Half Eagle",years:"1834–1838",metal:"91.67% Gold",mints:["P","D","C"],notes:"First branch mint half eagles. C and D = premium.",keys:["1838-C","1838-D"]},
      {series:"Liberty Head Half Eagle",years:"1839–1908",metal:"91.67% Gold",mints:["P","O","S","D","C"],notes:"Long common series. Many dates scarce. CC dates = premium.",keys:["1854-S","1861-D Confederate","1864","1875","1878-S"]},
      {series:"Indian Head Half Eagle",years:"1908–1929",metal:"91.67% Gold",mints:["P","D","S"],notes:"Incuse design. 1909-O = key. 1929 = rare final year.",keys:["1909-O","1911-D","1929"]},
      {series:"American Gold Eagle (1/10 oz)",years:"1986–present",metal:"91.67% Gold",mints:["P","W"],notes:"Bullion coin. Value tracks gold spot. W proofs = premium.",keys:["1991","1999-W Proof"]},
    ],
    "$10": [
      {series:"Capped Bust Eagle",years:"1795–1804",metal:"91.67% Gold",mints:["P"],notes:"First US eagles. 1804 = very rare plain 4 and crosslet 4 varieties.",keys:["1795","1797 Small Eagle","1798/7","1804 Plain 4","1804 Crosslet 4"]},
      {series:"Liberty Head Eagle",years:"1838–1907",metal:"91.67% Gold",mints:["P","O","S","D","CC"],notes:"Long series. No Motto (1838–1866) and With Motto types. CC dates = premium.",keys:["1838","1858","1863","1875","1879-CC","1883-O","1885-S"]},
      {series:"Indian Head Eagle",years:"1907–1933",metal:"90% Gold",mints:["P","D","S"],notes:"High relief 1907 = among most beautiful US coins. Wire Rim and Rounded Rim 1907 varieties.",keys:["1907 Wire Rim","1907 Rolled Edge","1933","1920-S","1930-S"]},
      {series:"American Gold Eagle (1/4 oz)",years:"1986–present",metal:"91.67% Gold",mints:["P","W"],notes:"Bullion coin. Value tracks gold spot.",keys:["1991","1999-W Proof"]},
    ],
    "$20": [
      {series:"Liberty Head Double Eagle",years:"1849–1907",metal:"90% Gold",mints:["P","O","S","D","CC"],notes:"Type 1 (1849–1866), Type 2 (1866–1876), Type 3 (1877–1907). 1861 Paquet reverse = rarest. CC dates = premium.",keys:["1850","1854-O","1856-O","1861 Paquet","1866 No Motto","1879-O","1882","1891-CC","1907 High Relief Pattern"]},
      {series:"Saint-Gaudens Double Eagle",years:"1907–1933",metal:"90% Gold",mints:["P","D","S"],notes:"Most beautiful US coin. 1907 High Relief = breathtaking (12,317 struck). 1933 = illegal to own (1 legal example, sold for $18.9M). Ultra High Relief = pattern.",keys:["1907 High Relief","1908-D No Motto","1909/8","1920-S","1921","1924-D","1924-S","1925-D","1927-D","1929","1930-S","1931","1931-D","1932","1933"]},
    ],
    "$25": [
      {series:"American Gold Eagle (1/2 oz)",years:"1986–present",metal:"91.67% Gold",mints:["P","W"],notes:"Bullion coin. Value tracks gold spot price.",keys:["1991"]},
    ],
    "$50": [
      {series:"American Gold Eagle (1 oz)",years:"1986–present",metal:"91.67% Gold",mints:["P","W"],notes:"Most popular US gold bullion. 1991, 1999-W = key dates. Value = gold spot + premium.",keys:["1991","1999-W Proof","2006-W Reverse Proof"]},
      {series:"American Gold Buffalo",years:"2006–present",metal:"99.99% Gold",mints:["P","W"],notes:"First 24-karat US gold coin. .9999 fine. Very popular. Value tracks gold spot.",keys:["2006","2008-W Reverse Proof"]},
    ],
    "$100": [
      {series:"American Platinum Eagle",years:"1997–present",metal:"99.95% Platinum",mints:["W"],notes:"Only US platinum bullion coin. Reverse design changes annually for proofs. Value tracks platinum spot.",keys:["1997","1998"]},
    ],
  };

  const DENOM_LIST = ["1¢","2¢","3¢","5¢","10¢","20¢","25¢","50¢","$1","$2.50","$3","$5","$10","$20","$25","$50","$100"];
  const MINT_LIST = ["P – Philadelphia","D – Denver","S – San Francisco","O – New Orleans","CC – Carson City","W – West Point","C – Charlotte","D – Dahlonega (pre-Denver)"];
