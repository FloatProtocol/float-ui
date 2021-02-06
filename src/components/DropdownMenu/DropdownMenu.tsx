import React, {PropsWithChildren } from 'react';
import { useWallet } from 'wallets/wallet';
import Modal from 'react-modal';
import useClipboard from "react-use-clipboard";

import './DropdownMenu.css';
import { formatUnits, shortenString } from 'web3/utils';
import { BANKTokenMeta, useBANKContract } from 'web3/contracts/BANK';
import { DAITokenMeta, USDCTokenMeta, USDTTokenMeta, useDAIContract, useUSDCContract, useUSDTContract } from 'web3/contracts/StakeTokens';

Modal.setAppElement('#root');

interface DropdownMenuProps {
    isOpen?: boolean;
    onClose?: VoidFunction;
}

const BalanceGroup: React.FC = () => {
    const { balance: bankBalance } = useBANKContract();
    const { balanceUnit: daiBalance } = useDAIContract();
    const { balanceUnit: usdtBalance } = useUSDTContract();
    const { balanceUnit: usdcBalance } = useUSDCContract();

    const bankBalanceFormatted = formatUnits(bankBalance, BANKTokenMeta.decimals, 6);
    const daiBalanceFormatted = formatUnits(daiBalance, DAITokenMeta.decimals, 6);
    const usdtBalanceFormatted = formatUnits(usdtBalance, USDTTokenMeta.decimals, 6);
    const usdcBalanceFormatted = formatUnits(usdcBalance, USDCTokenMeta.decimals, 6);
    return (
        <div className="balances-group">
                {bankBalance?.gt(0) && <DropdownItem>
                    {BANKTokenMeta.icon}
                    <p>{bankBalanceFormatted} {BANKTokenMeta.name}</p>
                </DropdownItem>}
                {daiBalance?.gt(0) && <DropdownItem>
                    {DAITokenMeta.icon}
                    <p>{daiBalanceFormatted} {DAITokenMeta.name}</p>
                </DropdownItem>}
                {usdtBalance?.gt(0) && <DropdownItem>
                    {USDTTokenMeta.icon}
                    <p>{usdtBalanceFormatted} {USDTTokenMeta.name}</p>
                </DropdownItem>}
                {usdcBalance?.gt(0) && <DropdownItem>
                    {USDCTokenMeta.icon}
                    <p>{usdcBalanceFormatted} {USDCTokenMeta.name}</p>
                </DropdownItem>}
            </div>
    );
}


function DropdownItem(props: PropsWithChildren<{onClick?: VoidFunction}>) {
    return(
        <span className="menu-item" onClick={props.onClick}>
            {props.children}
        </span>
    );
}   

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(({ isOpen, onClose }, ref) => {
    const { account, networkName, disconnect } = useWallet();
    const onDisconnect = () =>{
        disconnect();
        onClose?.();
    }
    const [isCopied, setCopied] = useClipboard(account ?? "", {
        successDuration: 5000,
    });
 
    return(
        <div ref={ref} className={`dropdown ${isOpen ? 'open' : ''}`}>
            <div className="dropdown-header">
                <p className="dropdown-header-text">Balance ({account && shortenString(account)})</p>
                <p className="dropdown-header-badge">{networkName}</p>
            </div>
            <BalanceGroup/>

            <div className="dropdown-spacer"/>

            <DropdownItem onClick={setCopied}>
                <button className="text" >
                    {isCopied ? "Address copied to clipboard" : "Copy Address"}
                </button>
            </DropdownItem>
            <DropdownItem onClick={onDisconnect}>
            <button className="text" >Disconnect</button>
            </DropdownItem>
        </div>
        
    );
})

export default DropdownMenu;


