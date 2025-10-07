const express = require('express');
const router = express.Router();

// Mock user database
const users = [];

router.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Login - Tax Assistant',
        user: req.session.user 
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Simple authentication
    req.session.user = { email, name: email.split('@')[0] };
    res.redirect('/dashboard');
});

router.get('/register', (req, res) => {
    res.render('register', { 
        title: 'Register - Tax Assistant',
        user: req.session.user 
    });
});

router.post('/register', (req, res) => {
    const { name, email, password, pan } = req.body;
    users.push({ name, email, password, pan });
    req.session.user = { email, name };
    res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;