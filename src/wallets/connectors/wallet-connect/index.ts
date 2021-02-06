import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { getHttpRpcUrl } from 'web3/utils';

import WalletConnectLogo from 'assets/wallets/walletconnect.svg';
import { WalletConnector } from 'wallets/connectors/WalletConnector';

const WEB3_POLLING_INTERVAL = Number(process.env.REACT_APP_WEB3_POLLING_INTERVAL);

export const WalletConnectConfig: WalletConnector = {
  id: 'walletconnect',
  logo: WalletConnectLogo,
  name: 'WalletConnect',
  factory(chainId: number): AbstractConnector {
    return new WalletConnectConnector({
      rpc: {
        [chainId]: getHttpRpcUrl(chainId),
      },
      pollingInterval: WEB3_POLLING_INTERVAL,
      qrcode: true,
    });
  },
  onDisconnect(connector?: WalletConnectConnector): void {
    connector?.close();
  },
  onError(error: Error): Error | undefined {
    return error;
  },
};