import RouterBase from '../common/routes.base';

export default class NewRouter extends RouterBase {
  constructor() {
    super(false);
    this.setupRoute();
  }

  protected setupRoute(): void {
    this.router.get('/getAllActivity');

    this.router.post('/addActivity');

    this.router.post('/updateActivity');
  }
}
