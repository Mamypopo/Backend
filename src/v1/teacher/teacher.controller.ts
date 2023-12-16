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

  async updateTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = req.body;
      const service = new TeacherService();

      const file = req.files && 'picture' in req.files ? req.files.picture[0] : undefined;

      await service.updateTeacher(teacher, file);

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



