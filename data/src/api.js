/**
 * 
 */

//// Core modules

//// External modules
const axios = require('axios');
const lodash = require('lodash');

//// Modules


module.exports = {
    
	get: async (endPoint, options) => {
		try {
			let {data} = await axios.get(endPoint, options)
			return data
		} catch(err){
			if(err.isAxiosError){
				err = lodash.pickBy(err, (_, propName) => {
					return ['response'].includes(propName)
				})
				err.response = lodash.pickBy(err.response, (_, propName) => {
					return ['status', 'statusText', 'data'].includes(propName)
				})
				throw new Error(err.response.data.message.replace(/(<([^>]+)>)/ig, ''))
			}
			throw err
		}
	},
	post: async (endPoint, post, options) => {
		try {
			let {data} = await axios.post(endPoint, post, options)
			return data
		} catch(err){
			if(err.isAxiosError){
				err = lodash.pickBy(err, (_, propName) => {
					return ['response'].includes(propName)
				})
				err.response = lodash.pickBy(err.response, (_, propName) => {
					return ['status', 'statusText', 'data'].includes(propName)
				})
				throw new Error(err.response.data.message.replace(/(<([^>]+)>)/ig, ''))
			}
			throw err
		}
	},
	delete: async (endPoint, options) => {
		try {
			let {data} = await axios.delete(endPoint, options)
			return data
		} catch(err){
			if(err.isAxiosError){
				err = lodash.pickBy(err, (_, propName) => {
					return ['response'].includes(propName)
				})
				err.response = lodash.pickBy(err.response, (_, propName) => {
					return ['status', 'statusText', 'data'].includes(propName)
				})
				throw new Error(err.response.data.message.replace(/(<([^>]+)>)/ig, ''))
			}
			throw err
		}
	},
}