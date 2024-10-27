import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Download, Shield, ChevronRight, Copy, RefreshCcw, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { JustIdentity } from "@/lib/identity";
import { WalletDashboard } from "./WalletDashboard";
import { ImportWallet } from "./ImportWallet";
import { UnlockWallet } from "./UnlockWallet";

// Mock seed phrase generation (in production, use a proper crypto library)
const generateSeedPhrase = () => {
  const words = [
    "abandon", "ability", "able", "about", "above", "absent",
    "absorb", "abstract", "absurd", "abuse", "access", "accident",
    "account", "accuse", "achieve", "acid", "acoustic", "acquire",
    "across", "act", "action", "actor", "actress", "actual"
  ];
  return words;
};

export function WalletSetup() {
  const [step, setStep] = useState("initial");
  const [seedPhrase, setSeedPhrase] = useState([]);
  const [verificationWords, setVerificationWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [identity, setIdentity] = useState({});
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleCreateWallet = () => {

    // to generate 24 words
    const strength = 24 / 3 * 32;

    const newSeedPhrase = JustIdentity.generateMnemonic(strength).split(" ");
    console.log(`[handleCreateWallet] Seed Phrase:`, newSeedPhrase);

    setSeedPhrase(newSeedPhrase);
    setStep("create");
  };
    
  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(seedPhrase.join(' '));

    console.log(`[WalletSetup][handleCopytoClipboard] Toast!`);

    toast({
      title: "Copied to clipboard",
      description: "Recovery phrase has been copied to your clipboard",
      duration: 3000,
    });
  };

  const startVerification = () => {
    // Create a shuffled copy of the seed phrase for verification
    const shuffled = [...seedPhrase].sort(() => Math.random() - 0.5);

    console.log(`[WalletSetup][startVerification] seedPhrase:`, seedPhrase);

    setVerificationWords(shuffled);
    setSelectedWords([]);
    setError("");
    //setStep("verify");
    setStep("password");
  };

  const handleWordSelect = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
    setError("");
  };

  const handleVerify = () => {
    if (selectedWords.length !== seedPhrase.length) {
      setError("Please select all words in the correct order");
      return;
    }

    const isCorrect = selectedWords.every((word, index) => word === seedPhrase[index]);
    if (isCorrect) {
      setStep("password");
      setError("");
    } else {
      setError("Incorrect sequence. Please try again.");
      setSelectedWords([]);
    }
  };
  
  const handleCreatePassword = async () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Setup wallet
    var id = await JustIdentity.setup("private", { 
      mnemonic: seedPhrase.join(" "),
      password: password
    });

    console.log(`[WalletSetup][handleCreatePassword] id:`, id);
    setIdentity(id);

    // In a real app, you would hash the password and store it securely
    setStep("dashboard");
    toast({
      title: "Wallet Created",
      description: "Your wallet has been created and secured with a password",
      duration: 3000,
    });
  };

  const handleLockWallet = () => {
    setStep("unlock");
  };
  
  const handleUnlockWallet = (enteredPassword) => {
    // In a real app, you would verify the password hash
    if (enteredPassword === password) {
      setStep("dashboard");
      toast({
        title: "Wallet Unlocked",
        description: "Welcome back to your wallet",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: "Incorrect password",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  if (step === "unlock") {
    return <UnlockWallet onUnlock={handleUnlockWallet} />;
  }

  if (step === "dashboard") {    
    return <WalletDashboard onLock={handleLockWallet} identity={identity} />;
  }  

  if (step === "import") {
    // TODO
    return (
      <ImportWallet 
        onBack={() => setStep("initial")}
        onImport={() => setStep("dashboard")}
      />
    );
  }  

  if (step === "password") {
    return (
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Password</h1>
          <p className="text-neutral-400">Set a password to secure your wallet</p>
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
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    className="bg-neutral-800 border-neutral-700 text-neutral-100 pr-10"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <div className="pt-2">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={handleCreatePassword}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Create Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="outline" className="border-neutral-800 text-white hover:text-white" onClick={() => setStep("verify")}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (step === "create") {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Your Recovery Phrase</h1>
          <p className="text-neutral-400">Write down these 24 words in order and keep them safe</p>
        </div>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {seedPhrase.map((word, index) => (
                <div key={index} className="flex items-center gap-2 bg-neutral-400 p-3 rounded-lg">
                  <span className="text-neutral-600 text-sm">{index + 1}.</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" className="border-neutral-800" onClick={handleCopyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy to clipboard
              </Button>
              <Button variant="outline" className="border-neutral-800" onClick={() => setSeedPhrase(JustIdentity.generateMnemonic(256).split(" "))}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Generate new phrase
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="outline" className="text-neutral-500 border-neutral-800" onClick={() => setStep("initial")}>
            Back
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={startVerification}>
            I've written it down
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verify Recovery Phrase</h1>
          <p className="text-neutral-400">Select the words in the correct order</p>
        </div>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {selectedWords.map((word, index) => (
                <div key={index} className="flex items-center gap-2 bg-neutral-400 p-3 rounded-lg">
                  <span className="text-neutral-600 text-sm">{index + 1}.</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
              {Array(24 - selectedWords.length).fill(null).map((_, index) => (
                <div key={`empty-${index}`} className="flex items-center gap-2 bg-neutral-800/50 p-3 rounded-lg">
                  <span className="text-neutral-500 text-sm">{selectedWords.length + index + 1}.</span>
                  <span className="font-mono">•••••</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 pt-6">
              {verificationWords.map((word, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`border-neutral-800 ${selectedWords.includes(word) ? 'bg-neutral-800' : ''}`}
                  onClick={() => handleWordSelect(word)}
                >
                  {word}
                </Button>
              ))}
            </div>

            {error && (
              <p className="text-red-400 text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="outline" className="border-neutral-800" onClick={() => setStep("create")}>
            Back
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleVerify}
            disabled={selectedWords.length !== seedPhrase.length}
          >
            Verify & Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome to Just Wallet</h1>
        <p className="text-neutral-400">Get started with your secure crypto wallet</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
          <CardHeader className="pb-4">
            <PlusCircle className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <CardTitle>Create New Wallet</CardTitle>
            <CardDescription className="text-neutral-400">Generate a new wallet with a secure recovery phrase</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 h-11" 
              onClick={handleCreateWallet}
            >
              Create Wallet
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors">
          <CardHeader className="pb-4">
            <Download className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <CardTitle>Import Existing Wallet</CardTitle>
            <CardDescription className="text-neutral-400">Import your wallet using a recovery phrase or private key</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 h-11"
              onClick={() => setStep("import")}
            >
              Import Wallet
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-900/50 border-neutral-800 max-w-3xl w-full">
        <CardContent className="flex items-center gap-4 p-6">
          <Shield className="w-12 h-12 text-yellow-500 flex-shrink-0" />
          <div className="text-left">
            <h3 className="font-semibold mb-1">Security First</h3>
            <p className="text-sm text-neutral-400">
              Your recovery phrase is the only way to restore your wallet. Never share it with anyone and keep it in a safe place.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );


}