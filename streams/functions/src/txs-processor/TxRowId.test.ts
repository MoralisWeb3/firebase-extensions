import { TxRowId } from './TxRowId';

describe('TxRowId', () => {
  it('returns id', () => {
    const id = TxRowId.create('0xbe0deb85f7c6a31c017d6ce442bb019614b292c5db1d389eb745beeee28e561c');
    expect(id).toEqual('0x6060cb10b82aa0d480ead4c54b39b3e7d858def1b3443d6abea7a5faebdf28dc');
  });
});
