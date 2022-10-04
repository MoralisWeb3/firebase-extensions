import { BigNumber } from 'ethers';
import { LogParamValue } from './LogParamsParser';
import { LogRowValueFormatter } from './LogRowValueFormatter';

describe('LogRowValueFormatter', () => {
  function test(type: string, value: LogParamValue, expectedValue: any) {
    it(`formats ${type} value to ${expectedValue}`, () => {
      expect(LogRowValueFormatter.format({ type, value })).toBe(expectedValue);
    });
  }

  test('string', 'test', 'test');
  test('address', '0x351228872bd3fd72f64596623d0f5e8e8014f801', '0x351228872bd3fd72f64596623d0f5e8e8014f801');
  test('uint256', BigNumber.from(0x100), '256');
});
