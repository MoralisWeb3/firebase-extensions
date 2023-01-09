import { Operation } from '@moralisweb3/common-core';
import Moralis from 'moralis';
import { operations as solOperations } from '@moralisweb3/common-sol-utils';
import { operations as evmOperations } from '@moralisweb3/common-evm-utils';
import { RequestHandler } from './RequestHandler';

const modules: Module[] = [
  {
    name: 'evm-api',
    baseUrl: Moralis.EvmApi.baseUrl,
    operations: evmOperations as UnknownOperation[],
  },
  {
    name: 'sol-api',
    baseUrl: Moralis.SolApi.baseUrl,
    operations: solOperations as UnknownOperation[],
  },
];

export class RequestHandlerResolver {
  public static tryResolve(moduleName: string, operationName: string): RequestHandler | null {
    const module = modules.find((mod) => mod.name === moduleName);
    if (!module) {
      return null;
    }

    const operation = module.operations.find((op) => op.name === operationName);
    if (!operation) {
      return null;
    }

    return new RequestHandler(operation, module.baseUrl);
  }
}

export interface UnknownOperation extends Operation<unknown, unknown, unknown, unknown> {}

interface Module {
  name: string;
  baseUrl: string;
  operations: UnknownOperation[];
}
