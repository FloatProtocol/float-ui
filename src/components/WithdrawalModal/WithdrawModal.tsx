import React from 'react';
import Modal from 'react-modal';
import MaxForm from 'components/MaxForm/MaxForm';
import { useStakeOption } from 'contexts/StakeOption';

import CloseIcon from 'assets/modal/close.png';
import '../GeneralModal/GeneralModal.css';
import { useTransactionHash } from 'hooks/useTransactionHash';
import { useReceipt } from 'hooks/useReceipt';
import { TransactionBlock } from 'components/GeneralModal/GeneralModal.TransactionBlock';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

interface WithdrawModalProps{
    isOpen: boolean;
    onCancel: VoidFunction;
}

function WithdrawModal({isOpen, onCancel}: WithdrawModalProps) {
    const { pool, token, withdrawing, withdraw, exit } = useStakeOption();
    const { staked } = pool;
    const { name, icon } = token.tokenMeta;

    const [txn, setTxn] = React.useState<string>();

    useTransactionHash(setTxn, pool.contract, 'withdraw');
    useTransactionHash(setTxn, pool.contract, 'exit');
    useReceipt((receipt) => { setTxn(''); toast.success(`${name} Exit confirmed #${receipt.transactionHash}`); }, pool.contract, 'exit');
    useReceipt((receipt) => { setTxn(''); toast.success(`${name} Withdrawal confirmed #${receipt.transactionHash}`); }, pool.contract, 'withdraw');

    const onSubmit = (val: string) => {
        if (val === staked) {
            exit();
        } else {
            withdraw(val);
        }
    }

    return <Modal 
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
                
                <p className="modal-title">
                    Withdraw {name} 
                    {icon}
                </p>
                
                <div className="smallColumnDivider"></div>
                
                <div className="modal-key-info">
                    <p>My Current Stake: </p>
                    <p className="modal-numeric-value">{staked} {name}</p>
                </div>

            </div> 
            
            <TransactionBlock
                txn={txn}
                onCancel={onCancel}
            >
                <MaxForm
                    max={staked}
                    loading={withdrawing}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    onMaxText="When you withdraw you maximum stake, we will also withdraw your BANK tokens"
                />
            </TransactionBlock>
            
        </div>
    </Modal>;
            
}



export default WithdrawModal;