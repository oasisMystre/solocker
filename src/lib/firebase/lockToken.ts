import * as Sentry from "@sentry/nextjs";
import {
  collection,
  Firestore,
  getDocs,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { BaseRepository } from "..";
import Api from "../api";
import { LpInfo } from "../api/models/raydium.model";

export type LockedToken = {
  id: string;
  tx: string;
  seed: string;
  mintAddress: string;
  schedules: {
    period: number;
    amount: number;
  }[];
  destinationAddress: string;
  type: Type;
  unlocked: boolean;
  createdAt: number;
  failed: boolean;
};

export enum Type {
  OUTGOING = "outgoing",
  INCOMING = "incoming",
}

export type LpLockedToken = {
  id: any;
  lpInfo: LpInfo;
  contractInfo: LockedToken;
};

export default class LockToken {
  constructor(
    readonly firestore: Firestore,
    readonly repository: BaseRepository,
  ) {}

  async getTransactions(address: string): Promise<LockedToken[]> {
    const ref = collection(this.firestore, address);
    const snapshot = await getDocs(ref);
    const results: LockedToken[] = [];

    snapshot.forEach((doc) => {
      results.push({id: doc.id, ...doc.data()});
    });

    return results;
  }

  async saveTransaction(address: string, data: Partial<LockedToken>) {
    const ref = doc(this.firestore, address, data.seed);
    return setDoc(ref, Object.assign(data, { createdAt: Date.now() }));
  }

  async updateTransaction(
    address: string,
    seed: string,
    data: Partial<LockedToken>,
  ) {
    const ref = doc(this.firestore, address, seed);

    return updateDoc(ref, data);
  }

  async getLpTokens(address: string) {
    const transactions = await this.getTransactions(address);
    alert(transactions.length);
    const response = transactions.map(async (transaction) => {
      const { data } = await Api.instance.raydium.fetchLpInfo(
        transaction.mintAddress,
        address,
      );
      
      return {
          id: transaction.id,
          lpInfo: data,
          contractInfo: transaction,
        };
    });

    return (await Promise.all(response)).filter(
      (response) => response !== null,
    );
  }
}
