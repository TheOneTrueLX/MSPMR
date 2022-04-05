const DataTypes = require("sequelize").DataTypes;
const _BlacklistedSubmitter = require("./blacklisted_submitter");
const _Channel = require("./channel");
const _User = require("./user");
const _UserChannel = require("./user_channel");
const _Video = require("./video");

function initModels(sequelize) {
  const BlacklistedSubmitter = _BlacklistedSubmitter(sequelize, DataTypes);
  const Channel = _Channel(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);
  const UserChannel = _UserChannel(sequelize, DataTypes);
  const Video = _Video(sequelize, DataTypes);

  Channel.belongsToMany(User, { as: 'users_id_users', through: UserChannel, foreignKey: "channels_id", otherKey: "users_id" });
  User.belongsToMany(Channel, { as: 'channels_id_channels', through: UserChannel, foreignKey: "users_id", otherKey: "channels_id" });
  BlacklistedSubmitter.belongsTo(Channel, { as: "channel", foreignKey: "channel_id"});
  Channel.hasMany(BlacklistedSubmitter, { as: "blacklisted_submitters", foreignKey: "channel_id"});
  UserChannel.belongsTo(Channel, { as: "channel", foreignKey: "channels_id"});
  Channel.hasMany(UserChannel, { as: "users_channels", foreignKey: "channels_id"});
  Video.belongsTo(Channel, { as: "channel", foreignKey: "channel_id"});
  Channel.hasMany(Video, { as: "videos", foreignKey: "channel_id"});
  Channel.belongsTo(User, { as: "owner", foreignKey: "owner_id"});
  User.hasMany(Channel, { as: "channels", foreignKey: "owner_id"});
  UserChannel.belongsTo(User, { as: "user", foreignKey: "users_id"});
  User.hasMany(UserChannel, { as: "users_channels", foreignKey: "users_id"});

  return {
    BlacklistedSubmitter,
    Channel,
    User,
    UserChannel,
    Video,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
