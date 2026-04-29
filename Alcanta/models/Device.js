/*
* Model for device.
*/
const Sequelize = require ('sequelize');
const db = require('../config/database');

const Device = db.define('device', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
   address_id: {
        type: Sequelize.INTEGER,
        allowNUll:false,
         references: {
            model: 'address',
            key: 'id',
        }
    }
},  { 
        timestamps: false,  
        tableName: 'device',
        indexes: [
            {
                unique: true,
                fields:['name']
            }
        ]
});


module.exports = Device;