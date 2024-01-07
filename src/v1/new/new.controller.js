import NewService from './new.service.js';

export const getAllNewHandler = async (req, res, next) => {
  try {
    const newService = new NewService();
    const news = await newService.getNews();
    res.status(200).send({
      message: 'success',
      result: news,
      cause: '-',
    });
  } catch (error) {
    next(error);
  }
};

export const getNewByIdHandler = async (req, res, next) => {
  try {
    const newService = new NewService();
    const result = await newService.getNewById(req.body.newId);
    res.status(200).send({
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const addNewHandler = async (req, res, next) => {
  try {
    const newService = new NewService();
    if (!req.files) {
      res.status(400).send({
        message: 'error',
        cause: 'file not found',
      });
      return;
    }

    if ('picture' in req.files) {
      const { content, topic } = req.body;
      const { firstName, lastName } = req.user;

      await newService.createNew(
        {
          content,
          topic,
          createdBy: `${firstName} ${lastName}`,
        },
        req.files.picture[0],
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
};

export const updateNewHandler = async (req, res, next) => {
  const { content, topic, id } = req.body;
  const { firstName, lastName } = req.user;

  try {
    const newService = new NewService();
    await newService.updateNew(
      {
        content,
        topic,
        id,
        updatedBy: `${firstName} ${lastName}`,
      },
      'picture' in req.files ? req.files?.picture[0] : null,
    );
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNewHanlder = async (req, res, next) => {
  const { newId } = req.body;

  try {
    const newService = new NewService();
    await newService.deleteNew(newId);
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};
