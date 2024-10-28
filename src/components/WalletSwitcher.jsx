import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WalletList } from "./WalletList";
import { getStoredWallets, setStoredWallets, setSelectedWallet } from "@/lib/storage";


const mockWallets = [
  {
    id: "1",
    name: "Main Wallet",
    address: "0x1234...5678",
    balance: "2.458 ETH"
  },
  {
    id: "2",
    name: "Trading Wallet",
    address: "0x8765...4321",
    balance: "1.234 ETH"
  }
];

/*
interface WalletSwitcherProps {
  onWalletSelect: (wallet: WalletAccount) => void;
}
*/

export function WalletSwitcher({ onWalletSelect }) {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const stored = getStoredWallets();
    if (stored.length === 0) {
      setStoredWallets(mockWallets);
      setWallets(mockWallets);
      setSelectedWallet(mockWallets[0].id);
    } else {
      setWallets(stored);
      setSelectedWallet(stored[0].id);
    }
  }, []);

  const handleUpdateName = (id, newName) => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Wallet name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const updatedWallets = wallets.map(wallet => 
      wallet.id === id ? { ...wallet, name: newName.trim() } : wallet
    );
    setWallets(updatedWallets);
    setStoredWallets(updatedWallets);
    setIsEditing(false);
    setNewWalletName("");

    toast({
      title: "Success",
      description: "Wallet name updated successfully",
    });
  };

  const handleDeleteWallet = (id) => {
    const updatedWallets = wallets.filter(wallet => wallet.id !== id);
    setWallets(updatedWallets);
    setStoredWallets(updatedWallets);
    
    if (selectedWallet === id) {
      setSelectedWallet(updatedWallets[0].id);
    }

    toast({
      title: "Wallet Removed",
      description: "The wallet has been removed from your list",
    });
  };

  const handleChooseWallet = () => {
    const wallet = wallets.find(w => w.id === selectedWallet);
    if (wallet) {
      //setSelectedWallet(wallet.id);
      setSelectedWallet(wallet.id);
      onWalletSelect(wallet);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Switch Wallet</h1>
        <p className="text-neutral-400">Select or manage your connected wallets</p>
      </div>

      <WalletList
        wallets={wallets}
        selectedWallet={selectedWallet}
        isEditing={isEditing}
        newWalletName={newWalletName}
        onSelect={setSelectedWallet}
        onUpdateName={handleUpdateName}
        onDelete={handleDeleteWallet}
        onEditStart={(wallet) => {
          setIsEditing(true);
          setNewWalletName(wallet.name);
        }}
        onNewWalletNameChange={setNewWalletName}
      />

      <Card className="bg-neutral-900 border-neutral-800 border-dashed hover:bg-neutral-800/50 transition-colors cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Add New Wallet</h3>
                <p className="text-sm text-neutral-400">Connect or create another wallet</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-neutral-400" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 px-8"
          onClick={handleChooseWallet}
          disabled={!selectedWallet}
        >
          Choose Wallet
        </Button>
      </div>
    </div>
  );
}