import StudentService from './student.service.js';

export const updateStudent = async (req, res, next) => {
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
};
