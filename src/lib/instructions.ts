import BN from "bn.js";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

import type { BaseRepository } from ".";
import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

export const marketingWallet = new PublicKey(
  process.env.NEXT_PUBLIC_MARKETING_WALLET,
);

export async function createTokenFeeInstructions(
  repository: BaseRepository,
  mint: PublicKey,
  sourceATA: PublicKey,
  amount: BN,
) {
  const { wallet, connection } = repository;
  const marketingWalletATA = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet as any,
    mint,
    marketingWallet,
  );

  return createTransferInstruction(
    sourceATA,
    marketingWalletATA.address,
    wallet.publicKey,
    amount,
  );
}

export async function createFeeInstructions(repository: BaseRepository) {
  const { wallet } = repository;

  return [
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: marketingWallet,
      lamports: 1 * LAMPORTS_PER_SOL,
    }),
  ];
}