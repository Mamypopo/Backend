export default interface User {
  id: number,
  email: string,
  password?: string,
  firstName: string,
  lastName: string,
  role: string,
  faculty: string | null,
  branch: string | null,
  phone: string | null,
  lineId: string | null,
  facebookName: string | null,
  picture: string | null
}

export type NewUser = Omit<User, 'id'>;
