const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Welcome to the authentication API');
});

app.use(express.json());

const authSignInRoutes = require('./controllers/authSignIn');
const authSignUpRoutes = require('./controllers/authSignUp');
const authMyRoutes = require('./controllers/authMy');
app.use(authSignInRoutes);
app.use(authSignUpRoutes);
app.use(authMyRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});