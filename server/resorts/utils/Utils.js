const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const CONFIG = require('../config/configuration');

module.exports = {
	constructErrorMessage(error) {
		var errMessage = '';
		if (error.message) {
			errMessage = error.message;
		}
		if (error.errors && error.errors.length > 0) {
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
		const hash = bcrypt.hashSync("12345678", salt);
		return hash;
	},
	updatePassword(pass) {
		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(pass, salt);
		return hash;
	},
	comparePassword(pw, hash) {
		let pass = bcrypt.compareSync(pw, hash)
		return pass;
	},
	mailOptions: function (mails, message, subject) {
		var userAdminEmail = CONFIG.adminEmail;
		var userAdminPassword = CONFIG.adminPassword;

		var smtpTransport = nodemailer.createTransport({
			service: 'gmail',
			host: "smtp.gmail.com",
			auth: {
				user: userAdminEmail,
				pass: userAdminPassword
			}
		});

		var maillist = mails;
		var msg = {
			from: "******",
			subject: subject,
			//text: message, 
			cc: "*******",
			html: message // html body
		}
		maillist.forEach(function (to, i, array) {
			msg.to = to;
			smtpTransport.sendMail(msg, function (err) {
				if (err) {
					console.log('Email error');
					console.log('Sending to ' + to + ' failed: ' + err);
					return;
				} else {
					console.log('Sent to ' + to);
				}
				if (i === maillist.length - 1) { msg.transport.close(); }
			});
		});
	},
	getClientURL() {
		return CONFIG.CLIENT_URL;
	},
	getDefaultRoles(userInput, Model) {
		let defaultCondn = {};
		defaultCondn['default'] = true;
		return new Promise(resolve => {
			try {
				Model.Designation.findAll({ where: defaultCondn, attributes: ['designationId', 'designationName', 'default'] }).then(function (roles) {
					resolve({ status: true, data: roles });
				});
			} catch (error) {
				resolve({ status: false, message: error });
			}
		});
	}
};
