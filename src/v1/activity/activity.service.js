import { main as db } from '../../database.js';
import FileManager from '../common/file-manager.js';

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
                 id,
                 name,
                 picture,
                 detail,
                 location,
                 hour_gain as hourGain,
                 date,
                 time,
                 created_by as createdBy,
                 created_at as createdAt,
                 updated_at as updatedAt
                 FROM activities
                 WHERE active_status = 1
                 ORDER BY created_at DESC`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [result] = await db.query(sql);

    return Promise.all(result.map(async (item) => {
      const data = { ...item };
      data.picture = await this.fileManager.getFileBase64(data.picture);
      return data;
    }));
  }

  async getActivityByUserId(userId) {
    const sql = `SELECT
                 id,
                 name,
                 picture,
                 detail,
                 location,
                 hour_gain as hourGain,
                 date,
                 time,
                 created_by as createdBy,
                 created_at as createdAt,
                 updated_at as updatedAt
                 FROM activities
                 WHERE active_status = 1 AND created_by = ?
                 ORDER BY created_at DESC`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [result] = await db.query(sql, [userId]);

    return Promise.all(result.map(async (item) => {
      const data = { ...item };
      data.picture = await this.fileManager.getFileBase64(data.picture);
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
                 WHERE activity_id = ? `;

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

    return result;
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

  async updateActivity(activity, picture) {
    const sql = `UPDATE activities SET
                 name = ?,
                 detail = ?,
                 location = ?,
                 hour_gain = ?,
                 date = ?,
                 time = ?
                 WHERE id = ?`;

    await db.query(sql, [
      activity.name,
      activity.detail,
      activity.location,
      activity.hourGain,
      new Date(activity.date).toLocaleDateString('sv-SE'),
      activity.time,
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
}
