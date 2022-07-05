const { model, Schema } = require('../mongoose')

const submissionSchema = new Schema({
    submitter: { type: String },
    submission_text: { type: String }
},
{
    collection: 'submissions'
})

const Submission = model('Submission', submissionSchema)

module.exports = {
    Submission,
    submissionSchema,
}
