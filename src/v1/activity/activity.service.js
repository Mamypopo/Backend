import { main as db } from '../../database.js';
import FileManager from '../common/file-manager.js';
import generatePDF from './activity-pdf.js';

export default class ActivityService {
  fileManager = new FileManager();

  async updateFile(picture, activityId) {
    const splitPictureName = picture.originalname.split('.');

    const fileName = `/activity/activity_${activityId}.${splitPictureName.at(splitPictureName.length - 1)}`;

    await this.fileManager.writeFile(fileName, picture);

    const updateSql = 'UPDATE activities SET picture = ? WHERE id = ? LIMIT 1';

    await db.query(updateSql, [
      fileName,
      activityId,
    ]);
  }

  async getAllActivity() {
    const sql = `SELECT
    activities.id,
    name,
    picture,
    detail,
    location,
    hour_gain as hourGain,
    date,
    time,
    student_limit as studentLimit,
    created_by as createdBy,
    created_at as createdAt,
    updated_at as updatedAt,
    COUNT(activity_participants.id) as paticipantCount,
    users.profile_img as createdByProfileImg,
    CONCAT_WS(' ', users.first_name, users.last_name) as createdByFullName
    FROM activities
    LEFT JOIN activity_participants ON activities.id = activity_participants.activity_id
    JOIN users ON users.id = activities.created_by
    WHERE active_status = 1
    GROUP BY activities.id, created_at
    ORDER BY created_at DESC`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [result] = await db.query(sql);

    return Promise.all(result.map(async (item) => {
      const data = { ...item };
      data.picture = await this.fileManager.getFileBase64(data.picture);
      data.createdByProfileImg = await this.fileManager.getFileBase64(data.createdByProfileImg);
      return data;
    }));
  }

  async getActivityByUserId(userId) {
    const sql = `SELECT
                 activities.id,
                 name,
                 picture,
                 detail,
                 location,
                 hour_gain as hourGain,
                 date,
                 time,
                 student_limit as studentLimit,
                 created_by as createdBy,
                 created_at as createdAt,
                 updated_at as updatedAt,
                 users.profile_img as createdByProfileImg,
                 CONCAT_WS(' ', users.first_name, users.last_name) as createdByFullName
                 FROM activities
                 JOIN users ON users.id = created_by
                 WHERE active_status = 1 AND created_by = ?
                 ORDER BY created_at DESC`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [result] = await db.query(sql, [userId]);

    return Promise.all(result.map(async (item) => {
      const data = { ...item };
      data.picture = await this.fileManager.getFileBase64(data.picture);
      data.createdByProfileImg = await this.fileManager.getFileBase64(data.createdByProfileImg);
      return data;
    }));
  }

  async getActivityComment(activityId) {
    const sql = `SELECT activity_comments.id,
                 u.profile_img as profileImg,
                 CONCAT_WS(' ', u.first_name, u.last_name) as createdBy,
                 comment,
                 created_at as createdAt,
                 updated_at as updatedAt
                 FROM activity_comments
                 JOIN jit_asa.users u on u.id = activity_comments.user_id
                 WHERE activity_id = ?
                 ORDER BY created_at DESC`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [result] = await db.query(sql, activityId);

    return Promise.all(result.map(async (item) => {
      const data = { ...item };
      data.profileImg = await this.fileManager.getFileBase64(data.profileImg);
      return data;
    }));
  }

  async getActivityParticipant(activityId) {
    const sql = `SELECT
                 activity_participants.id as id,
                 approve_status as approveStatus,
                 users.id as userId,
                 students.student_id as studentId,
                 users.first_name as firstName,
                 users.last_name as lastName
                 FROM activity_participants
                 JOIN users ON users.id = activity_participants.student_id
                 JOIN students ON students.user_id = users.id
                 WHERE activity_id = ?`;

    const [result] = await db.query(sql, activityId);

    return result;
  }

