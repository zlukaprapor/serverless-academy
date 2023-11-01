const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../conectDB');

const { SECRET_KEY } = process.env;


router.get('/me', async (req, res) => {
    try {

        const accessToken = req.headers.authorization;


        if (!accessToken) {
            return res.status(401).json({ success: false, error: 'The access token is missing' });
        }

        try {
            // Декодування токена доступу і отримання ID користувача
            const decodedToken = jwt.verify(accessToken, SECRET_KEY);
            const userId = decodedToken.userId;

            // Отримання даних користувача із бази даних на основі ID користувача
            const userQuery = await db.query('SELECT id, email FROM users WHERE id = $1', [userId]);

            if (userQuery.rows.length === 0) {
                return res.status(404).json({ success: false, error: 'No user found' });
            }

            const user = userQuery.rows[0];


            res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                },
            });
        } catch (error) {
            return res.status(401).json({ success: false, error: 'Invalid access token' });
        }
    } catch (error) {
        console.error('\n' +
            'Error retrieving user data:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
