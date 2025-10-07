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
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, JPG, and PNG files are allowed'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Quick File Start
router.get('/quick-start', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('filing/quick-start', {
        title: 'Quick File - Tax Assistant',
        user: req.session.user
    });
});

// Tax Planner
router.get('/planner', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('features/planner', {
        title: 'Tax Planner - Tax Assistant',
        user: req.session.user
    });
});

// Document Vault
router.get('/documents', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('features/documents', {
        title: 'Document Vault - Tax Assistant',
        user: req.session.user,
        documents: req.session.documents || []
    });
});

router.get('/documents/upload', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('features/upload-documents', {
        title: 'Upload Documents - Tax Assistant',
        user: req.session.user
    });
});

router.post('/documents/upload', upload.array('documents', 10), (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    
    const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: `/uploads/${file.filename}`,
        uploadedAt: new Date().toISOString(),
        type: getDocumentType(file.originalname)
    }));
    
    // Initialize documents array if it doesn't exist
    if (!req.session.documents) {
        req.session.documents = [];
    }
    
    // Add new documents to session
    req.session.documents = [...req.session.documents, ...uploadedFiles];
    
    res.redirect('/documents');
});

// Refund Tracker
router.get('/refunds', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('features/refunds', {
        title: 'Refund Tracker - Tax Assistant',
        user: req.session.user,
        refunds: req.session.refunds || getSampleRefunds()
    });
});

router.get('/refunds/history', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('features/refund-history', {
        title: 'Refund History - Tax Assistant',
        user: req.session.user,
        refundHistory: getRefundHistory()
    });
});

// Tax Calendar
router.get('/calendar', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('features/calendar', {
        title: 'Tax Calendar - Tax Assistant',
        user: req.session.user,
        deadlines: getTaxDeadlines()
    });
});

// Support Center
router.get('/support', (req, res) => {
    res.render('features/support', {
        title: 'Support Center - Tax Assistant',
        user: req.session.user
    });
});

// Security Page
router.get('/security', (req, res) => {
    res.render('features/security', {
        title: 'Security - Tax Assistant',
        user: req.session.user
    });
});

// Privacy Page
router.get('/privacy', (req, res) => {
    res.render('features/privacy', {
        title: 'Privacy Policy - Tax Assistant',
        user: req.session.user
    });
});

// Contact Page
router.get('/contact', (req, res) => {
    res.render('features/contact', {
        title: 'Contact Us - Tax Assistant',
        user: req.session.user
    });
});

// Calculator
router.get('/calculator', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.render('features/calculator', {
        title: 'Tax Calculator - Tax Assistant',
        user: req.session.user
    });
});

// Helper functions
function getDocumentType(filename) {
    const lower = filename.toLowerCase();
    if (lower.includes('form16') || lower.includes('form-16')) return 'Form-16';
    if (lower.includes('salary') || lower.includes('payslip')) return 'Salary Slip';
    if (lower.includes('investment') || lower.includes('80c')) return 'Investment Proof';
    if (lower.includes('rent') || lower.includes('hra')) return 'Rent Receipt';
    if (lower.includes('insurance') || lower.includes('80d')) return 'Insurance Proof';
    return 'Other';
}

function getSampleRefunds() {
    return [
        {
            assessmentYear: '2023-24',
            status: 'Processed',
            amount: 8250,
            filedDate: '2023-07-28',
            processedDate: '2023-09-15',
            estimatedCredit: '2023-09-20'
        },
        {
            assessmentYear: '2022-23',
            status: 'Completed',
            amount: 7170,
            filedDate: '2022-07-15',
            processedDate: '2022-09-10',
            creditedDate: '2022-09-15'
        }
    ];
}

function getRefundHistory() {
    return [
        { year: '2023-24', amount: 8250, status: 'Credited', date: '2023-09-20' },
        { year: '2022-23', amount: 7170, status: 'Credited', date: '2022-09-15' },
        { year: '2021-22', amount: 5250, status: 'Credited', date: '2021-09-18' },
        { year: '2020-21', amount: 3200, status: 'Credited', date: '2020-09-12' }
    ];
}

function getTaxDeadlines() {
    const currentYear = new Date().getFullYear();
    return [
        { title: 'Advance Tax Installment 1', date: `${currentYear}-06-15`, passed: true },
        { title: 'Advance Tax Installment 2', date: `${currentYear}-09-15`, passed: true },
        { title: 'Advance Tax Installment 3', date: `${currentYear}-12-15`, passed: false },
        { title: 'Financial Year End', date: `${currentYear}-03-31`, passed: false },
        { title: 'ITR Filing Deadline', date: `${currentYear}-07-31`, passed: false },
        { title: 'Revised ITR Deadline', date: `${currentYear}-12-31`, passed: false }
    ];
}

module.exports = router;