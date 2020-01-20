
module.exports = {

    getExistsResult: function (response, callback) {
        callback.status(200).send({ "isSuccess": false, error: response + ' Already Exists' });
    },
    getSuccessResult: function (response, callback) {
        let jsonMsg = (response && response.message) ? { "isSuccess": true, data: response, message: response.message } : { "isSuccess": true, data: response };
        callback.status(200).send(jsonMsg);
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