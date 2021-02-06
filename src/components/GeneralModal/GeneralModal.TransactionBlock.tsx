import ExternalLink from "components/ExternalLink/ExternalLink";
import React, { ReactNode } from "react";
import { etherscanTransaction } from "web3/utils";

export interface TransactionBlockProps {
  txn?: string;
  onCancel?: VoidFunction;
  children?: ReactNode;
}

export const TransactionBlock: React.FC<TransactionBlockProps> = ({ txn, onCancel, children }: TransactionBlockProps) => {
  if (!txn) {
    return <>{children}</>;
  }
  return <>
      <div className="tx-submitted">
          <h3>Transaction Submitted</h3>
          <ExternalLink href={etherscanTransaction(txn)}>View on Etherscan</ExternalLink>
      </div>
      <div className='modal-button-group'>
          <button type="button" onClick={onCancel}> 
              Close 
          </button>
      </div>
  </>
} 