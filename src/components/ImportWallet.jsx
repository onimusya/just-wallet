import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ChevronLeft, KeyRound, FileText, AlertCircle } from "lucide-react";
import { JustIdentity } from "@/lib/identity";

export function ImportWallet({ onBack, onImport }) {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");

  const handleImport = (type) => {
    setError("");
    
    // "seed" | "key"
    if (type === "seed") {
      const words = seedPhrase.trim().split(" ");
      if (words.length !== 24) {
        setError("Please enter all 24 words of your seed phrase");
        return;
      }

      if (!JustIdentity.validateMnemonic(seedPhrase.trim())) {
        setError("Invalid seed phrase!");
        return;
      }
    
      onImport({
        value: words,
        type: "seed"
      });
    } else {
      if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
        setError("Please enter a valid private key");
        return;
      }

      onImport({
        value: privateKey,
        type: "key"
      });
    
    }

    
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Import Wallet</h1>
        <p className="text-neutral-400">Import your existing wallet using a recovery phrase or private key</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="p-6">
          <Tabs defaultValue="seed" className="space-y-6">
            <TabsList className="w-full bg-neutral-800 p-1">
              <TabsTrigger value="seed" className="flex-1 data-[state=active]:bg-neutral-700">
                <FileText className="w-4 h-4 mr-2" />
                Recovery Phrase
              </TabsTrigger>
              <TabsTrigger value="key" className="flex-1 data-[state=active]:bg-neutral-700">
                <KeyRound className="w-4 h-4 mr-2" />
                Private Key
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seed" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Enter your 24-word recovery phrase</label>
                <textarea
                  className="w-full h-32 bg-neutral-800 border-neutral-700 text-neutral-100 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter words separated by spaces"
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => handleImport("seed")}
                disabled={!seedPhrase.trim()}
              >
                Import with Recovery Phrase
              </Button>
            </TabsContent>

            <TabsContent value="key" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Enter your private key</label>
                <Input
                  className="bg-neutral-800 border-neutral-700 text-neutral-100 font-mono"
                  placeholder="0x..."
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => handleImport("key")}
                disabled={!privateKey.trim()}
              >
                Import with Private Key
              </Button>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        variant="outline" 
        className="border-neutral-800 text-white hover:text-white" 
        onClick={onBack}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Options
      </Button>
    </div>
  );
}