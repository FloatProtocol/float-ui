import React from 'react';
import ExternalLink from 'components/ExternalLink/ExternalLink';
import './Footer.css';

// TODO Add the Middot
function Footer() {

    return(
        <div className="footer-container">
                <div className='footer-col'>
                    <ExternalLink href="https://medium.com/@floatprotocol">Medium</ExternalLink>
                </div>
                <div className='footer-col'>
                    <span>&#8226;</span> 
                </div>
                <div className='footer-col'>
                    <ExternalLink href="https://twitter.com/FloatProtocol">Twitter</ExternalLink>
                </div>
                <div className='footer-col'>
                    <span>&#8226;</span> 
                </div>
                <div className='footer-col'>
                    <ExternalLink href="https://t.me/officialfloatprotocol">Telegram</ExternalLink>
                </div>
                <div className='footer-col'>
                    <span>&#8226;</span> 
                </div>
                <div className='footer-col'>
                    <ExternalLink href="https://docs-float.gitbook.io/docs/">Docs</ExternalLink>
                </div>
                <div className='footer-col'>
                    <span>&#8226;</span> 
                </div>
                <div className='footer-col'>
                    <ExternalLink href="https://github.com/FloatProtocol">GitHub</ExternalLink>
                </div>
        </div>
    )
}

export default Footer;