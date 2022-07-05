const { model, Schema } = require('../mongoose')

const incentiveActionSchema = new Schema({
    type: { type: String, enum: ['aspins', 'rspins', 'sspins', 'aminutes', 'rminutes', 'sminutes'], required: true },
    quantity: { type: Number, required: true },
},
{
    collection: 'incentive_triggers'
})

const IncentiveAction = model('IncentiveAction', incentiveActionSchema)

module.exports = {
    IncentiveAction,
    incentiveActionSchema
}
