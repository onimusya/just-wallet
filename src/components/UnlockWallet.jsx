import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { JustIdentity } from "@/lib/identity";

export function UnlockWallet({ onUnlock, identity }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleUnlock = () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    console.log(`[UnlockWallet][handleUnlock] Identity to unlock:`, identity);
    JustIdentity.unlock(identity, { password: password}).then((value) => {
      console.log(`[UnlockWallet][handleUnlock] Decrypt identity:`, value);
      if (value.principal !== identity.principal) {
        setError("You entered wrong password!");  
      } else {
        onUnlock(password);
      }
      
    }).catch((error) => {
      console.log(`[UnlockWallet][handleUnlock] Error:`, error);
      setError("Failed to unlock your wallet!");
    });
    
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Unlock Wallet</h1>
        <p className="text-neutral-400">Enter your password to access your wallet</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="bg-neutral-800 border-neutral-700 text-neutral-100 pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={handleUnlock}
            >
              <Lock className="w-4 h-4 mr-2" />
              Unlock Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}