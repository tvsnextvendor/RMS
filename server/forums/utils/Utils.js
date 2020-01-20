const _          = require('lodash');
const bcrypt     = require('bcrypt');
const fs         = require('fs');
const saltRounds = 10;
const path     = require('path');
const settings   = require('../config/configuration');
module.exports = {
    constructErrorMessage(error) {
        var errMessage = '';
        if (error.message) {
            errMessage = error.message;
        }
        if (error.errors && error.errors.length > 0){
            errMessage = error.errors.map(function (err) {
                return err.message;
            }).join(',\n');
        }
        return errMessage;
    },
    getReqValues(req) {
        return _.pickBy(_.extend(req.body, req.params, req.query), _.identity);
    },
    getAPIPort() {
        return CONFIG.API_PORT;
    },
    password(user) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(user.password, salt);
        return hash;
    },
    updatePassword(pass) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(pass, salt);
        return hash;
    },
    comparePassword(pw, hash) {
        var pass = bcrypt.compareSync(pw, hash)
        return pass;
    },
    getNotifications: function (notify){
        return new Promise(resolve => {
            try {
                const filePath = path.join(__dirname, 'notifications.json');
                fs.readFile(filePath, 'utf8', (err, res) => {
                    if (err) {
                        resolve({ status: false, message: err });
                    } else {
                        let notifyInfo = JSON.parse(res);
                        resolve({ status: true, data: notifyInfo[notify] });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    uploadFilePaths() {
        let basePath = settings.SITE_URL + ':' + 8103;
        let uploadFilePaths = {};
        uploadFilePaths['uploadPath'] = basePath + '/uploads/';
        return uploadFilePaths;
    },
};
