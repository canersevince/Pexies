import {Injectable} from '@nestjs/common';
import {DbService} from "../db/db.service";

const DotEnv = require('dotenv')
const RandomWord = require('random-words')
const fs = require('fs')

DotEnv.config()
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const bucketName = process.env.BUCKET_NAME


@Injectable()
export class AwsService {
    constructor(private DbService: DbService) {
    }

    async uploadAvatar(file, og, user, oldAvatar) {
        const ogName = og.split('.')
        let RandomWords = RandomWord(3);
        let RandomWords2 = RandomWord(3);
        let RandomNumber = Math.floor(Math.random() * 100050)
        let base64data = new Buffer(file.buffer, 'binary');
        const RandomFileName = RandomWords.join('') + RandomNumber + RandomWords2.join('')
        const params = {
            Bucket: bucketName + '/public', // pass your bucket name,
            Key: RandomFileName + '.' + ogName[ogName.length - 1],
            Body: base64data
        };
        let self = this;
        let response = await s3.upload(params).promise()
        if(response && response.Location){
            const saved = await self.DbService.updateAvatar(user, response.Location)
            if (saved) {
                const deleteParams = {
                    Bucket: bucketName + '/public', // pass your bucket name,
                    Key: oldAvatar,
                };
                await s3.deleteObject(deleteParams, function (errrs, data) {
                    if (errrs) {
                        console.log(errrs, errrs.stack);
                        return {
                            error: "Error while deleting old avatar."
                        }
                    } else {
                        return {message: 'success'}
                        console.log('File Deleted', oldAvatar);
                    }                 // deleted
                });
            } else {
                return {error: "Error while updating profile picture ", code: "500"}
            }
            return response
        }
        return {error: "Internal Error."}
    }
    async uploadCover(file, og, user, oldCover) {
        const ogName = og.split('.')
        let RandomWords = RandomWord(3);
        let RandomWords2 = RandomWord(3);
        let RandomNumber = Math.floor(Math.random() * 100050)
        let base64data = new Buffer(file.buffer, 'binary');
        const RandomFileName = RandomWords.join('') + RandomNumber + RandomWords2.join('')
        const params = {
            Bucket: bucketName + '/public', // pass your bucket name,
            Key: RandomFileName + '.' + ogName[ogName.length - 1],
            Body: base64data
        };
        let self = this;
        let response = await s3.upload(params).promise()
        if(response && response.Location){
            const saved = await self.DbService.updateCover(user, response.Location)
            if (saved) {
                const deleteParams = {
                    Bucket: bucketName + '/public', // pass your bucket name,
                    Key: oldCover,
                };
                await s3.deleteObject(deleteParams, function (errrs, data) {
                    if (errrs) {
                        console.log(errrs, errrs.stack);
                        return {
                            error: "Error while deleting old avatar."
                        }
                    } else {
                        return {message: 'success'}
                        console.log('File Deleted', oldCover);
                    }                 // deleted
                });
            } else {
                return {error: "Error while updating cover image ", code: "500"}
            }
            return response
        }
        return {error: "Internal Error."}
    }

}
