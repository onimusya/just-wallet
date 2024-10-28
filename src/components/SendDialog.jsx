import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

/*
interface SendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (address: string, amount: string) => Promise<void>;
}
*/

export function SendDialog({ open, onOpenChange, onConfirm }) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!address.trim()) {
      setError("Please enter a recipient address");
      return;
    }

    if (!amount.trim() || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      await onConfirm(address, amount);
      handleClose();
    } catch (err) {
      setError("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setAddress("");
    setAmount("");
    setError("");
    setIsProcessing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Cryptocurrency</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Enter the recipient's address and the amount you want to send
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="address">Recipient Address</Label>
            <Input
              id="address"
              placeholder="0x..."
              className="bg-neutral-800 border-neutral-700"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.000001"
                min="0"
                placeholder="0.00"
                className="bg-neutral-800 border-neutral-700 pr-16"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-sm text-neutral-400">
                ETH
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="border-neutral-800"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}