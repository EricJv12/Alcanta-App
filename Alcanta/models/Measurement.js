/*
* Model for measurement. References measurement table
*/
const Sequelize = require ('sequelize');
const db = require('../config/database');

const Measurement = db.define('measurement', {
    ph: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    wlevel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    wflow: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE(),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE')
    },
    time: {
        type: Sequelize.TIME(),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIME')
    },
    device_id: {
        type: Sequelize.INTEGER,
        allowNUll: false,
        references: {
            model: 'device',
            key: 'id'
        }
    }

}  ,{ 
        timestamps: false, //Disables createdAt and updatedAt timestamps from being called by default.
        tableName: 'measurement',
        hooks:{
            beforeCreate: (measurement, options) => {
                const time = new Date();
                const formatTime = time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                });
                measurement.time = formatTime;
            }
        }
});


module.exports = Measurement;