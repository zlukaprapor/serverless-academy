const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../conectDB');
const bcrypt = require('bcrypt');

const {SECRET_KEY} = process.env;

router.post('/auth/sign-in', async (req, res) => {
    try {
        const {email, password} = req.body;


        const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [email]);


        const user = userQuery.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(404).json({success: true, error: 'Invalid password'});
        }

        const accessToken = jwt.sign({userId: user.id, email: user.email}, SECRET_KEY, {expiresIn: '1h'});
        const refreshToken = jwt.sign({userId: user.id, email: user.email}, SECRET_KEY);

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        console.error('Error during authorization:', error);
        res.status(500).json({success: false, error: 'Server error'});
    }
});

module.exports = router;