import DropdownMenu from 'components/DropdownMenu/DropdownMenu';
import React, { useRef } from 'react';
import FloatProtocolLogo from 'assets/float/floatprotocol.svg'
import ConnectWalletButton from 'components/ConnectWallet/ConnectWalletButton';
import './TopBar.css';
import useOnClickOutside from 'hooks/useOnClickOutside';


function TopBar() {
    
    const ref = useRef<HTMLDivElement>(null);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    useOnClickOutside(ref, () => setDropdownOpen(false));

    return (
        <div className="topbar-container">
            
            <div className="box topbar-box-left">
                <img src={FloatProtocolLogo} alt="FLOAT PROTOCOL"/>
            </div> 
            <div className="box topbar-box-center">
                <p className='thick'>
                    Floating, low-volatility currency for web3 
                </p>
            </div>    
            <div className="box topbar-box-right">
                <ConnectWalletButton
                    dropdownOpen={dropdownOpen}
                    openDropdown={() => setDropdownOpen(true)}
                />
                <DropdownMenu
                    ref={ref}
                    isOpen={dropdownOpen}
                    onClose={() => setDropdownOpen(false)}
                />
            </div> 

        </div>
    )
    
}

export default TopBar;
