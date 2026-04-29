/*
* Model for address.
*/
const Sequelize = require ('sequelize');
const db = require('../config/database');

const Address = db.define('address', {
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address_two: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    zip: {
        type: Sequelize.STRING,
        allowNull: false
    }
}   ,{ 
        timestamps: false, //Disables createdAt and updatedAt timestamps from being called by default.
        tableName: 'address'
});

module.exports = Address;