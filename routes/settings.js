const express = require('express');
const router = express.Router();

// Settings page
router.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('settings', {
        title: 'Settings - Tax Assistant',
        user: req.session.user,
        settings: req.session.settings || {
            language: 'en',
            notifications: true,
            theme: 'light'
        }
    });
});

// Language settings
router.get('/language', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('settings-language', {
        title: 'Language Settings - Tax Assistant',
        user: req.session.user,
        currentLanguage: req.session.settings?.language || 'en'
    });
});

// Update language
router.post('/language', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    
    const { language } = req.body;
    req.session.settings = {
        ...req.session.settings,
        language: language
    };
    
    req.session.save((err) => {
        if (err) {
            console.error('Error saving settings:', err);
        }
        res.redirect('/settings');
    });
});

// Update general settings
router.post('/update', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    
    const { language, notifications, theme } = req.body;
    req.session.settings = {
        language: language || 'en',
        notifications: notifications === 'on',
        theme: theme || 'light'
    };
    
    req.session.save((err) => {
        if (err) {
            console.error('Error saving settings:', err);
        }
        res.redirect('/settings');
    });
});

module.exports = router;