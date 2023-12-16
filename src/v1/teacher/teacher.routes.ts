import RouterBase from '../common/routes.base';
import validateToken, { validateRole } from '../auth/auth.middleware';
import TeacherController from './teacher.controller';

export default class TeacherRoute extends RouterBase {
  controller = new TeacherController();
  constructor() {
    super(true);
    this.setupRoute();
  }

  protected setupRoute(): void {
    this.router.get('/getAllTeacher', validateToken, new TeacherController().getAllTecher);

    this.router.post('/addTeacher', validateToken, validateRole(['admin']));

    this.router.post('/updateTeacher', this.controller.updateTeacher);

  }
}
