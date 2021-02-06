import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits as etherFormatUnits } from '@ethersproject/units';

export const NODE_CHAIN_ID = Number(process.env.REACT_APP_NODE_CHAIN_ID);
export const NODE_URI = String(process.env.REACT_APP_NODE_URI);

export const ETHERSCAN_URI = String(process.env.REACT_APP_ETHERSCAN_URI);

export function contextualiseUri(uri: string, chainId: number = NODE_CHAIN_ID): string {
  const network = getNetworkName(chainId).toLowerCase()
  const networkSub = chainId !== 1 ? `${network}.` : '';
  
  return uri
    .replace("{{networkName}}", network)
    .replace("{{networkSub}}", networkSub);
}

export function getHttpRpcUrl(chainId?: number): string {
  return contextualiseUri(NODE_URI, chainId);
}

export function etherscanAddress(address?: string): string | undefined {
  if (!ETHERSCAN_URI || !address) {
    return undefined;
  }
  
  return `${contextualiseUri(ETHERSCAN_URI)}address/${address}`;
}

export function etherscanTransaction(hash?: string): string | undefined {
  if (!ETHERSCAN_URI || !hash) {
    return undefined;
  }
  
  return `${contextualiseUri(ETHERSCAN_URI)}tx/${hash}`;
}


export function shortenString(str: string, chars: number = 4): string {
  return `${str.slice(0, chars + 2)}...${str.slice(-(chars+1), -1)}`;
}

export function getNetworkName(chainId?: number): string {
  switch (chainId) {
    case 1:
      return 'Mainnet';
    case 4:
      return 'Rinkeby';
    default:
      return '-';
  }
}

export function percentageFromBigNumbers(balance?: BigNumber, total?: BigNumber): string {
  var percentageOfTotalPool = '0';
  if (total && balance && total.gt(0)) {
    percentageOfTotalPool = balance.mul(100)
      .div(total).toString();
  }
  return percentageOfTotalPool;
}

interface Range {
  divider: number,
  suffix: string,
}

const DEFAULT_RANGES: Range[] = [
  { divider: 1e9 , suffix: 'B' },
  { divider: 1e6 , suffix: 'M' },
];

export function formatUnits(number?: BigNumber, decimals: number = 18, decimalPlaces: number = 2): string | undefined {
  if (number === undefined) {
    return undefined;
  }

  // Add a rounding factor as we only format to 2 decimal places
  // Hence we can round up with a small additive factor
  const factor = decimals - decimalPlaces - 2;
  if (factor > 0) {
    number = number.add(BigNumber.from(10).pow(factor));
  }

  const baseFormatting = etherFormatUnits(number, decimals);
  const [unit, fraction] = baseFormatting.split(".");
  const decimalisedFraction = Number(fraction.slice(0, decimalPlaces)).toFixed();

  return `${unit}.${decimalisedFraction}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatPrefix(number?: BigNumber, decimals: number = 18, ranges: Range[] = DEFAULT_RANGES): string | undefined {
  for (let i = 0; i < ranges.length; i++) {
    const multiplier = BigNumber.from(ranges[i].divider).mul(BigNumber.from(10).pow(decimals));
    if (number?.gt(multiplier)) {
      const byDivider = number.div(ranges[i].divider);
      return formatUnits(byDivider, decimals) + ranges[i].suffix;
    }
  }
  return number && formatUnits(number, decimals);
}