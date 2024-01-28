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

export const getActivityByUserIdHandler = async (req, res, next) => {
  try {
    const result = await new ActivityService().getActivityByUserId(req.user.id);
    res.status(200).send({
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentActivityHandler = async (req, res, next) => {
  try {
    const result = await new ActivityService().getStudentActivity(req.user.id);
    res.status(200).send({
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentActivityDoc = async (req, res, next) => {
  try {
    const doc = await new ActivityService().getStudentActivityDoc(req.user.id);
    doc.pipe(res);
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

    await new ActivityService().createActivity({ ...req.body, createdBy: req.user.id }, req.files.picture[0]);

    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const addCommentHandler = async (req, res, next) => {
  try {
    const { activityId, userId, comment } = req.body;
    await new ActivityService().createComment(activityId, userId, comment);
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const addPaticipantHandler = async (req, res, next) => {
  try {
    await new ActivityService().createPaticipant(req.body.activityId, req.user.id);
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const updateParticipantStatusHandler = async (req, res, next) => {
  try {
    await new ActivityService().updateParticipantStatus(req.body.participantId, req.body.status, `${req.user.firstName} ${req.user.lastName}`);
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
}

export const updateActivityHandler = async (req, res, next) => {
  try {
    await new ActivityService().updateActivity(req.body, 'picture' in req.files ? req.files?.picture[0] : null);
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

export const deleteCommentHandler = async (req, res, next) => {
  const { commentId } = req.body;
  try {
    await new ActivityService().deleteComment(commentId);
    res.status(200).send({
      result: 'success',
    });
  } catch (error) {
    next(error);
  }
};
