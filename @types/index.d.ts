import UserBase from '../src/v1/common/user/user.base';

declare global {
  namespace Express {
    export interface Request {
      user?: UserBase;
    }
  }
}
