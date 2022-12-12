//// Core modules

//// External modules
const { Sequelize } = require('sequelize')
const moment = require('moment')

module.exports = {
    connect: async () => {
        try {

            const sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: CONFIG.sqlite.db,
                logging: false,
            });

            await sequelize.authenticate()
            console.log(`${moment().format('YYYY-MMM-DD hh:mm:ss A')}: Database connected.`);

            return sequelize
        } catch (error) {
            console.log('Connection error:', error.message)
        }
    }
}