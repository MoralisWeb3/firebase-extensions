import { IWebhook } from '@moralisweb3/streams-typings';

import { LogsProcessor } from './LogsProcessor';

const batch: IWebhook = {
  logs: [
    {
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
    },
    {
      logIndex: '57',
      transactionHash: '0xe7c372f5577d26dae61d63e94e1ebf07639ce3510d6f74636ed1989ddf9cc8a4',
      address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
      data: '0x0000000000000000000000000000000000000000000edcceb29b03ef0fdc0000',
      topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      topic1: '0x000000000000000000000000fab12bd6a1e57bd982171d2c52cca64de48785b2',
      topic2: '0x000000000000000000000000c589b275e60dda57ad7e117c6dd837ab524a5666',
      topic3: null,
      tag: 'shiba',
      streamType: 'contract',
      streamId: '6f37326a-e512-42bb-bcf0-36ae984da857',
    },
  ],
  txs: [],
  txsInternal: [],
  chainId: '0x1',
  confirmed: true,
  abis: {
    '6f37326a-e512-42bb-bcf0-36ae984da857': {
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
  },
  block: {
    number: '15631019',
    hash: '0x76f9e7f08bc0c4f0621fc12af6730352578a8f980a06baffda8615235574fc75',
    timestamp: '1664358227',
  },
  retries: 0,
  erc20Transfers: [
    {
      transactionHash: '0xb8f5496884cc69154cc38d133b6ace6923f9430e829e2f2cd1bc07bde9306388',
      logIndex: '56',
      tag: 'shiba',
      tokenAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
      from: '0x6d17cc023df5156efbc726946ce5d04fe484ef39',
      to: '0x34189c75cbb13bdb4f5953cda6c3045cfca84a9e',
      value: '17969119000000000000000000',
      tokenName: 'SHIBA INU',
      tokenSymbol: 'SHIB',
      tokenDecimals: '18',
      valueWithDecimals: '17969119',
    },
    {
      transactionHash: '0xe7c372f5577d26dae61d63e94e1ebf07639ce3510d6f74636ed1989ddf9cc8a4',
      logIndex: '57',
      tag: 'shiba',
      tokenAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
      from: '0xfab12bd6a1e57bd982171d2c52cca64de48785b2',
      to: '0xc589b275e60dda57ad7e117c6dd837ab524a5666',
      value: '17967695000000000000000000',
      tokenName: 'SHIBA INU',
      tokenSymbol: 'SHIB',
      tokenDecimals: '18',
      valueWithDecimals: '17967695',
    },
  ],
  erc20Approvals: [],
  nftApprovals: {
    ERC1155: [],
    ERC721: [],
  },
  nftTransfers: [],
};

describe('LogsProcessor', () => {
  it('processes correctly', () => {
    const updates = new LogsProcessor().process(batch);

    expect(updates.length).toBe(2);
    expect(updates[0].tableName).toBe('Shiba');
    expect(updates[1].tableName).toBe('Shiba');
  });
});
