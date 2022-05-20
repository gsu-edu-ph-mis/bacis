//// Core modules

//// External modules
const session = require('express-session'); // Session engine
const MemoryStore = require('memorystore')(session)

// Use the session middleware
// See options in https://github.com/expressjs/session
module.exports = session({
    name: CONFIG.session.name,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: CRED.session.secret,
    cookie: CONFIG.session.cookie,
    resave: false,
    saveUninitialized: false
});