import fs from 'fs/promises';
import { main as db } from '../../database.js';

export default class InformationService {
  async updateFile(picture, informationId) {
    const splitPictureName = picture.name.split('.');

    const fileName = `information_${informationId}.${splitPictureName.at(splitPictureName.length - 1)}`;

    await fs.writeFile(`./upload/information/${fileName}`, picture.data);

    const updateSql = 'UPDATE informations SET picture = ? WHERE id = ? LIMIT 1';

    await db.query(updateSql, [
      fileName,
      informationId,
    ]);
  }

  async getInformations() {
    const sql = `SELECT
                 id,
                 name,
                 picture,
                 text,
                 created_by as createdBy,
                 updated_by as updatedBy,
                 created_at as createdAt,
                 updated_at as updatedAt
                 FROM informations`;

    const [informations] = await db.query(sql);

    const mapInformations = await Promise.all(informations.map(async (data) => {
      const temp = { ...data };
      if (temp.picture) {
        temp.picture = (await fs.readFile(`./upload/information/${data.picture}`)).toString('base64');
      }

      return temp;
    }));

    return mapInformations;
  }

  async createInformation(
    information,
    picture,
  ) {
    const sql = `INSERT INTO informations SET
                 name = ?,
                 picture = ?,
                 text = ?,
                 created_by = ?`;

    const [{ insertId }] = await db.query(sql, [
      information.name,
      information.picture,
      information.text,
      information.createdBy,
    ]);

    await this.updateFile(picture, insertId);
  }

  async updateInformation(information, picture) {
    const sql = `UPDATE informations SET
                 name = ?,
                 picture = ?,
                 text = ?,
                 created_by = ?
                 WHERE id = ?`;

    await db.query(sql, [
      information.name,
      information.picture,
      information.text,
      information.createdBy,
      information.id,
    ]);

    if (picture) {
      await this.updateFile(picture, information.id);
    }
  }

  async deleteInformation(informationId) {
    const sql = 'DELETE FROM informations WHERE id = ? LIMIT 1';

    await db.query(sql, informationId);
  }
}
