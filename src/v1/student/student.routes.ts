import RouterBase from '../common/routes.base';
import StudentController from './student.controller';

export default class StudentRoute extends RouterBase {
  controller = new StudentController();

  constructor() {
    super(true);
    this.setupRoute();
  }

  protected setupRoute(): void {
    this.router.post('/updateStudent', this.controller.updateStudent);
  }
}
