export default class InvalidIdError extends Error {
  constructor() {
    super('Invalid id');
    this.name = 'InvalidIdError';
  }
}
