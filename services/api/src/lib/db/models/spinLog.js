const { model, Schema } = require('../mongoose')

const spinLogSchema = new Schema({
    spindate: { type: Date, required: true, default: Date.now},
    // we have to jump through some extraordinary hoops to make this work
    game: {
        name: { type: String, required: true },
        platform: {
            name: { type: String, required: true },
            abbreviation: { type: String, default: undefined },
            igdb_id: { type: Number, required: false, default: undefined },
            active: { type: Boolean, required: true, default: false }        
        },
        submitter: { type: String, required: true },
        notes: { type: String, required: false },
        exclude_from_working_list: { type: Boolean, required: true, default: false },
        igdb_id: { type: Number, required: false, default: undefined },
        igdb_cover_id: { type: String, required: false, default: undefined},
        selection_count: { type: Number, required: true, default: 0 },
        weight: { type: Number, required: true, default: 50 }
    }
},
{
    collection: 'spinlog'
})

const SpinLog = model('SpinLog', spinLogSchema)

module.exports = {
    SpinLog,
    spinLogSchema
}