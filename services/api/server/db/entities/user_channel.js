const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserChannel.init(sequelize, DataTypes);
}

class UserChannel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    channels_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'channels',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'users_channels',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "users_id" },
          { name: "channels_id" },
        ]
      },
      {
        name: "fk_users_channels_channels_idx",
        using: "BTREE",
        fields: [
          { name: "channels_id" },
        ]
      },
    ]
  });
  }
}
