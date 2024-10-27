import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function TransactionCard({ type, amount, symbol, address, timestamp }) {
  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center",
            type === "send" ? "bg-blue-900/50" : "bg-green-900/50"
          )}>
            {type === "send" ? (
              <ArrowUpRight className="h-6 w-6 text-blue-400" />
            ) : (
              <ArrowDownLeft className="h-6 w-6 text-green-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold capitalize">{type}</h3>
            <p className="text-sm text-neutral-400">{address}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">
            {type === "send" ? "-" : "+"}{amount} {symbol}
          </p>
          <p className="text-sm text-neutral-400">{timestamp}</p>
        </div>
      </CardContent>
    </Card>
  );
}