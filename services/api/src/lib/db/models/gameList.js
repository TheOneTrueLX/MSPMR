const { model, Schema } = require('../mongoose')

const gameListSchema = new Schema({
    name: { type: String, required: true },
    platform: { type: Schema.Types.ObjectId, ref: 'Platform' },
    submitter: { type: String, required: true },
    notes: { type: String, required: false },
    exclude_from_working_list: { type: Boolean, required: true, default: false },
    igdb_id: { type: Number, required: false, default: undefined },
    igdb_cover_id: { type: String, required: false, default: undefined},
    selection_count: { type: Number, required: true, default: 0 },
    weight: { type: Number, required: true, default: 50 },
    smashed: { type: Boolean, required: true, default: false }
},
{
    collection: 'games'
});

const GameList = model('GameList', gameListSchema);

module.exports = {
    GameList,
    gameListSchema
}