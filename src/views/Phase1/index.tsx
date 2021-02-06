import React from "react";
import Card from "components/Card/Card";
import Panel from "components/Panel/Panel";
import PhaseInfo from "components/PhaseInfo/PhaseInfo";
import { DAITokenMeta, USDCTokenMeta, USDTTokenMeta, useDAIContract, useUSDCContract, useUSDTContract } from "web3/contracts/StakeTokens";
import { useDAIPhase1Pool, useUSDTPhase1Pool, useUSDCPhase1Pool } from "web3/contracts/Phase1Pool";
import StakeOptionProvider from "contexts/StakeOption";
import FarmPanel from "components/FarmPanel/FarmPanel";
import { BANKTokenMeta } from "web3/contracts/BANK";
import { formatPrefix, formatUnits } from "web3/utils";
import { useCountdown, useCountdownQuick } from "hooks/useCountdown";
import { useWhitelist } from "contexts/WhitelistContext";
import { useWallet } from "wallets/wallet";
import ExternalLink from "components/ExternalLink/ExternalLink";

import config from "assets/config.json";

const DAIPanel = () => {
  const token = useDAIContract();
  const pool = useDAIPhase1Pool();
  return (
    <StakeOptionProvider
      token={token}
      pool={pool}
    >
      <FarmPanel/>
    </StakeOptionProvider>
  );
}

const USDTPanel = () => {
  const token = useUSDTContract();
  const pool = useUSDTPhase1Pool();
  return (
    <StakeOptionProvider
      token={token}
      pool={pool}
    >
      <FarmPanel/>
    </StakeOptionProvider>
  );
}

const USDCPanel = () => {
  const token = useUSDCContract();
  const pool = useUSDCPhase1Pool();
  return (
    <StakeOptionProvider
      token={token}
      pool={pool}
    >
      <FarmPanel/>
    </StakeOptionProvider>
  );
}

const WhitelistedTitle = () => {
  const { account } = useWallet();
  const { tree } = useWhitelist();
  const icon = account && tree?.hasProof(account) ? "✓" : "✗";
  return <>
    <h4>Phase 1</h4>
    <span className="whitelist-badge">{icon} Whitelisted</span>
  </>;
}

const Phase1View: React.FC = () => {
  const dai = useDAIContract();
  const usdt = useUSDTContract();
  const usdc = useUSDCContract();
  const daiPool = useDAIPhase1Pool();
  const usdtPool = useUSDTPhase1Pool();
  const usdcPool = useUSDCPhase1Pool();

  const timeLeftToLaunch = useCountdownQuick(config.phase_1_start);
  const timeLeftInPhase1 = useCountdown(Math.max(daiPool.periodFinish ?? 0, config.phase_1_end));
  const nowEpoch = (new Date()).getTime() / 1000;

  const totalReward = daiPool.totalRewardUnit?.add(usdtPool.totalRewardUnit ?? 0).add(usdcPool.totalRewardUnit ?? 0);
  const dailyReward = formatPrefix(totalReward?.div(daiPool.duration ? daiPool.duration / 60 / 60 / 24 : 1), BANKTokenMeta.decimals);

  const tvlDAI = Number(formatUnits(daiPool.totalStakedUnit, dai.tokenMeta.decimals)) * Number(dai.priceInDAI ?? 1);
  const tvlUSDT = Number(formatUnits(usdtPool.totalStakedUnit, usdt.tokenMeta.decimals)) * Number(usdt.priceInDAI ?? 1);
  const tvlUSDC = Number(formatUnits(usdcPool.totalStakedUnit, usdc.tokenMeta.decimals)) * Number(usdc.priceInDAI ?? 1);

  const tvl = tvlDAI + tvlUSDT + tvlUSDC;

  return (
    <>
      <Panel>
        <Card
          title='Total Value Locked'
          content={tvl ? `$${tvl.toFixed(2)}` : '-'}
        />
        <Card
          title='Daily Distribution'
          content={dailyReward ?? '-'}
        />
        { nowEpoch >= config.phase_1_start ? <Card
          title='Time left in Phase'
          content={timeLeftInPhase1}
        /> : <Card
          title='Time left to Launch'
          content={timeLeftToLaunch}
        />
        }
        <Card
          title='Bank Price'
          content='N/A'
        />
      </Panel>

      <PhaseInfo title={<WhitelistedTitle/>}>
        <p>Goal of the first phase is to distribute tokens to a wide range of smaller, very active participants. The first phase will last 6 weeks.</p>
        <p>This whitelist is composed of addresses that participated in offchain governance of any protocol on Snapshot.page and/or onchain governance on Compound, MakerDao or the top 10 Moloch DAOs (see <ExternalLink href="https://medium.com/@floatprotocol">announcement</ExternalLink>).</p>
        <p>Each day, 1,500.00 BANK will be distributed, or 500 BANK per pool. In total, 10,500 BANK will be distributed per week.</p>
        <p>There will be a limit of 10,000 tokens deposited per pool.</p>
      </PhaseInfo>

      <DAIPanel />
      <USDCPanel />
      <USDTPanel />

      <PhaseInfo title={<h4>Phase 2</h4>}>
        <p>The second phase is meant to offer a wide distribution to communities of the top DeFI protocols and to enable initial price discovery for the BANK token. The second phase will last 2 weeks.</p>
        <p>All limits on participation will be removed (including per address and per pool).</p>
        <p>Additionally, new non-stablecoin pools will be added. The full announcement will be available 1 week before the start of Phase 2.</p>
        <p>Each day, 1,500.00 BANK will be distributed.</p>
        <p>During phase 2, we will also incentivise a liquidity pool for BANK-ETH in order to allow better price discovery</p>
      </PhaseInfo>
    </>
  );
}


export default Phase1View;