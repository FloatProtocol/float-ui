import React, { useEffect } from 'react';
import MerkleTree from 'web3/MerkleTree';
import layers from "assets/merkleTree.json";
import deployment from 'web3/deployment.json';
import { useReload } from 'hooks/useReload';
import Web3Contract from 'web3/Web3Contract';
import { useWallet } from 'wallets/wallet';
import { useAsyncEffect } from 'hooks/useAsyncEffect';

interface Whitelist {
  tree?: MerkleTree;
  ipfsHash?: string;
}

const WhitelistContext = React.createContext<Whitelist>({} as Whitelist);

const initialData = {
  tree: undefined,
  ipfsHash: undefined,
};

export function useWhitelist(): Whitelist {
  return React.useContext(WhitelistContext);
}

const WhitelistProvider: React.FC = ({ children }) => {
  const [reload] = useReload();
  const wallet = useWallet();

  const merkleWhitelist = deployment.contracts.MerkleWhitelist;

  const contract = React.useMemo<Web3Contract>(() => {
    return new Web3Contract(
      merkleWhitelist.abi,
      merkleWhitelist.address,
      "MerkleWhitelist",
    );
  }, [merkleWhitelist]);

  React.useEffect(() => {
    contract.setProvider(wallet.provider);
  }, [contract, wallet.provider]);

  const [data, setData] = React.useState<Whitelist>(initialData);

  useAsyncEffect(async () => {
    let ipfsHash: string | undefined;

    const [uri] = await contract.batch([
      {
        method: 'uri',
        methodArgs: [],
      },
    ]);

    ipfsHash = uri && uri.replace("ipfs://", "");

    setData(prevState => ({
      ...prevState,
      ipfsHash,
    }));
  }, [reload, wallet.account]);


  useEffect(() => {
    setData(prevState => ({
      ...prevState,
      tree: new MerkleTree(layers as string[][]),
    }));
  }, []);

  return (
    <WhitelistContext.Provider value={data}>
      {children}
    </WhitelistContext.Provider>
  )
} 

export default WhitelistProvider;