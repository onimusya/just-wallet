import { Wallet, LayoutGrid } from "lucide-react";

export const mockAssets = [
  {
    name: "Ethereum",
    symbol: "ETH",
    balance: "2.458",
    value: "4,523.67",
    change: 2.34,
    icon: Wallet
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    balance: "1,234.56",
    value: "1,234.56",
    change: 0.01,
    icon: LayoutGrid
  }
];

export const mockTransactions = [
  {
    type: "send",
    amount: "0.5",
    symbol: "ETH",
    address: "0x1234...5678",
    timestamp: "2 hours ago",
    status: "completed"
  },
  {
    type: "receive",
    amount: "1.2",
    symbol: "ETH",
    address: "0x8765...4321",
    timestamp: "5 hours ago",
    status: "completed"
  }
];
