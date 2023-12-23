import TeacherService from './teacher.service.js';

export const getAllTecher = async (req, res, next) => {
  try {
    const teacherService = new TeacherService();
    const teachers = await teacherService.getAllTeacher();
    res.status(200).send({
      result: teachers,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
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
};
