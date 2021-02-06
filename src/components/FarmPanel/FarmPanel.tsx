import React from 'react';

import ExternalLink from 'components/ExternalLink/ExternalLink'

import './FarmPanel.css';
import { useStakeOption } from 'contexts/StakeOption';
import { etherscanAddress, formatPrefix, formatUnits } from 'web3/utils';
import BankEarnedCard from 'components/BankEarnedCard/BankEarnedCard';
import FarmStatementCard from 'components/FarmStatementCard/FarmStatementCard';
import { BANKTokenMeta } from 'web3/contracts/BANK';

function FarmPanel() {
    const { token, pool } = useStakeOption();
    const { maximumContributionUnit, totalStakedUnit,  totalRewardUnit, duration } = pool;
    const { name, decimals } = token.tokenMeta;
    const etherscanLink = etherscanAddress(pool.contract.address);
    const dailyReward = formatPrefix(totalRewardUnit?.div(duration ? duration / 60 / 60 / 24 : 1), BANKTokenMeta.decimals);
    const totalStakedPrefixed = formatPrefix(totalStakedUnit, decimals);
    const totalStakedDollar = Number(formatUnits(totalStakedUnit, decimals)) * Number(token.priceInDAI);
    const maximumContribution = formatUnits(maximumContributionUnit, decimals)

    return (
        <div className="farm-panel-container">
            <div className="farm-panel-header">
                <div className="farm-panel-instructions">
                    <h2>{name}</h2>
                    <p>Deposit {name} to earn BANK tokens</p>   
                    <p className="farm-subtitle">Limit per whitelisted account is {maximumContribution} {name}</p>

                    <div className="etherscan-container">
                        <ExternalLink href={etherscanLink}>View Pool</ExternalLink>
                    </div>
                
                </div>

                <div className="smallColumnDivider"></div> 

                <div className="farm-deposit-stats">
                    <p className="farm-secondary-title">Total {name} Deposited</p>
                    <p className="farm-stat">{totalStakedPrefixed}</p>
                    {totalStakedUnit && <p className="farm-subtitle">{`$${totalStakedDollar}`}</p>}
                </div>

                <div className="smallColumnDivider"></div> 

                <div className="farm-deposit-stats">
                    <p className="farm-secondary-title">Daily Distribution</p>
                    <p className="farm-stat">{dailyReward}</p>
                    <p className="farm-subtitle">BANK per day</p>
                </div>
            </div>
            
            <div className="farm-panel-body">
                <div className="left-box">
                    <BankEarnedCard/>
                </div> 

                <div className="columnDivider"></div> 

                <div className="right-box">
                    <FarmStatementCard/>    
                </div> 

            </div>

        </div>
    )
    
}

export default FarmPanel;
