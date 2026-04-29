/*
* Model for user accounts. References account table
*/
const Sequelize = require ('sequelize');
const db = require('../config/database');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const Account = db.define('account', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}   ,{ 
        timestamps: false, //Disables createdAt and updatedAt timestamps from being called by default.
        tableName: 'account', //Establishes table name as written by default sequelize when iniating db.define pluralizes the name: account->accounts when searching for tables.
        indexes: [
            {
                unique: true,
                fields:['email']
            }
        ],
    });

    Account.beforeCreate(async (account, options) => {
        try {
            //Hash password
            const hashedPass = await bcrypt.hash(account.password, saltRounds);
            //Update password with hashed password value.
            account.password = hashedPass;
        }catch(error){
            console.error('Error hashing password:'. error);
            throw error;
        }
    });


module.exports = Account;