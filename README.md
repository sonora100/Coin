# CoinVault

The complete US coin collecting companion.

## Features

- **Coin Vault** — track your entire collection with photos, grades, and values
- **Coin Lookup** — search any US coin by year, denomination, and mint
- **Error Hunter** — 124 specific error coins with step-by-step spotting instructions
- **Metals & Melt** — live gold, silver, and platinum prices with melt value calculator
- **Set Registry** — track completion of major US coin series
- **Want List** — coins you're hunting with priority and max price
- **Purchase Tracker** — log every buy with profit/loss tracking
- **Auction Log** — track every auction bid across Heritage, eBay, and more
- **Sales & Trades** — record every sale with profit/loss
- **Dealer Notes** — save dealer info with ratings and notes
- **Glossary** — 140+ coin collecting terms decoded in plain English
- **Help & Guide** — complete FAQ for every feature

---

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
# Output goes to /dist folder
```

---

## Deploy to Railway

1. Push this folder to GitHub:
```bash
git init
git add .
git commit -m "Initial CoinVault commit"
git remote add origin https://github.com/sonora100/coinvault.git
git push -u origin main
```

2. Go to railway.app → New Project → Deploy from GitHub repo

3. Select your coinvault repo

4. Railway auto-detects Vite — set these settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npx serve dist`
   - **Port:** `3000`

5. Add `serve` to dependencies:
```bash
npm install serve
```

6. Your app will be live at `yourapp.up.railway.app`

---

## Deploy to GitHub Pages (Free)

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

Live at: `https://sonora100.github.io/coinvault`

---

## Project Structure

```
src/
├── main.jsx              # React entry point
├── App.jsx               # Routing and layout
├── styles.css            # Global styles
├── config/
│   ├── colors.js         # Color palette
│   └── constants.js      # All app constants
├── context/
│   └── AppContext.jsx    # Global state (React Context)
├── data/
│   ├── coinSeries.js     # COIN_SERIES, COIN_REF, grade prices
│   ├── coinDb.js         # Full US coin lookup database
│   ├── errorData.js      # MOST_WANTED, ERROR_GUIDE, CHECKLIST
│   ├── glossaryData.js   # 140+ glossary terms
│   ├── metalsData.js     # Coin weights and purity data
│   └── setsData.js       # Set registry date lists
├── utils/
│   ├── storage.js        # localStorage helpers
│   ├── helpers.js        # Utility functions
│   ├── hooks.js          # Custom React hooks
│   └── pdfReport.js      # PDF report generator
├── components/
│   ├── BottomNav.jsx     # Bottom navigation bar
│   ├── PageHeader.jsx    # Screen header component
│   ├── Pill.jsx          # Label badge
│   ├── TrendBadge.jsx    # Market trend indicator
│   └── CoinRow.jsx       # Coin list item
└── screens/
    ├── WelcomeScreen.jsx
    ├── HomeScreen.jsx
    ├── CoinsScreen.jsx
    ├── CoinDetail.jsx
    ├── AddCoinForm.jsx
    ├── ReferenceScreen.jsx
    ├── CollectiblesScreen.jsx
    ├── CollDetail.jsx
    ├── AddCollForm.jsx
    ├── ErrorHunterScreen.jsx
    ├── StatsScreen.jsx
    ├── GlossaryScreen.jsx
    ├── CoinLookupScreen.jsx
    ├── MetalsScreen.jsx
    ├── WantListScreen.jsx
    ├── PurchaseScreen.jsx
    ├── AuctionScreen.jsx
    ├── DealerScreen.jsx
    ├── TradeScreen.jsx
    ├── SetRegistryScreen.jsx
    └── HelpScreen.jsx
```

---

## Live Metal Prices

Prices are fetched from **GoldAPI.io** (free, no API key required, CORS enabled).
Backup source: **gold-api.com**.
Auto-refreshes every 5 minutes when Metals tab is open.

---

## Data Storage

All user data is stored in **localStorage** on the device.
- Main collection: `coinvault_v6`
- Want list, purchases, auctions, etc. stored in separate keys

For a commercial version with cloud sync, a backend with user accounts would be needed.

---

## License

Private — all rights reserved.
