const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../conectDB');
const bcrypt = require('bcrypt');

const {SECRET_KEY} = process.env;

router.post('/auth/sign-up', async (req, res) => {
    try {
        const {email, password} = req.body;

        const userExist = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExist.rows.length > 0) {
            return res.status(409).json({success: false, error: 'A user with this email already exists'});
        }


        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        if (!hashedPassword) {
            return res.status(500).json({success: false, error: 'Password hashing error'});
        }

        const newUser = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);

        const user = newUser.rows[0];
        const accessToken = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: '1h'});
        const refreshToken = jwt.sign({id: user.id, email: user.email}, SECRET_KEY);

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({success: false, error: 'Server error'});
    }
});

module.exports = router;
