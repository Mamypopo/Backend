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
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    await new TeacherService().deleteTeacher(req.body.teacherId);
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};
