/* eslint-disable no-await-in-loop */
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import { main as db } from '../../database.js';
import DuplicateUserError from '../common/error/duplicate-user.error.js';
import FileManager from '../common/file-manager.js';

export default class StudentService {
  fileManager = new FileManager();

  async getAllStudent() {
    const sql = `SELECT
                 id,
                 email,
                 password,
                 firstName,
                 lastName,
                 studentId,
                 faculty,
                 branch,
                 phone,
                 lineId,
                 facebookName,
                 profileImg
                 FROM vuser
                 WHERE role = 'student'`;

    const [result] = await db.query(sql);

    const users = result;

    const mapUser = [];

    for (let index = 0; index < result.length; index += 1) {
      const user = users[index];
      user.profileImg = user.profileImg ? (await fs.readFile(`./upload${user.profileImg}`)).toString('base64') : '';
      mapUser.push({ ...user });
    }

    return mapUser;
  }

  async getStudentCount() {
    const sql = `SELECT 
                 COUNT(id) as count 
                 FROM users 
                 WHERE role = 'student'`;

    const [result] = await db.query(sql);

    return result;
  }

  async getUserByEmail(email) {
    const sql = `SELECT
                 id,
                 email,
                 password,
                 first_name as firstName,
                 last_name as lastName,
                 faculty,
                 branch,
                 phone,
                 line_id as lineId,
                 facebook_name as facebookName
                 FROM vuser
                 WHERE email = ?`;

    const [[teacher]] = await db.query(sql, email);

    return teacher;
  }

  async getUserById(id) {
    const sql = `SELECT
                 id,
                 email,
                 password,
                 first_name as firstName,
                 last_name as lastName,
                 faculty,
                 branch,
                 phone,
                 line_id as lineId,
                 facebook_name as facebookName
                 FROM vuser
                 WHERE id = ?`;

    const [[teacher]] = await db.query(sql, id);

    return teacher;
  }

  async createStudent(student, file) {
    let connection = null;
    try {
      const userSql = 'INSERT INTO users SET email = ?, password = ?, first_name = ?, last_name = ?, role = ?';
      const teacherSql = 'INSERT INTO students SET user_id = ?, student_id = ?, faculty = ?, branch = ?, line_id = ?, facebook_name = ?, phone = ?';

      connection = await db.getConnection();

      await connection.beginTransaction();

      const [{ insertId }] = await connection.query(userSql, [
        student.email,
        student.password,
        student.firstName,
        student.lastName,
        student.role,
      ]);

      await connection.query(teacherSql, [
        insertId,
        student.studentId,
        student.faculty,
        student.branch,
        student.lineId,
        student.facebookName,
        student.phone,
      ]);

      const fileName = `/student/${insertId}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`;

      await this.fileManager.writeFile(fileName, file);

      await connection.query('UPDATE users SET profile_img = ? WHERE id = ?', [
        fileName,
        insertId,
      ]);

      await connection.commit();
      connection.release();
      return insertId;
    } catch (error) {
      if (connection) {
        const dbError = error;
        await connection.rollback();
        connection.release();
        if (dbError.code === 'ER_DUP_ENTRY') {
          throw new DuplicateUserError();
        }
      }
      throw error;
    }
  }

  async updateFileName(studentId, fileName) {
    const sql = 'UPDATE users SET profile_img = ? WHERE id = ?';

    await db.query(sql, [
      fileName,
      studentId,
    ]);
  }

  async updateStudent(student, file) {
    const userSql = `UPDATE users SET
                     first_name = ?,
                     last_name = ?
                     WHERE id = ?`;
    const studentSql = `UPDATE students SET
                        student_id = ?,
                        faculty = ?,
                        branch = ?,
                        line_id = ?,
                        facebook_name = ?,
                        phone = ?
                        WHERE user_id = ?`;

    // upload file
    // update table users
    // update table students

    if (file) {
      const fileName = `/student/${student.id}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`;

      await this.fileManager.writeFile(fileName, file);
    }

    await db.query(userSql, [
      student.firstName,
      student.lastName,
      student.id,
    ]);

    await db.query(studentSql, [
      student.studentId,
      student.faculty,
      student.branch,
      student.lineId,
      student.facebookName,
      student.phone,
      student.id,
    ]);

    if (student?.password) {
      await this.updatePassword(student.password, student.id);
    }
  }

  async updatePassword(password, userId) {
    const sql = 'UPDATE users SET password = ? WHERE id = ? LIMIT 1';
    const encryptPass = await bcrypt.hash(password, 10);

    await db.query(sql, [
      encryptPass,
      userId,
    ]);
  }

  async deleteStudent(studentId) {
    await db.query('DELETE FROM users WHERE id = ? LIMIT 1', studentId);
  }
}
