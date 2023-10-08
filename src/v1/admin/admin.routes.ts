import RouterBase from '../common/routes.base';
import AdminAuthController from './auth/auth.controller';
import AdminAuthRoute from './auth/auth.routes';
import AdminInformationRoute from './information/information.routes';

export default class AdminRoute extends RouterBase {
  constructor() {
    super(true);
    this.setupRoute();
  }

  protected setupRoute(): void {
    this.router.use('/auth', new AdminAuthRoute(new AdminAuthController()).getRouter());

    this.router.use('/informations', new AdminInformationRoute().getRouter());
  }
}
