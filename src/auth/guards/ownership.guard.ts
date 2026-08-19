import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

interface RequestWithUser {
  user?: { id: number };
  params: { id?: string };
}

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const currentUserId = request.user?.id;
    const targetId = Number(request.params.id);

    if (!currentUserId || currentUserId !== targetId) {
      throw new ForbiddenException('You do not have rights to do this action');
    }

    return true;
  }
}
