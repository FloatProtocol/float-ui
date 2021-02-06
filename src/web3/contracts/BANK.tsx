import React from 'react';
import { BigNumber } from '@ethersproject/bignumber';

import { useReload } from 'hooks/useReload';
import { useWallet } from 'wallets/wallet'; 
import { useAsyncEffect } from 'hooks/useAsyncEffect';
import BankLogo from 'assets/float/bank_thumbprint.svg'
import deployment from 'web3/deployment.json';
import Web3Contract from 'web3/Web3Contract';
import { TokenMeta } from 'web3/TokenMeta';
import { formatUnits } from '@ethersproject/units';

export const BANKTokenMeta: TokenMeta = {
  name: 'BANK',
  abi: deployment.contracts.BANK.abi,
  address: deployment.contracts.BANK.address,
  decimals: 18,
  icon: <img src={BankLogo} className="bank-logo" alt="BANK logo" />,
}

interface BANKContractData {
  balance?: BigNumber;
  totalSupply?: string;
  totalSupplyUnit?: BigNumber;
}

interface BANKContract extends BANKContractData {
  contract: Web3Contract;
  reload(): void;
}

const initialData: BANKContractData = {
  balance: undefined,
}

export function useBANKContract(): BANKContract {
  const [reload] = useReload();
  const wallet = useWallet();

  const contract = React.useMemo<Web3Contract>(() => {
    return new Web3Contract(
      BANKTokenMeta.abi,
      BANKTokenMeta.address,
      BANKTokenMeta.name,
    );
  }, []);

  React.useEffect(() => {
    contract.setProvider(wallet.provider);
  }, [contract, wallet.provider]);

  const [data, setData] = React.useState<BANKContractData>(initialData);

  useAsyncEffect(async () => {
    let [totalSupplyUnit] = await contract.batch([
      {
        method: 'totalSupply',
        transform: (value: string) => BigNumber.from(value),
      },
    ]);

    const totalSupply = totalSupplyUnit && formatUnits(totalSupplyUnit, BANKTokenMeta.decimals);

    setData(prevState => ({
      ...prevState,
      totalSupply,
      totalSupplyUnit,
    }));
  }, [reload]);

  useAsyncEffect(async () => {
    let balance: BigNumber | undefined;
    let allowance: BigNumber | undefined;

    if (wallet.account) {
      [balance] = await contract.batch([{
          method: 'balanceOf',
          methodArgs: [wallet.account],
          transform: (value: string) => BigNumber.from(value),
        },
      ]);
    }

    setData(prevState => ({
      ...prevState,
      balance,
      allowance,
    }));
  }, [reload, wallet.account]);

  return React.useMemo<BANKContract>(() => ({
    ...data,
    contract,
    reload,
  }), [
    data,
    contract,
    reload,
  ]);
}
