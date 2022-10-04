import { LogRowId } from './LogRowId';

describe('LogRowId', () => {
  const transactionHash = '0x32A8EC048252e5e01c10ce34b68dd2c09d93c7f5fc7870d17108f5d09615d4B1';

  it('creates correct id', () => {
    const logIndex = '11';
    const id1 = LogRowId.create(transactionHash, logIndex);
    const id2 = LogRowId.create(transactionHash.toUpperCase(), logIndex);
    const id3 = LogRowId.create(transactionHash.toLowerCase(), logIndex);

    const expectedId = '0xcd78e3e5816fbc14986c7828f939cc153c5aab90eeb8cb6e23572dce11dd6c4d';
    expect(id1).toEqual(expectedId);
    expect(id2).toEqual(expectedId);
    expect(id3).toEqual(expectedId);
  });

  it('logs with different logIndex have different id', () => {
    expect(LogRowId.create(transactionHash, '1')).not.toBe(LogRowId.create(transactionHash, '2'));
  });
});
