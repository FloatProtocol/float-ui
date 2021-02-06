// const Card = props => {
//     return(
//         <div className="card">
//             <h2>{props.title}</h2>
//             <p>{props.content}</p>
//         </div>
//     )
// }

// export default Card;

import React from 'react';
import './Card.css';

interface CardProps {
    title: React.ReactNode;
    content: React.ReactNode;
    footnote?: React.ReactNode;
}

function Card ({ title, content, footnote }: CardProps) {
    return (
        <div className="card-container">
            <p className="card-title">{title}</p>
            <p className="card-content">{content}</p>
            { footnote && <div className="card-footnote">
                <p>{footnote}</p>
            </div> }
        </div>
    )
};

export default Card;