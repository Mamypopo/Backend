import { Request, Response, NextFunction } from 'express';
import InformationService from './information.service';

export default class InformationController {
  private informationService = new InformationService();

  async getAllInformation(req: Request, res: Response, next: NextFunction) {
    try {
      const informations = await this.informationService.getInformations();
      res.status(200).send({
        message: 'success',
        result: informations,
        cause: '-',
      });
    } catch (error) {
      next(error);
    }
  }

  async addInformation(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).send({
          message: 'error',
          cause: 'file not found',
        });
        return;
      }
      const { file } = req;
      const { name, text } = req.body as { name: string, text: string };
      const { firstName, lastName } = req.user ?? {};

      await this.informationService.createInformation(
        {
          name,
          text,
          createdBy: `${firstName} ${lastName}`,
        },
        {
          name: file.originalname,
          data: file.buffer,
        },
      );
      res.status(200).send({
        message: 'success',
        result: null,
        cause: '-',
      });
    } catch (error) {
      next(error);
    }
  }
}
