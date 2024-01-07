import ActivityService from './activity.service.js';

export const getAllActivityHanlder = async (req, res, next) => {
  try {
    const result = await new ActivityService().getAllActivity();
    res.status(200).send({
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityByIdHandler = async (req, res, next) => {
  const { activityId } = req.body;

  try {
    const result = await new ActivityService().getActivityById(activityId);
    res.status(200).send({
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const addActivityHandler = async (req, res, next) => {
  try {
    if (!req.files) {
      res.status(400).send({
        message: 'error',
        cause: 'file not found',
      });
      return;
    }

    const { firstName, lastName } = req.user;

    await new ActivityService().createActivity({ ...req.body, createdBy: `${firstName} ${lastName}` }, req.files.picture[0]);

    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const updateActivityHandler = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.user;
    await new ActivityService().updateActivity({ ...req.body, updatedBy: `${firstName} ${lastName}` }, 'picture' in req.files ? req.files?.picture[0] : null);
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteActivityHandler = async (req, res, next) => {
  try {
    await new ActivityService().deleteActivity(req.body.activityId);
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};
