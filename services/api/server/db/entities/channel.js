const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Channel.init(sequelize, DataTypes);
}

class Channel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'channels',
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
        name: "fk_channels_owner_idx",
        using: "BTREE",
        fields: [
          { name: "owner_id" },
        ]
      },
    ]
  });
  }
}
