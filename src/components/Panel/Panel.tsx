import React from 'react';

import './Panel.css';

interface PanelProps {
    children?: React.ReactNode[];
}

function Panel({children}: PanelProps) {
    return (
        <div>
            <div className="panel-container">
                {children?.map((panel, idx) => <div key={idx} className="panel-box">{panel}</div>)}
            </div>
        </div>
    )
    
}

export default Panel;
