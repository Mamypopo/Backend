import RouterBase from '../common/routes.base';
import InformationController from './information.controller';

export default class InformationRoute extends RouterBase {
  private informationController = new InformationController();

  constructor() {
    super(true);
    this.setupRoute();
  }

  protected setupRoute(): void {
    this.router.get('/getAllInformation', this.informationController.getAllInformation.bind(this.informationController));

    this.router.post('/addInformation', this.informationController.addInformation.bind(this.informationController));
  }
}
