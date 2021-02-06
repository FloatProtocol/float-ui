import React from 'react';
import { BigNumber } from '@ethersproject/bignumber';

import { useReload } from 'hooks/useReload';
import { useWallet } from 'wallets/wallet'; 
import { useAsyncEffect } from 'hooks/useAsyncEffect';

import deployment from 'web3/deployment.json';
import Web3Contract from 'web3/Web3Contract';
import { TokenMeta } from 'web3/TokenMeta';
import { formatUnits } from '@ethersproject/units';
import { ChainId, Fetcher, Route, Token } from '@uniswap/sdk';

import USDCLogo from 'assets/stablecoinlogos/USDC.png';
import USDTLogo from 'assets/stablecoinlogos/USDT.png';
import DAILogo from 'assets/stablecoinlogos/DAI.png';
import { useWeb3React } from '@web3-react/core';

interface TokenContractData {
  tokenMeta: TokenMeta;
  balance?: string;
  balanceUnit?: BigNumber;
  allowance?: string;
  allowanceUnit?: BigNumber;
  priceInDAI?: string;
}

export interface TokenContract extends TokenContractData {
  contract: Web3Contract;
  reload(): void;
  approveSend(value: BigNumber): Promise<any>;
}

const initialData: Omit<TokenContractData, "tokenMeta"> = {
  balance: undefined,
  balanceUnit: undefined,
  allowance: undefined,
  allowanceUnit: undefined,
  priceInDAI: "1",
}

interface UseTokenContractProps {
  poolAddr: string;
  tokenMeta: TokenMeta;
}

export function useTokenContract({ poolAddr, tokenMeta }: UseTokenContractProps): TokenContract {
  const [reload] = useReload();
  const wallet = useWallet();
  const { library } = useWeb3React();

  const contract = React.useMemo<Web3Contract>(() => {
    return new Web3Contract(
      tokenMeta.abi,
      tokenMeta.address,
      tokenMeta.name,
    );
  }, [tokenMeta.abi, tokenMeta.name, tokenMeta.address]);

  React.useEffect(() => {
    contract.setProvider(wallet.provider);
  }, [contract, wallet.provider]);

  const [data, setData] = React.useState<TokenContractData>({
    ...initialData,
    tokenMeta,
  });

  useAsyncEffect(async () => {
    let balance: string | undefined;
    let balanceUnit: BigNumber | undefined;
    let allowance: string | undefined;
    let allowanceUnit: BigNumber | undefined;

    if (wallet.account) {
      [balanceUnit, allowanceUnit] = await contract.batch([
        {
          method: 'balanceOf',
          methodArgs: [wallet.account],
          transform: (value: string) => BigNumber.from(value),
        },
        {
          method: 'allowance',
          methodArgs: [wallet.account, poolAddr],
          transform: (value: string) => BigNumber.from(value),
        },
      ]);

      balance = balanceUnit && formatUnits(BigNumber.from(balanceUnit), tokenMeta.decimals);
      allowance = allowanceUnit && formatUnits(BigNumber.from(allowanceUnit), tokenMeta.decimals);
    }

    setData(prevState => ({
      ...prevState,
      balance,
      balanceUnit,
      allowance,
      allowanceUnit,
    }));
  }, [reload, wallet.account]);

  useAsyncEffect(async () => {
    let priceInDAI: string = "1";
    const daiToken = new Token(ChainId.MAINNET, DAITokenMeta.address, DAITokenMeta.decimals);
    const token = new Token(ChainId.MAINNET, tokenMeta.address, tokenMeta.decimals);

    if (library === undefined || daiToken.equals(token)) {
      return;
    }

    try {
      const daiToToken = await Fetcher.fetchPairData(
        daiToken,
        token,
        library,
      );
      const priceRoute = new Route([daiToToken], token);
      priceInDAI = priceRoute.midPrice.toSignificant(3);
    } catch(err) {
      console.error(`Failed to fetch token price of ${tokenMeta.name}`, err);
    }

    setData(prevState => ({
      ...prevState,
      priceInDAI,
    }));
  }, [reload, library]);


  const approveSend = React.useCallback((value: BigNumber): Promise<any> => {
    if (!wallet.account) {
      return Promise.reject();
    }

    return contract.send('approve', [
      poolAddr,
      value,
    ], {
      from: wallet.account,
    }).then(reload);
  }, [wallet.account, contract, poolAddr, reload]);

  return React.useMemo<TokenContract>(() => ({
    ...data,
    contract,
    reload,
    approveSend,
  }), [
    data,
    contract,
    reload,
    approveSend,
  ]);
}

// DAI

export const DAITokenMeta: TokenMeta = {
  abi: deployment.contracts.DAI.abi,
  address: deployment.contracts.DAI.address,
  decimals: 18,
  name: 'DAI',
  icon: <img src={DAILogo} className="coin-logo" alt="logo" />
}

export function useDAIContract(): TokenContract {
  return useTokenContract({
    tokenMeta: DAITokenMeta,
    poolAddr: deployment.contracts.DAIPool.address,
  });
}

// USDC

export const USDCTokenMeta: TokenMeta = {
  abi: deployment.contracts.USDC.abi,
  address: deployment.contracts.USDC.address,
  decimals: 6,
  name: 'USDC',
  icon: <img src={USDCLogo} className="coin-logo" alt="logo" />
}


export function useUSDCContract(): TokenContract {
  return useTokenContract({
    tokenMeta: USDCTokenMeta,
    poolAddr: deployment.contracts.USDCPool.address,
  });
}

// USDT
export const USDTTokenMeta: TokenMeta = {
  abi: deployment.contracts.USDT.abi,
  address: deployment.contracts.USDT.address,
  decimals: 6,
  name: 'USDT',
  icon: <img src={USDTLogo} className="coin-logo" alt="logo" />
}

export function useUSDTContract(): TokenContract {
  return useTokenContract({
    tokenMeta: USDTTokenMeta,
    poolAddr: deployment.contracts.USDTPool.address,
  });
}