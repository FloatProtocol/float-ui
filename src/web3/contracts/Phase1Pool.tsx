import React, { useEffect } from 'react';

import { useReload } from 'hooks/useReload';
import { useAsyncEffect } from 'hooks/useAsyncEffect';
import { useWallet } from 'wallets/wallet';
import Web3Contract from 'web3/Web3Contract';
import { BANKTokenMeta } from 'web3/contracts/BANK';

import deployment from 'web3/deployment.json';
import { formatUnits } from '@ethersproject/units';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { DAITokenMeta, USDCTokenMeta, USDTTokenMeta } from './StakeTokens';
import { TokenMeta } from 'web3/TokenMeta';
import { formatPrefix, percentageFromBigNumbers } from 'web3/utils';
import { useWhitelist } from 'contexts/WhitelistContext';

interface Phase1PoolData {
  currentReward: any;
  periodFinish?: number;
  rewardPerToken?: number;
  totalStaked?: string;
  totalStakedUnit?: BigNumber;
  earnedUnit?: BigNumber;
  earned?: string;
  totalRewardUnit?: BigNumber;
  totalReward?: string;
  duration?: number;
  maximumContributionUnit?: BigNumber;
  maximumContribution?: string;
  stakedUnit?: BigNumber;
  staked?: string;
  proportionOfPool?: string;
};

export type Phase1Pool = Phase1PoolData & {
  contract: Web3Contract;
  reload: VoidFunction;
  stake(amount: BigNumberish): Promise<void>;
  withdraw(amount: BigNumberish): Promise<void>;
  claim: VoidFunction;
  exit: VoidFunction;
}

const initialData: Omit<Phase1PoolData, "whitelistTree"> = {
  periodFinish: undefined,
  rewardPerToken: undefined,
  totalStaked: '-',
  totalStakedUnit: undefined,
  earnedUnit: undefined,
  earned: '-',
  totalRewardUnit: undefined,
  totalReward: '-',
  duration: undefined,
  maximumContributionUnit: undefined,
  maximumContribution: '-',
  stakedUnit: undefined,
  staked: '-',
  proportionOfPool: '-',
  currentReward: undefined,
};

interface UsePhase1PoolProps {
  abi: any;
  addr: string;
  name: string;
  stakeTokenMeta: TokenMeta;
}

