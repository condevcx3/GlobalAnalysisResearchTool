'use strict'

const Sequelize = require("sequelize")

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('funderasiaoperations', {
    funderName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    asiaOperatons: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'funderasiaoperations'
  });
};
