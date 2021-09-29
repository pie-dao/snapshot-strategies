import { formatUnits } from '@ethersproject/units';
import { multicall } from '../../utils';

export const author = 'alexintosh';
export const version = '0.0.1';

const abi = [
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
) {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';

  const veDoughQuery = addresses.map((address: any) => [
    options.veDOUGH,
    'balanceOf',
    [address]
  ]);

  const veDoughBalances = await multicall(
    network,
    provider,
    abi,
    [ ...veDoughQuery ],
    { blockTag }
  );

  return Object.fromEntries(
    addresses
      .map((addr, i) => [addr, parseFloat(formatUnits(veDoughBalances[i][0].toString(), options.decimals))])
  );
}
