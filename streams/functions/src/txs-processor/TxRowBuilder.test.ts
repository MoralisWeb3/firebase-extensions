import { TxRowBuilder } from './TxRowBuilder';

describe('TxRowBuilder', () => {
  it('builds correctly', () => {
    const tx = {
      hash: '0x91e4046c7768132aa614c6e0d4773b8cd20cee1948b2508e570d3ce630415588',
      gas: '207128',
      gasPrice: '8652938136',
      nonce: '4262103',
      input: '0x',
      transactionIndex: '75',
      fromAddress: '0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
      toAddress: '0xc2bacad6632903dc03e190bf33a6e8c7ea0881c1',
      value: '10000000000000000',
      type: '2',
      v: '0',
      r: '8522664046905990578164143534491536109331129839629903737002530670138249739539',
      s: '48306749826871999834738509867081969620532520428036344972909508655681719515828',
      receiptCumulativeGasUsed: '6692052',
      receiptGasUsed: '21000',
      receiptContractAddress: null,
      receiptRoot: null,
      receiptStatus: '1',
      tag: 'testetset',
      streamId: '1f5cc0d3-085e-4bcc-8c5f-c48952fd40f3',
      streamType: 'wallet',
    };
    const block = {
      number: '15666916',
      hash: '0x1af899d66c7847ba6d1faa4d9ca1b37e4f337232662a8e60163a6718a234d9ff',
      timestamp: '1664791547',
    };
    const row = TxRowBuilder.build(tx, block, false);

    expect(row).toBeDefined();
    expect(row.id).toBe('0xcd270344f96e9a093efdd083c921f97e5df8e2a913f7b24874fa124e44c831f5');
    expect(row.hash).toBe('0x91e4046c7768132aa614c6e0d4773b8cd20cee1948b2508e570d3ce630415588');
    expect(row.transactionIndex).toBe(75);
    expect(row.gas).toBe(207128);
    expect(row.gasPrice).toBe(8652938136);
    expect(row.nonce).toBe(4262103);
    expect(row.fromAddress).toBe('0xdfd5293d8e347dfe59e90efd55b2956a1343963d');
    expect(row.toAddress).toBe('0xc2bacad6632903dc03e190bf33a6e8c7ea0881c1');
    expect(row.value).toBe('10000000000000000');
    expect(row.input).toBe('0x');
    expect(row.type).toBe(2);
    expect(row.receiptStatus).toBe(1);
    expect(row.receiptGasUsed).toBe(21000);
    expect(row.receiptCumulativeGasUsed).toBe(6692052);
    expect(row.blockHash).toBe('0x1af899d66c7847ba6d1faa4d9ca1b37e4f337232662a8e60163a6718a234d9ff');
    expect(row.blockTimestamp).toBe(1664791547);
    expect(row.blockNumber).toBe(15666916);
    expect(row.confirmed).toBe(false);
  });
});
