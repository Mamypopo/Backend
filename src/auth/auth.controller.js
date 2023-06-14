import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config.js';
import pool from '../database.js';

// eslint-disable-next-line import/prefer-default-export
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT * FROM users WHERE email=?';
    const [user] = await pool.query(sql, [email]);
    if (user.length > 0) {
      const match = await bcrypt.compare(password, user[0].password)
      if (match === true) {
        const token = jwt.sign(user[0], config.app.jwtKey, {
          expiresIn: "1h"
        })

        console.log(token)

        res.send({ token, user: user[0] })

      } else{
        res.status(401).send({
          message: 'password pid'
        })
      }


    }
    else {
      res.status(401).send({
        message: 'username password not found'
      })
    }

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