  async getActivityById(activityId) {
    const sql = `SELECT
                 id,
                 name,
                 picture,
                 detail,
                 location,
                 hour_gain as hourGain,
                 date,
                 time,
                 student_limit as studentLimit,
                 created_by as createdBy,
                 created_at as createdAt,
                 updated_at as updatedAt
                 FROM activities
                 WHERE id = ?`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [[result]] = await db.query(sql, activityId);

    result.picture = await this.fileManager.getFileBase64(result.picture);

    result.comments = await this.getActivityComment(activityId);

    result.participants = await this.getActivityParticipant(activityId);

    return result;
  }

  async getStudentActivity(studentId) {
    const sql = `SELECT
                 date,
                 location,
                 name,
                 hour_gain as hourGain,
                 activity_participants.update_status_by as updateStatusBy,
                 activity_participants.approve_status as approveStatus
                 FROM activities
                 JOIN activity_participants ON activities.id = activity_participants.activity_id
                 JOIN users ON activity_participants.student_id = users.id
                 WHERE users.id = ?`;

    const [result] = await db.query(sql, studentId);

    return result;
  }

  async getStudentActivityDoc(studentId) {
    const sql = `SELECT
                 activities.name as activityName,
                 date,
                 time,
                 location,
                 name,
                 hour_gain as hourGain,
                 activity_participants.update_status_by as updateStatusBy
                 FROM activities
                 JOIN activity_participants ON activities.id = activity_participants.activity_id
                 JOIN users ON activity_participants.student_id = users.id
                 WHERE users.id = ? AND activity_participants.approve_status = 2`;

    const [result] = await db.query(sql, studentId);

    const doc = generatePDF(result);

    return doc;
  }

  async createActivity(
    activity,
    picture,
  ) {
    const sql = `INSERT INTO activities SET
                 name = ?,
                 detail = ?,
                 location = ?,
                 hour_gain = ?,
                 date = ?,
                 time = ?,
                 student_limit = ?,
                 created_by = ?`;

    /**
     * @type { [import('mysql2').ResultSetHeader, import('mysql2').FieldPacket[]]}
     */
    const [{ insertId }] = await db.query(sql, [
      activity.name,
      activity.detail,
      activity.location,
      activity.hourGain,
      new Date(activity.date).toLocaleDateString('sv-SE'),
      activity.time,
      activity.studentLimit,
      activity.createdBy,
    ]);

    await this.updateFile(picture, insertId);
  }

  async createComment(activityId, userId, comment) {
    const sql = `INSERT INTO activity_comments SET
                 user_id = ?,
                 activity_id = ?,
                 comment = ?`;

    await db.query(sql, [
      userId,
      activityId,
      comment,
    ]);
  }

  async createPaticipant(activityId, studentId) {
    const sql = `INSERT INTO activity_participants SET
                 activity_id = ?,
                 student_id = ?`;

    await db.query(sql, [
      activityId,
      studentId,
    ]);
  }

  async updateActivity(activity, picture) {
    const sql = `UPDATE activities SET
                 name = ?,
                 detail = ?,
                 location = ?,
                 hour_gain = ?,
                 date = ?,
                 time = ?,
                 student_limit = ?
                 WHERE id = ?`;

    await db.query(sql, [
      activity.name,
      activity.detail,
      activity.location,
      activity.hourGain,
      new Date(activity.date).toLocaleDateString('sv-SE'),
      activity.time,
      activity.studentLimit,
      activity.id,
    ]);

    if (picture) {
      await this.updateFile(picture, activity.id);
    }
  }

  async deleteActivity(activityId) {
    const sql = 'UPDATE activities SET active_status = 0 WHERE id = ? LIMIT 1';

    await db.query(sql, activityId);
  }

  async deleteComment(commentId) {
    const sql = 'DELETE FROM activity_comments WHERE id = ? LIMIT 1';

    await db.query(sql, commentId);
  }

  async updateParticipantStatus(participantId, approveStatus, teacherName) {
    const status = approveStatus === 'Approve' ? 2 : 0;

    const sql = 'UPDATE activity_participants SET approve_status = ?, update_status_by = ? WHERE id = ? LIMIT 1';

    await db.query(sql, [
      status,
      teacherName,
      participantId,
    ]);
  }
}
