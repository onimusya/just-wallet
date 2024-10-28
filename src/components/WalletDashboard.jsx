import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, LayoutGrid, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AssetCard } from "./AssetCard";
import { TransactionCard } from "./TransactionCard";
import { principalToAccountIdentifier } from "@/lib/utils.js";
import { mockAssets, mockTransactions } from "@/lib/mockData";

export function WalletDashboard({ onLock, identity }) {
  const [principalMask, setPrincipalMask] = useState("");
  const { toast } = useToast();

  console.log(`[WalletDashboard] identity:`, identity);
  //var walletMask = identity.principal.slice(0, 6) + "..." + identity.principal.slice(identity.principal.length-6);
  //console.log(`[WalletDashboard] walletMask:`, walletMask);
  
  const handleCopyIdentityToClipboard = async () => {
    await navigator.clipboard.writeText(identity.principal);

    toast({
      title: "Copied to clipboard",
      description: "Wallet Principal Id has been copied to your clipboard",
      duration: 3000,
    });
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Just ⚡️ Wallet</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-neutral-800 text-neutral-400 hover:text-white hover:border-blue-500 hover:text-blue-500" onClick={handleCopyIdentityToClipboard}>
            {
              identity.principal.slice(0, 6) + "..." + identity.principal.slice(identity.principal.length-6)
            }
            <Copy className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="border-neutral-800 text-neutral-400 hover:text-white hover:border-red-500 hover:text-red-500"
            onClick={onLock}
          >
            <Lock className="h-4 w-4 mr-2" />
            Lock Wallet
          </Button>
        </div>
      </div>

      {/* Wallet Information */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-neutral-400 flex items-center justify-center">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-400 ">Principal Id</h3>
              <p className="font-semibold text-neutral-400">Account Id</p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-semibold text-neutral-100">{identity.principal}</p>
            <p className="font-semibold text-neutral-100">{principalToAccountIdentifier(identity.principal, 0)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-white">2.458 ICP</CardTitle>
          <CardDescription className="text-neutral-400">≈ $4,523.67 USD</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            Send
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            Receive
            <ArrowDownLeft className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="bg-neutral-900 border-neutral-800">
          <TabsTrigger value="assets" className="data-[state=active]:bg-neutral-800">
            Assets
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-neutral-800">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          {mockAssets.map((asset) => (
            <AssetCard key={asset.symbol} {...asset} />
          ))}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {mockTransactions.map((tx, index) => (
            <TransactionCard key={index} {...tx} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}