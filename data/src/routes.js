//// Core modules

//// External modules
const express = require('express');

//// Modules

// Routes
let router = express.Router();
router.use(require('./routes/public'));
router.use(require('./routes/protected'));
router.use(require('./routes/post'));
// router.use(require('./routes/attendance'));
// router.use(require('./routes/student'));
// router.use(require('./routes/room'));
// router.use(require('./routes/scanner'));
// router.use(require('./routes/auto-complete'));

// 404 Page
router.use((req, res) => {
    res.status(404)
    if (req.xhr || /^\/api\//.test(req.originalUrl)) {
        return res.send("Page not found.")
    }
    res.render('error.html', { error: "Page not found." });
});


module.exports = router;