import { BigNumber } from 'ethers';

import { LogParam } from './LogParamsParser';

export class LogRowValueFormatter {
  public static format(param: LogParam): any {
    switch (param.type) {
      case 'string':
      case 'address':
        return param.value as string;
      default:
        if (BigNumber.isBigNumber(param.value)) {
          return (param.value as BigNumber).toString();
        }
        return param.value.toString();
    }
  }
}
