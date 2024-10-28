import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";


/*
interface WalletListProps {
  wallets: WalletAccount[];
  selectedWallet: string;
  isEditing: boolean;
  newWalletName: string;
  onSelect: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onEditStart: (wallet: WalletAccount) => void;
  onNewWalletNameChange: (name: string) => void;
}
*/

export function WalletList({
  wallets,
  selectedWallet,
  isEditing,
  newWalletName,
  onSelect,
  onUpdateName,
  onDelete,
  onEditStart,
  onNewWalletNameChange,
}) {
  return (
    <div className="space-y-4">
      {wallets.map((wallet) => (
        <Card 
          key={wallet.id}
          className={cn(
            "bg-neutral-900 border-neutral-800 transition-colors cursor-pointer hover:bg-neutral-800/50",
            selectedWallet === wallet.id && "border-blue-500/50 bg-blue-500/5"
          )}
          onClick={() => onSelect(wallet.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center">
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  {isEditing && selectedWallet === wallet.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        className="h-7 bg-neutral-800 border-neutral-700"
                        value={newWalletName}
                        onChange={(e) => onNewWalletNameChange(e.target.value)}
                        placeholder="Enter wallet name"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        className="h-7 bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateName(wallet.id, newWalletName);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-neutral-100">{wallet.name}</h3>
                  )}
                  <p className="text-sm text-neutral-400">{wallet.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium">{wallet.balance}</p>
                {selectedWallet === wallet.id && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 hover:bg-neutral-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditStart(wallet);
                      }}
                    >
                      Edit
                    </Button>
                    {wallets.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 hover:bg-red-500/20 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(wallet.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}