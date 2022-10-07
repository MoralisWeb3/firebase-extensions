import { BigNumber } from 'ethers';

import { LogParam } from './LogParamsParser';
import { LogRowValue } from './LogRowBuilder';

export class LogRowValueFormatter {
  public static format(param: LogParam): LogRowValue {
    switch (param.type) {
      case 'string':
        return param.value as string;
      case 'address':
        return (param.value as string).toLowerCase();
      default:
        if (BigNumber.isBigNumber(param.value)) {
          return (param.value as BigNumber).toString();
        }
        return param.value.toString();
    }
  }
}
