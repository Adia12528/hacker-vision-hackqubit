const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Filing steps
router.get('/start', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('filing-start', { 
    title: 'Start Filing - Tax Mate',
        user: req.session.user 
    });
});

router.get('/step1', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('filing-step1', { 
    title: 'Step 1: Profile Setup - Tax Mate',
        user: req.session.user 
    });
});

router.post('/step1', (req, res) => {
    req.session.filingData = { ...req.session.filingData, ...req.body };
    res.redirect('/filing/step2');
});

router.get('/step2', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('filing-step2', { 
    title: 'Step 2: Income Details - Tax Mate',
        user: req.session.user 
    });
});

router.post('/step2', upload.single('form16'), (req, res) => {
    if (req.file) {
        req.session.filingData.form16 = req.file.filename;
    }
    req.session.filingData = { ...req.session.filingData, ...req.body };
    res.redirect('/filing/step3');
});

// Add more steps similarly...

// Tax calculation API
router.post('/calculate', (req, res) => {
    const { income, deductions, regime } = req.body;
    
    // Simple tax calculation logic
    const tax = calculateTax(income, deductions, regime);
    
    res.json({ 
        success: true, 
        taxLiability: tax,
        recommendedRegime: tax.old > tax.new ? 'new' : 'old'
    });
});

function calculateTax(income, deductions, regime) {
    // Basic tax calculation logic (simplified)
    let taxableIncome = income - deductions;
    let tax = 0;
    
    if (regime === 'old') {
        // Old regime calculation
        if (taxableIncome > 1000000) tax = 112500 + (taxableIncome - 1000000) * 0.3;
        else if (taxableIncome > 500000) tax = 12500 + (taxableIncome - 500000) * 0.2;
        else if (taxableIncome > 250000) tax = (taxableIncome - 250000) * 0.05;
    } else {
        // New regime calculation
        if (taxableIncome > 1500000) tax = 187500 + (taxableIncome - 1500000) * 0.3;
        else if (taxableIncome > 1200000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
        else if (taxableIncome > 900000) tax = 45000 + (taxableIncome - 900000) * 0.15;
        else if (taxableIncome > 600000) tax = 15000 + (taxableIncome - 600000) * 0.1;
        else if (taxableIncome > 300000) tax = (taxableIncome - 300000) * 0.05;
    }
    
    return {
        old: regime === 'old' ? tax : calculateTax(income, 0, 'old').tax,
        new: regime === 'new' ? tax : calculateTax(income, 0, 'new').tax
    };
}

module.exports = router;
