import StudentService from './student.service.js';

export const getAllStudent = async (req, res, next) => {
  try {
    const students = await new StudentService().getAllStudent();
    res.status(200).send({
      result: students,
    });
  } catch (error) {
    next(error);
  }
};

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

export const deleteStudent = async (req, res, next) => {
  try {
    await new StudentService().deleteStudent(req.body.studentId);
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};
