export default class TokenExpiredError extends Error {
  constructor() {
    super('token expired');
  }
}
