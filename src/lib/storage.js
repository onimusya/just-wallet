const STORAGE_KEY = "_em";

export function getStoredWallets() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    var t = JSON.parse(stored);
    var i = 0;
    var w = [];
    for (const [key, value] of Object.entries(t)) {
      console.log(`[WalletSwitcher] _em: ${key}: ${value}`);
      w.push({
        id: i.toString(),
        name: "Wallet " + (i+1),
        address: key,
        balance: "... ICP",
        type: "private",
        encrypt: value
      })
      i++;
    }

    return w;

  } catch {
    return [];
  }
}

export function setStoredWallets(wallets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
}

export function getSelectedWallet() {
  return localStorage.getItem("just_selected_wallet");
}

export function setSelectedWallet(id) {
  localStorage.setItem("just_selected_wallet", id);
}