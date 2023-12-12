import fs from 'fs/promises';

export default class FileManager {
  async writeFile(fileName: string, file: Express.Multer.File) {
    await fs.writeFile(`./upload${fileName}`, file.buffer);
  }

  async getFileBase64(fileName: string) {
    const file = await fs.readFile(`./upload${fileName}`);

    return file.toString('base64');
  }
}
