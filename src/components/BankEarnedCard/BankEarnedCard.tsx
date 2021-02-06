import React from 'react';
import Modal from 'react-modal';

import BankLogo from 'assets/float/bank_thumbprint.svg'
import './BankEarnedCard.css';
import { useStakeOption } from 'contexts/StakeOption';
import { formatPrefix } from 'web3/utils';
import { BANKTokenMeta } from 'web3/contracts/BANK';
import LoadingButton from 'components/LoadingButton/LoadingButton';

Modal.setAppElement('#root');

function BankEarnedCard() {
    const { pool, claiming, startClaim } = useStakeOption();
    const { earnedUnit } = pool;

    const earnedPrefixed = formatPrefix(earnedUnit, BANKTokenMeta.decimals);

    return (
        <>
            <div className="bank-tokens-earned-card-container">
                <img src={BankLogo} className="bank-logo" alt="BANK logo" />
                <p>BANK Earned</p> 
                
                <h2 className="bank-tokens-earned">{earnedPrefixed ?? '0.0'}</h2>
                
                <div className='claim-bank-tokens-button-container'>
                    <LoadingButton
                        className="loading-button"
                        text="Claim"
                        loading={claiming}
                        onClick={startClaim}
                    />
                </div>
            </div>
        </>
    )
};

export default BankEarnedCard;