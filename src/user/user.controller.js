import bcrypt from 'bcrypt'
import pool from '../database.js'


export const getuser = async (req, res) => {
    try {
        const sql = 'SELECT * FROM users';
        const [user] = await pool.query(sql);
        console.log(user);
        res.send(user);
    }

    catch (error) {
        console.log(error)
        res.status(500).send(error);
    }

}

export const insertuser = async (req, res) => {
    try {
        const sql = 'INSERT INTO users (email, password,stunum) VALUES (?,?,?)';
        req.body.email
        const selectsql = 'SELECT * FROM users WHERE email=?'
        const [user] = await pool.query(selectsql, [req.body.email])
        if (user.length > 0) {
            res.status(400).send({
                message: 'Email ซ้ำ'
            });
        }
        else {
            const encrypt = await bcrypt.hash(req.body.password, 10)
            const [result] = await pool.query(sql, [
                req.body.email, encrypt, req.body.stunum
            ])
            res.send();
        }


    }
    catch (error) {
        console.log(error)
        res.status(500).send(error);

    }


}

export const updateuser = async (req, res) => {
    try {
        const sql = 'UPDATE users  SET email = ?   WHERE id=? limit 1';
        const [result] = await pool.query(sql, [
            req.body.email, req.body.id
        ])
        res.send();
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}


export const deleteuser = async (req, res) => {

    try {
        const sql = 'DELETE FROM users WHERE id=? ';
        const [result] = await pool.query(sql, [
            req.body.id

        ])
        if (result.affectedRows === 0) {
            res.status(400).send({
                message: 'ID not found'

            })

        }
        else {
            res.send();
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).send(error);
    }


}