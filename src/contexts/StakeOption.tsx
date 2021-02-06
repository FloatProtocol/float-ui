import DepositModal from 'components/DepositModal/DepositModal';
import WithdrawModal from 'components/WithdrawalModal/WithdrawModal';
import React from 'react';
import { Phase1Pool } from 'web3/contracts/Phase1Pool';
import { TokenContract } from 'web3/contracts/StakeTokens';
import { MaxUint256 } from "@ethersproject/constants";
import { parseUnits } from '@ethersproject/units';
import { useWallet } from 'wallets/wallet';
import GeneralModal from 'components/GeneralModal/GeneralModal';
import { useReceipt } from 'hooks/useReceipt';
import { toast } from 'react-toastify';
import { useWhitelist } from './WhitelistContext';
import WhitelistModal from 'components/WhitelistModal/WhitelistModal';

interface StakeOption {
  pool: Phase1Pool;
  token: TokenContract;

  // Controllers
  approving: boolean;
  startApprove: VoidFunction;

  withdrawing: boolean;
  startWithdraw: VoidFunction;
  withdraw(val: string): void;

  depositing: boolean;
  startDeposit: VoidFunction;
  deposit(val: string): void;

  claiming: boolean;
  startClaim: VoidFunction;

  exit: VoidFunction;
}

const StakeOptionContext = React.createContext<StakeOption>({} as StakeOption);

export function useStakeOption(): StakeOption {
  return React.useContext(StakeOptionContext);
}

interface StakeOptionProviderProps {
  pool: Phase1Pool;
  token: TokenContract;
}

const StakeOptionProvider: React.FC<StakeOptionProviderProps> = ({pool, token, children}) => {
  // Modal Controllers
  const [withdrawModalOpen, setWithdrawModalOpen] = React.useState(false);
  const [depositModalOpen, setDepositModalOpen] = React.useState(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [whitelistModalOpen, setWhitelistModalOpen] = React.useState(false);
  
  // Status Controllers
  const [claiming, setClaiming] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const [depositing, setDepositing] = React.useState(false);
  const [withdrawing, setWithdrawing] = React.useState(false);

  // Error Controller
  const [error, setError] = React.useState("");

  const { account } = useWallet();
  const { tree } = useWhitelist();

  useReceipt((receipt) => toast.success(`${token.tokenMeta.name} approved #${receipt.transactionHash}`), token.contract, 'approve');

  const startApprove = async () => {
    if (!tree || !tree.hasProof(account!)){
      setWhitelistModalOpen(true);
      return;
    }   

    setApproving(true);
    try {
      await token.approveSend(MaxUint256);
    } catch(err) {
      setError("Approve failed.");
      setErrorModalOpen(true);
      console.error("claim.claim.err", err);
    }
    setApproving(false);
  };

  const startClaim = async () => {
    if (!tree || !tree.hasProof(account!)){
      setWhitelistModalOpen(true);
      return;
    }   

    setClaiming(true);
    try {
      await pool.claim();
    } catch(err) {
      setError("Claim failed.");
      setErrorModalOpen(true);
      console.error("claim.claim.err", err);
    }
    setClaiming(false);
  };

  const withdraw = async (amount: string) => {
    setWithdrawing(true);
    const unitAmount = parseUnits(amount, token.tokenMeta.decimals);
    try {
      await pool.withdraw(unitAmount);
    } catch (err) {
      setError(`Withdraw failed.`);
      setErrorModalOpen(true);
      console.error("withdraw.withdraw.err", err);
    }
    setWithdrawing(false);
  };

  const startDeposit = () => {
    setDepositModalOpen(true);
  }

  const deposit = async (amount: string) => {
    setDepositing(true);
    const unitAmount = parseUnits(amount, token.tokenMeta.decimals);
    try {
      await pool.stake(unitAmount);
    } catch (err) {
      setError(`Deposit failed.`);
      setErrorModalOpen(true);
      console.error('deposit.stake.err', err);
    }
    setDepositing(false);
  };

  const exit = async () => {
    setClaiming(true);
    setWithdrawing(true);
    try {
      await pool.exit();
    } catch (err) {
      setError(`Exit failed.`);
      setErrorModalOpen(true);
      console.error("exit.err", err);
    }
    setWithdrawing(false);
  };



  const value = {
    pool,
    token,
    approving,
    withdrawing,
    depositing,
    claiming,
    startApprove,
    startWithdraw: () => setWithdrawModalOpen(true),
    withdraw,
    startDeposit,
    deposit,
    startClaim,
    exit,
  };
  return (
    <StakeOptionContext.Provider value={value}>
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onCancel={()=> setWithdrawModalOpen(false)}
      />
      <DepositModal
        isOpen={depositModalOpen}
        onCancel={()=> setDepositModalOpen(false)}
      />
      <WhitelistModal
        isOpen={whitelistModalOpen}
        onCancel={() => setWhitelistModalOpen(false)}
      />
      <GeneralModal
        className="error-modal"
        isOpen={errorModalOpen}
        onCancel={() => setErrorModalOpen(false)}
        modalTitle={"Here's the issue."}
        modalBody={error}
      />
      {children}
    </StakeOptionContext.Provider>
  )
} 

export default StakeOptionProvider;