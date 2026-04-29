/*
* Model for user alarm. References alarm table
*/
const Sequelize = require ('sequelize');
const db = require('../config/database');

const Alarm = db.define('alarm', {
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
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'unresolved',
        validate:{
            isIn:{
                args:[['resolved', 'in progress', 'unresolved']],
                msg: "The status must be one of the following values: resolved, in progress or unresolved"
            }
        }
    },   
    measurement_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'measurement',
            key: 'id'
        }
    }
}   ,{ 
        timestamps: false, //Disables createdAt and updatedAt timestamps from being called by default.
        tableName: 'alarm',
        hooks:{
            beforeCreate: (alarm, options) => {
                const time = new Date();
                const formatTime = time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                });
                alarm.time = formatTime;
            }
        }
});



module.exports = Alarm;