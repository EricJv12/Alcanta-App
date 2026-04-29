/*
* Associations.js
*/

const Device = require('./Device');
const Address = require('./Address');
const Measurement = require ('./Measurement');
const Alarm = require ('./Alarm');


Device.belongsTo(Address,{foreignKey: 'address_id'});
Address.hasMany(Device, {foreignKey: 'address_id'});

Measurement.belongsTo(Device,{foreignKey: 'device_id'});
Device.hasMany(Measurement,{foreignKey: 'device_id'});

Alarm.belongsTo(Measurement,{foreignKey: 'measurement_id'});
Measurement.hasMany(Alarm,{foreignKey: 'measurement_id'});

module.exports = {Device, Address, Measurement, Alarm};