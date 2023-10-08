import fs from 'fs/promises';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { main as db } from '../../database';
import { InformationModel, NewInformationModel } from './information.model';

export default class InformationService {
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

    const [informations] = await db.query<RowDataPacket[]>(sql);

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
    information: NewInformationModel,
    picture: { name: string, data: Buffer },
  ) {
    const sql = `INSERT INTO informations SET
                 name = ?,
                 picture = ?,
                 text = ?,
                 created_by = ?`;

    const [{ insertId }] = await db.query<ResultSetHeader>(sql, [
      information.name,
      information.picture,
      information.text,
      information.createdBy,
    ]);

    const splitPictureName = picture.name.split('.');

    const fileName = `information_${insertId}.${splitPictureName.at(splitPictureName.length - 1)}`;

    await fs.writeFile(`./upload/information/${fileName}`, picture.data);

    const updateSql = 'UPDATE informations SET picture = ? WHERE id = ? LIMIT 1';

    await db.query(updateSql, [
      fileName,
      insertId,
    ]);
  }

  async updateInformation(information: InformationModel, picture?: { name: string, data: Buffer }) {
    const sql = `UPDATE informations SET
                 name = ?,
                 picture = ?,
                 text = ?,
                 created_by = ?
                 WHERE id = ?`;

    await db.query<ResultSetHeader>(sql, [
      information.name,
      information.picture,
      information.text,
      information.createdBy,
      information.id,
    ]);

    if (picture) {
      const splitPictureName = picture.name.split('.');

      const fileName = `information_${information.id}.${splitPictureName.at(splitPictureName.length - 1)}`;

      await fs.writeFile(`./upload/information/${fileName}`, picture.data);

      const updateSql = 'UPDATE informations SET picture = ? WHERE id = ? LIMIT 1';

      await db.query(updateSql, [
        fileName,
        information.id,
      ]);
    }
  }

  async deleteInformation(informationId: number) {
    const sql = 'DELETE FROM informations WHERE id = ? LIMIT 1';

    await db.query<ResultSetHeader>(sql, informationId);
  }
}
