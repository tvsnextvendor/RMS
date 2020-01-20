



module.exports = {
    getExistsResult: function (response, callback) {
        callback.status(200).send({ "isSuccess": false, error: response + ' already exists' });
    },
    getSuccessResult: function (response, msg, callback) {
        callback.status(200).send({ "isSuccess": true, data: response, message: msg });
    },
    getNotExistsResult: function (response, callback) {
        callback.status(200).send({ "isSuccess": false, message: 'No Data Found' });
    },
    getBadRequestResult: function (response, callback) {
        callback.status(400).send({ "isSuccess": false, message: 'Bad Request Found' });
    },
    getErrorResult: function (errResp, callback) {
        callback.status(400).send({ "isSuccess": false, error: errResp });
    },
    getUpdateResult: function (resp, callback) {
        callback.status(200).send({ "isSuccess": true, result: 'Updated Successfully' });
    },
    getCreatedResult: function (resp, callback) {
        callback.status(200).send({ "isSuccess": true, result: 'Created Successfully' });
    }
}