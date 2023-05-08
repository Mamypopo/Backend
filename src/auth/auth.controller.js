import jwt from 'jsonwebtoken';
import config from '../config.js';

// eslint-disable-next-line import/prefer-default-export
export const login = (req, res) => {
  console.log('eiei');
  const { username, password } = req.body;

  try {
    const user = {
      username: 'eiei',
      password: '123456',
    };

    if (username === user.username && password === user.password) {
      const token = jwt.sign({
        name: 'Man',
        role: 'student',
      }, config.app.jwtKey);

      res.status(200).send({
        token,
        user: {
          name: 'Man',
          role: 'student',
        },
      });
      return;
    }

    res.status(400).send({
      message: 'username password ผิด',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getProfile = (req, res) => {
  res.status(200).send({
    user: res.locals.user,
  });
};
