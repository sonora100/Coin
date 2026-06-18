import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { C } from './config/colors';

// Components
import BottomNav from './components/BottomNav';

// Screens
import WelcomeScreen      from './screens/WelcomeScreen';
import HomeScreen         from './screens/HomeScreen';
import CoinsScreen        from './screens/CoinsScreen';
import CoinDetail         from './screens/CoinDetail';
import AddCoinForm        from './screens/AddCoinForm';
import ReferenceScreen    from './screens/ReferenceScreen';
import CollectiblesScreen from './screens/CollectiblesScreen';
import CollDetail         from './screens/CollDetail';
import AddCollForm        from './screens/AddCollForm';
import ErrorHunterScreen  from './screens/ErrorHunterScreen';
import StatsScreen        from './screens/StatsScreen';
import GlossaryScreen     from './screens/GlossaryScreen';
import CoinLookupScreen   from './screens/CoinLookupScreen';
import MetalsScreen       from './screens/MetalsScreen';
import WantListScreen     from './screens/WantListScreen';
import PurchaseScreen     from './screens/PurchaseScreen';
import AuctionScreen      from './screens/AuctionScreen';
import DealerScreen       from './screens/DealerScreen';
import TradeScreen        from './screens/TradeScreen';
import SetRegistryScreen  from './screens/SetRegistryScreen';
import HelpScreen         from './screens/HelpScreen';

function AppShell() {
  const { nav, view, toast, firstRun, dismissWelcome } = useApp();

  const showOverlay = view !== null;

  return (
    <div style={{
      minHeight:'100vh',
      background:C.bg,
      color:C.text,
      maxWidth:480,
      margin:'0 auto',
      position:'relative',
      overflowX:'hidden',
    }}>

      {/* Main Screen — hidden when overlay is active */}
      <div style={{ display: showOverlay ? 'none' : 'block' }}>
        {nav === 'home'         && <HomeScreen/>}
        {nav === 'coins'        && <CoinsScreen/>}
        {nav === 'collectibles' && <CollectiblesScreen/>}
        {nav === 'reference'    && <ReferenceScreen/>}
        {nav === 'errors'       && <ErrorHunterScreen/>}
        {nav === 'stats'        && <StatsScreen/>}
        {nav === 'glossary'     && <GlossaryScreen/>}
        {nav === 'lookup'       && <CoinLookupScreen/>}
        {nav === 'silver'       && <MetalsScreen/>}
        {nav === 'wantlist'     && <WantListScreen/>}
        {nav === 'purchases'    && <PurchaseScreen/>}
        {nav === 'auctions'     && <AuctionScreen/>}
        {nav === 'dealers'      && <DealerScreen/>}
        {nav === 'trades'       && <TradeScreen/>}
        {nav === 'sets'         && <SetRegistryScreen/>}
        {nav === 'help'         && <HelpScreen/>}
      </div>

      {/* Overlay Views (detail / form screens) */}
      {showOverlay && (
        <div style={{
          position:'fixed', inset:0,
          background:C.bg,
          zIndex:40,
          overflowY:'auto',
        }}>
          {view === 'coinDetail' && <CoinDetail/>}
          {view === 'addCoin'    && <AddCoinForm/>}
          {view === 'collDetail' && <CollDetail/>}
          {view === 'addColl'    && <AddCollForm/>}
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav/>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position:'fixed', bottom:70, left:'50%',
          transform:'translateX(-50%)',
          background:'#2a1f08',
          border:`1px solid ${C.gold}`,
          color:C.gold,
          padding:'10px 22px',
          borderRadius:8,
          fontSize:13,
          zIndex:100,
          boxShadow:'0 4px 16px rgba(0,0,0,.5)',
          letterSpacing:'.04em',
          pointerEvents:'none',
          whiteSpace:'nowrap',
        }}>
          {toast}
        </div>
      )}

      {/* Welcome / Onboarding Overlay */}
      {firstRun && <WelcomeScreen onDone={dismissWelcome}/>}

    </div>
  );
}

// Wrap with provider
export default function App() {
  return (
    <AppProvider>
      <AppShell/>
    </AppProvider>
  );
}
