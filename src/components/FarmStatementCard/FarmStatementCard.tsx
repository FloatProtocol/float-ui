import React from 'react';
import Modal from 'react-modal';
import { BigNumber } from '@ethersproject/bignumber';

import './FarmStatementCard.css';
import { useWallet } from 'wallets/wallet';
import ConnectWalletButton from 'components/ConnectWallet/ConnectWalletButton';
import { useStakeOption } from 'contexts/StakeOption';
import LoadingButton from 'components/LoadingButton/LoadingButton';
import { formatUnits } from 'web3/utils';

Modal.setAppElement('#root');

function FarmStatementCard() {
    const { isActive } = useWallet();

    const { pool, token, startApprove, startWithdraw, startDeposit, approving, withdrawing, depositing } = useStakeOption();
    const { stakedUnit, proportionOfPool } = pool;
    const { allowanceUnit } = token;
    const { icon, decimals } = token.tokenMeta;

    const deposit = formatUnits(stakedUnit ?? BigNumber.from(0), decimals);

    return (
        <>
            <div className="farm-statement-card-container">
                {icon}
                <p>Your Deposit</p>
                <div className="deposit-value-container">
                    <div className="deposit-container">
                        <h2 className="user-deposit">{deposit}</h2>
                    </div>
                    
                    <p className='percentage-container'> (<span className="percentage-value">{proportionOfPool}%</span> of total)</p>
                </div>

                { isActive && (allowanceUnit && allowanceUnit.lte(0) ? <>
                    <div className='buttons-container'>
                        <LoadingButton
                            className="approve-farm-button loading-button"
                            text="Approve"
                            loading={approving}
                            onClick={startApprove}
                        />
                    </div>
                </> : <div className='buttons-container'>
                        <LoadingButton
                            className="medium-button loading-button"
                            text="Withdraw"
                            loading={withdrawing}
                            onClick={startWithdraw}
                        />
                        <LoadingButton
                            className="medium-button loading-button"
                            text="Deposit"
                            loading={depositing}
                            onClick={startDeposit}
                        />
                        
                    </div>)}

                { !isActive && <>
                    <div className='buttons-container'>
                        <ConnectWalletButton/>
                    </div>
                </>}
            </div>
        </>
    )
};

export default FarmStatementCard;