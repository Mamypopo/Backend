import { NextFunction, Request, Response } from 'express';
import StudentService from './student.service';

export default class StudentController {
  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = req.body;
      const service = new StudentService();

      const file = req.files && 'picture' in req.files ? req.files.picture[0] : undefined;

      await service.updateStudent(student, file);

      res.status(200).send({
        message: 'success',
        result: null,
        cause: '-',
      });
    } catch (error) {
      next(error);
    }
  }
}
