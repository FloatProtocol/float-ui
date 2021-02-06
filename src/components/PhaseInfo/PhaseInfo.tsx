import React from 'react';

import './PhaseInfo.css';

interface PhaseInfoProps {
    title: React.ReactNode;
    children: React.ReactNode;
    footnote?: React.ReactNode;
}

function PhaseInfo ({ title, children, footnote }: PhaseInfoProps) {
    return (
        <div className="phase-info-container">
            <div className ="phase-info-title">
                {title}
            </div>
            <div className="phase-info-content">
                {children}
            </div>
            <div className="phase-info-footnote">
                <p>{footnote}</p>
            </div>
        </div>
    )
};

export default PhaseInfo;