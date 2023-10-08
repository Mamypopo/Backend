import RouterBase from '../common/routes.base';

export default class StudentRoute extends RouterBase {
  constructor() {
    super(true);
    this.setupRoute();
  }

  protected setupRoute(): void {
    this.router.get('/getAllStudents');
    this.router.post('/addStudent');
    this.router.post('/updateStudent');
    this.router.post('/deleteStudent');
  }
}
