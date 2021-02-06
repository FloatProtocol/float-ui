import { ReactNode } from 'react';

import { useWallet } from 'wallets/wallet'
import { shortenString } from 'web3/utils';

interface ConnectWalletButtonProps {
    dropdownOpen?: boolean;
    openDropdown?: VoidFunction;
    children?: ReactNode;
}

function ConnectWalletButton({ dropdownOpen, openDropdown, children }: ConnectWalletButtonProps){
    const { isActive, account, showWalletsModal } = useWallet()

    return(
        <div className='connect-wallet-button-container'>
            {isActive && account ? (
                <div>
                    <button onClick={openDropdown}>
                    {shortenString(account)}
                    </button>
                    {dropdownOpen && children}
                </div>
            ) : ( 
                <button 
                    onClick={showWalletsModal} 
                    className='connect-wallet-button'
                >
                    Connect 
                </button>
            )}

        </div>
    )
}

export default ConnectWalletButton;