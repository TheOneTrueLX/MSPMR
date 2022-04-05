const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Video.init(sequelize, DataTypes);
}

class Video extends Sequelize.Model {
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
    service_type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    video_url: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    copyright: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    played: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    date_added: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    date_played: {
      type: DataTypes.DATE,
      allowNull: true
    },
    blacklisted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'videos',
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
        name: "fk_videos_channel_idx",
        using: "BTREE",
        fields: [
          { name: "channel_id" },
        ]
      },
    ]
  });
  }
}
