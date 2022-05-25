//// Core modules

//// External modules
const express = require('express')
const flash = require('kisapmata')
const lodash = require('lodash')
const moment = require('moment')

//// Modules
const middlewares = require('../middlewares');
const api = require('../api');

// Router
let router = express.Router()

router.use('/post', middlewares.requireAuthUser)

router.get('/post/all', async (req, res, next) => {
    try {
        let {username, password} = res.user

        let posts = await api.get(`${CONFIG.app.api}/posts?categories=${CONFIG.bac.catId}`, {
			auth: {
				username: username,
				password: password
			}
		})
		let promises = []
		posts.forEach((post)=>{
			promises.push(api.get(`${CONFIG.app.api}/categories?include=${post.categories.filter(c=> c != CONFIG.bac.catId).join(',')}`))
		})
		let results = await Promise.all(promises)
		posts = posts.map((post, i)=>{
			post.categories = results[i] // Array of cat (all props)
			results[i] = results[i].map((r)=>{
				return r.name
			})
			post.categories2 = results[i] // Array of cat names
			post.isDeletable = moment.utc().diff(moment.utc(post.date), CONFIG.deleteWindow.unit) <= CONFIG.deleteWindow.value
			return post
		})
        
		let data = {
			flash: flash.get(req, 'post'),
			posts: posts
		}
		// return res.send(data)
        res.render('post/all.html', data)
    } catch (err) {
        next(err);
    }
});

router.get('/post/create', async (req, res, next) => {
    try {
		let {username, password} = res.user
		let categories = await api.get(`${CONFIG.app.api}/categories?parent=${CONFIG.bac.catId}`, {
			auth: {
				username: username,
				password: password
			}
		})
		
        let data = {
			categories: categories,
			now: moment()
		}
        res.render('post/create.html', data)
    } catch (err) {
        next(err)
    }
});
router.post('/post/create', async (req, res, next) => {
    try {
		let {username, password} = res.user
		
		let categories = [CONFIG.bac.catId]
		let category = lodash.get(req, 'body.category')
		if(category){
			if(!Array.isArray(category)){
				category = [category]
			}
		} else {
			category = []
		}

		categories = categories.concat(...category)

        let body = {
			status: 'publish',
			title: lodash.get(req, 'body.title'),
			content: `<iframe src="${lodash.get(req, 'body.link')}" width="100%" height="480" allow="autoplay"></iframe>`,
			categories: `${CONFIG.bac.catId},${categories}`,
			date: moment(lodash.get(req, 'body.date')).hour(moment().hours()).minutes(moment().minutes()).toDate(),
		}
		//return res.send(body)
        let post = await api.post(`${CONFIG.app.api}/posts`, body, {
			auth: {
				username: username,
				password: password
			}
		})
        flash.ok(req, 'post', `Published ${post.title.raw}.`)
        res.redirect(`/post/all`)
    } catch (err) {
        next(err);
    }
});

router.get('/post/delete/:postId', async (req, res, next) => {
    try {
		let {username, password} = res.user
		
		let postId = lodash.get(req, 'params.postId')
		if(!postId){
			throw new Error('Missing post id.')
		}
		
        let post = await api.delete(`${CONFIG.app.api}/posts/${postId}?force=1`, {
			auth: {
				username: username,
				password: password
			}
		})
        flash.ok(req, 'post', `Deleted post titled "${post.previous.title.raw}".`)
        res.redirect(`/post/all`)
    } catch (err) {
        next(err);
    }
});



module.exports = router;