import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AssetCard({ name, symbol, balance, value, change, icon: Icon }) {
  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-neutral-400">{balance} {symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">${value}</p>
          <p className={cn(
            "text-sm",
            change >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {change >= 0 ? "+" : ""}{change}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}