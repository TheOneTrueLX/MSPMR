const { model, Schema } = require('../mongoose')

const incentiveListSchema = new Schema({
    description: { type: String, required: true },
    actions: [ { type: Schema.Types.ObjectId, ref: 'IncentiveAction'} ],
    active: { type: Boolean, required: true, default: true }
},
{
    collection: 'incentives'
})

const IncentiveList = model('IncentiveList', incentiveListSchema)

module.exports = {
    IncentiveList,
    incentiveListSchema
}
