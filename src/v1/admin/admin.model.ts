import UserBase from '../common/user/user.base';

export interface AdminModel extends UserBase {
  firstName: string,
  faculty: string,
  branch: string,
  lineId: string,
  picture: string,
  facebookName: string
}
