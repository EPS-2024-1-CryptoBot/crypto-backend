import { User } from './database/entities/user.entity';

export type RequestWithUser = Request & { user: User };
