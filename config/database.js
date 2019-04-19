const Sequelize = require('sequelize');

module.exports = new Sequelize('ticket-booking', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});