const { model, Schema } = require('../mongoose')

const platformSchema = new Schema({
    name: { type: String, required: true },
    abbreviation: { type: String, default: undefined },
    igdb_id: { type: Number, required: false, default: undefined },
    active: { type: Boolean, required: true, default: false }
},
{
    collection: 'platforms'
})

const Platform = model('Platform', platformSchema)

module.exports = { 
    Platform,
    platformSchema
}
