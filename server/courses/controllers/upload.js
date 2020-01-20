const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const Model = require('../models');
const config = require('./../config/configuration');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.region
});
module.exports = {
    uploadDocuments(req, res) {
        let bucketName = config.AWS.videoBucket;
        const S3 = new AWS.S3({
            accessKeyId: config.AWS.accessKeyId,
            secretAccessKey: config.AWS.secretAccessKey
        });
        let keyName = req.files[0].filename;
        let filePaths = path.join(__dirname, '../');
        let pathSet = 'uploads/' + req.files[0].filename;
        let inputFilePath = filePaths + pathSet;
        let extn = keyName.split('.').pop();
        let contentType = req.files[0].mimetype;
        if (extn == 'html') contentType = "text/html";
        if (extn == 'css') contentType = "text/css";
        if (extn == 'pdf') contentType = "application/pdf";
        if (extn == 'xlsx') contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (extn == 'xls') contentType = "application/vnd.ms-excel";
        if (extn == 'doc') contentType = "application/msword";
        if (extn == 'docx') contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (extn == 'js') contentType = "application/javascript";
        if (extn == 'mp4') contentType = "video/mp4";
        if (extn == '3gp') contentType = "video/3gpp";
        if (extn == 'png' || extn == 'jpg' || extn == 'gif') contentType = "image/" + extn;

        let filePath = req.files[0].path;
        let inputLocation;
        let self = this;
        fs.readFile(filePath, async function (err, data) {
            if (err) { throw err; }
            // console.log(data);
            const S3Params = {
                Bucket: bucketName, // pass your bucket name
                Key: keyName, // file will be saved in bucketName
                // Body: JSON.stringify(req.files[0], null, 2),
                Body: data,
                ContentType: contentType,
                ACL: 'public-read' // make as public link
            };
            await module.exports.unLinkFilePath(inputFilePath);
            // console.log(contentType);
            // console.log(S3Params);
            S3.upload(S3Params,  function (s3Err, data) {
                if (s3Err) throw s3Err
                console.log(`File uploaded successfully at ${data.Location}`)
                if (data) {
                    inputLocation = data.Location;
                    let allOtherExtensions = ['png', 'jpg', 'jpeg', 'gif', 'docx', 'doc', 'pdf', 'xls', 'xlsx', 'pptx', 'ppt', 'txt'];
                    // console.log("inputFilePath");
                    // console.log(inputFilePath);
                   // await module.exports.unLinkFilePath(inputFilePath);
                    if (!allOtherExtensions.includes(extn)) {
                        // console.log(data);
                        // console.log(data.Key);
                        // console.log('data.Key');
                        var srcKey = decodeURIComponent(data.Key.replace(/\+/g, " "));
                        let video_path = data.Location;
                        let file = video_path.substring(video_path.lastIndexOf('/') + 1);
                        // let fileExt = file.substr(file.lastIndexOf('.') + 1);
                        // let fileName = file.substr(0, file.lastIndexOf('.'));
                        let params = {
                            PipelineId: config.AWS.transcode.video.pipelineId,
                            Inputs: [{
                                Key: srcKey,
                                FrameRate: 'auto',
                                Resolution: 'auto',
                                AspectRatio: 'auto',
                                Interlaced: 'auto',
                                Container: 'auto'
                            }],
                            Outputs: [{
                                Key: config.AWS.transcode.video.presets[1].suffix + '_' + file,
                                PresetId: config.AWS.transcode.video.presets[1].presetId,
                                //  ThumbnailPattern: "thumb-" + fileName + "-{count}",
                                Rotate: 'auto',
                            }],
                            OutputKeyPrefix: 'transcoded_files/',

                        };
                        //console.log(params);
                        let elastictranscoder = new AWS.ElasticTranscoder(options = {
                            region: config.AWS.region,
                            accessKeyId: config.AWS.accessKeyId,
                            secretAccessKey: config.AWS.secretAccessKey,
                            sessionToken: null,

                        });
                        let tranData = elastictranscoder.createJob(params, function (err, data) {
                            if (err) {
                                console.log("err");
                                console.log(err);
                                console.log(err, err.stack);
                            } // an error occurred
                            else {
                                //console.log("data"); console.log(data);
                                let transcodePath = 'https://outputbucket-lms.s3.ap-south-1.amazonaws.com/';
                                transcodePath += 'transcoded_files/';
                                transcodePath += data.Job.Output.Key;
                                let uploadPaths = '/uploads/' + req.files[0].filename;
                                req.files.uploadPaths = uploadPaths;
                                let filereq = req.files;
                                res.send({
                                    "isSuccess": true,
                                    data: filereq,
                                    path: uploadPaths,
                                    inputLocation: inputLocation,
                                    outputLocation: transcodePath,
                                    transcode: data
                                });
                            }
                        });
                    } else {
                        let filereq = req.files;
                        let uploadPaths = '/uploads/' + req.files[0].filename;
                        res.send({
                            "isSuccess": true,
                            data: filereq,
                            path: uploadPaths,
                            inputLocation: inputLocation,
                            outputLocation: '',
                            transcode: []
                        });
                    }
                }
            });

            // S3 File Submission 
            // let bucketName = config.AWS.videoBucket;
            // let keyName = req.files[0].filename;
            // const S3 = new AWS.S3({
            //     accessKeyId: config.AWS.accessKeyId,
            //     secretAccessKey: config.AWS.secretAccessKey
            // });
            // console.log("req.files[0]");
            // console.log(req.files[0]);
            // const S3Params = {
            //     Bucket: bucketName, // pass your bucket name
            //     Key: keyName, // file will be saved as bucketName/keyName
            //     Body: JSON.stringify(req.files[0], null, 2)
            // };
            // S3.upload(S3Params, function (s3Err, data) {
            //     if (s3Err) throw s3Err
            //     console.log(`File uploaded successfully at ${data.Location}`)
            //     // let video_path = 'http://localhost:8103/uploads/1557380769534.mp4';
            //     if (data) {
            //         console.log(data);
            //         console.log(data.Key);
            //         console.log('data.Key');
            //         var srcKey = decodeURIComponent(data.Key.replace(/\+/g, " "));
            //         console.log(srcKey);
            //         let video_path = data.Location;
            //         let file = video_path.substring(video_path.lastIndexOf('/') + 1);
            //         console.log('File Name' + file);
            //         let fileExt = file.substr(file.lastIndexOf('.') + 1);
            //         console.log('File fileExt ' + fileExt);
            //         let fileName = file.substr(0, file.lastIndexOf('.'));
            //         console.log('fileName' + fileName);
            //         let params = {
            //             PipelineId: config.AWS.transcode.video.pipelineId,
            //             Inputs: [{
            //                 Key: srcKey,
            //                 FrameRate: 'auto',
            //                 Resolution: 'auto',
            //                 AspectRatio: 'auto',
            //                 Interlaced: 'auto',
            //                 Container: 'auto'
            //             }],
            //             Outputs: [{
            //                 Key: config.AWS.transcode.video.presets[1].suffix + '_' + file,
            //                 PresetId: config.AWS.transcode.video.presets[1].presetId,
            //                 //  ThumbnailPattern: "thumb-" + fileName + "-{count}",
            //                 Rotate: 'auto'
            //             }],
            //             OutputKeyPrefix: 'transcoded_files/'
            //         };
            //         console.log(params);
            //         let elastictranscoder = new AWS.ElasticTranscoder(options = {
            //             region: config.AWS.region,
            //             accessKeyId: config.AWS.accessKeyId,
            //             secretAccessKey: config.AWS.secretAccessKey,
            //             sessionToken: null
            //         });
            //         let tranData = elastictranscoder.createJob(params, function (err, data) {
            //             if (err) {
            //                 console.log("err");
            //                 console.log(err);
            //                 console.log(err, err.stack);
            //             } // an error occurred
            //             else { console.log("data"); console.log(data); }          // successful response
            //         });
            //     }
            // });
        });
    },
    removeDocuments(req, res) {
        //console.log(__dirname);
        const filePath = path.join(__dirname, '../' + req.body.path);
        const separateFile = req.body.path.split('/');
        const fileName = (req.body.fileName) ? req.body.fileName : separateFile[1];
        let bucketName = config.AWS.videoBucket;
        const S3 = new AWS.S3({
            accessKeyId: config.AWS.accessKeyId,
            secretAccessKey: config.AWS.secretAccessKey
        });
        const params = { Bucket: bucketName, Key: fileName };
        let elastictranscoder = new AWS.ElasticTranscoder(options = {
            region: config.AWS.region,
            accessKeyId: config.AWS.accessKeyId,
            secretAccessKey: config.AWS.secretAccessKey,
            sessionToken: null,
        });
        fs.unlink(filePath, (err) => {
            if (err) {
                res.send({
                    "isSuccess": false,
                    message: err
                });
                return err;
            } else {
                S3.deleteObject(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        res.send({
                            "isSuccess": true,
                            message: 'File removed successfully'
                        });
                    }
                    else {
                        if (req.body.jobId) {
                            const params = {
                                Id: req.body.jobId
                            };
                            elastictranscoder.cancelJob(params, function (err, data) {
                                if (err) {
                                    console.log(err, err.stack)
                                    res.send({
                                        "isSuccess": true,
                                        message: 'File removed successfully'
                                    });
                                }
                                else {
                                    res.send({
                                        "isSuccess": true,
                                        message: 'File removed successfully'
                                    });
                                }
                            });
                        } else {
                            res.send({
                                "isSuccess": true,
                                message: 'File removed successfully'
                            });
                        }
                    }
                });
            }
        });
    },
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    },
    unLinkFilePath(filePath) {
        return new Promise(resolve => {
            console.log("deleted filePath");
            console.log(filePath);
            console.log("deleted filePath");
            try {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        resolve({ status: false, message: err });
                    } else {
                        resolve({ status: true });
                    }
                });
            }
            catch (error) {
                resolve({ status: false, message: error });
            }
        });
    }
}