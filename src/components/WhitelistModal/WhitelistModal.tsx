import ExternalLink from 'components/ExternalLink/ExternalLink';
import GeneralModal from 'components/GeneralModal/GeneralModal';
import { useWhitelist } from 'contexts/WhitelistContext';
import React from 'react';
import { useWallet } from 'wallets/wallet';
import { shortenString } from 'web3/utils';

interface WhitelistModalProps{
  isOpen: boolean;
  onCancel: VoidFunction;
}

function WhitelistModal({isOpen, onCancel}: WhitelistModalProps) {
  const { account } = useWallet();
  const { ipfsHash } = useWhitelist();

  const modalBody = <>
    <p>{`Unfortunately ${account ? shortenString(account) : 'your address'} is not whitelisted. The whitelist is based of past involvement in governance across various platforms. This early stage contribution is limited so Phase 2 will still provide plenty of rewards.`}</p>
    <ExternalLink href={`https://ipfs.io/ipfs/${ipfsHash}`}>Check the whitelist</ExternalLink>
  </>;

  return <GeneralModal
      isOpen={isOpen}
      onCancel={onCancel}
      modalTitle="Here's the issue"
      modalBody={modalBody}
    />;
          
}



export default WhitelistModal;