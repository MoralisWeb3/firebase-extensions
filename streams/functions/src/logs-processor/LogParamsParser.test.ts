import { BigNumber } from 'ethers';

import { AbiItem } from '@moralisweb3/streams-typings';

import { LogParamsParser } from './LogParamsParser';

describe('LogParamsParser', () => {
  it('reads Transfer event correctly', () => {
    const log = {
      logIndex: '56',
      transactionHash: '0xb8f5496884cc69154cc38d133b6ace6923f9430e829e2f2cd1bc07bde9306388',
      address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
      data: '0x0000000000000000000000000000000000000000000edd1be4934b422c1c0000',
      topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      topic1: '0x0000000000000000000000006d17cc023df5156efbc726946ce5d04fe484ef39',
      topic2: '0x00000000000000000000000034189c75cbb13bdb4f5953cda6c3045cfca84a9e',
      topic3: null,
      tag: 'shiba',
      streamType: 'contract',
      streamId: '6f37326a-e512-42bb-bcf0-36ae984da857',
    };
    const abi: AbiItem = {
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
    };

    const params = LogParamsParser.read(log, abi);

    expect(params['from'].type).toEqual('address');
    expect(typeof params['from'].value).toBe('string');
    expect(params['from'].value).toEqual('0x6D17CC023Df5156EFBC726946cE5d04fE484eF39');

    expect(params['to'].type).toEqual('address');
    expect(typeof params['to'].value).toBe('string');
    expect(params['to'].value).toEqual('0x34189c75Cbb13Bdb4F5953CDa6c3045CFcA84a9e');

    expect(params['value'].type).toEqual('uint256');
    expect(BigNumber.isBigNumber(params['value'].value)).toEqual(true);
    expect((params['value'].value as BigNumber).toString()).toEqual('17969119000000000000000000');
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
    const abi: AbiItem = {
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
    };

    const params = LogParamsParser.read(log, abi);

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
