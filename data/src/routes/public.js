//// Core modules
const url = require('url');

//// External modules
const express = require('express')
const flash = require('kisapmata')
const lodash = require('lodash')
const axios = require('axios')

//// Modules
const api = require('../api')
const passwordMan = require('../password-man')

// Router
let router = express.Router()

router.get('/login', async (req, res, next) => {
    try {
        if (lodash.get(req, 'session.authUserId')) {
            return res.redirect(`/`)
        }
        
        let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
        res.render('login.html', {
            flash: flash.get(req, 'login'),
            ip: ip,
            username: lodash.get(req, 'query.username', ''),
            password: lodash.get(req, 'query.password', ''),
        });
    } catch (err) {
        next(err);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        if(CONFIG.loginDelay > 0){
            await new Promise(resolve => setTimeout(resolve, CONFIG.loginDelay)) // Rate limit 
        }

        let post = req.body;

        let username = lodash.get(post, 'username', '');
        let password = lodash.trim(lodash.get(post, 'password', ''))
        let recaptchaToken = lodash.trim(lodash.get(post, 'recaptchaToken', ''))

        // Recaptcha
        // Enable recaptcha
        if (CONFIG.recaptchav3.enable) {
            let params = new url.URLSearchParams({
                secret: CRED.recaptchav3.secret,
                response: recaptchaToken
            });
            let response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, params.toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })

            let score = lodash.get(response, 'data.score', 0.0)
            if (score < 0.5) {
                throw new Error(`Security error.`)
            }
        }

		let result = await api.get(`${CONFIG.app.api}/users/me`, {
			auth: {
				username: username,
				password: password
			}
		})
		

        // Save user id to session
        lodash.set(req, 'session.authUserId', {
			username: username,
			password: password
		});

        // Security: Anti-CSRF token.
        let antiCsrfToken = await passwordMan.randomStringAsync(16)
        lodash.set(req, 'session.acsrf', antiCsrfToken);

        // Redirects
        return res.redirect('/');
    } catch (err) {
        flash.error(req, 'login', err.message);
        return res.redirect('/login');
    }
});

router.get('/logout', async (req, res, next) => {
    try {
        lodash.set(req, 'session.authUserId', null);
        lodash.set(req, 'session.acsrf', null);
        lodash.set(req, 'session.flash', null);
        res.clearCookie(CONFIG.session.name, CONFIG.session.cookie);

        res.redirect('/login');
    } catch (err) {
        next(err);
    }
});

module.exports = router;