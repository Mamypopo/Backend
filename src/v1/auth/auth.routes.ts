import RouterBase from '../common/routes.base';
import AuthController from './auth.controller';
import validateToken from './auth.middleware';

export default class AuthRoute extends RouterBase {
  private authController: AuthController;

  constructor() {
    super(true);
    this.authController = new AuthController();
    this.setupRoute();
  }

  protected setupRoute() {
    this.router.get('/profile', validateToken, this.authController.getProfile.bind(this.authController));

    this.router.post('/login', this.authController.login.bind(this.authController));
  }
}
