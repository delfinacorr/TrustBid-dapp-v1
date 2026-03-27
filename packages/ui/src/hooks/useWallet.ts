import { useState, useEffect, useCallback } from "react";

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((s) => ({ ...s, error: "MetaMask not installed" }));
      return;
    }

    setState((s) => ({ ...s, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });

      setState({
        address: accounts[0],
        chainId: parseInt(chainIdHex, 16),
        isConnecting: false,
        error: null,
      });
    } catch (err: any) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: err.message ?? "Failed to connect",
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({ address: null, chainId: null, isConnecting: false, error: null });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      setState((s) => ({ ...s, address: accounts[0] ?? null }));
    };

    const handleChainChanged = (chainIdHex: string) => {
      setState((s) => ({ ...s, chainId: parseInt(chainIdHex, 16) }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return { ...state, connect, disconnect };
}
