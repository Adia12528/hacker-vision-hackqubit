const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'tax-assistant-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/filing', require('./routes/filing'));
app.use('/settings', require('./routes/settings')); // Add this line

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found - Tax Assistant',
        user: req.session.user
    });
});

app.listen(PORT, () => {
    console.log(`Tax Assistant running on http://localhost:${PORT}`);
});