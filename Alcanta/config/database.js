const Sequelize = require('sequelize');
module.exports = new Sequelize('database', 'username', 'password', {
    
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    operatorAliases: false,

    pool: {
        max: 5,
        min: 0,
        aquire: 30000,
        idle: 10000
    },
});

