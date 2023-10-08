import AuthRoute from './auth/auth.routes';
import RouterBase from './common/routes.base';
import StudentRoute from './student/student.routes';
import TeacherRoute from './teacher/teacher.routes';

export default class V1Route extends RouterBase {
  constructor() {
    super(false);
    this.setupRoute();
  }

  protected setupRoute(): void {
    this.router.use('/teachers', new TeacherRoute().getRouter());
    this.router.use('/students', new StudentRoute().getRouter());
    // this.router.use('/admins', new AdminRoute().getRouter());
    this.router.use('/auth', new AuthRoute().getRouter());
  }
}
