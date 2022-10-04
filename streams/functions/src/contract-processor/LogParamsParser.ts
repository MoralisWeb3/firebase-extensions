import { BigNumber, ethers } from 'ethers';

import { AbiItem, Log } from '@moralisweb3/streams-typings';

export type LogParams = Record<string, LogParam>;

export interface LogParam {
  value: LogParamValue;
  type: string;
}

export type LogParamValue = BigNumber | string;

const coder = new ethers.utils.AbiCoder();

export class LogParamsParser {
  public static read(log: Log, abi: AbiItem): LogParams {
    const params: LogParams = {};

    if (!abi.inputs) {
      return params;
    }

    const notIndexedTypes = abi.inputs.filter((i) => !i.indexed).map((i) => i.type);
    const decodedData = coder.decode(notIndexedTypes, log.data);

    let topicIndex = 1;
    let decodedDataIndex = 0;

    for (let input of abi.inputs) {
      let value: any;

      if (input.indexed) {
        const topicValue = (log as any)['topic' + topicIndex] as string;
        topicIndex++;
        value = coder.decode([input.type], topicValue)[0];
      } else {
        value = decodedData[decodedDataIndex];
        decodedDataIndex++;
      }

      params[input.name] = {
        value,
        type: input.type,
      };
    }
    return params;
  }
}
