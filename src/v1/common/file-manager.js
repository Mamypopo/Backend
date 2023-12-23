import fs from 'fs/promises';

export default class FileManager {
  async writeFile(fileName, file) {
    await fs.writeFile(`./upload${fileName}`, file.buffer);
  }

  async getFileBase64(fileName) {
    const file = await fs.readFile(`./upload${fileName}`);

    return file.toString('base64');
  }
}
