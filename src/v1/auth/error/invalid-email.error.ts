export default class InvalidEmailError extends Error {
  constructor() {
    super('Invalid email');
    this.name = 'InvalidPasswordError';
  }
}
