import React from 'react';
import Modal from 'react-modal';
import MaxForm from 'components/MaxForm/MaxForm';
import { useStakeOption } from 'contexts/StakeOption';
import { formatUnits } from '@ethersproject/units';

import CloseIcon from 'assets/modal/close.png';
import '../GeneralModal/GeneralModal.css';
import { useTransactionHash } from 'hooks/useTransactionHash';
import { useReceipt } from 'hooks/useReceipt';
import { TransactionBlock } from 'components/GeneralModal/GeneralModal.TransactionBlock';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

interface DepositModalProps {
    isOpen: boolean;
    onCancel: VoidFunction;
}
function DepositModal({ isOpen, onCancel }: DepositModalProps) {
    const { pool, token, depositing, deposit } = useStakeOption();
    const { maximumContribution, maximumContributionUnit, stakedUnit } = pool;
    const { balance, balanceUnit } = token;
    const { name, icon, decimals } = token.tokenMeta;

    const remainingContribution = maximumContributionUnit?.sub(stakedUnit ?? 0);
    const maximumDeposit = balanceUnit && remainingContribution ? (
        balanceUnit?.gt(remainingContribution) ? formatUnits(remainingContribution, decimals) : balance
    ) : "0";

    const [txn, setTxn] = React.useState<string>();

    useTransactionHash(setTxn, pool.contract, 'stakeWithProof');
    useReceipt(() => setTxn(''), pool.contract, 'stakeWithProof');
    useReceipt((receipt) => { setTxn(''); toast.success(`${name} Deposit confirmed #${receipt.transactionHash}`); }, pool.contract, 'stakeWithProof');

    return (
    <Modal 
        className="general-modal"
        overlayClassName="general-overlay"
        isOpen={isOpen} 
        onRequestClose={onCancel}
    >
        <div className='general-modal-container'>
            <input  className="close-modal-button" 
                    type="image" src={CloseIcon} 
                    alt='Close window'
                    onClick={onCancel}
            />
            
            <div className='modal-header'>
                
                <div className="modal-header-main">
                    <p className="modal-title">

                        Deposit {name} 
                        {icon}
                    
                    </p>

                    <p className="modal-subtitle">Limit per whitelisted account is {maximumContribution} {name}</p>
                </div> 
                
                <div className="smallColumnDivider"></div>
                
                <div className="modal-key-info">
                    <p>My Wallet Balance: </p>
                    <p className="modal-numeric-value">{balance} {name}</p>
                </div>
            </div> 

            <TransactionBlock
                txn={txn}
                onCancel={onCancel}
            >
                <MaxForm
                    max={maximumDeposit}
                    loading={depositing}
                    onSubmit={deposit}
                    onCancel={onCancel}
                />
            </TransactionBlock> 
        </div>
    </Modal>);
            
}



export default DepositModal;