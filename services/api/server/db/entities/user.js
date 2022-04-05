const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return User.init(sequelize, DataTypes);
}

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    twitch_username: {
      type: DataTypes.STRING(65),
      allowNull: false,
      unique: "twitch_username_UNIQUE"
    },
    twitch_userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "twitch_userid_UNIQUE"
    },
    email: {
      type: DataTypes.STRING(65),
      allowNull: false,
      unique: "email_UNIQUE"
    },
    access_token: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    refresh_token: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    expires_in: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "twitch_userid_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "twitch_userid" },
        ]
      },
      {
        name: "twitch_username_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "twitch_username" },
        ]
      },
      {
        name: "email_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
  }
}
