import { BigNumber } from 'ethers';

import { AbiItem, Log } from '@moralisweb3/streams-typings';
import { JsonFragment, Interface } from '@ethersproject/abi';

export interface ParsedLog {
  name: string;
  params: Record<string, LogParam>;
}

export interface LogParam {
  value: LogParamValue;
  type: string;
}

export type LogParamValue = BigNumber | string;

export class LogParser {
  private readonly abiInterface: Interface;

  public constructor(abiItems: AbiItem[]) {
    this.abiInterface = new Interface(abiItems as JsonFragment[]);
  }

  public read(log: Log): ParsedLog {
    const topics = Object.keys(log)
      .filter((name) => name.startsWith('topic'))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((name) => (log as any)[name] as string)
      .filter((value) => value !== null);

    const result = this.abiInterface.parseLog({
      data: log.data,
      topics,
    });

    const params: Record<string, LogParam> = {};

    for (const input of result.eventFragment.inputs) {
      params[input.name] = {
        type: input.type,
        value: result.args[input.name],
      };
    }

    return {
      name: result.name,
      params,
    };
  }
}
