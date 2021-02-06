import { keccak256 } from "@ethersproject/solidity";

const leafHash = (address: string): string => {
  return keccak256(["bytes1", "address"], [0, address]);
};

export default class MerkleTree {
  layers: string[][];

  constructor (layers: string[][]) {
    this.layers = layers;
  }

  getProof(address: string): string[] {
    const idx = this.layers[0].indexOf(leafHash(address));
    if (idx === -1) {
      throw new Error(`Element (${address}, ${leafHash(address)}) does not exist in Merkle tree`);
    }

    return this._proofFromIndex(idx);
  }

  hasProof(address: string): boolean {
    return this.layers[0].indexOf(leafHash(address)) !== -1;
  }

  _proofFromIndex(idx: number): string[] {
    return this.layers.reduce((proof, layer) => {
      const pairElement = this._getPairElement(idx, layer);

      if (pairElement) {
        proof.push(pairElement);
      }

      idx = Math.floor(idx / 2);
    
      return proof;
    }, []);
  }

  _getPairElement(idx: number, layer: string[]): string | undefined {
    const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    if (pairIdx < layer.length) {
      return layer[pairIdx];
    } else {
      return undefined;
    }
  }
}