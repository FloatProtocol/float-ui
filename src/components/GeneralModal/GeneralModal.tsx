import React from 'react';
import Modal from 'react-modal';

import CloseIcon from 'assets/modal/close.png';

import './GeneralModal.css';

Modal.setAppElement('#root');

interface GeneralModalProps {
    isOpen: boolean;
    onCancel: VoidFunction;
    className?: string;
    modalTitle?:React.ReactNode;
    modalSubtitle?: React.ReactNode;
    modalBody?:React.ReactNode;

}
function GeneralModal({ isOpen, onCancel, className, modalTitle, modalSubtitle, modalBody }: GeneralModalProps) {

    return (    
        <Modal 
            className={`general-modal ${className}`}
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
                            {modalTitle}
                        </p>
                        <p          
                            className="modal-subtitle"
                        >
                            {modalSubtitle}
                        </p>
                    </div>
                </div> 

                <div className='modal-body'>
                    {modalBody}
                </div>
                <div className='modal-button-group'>
                    <button type="button" onClick={onCancel}> 
                        Understood 
                    </button>    
                </div>
            </div>
        </Modal>
    );
            
};



export default GeneralModal;