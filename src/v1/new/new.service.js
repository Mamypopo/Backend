import fs from 'fs/promises';
import { main as db } from '../../database.js';
import FileManager from '../common/file-manager.js';

export default class NewService {
  async updateFile(picture, newId) {
    const splitPictureName = picture.originalname.split('.');

    const fileName = `/news/news_${newId}.${splitPictureName.at(splitPictureName.length - 1)}`;

    const fileManager = new FileManager();

    await fileManager.writeFile(fileName, picture);

    const updateSql = 'UPDATE news SET picture = ? WHERE id = ? LIMIT 1';

    await db.query(updateSql, [
      fileName,
      newId,
    ]);
  }

  async getNews() {
    const sql = `SELECT
                 news.id,
                 topic,
                 picture,
                 content,
                 created_by as createdBy,
                 created_at as createdAt,
                 updated_at as updatedAt,
                 users.profile_img as createdByProfileImg,
                 CONCAT_WS(' ', users.first_name, users.last_name) as createdByFullName
                 FROM news
                 JOIN users ON users.id = created_by
                 ORDER BY created_at DESC`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [news] = await db.query(sql);

    const mapNews = await Promise.all(news.map(async (data) => {
      const temp = { ...data };
      if (temp.picture) {
        temp.picture = await new FileManager().getFileBase64(temp.picture);
      }

      temp.createdByProfileImg = await new FileManager().getFileBase64(temp.createdByProfileImg);

      return temp;
    }));

    return mapNews;
  }

  async getNewByUserId(userId) {
    const sql = `SELECT
                 news.id,
                 topic,
                 picture,
                 content,
                 created_by as createdBy,
                 created_at as createdAt,
                 updated_at as updatedAt,
                 users.profile_img as createdByProfileImg,
                 CONCAT_WS(' ', users.first_name, users.last_name) as createdByFullName
                 FROM news
                 JOIN users ON users.id = created_by
                 WHERE created_by = ?
                 ORDER BY created_at DESC`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [news] = await db.query(sql, userId);

    const mapNews = await Promise.all(news.map(async (data) => {
      const temp = { ...data };
      if (temp.picture) {
        temp.picture = await new FileManager().getFileBase64(temp.picture);
      }

      temp.createdByProfileImg = await new FileManager().getFileBase64(temp.createdByProfileImg);

      return temp;
    }));

    return mapNews;
  }

  async getNewById(newId) {
    const sql = `SELECT
                 id,
                 topic,
                 picture,
                 content,
                 created_by as createdBy,
                 created_at as createdAt,
                 updated_at as updatedAt
                 FROM news
                 WHERE id = ?
                 ORDER BY created_at DESC`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [[newData]] = await db.query(sql, newId);

    if (newData.picture) {
      newData.picture = await new FileManager().getFileBase64(newData.picture);
    }

    return newData;
  }

  async createNew(
    newData,
    picture,
  ) {
    const sql = `INSERT INTO news SET
                 topic = ?,
                 content = ?,
                 created_by = ?`;

    /**
     * @type { [import('mysql2').ResultSetHeader, import('mysql2').FieldPacket[]]}
     */
    const [{ insertId }] = await db.query(sql, [
      newData.topic,
      newData.content,
      newData.createdBy,
    ]);

    await this.updateFile(picture, insertId);
  }

  async updateNew(newData, picture) {
    const sql = `UPDATE news SET
                 topic = ?,
                 content = ?
                 WHERE id = ?`;

    await db.query(sql, [
      newData.topic,
      newData.content,
      newData.id,
    ]);

    if (picture) {
      await this.updateFile(picture, newData.id);
    }
  }

  async deleteNew(newId) {
    const sql = 'DELETE FROM news WHERE id = ? LIMIT 1';

    await db.query(sql, newId);
  }
}
