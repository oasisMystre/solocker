import { createContext, useState, useEffect, useMemo } from "react";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { devnet } from "@/data";
import { SolanaWallet } from "@/lib/solana";

type TokenAccount = Awaited<
  ReturnType<SolanaWallet["getTokenAccounts"]>
>[number];

export const TokenAccountContext = createContext<TokenAccount[] | undefined>(
  undefined
);

export default function TokenAccountState({
  children,
}: React.PropsWithChildren<{}>) {
  const { wallet } = useWallet();
  const { connection } = useConnection();
  const umi = useMemo(() => createUmi(devnet), []);
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>();
  const solanaWallet = useMemo(
    () => (wallet ? new SolanaWallet(connection, umi, wallet!.adapter) : null),
    [connection, umi, wallet]
  );

  useEffect(() => {
    if (wallet) {
      solanaWallet
        ?.getTokenAccounts()
        .then(setTokenAccounts)
        .catch(console.error);
    }
  }, [wallet, setTokenAccounts, solanaWallet]);

  return wallet && solanaWallet ? (
    <TokenAccountContext.Provider value={tokenAccounts}>
      {children}
    </TokenAccountContext.Provider>
  ) : (
    children
  );
}