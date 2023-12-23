import InvalidPasswordError from './error/invalid-password.error.js';
import InvalidEmailError from './error/invalid-email.error.js';
import InvalidIdError from './error/invalid-id.error.js';
import AuthService from './auth.service.js';
import DuplicateUserError from '../common/error/duplicate-user.error.js';

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const {
      user,
      token,
    } = await new AuthService().authenticateByEmailAndPassword(email ?? '', password ?? '');
    res.status(200).send({
      message: 'success',
      result: {
        user,
        token,
      },
      cause: '-',
    });
  } catch (error) {
    if (error instanceof InvalidPasswordError || error instanceof InvalidEmailError) {
      res.status(401).send({
        message: 'unauthorized',
        cause: 'invalid email or password',
      });
      return;
    }

    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await new AuthService().getUserProfile(req.user.id ?? 0);

    res.status(200).send({
      message: 'success',
      result: {
        user,
      },
      cause: '-',
    });
  } catch (error) {
    if (error instanceof InvalidIdError) {
      res.status(401).send({
        message: 'unauthorized',
        cause: 'invalid id',
      });
      return;
    }
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    if (req.files) {
      const file = req.files;
      const { user, token } = await new AuthService().createUser(req.body, file['picture'][0]);
      res.status(200).send({
        status: 'success',
        result: {
          user, token,
        },
        message: '-',
        cause: '-',
      });
    }
  } catch (error) {
    if (error instanceof DuplicateUserError) {
      res.status(400).send({
        message: 'cannot register',
        cause: 'duplicate username',
      });
      return;
    }
    next(error);
  }
};
