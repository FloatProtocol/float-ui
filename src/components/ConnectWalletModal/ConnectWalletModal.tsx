import React from "react";
import Modal from 'react-modal';

import './ConnectWalletModal.css'

import { WalletConnector } from 'wallets/connectors/WalletConnector';
import { useWallet, WalletConnectors } from 'wallets/wallet';


// TODO: Needs a LederDerivationPathModal

Modal.setAppElement('#root');

interface ConnectWalletModalProps {
  visible: boolean;
  onCancel: VoidFunction;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ visible, onCancel }: ConnectWalletModalProps) => {
  const wallet = useWallet();

  function handleConnectorSelect(connector: WalletConnector) {
    if (wallet.isActive) {
      return;
    }

    // TOOD: Handle ledger

    return wallet.connect(connector);
  }

  return <Modal
      className="connect-modal"
      isOpen={visible}
      onRequestClose={onCancel}
  >
      <h2>Connect Wallet</h2>
      <p>Please select your wallet</p>

      <div className='wallet-options-container'>
        {WalletConnectors.map((connector, idx) => (
          <button key={idx} className='wallet-option' onClick={() => handleConnectorSelect(connector)}>
            <img src={connector.logo} alt={connector.name} />
            <span>{connector.name}</span>
          </button>
        ))}
      </div>
  </Modal>;
}

