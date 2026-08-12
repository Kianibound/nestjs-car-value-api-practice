import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// ExecutionContext is like Request but covers all types of requests methods including: http, https, gRPC, GraphQL, ...
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
