import { NextFunction, Request, Response } from 'express';
import TeacherService from './teacher.service';

export default class TeacherController {
  async getAllTecher(req: Request, res: Response, next: NextFunction) {
    try {
      const teacherService = new TeacherService();
      const teachers = await teacherService.getAllTeacher();
      res.status(200).send({
        result: teachers,
      });
    } catch (error) {
      next(error);
    }
  }
}
