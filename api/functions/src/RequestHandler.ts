import Moralis from 'moralis';
import { NullableOperationResolver, OperationResolver, PaginatedOperationResolver } from '@moralisweb3/api-utils';
import { determineOperationType, OperationType, PaginatedOperation, PaginatedRequest } from '@moralisweb3/common-core';
import { UnknownOperation } from './RequestHandlerResolver';

export class RequestHandler {
  public constructor(private readonly operation: UnknownOperation, private readonly baseUrl: string) {}

  public async handle(request: unknown): Promise<unknown> {
    switch (determineOperationType(this.operation)) {
      case OperationType.NON_NULLABLE: {
        const resolver = new OperationResolver(this.operation, this.baseUrl, Moralis.Core);
        const response = await resolver.fetch(request);
        return response.raw;
      }

      case OperationType.NULLABLE: {
        const resolver = new NullableOperationResolver(this.operation, this.baseUrl, Moralis.Core);
        const response = await resolver.fetch(request);
        return response ? response.raw : null;
      }

      case OperationType.PAGINATED: {
        const resolver = new PaginatedOperationResolver(
          this.operation as PaginatedOperation<PaginatedRequest, unknown, unknown, unknown>,
          this.baseUrl,
          Moralis.Core,
        );
        const response = await resolver.fetch(request as PaginatedRequest);
        return response.raw;
      }

      default:
        throw new Error('Not supported operation type');
    }
  }
}
