import React from 'react';
import { Contract } from 'web3-eth-contract';
import Web3Contract, { TransactionInfo } from 'web3/Web3Contract';

type ReceiptEffect = (receipt: Record<string, any>) => void;

export function useReceipt(effect: ReceiptEffect, contract: Web3Contract, method?: string): void {
  React.useEffect(() => {
    const listener = (receipt: Record<string, any>, _contract: Contract, transactionInfo: TransactionInfo) => {
        if (method === undefined || transactionInfo.method === method) {
            effect(receipt);
        }
    };
    contract.addListener('receipt', listener);
    return () => { contract.removeListener('receipt', listener) };
}, [contract, effect, method]);
}