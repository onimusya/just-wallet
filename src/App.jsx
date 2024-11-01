import { useState, useEffect } from 'react';
import { WalletSetup } from "@/components/WalletSetup";
import { WalletSwitcher } from "@/components/WalletSwitcher";
import { WalletDashboard } from "@/components/WalletDashboard";
import { UnlockWallet } from "@/components/UnlockWallet";
import { Toaster } from "@/components/ui/toaster";
import { getStoredWallets } from "@/lib/storage";
import { JustIdentity } from "@/lib/identity";
import { useToast } from "@/hooks/use-toast";
import extjs from './lib/extjs';

// import './App.css'

function App() {
  const [currentView, setCurrentView] = useState("initial");
  const [currentWallet, setCurrentWallet] = useState(null);
  const [connection, setConnection] = useState(null);
  const [identity, setIdentity] = useState(null);

  console.log(`[App] process.env:`, process.env);
  
  const handleWalletSelect = (wallet) => {
    localStorage.removeItem("_m");
    console.log(`[App][handleWalletSelect] wallet:`, wallet);
    var id = {
      principal: wallet.address,
      type: wallet.type
    }
    setIdentity(id);
    setCurrentWallet(wallet);
    setCurrentView("unlock");
  };  

  const handleUnlock = (password) => {

    var wallet = JustIdentity.getIdentity(identity.principal);
    console.log(`[App][handleUnlock] wallet:`, wallet);
    if (!wallet) {
      alert("Missing wallet!");
    } else {
      setConnection(extjs.connect('https://icp0.io/', wallet));
      setCurrentView("dashboard");
    }
  }

  const handleLock = () => {
    console.log(`[App][handleLock] identity:`, identity);
    JustIdentity.lock(identity).then((value) => {      
      setCurrentView("switch")
    })    
    
  }

  const handleWalletSetup = (id) => {
    setIdentity(id);

    var wallet = JustIdentity.getIdentity(id.principal);
    console.log(`[App][handleWalletSetup] wallet:`, wallet);
    if (!wallet) {
      alert("Missing wallet!");
    } else {
      setConnection(extjs.connect('https://icp0.io/', wallet));
      setCurrentView("dashboard");
    }
    
  }

  const handleCreateWallet = () => {
    console.log(`[App][handleCreateWallet] ...`);
    setCurrentView("setup");
  }

  useEffect(() => {
    var w = getStoredWallets();
    console.log(`[App][useEffect] w:`, w)
    if (w.length > 0) {
      setCurrentView("switch");
    } else {
      setCurrentView("setup");
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {currentView === "initial" && <>Loading</>}
        {currentView === "setup" && <WalletSetup onWalletSetup={handleWalletSetup} />}
        {currentView === "switch" && <WalletSwitcher onWalletSelect={handleWalletSelect} onWalletCreate={handleCreateWallet} />}
        {currentView === "unlock" && <UnlockWallet onUnlock={handleUnlock} identity={identity} />}
        {currentView === "dashboard" && identity && (
          <WalletDashboard 
            onLock={handleLock}            
            identity={identity}
            connection={connection}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App
