const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return BlacklistedSubmitter.init(sequelize, DataTypes);
}

class BlacklistedSubmitter extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    channel_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'channels',
        key: 'id'
      }
    },
    submitter: {
      type: DataTypes.STRING(65),
      allowNull: true
    },
    global: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'blacklisted_submitters',
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
        name: "fk_blacklisted_submitters_channel_idx",
        using: "BTREE",
        fields: [
          { name: "channel_id" },
        ]
      },
    ]
  });
  }
}
