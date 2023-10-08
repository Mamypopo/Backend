import { Router } from 'express';

export default abstract class RouterBase {
  protected router;

  constructor(mergeParams: boolean) {
    this.router = Router({ mergeParams });
  }

  protected abstract setupRoute(): void;

  public getRouter() {
    return this.router;
  }
}
