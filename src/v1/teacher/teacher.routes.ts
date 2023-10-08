import RouterBase from '../common/routes.base';

import validateToken, { validateRole } from '../auth/auth.middleware';

export default class TeacherRoute extends RouterBase {
  constructor() {
    super(true);
    this.setupRoute();
  }

  protected setupRoute(): void {
    this.router.get('/getAllTeacher', validateToken, validateRole(['admin']));

    this.router.post('/addTeacher', validateToken, validateRole(['admin']));
  }
}
