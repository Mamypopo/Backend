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
                 updated_by as updatedBy,
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

  getActivityParticipant(activityId) {
    const sql = ``
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
                 updated_by as updatedBy,
                 created_at as createdAt,
                 updated_at as updatedAt
                 FROM activities
                 WHERE id = ?`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [[result]] = await db.query(sql, activityId);

    result.picture = await this.fileManager.getFileBase64(result.picture);

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

  async updateActivity(activity, picture) {
    const sql = `UPDATE activities SET
                 name = ?,
                 detail = ?,
                 location = ?,
                 hour_gain = ?,
                 date = ?,
                 time = ?,
                 updated_by = ?`;

    await db.query(sql, [
      activity.name,
      activity.detail,
      activity.location,
      activity.hourGain,
      new Date(activity.date).toLocaleDateString('sv-SE'),
      activity.time,
      activity.updatedBy,
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
}
