const { logger } = require('../lib/logger.js')
const { Submission } = require('../lib/db/models/submission.js')

async function getSubmissions() {
    try {
        const submissions = await Submission.find()
        return submissions
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Unable to get submissions', { cause: err })
    }
}

async function addSubmission(submitter, submission_text) {
    try {
        const submission = new Submission({
            submitter: submitter,
            submission_text: submission_text
        })
        await submission.save()
        return submission
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Unable to add submission', { cause: err })
    }
}

async function deleteSubmission(id) {
    try {
        const submission = await Submission.findOneAndDelete({ _id: id })
        return submission
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Unable to delete submission', { cause: err })
    }
}

module.exports = {
    getSubmissions,
    addSubmission,
    deleteSubmission
}