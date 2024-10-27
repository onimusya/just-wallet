import { useState } from 'react';
import { WalletSetup } from "@/components/WalletSetup";
import { Toaster } from "@/components/ui/toaster";
// import './App.css'

function App() {
    
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <WalletSetup />
      </div>
      <Toaster />
    </div>
  );
}

export default App
