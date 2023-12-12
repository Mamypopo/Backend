import { Request, Response, NextFunction } from 'express';
import InformationService from './information.service';

export default class InformationController {
  async getAllInformation(req: Request, res: Response, next: NextFunction) {
    try {
      const informationService = new InformationService();
      const informations = await informationService.getInformations();
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
      const informationService = new InformationService();
      if (!req.files) {
        res.status(400).send({
          message: 'error',
          cause: 'file not found',
        });
        return;
      }

      if ('picture' in req.files) {
        const { name, text } = req.body as { name: string, text: string };
        const { firstName, lastName } = req.user!;

        await informationService.createInformation(
          {
            name,
            text,
            createdBy: `${firstName} ${lastName}`,
          },
          {
            name: req.files.picture[0].originalname,
            data: req.files.picture[0].buffer,
          },
        );
        res.status(200).send({
          message: 'success',
          result: null,
          cause: '-',
        });
        return;
      }
      res.status(400).send({
        message: 'error',
        cause: 'invalid file key. only picture key accept',
      });
    } catch (error) {
      next(error);
    }
  }
}
