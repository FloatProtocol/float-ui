import React from 'react';
import { Contract } from 'web3-eth-contract';
import Web3Contract, { TransactionInfo } from 'web3/Web3Contract';

type TransactionEffect = (transactionHash: string) => void;

export function useTransactionHash(effect: TransactionEffect, contract: Web3Contract, method: string): void {
  React.useEffect(() => {
    const listener = (txnHash: string, _contract: Contract, transactionInfo: TransactionInfo) => {
        if (transactionInfo.method === method) {
            effect(txnHash);
        }
    };
    contract.addListener('transactionHash', listener);
    return () => { contract.removeListener('transactionHash', listener) };
}, [contract, effect, method]);
}