import React from 'react';
import './App.css';

import { HashRouter } from 'react-router-dom';
import LayoutView from 'views/Layout';
import Web3WalletProvider from 'wallets/wallet';
import { ToastContainer } from 'react-toastify';
import WhitelistProvider from 'contexts/WhitelistContext';

const App = () => (
  <Web3WalletProvider>
    <WhitelistProvider>
      <HashRouter>
        <LayoutView />
        <ToastContainer style={{zIndex:0}}/>
      </HashRouter>
    </WhitelistProvider>
  </Web3WalletProvider>
)

export default App;


