import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';

const authHeader = 'Authorization';

export const API_KEY_GUARD_CREDENTIALS_PROVIDER = Symbol(
  'API_KEY_GUARD_CREDENTIALS_PROVIDER'
);

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(API_KEY_GUARD_CREDENTIALS_PROVIDER)
    private readonly apiKeys: string[]
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const rawClientAuth = request.header(authHeader);

    if (!rawClientAuth) {
      return false;
    }

    const apiKey = rawClientAuth.replace('Bearer ', '');

    return this.apiKeys.includes(apiKey);
  }
}
