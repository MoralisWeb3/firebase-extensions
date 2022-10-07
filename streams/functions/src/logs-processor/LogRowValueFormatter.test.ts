import { BigNumber } from 'ethers';
import { LogParamValue } from './LogParser';
import { LogRowValueFormatter } from './LogRowValueFormatter';

describe('LogRowValueFormatter', () => {
  function test(type: string, value: LogParamValue, expectedValue: unknown) {
    it(`formats ${type} value to ${expectedValue}`, () => {
      expect(LogRowValueFormatter.format({ type, value })).toBe(expectedValue);
    });
  }

  test('string', 'test', 'test');
  test('address', '0x351228872BD3fd72f64596623d0f5e8e8014F801', '0x351228872bd3fd72f64596623d0f5e8e8014f801');
  test('uint256', BigNumber.from(0x100), '256');
});
