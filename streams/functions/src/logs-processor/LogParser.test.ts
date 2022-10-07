import { BigNumber } from 'ethers';

import { AbiItem } from '@moralisweb3/streams-typings';

import { LogParser } from './LogParser';

describe('LogParser', () => {
  it('reads Transfer event correctly', () => {
    const log = {
      logIndex: '1',
      transactionHash: '0x13330587c90eb5efe8cd49a1da7314660d51cc0de35b97b6d423584459a5a643',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      data: '0x0000000000000000000000000000000000000000000000000000000a79e31c40',
      topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      topic1: '0x000000000000000000000000beefbabeea323f07c59926295205d3b7a17e8638',
      topic2: '0x00000000000000000000000088e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
      topic3: null,
      tag: 'ERC20 Transfer',
      streamId: 'ba3b3c52-3dd3-4eb7-a2b7-4b61d3439c5e',
    };
    const abiItems: AbiItem[] = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ];

    const { name, params } = new LogParser(abiItems).read(log);

    expect(name).toBe('Transfer');

    expect(params['from'].type).toEqual('address');
    expect(typeof params['from'].value).toBe('string');
    expect(params['from'].value).toEqual('0xBEEFBaBEeA323F07c59926295205d3b7a17E8638');

    expect(params['to'].type).toEqual('address');
    expect(typeof params['to'].value).toBe('string');
    expect(params['to'].value).toEqual('0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640');

    expect(params['value'].type).toEqual('uint256');
    expect(BigNumber.isBigNumber(params['value'].value)).toEqual(true);
    expect((params['value'].value as BigNumber).toString()).toEqual('44994600000');
  });

  it('reads Swap event correctly', () => {
    const log = {
      logIndex: '242',
      transactionHash: '0xeaad25e6cc05765d8e8a4358aee9593f578495b22890fcc10000a0ea4f37c444',
      address: '0xed92bfe08de542bbb40fdbe0a27ca66313c0c457',
      data: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b1c830beb6d62ce6300000000000000000000000000000000000000000000000000b521481ba091890000000000000000000000000000000000000000000000000000000000000000',
      topic0: '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
      topic1: '0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff',
      topic2: '0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff',
      topic3: null,
      tag: 'Sushi Swap',
      streamType: 'contract',
      streamId: 'bc9a9ce6-32b3-4039-9aee-c2b0d79afa34',
    };
    const abiItems: AbiItem[] = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount0In',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount1In',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount0Out',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount1Out',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
        ],
        name: 'Swap',
        type: 'event',
      },
    ];

    const { name, params } = new LogParser(abiItems).read(log);

    expect(name).toEqual('Swap');

    expect(params['amount0In'].type).toEqual('uint256');
    expect((params['amount0In'].value as BigNumber).toString()).toEqual('0');

    expect(params['amount1In'].type).toEqual('uint256');
    expect((params['amount1In'].value as BigNumber).toString()).toEqual('500116588950949383779');

    expect(params['amount0Out'].type).toEqual('uint256');
    expect((params['amount0Out'].value as BigNumber).toString()).toEqual('50983564369498505');

    expect(params['amount1Out'].type).toEqual('uint256');
    expect((params['amount1Out'].value as BigNumber).toString()).toEqual('0');
  });
});