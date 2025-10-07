const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { 
    title: 'Tax Mate - Smart Income Tax Filing',
        user: req.session.user 
    });
});

router.get('/taxbot', (req, res) => {
    res.render('taxbot', { 
        title: 'TaxBot Assistant - Get Tax Help',
        user: req.session.user 
    });
});

router.get('/learn', (req, res) => {
    res.render('learn', { 
        title: 'Learn Center - Tax Education',
        user: req.session.user 
    });
});

router.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('dashboard', { 
    title: 'Dashboard - Tax Mate',
        user: req.session.user 
    });
});

module.exports = router;