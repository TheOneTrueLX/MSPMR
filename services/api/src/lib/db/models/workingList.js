const { model, Schema } = require('../mongoose')

const workingListSchema = new Schema({
    selected: { type: Boolean, required: true, default: false},
    game: { type: Schema.Types.ObjectId, ref: 'GameList' }
},
{
    collection: 'working'
})

const WorkingList = model('WorkingList', workingListSchema)

module.exports = { 
    WorkingList,
    workingListSchema
}