function usePhase1Pool({ abi, addr, name, stakeTokenMeta }: UsePhase1PoolProps): Phase1Pool {
  const [reload] = useReload();
  const wallet = useWallet();
  const { tree } = useWhitelist();

  const contract = React.useMemo<Web3Contract>(() => {
    return new Web3Contract(
      abi,
      addr,
      name,
    );
  }, [abi, addr, name]);

  React.useEffect(() => {
    contract.setProvider(wallet.provider);
  }, [contract, wallet.provider]);

  const [data, setData] = React.useState<Phase1PoolData>(initialData);

  useAsyncEffect(async () => {
    let [totalRewardUnit, periodFinish, rewardPerToken,
      totalStakedUnit, duration,
      maximumContributionUnit] = await contract.batch([
      {
        method: 'getRewardForDuration',
        transform: (value: string) => BigNumber.from(value),
      },
      {
        method: 'periodFinish',
        transform: (value: string) => Number(value),
      },
      {
        method: 'rewardPerToken',
        transform: (value: string) => Number(value),
      },
      {
        method: 'totalSupply',
        transform: (value: string) => BigNumber.from(value),
      },
      {
        method: 'DURATION',
        transform: (value: string) => Number(value),
      },
      {
        method: 'maximumContribution',
        transform: (value: string) => BigNumber.from(value),
      }
    ]);

    const totalStaked = totalStakedUnit && formatUnits(totalStakedUnit, stakeTokenMeta.decimals);
    const totalReward = totalRewardUnit && formatPrefix(totalRewardUnit, BANKTokenMeta.decimals);
    const maximumContribution = maximumContributionUnit && formatUnits(maximumContributionUnit, stakeTokenMeta.decimals);

    setData(prevState => ({
      ...prevState,
      periodFinish,
      rewardPerToken,
      totalStakedUnit,
      totalStaked,
      totalRewardUnit,
      totalReward,
      duration,
      maximumContributionUnit,
      maximumContribution,
    }));
  }, [reload]);

  useAsyncEffect(async () => {
    let earnedUnit: BigNumber | undefined;
    let stakedUnit: BigNumber | undefined;

    if (wallet.account) {
      [earnedUnit, stakedUnit] = await contract.batch([
        {
          method: 'earned',
          methodArgs: [wallet.account],
          transform: (value: string) => BigNumber.from(value),
        },
        {
          method: 'balanceOf',
          methodArgs: [wallet.account],
          transform: (value: string) => BigNumber.from(value),
        }
      ]);
    }

    const earned = earnedUnit && formatUnits(earnedUnit, BANKTokenMeta.decimals);
    const staked = stakedUnit && formatUnits(stakedUnit, stakeTokenMeta.decimals);

    setData(prevState => ({
      ...prevState,
      earnedUnit,
      earned,
      stakedUnit,
      staked,
    }));

  }, [reload, wallet.account]);

  useEffect(() => {
    const proportionOfPool = percentageFromBigNumbers(data.stakedUnit, data.totalStakedUnit);

    setData(prevState => ({
      ...prevState,
      proportionOfPool,
    }));
  }, [data.stakedUnit, data.totalStakedUnit]);

  useAsyncEffect(async () => {
    let currentReward: BigNumber | undefined;

    if (wallet.account) {
      [currentReward] = await contract.batch([{
          method: 'earned',
          methodArgs: [wallet.account],
          transform: (value: string) => BigNumber.from(value),
        }]);
    }

    setData(prevState => ({
      ...prevState,
      currentReward,
    }));
  }, [reload, wallet.account]);

  const stake = React.useCallback((amount) => {
    if (!wallet.account || !tree) {
      return Promise.reject();
    }
    const proof: string[] = tree.getProof(wallet.account);

    return contract.send('stakeWithProof', [amount, proof], {
      from: wallet.account,
    }).then(reload);
  }, [wallet.account, tree, contract, reload]);

  const withdraw = React.useCallback((amount) => {
    if (!wallet.account) {
      return Promise.reject();
    }
    return contract.send("withdraw", [BigNumber.from(amount)], {
      from: wallet.account,
    }).then(reload);
  }, [contract, reload, wallet.account]);

  const claim = React.useCallback(() => {
    if (!wallet.account) {
      return Promise.reject();
    }
    return contract.send("getReward", [], {
      from: wallet.account,
    }).then(reload);
  }, [wallet.account, contract, reload]);

  const exit = React.useCallback(() => {
    if (!wallet.account) {
      return Promise.reject();
    }
    return contract.send("exit", [], {
      from: wallet.account,
    }).then(reload);
  }, [wallet.account, contract, reload]);

  return React.useMemo<Phase1Pool>(() => ({
    ...data,
    contract,
    reload,
    stake,
    withdraw,
    claim,
    exit,
  }), [data, contract, reload, stake, withdraw, claim, exit]);
}

export function useDAIPhase1Pool(): Phase1Pool {
  return usePhase1Pool({
    abi: deployment.contracts.DAIPool.abi,
    addr: deployment.contracts.DAIPool.address,
    name: "DAI_PHASE1_POOL",
    stakeTokenMeta: DAITokenMeta,
  })
}

export function useUSDCPhase1Pool(): Phase1Pool {
  return usePhase1Pool({
    abi: deployment.contracts.USDCPool.abi,
    addr: deployment.contracts.USDCPool.address,
    name: "USDC_PHASE1_POOL",
    stakeTokenMeta: USDCTokenMeta,
  })
}

export function useUSDTPhase1Pool(): Phase1Pool {
  return usePhase1Pool({
    abi: deployment.contracts.USDTPool.abi,
    addr: deployment.contracts.USDTPool.address,
    name: "USDT_PHASE1_POOL",
    stakeTokenMeta: USDTTokenMeta,
  });
}