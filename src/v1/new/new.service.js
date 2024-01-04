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
                 id,
                 topic,
                 picture,
                 content,
                 created_by as createdBy,
                 updated_by as updatedBy,
                 created_at as createdAt,
                 updated_at as updatedAt
                 FROM news
                 ORDER BY created_at DESC`;

    /**
     * @type { [import('mysql2').RowDataPacket[], import('mysql2').FieldPacket[]]}
     */
    const [news] = await db.query(sql);

    const mapNews = await Promise.all(news.map(async (data) => {
      const temp = { ...data };
      if (temp.picture) {
        temp.picture = (await fs.readFile(`./upload/news/${data.picture}`)).toString('base64');
      }

      return temp;
    }));

    return mapNews;
  }

  async createNew(
    newData,
    picture,
  ) {
    const sql = `INSERT INTO news SET
                 topic = ?,
                 picture = ?,
                 content = ?,
                 created_by = ?`;

    /**
     * @type { [import('mysql2').ResultSetHeader, import('mysql2').FieldPacket[]]}
     */
    const [{ insertId }] = await db.query(sql, [
      newData.topic,
      newData.picture,
      newData.content,
      newData.createdBy,
    ]);

    await this.updateFile(picture, insertId);
  }

  async updateNew(newData, picture) {
    const sql = `UPDATE news SET
                 topic = ?,
                 content = ?,
                 updated_by = ?
                 WHERE id = ?`;

    await db.query(sql, [
      newData.topic,
      newData.content,
      newData.updatedBy,
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
